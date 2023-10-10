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
import { Input, RLP } from '@ethereumjs/rlp';

import { FeeMarketEIP1559TxData, ecrecover, padToEven, stripHexPrefix , txUtils } from 'web3-eth-accounts';
import type {
	AccessList,
	TxValuesArray as AllTypesTxValuesArray,
	JsonTx,
	TxOptions,
 Common } from 'web3-eth-accounts';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { hexToBytes, numberToHex, toBigInt, toHex, utf8ToBytes } from 'web3-utils';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { isHexPrefixed } from 'web3-validator';
import { secp256k1 } from "web3-eth-accounts/src/tx/constants";
import { BaseTransaction } from "web3-eth-accounts/src/tx/baseTransaction";

const { getDataFeeEIP2930, verifyAccessList, getAccessListData, getAccessListJSON } = txUtils;
const MAX_INTEGER = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
const SECP256K1_ORDER = secp256k1.CURVE.n;
const SECP256K1_ORDER_DIV_2 = SECP256K1_ORDER / BigInt(2);

const BIGINT_27 = BigInt(27);
const BIGINT_0 = BigInt(0);
const BIGINT_1 = BigInt(1);
const LIMIT_BLOBS_PER_TX = 16777216; // 2 ** 24
const FIELD_ELEMENTS_PER_BLOB = 4096;
const BYTES_PER_FIELD_ELEMENT = 32;
const USEFUL_BYTES_PER_BLOB = 32 * FIELD_ELEMENTS_PER_BLOB;
const MAX_BLOBS_PER_TX = 2;
const MAX_USEFUL_BYTES_PER_TX = USEFUL_BYTES_PER_BLOB * MAX_BLOBS_PER_TX - 1;
const BLOB_SIZE = BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB;

const validateNoLeadingZeroes = (values: { [key: string]: Uint8Array | undefined }) => {
	for (const [k, v] of Object.entries(values)) {
		if (v !== undefined && v.length > 0 && v[0] === 0) {
			throw new Error(`${k} cannot have leading zeroes, received: ${toHex(v)}`);
		}
	}
};

function get_padded(data: Uint8Array, blobs_len: number): Uint8Array {
	const pdata = new Uint8Array(blobs_len * USEFUL_BYTES_PER_BLOB).fill(0);
	pdata.set(data);
	pdata[data.byteLength] = 0x80;
	return pdata;
}

function get_blob(data: Uint8Array): Uint8Array {
	const blob = new Uint8Array(BLOB_SIZE);
	for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i++) {
		const chunk = new Uint8Array(32);
		chunk.set(data.subarray(i * 31, (i + 1) * 31), 0);
		blob.set(chunk, i * 32);
	}

	return blob;
}

const getBlobs = (input: string) => {
	const data = utf8ToBytes(input);
	const len = data.byteLength;
	if (len === 0) {
		throw Error('invalid blob data');
	}
	if (len > MAX_USEFUL_BYTES_PER_TX) {
		throw Error('blob data is too large');
	}

	const blobs_len = Math.ceil(len / USEFUL_BYTES_PER_BLOB);

	const pdata = get_padded(data, blobs_len);

	const blobs: Uint8Array[] = [];
	for (let i = 0; i < blobs_len; i++) {
		const chunk = pdata.subarray(i * USEFUL_BYTES_PER_BLOB, (i + 1) * USEFUL_BYTES_PER_BLOB);
		const blob = get_blob(chunk);
		blobs.push(blob);
	}

	return blobs;
};

interface Kzg {
	loadTrustedSetup(filePath: string): void;

	blobToKzgCommitment(blob: Uint8Array): Uint8Array;

	computeBlobKzgProof(blob: Uint8Array, commitment: Uint8Array): Uint8Array;

	verifyKzgProof(
		polynomialKzg: Uint8Array,
		z: Uint8Array,
		y: Uint8Array,
		kzgProof: Uint8Array,
	): boolean;

	verifyBlobKzgProofBatch(
		blobs: Uint8Array[],
		expectedKzgCommitments: Uint8Array[],
		kzgProofs: Uint8Array[],
	): boolean;
}

function kzgNotLoaded(): never {
	throw Error('kzg library not loaded');
}

