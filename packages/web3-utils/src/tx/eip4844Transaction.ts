/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import { byteArrayEquals } from '@chainsafe/ssz';
import { keccak256 } from 'ethereum-cryptography/keccak';
import type { ValueOf } from '@chainsafe/ssz';
import {
	bufferToHex,
	bigIntToHex,
	bigIntToUnpaddedBuffer,
	bufferToBigInt,
	toBuffer,
} from '../bytes';
import { Address } from '../address';
import { MAX_INTEGER } from '../constants';
import { ecrecover } from '../signature';

import { BaseTransaction } from './baseTransaction';
import { LIMIT_BLOBS_PER_TX } from './constants';
import { kzg } from './kzg/kzg';
import {
	BlobNetworkTransactionWrapper,
	BlobTransactionType,
	SignedBlobTransactionType,
} from './types';
import { AccessLists, blobTxToNetworkWrapperDataFormat, checkMaxInitCodeSize } from './util';
import { computeVersionedHash } from './utils/blobHelpers';

import type {
	AccessList,
	AccessListBuffer,
	AccessListBufferItem,
	BlobEIP4844TxData,
	JsonTx,
	TxOptions,
	TxValuesArray,
} from './types';
import type { Common } from '../common';

const TRANSACTION_TYPE = 0x05;
const TRANSACTION_TYPE_BUFFER = Buffer.from(TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex');

const validateBlobTransactionNetworkWrapper = (
	versionedHashes: Uint8Array[],
	blobs: Uint8Array[],
	commitments: Uint8Array[],
	kzgProof: Uint8Array,
	version: number,
) => {
	if (!(versionedHashes.length === blobs.length && blobs.length === commitments.length)) {
		throw new Error('Number of versionedHashes, blobs, and commitments not all equal');
	}
	try {
		kzg.verifyAggregateKzgProof(blobs, commitments, kzgProof);
	} catch (e) {
		throw new Error('KZG proof cannot be verified from blobs/commitments');
	}

	for (let x = 0; x < versionedHashes.length; x += 1) {
		const computedVersionedHash = computeVersionedHash(commitments[x], version);
		if (!byteArrayEquals(computedVersionedHash, versionedHashes[x])) {
			throw new Error(`commitment for blob at index ${x} does not match versionedHash`);
		}
	}
};

/**
 * Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data
 *
 * - TransactionType: 5
 * - EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)
 */
// eslint-disable-next-line no-use-before-define
export class BlobEIP4844Transaction extends BaseTransaction<BlobEIP4844Transaction> {
	public readonly chainId: bigint;
	public readonly accessList: AccessListBuffer;
	public readonly AccessListJSON: AccessList;
	public readonly maxPriorityFeePerGas: bigint;
	public readonly maxFeePerGas: bigint;
	public readonly maxFeePerDataGas: bigint;

	public readonly common: Common;
	public versionedHashes: Buffer[];
	public blobs?: Buffer[]; // This property should only be populated when the transaction is in the "Network Wrapper" format
	public kzgCommitments?: Buffer[]; // This property should only be populated when the transaction is in the "Network Wrapper" format
	public aggregateKzgProof?: Buffer; // This property should only be populated when the transaction is in the "Network Wrapper" format

	/**
	 * This constructor takes the values, validates them, assigns them and freezes the object.
	 *
	 * It is not recommended to use this constructor directly. Instead use
	 * the static constructors or factory methods to assist in creating a Transaction object from
	 * varying data types.
	 */
	public constructor(txData: BlobEIP4844TxData, opts: TxOptions = {}) {
		super({ ...txData, type: TRANSACTION_TYPE }, opts);
		const { chainId, accessList, maxFeePerGas, maxPriorityFeePerGas, maxFeePerDataGas } =
			txData;

		this.common = this._getCommon(opts.common, chainId);
		this.chainId = this.common.chainId();

		if (!this.common.isActivatedEIP(1559)) {
			throw new Error('EIP-1559 not enabled on Common');
		}

		if (!this.common.isActivatedEIP(4844)) {
			throw new Error('EIP-4844 not enabled on Common');
		}
		this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930]);

		// Populate the access list fields
		const accessListData = AccessLists.getAccessListData(accessList ?? []);
		this.accessList = accessListData.accessList;
		this.AccessListJSON = accessListData.AccessListJSON;
		// Verify the access list format.
		AccessLists.verifyAccessList(this.accessList);

		this.maxFeePerGas = bufferToBigInt(toBuffer(maxFeePerGas === '' ? '0x' : maxFeePerGas));
		this.maxPriorityFeePerGas = bufferToBigInt(
			toBuffer(maxPriorityFeePerGas === '' ? '0x' : maxPriorityFeePerGas),
		);

		this._validateCannotExceedMaxInteger({
			maxFeePerGas: this.maxFeePerGas,
			maxPriorityFeePerGas: this.maxPriorityFeePerGas,
		});

		BaseTransaction._validateNotArray(txData);

		if (this.gasLimit * this.maxFeePerGas > MAX_INTEGER) {
			const msg = this._errorMsg(
				'gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)',
			);
			throw new Error(msg);
		}

		if (this.maxFeePerGas < this.maxPriorityFeePerGas) {
			const msg = this._errorMsg(
				'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)',
			);
			throw new Error(msg);
		}

		this.maxFeePerDataGas = bufferToBigInt(
			toBuffer((maxFeePerDataGas ?? '') === '' ? '0x' : maxFeePerDataGas),
		);

		this.versionedHashes = (txData.versionedHashes ?? []).map(vh => toBuffer(vh));
		this._validateYParity();
		this._validateHighS();

		if (this.common.isActivatedEIP(3860)) {
			checkMaxInitCodeSize(this.common, this.data.length);
		}

		for (const hash of this.versionedHashes) {
			if (hash.length !== 32) {
				const msg = this._errorMsg('versioned hash is invalid length');
				throw new Error(msg);
			}
			if (
				BigInt(hash[0]) !==
				this.common.paramByEIP('sharding', 'blobCommitmentVersionKzg', 4844)
			) {
				const msg = this._errorMsg(
					'versioned hash does not start with KZG commitment version',
				);
				throw new Error(msg);
			}
		}
		if (this.versionedHashes.length > LIMIT_BLOBS_PER_TX) {
			const msg = this._errorMsg(`tx can contain at most ${LIMIT_BLOBS_PER_TX} blobs`);
			throw new Error(msg);
		}

		this.blobs = txData.blobs?.map(blob => toBuffer(blob));
		this.kzgCommitments = txData.kzgCommitments?.map(commitment => toBuffer(commitment));
		this.aggregateKzgProof = toBuffer(txData.kzgProof);
		const freeze = opts?.freeze ?? true;
		if (freeze) {
			Object.freeze(this);
		}
	}

	public static fromTxData(txData: BlobEIP4844TxData, opts?: TxOptions) {
		return new BlobEIP4844Transaction(txData, opts);
	}

	/**
	 * Creates the minimal representation of a blob transaction from the network wrapper version.
	 * The minimal representation is used when adding transactions to an execution payload/block
	 * @param txData a {@link BlobEIP4844Transaction} containing optional blobs/kzg commitments
	 * @param opts - dictionary of {@link TxOptions}
	 * @returns the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)
	 */
	public static minimalFromNetworkWrapper(txData: BlobEIP4844Transaction, opts?: TxOptions) {
		const tx = BlobEIP4844Transaction.fromTxData(
			{
				...txData,
				...{ blobs: undefined, kzgCommitments: undefined, kzgProof: undefined },
			},
			opts,
		);
		return tx;
	}

	/**
	 * Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)
	 * @param serialized a buffer representing a serialized BlobTransactionNetworkWrapper
	 * @param opts any TxOptions defined
	 * @returns a BlobEIP4844Transaction
	 * @throws if no KZG library is loaded -- using the `initKzg` helper method -- or if `opts.common` not provided
	 */
	public static fromSerializedBlobTxNetworkWrapper(
		serialized: Buffer,
		opts?: TxOptions,
	): BlobEIP4844Transaction {
		if (!opts || !opts.common) {
			throw new Error('common instance required to validate versioned hashes');
		}
		// Validate network wrapper
		const wrapper = BlobNetworkTransactionWrapper.deserialize(serialized.subarray(1));
		const decodedTx = wrapper.tx.message;
		const version = Number(
			opts.common.paramByEIP('sharding', 'blobCommitmentVersionKzg', 4844),
		);
		validateBlobTransactionNetworkWrapper(
			decodedTx.blobVersionedHashes,
			wrapper.blobs,
			wrapper.blobKzgs,
			wrapper.kzgAggregatedProof,
			version,
		);

		const accessList: AccessListBuffer = [];
		for (const listItem of decodedTx.accessList) {
			const address = Buffer.from(listItem.address);
			const storageKeys = listItem.storageKeys.map(key => Buffer.from(key));
			const accessListItem: AccessListBufferItem = [address, storageKeys];
			accessList.push(accessListItem);
		}

		const to =
			// eslint-disable-next-line no-null/no-null
			decodedTx.to.value === null
				? undefined
				: Address.fromString(bufferToHex(Buffer.from(decodedTx.to.value)));

		const versionedHashes = decodedTx.blobVersionedHashes.map(el => Buffer.from(el));
		const commitments = wrapper.blobKzgs.map(el => Buffer.from(el));
		const blobs = wrapper.blobs.map(el => Buffer.from(el));
		const txData = {
			...decodedTx,
			...{
				versionedHashes,
				accessList,
				to,
				blobs,
				kzgCommitments: commitments,
				kzgProof: Buffer.from(wrapper.kzgAggregatedProof),
				r: wrapper.tx.signature.r,
				s: wrapper.tx.signature.s,
				v: BigInt(wrapper.tx.signature.yParity),
				gasLimit: decodedTx.gas,
				maxFeePerGas: decodedTx.maxFeePerGas,
				maxPriorityFeePerGas: decodedTx.maxPriorityFeePerGas,
			},
		} as BlobEIP4844TxData;
		return new BlobEIP4844Transaction(txData, opts);
	}

	/**
	 * Creates a transaction from the "minimal" encoding of a blob transaction (without blobs/commitments/kzg proof)
	 * @param serialized a buffer representing a serialized signed blob transaction
	 * @param opts any TxOptions defined
	 * @returns a BlobEIP4844Transaction
	 */
	public static fromSerializedTx(serialized: Buffer, opts?: TxOptions) {
		const decoded = SignedBlobTransactionType.deserialize(serialized.subarray(1));
		const tx = decoded.message;
		const accessList: AccessListBuffer = [];
		for (const listItem of tx.accessList) {
			const address = Buffer.from(listItem.address);
			const storageKeys = listItem.storageKeys.map(key => Buffer.from(key));
			const accessListItem: AccessListBufferItem = [address, storageKeys];
			accessList.push(accessListItem);
		}
		const to =
			// eslint-disable-next-line no-null/no-null
			tx.to.value === null
				? undefined
				: Address.fromString(bufferToHex(Buffer.from(tx.to.value)));
		const versionedHashes = tx.blobVersionedHashes.map(el => Buffer.from(el));
		const txData = {
			...tx,
			...{
				versionedHashes,
				to,
				accessList,
				r: decoded.signature.r,
				s: decoded.signature.s,
				v: BigInt(decoded.signature.yParity),
				gasLimit: decoded.message.gas,
			},
		} as BlobEIP4844TxData;
		return new BlobEIP4844Transaction(txData, opts);
	}

	/**
	 * The up front amount that an account must have for this transaction to be valid
	 * @param baseFee The base fee of the block (will be set to 0 if not provided)
	 */
	public getUpfrontCost(baseFee = BigInt(0)): bigint {
		const prio = this.maxPriorityFeePerGas;
		const maxBase = this.maxFeePerGas - baseFee;
		const inclusionFeePerGas = prio < maxBase ? prio : maxBase;
		const gasPrice = inclusionFeePerGas + baseFee;
		return this.gasLimit * gasPrice + this.value;
	}

	/**
	 * This method is not implemented for blob transactions as the `raw` method is used exclusively with
	 * rlp encoding and these transactions use SSZ for serialization.
	 */
	// eslint-disable-next-line class-methods-use-this
	public raw(): TxValuesArray {
		throw new Error('Method not implemented.');
	}

	public toValue(): ValueOf<typeof SignedBlobTransactionType> {
		const to = {
			selector: this.to !== undefined ? 1 : 0,
			// eslint-disable-next-line no-null/no-null
			value: this.to?.toBuffer() ?? null,
		};
		return {
			message: {
				chainId: this.common.chainId(),
				nonce: this.nonce,
				maxPriorityFeePerGas: this.maxPriorityFeePerGas,
				maxFeePerGas: this.maxFeePerGas,
				gas: this.gasLimit,
				to,
				value: this.value,
				data: this.data,
				accessList: this.accessList.map(listItem => ({
					address: listItem[0],
					storageKeys: listItem[1],
				})),
				blobVersionedHashes: this.versionedHashes,
				maxFeePerDataGas: this.maxFeePerDataGas,
			},
			// TODO: Decide how to serialize an unsigned transaction
			signature: {
				r: this.r ?? BigInt(0),
				s: this.s ?? BigInt(0),
				yParity: this.v === BigInt(1),
			},
		};
	}

	/**
	 * Serialize a blob transaction to the execution payload variant
	 * @returns the minimum (execution payload) serialization of a signed transaction
	 */
	public serialize(): Buffer {
		const sszEncodedTx = SignedBlobTransactionType.serialize(this.toValue());
		return Buffer.concat([TRANSACTION_TYPE_BUFFER, sszEncodedTx]);
	}

	/**
	 * @returns the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)
	 */
	public serializeNetworkWrapper(): Buffer {
		if (
			this.blobs === undefined ||
			this.kzgCommitments === undefined ||
			this.aggregateKzgProof === undefined
		) {
			throw new Error(
				'cannot serialize network wrapper without blobs, KZG commitments and aggregate KZG proof provided',
			);
		}
		const to = {
			selector: this.to !== undefined ? 1 : 0,
			// eslint-disable-next-line no-null/no-null
			value: this.to?.toBuffer() ?? null,
		};

		const blobArrays = this.blobs?.map(blob => Uint8Array.from(blob)) ?? [];
		const serializedTxWrapper = BlobNetworkTransactionWrapper.serialize({
			blobs: blobArrays,
			blobKzgs: this.kzgCommitments?.map(commitment => Uint8Array.from(commitment)) ?? [],
			tx: { ...blobTxToNetworkWrapperDataFormat(this), ...to },
			kzgAggregatedProof: Uint8Array.from(this.aggregateKzgProof ?? []),
		});
		return Buffer.concat([Buffer.from([0x05]), serializedTxWrapper]);
	}

	public getMessageToSign(hashMessage: false): Buffer | Buffer[];
	public getMessageToSign(hashMessage?: true | undefined): Buffer;
	public getMessageToSign(_hashMessage?: unknown): Buffer | Buffer[] {
		return this.unsignedHash();
	}

	/**
	 * Returns the hash of a blob transaction
	 */
	public unsignedHash(): Buffer {
		const serializedTx = BlobTransactionType.serialize(this.toValue().message);
		return Buffer.from(keccak256(Buffer.concat([TRANSACTION_TYPE_BUFFER, serializedTx])));
	}

	public hash(): Buffer {
		return Buffer.from(keccak256(this.serialize()));
	}

	public getMessageToVerifySignature(): Buffer {
		return this.getMessageToSign();
	}

	/**
	 * Returns the public key of the sender
	 */
	public getSenderPublicKey(): Buffer {
		if (!this.isSigned()) {
			const msg = this._errorMsg('Cannot call this method if transaction is not signed');
			throw new Error(msg);
		}

		const msgHash = this.getMessageToVerifySignature();
		const { v, r, s } = this;

		this._validateHighS();

		try {
			return ecrecover(
				msgHash,
				v! + BigInt(27), // Recover the 27 which was stripped from ecsign
				bigIntToUnpaddedBuffer(r!),
				bigIntToUnpaddedBuffer(s!),
			);
		} catch (e: any) {
			const msg = this._errorMsg('Invalid Signature');
			throw new Error(msg);
		}
	}

	public toJSON(): JsonTx {
		const accessListJSON = AccessLists.getAccessListJSON(this.accessList);
		return {
			chainId: bigIntToHex(this.chainId),
			nonce: bigIntToHex(this.nonce),
			maxPriorityFeePerGas: bigIntToHex(this.maxPriorityFeePerGas),
			maxFeePerGas: bigIntToHex(this.maxFeePerGas),
			gasLimit: bigIntToHex(this.gasLimit),
			to: this.to !== undefined ? this.to.toString() : undefined,
			value: bigIntToHex(this.value),
			data: `0x${this.data.toString('hex')}`,
			accessList: accessListJSON,
			v: this.v !== undefined ? bigIntToHex(this.v) : undefined,
			r: this.r !== undefined ? bigIntToHex(this.r) : undefined,
			s: this.s !== undefined ? bigIntToHex(this.s) : undefined,
			maxFeePerDataGas: bigIntToHex(this.maxFeePerDataGas),
			versionedHashes: this.versionedHashes.map(hash => bufferToHex(hash)),
		};
	}

	public _processSignature(v: bigint, r: Buffer, s: Buffer): BlobEIP4844Transaction {
		const opts = { ...this.txOptions, common: this.common };

		return BlobEIP4844Transaction.fromTxData(
			{
				chainId: this.chainId,
				nonce: this.nonce,
				maxPriorityFeePerGas: this.maxPriorityFeePerGas,
				maxFeePerGas: this.maxFeePerGas,
				gasLimit: this.gasLimit,
				to: this.to,
				value: this.value,
				data: this.data,
				accessList: this.accessList,
				v: v - BigInt(27), // This looks extremely hacky: /util actually adds 27 to the value, the recovery bit is either 0 or 1.
				r: bufferToBigInt(r),
				s: bufferToBigInt(s),
				maxFeePerDataGas: this.maxFeePerDataGas,
				versionedHashes: this.versionedHashes,
				blobs: this.blobs,
				kzgCommitments: this.kzgCommitments,
				kzgProof: this.aggregateKzgProof,
			},
			opts,
		);
	}
	/**
	 * Return a compact error string representation of the object
	 */
	public errorStr() {
		let errorStr = this._getSharedErrorPostfix();
		errorStr += ` maxFeePerGas=${this.maxFeePerGas} maxPriorityFeePerGas=${this.maxPriorityFeePerGas}`;
		return errorStr;
	}

	/**
	 * Internal helper function to create an annotated error message
	 *
	 * @param msg Base error message
	 * @hidden
	 */
	protected _errorMsg(msg: string) {
		return `${msg} (${this.errorStr()})`;
	}

	/**
	 * @returns the number of blobs included with this transaction
	 */
	public numBlobs() {
		return this.versionedHashes.length;
	}
}
