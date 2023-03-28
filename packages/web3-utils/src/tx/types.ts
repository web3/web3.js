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
import {
	BooleanType,
	ByteListType,
	ByteVectorType,
	ContainerType,
	ListCompositeType,
	NoneType,
	UintBigintType,
	UnionType,
} from '@chainsafe/ssz';

import {
	BYTES_PER_FIELD_ELEMENT,
	FIELD_ELEMENTS_PER_BLOB,
	LIMIT_BLOBS_PER_TX,
	MAX_ACCESS_LIST_SIZE,
	MAX_CALLDATA_SIZE,
	MAX_TX_WRAP_KZG_COMMITMENTS,
	MAX_VERSIONED_HASHES_LIST_SIZE,
} from './constants';

import type { FeeMarketEIP1559Transaction } from './eip1559Transaction';
import type { AccessListEIP2930Transaction } from './eip2930Transaction';
import type { BlobEIP4844Transaction } from './eip4844Transaction';
import type { Transaction } from './legacyTransaction';
import type { Common } from '../common';
import type { AddressLike, BigIntLike, BufferLike, PrefixedHexString } from '../types';

const Bytes20 = new ByteVectorType(20);
const Bytes32 = new ByteVectorType(32);
const Bytes48 = new ByteVectorType(48);

const Uint64 = new UintBigintType(8);
const Uint256 = new UintBigintType(32);

/**
 * Can be used in conjunction with {@link Transaction.supports}
 * to query on tx capabilities
 */
export enum Capability {
	/**
	 * Tx supports EIP-155 replay protection
	 * See: [155](https://eips.ethereum.org/EIPS/eip-155) Replay Attack Protection EIP
	 */
	EIP155ReplayProtection = 155,

	/**
	 * Tx supports EIP-1559 gas fee market mechanism
	 * See: [1559](https://eips.ethereum.org/EIPS/eip-1559) Fee Market EIP
	 */
	EIP1559FeeMarket = 1559,

	/**
	 * Tx is a typed transaction as defined in EIP-2718
	 * See: [2718](https://eips.ethereum.org/EIPS/eip-2718) Transaction Type EIP
	 */
	EIP2718TypedTransaction = 2718,

	/**
	 * Tx supports access list generation as defined in EIP-2930
	 * See: [2930](https://eips.ethereum.org/EIPS/eip-2930) Access Lists EIP
	 */
	EIP2930AccessLists = 2930,
}

/**
 * The options for initializing a {@link Transaction}.
 */
export interface TxOptions {
	/**
	 * A {@link Common} object defining the chain and hardfork for the transaction.
	 *
	 * Object will be internally copied so that tx behavior don't incidentally
	 * change on future HF changes.
	 *
	 * Default: {@link Common} object set to `mainnet` and the default hardfork as defined in the {@link Common} class.
	 *
	 * Current default hardfork: `istanbul`
	 */
	common?: Common;
	/**
	 * A transaction object by default gets frozen along initialization. This gives you
	 * strong additional security guarantees on the consistency of the tx parameters.
	 * It also enables tx hash caching when the `hash()` method is called multiple times.
	 *
	 * If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
	 * add additional properties - it is strongly encouraged that you do the freeze yourself
	 * within your code instead.
	 *
	 * Default: true
	 */
	freeze?: boolean;
}

/*
 * Access List types
 */

export type AccessListItem = {
	address: PrefixedHexString;
	storageKeys: PrefixedHexString[];
};

/*
 * An Access List as a tuple of [address: Buffer, storageKeys: Buffer[]]
 */
export type AccessListBufferItem = [Buffer, Buffer[]];
export type AccessListBuffer = AccessListBufferItem[];
export type AccessList = AccessListItem[];

export function isAccessListBuffer(
	input: AccessListBuffer | AccessList,
): input is AccessListBuffer {
	if (input.length === 0) {
		return true;
	}
	const firstItem = input[0];
	if (Array.isArray(firstItem)) {
		return true;
	}
	return false;
}

export function isAccessList(input: AccessListBuffer | AccessList): input is AccessList {
	return !isAccessListBuffer(input); // This is exactly the same method, except the output is negated.
}

/**
 * Encompassing type for all transaction types.
 *
 * Note that this also includes legacy txs which are
 * referenced as {@link Transaction} for compatibility reasons.
 */