const assertIsBytes = function (input: Uint8Array): void {
	if (!(input instanceof Uint8Array)) {
		const msg = `This method only supports Uint8Array but input was: ${input}`;
		throw new Error(msg);
	}
};
type PrefixedHexString = string;
const stripZeros = <
	T extends Uint8Array | number[] | PrefixedHexString = Uint8Array | number[] | PrefixedHexString,
>(
	a: T,
): T => {
	let first = a[0];
	while (a.length > 0 && first.toString() === '0') {
		a = a.slice(1) as T;
		first = a[0];
	}
	return a;
};
const unpadBytes = (a: Uint8Array): Uint8Array => {
	assertIsBytes(a);
	return stripZeros(a);
};
const bigIntToBytes = (num: bigint): Uint8Array => {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	return toBytes(`0x${  padToEven(num.toString(16))}`);
};
const bigIntToUnpaddedBytes = (value: bigint): Uint8Array => {
	return unpadBytes(bigIntToBytes(value));
};

// eslint-disable-next-line import/no-mutable-exports
const kzg: Kzg = {
	loadTrustedSetup: kzgNotLoaded,
	blobToKzgCommitment: kzgNotLoaded,
	computeBlobKzgProof: kzgNotLoaded,
	verifyKzgProof: kzgNotLoaded,
	verifyBlobKzgProofBatch: kzgNotLoaded,
};
/**
 * Bytes values array for a {@link BlobEIP4844Transaction}
 */
type BlobEIP4844TxValuesArray = [
	Uint8Array,
	Uint8Array,
	Uint8Array,
	Uint8Array,
	Uint8Array,
	Uint8Array,
	Uint8Array,
	Uint8Array,
	AccessListBytes,
	Uint8Array,
	Uint8Array[],
	Uint8Array?,
	Uint8Array?,
	Uint8Array?,
];
type BlobEIP4844NetworkValuesArray = [
	BlobEIP4844TxValuesArray,
	Uint8Array[],
	Uint8Array[],
	Uint8Array[],
];
/**
 * @param kzgLib a KZG implementation (defaults to c-kzg)
 * @param trustedSetupPath the full path (e.g. "/home/linux/devnet4.txt") to a kzg trusted setup text file
 */
// function initKZG(kzgLib: Kzg, trustedSetupPath: string) {
// 	kzg = kzgLib;
// 	kzg.loadTrustedSetup(trustedSetupPath);
// }
type TxValuesArray = AllTypesTxValuesArray[TransactionType.BlobEIP4844];

export function equalsBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

function toBytes(v?: BytesLike | BigIntLike): Uint8Array {
	if (v instanceof Uint8Array) {
		return v;
	}
	if (typeof v === 'string') {
		if (isHexPrefixed(v)) {
			return hexToBytes(padToEven(stripHexPrefix(v)));
		}
		return utf8ToBytes(v);
	}
	if (typeof v === 'number' || typeof v === 'bigint') {
		if (!v) {
			return Uint8Array.from([]);
		}
		return hexToBytes(numberToHex(v));
	}
	if (v === null || v === undefined) {
		return Uint8Array.from([]);
	}
	throw new Error(`toBytes: received unsupported type ${  typeof v}`);
}

const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
	if (arrays.length === 1) return arrays[0];
	const length = arrays.reduce((a, arr) => a + arr.length, 0);
	const result = new Uint8Array(length);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const arr = arrays[i];
		result.set(arr, pad);
		pad += arr.length;
	}
	return result;
};

function txTypeBytes(txType: TransactionType): Uint8Array {
	return hexToBytes(`0x${  txType.toString(16).padStart(2, '0')}`);
}

