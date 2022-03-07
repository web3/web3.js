import Common from '@ethereumjs/common';
import { TransactionFactory, TxOptions } from '@ethereumjs/tx';
import { EthExecutionAPI } from 'web3-common';
import { TransactionBuilder, TransactionTypeParser, Web3Context } from 'web3-core';
import { privateKeyToAddress } from 'web3-eth-accounts';
import { BlockTags, convertToValidType, HexString, toNumber, ValidTypes } from 'web3-utils';
import {
	Eip1559NotSupportedError,
	InvalidNonceOrChainIdError,
	InvalidTransactionObjectError,
	TransactionDataAndInputError,
	UnableToPopulateNonceError,
	UnsupportedTransactionTypeError,
} from './errors';
import { formatTransaction } from './format_transaction';
import { getBlock, getGasPrice, getTransactionCount } from './rpc_method_wrappers';
import {
	chain,
	hardfork,
	PopulatedUnsignedEip1559Transaction,
	PopulatedUnsignedEip2930Transaction,
	PopulatedUnsignedTransaction,
	Transaction,
} from './types';
import { validateChainInfo, validateCustomChainInfo, validateGas } from './validation';

export const defaultTransactionTypeParser: TransactionTypeParser = transaction => {
	const tx = transaction as unknown as Transaction;

	if (tx.type !== undefined)
		return convertToValidType(tx.type, ValidTypes.HexString) as HexString;

	if (
		tx.maxFeePerGas !== undefined ||
		tx.maxPriorityFeePerGas !== undefined ||
		tx.hardfork === 'london' ||
		tx.common?.hardfork === 'london'
	)
		return '0x2';

	if (tx.accessList !== undefined || tx.hardfork === 'berlin' || tx.common?.hardfork === 'berlin')
		return '0x1';

	return undefined;
};

export const detectTransactionType = (
	transaction: Transaction,
	transactionTypeParser: TransactionTypeParser = defaultTransactionTypeParser,
) =>
    // TODO: When we have `web3-types` package we can share TransactionType
    transactionTypeParser(transaction as unknown as Record<string, unknown>);

export const validateTransactionForSigning = (
	transaction: Transaction,
	overrideMethod?: (transaction: Transaction) => void,
) => {
	if (overrideMethod !== undefined) {
		overrideMethod(transaction);
		return;
	}

	if (typeof transaction !== 'object' || transaction === null)
		throw new InvalidTransactionObjectError(transaction);

	validateCustomChainInfo(transaction);
	validateChainInfo(transaction);

	const formattedTransaction = formatTransaction(transaction, ValidTypes.HexString);
	validateGas(formattedTransaction);

	if (
		formattedTransaction.nonce === undefined ||
		formattedTransaction.chainId === undefined ||
		formattedTransaction.nonce.startsWith('-') ||
		formattedTransaction.chainId.startsWith('-')
	)
		throw new InvalidNonceOrChainIdError({
			nonce: transaction.nonce,
			chainId: transaction.chainId,
		});
};