export type TypedTransaction =
	| Transaction
	| AccessListEIP2930Transaction
	| FeeMarketEIP1559Transaction
	| BlobEIP4844Transaction;

/**
 * Legacy {@link Transaction} Data
 */
export type TxData = {
	/**
	 * The transaction's nonce.
	 */
	nonce?: BigIntLike;

	/**
	 * The transaction's gas price.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	gasPrice?: BigIntLike | null;

	/**
	 * The transaction's gas limit.
	 */
	gasLimit?: BigIntLike;

	/**
	 * The transaction's the address is sent to.
	 */
	to?: AddressLike;

	/**
	 * The amount of Ether sent.
	 */
	value?: BigIntLike;

	/**
	 * This will contain the data of the message or the init of a contract.
	 */
	data?: BufferLike;

	/**
	 * EC recovery ID.
	 */
	v?: BigIntLike;

	/**
	 * EC signature parameter.
	 */
	r?: BigIntLike;

	/**
	 * EC signature parameter.
	 */
	s?: BigIntLike;

	/**
	 * The transaction type
	 */

	type?: BigIntLike;
};

/**
 * {@link AccessListEIP2930Transaction} data.
 */
export interface AccessListEIP2930TxData extends TxData {
	/**
	 * The transaction's chain ID
	 */
	chainId?: BigIntLike;

