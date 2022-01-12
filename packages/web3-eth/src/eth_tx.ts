import { AccessList, EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	Address,
	convertToValidType,
	HexString,
	HexStringBytes,
	Numbers,
	ValidReturnTypes,
	ValidTypes,
} from 'web3-utils';

import Web3Eth from './index';

export type chain = 'goerli' | 'kovan' | 'mainnet' | 'rinkeby' | 'ropsten' | 'sepolia';
export type hardfork =
	| 'arrowGlacier'
	| 'berlin'
	| 'byzantium'
	| 'chainstart'
	| 'constantinople'
	| 'dao'
	| 'homestead'
	| 'istanbul'
	| 'london'
	| 'merge'
	| 'muirGlacier'
	| 'petersburg'
	| 'shanghai'
	| 'spuriousDragon'
	| 'tangerineWhistle';

export interface CustomChain {
	name?: string;
	networkId: Numbers;
	chainId: Numbers;
}

export interface Common {
	customChain: CustomChain;
	baseChain?: chain;
	hardfork?: hardfork;
}

export interface Transaction<NumberType = Numbers> {
	from?: Address;
	to?: Address;
	value?: NumberType;
	gas?: NumberType;
	gasPrice?: NumberType;
	type?: NumberType;
	maxFeePerGas?: NumberType;
	maxPriorityFeePerGas?: NumberType;
	accessList?: AccessList;
	data?: HexStringBytes;
	nonce?: NumberType;
	chain?: chain;
	hardfork?: hardfork;
	chainId?: NumberType;
	common?: Common;
	gasLimit?: NumberType;
	v?: NumberType;
	r?: NumberType;
	s?: NumberType;
}

export function formatTransaction<DesiredType extends ValidTypes, ReturnType = ValidReturnTypes[DesiredType]>(
	transaction: Transaction,
	desiredType: DesiredType,
	overrideMethod?: (transaction: Transaction) => Transaction<ReturnType>,
): Transaction<ReturnType> {
	if (overrideMethod !== undefined) return overrideMethod(transaction);
	const formattedTransaction = {
		...transaction,
		value: convertToValidType(transaction.value, desiredType),
		gas: convertToValidType(transaction.gas, desiredType),
		gasPrice: convertToValidType(transaction.gasPrice, desiredType),
		type: convertToValidType(transaction.type, desiredType),
		maxFeePerGas: convertToValidType(transaction.maxFeePerGas, desiredType),
		maxPriorityFeePerGas: convertToValidType(transaction.maxPriorityFeePerGas, desiredType),
		nonce: convertToValidType(transaction.nonce, desiredType),
		chainId: convertToValidType(transaction.chainId, desiredType),
		gasLimit: convertToValidType(transaction.gasLimit, desiredType),
		v: convertToValidType(transaction.v, desiredType),
		r: convertToValidType(transaction.r, desiredType),
		s: convertToValidType(transaction.s, desiredType),
		common: {
			...transaction.common,
			customChain: {
				...transaction.common?.customChain,
				networkId: convertToValidType(
					transaction.common?.customChain.networkId,
					desiredType,
				),
				chainId: convertToValidType(transaction.common?.customChain.chainId, desiredType),
			},
		},
	};
	return (formattedTransaction as Transaction<ReturnType>)
};

export const detectTransactionType = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => Numbers | undefined,
): Numbers | undefined => {
	if (overrideMethod !== undefined) return overrideMethod(transaction);
	if (transaction.type !== undefined) return transaction.type;

	if (transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined)
		return '0x2';
	if (transaction.hardfork === 'berlin') return '0x2';
	if (transaction.common?.hardfork === 'berlin') return '0x2';

	if (transaction.accessList !== undefined) return '0x1';

	return undefined;
};

const validateCustomChainInfo = (transaction: Transaction) => {
	if (transaction.common !== undefined) {
		if (transaction.common.customChain === undefined)
			// TODO - Replace error
			throw new Error('If tx.common is provided it must have tx.common.customChain');
		if (transaction.common.customChain.chainId === undefined)
			// TODO - Replace error
			throw new Error(
				'If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId',
			);
		if (
			transaction.chainId !== undefined &&
			transaction.chainId !== transaction.common.customChain.chainId
		)
			// TODO - Replace error
			throw new Error('Chain Id doesnt match in tx.chainId tx.common.customChain.chainId');
	}
};

const validateChainInfo = (transaction: Transaction) => {
	if (
		transaction.common !== undefined &&
		transaction.chain !== undefined &&
		transaction.hardfork !== undefined
	)
		// TODO - Replace error
		throw new Error(
			'Please provide the @ethereumjs/common object or the chain and hardfork property but not all together.',
		);
	if (
		(transaction.chain !== undefined && transaction.hardfork === undefined) ||
		(transaction.hardfork !== undefined && transaction.chain === undefined)
	)
		// TODO - Replace error
		throw new Error(
			`When specifying chain and hardfork, both values must be defined. Received "chain": ${transaction.chain}, "hardfork": ${transaction.hardfork}`,
		);
}

const validateGas = (transaction: Transaction<HexString>) => {
	if (
		transaction.gas === undefined &&
		transaction.gasLimit === undefined &&
		transaction.maxPriorityFeePerGas === undefined &&
		transaction.maxFeePerGas === undefined
	)
		// TODO - Replace error
		throw new Error('"gas" is missing');
	if (transaction.gas !== undefined && transaction.gasPrice !== undefined) {
		// This check is verifying gas and gasPrice aren't less than 0.
		// transaction's number properties have been converted to HexStrings.
		// JavaScript doesn't handle negative hex strings e.g. -0x1, but our
		// numberToHex method does. -0x1 < 0 would result in false, so we must check if
		// hex string is negative via the inclusion of -
		if (
			(transaction.gas as HexString).charAt(0) === '-' ||
			(transaction.gasPrice as HexString).charAt(0) === '-'
		)
			// TODO - Replace error
			throw new Error('Gas or gasPrice is lower than 0');
	} else {
		if (
			(transaction.maxFeePerGas as HexString).charAt(0) === '-' ||
			(transaction.maxPriorityFeePerGas as HexString).charAt(0) === '-'
		)
			// TODO - Replace error
			throw new Error('maxPriorityFeePerGas or maxFeePerGas is lower than 0');
	}

	const hasEip1559 =
		transaction.maxFeePerGas !== undefined || transaction.maxPriorityFeePerGas !== undefined;
	if (transaction.gasPrice !== undefined && (transaction.type === '0x2' || hasEip1559))
		// TODO - Replace error
		throw new Error("eip-1559 transactions don't support gasPrice");
	if ((transaction.type === '0x0' || transaction.type === '0x1') && hasEip1559)
		// TODO - Replace error
		throw new Error("pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas");
}

export const validateTransaction = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => void,
) => {
	if (overrideMethod !== undefined) return overrideMethod(transaction);

	if (typeof transaction !== 'object' || transaction === null)
		// TODO - Replace error
		throw new Error('invalid transaction obejct');

	const formattedTransaction = formatTransaction(transaction, ValidTypes.HexString);

	validateCustomChainInfo(transaction);
	validateChainInfo(transaction);
	validateGas(formattedTransaction);

	if (
		(formattedTransaction.nonce as HexString).charAt(0) === '-' ||
		(formattedTransaction.chainId as HexString).charAt(0) === '-'
	)
		// TODO - Replace error
		throw new Error('Nonce or chainId is lower than 0');
};
