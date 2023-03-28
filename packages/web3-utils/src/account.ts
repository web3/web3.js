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
import { keccak256 } from 'ethereum-cryptography/keccak';
import { Point, utils } from 'ethereum-cryptography/secp256k1';
import { RLP } from './rlp';

import {
	arrToBufArr,
	bigIntToUnpaddedBuffer,
	bufArrToArr,
	bufferToBigInt,
	bufferToHex,
	toBuffer,
	zeros,
} from './bytes';
import { KECCAK256_NULL, KECCAK256_RLP } from './constants';
import { assertIsBuffer, assertIsString } from './helpers';

import type { BigIntLike, BufferLike } from './types';
import { toChecksumAddress } from './converters';

const _0n = BigInt(0);

export interface AccountData {
	nonce?: BigIntLike;
	balance?: BigIntLike;
	storageRoot?: BufferLike;
	codeHash?: BufferLike;
}

export type AccountBodyBuffer = [Buffer, Buffer, Buffer | Uint8Array, Buffer | Uint8Array];

export class Account {
	public nonce: bigint;
	public balance: bigint;
	public storageRoot: Buffer;
	public codeHash: Buffer;

	public static fromAccountData(accountData: AccountData) {
		const { nonce, balance, storageRoot, codeHash } = accountData;

		return new Account(
			nonce !== undefined ? bufferToBigInt(toBuffer(nonce)) : undefined,
			balance !== undefined ? bufferToBigInt(toBuffer(balance)) : undefined,
			storageRoot !== undefined ? toBuffer(storageRoot) : undefined,
			codeHash !== undefined ? toBuffer(codeHash) : undefined,
		);
	}

	public static fromRlpSerializedAccount(serialized: Buffer) {
		const values = arrToBufArr(
			RLP.decode(Uint8Array.from(serialized)) as Uint8Array[],
		) as Buffer[];

		if (!Array.isArray(values)) {
			throw new Error('Invalid serialized account input. Must be array');
		}

		return this.fromValuesArray(values);
	}

	public static fromValuesArray(values: Buffer[]) {
		const [nonce, balance, storageRoot, codeHash] = values;

		return new Account(bufferToBigInt(nonce), bufferToBigInt(balance), storageRoot, codeHash);
	}

	/**
	 * This constructor assigns and validates the values.
	 * Use the static factory methods to assist in creating an Account from varying data types.
	 */
	public constructor(
		nonce = _0n,
		balance = _0n,
		storageRoot = KECCAK256_RLP,
		codeHash = KECCAK256_NULL,
	) {
		this.nonce = nonce;
		this.balance = balance;
		this.storageRoot = storageRoot;
		this.codeHash = codeHash;

		this._validate();
	}

	private _validate() {
		if (this.nonce < _0n) {
			throw new Error('nonce must be greater than zero');
		}
		if (this.balance < _0n) {
			throw new Error('balance must be greater than zero');
		}
		if (this.storageRoot.length !== 32) {
			throw new Error('storageRoot must have a length of 32');
		}
		if (this.codeHash.length !== 32) {
			throw new Error('codeHash must have a length of 32');
		}
	}

	/**
	 * Returns a Buffer Array of the raw Buffers for the account, in order.
	 */
	public raw(): Buffer[] {
		return [
			bigIntToUnpaddedBuffer(this.nonce),
			bigIntToUnpaddedBuffer(this.balance),
			this.storageRoot,
			this.codeHash,
		];
	}

	/**
	 * Returns the RLP serialization of the account as a `Buffer`.
	 */
	public serialize(): Buffer {
		return Buffer.from(RLP.encode(bufArrToArr(this.raw())));
	}

	/**
	 * Returns a `Boolean` determining if the account is a contract.
	 */
	public isContract(): boolean {
		return !this.codeHash.equals(KECCAK256_NULL);
	}

	/**
	 * Returns a `Boolean` determining if the account is empty complying to the definition of
	 * account emptiness in [EIP-161](https://eips.ethereum.org/EIPS/eip-161):
	 * "An account is considered empty when it has no code and zero nonce and zero balance."
	 */
	public isEmpty(): boolean {
		return this.balance === _0n && this.nonce === _0n && this.codeHash.equals(KECCAK256_NULL);
	}
}

/**
 * Checks if the address is a valid. Accepts checksummed addresses too.
 */
export const isValidAddress = function (hexAddress: string): boolean {
	try {
		assertIsString(hexAddress);
	} catch (e: any) {
		return false;
	}

	return /^0x[0-9a-fA-F]{40}$/.test(hexAddress);
};

/**
 * Checks if the address is a valid checksummed address.
 *
 * See toChecksumAddress' documentation for details about the eip1191ChainId parameter.
 */
export const isValidChecksumAddress = function (hexAddress: string): boolean {
	return isValidAddress(hexAddress) && toChecksumAddress(hexAddress) === hexAddress;
};

/**
 * Generates an address of a newly created contract.
 * @param from The address which is creating this new address
 * @param nonce The nonce of the from account
 */
export const generateAddress = function (from: Buffer, nonce: Buffer): Buffer {
	assertIsBuffer(from);
	assertIsBuffer(nonce);

	if (bufferToBigInt(nonce) === BigInt(0)) {
		// in RLP we want to encode null in the case of zero nonce
		// read the RLP documentation for an answer if you dare
		// eslint-disable-next-line no-null/no-null, @typescript-eslint/no-unsafe-argument, deprecation/deprecation
		return Buffer.from(keccak256(RLP.encode(bufArrToArr([from, null] as any)))).slice(-20);
	}

	// Only take the lower 160bits of the hash
	// eslint-disable-next-line deprecation/deprecation
	return Buffer.from(keccak256(RLP.encode(bufArrToArr([from, nonce])))).slice(-20);
};