const computeVersionedHash = (commitment: Uint8Array, blobCommitmentVersion: number) => {
	const computedVersionedHash = new Uint8Array(32);
	computedVersionedHash.set([blobCommitmentVersion], 0);
	computedVersionedHash.set(sha256(Buffer.from(commitment)).subarray(1), 1);
	return computedVersionedHash;
};
const blobsToCommitments = (blobs: Uint8Array[]) => {
	const commitments: Uint8Array[] = [];
	for (const blob of blobs) {
		commitments.push(kzg.blobToKzgCommitment(blob));
	}
	return commitments;
};
const commitmentsToVersionedHashes = (commitments: Uint8Array[]) => {
	const hashes: Uint8Array[] = [];
	for (const commitment of commitments) {
		hashes.push(computeVersionedHash(commitment, 0x01));
	}
	return hashes;
};
const validateBlobTransactionNetworkWrapper = (
	blobVersionedHashes: Uint8Array[],
	blobs: Uint8Array[],
	commitments: Uint8Array[],
	kzgProofs: Uint8Array[],
	version: number,
) => {
	if (!(blobVersionedHashes.length === blobs.length && blobs.length === commitments.length)) {
		throw new Error('Number of blobVersionedHashes, blobs, and commitments not all equal');
	}
	if (blobVersionedHashes.length === 0) {
		throw new Error('Invalid transaction with empty blobs');
	}

	let isValid;
	try {
		isValid = kzg.verifyBlobKzgProofBatch(blobs, commitments, kzgProofs);
	} catch (error) {
		throw new Error(`KZG verification of blobs fail with error=${error}`);
	}
	if (!isValid) {
		throw new Error('KZG proof cannot be verified from blobs/commitments');
	}

	for (let x = 0; x < blobVersionedHashes.length; x++) {
		const computedVersionedHash = computeVersionedHash(commitments[x], version);
		if (!equalsBytes(computedVersionedHash, blobVersionedHashes[x])) {
			throw new Error(`commitment for blob at index ${x} does not match versionedHash`);
		}
	}
};
type AccessListBytesItem = [Uint8Array, Uint8Array[]];
type AccessListBytes = AccessListBytesItem[];
const blobsToProofs = (blobs: Uint8Array[], commitments: Uint8Array[]) =>
	blobs.map((blob, ctx) => kzg.computeBlobKzgProof(blob, commitments[ctx]));

export enum TransactionType {
	Legacy = 0,
	AccessListEIP2930 = 1,
	FeeMarketEIP1559 = 2,
	BlobEIP4844 = 3,
}

interface TransformabletoBytes {
	toBytes?(): Uint8Array;
}

type BigIntLike = bigint | PrefixedHexString | number | Uint8Array;
type BytesLike = Uint8Array | number[] | number | bigint | TransformabletoBytes | PrefixedHexString;

interface BlobEIP4844TxData extends FeeMarketEIP1559TxData {
	/**
	 * The versioned hashes used to validate the blobs attached to a transaction
	 */
	blobVersionedHashes?: BytesLike[];
	/**
	 * The maximum fee per blob gas paid for the transaction
	 */
	maxFeePerBlobGas?: BigIntLike;
	/**
	 * The blobs associated with a transaction
	 */
	blobs?: BytesLike[];
	/**
	 * The KZG commitments corresponding to the versioned hashes for each blob
	 */
	kzgCommitments?: BytesLike[];
	/**
	 * The KZG proofs associated with the transaction
	 */
	kzgProofs?: BytesLike[];
	/**
	 * An array of arbitrary strings that blobs are to be constructed from
	 */
	blobsData?: string[];
}

/**
 * Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data
 *
 * - TransactionType: 3
 * - EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)
 */
export class BlobEIP4844Transaction extends BaseTransaction<TransactionType.BlobEIP4844> {
	public readonly chainId: bigint;
	public readonly accessList: AccessListBytes;
	public readonly AccessListJSON: AccessList;
	public readonly maxPriorityFeePerGas: bigint;
	public readonly maxFeePerGas: bigint;
	public readonly maxFeePerBlobGas: bigint;

	// @ts-expect-error
	public readonly common: Common;
	public blobVersionedHashes: Uint8Array[];
	blobs?: Uint8Array[]; // This property should only be populated when the transaction is in the "Network Wrapper" format
	kzgCommitments?: Uint8Array[]; // This property should only be populated when the transaction is in the "Network Wrapper" format
	kzgProofs?: Uint8Array[]; // This property should only be populated when the transaction is in the "Network Wrapper" format

