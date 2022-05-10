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

import {
	ERR_CONTRACT_ABI_MISSING,
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