	/**
	 * The access list which contains the addresses/storage slots which the transaction wishes to access
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	accessList?: AccessListBuffer | AccessList | null;
}

/**
 * {@link FeeMarketEIP1559Transaction} data.
 */
export interface FeeMarketEIP1559TxData extends AccessListEIP2930TxData {
	/**
	 * The transaction's gas price, inherited from {@link Transaction}.  This property is not used for EIP1559
	 * transactions and should always be undefined for this specific transaction type.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	gasPrice?: never | null;
	/**
	 * The maximum inclusion fee per gas (this fee is given to the miner)
	 */
	maxPriorityFeePerGas?: BigIntLike;
	/**
	 * The maximum total fee
	 */
	maxFeePerGas?: BigIntLike;
}

/**
 * {@link BlobEIP4844Transaction} data.
 */
export interface BlobEIP4844TxData extends FeeMarketEIP1559TxData {
	/**
	 * The versioned hashes used to validate the blobs attached to a transaction
	 */
	versionedHashes?: BufferLike[];
	/**
	 * The maximum fee per data gas paid for the transaction
	 */
	maxFeePerDataGas?: BigIntLike;
	/**
	 * The blobs associated with a transaction
	 */
	blobs?: BufferLike[];
	/**
	 * The KZG commitments corresponding to the versioned hashes for each blob
	 */
	kzgCommitments?: BufferLike[];
	/**
	 * The aggregate KZG proof associated with the transaction
	 */
	kzgProof?: BufferLike;
}

/**
 * Buffer values array for a legacy {@link Transaction}
 */
export type TxValuesArray = Buffer[];

/**
 * Buffer values array for an {@link AccessListEIP2930Transaction}
 */
export type AccessListEIP2930ValuesArray = [
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	AccessListBuffer,
	Buffer?,
	Buffer?,
	Buffer?,
];

/**
 * Buffer values array for a {@link FeeMarketEIP1559Transaction}
 */
export type FeeMarketEIP1559ValuesArray = [
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	Buffer,
	AccessListBuffer,
	Buffer?,
	Buffer?,
	Buffer?,
];

type JsonAccessListItem = { address: string; storageKeys: string[] };

/**
 * Generic interface for all tx types with a
 * JSON representation of a transaction.
 *
 * Note that all values are marked as optional
 * and not all the values are present on all tx types
 * (an EIP1559 tx e.g. lacks a `gasPrice`).
 */
export interface JsonTx {
	nonce?: string;
	gasPrice?: string;
	gasLimit?: string;
	to?: string;
	data?: string;
	v?: string;
	r?: string;
	s?: string;
	value?: string;
	chainId?: string;
	accessList?: JsonAccessListItem[];
	type?: string;
	maxPriorityFeePerGas?: string;
	maxFeePerGas?: string;
	maxFeePerDataGas?: string;
	versionedHashes?: string[];
}

/*
 * Based on https://ethereum.org/en/developers/docs/apis/json-rpc/
 */
export interface JsonRpcTx {
	// eslint-disable-next-line @typescript-eslint/ban-types
	blockHash: string | null; // DATA, 32 Bytes - hash of the block where this transaction was in. null when it's pending.
	// eslint-disable-next-line @typescript-eslint/ban-types
	blockNumber: string | null; // QUANTITY - block number where this transaction was in. null when it's pending.
	from: string; // DATA, 20 Bytes - address of the sender.
	gas: string; // QUANTITY - gas provided by the sender.
	gasPrice: string; // QUANTITY - gas price provided by the sender in wei. If EIP-1559 tx, defaults to maxFeePerGas.
	maxFeePerGas?: string; // QUANTITY - max total fee per gas provided by the sender in wei.
	maxPriorityFeePerGas?: string; // QUANTITY - max priority fee per gas provided by the sender in wei.
	type: string; // QUANTITY - EIP-2718 Typed Transaction type
	accessList?: JsonTx['accessList']; // EIP-2930 access list
	chainId?: string; // Chain ID that this transaction is valid on.
	hash: string; // DATA, 32 Bytes - hash of the transaction.
	input: string; // DATA - the data send along with the transaction.
	nonce: string; // QUANTITY - the number of transactions made by the sender prior to this one.
	// eslint-disable-next-line @typescript-eslint/ban-types
	to: string | null; /// DATA, 20 Bytes - address of the receiver. null when it's a contract creation transaction.
	// eslint-disable-next-line @typescript-eslint/ban-types
	transactionIndex: string | null; // QUANTITY - integer of the transactions index position in the block. null when it's pending.
	value: string; // QUANTITY - value transferred in Wei.
	v: string; // QUANTITY - ECDSA recovery id
	r: string; // DATA, 32 Bytes - ECDSA signature r
	s: string; // DATA, 32 Bytes - ECDSA signature s
	maxFeePerDataGas?: string; // QUANTITY - max data fee for blob transactions
	versionedHashes?: string[]; // DATA - array of 32 byte versioned hashes for blob transactions
}

/** EIP4844 types */
export const AddressType = Bytes20; // SSZ encoded address

// SSZ encoded container for address and storage keys
export const AccessTupleType = new ContainerType({
	address: AddressType,
	storageKeys: new ListCompositeType(Bytes32, MAX_VERSIONED_HASHES_LIST_SIZE),
});

// SSZ encoded blob transaction
export const BlobTransactionType = new ContainerType({
	chainId: Uint256,
	nonce: Uint64,
	maxPriorityFeePerGas: Uint256,
	maxFeePerGas: Uint256,
	gas: Uint64,
	to: new UnionType([new NoneType(), AddressType]),
	value: Uint256,
	data: new ByteListType(MAX_CALLDATA_SIZE),
	accessList: new ListCompositeType(AccessTupleType, MAX_ACCESS_LIST_SIZE),
	maxFeePerDataGas: Uint256,
	blobVersionedHashes: new ListCompositeType(Bytes32, MAX_VERSIONED_HASHES_LIST_SIZE),
});

// SSZ encoded ECDSA Signature
export const ECDSASignatureType = new ContainerType({
	yParity: new BooleanType(),
	r: Uint256,
	s: Uint256,
});

// SSZ encoded signed blob transaction
export const SignedBlobTransactionType = new ContainerType({
	message: BlobTransactionType,
	signature: ECDSASignatureType,
});

// SSZ encoded KZG Commitment/Proof (48 bytes)
export const KZGCommitmentType = Bytes48;
export const KZGProofType = KZGCommitmentType;

// SSZ encoded blob network transaction wrapper
export const BlobNetworkTransactionWrapper = new ContainerType({
	tx: SignedBlobTransactionType,
	blobKzgs: new ListCompositeType(KZGCommitmentType, MAX_TX_WRAP_KZG_COMMITMENTS),
	blobs: new ListCompositeType(
		new ByteVectorType(FIELD_ELEMENTS_PER_BLOB * BYTES_PER_FIELD_ELEMENT),
		LIMIT_BLOBS_PER_TX,
	),
	kzgAggregatedProof: KZGProofType,
});
