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

import { JsonRpcError, TransactionReceipt, HexString } from 'web3-types';
import {
	ERR_CONTRACT,
	ERR_CONTRACT_ABI_MISSING,
	ERR_CONTRACT_EXECUTION_REVERTED,
	ERR_CONTRACT_EVENT_NOT_EXISTS,
	ERR_CONTRACT_INSTANTIATION,
	ERR_CONTRACT_MISSING_ADDRESS,
	ERR_CONTRACT_MISSING_DEPLOY_DATA,
	ERR_CONTRACT_MISSING_FROM_ADDRESS,
	ERR_CONTRACT_REQUIRED_CALLBACK,
	ERR_CONTRACT_RESERVED_EVENT,
	ERR_CONTRACT_RESOLVER_MISSING,
} from '../error_codes';
import { Web3Error } from '../web3_error_base';

export class Web3ContractError extends Web3Error {
	public code = ERR_CONTRACT;
	public receipt?: TransactionReceipt;

	public constructor(message: string, receipt?: TransactionReceipt) {
		super(message);

		this.receipt = receipt;
	}
}
export class ResolverMethodMissingError extends Web3Error {
	public code = ERR_CONTRACT_RESOLVER_MISSING;

	public constructor(public address: string, public name: string) {
		super(`The resolver at ${address} does not implement requested method: "${name}".`);
	}

	public toJSON() {
		return { ...super.toJSON(), address: this.address, name: this.name };
	}
}

export class ContractMissingABIError extends Web3Error {
	public code = ERR_CONTRACT_ABI_MISSING;

	public constructor() {
		super(
			'You must provide the json interface of the contract when instantiating a contract object.',
		);
	}
}

export class ContractOnceRequiresCallbackError extends Web3Error {
	public code = ERR_CONTRACT_REQUIRED_CALLBACK;

	public constructor() {
		super('Once requires a callback as the second parameter.');
	}
}

export class ContractEventDoesNotExistError extends Web3Error {
	public code = ERR_CONTRACT_EVENT_NOT_EXISTS;

	public constructor(public eventName: string) {
		super(`Event "${eventName}" doesn't exist in this contract.`);
	}

	public toJSON() {
		return { ...super.toJSON(), eventName: this.eventName };
	}
}

export class ContractReservedEventError extends Web3Error {
	public code = ERR_CONTRACT_RESERVED_EVENT;

	public constructor(public type: string) {
		super(`Event "${type}" doesn't exist in this contract.`);
	}

	public toJSON() {
		return { ...super.toJSON(), type: this.type };
	}
}

export class ContractMissingDeployDataError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_DEPLOY_DATA;

	public constructor() {
		super(`No "data" specified in neither the given options, nor the default options.`);
	}
}

export class ContractNoAddressDefinedError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_ADDRESS;

	public constructor() {
		super("This contract object doesn't have address set yet, please set an address first.");
	}
}

export class ContractNoFromAddressDefinedError extends Web3Error {
	public code = ERR_CONTRACT_MISSING_FROM_ADDRESS;

	public constructor() {
		super('No "from" address specified in neither the given options, nor the default options.');
	}
}

export class ContractInstantiationError extends Web3Error {
	public code = ERR_CONTRACT_INSTANTIATION;
}

/**
 * This class is expected to be set as an `innerError` inside ContractExecutionError
 * The properties would be typically decoded from the `data` if it was encoded according to EIP-838
 */
export class Eip838ExecutionError extends Web3ContractError {
	public readonly name: string;
	public code: number;
	public data?: HexString;
	public errorName?: string;
	public errorSignature?: string;
	public errorArgs?: { [K in string]: unknown };

	public constructor(code: number, message: string, data?: HexString) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.data = data;
	}

	public setDecodedProperties(
		errorName: string,
		errorSignature?: string,
		errorArgs?: { [K in string]: unknown },
	) {
		this.errorName = errorName;
		this.errorSignature = errorSignature;
		this.errorArgs = errorArgs;
	}
}

/**
 * Used when an error is raised while executing a function inside a smart contract.
 * The data is expected to be encoded according to EIP-848.
 */
export class ContractExecutionError extends Web3ContractError {
	public innerError: Eip838ExecutionError;

	public constructor(rpcError: JsonRpcError) {
		super('Error happened while trying to execute a function inside a smart contract');
		this.code = ERR_CONTRACT_EXECUTION_REVERTED;
		this.innerError = new Eip838ExecutionError(
			rpcError.code,
			rpcError.message,
			rpcError.data as string,
		);
	}
}