	/**
	 * This constructor takes the values, validates them, assigns them and freezes the object.
	 *
	 * It is not recommended to use this constructor directly. Instead use
	 * the static constructors or factory methods to assist in creating a Transaction object from
	 * varying data types.
	 */
	constructor(txData: BlobEIP4844TxData, opts: TxOptions = {}) {
		// @ts-expect-error
		super({ ...txData, type: TransactionType.BlobEIP4844 }, opts);
		const { chainId, accessList, maxFeePerGas, maxPriorityFeePerGas, maxFeePerBlobGas } =
			txData;

		// @ts-expect-error
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
		const accessListData = getAccessListData(accessList ?? []);
		this.accessList = accessListData.accessList;
		this.AccessListJSON = accessListData.AccessListJSON;
		// Verify the access list format.
		verifyAccessList(this.accessList);

		this.maxFeePerGas = toBigInt(toBytes(maxFeePerGas === '' ? '0x' : maxFeePerGas));
		this.maxPriorityFeePerGas = toBigInt(
			toBytes(maxPriorityFeePerGas === '' ? '0x' : maxPriorityFeePerGas),
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

		this.maxFeePerBlobGas = toBigInt(
			toBytes((maxFeePerBlobGas ?? '') === '' ? '0x' : maxFeePerBlobGas),
		);

		this.blobVersionedHashes = (txData.blobVersionedHashes ?? []).map(vh => toBytes(vh));
		this.validateYParity();
		this.validateHighS();

		for (const hash of this.blobVersionedHashes) {
			if (hash.length !== 32) {
				const msg = this._errorMsg('versioned hash is invalid length');
				throw new Error(msg);
			}
			if (BigInt(hash[0]) !== this.common.param('sharding', 'blobCommitmentVersionKzg')) {
				const msg = this._errorMsg(
					'versioned hash does not start with KZG commitment version',
				);
				throw new Error(msg);
			}
		}
		if (this.blobVersionedHashes.length > LIMIT_BLOBS_PER_TX) {
			const msg = this._errorMsg(`tx can contain at most ${LIMIT_BLOBS_PER_TX} blobs`);
			throw new Error(msg);
		}

		this.blobs = txData.blobs?.map(blob => toBytes(blob));
		this.kzgCommitments = txData.kzgCommitments?.map(commitment => toBytes(commitment));
		this.kzgProofs = txData.kzgProofs?.map(proof => toBytes(proof));
		const freeze = opts?.freeze ?? true;
		if (freeze) {
			Object.freeze(this);
		}
	}

	validateHighS(): void {
		const { s } = this;
		if (this.common.gteHardfork('homestead') && s !== undefined && s > SECP256K1_ORDER_DIV_2) {
			const msg = this._errorMsg(
				'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid',
			);
			throw new Error(msg);
		}
	}

	validateYParity() {
		const { v } = this;
		if (v !== undefined && v !== BIGINT_0 && v !== BIGINT_1) {
			const msg = this._errorMsg('The y-parity of the transaction should either be 0 or 1');
			throw new Error(msg);
		}
	}

	public static fromTxData(txData: BlobEIP4844TxData, opts?: TxOptions) {
		if (txData.blobsData !== undefined) {
			if (txData.blobs !== undefined) {
				throw new Error('cannot have both raw blobs data and encoded blobs in constructor');
			}
			if (txData.kzgCommitments !== undefined) {
				throw new Error(
					'cannot have both raw blobs data and KZG commitments in constructor',
				);
			}
			if (txData.blobVersionedHashes !== undefined) {
				throw new Error(
					'cannot have both raw blobs data and versioned hashes in constructor',
				);
			}
			if (txData.kzgProofs !== undefined) {
				throw new Error('cannot have both raw blobs data and KZG proofs in constructor');
			}
			txData.blobs = getBlobs(txData.blobsData.reduce((acc, cur) => acc + cur));
			txData.kzgCommitments = blobsToCommitments(txData.blobs as Uint8Array[]);
			txData.blobVersionedHashes = commitmentsToVersionedHashes(
				txData.kzgCommitments as Uint8Array[],
			);
			txData.kzgProofs = blobsToProofs(
				txData.blobs as Uint8Array[],
				txData.kzgCommitments as Uint8Array[],
			);
		}

		return new BlobEIP4844Transaction(txData, opts);
	}

	/**
	 * Creates the minimal representation of a blob transaction from the network wrapper version.
	 * The minimal representation is used when adding transactions to an execution payload/block
	 * @param txData a {@link BlobEIP4844Transaction} containing optional blobs/kzg commitments
	 * @param opts - dictionary of {@link TxOptions}
	 * @returns the "minimal" representation of a BlobEIP4844Transaction (i.e. transaction object minus blobs and kzg commitments)
	 */
	public static minimalFromNetworkWrapper(
		txData: BlobEIP4844Transaction,
		opts?: TxOptions,
	): BlobEIP4844Transaction {
		const tx = BlobEIP4844Transaction.fromTxData(
			{
				...txData,
				...{ blobs: undefined, kzgCommitments: undefined, kzgProofs: undefined },
			},
			opts,
		);
		return tx;
	}

	/**
	 * Instantiate a transaction from the serialized tx.
	 *
	 * Format: `0x03 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
	 * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`
	 */
	public static fromSerializedTx(serialized: Uint8Array, opts: TxOptions = {}) {
		if (
			!equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844))
		) {
			throw new Error(
				`Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
					TransactionType.BlobEIP4844
				}, received: ${toHex(serialized.subarray(0, 1))}`,
			);
		}

