import { TransactionCall, TransactionWithSender } from 'web3-common';
import { AbiFunctionFragment } from 'web3-eth-abi';
import { mergeDeep } from 'web3-utils';
import { encodeMethodABI } from './encoding';
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
}): TransactionWithSender & { data: string } => {
	if (!options?.to && !contractOptions.address) {
		throw new Error('Contract address not specified');
	}

	if (!options?.from && !contractOptions.from) {
		throw new Error('Contract "from" address not specified');
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
	) as unknown as TransactionWithSender & { data: string };

	if (!txParams.data) {
		txParams = {
			...txParams,
			data: encodeMethodABI(abi, params, txParams.data),
		};
	}

	return txParams;
};

export const getTxCallParams = ({
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
		throw new Error('Contract address not specified');
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
		throw new Error('Contract address not specified');
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
