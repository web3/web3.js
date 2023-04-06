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
import { validateNoLeadingZeroes } from 'web3-validator';
import { RLP } from '@ethereumjs/rlp';
import { MAX_INTEGER } from './constants';
import {
	arrToBufArr,
	bigIntToHex,
	bigIntToUnpaddedBuffer,
	bufArrToArr,
	bufferToBigInt,
	toBuffer,
	ecrecover,
	unpadBuffer,
} from '../common/utils';

import { BaseTransaction } from './baseTransaction';

import type { JsonTx, TxData, TxOptions, TxValuesArray } from './types';
import { Capability } from './types';
import type { Common } from '../common';

const TRANSACTION_TYPE = 0;

function meetsEIP155(_v: bigint, chainId: bigint) {
	const v = Number(_v);
	const chainIdDoubled = Number(chainId) * 2;
	return v === chainIdDoubled + 35 || v === chainIdDoubled + 36;
}

/**
 * An Ethereum non-typed (legacy) transaction
 */
// eslint-disable-next-line no-use-before-define
export class Transaction extends BaseTransaction<Transaction> {
	public readonly gasPrice: bigint;

	public readonly common: Common;

	/**
	 * Instantiate a transaction from a data dictionary.
	 *
	 * Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }
	 *
	 * Notes:
	 * - All parameters are optional and have some basic default values
	 */
	public static fromTxData(txData: TxData, opts: TxOptions = {}) {
		return new Transaction(txData, opts);
	}

	/**
	 * Instantiate a transaction from the serialized tx.
	 *
	 * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
	 */
	public static fromSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
		const values = arrToBufArr(RLP.decode(Uint8Array.from(serialized))) as Buffer[];

		if (!Array.isArray(values)) {
			throw new Error('Invalid serialized tx input. Must be array');
		}

