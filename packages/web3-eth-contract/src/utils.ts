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

import { Web3ContractError } from 'web3-errors';
import {
	TransactionForAccessList,
	AbiFunctionFragment,
	TransactionWithSenderAPI,
	TransactionCall,
	HexString,
	Address,
	NonPayableCallOptions,
	PayableCallOptions,
	ContractInitOptions,
} from 'web3-types';
import { isNullish, mergeDeep, toHex } from 'web3-utils';
import { encodeMethodABI } from './encoding.js';
import { ContractOptions, Web3ContractContext } from './types.js';

export const getSendTxParams = ({
	abi,
	params,
	options,
	contractOptions,
}: {
	abi: AbiFunctionFragment;
	params: unknown[];
	options?: (PayableCallOptions | NonPayableCallOptions) & {
		input?: HexString;
		data?: HexString;
		to?: Address;
	};
	contractOptions: ContractOptions;
}): TransactionCall => {
	const deploymentCall = options?.input ?? options?.data ?? contractOptions.input;

	if (!deploymentCall && !options?.to && !contractOptions.address) {
		throw new Web3ContractError('Contract address not specified');
	}

	if (!options?.from && !contractOptions.from) {
		throw new Web3ContractError('Contract "from" address not specified');
	}

	let txParams = mergeDeep(
		{
			to: contractOptions.address,
			gas: contractOptions.gas,
			gasPrice: contractOptions.gasPrice,
			from: contractOptions.from,
			input: contractOptions.input,
			maxPriorityFeePerGas: contractOptions.maxPriorityFeePerGas,
			maxFeePerGas: contractOptions.maxFeePerGas,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	if (!txParams.input || abi.type === 'constructor') {
		txParams = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	}

	return txParams;
};

export const getEthTxCallParams = ({
	abi,
	params,
	options,
	contractOptions,
}: {
	abi: AbiFunctionFragment;
	params: unknown[];
	options?: (PayableCallOptions | NonPayableCallOptions) & { to?: Address };
	contractOptions: ContractOptions;
}): TransactionCall => {
	if (!options?.to && !contractOptions.address) {
		throw new Web3ContractError('Contract address not specified');
	}

	let txParams = mergeDeep(
		{
			to: contractOptions.address,
			gas: contractOptions.gas,
			gasPrice: contractOptions.gasPrice,
			from: contractOptions.from,
			input: contractOptions.input,
			maxPriorityFeePerGas: contractOptions.maxPriorityFeePerGas,
			maxFeePerGas: contractOptions.maxFeePerGas,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	txParams = {
		...txParams,
		input: encodeMethodABI(abi, params, txParams.input ? toHex(txParams.input) : undefined),
	};

	return txParams;
};

export const getEstimateGasParams = ({
	abi,
	params,
	options,
	contractOptions,
}: {
	abi: AbiFunctionFragment;
	params: unknown[];
	options?: PayableCallOptions | NonPayableCallOptions;
	contractOptions: ContractOptions;
}): Partial<TransactionWithSenderAPI> => {
	let txParams = mergeDeep(
		{
			to: contractOptions.address,
			gas: contractOptions.gas,
			gasPrice: contractOptions.gasPrice,
			from: contractOptions.from,
			input: contractOptions.input,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	txParams = {
		...txParams,
		input: encodeMethodABI(abi, params, txParams.input ? toHex(txParams.input) : undefined),
	};

	return txParams as TransactionWithSenderAPI;
};

export const isContractInitOptions = (options: unknown): options is ContractInitOptions =>
	typeof options === 'object' &&
	!isNullish(options) &&
	[
		'input',
		'data',
		'from',
		'gas',
		'gasPrice',
		'gasLimit',
		'address',
		'jsonInterface',
		'syncWithContext',
	].some(key => key in options);

export const isWeb3ContractContext = (options: unknown): options is Web3ContractContext =>
	typeof options === 'object' && !isNullish(options) && !isContractInitOptions(options);

export const getCreateAccessListParams = ({
	abi,
	params,
	options,
	contractOptions,
}: {
	abi: AbiFunctionFragment;
	params: unknown[];
	options?: (PayableCallOptions | NonPayableCallOptions) & { to?: Address };
	contractOptions: ContractOptions;
}): TransactionForAccessList => {
	if (!options?.to && !contractOptions.address) {
		throw new Web3ContractError('Contract address not specified');
	}

	if (!options?.from && !contractOptions.from) {
		throw new Web3ContractError('Contract "from" address not specified');
	}

	let txParams = mergeDeep(
		{
			to: contractOptions.address,
			gas: contractOptions.gas,
			gasPrice: contractOptions.gasPrice,
			from: contractOptions.from,
			input: contractOptions.input,
			maxPriorityFeePerGas: contractOptions.maxPriorityFeePerGas,
			maxFeePerGas: contractOptions.maxFeePerGas,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionForAccessList;

	if (!txParams.input || abi.type === 'constructor') {
		txParams = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	}

	return txParams;
};