export const defaultTransactionBuilder: TransactionBuilder = async ({
	transaction,
	web3Context,
	privateKey,
}) => {
	const populatedTransaction = { ...transaction } as unknown as Transaction;

	if (populatedTransaction.from === undefined) {
		if (privateKey !== undefined) {
			populatedTransaction.from = privateKeyToAddress(privateKey);
		} else if (web3Context.defaultAccount !== null)
			populatedTransaction.from = web3Context.defaultAccount;
		// TODO Try to fill from using web3.eth.accounts.wallet
	}

	if (populatedTransaction.nonce === undefined) {
		if (populatedTransaction.from === undefined) throw new UnableToPopulateNonceError();
		populatedTransaction.nonce = await getTransactionCount(
			web3Context,
			populatedTransaction.from,
			BlockTags.PENDING,
		);
	}

	if (populatedTransaction.value === undefined) populatedTransaction.value = '0x';

	if (populatedTransaction.data !== undefined && populatedTransaction.input !== undefined)
		throw new TransactionDataAndInputError({
			data: populatedTransaction.data,
			input: populatedTransaction.input,
		});
	else if (populatedTransaction.input !== undefined) {
		populatedTransaction.data = populatedTransaction.input;
		delete populatedTransaction.input;
	}

	if (
		populatedTransaction.data === undefined ||
		populatedTransaction.data === null ||
		populatedTransaction.data === ''
	)
		populatedTransaction.data = '0x';
	else if (!populatedTransaction.data.startsWith('0x'))
		populatedTransaction.data = `0x${populatedTransaction.data}`;

	if (populatedTransaction.common === undefined) {
		if (populatedTransaction.chain === undefined)
			populatedTransaction.chain = web3Context.defaultChain as chain;
		if (populatedTransaction.hardfork === undefined)
			populatedTransaction.hardfork = web3Context.defaultHardfork as hardfork;
	}

	// if (populatedTransaction.chainId === undefined && populatedTransaction.common?.customChain.chainId === undefined)
	// TODO - web3Eth.getChainId not implemented
	// populatedTransaction.chainId = await web3Eth.getChainId();

	// if (populatedTransaction.networkId === undefined) {
	// 	populatedTransaction.networkId = web3Context.defaultNetworkId ?? undefined;
	//  TODO - getNetworkId (net_version) not implemented
	// 	populatedTransaction.networkId = await getNetworkId();
	// }

	if (populatedTransaction.gasLimit === undefined && populatedTransaction.gas !== undefined)
		populatedTransaction.gasLimit = populatedTransaction.gas;

	populatedTransaction.type = detectTransactionType(
		populatedTransaction,
		web3Context.transactionTypeParser ?? defaultTransactionTypeParser,
	);
	if (
		populatedTransaction.type === undefined &&
		(web3Context.defaultTransactionType !== null ||
			web3Context.defaultTransactionType !== undefined)
	)
		populatedTransaction.type = web3Context.defaultTransactionType as HexString;

	if (populatedTransaction.type !== undefined) {
		if (populatedTransaction.type.startsWith('-'))
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions
		if (populatedTransaction.type < '0x0' || populatedTransaction.type > '0x7f')
			throw new UnsupportedTransactionTypeError(populatedTransaction.type);

		if (populatedTransaction.type === '0x0' || populatedTransaction.type === '0x1') {
			if (populatedTransaction.gasPrice === undefined)
				populatedTransaction.gasPrice = await getGasPrice(web3Context);
		}

		if (populatedTransaction.type === '0x1' || populatedTransaction.type === '0x2') {
			if (populatedTransaction.accessList === undefined) populatedTransaction.accessList = [];
		}

		if (populatedTransaction.type === '0x2') {
			// Unless otherwise specified by web3Context.defaultBlock, this defaults to latest
			const block = await getBlock(web3Context);

			if (block.baseFeePerGas === undefined) throw new Eip1559NotSupportedError();

			if (populatedTransaction.gasPrice !== undefined) {
				// Logic from 1.x
				populatedTransaction.maxPriorityFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.maxFeePerGas = populatedTransaction.gasPrice;
				populatedTransaction.gasPrice = undefined;
			} else {
				if (populatedTransaction.maxPriorityFeePerGas === undefined)
					populatedTransaction.maxPriorityFeePerGas = convertToValidType(
						web3Context.defaultMaxPriorityFeePerGas,
						ValidTypes.HexString,
					);
				if (populatedTransaction.maxFeePerGas === undefined)
					populatedTransaction.maxFeePerGas =
						BigInt(block.baseFeePerGas) * BigInt(2) +
						BigInt(populatedTransaction.maxPriorityFeePerGas);
			}
		}
	}

    // TODO: When we have `web3-types` package we can share TransactionType
	return populatedTransaction as Record<string, unknown>;
};

const getEthereumjsTxDataFromTransaction = (
	transaction: PopulatedUnsignedTransaction<HexString>,
) => ({
	nonce: transaction.nonce as HexString,
	gasPrice: transaction.gasPrice as HexString,
	gasLimit: transaction.gasLimit as HexString,
	to: transaction.to as HexString,
	value: transaction.value as HexString,
	data: transaction.data,
	type: transaction.type as HexString,
	chainId: transaction.chainId as HexString,
	accessList: (transaction as PopulatedUnsignedEip2930Transaction).accessList,
	maxPriorityFeePerGas: (transaction as PopulatedUnsignedEip1559Transaction)
		.maxPriorityFeePerGas as HexString,
	maxFeePerGas: (transaction as PopulatedUnsignedEip1559Transaction).maxFeePerGas as HexString,
});

const getEthereumjsTransactionOptions = (
	transaction: PopulatedUnsignedTransaction<HexString>,
	web3Context: Web3Context<EthExecutionAPI>,
) => {
	const hasTransactionSigningOptions =
		(transaction.chain !== undefined && transaction.hardfork !== undefined) ||
		transaction.common !== undefined;

	let common;
	if (!hasTransactionSigningOptions) {
		common = Common.custom(
			{
				name: 'custom-network',
				chainId: toNumber(transaction.chainId) as number,
				networkId:
					transaction.networkId !== undefined
						? (toNumber(transaction.networkId) as number)
						: undefined,
				defaultHardfork: transaction.hardfork ?? web3Context.defaultHardfork,
			},
			{
				baseChain: web3Context.defaultChain,
			},
		);
	} else if (transaction.common)
		common = Common.custom(
			{
				name: transaction.common.customChain.name ?? 'custom-network',
				chainId: toNumber(transaction.common.customChain.chainId) as number,
				networkId: toNumber(transaction.common.customChain.networkId) as number,
				defaultHardfork: transaction.common.hardfork ?? web3Context.defaultHardfork,
			},
			{
				baseChain: transaction.common.baseChain ?? web3Context.defaultChain,
			},
		);

	return { common } as TxOptions;
};

// TODO - Needs override function
export const prepareTransactionForSigning = async (
	transaction: Transaction,
	web3Context: Web3Context<EthExecutionAPI>,
	privateKey?: HexString | Buffer,
) => {
	const transactionBuilder = web3Context.transactionBuilder ?? defaultTransactionBuilder;

	const populatedTransaction = await transactionBuilder({
		transaction: transaction as unknown as Record<string, unknown>,
		web3Context,
		privateKey,
	});

	const formattedTransaction = formatTransaction(
		populatedTransaction,
		ValidTypes.HexString,
	) as PopulatedUnsignedTransaction<HexString>;

	validateTransactionForSigning(formattedTransaction);

	return TransactionFactory.fromTxData(
		getEthereumjsTxDataFromTransaction(formattedTransaction),
		getEthereumjsTransactionOptions(formattedTransaction, web3Context),
	);
};