		return this.fromValuesArray(values, opts);
	}

	/**
	 * Create a transaction from a values array.
	 *
	 * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
	 */
	public static fromValuesArray(values: TxValuesArray, opts: TxOptions = {}) {
		// If length is not 6, it has length 9. If v/r/s are empty Buffers, it is still an unsigned transaction
		// This happens if you get the RLP data from `raw()`
		if (values.length !== 6 && values.length !== 9) {
			throw new Error(
				'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).',
			);
		}

		const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values;

		validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s });

		return new Transaction(
			{
				nonce,
				gasPrice,
				gasLimit,
				to,
				value,
				data,
				v,
				r,
				s,
			},
			opts,
		);
	}

	/**
	 * This constructor takes the values, validates them, assigns them and freezes the object.
	 *
	 * It is not recommended to use this constructor directly. Instead use
	 * the static factory methods to assist in creating a Transaction object from
	 * varying data types.
	 */
	public constructor(txData: TxData, opts: TxOptions = {}) {
		super({ ...txData, type: TRANSACTION_TYPE }, opts);

		this.common = this._validateTxV(this.v, opts.common);

		this.gasPrice = bufferToBigInt(toBuffer(txData.gasPrice === '' ? '0x' : txData.gasPrice));

		if (this.gasPrice * this.gasLimit > MAX_INTEGER) {
			const msg = this._errorMsg('gas limit * gasPrice cannot exceed MAX_INTEGER (2^256-1)');
			throw new Error(msg);
		}
		this._validateCannotExceedMaxInteger({ gasPrice: this.gasPrice });
		BaseTransaction._validateNotArray(txData);

		if (this.common.gteHardfork('spuriousDragon')) {
			if (!this.isSigned()) {
				this.activeCapabilities.push(Capability.EIP155ReplayProtection);
			} else {
				// EIP155 spec:
				// If block.number >= 2,675,000 and v = CHAIN_ID * 2 + 35 or v = CHAIN_ID * 2 + 36
				// then when computing the hash of a transaction for purposes of signing or recovering
				// instead of hashing only the first six elements (i.e. nonce, gasprice, startgas, to, value, data)
				// hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0.
				// v and chain ID meet EIP-155 conditions
				// eslint-disable-next-line no-lonely-if
				if (meetsEIP155(this.v!, this.common.chainId())) {
					this.activeCapabilities.push(Capability.EIP155ReplayProtection);
				}
			}
		}

		const freeze = opts?.freeze ?? true;
		if (freeze) {
			Object.freeze(this);
		}
	}

	/**
	 * Returns a Buffer Array of the raw Buffers of the legacy transaction, in order.
	 *
	 * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
	 *
	 * For legacy txs this is also the correct format to add transactions
	 * to a block with {@link Block.fromValuesArray} (use the `serialize()` method
	 * for typed txs).
	 *
	 * For an unsigned tx this method returns the empty Buffer values
	 * for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
	 * representation have a look at {@link Transaction.getMessageToSign}.
	 */
	public raw(): TxValuesArray {
		return [
			bigIntToUnpaddedBuffer(this.nonce),
			bigIntToUnpaddedBuffer(this.gasPrice),
			bigIntToUnpaddedBuffer(this.gasLimit),
			this.to !== undefined ? this.to.buf : Buffer.from([]),
			bigIntToUnpaddedBuffer(this.value),
			this.data,
			this.v !== undefined ? bigIntToUnpaddedBuffer(this.v) : Buffer.from([]),
			this.r !== undefined ? bigIntToUnpaddedBuffer(this.r) : Buffer.from([]),
			this.s !== undefined ? bigIntToUnpaddedBuffer(this.s) : Buffer.from([]),
		];
	}

	/**
	 * Returns the serialized encoding of the legacy transaction.
	 *
	 * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
	 *
	 * For an unsigned tx this method uses the empty Buffer values for the
	 * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
	 * representation for external signing use {@link Transaction.getMessageToSign}.
	 */
	public serialize(): Buffer {
		return Buffer.from(RLP.encode(bufArrToArr(this.raw())));
	}

	private _getMessageToSign() {
		const values = [
			bigIntToUnpaddedBuffer(this.nonce),
			bigIntToUnpaddedBuffer(this.gasPrice),
			bigIntToUnpaddedBuffer(this.gasLimit),
			this.to !== undefined ? this.to.buf : Buffer.from([]),
			bigIntToUnpaddedBuffer(this.value),
			this.data,
		];

		if (this.supports(Capability.EIP155ReplayProtection)) {
			values.push(toBuffer(this.common.chainId()));
			values.push(unpadBuffer(toBuffer(0)));
			values.push(unpadBuffer(toBuffer(0)));
		}

		return values;
	}

	/**
	 * Returns the unsigned tx (hashed or raw), which can be used
	 * to sign the transaction (e.g. for sending to a hardware wallet).
	 *
	 * Note: the raw message message format for the legacy tx is not RLP encoded
	 * and you might need to do yourself with:
	 *
	 * ```javascript
	 * import { bufArrToArr } from '../util'
	 * import { RLP } from '../rlp'
	 * const message = tx.getMessageToSign(false)
	 * const serializedMessage = Buffer.from(RLP.encode(bufArrToArr(message))) // use this for the HW wallet input
	 * ```
	 *
	 * @param hashMessage - Return hashed message if set to true (default: true)
	 */
	public getMessageToSign(hashMessage: false): Buffer[];
	public getMessageToSign(hashMessage?: true): Buffer;
	public getMessageToSign(hashMessage = true) {
		const message = this._getMessageToSign();
		if (hashMessage) {
			return Buffer.from(keccak256(RLP.encode(bufArrToArr(message))));
		}
		return message;
	}

	/**
	 * The amount of gas paid for the data in this tx
	 */
	public getDataFee(): bigint {
		if (this.cache.dataFee && this.cache.dataFee.hardfork === this.common.hardfork()) {
			return this.cache.dataFee.value;
		}

		if (Object.isFrozen(this)) {
			this.cache.dataFee = {
				value: super.getDataFee(),
				hardfork: this.common.hardfork(),
			};
		}

		return super.getDataFee();
	}

	/**
	 * The up front amount that an account must have for this transaction to be valid
	 */
	public getUpfrontCost(): bigint {
		return this.gasLimit * this.gasPrice + this.value;
	}

	/**
	 * Computes a sha3-256 hash of the serialized tx.
	 *
	 * This method can only be used for signed txs (it throws otherwise).
	 * Use {@link Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
	 */
	public hash(): Buffer {
		if (!this.isSigned()) {
			const msg = this._errorMsg('Cannot call hash method if transaction is not signed');
			throw new Error(msg);
		}

		if (Object.isFrozen(this)) {
			if (!this.cache.hash) {
				this.cache.hash = Buffer.from(keccak256(RLP.encode(bufArrToArr(this.raw()))));
			}
			return this.cache.hash;
		}

		return Buffer.from(keccak256(RLP.encode(bufArrToArr(this.raw()))));
	}

	/**
	 * Computes a sha3-256 hash which can be used to verify the signature
	 */
	public getMessageToVerifySignature() {
		if (!this.isSigned()) {
			const msg = this._errorMsg('This transaction is not signed');
			throw new Error(msg);
		}
		const message = this._getMessageToSign();
		// eslint
		return Buffer.from(keccak256(RLP.encode(bufArrToArr(message))));
	}

	/**
	 * Returns the public key of the sender
	 */
	public getSenderPublicKey(): Buffer {
		const msgHash = this.getMessageToVerifySignature();

		const { v, r, s } = this;

		this._validateHighS();

		try {
			return ecrecover(
				msgHash,
				v!,
				bigIntToUnpaddedBuffer(r!),
				bigIntToUnpaddedBuffer(s!),
				this.supports(Capability.EIP155ReplayProtection)
					? this.common.chainId()
					: undefined,
			);
		} catch (e: any) {
			const msg = this._errorMsg('Invalid Signature');
			throw new Error(msg);
		}
	}

	/**
	 * Process the v, r, s values from the `sign` method of the base transaction.
	 */
	protected _processSignature(_v: bigint, r: Buffer, s: Buffer) {
		let v = _v;
		if (this.supports(Capability.EIP155ReplayProtection)) {
			v += this.common.chainId() * BigInt(2) + BigInt(8);
		}

		const opts = { ...this.txOptions, common: this.common };

		return Transaction.fromTxData(
			{
				nonce: this.nonce,
				gasPrice: this.gasPrice,
				gasLimit: this.gasLimit,
				to: this.to,
				value: this.value,
				data: this.data,
				v,
				r: bufferToBigInt(r),
				s: bufferToBigInt(s),
			},
			opts,
		);
	}

	/**
	 * Returns an object with the JSON representation of the transaction.
	 */
	public toJSON(): JsonTx {
		return {
			nonce: bigIntToHex(this.nonce),
			gasPrice: bigIntToHex(this.gasPrice),
			gasLimit: bigIntToHex(this.gasLimit),
			to: this.to !== undefined ? this.to.toString() : undefined,
			value: bigIntToHex(this.value),
			data: `0x${this.data.toString('hex')}`,
			v: this.v !== undefined ? bigIntToHex(this.v) : undefined,
			r: this.r !== undefined ? bigIntToHex(this.r) : undefined,
			s: this.s !== undefined ? bigIntToHex(this.s) : undefined,
		};
	}

	/**
	 * Validates tx's `v` value
	 */
	private _validateTxV(_v?: bigint, common?: Common): Common {
		let chainIdBigInt;
		const v = _v !== undefined ? Number(_v) : undefined;
		// Check for valid v values in the scope of a signed legacy tx
		if (v !== undefined) {
			// v is 1. not matching the EIP-155 chainId included case and...
			// v is 2. not matching the classic v=27 or v=28 case
			if (v < 37 && v !== 27 && v !== 28) {
				throw new Error(
					`Legacy txs need either v = 27/28 or v >= 37 (EIP-155 replay protection), got v = ${v}`,
				);
			}
		}

		// No unsigned tx and EIP-155 activated and chain ID included
		if (
			v !== undefined &&
			v !== 0 &&
			(!common || common.gteHardfork('spuriousDragon')) &&
			v !== 27 &&
			v !== 28
		) {
			if (common) {
				if (!meetsEIP155(BigInt(v), common.chainId())) {
					throw new Error(
						`Incompatible EIP155-based V ${v} and chain id ${common.chainId()}. See the Common parameter of the Transaction constructor to set the chain id.`,
					);
				}
			} else {
				// Derive the original chain ID
				let numSub;
				if ((v - 35) % 2 === 0) {
					numSub = 35;
				} else {
					numSub = 36;
				}
				// Use derived chain ID to create a proper Common
				chainIdBigInt = BigInt(v - numSub) / BigInt(2);
			}
		}
		return this._getCommon(common, chainIdBigInt);
	}

	/**
	 * Return a compact error string representation of the object
	 */
	public errorStr() {
		let errorStr = this._getSharedErrorPostfix();
		errorStr += ` gasPrice=${this.gasPrice}`;
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
}
