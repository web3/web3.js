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

import { TransactionWithSender } from 'web3-common';
import { AbiFunctionFragment } from 'web3-eth-abi';
import { mergeDeep } from 'web3-utils';
import { TransactionCall } from 'web3-eth';
import { encodeMethodABI } from './encoding';
import { Web3ContractError } from './errors';
import { NonPayableCallOptions, PayableCallOptions, ContractOptions } from './types';

export const getSendTxParams = ({
	abi,
	params,
	options,
	contractOptions,
}: {
	abi: AbiFunctionFragment;
	params: unknown[];
	options?: PayableCallOptions | NonPayableCallOptions;
	contractOptions: ContractOptions;
}): TransactionCall => {
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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	if (!txParams.data) {
		txParams = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data),
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
	options?: PayableCallOptions | NonPayableCallOptions;
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
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	if (!txParams.data) {
		txParams = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data),
		};
	}

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
}): Partial<TransactionWithSender> => {
	if (!options?.to && !contractOptions.address) {
		throw new Web3ContractError('Contract address not specified');
	}

	let txParams = mergeDeep(
		{
			to: contractOptions.address,
			gas: contractOptions.gas,
			gasPrice: contractOptions.gasPrice,
			from: contractOptions.from,
			data: contractOptions.data,
		},
		options as unknown as Record<string, unknown>,
	) as unknown as TransactionCall;

	if (!txParams.data) {
		txParams = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data),
		};
	}

	return txParams as TransactionWithSender;
};
