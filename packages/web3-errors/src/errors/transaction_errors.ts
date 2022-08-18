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

/* eslint-disable max-classes-per-file */

import { TransactionReceipt } from 'web3-types';
import {
	ERR_RAW_TX_UNDEFINED,
	ERR_TX,
	ERR_TX_CONTRACT_NOT_STORED,
	ERR_TX_NO_CONTRACT_ADDRESS,
	ERR_TX_OUT_OF_GAS,
	ERR_TX_REVERT_INSTRUCTION,
	ERR_TX_REVERT_TRANSACTION,
	ERR_TX_REVERT_WITHOUT_REASON,
	ERR_TX_NOT_FOUND,
} from '../error_codes';
import { Web3Error } from '../web3_error_base';

export class TransactionError<ReceiptType = TransactionReceipt> extends Web3Error {
	public code = ERR_TX;

	public constructor(message: string, public receipt?: ReceiptType) {
		super(message);
	}

	public toJSON() {
		return { ...super.toJSON(), receipt: this.receipt };
	}
}

export class RevertInstructionError extends Web3Error {
	public code = ERR_TX_REVERT_INSTRUCTION;

	public constructor(public reason: string, public signature: string) {
		super(`Your request got reverted with the following reason string: ${reason}`);
	}

	public toJSON() {
		return { ...super.toJSON(), reason: this.reason, signature: this.signature };
	}
}

export class TransactionRevertError extends Web3Error {
	public code = ERR_TX_REVERT_TRANSACTION;

	public constructor(
		public reason: string,
		public signature?: string,
		public receipt?: TransactionReceipt,
	) {
		super(
			`Transaction has been reverted by the EVM:\n ${JSON.stringify(receipt, undefined, 2)}`,
		);
	}

	public toJSON() {
		return {
			...super.toJSON(),
			reason: this.reason,
			signature: this.signature,
			receipt: this.receipt,
		};
	}
}

export class NoContractAddressFoundError extends TransactionError {
	public constructor(receipt: TransactionReceipt) {
		super("The transaction receipt didn't contain a contract address.", receipt);
		this.code = ERR_TX_NO_CONTRACT_ADDRESS;
	}

	public toJSON() {
		return { ...super.toJSON(), receipt: this.receipt };
	}
}

export class ContractCodeNotStoredError extends TransactionError {
	public constructor(receipt: TransactionReceipt) {
		super("The contract code couldn't be stored, please check your gas limit.", receipt);
		this.code = ERR_TX_CONTRACT_NOT_STORED;
	}
}

export class TransactionRevertedWithoutReasonError extends TransactionError {
	public constructor(receipt: TransactionReceipt) {
		super(
			`Transaction has been reverted by the EVM:\n ${JSON.stringify(receipt, undefined, 2)}`,
			receipt,
		);
		this.code = ERR_TX_REVERT_WITHOUT_REASON;
	}
}

export class TransactionOutOfGasError extends TransactionError {
	public constructor(receipt: TransactionReceipt) {
		super(
			`Transaction ran out of gas. Please provide more gas:\n ${JSON.stringify(
				receipt,
				undefined,
				2,
			)}`,
			receipt,
		);
		this.code = ERR_TX_OUT_OF_GAS;
	}
}

export class UndefinedRawTransactionError extends TransactionError {
	public constructor() {
		super(`Raw transaction undefined`);
		this.code = ERR_RAW_TX_UNDEFINED;
	}
}
export class TransactionNotFound extends TransactionError {
	public constructor() {
		super('Transaction not found');
		this.code = ERR_TX_NOT_FOUND;
	}
}
