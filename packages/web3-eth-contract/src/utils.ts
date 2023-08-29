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

const dataInputEncodeMethodHelper = (
	txParams: TransactionCall,
	abi: AbiFunctionFragment,
	params: unknown[],
): TransactionCall => {
	let tx = txParams;
	if (tx.input) {
		tx = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	} else if (tx.data) {
		tx = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data as HexString),
		};
	} else {
		// default to using input
		tx = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	}
	return tx;
};

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
	const deploymentCall =
		options?.input ?? options?.data ?? contractOptions.input ?? contractOptions.data;
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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;
	txParams = dataInputEncodeMethodHelper(txParams, abi, params);
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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	txParams = {
		...txParams,
		input: encodeMethodABI(abi, params, txParams.input ? toHex(txParams.input) : undefined),
		data: encodeMethodABI(abi, params, txParams.data ? toHex(txParams.data) : undefined),
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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	if (txParams.input) {
		txParams.input = toHex(txParams.input);
	}
	if (txParams.data) {
		txParams.data = toHex(txParams.data);
	}

	txParams = dataInputEncodeMethodHelper(txParams, abi, params);

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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionForAccessList;

	if (txParams.input) {
		txParams = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	} else if (txParams.data) {
		txParams = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data as HexString),
		};
	} else {
		txParams = {
			...txParams,
			input: encodeMethodABI(abi, params, txParams.input as HexString),
		};
	}

	return txParams;
};