		const values = RLP.decode(serialized.subarray(1));

		if (!Array.isArray(values)) {
			throw new Error('Invalid serialized tx input: must be array');
		}

		return BlobEIP4844Transaction.fromValuesArray(values as unknown as TxValuesArray, opts);
	}

	/**
	 * Create a transaction from a values array.
	 *
	 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
	 * accessList, signatureYParity, signatureR, signatureS]`
	 */
	public static fromValuesArray(values: TxValuesArray, opts: TxOptions = {}) {
		if (values.length !== 11 && values.length !== 14) {
			throw new Error(
				'Invalid EIP-4844 transaction. Only expecting 11 values (for unsigned tx) or 14 values (for signed tx).',
			);
		}

		const [
			chainId,
			nonce,
			maxPriorityFeePerGas,
			maxFeePerGas,
			gasLimit,
			to,
			value,
			data,
			accessList,
			maxFeePerBlobGas,
			blobVersionedHashes,
			v,
			r,
			s,
		] = values;

		this._validateNotArray({ chainId, v });
		validateNoLeadingZeroes({
			// @ts-expect-error
			nonce,
			// @ts-expect-error
			maxPriorityFeePerGas,
			// @ts-expect-error
			maxFeePerGas,
			// @ts-expect-error
			gasLimit,
			// @ts-expect-error
			value,
			// @ts-expect-error
			maxFeePerBlobGas,
			// @ts-expect-error
			v,
			// @ts-expect-error
			r,
			// @ts-expect-error
			s,
		});

		return new BlobEIP4844Transaction(
			{
				chainId: toBigInt(chainId),
				nonce,
				maxPriorityFeePerGas,
				maxFeePerGas,
				gasLimit,
				// @ts-expect-error
				to,
				value,
				data,
				// @ts-expect-error
				accessList: accessList ?? [],
				maxFeePerBlobGas,
				// @ts-expect-error
				blobVersionedHashes,
				v: v !== undefined ? toBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
				r,
				s,
			},
			opts,
		);
	}

	/**
	 * Creates a transaction from the network encoding of a blob transaction (with blobs/commitments/proof)
	 * @param serialized a buffer representing a serialized BlobTransactionNetworkWrapper
	 * @param opts any TxOptions defined
	 * @returns a BlobEIP4844Transaction
	 */

	public static fromSerializedBlobTxNetworkWrapper(
		serialized: Uint8Array,
		opts?: TxOptions,
	): BlobEIP4844Transaction {
		if (!opts || !opts.common) {
			throw new Error('common instance required to validate versioned hashes');
		}

		if (
			!equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.BlobEIP4844))
		) {
			throw new Error(
				`Invalid serialized tx input: not an EIP-4844 transaction (wrong tx type, expected: ${
					TransactionType.BlobEIP4844
				}, received: ${toHex(serialized.subarray(0, 1))}`,
			);
		}

		// Validate network wrapper
		const networkTxValues = RLP.decode(serialized.subarray(1));
		if (networkTxValues.length !== 4) {
			throw Error(`Expected 4 values in the deserialized network transaction`);
		}
		const [txValues, blobs, kzgCommitments, kzgProofs] =
			networkTxValues as BlobEIP4844NetworkValuesArray;

		// Construct the tx but don't freeze yet, we will assign blobs etc once validated
		const decodedTx = BlobEIP4844Transaction.fromValuesArray(
			txValues as unknown as Uint8Array,
			{
				...opts,
				freeze: false,
			},
		);
		if (decodedTx.to === undefined) {
			throw Error('BlobEIP4844Transaction can not be send without a valid `to`');
		}

		const version = Number(opts.common.param('sharding', 'blobCommitmentVersionKzg'));
		validateBlobTransactionNetworkWrapper(
			decodedTx.blobVersionedHashes,
			blobs,
			kzgCommitments,
			kzgProofs,
			version,
		);

		// set the network blob data on the tx
		decodedTx.blobs = blobs;
		decodedTx.kzgCommitments = kzgCommitments;
		decodedTx.kzgProofs = kzgProofs;

		// freeze the tx
		const freeze = opts?.freeze ?? true;
		if (freeze) {
			Object.freeze(decodedTx);
		}

		return decodedTx;
	}

	/**
	 * The amount of gas paid for the data in this tx
	 */
	getDataFee(): bigint {
		const extraCost = BigInt(getDataFeeEIP2930(this.accessList, this.common));
		if (this.cache.dataFee && this.cache.dataFee.hardfork === this.common.hardfork()) {
			return this.cache.dataFee.value;
		}

		const cost = BaseTransaction.prototype.getDataFee.bind(this)() + (extraCost ?? BIGINT_0);

		if (Object.isFrozen(this)) {
			this.cache.dataFee = {
				value: cost,
				hardfork: this.common.hardfork(),
			};
		}

		return cost;
	}

	/**
	 * The up front amount that an account must have for this transaction to be valid
	 * @param baseFee The base fee of the block (will be set to 0 if not provided)
	 */
	getUpfrontCost(baseFee: bigint = BIGINT_0): bigint {
		const prio = this.maxPriorityFeePerGas;
		const maxBase = this.maxFeePerGas - baseFee;
		const inclusionFeePerGas = prio < maxBase ? prio : maxBase;
		const gasPrice = inclusionFeePerGas + baseFee;
		return this.gasLimit * gasPrice + this.value;
	}

	/**
	 * Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.
	 *
	 * Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
	 * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.
	 *
	 * Use {@link BlobEIP4844Transaction.serialize} to add a transaction to a block
	 * with {@link Block.fromValuesArray}.
	 *
	 * For an unsigned tx this method uses the empty Bytes values for the
	 * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
	 * representation for external signing use {@link BlobEIP4844Transaction.getMessageToSign}.
	 */
	// @ts-expect-error
	raw(): TxValuesArray {
		return [
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.chainId),
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.nonce),
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.maxPriorityFeePerGas),
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.maxFeePerGas),
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.gasLimit),
			// @ts-expect-error
			this.to !== undefined ? this.to.bytes : new Uint8Array(0),
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.value),
			// @ts-expect-error
			this.data,
			// @ts-expect-error
			this.accessList,
			// @ts-expect-error
			bigIntToUnpaddedBytes(this.maxFeePerBlobGas),
			// @ts-expect-error
			this.blobVersionedHashes,
			// @ts-expect-error
			this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
			// @ts-expect-error
			this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
			// @ts-expect-error
			this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
		];
	}

	/**
	 * Returns the serialized encoding of the EIP-4844 transaction.
	 *
	 * Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
	 * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.
	 *
	 * Note that in contrast to the legacy tx serialization format this is not
	 * valid RLP any more due to the raw tx type preceding and concatenated to
	 * the RLP encoding of the values.
	 */
	serialize(): Uint8Array {
		return this._serialize();
	}

	private _serialize(base?: Input): Uint8Array {
		return concatBytes(txTypeBytes(this.type), RLP.encode(base ?? this.raw()));
	}

	/**
	 * @returns the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)
	 */
	serializeNetworkWrapper(): Uint8Array {
		if (
			this.blobs === undefined ||
			this.kzgCommitments === undefined ||
			this.kzgProofs === undefined
		) {
			throw new Error(
				'cannot serialize network wrapper without blobs, KZG commitments and KZG proofs provided',
			);
		}
		return this._serialize([this.raw(), this.blobs, this.kzgCommitments, this.kzgProofs]);
	}

	/**
	 * Returns the raw serialized unsigned tx, which can be used
	 * to sign the transaction (e.g. for sending to a hardware wallet).
	 *
	 * Note: in contrast to the legacy tx the raw message format is already
	 * serialized and doesn't need to be RLP encoded any more.
	 *
	 * ```javascript
	 * const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
	 * ```
	 */
	getMessageToSign(): Uint8Array {
		return this._serialize(this.raw().slice(0, 11));
	}

	/**
	 * Returns the hashed serialized unsigned tx, which can be used
	 * to sign the transaction (e.g. for sending to a hardware wallet).
	 *
	 * Note: in contrast to the legacy tx the raw message format is already
	 * serialized and doesn't need to be RLP encoded any more.
	 */
	getHashedMessageToSign(): Uint8Array {
		return keccak256(Buffer.from(this.getMessageToSign()));
	}

	/**
	 * Computes a sha3-256 hash of the serialized tx.
	 *
	 * This method can only be used for signed txs (it throws otherwise).
	 * Use {@link BlobEIP4844Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
	 */
	public hash(): Uint8Array {
		if (!this.isSigned()) {
			const msg = this._errorMsg('Cannot call hash method if transaction is not signed');
			throw new Error(msg);
		}

		if (Object.isFrozen(this)) {
			if (!this.cache.hash) {
				this.cache.hash = keccak256(Buffer.from(this.serialize()));
			}
			return this.cache.hash;
		}

		return keccak256(Buffer.from(this.serialize()));
	}

	getMessageToVerifySignature(): Uint8Array {
		return this.getHashedMessageToSign();
	}

	/**
	 * Returns the public key of the sender
	 */
	public getSenderPublicKey(): Uint8Array {
		// @ts-expect-error
		if (this.cache.senderPubKey !== undefined) {
			// @ts-expect-error
			return this.cache.senderPubKey;
		}

		const msgHash = this.getMessageToVerifySignature();

		const { v, r, s } = this;

		this.validateHighS();

		try {
			const sender = ecrecover(
				msgHash,
				v!,
				bigIntToUnpaddedBytes(r!),
				bigIntToUnpaddedBytes(s!),
				this.supports(1559) ? this.common.chainId() : undefined,
			);
			if (Object.isFrozen(this)) {
				// @ts-expect-error
				this.cache.senderPubKey = sender;
			}
			return sender;
		} catch (e: any) {
			const msg = this._errorMsg('Invalid Signature');
			throw new Error(msg);
		}
	}

	toJSON(): JsonTx {
		const accessListJSON = getAccessListJSON(this.accessList);
		return {
			type: toHex(BigInt(this.type)),
			nonce: toHex(this.nonce),
			gasLimit: toHex(this.gasLimit),
			to: this.to !== undefined ? this.to.toString() : undefined,
			value: toHex(this.value),
			data: toHex(this.data),
			v: this.v !== undefined ? toHex(this.v) : undefined,
			r: this.r !== undefined ? toHex(this.r) : undefined,
			s: this.s !== undefined ? toHex(this.s) : undefined,
			chainId: toHex(this.chainId),
			maxPriorityFeePerGas: toHex(this.maxPriorityFeePerGas),
			maxFeePerGas: toHex(this.maxFeePerGas),
			accessList: accessListJSON,
			maxFeePerDataGas: toHex(this.maxFeePerBlobGas),
			versionedHashes: this.blobVersionedHashes.map(hash => toHex(hash)),
		};
	}

	// @ts-expect-error
	protected _processSignature(v: bigint, r: Uint8Array, s: Uint8Array): BlobEIP4844Transaction {
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
				v: v - BIGINT_27, // This looks extremely hacky: @ethereumjs/util actually adds 27 to the value, the recovery bit is either 0 or 1.
				r: toBigInt(r),
				s: toBigInt(s),
				maxFeePerBlobGas: this.maxFeePerBlobGas,
				blobVersionedHashes: this.blobVersionedHashes,
				blobs: this.blobs,
				kzgCommitments: this.kzgCommitments,
				kzgProofs: this.kzgProofs,
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
	public numBlobs(): number {
		return this.blobVersionedHashes.length;
	}
}