/**
 * Generates an address for a contract created using CREATE2.
 * @param from The address which is creating this new address
 * @param salt A salt
 * @param initCode The init code of the contract being created
 */
export const generateAddress2 = function (from: Buffer, salt: Buffer, initCode: Buffer): Buffer {
	assertIsBuffer(from);
	assertIsBuffer(salt);
	assertIsBuffer(initCode);

	if (from.length !== 20) {
		throw new Error('Expected from to be of length 20');
	}
	if (salt.length !== 32) {
		throw new Error('Expected salt to be of length 32');
	}

	const address = keccak256(
		Buffer.concat([Buffer.from('ff', 'hex'), from, salt, keccak256(initCode)]),
	);

	// eslint-disable-next-line deprecation/deprecation
	return toBuffer(address).slice(-20);
};

/**
 * Checks if the private key satisfies the rules of the curve secp256k1.
 */
export const isValidPrivate = function (privateKey: Buffer): boolean {
	return utils.isValidPrivateKey(privateKey);
};

/**
 * Checks if the public key satisfies the rules of the curve secp256k1
 * and the requirements of Ethereum.
 * @param publicKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const isValidPublic = function (publicKey: Buffer, sanitize = false): boolean {
	assertIsBuffer(publicKey);
	if (publicKey.length === 64) {
		// Convert to SEC1 for secp256k1
		// Automatically checks whether point is on curve
		try {
			Point.fromHex(Buffer.concat([Buffer.from([4]), publicKey]));
			return true;
		} catch (e) {
			return false;
		}
	}

	if (!sanitize) {
		return false;
	}

	try {
		Point.fromHex(publicKey);
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param pubKey The two points of an uncompressed key, unless sanitize is enabled
 * @param sanitize Accept public keys in other formats
 */
export const pubToAddress = function (_pubKey: Buffer, sanitize = false): Buffer {
	let pubKey = _pubKey;
	assertIsBuffer(pubKey);
	if (sanitize && pubKey.length !== 64) {
		pubKey = Buffer.from(Point.fromHex(pubKey).toRawBytes(false).slice(1));
	}
	if (pubKey.length !== 64) {
		throw new Error('Expected pubKey to be of length 64');
	}
	// Only take the lower 160bits of the hash
	// eslint-disable-next-line deprecation/deprecation
	return Buffer.from(keccak256(pubKey)).slice(-20);
};
export const publicToAddress = pubToAddress;

/**
 * Returns the ethereum public key of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToPublic = function (privateKey: Buffer): Buffer {
	assertIsBuffer(privateKey);
	// skip the type flag and use the X, Y points
	return Buffer.from(Point.fromPrivateKey(privateKey).toRawBytes(false).slice(1));
};

/**
 * Returns the ethereum address of a given private key.
 * @param privateKey A private key must be 256 bits wide
 */
export const privateToAddress = function (privateKey: Buffer): Buffer {
	return publicToAddress(privateToPublic(privateKey));
};

/**
 * Converts a public key to the Ethereum format.
 */
export const importPublic = function (_publicKey: Buffer): Buffer {
	let publicKey = _publicKey;
	assertIsBuffer(publicKey);
	if (publicKey.length !== 64) {
		publicKey = Buffer.from(Point.fromHex(publicKey).toRawBytes(false).slice(1));
	}
	return publicKey;
};

/**
 * Returns the zero address.
 */
export const zeroAddress = function (): string {
	const addressLength = 20;
	const addr = zeros(addressLength);
	return bufferToHex(addr);
};

/**
 * Checks if a given address is the zero address.
 */
export const isZeroAddress = function (hexAddress: string): boolean {
	try {
		assertIsString(hexAddress);
	} catch (e: any) {
		return false;
	}

	const zeroAddr = zeroAddress();
	return zeroAddr === hexAddress;
};

export function accountBodyFromSlim(body: AccountBodyBuffer) {
	const [nonce, balance, storageRoot, codeHash] = body;
	return [
		nonce,
		balance,
		arrToBufArr(storageRoot).length === 0 ? KECCAK256_RLP : storageRoot,
		arrToBufArr(codeHash).length === 0 ? KECCAK256_NULL : codeHash,
	];
}

const emptyUint8Arr = new Uint8Array(0);
export function accountBodyToSlim(body: AccountBodyBuffer) {
	const [nonce, balance, storageRoot, codeHash] = body;
	return [
		nonce,
		balance,
		arrToBufArr(storageRoot).equals(KECCAK256_RLP) ? emptyUint8Arr : storageRoot,
		arrToBufArr(codeHash).equals(KECCAK256_NULL) ? emptyUint8Arr : codeHash,
	];
}

/**
 * Converts a slim account (per snap protocol spec) to the RLP encoded version of the account
 * @param body Array of 4 Buffer-like items to represent the account
 * @returns RLP encoded version of the account
 */
export function accountBodyToRLP(body: AccountBodyBuffer, couldBeSlim = true) {
	const accountBody = couldBeSlim ? accountBodyFromSlim(body) : body;
	return arrToBufArr(RLP.encode(accountBody));
}
