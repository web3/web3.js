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

import { TransactionReceipt, HexString } from 'web3-types';
import { ERR_CONTRACT, Web3Error } from 'web3-errors';

export class Web3ContractError extends Web3Error {
	public code = ERR_CONTRACT;
	public receipt?: TransactionReceipt;

	public constructor(message: string, receipt?: TransactionReceipt) {
		super(message);

		this.receipt = receipt;
	}
}

/**
 * Used when an error is raised while executing a function inside a smart contract.
 * The data is expected to be encoded according to EIP-848.
 */
export class Web3ContractExecutionError extends Web3ContractError {
	public data: HexString;
	public errorName?: string;
	public errorSignature?: string;
	public errorArgs?: { [K in string]: unknown };

	public constructor(
		code: number,
		message: string,
		data: HexString,
		errorName?: string,
		errorSignature?: string,
		errorArgs?: { [K in string]: unknown },
	) {
		super(message);
		this.code = code; // TODO: revisit to check if passing this code is better or using ERR_CONTRACT_EXECUTION_REVERTED
		this.data = data;
		this.errorName = errorName;
		this.errorSignature = errorSignature;
		this.errorArgs = errorArgs;
	}
}
