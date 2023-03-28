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
import { Address } from './address';
import { bigIntToHex } from './bytes';
import { TypeOutput, toType } from './types';

import type { AddressLike, BigIntLike } from './types';

/**
 * Flexible input data type for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 */
export type WithdrawalData = {
	index: BigIntLike;
	validatorIndex: BigIntLike;
	address: AddressLike;
	amount: BigIntLike;
};

/**
 * JSON RPC interface for EIP-4895 withdrawal data with amount in Gwei to
 * match CL representation and for eventual ssz withdrawalsRoot
 */
export interface JsonRpcWithdrawal {
	index: string; // QUANTITY - bigint 8 bytes
	validatorIndex: string; // QUANTITY - bigint 8 bytes
	address: string; // DATA, 20 Bytes  address to withdraw to
	amount: string; // QUANTITY - bigint amount in Gwei 8 bytes
}

export type WithdrawalBuffer = [Buffer, Buffer, Buffer, Buffer];

/**
 * Representation of EIP-4895 withdrawal data
 */
export class Withdrawal {
	public readonly index: bigint;
	public readonly validatorIndex: bigint;
	public readonly address: Address;
	public readonly amount: bigint;

	/**
	 * This constructor assigns and validates the values.
	 * Use the static factory methods to assist in creating a Withdrawal object from varying data types.
	 * Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot
	 *
	 * @param index
	 * @param validatorIndex
	 * @param address
	 * @param amount
	 */
	public constructor(
		index: bigint,
		validatorIndex: bigint,
		address: Address,
		/**
		 * withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot
		 */
		amount: bigint,
	) {
		this.index = index;
		this.validatorIndex = validatorIndex;
		this.address = address;
		this.amount = amount;
	}

	public static fromWithdrawalData(withdrawalData: WithdrawalData) {
		const {
			index: indexData,
			validatorIndex: validatorIndexData,
			address: addressData,
			amount: amountData,
		} = withdrawalData;
		const index = toType(indexData, TypeOutput.BigInt);
		const validatorIndex = toType(validatorIndexData, TypeOutput.BigInt);
		const address = new Address(toType(addressData, TypeOutput.Buffer));
		const amount = toType(amountData, TypeOutput.BigInt);

		return new Withdrawal(index, validatorIndex, address, amount);
	}

	public static fromValuesArray(withdrawalArray: WithdrawalBuffer) {
		if (withdrawalArray.length !== 4) {
			throw Error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Invalid withdrawalArray length expected=4 actual=${withdrawalArray?.length}`,
			);
		}
		const [index, validatorIndex, address, amount] = withdrawalArray;
		return Withdrawal.fromWithdrawalData({ index, validatorIndex, address, amount });
	}

	/**
	 * Convert a withdrawal to a buffer array
	 * @param withdrawal the withdrawal to convert
	 * @returns buffer array of the withdrawal
	 */
	public static toBufferArray(withdrawal: Withdrawal | WithdrawalData): WithdrawalBuffer {
		const { index, validatorIndex, address, amount } = withdrawal;
		const indexBuffer =
			toType(index, TypeOutput.BigInt) === BigInt(0)
				? Buffer.alloc(0)
				: toType(index, TypeOutput.Buffer);
		const validatorIndexBuffer =
			toType(validatorIndex, TypeOutput.BigInt) === BigInt(0)
				? Buffer.alloc(0)
				: toType(validatorIndex, TypeOutput.Buffer);
		let addressBuffer;
		if (address instanceof Address) {
			addressBuffer = address.buf;
		} else {
			addressBuffer = toType(address, TypeOutput.Buffer);
		}
		const amountBuffer =
			toType(amount, TypeOutput.BigInt) === BigInt(0)
				? Buffer.alloc(0)
				: toType(amount, TypeOutput.Buffer);

		return [indexBuffer, validatorIndexBuffer, addressBuffer, amountBuffer];
	}

	public raw() {
		return Withdrawal.toBufferArray(this);
	}

	public toValue() {
		return {
			index: this.index,
			validatorIndex: this.validatorIndex,
			address: this.address.buf,
			amount: this.amount,
		};
	}

	public toJSON() {
		return {
			index: bigIntToHex(this.index),
			validatorIndex: bigIntToHex(this.validatorIndex),
			address: `0x${this.address.buf.toString('hex')}`,
			amount: bigIntToHex(this.amount),
		};
	}
}
