import { TransactionFactory } from '@ethereumjs/tx';
import { AccessList, EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import {
	Address,
	Numbers,
	HexString,
	ValidTypes,
	convertObjectPropertiesToValidType,
	toHex,
} from 'web3-utils';
import { BlockTags } from 'web3-validator';

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

export interface CustomChain<NumberType = Numbers | HexString> {
	name?: string;
	networkId: NumberType;
	chainId: NumberType;
}

export interface Common<NumberType = Numbers | HexString> {
	customChain: CustomChain<NumberType>;
	baseChain?: chain;
	hardfork?: hardfork;
}

export interface CustomChain<NumberType = Numbers | HexString> {
	name?: string;
	networkId: NumberType;
	chainId: NumberType;
}

export interface BaseTxData<NumberType = Numbers | HexString> {
	from?: Address;
	to?: Address | null;
	value?: NumberType;
	gas?: NumberType;
	gasPrice?: NumberType;
	data?: HexString;
	nonce?: NumberType;
	chainId?: NumberType;
	common?: Common;
	chain?: chain;
	hardfork?: hardfork;
	gasLimit?: NumberType;
	v?: NumberType;
	r?: NumberType;
	s?: NumberType;
	type?: NumberType;
}

export interface AccessListEIP2930TxData<NumberType = Numbers | HexString>
	extends BaseTxData<NumberType> {
	accessList?: AccessList;
}

export interface FeeMarketEIP1559TxData<NumberType = Numbers | HexString>
	extends AccessListEIP2930TxData<NumberType> {
	gasPrice?: never;
	maxPriorityFeePerGas?: NumberType;
	maxFeePerGas?: NumberType;
}

export type TxData = BaseTxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData;
const txDataConvertibleProperties: (
	| keyof BaseTxData
	| keyof AccessListEIP2930TxData
	| keyof FeeMarketEIP1559TxData
)[] = [
	'nonce',
	'gasPrice',
	'gasLimit',
	'value',
	'v',
	'r',
	's',
	'type',
	'chainId',
	'maxPriorityFeePerGas',
	'maxFeePerGas',
];

export default class Web3EthTx {
	public static async fromTxData(txData: TxData, web3Context: Web3Context<EthExecutionAPI>) {
		if (typeof txData !== 'object' || txData === null)
			// TODO - Replace error
			throw new Error('invalid txData object');

		Web3EthTx._validateCustomChainInfo(txData);
		const txDataHexString = Web3EthTx._formatTxData(txData);
		const { defaultedTxData, txOptions } = await Web3EthTx._defaultTxDataAndSeparateTxOptions(
			txDataHexString,
			Web3EthTx._detectTxType(txDataHexString),
			web3Context,
		);
		return TransactionFactory.fromTxData(defaultedTxData, txOptions);
	}

	private static _validateCustomChainInfo(txData: TxData) {
		if (txData.common !== undefined) {
			if (txData.common.customChain === undefined)
				// TODO - Replace error
				throw new Error('If tx.common is provided it must have tx.common.customChain');
			if (txData.common.customChain.chainId === undefined)
				// TODO - Replace error
				throw new Error(
					'If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId',
				);
			if (
				txData.chainId !== undefined &&
				txData.chainId !== txData.common.customChain.chainId
			)
				// TODO - Replace error
				throw new Error(
					'Chain Id doesnt match in tx.chainId tx.common.customChain.chainId',
				);
		}
	}

	private static _formatTxData(txData: TxData) {
		// TODO Fix TSC error
		// @ts-ignore - Types of property 'gasPrice' are incompatible. Type 'string | undefined' is not assignable to type 'undefined'
		const txDataHexString:
			| BaseTxData<HexString>
			| AccessListEIP2930TxData<HexString>
			| FeeMarketEIP1559TxData<HexString> = convertObjectPropertiesToValidType(
			txData,
			// TODO Fix TSC error
			// @ts-ignore - TSC doesn't understand txDataConvertibleProperties contains keys of all possible tx types
			txDataConvertibleProperties,
			ValidTypes.HexString,
		);
		if (txDataHexString.common !== undefined) {
			txDataHexString.common.customChain = convertObjectPropertiesToValidType(
				txDataHexString.common.customChain,
				['networkId', 'chainId'],
				ValidTypes.HexString,
			);
		}
		// TODO - Formatting toLowerCase, toChecksumAddress, etc.
		return txDataHexString;
	}

	private static _detectTxType(
		txData:
			| BaseTxData<HexString>
			| AccessListEIP2930TxData<HexString>
			| FeeMarketEIP1559TxData<HexString>,
	) {
		const hasEip1559 =
			(txData as FeeMarketEIP1559TxData<HexString>).maxFeePerGas !== undefined ||
			(txData as FeeMarketEIP1559TxData<HexString>).maxPriorityFeePerGas !== undefined;
		if (txData.gasPrice !== undefined && (txData.type === '0x2' || hasEip1559))
			// TODO - Replace error
			throw new Error("eip-1559 transactions don't support gasPrice");
		if ((txData.type === '0x0' || txData.type === '0x1') && hasEip1559)
			// TODO - Replace error
			throw new Error(
				"pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas",
			);

		if (txData.type !== undefined) return txData.type;

		if (hasEip1559) return '0x2';
		if (txData.hardfork === 'berlin') return '0x2';
		if (txData.common?.hardfork === 'berlin') return '0x2';

		if ((txData as AccessListEIP2930TxData).accessList !== undefined) return '0x1';

		return '0x0';
	}

	private static async _defaultTxDataAndSeparateTxOptions(
		txData:
			| BaseTxData<HexString>
			| AccessListEIP2930TxData<HexString>
			| FeeMarketEIP1559TxData<HexString>,
		txType: HexString,
		web3Context: Web3Context<EthExecutionAPI>,
	) {
		const defaultedTxData = {
			...txData,
            ...await Web3EthTx._handleTxPricing(txData, txType, web3Context),
			data: txData.data ?? '0x',
			value: txData.value ?? '0x',
			gasLimit: txData.gasLimit ?? txData.gas, // TODO txData.gas is optional, need a default if both gasLimit and gas aren't provided
		};
		if (txType >= '0x1' && (txData as AccessListEIP2930TxData<HexString>).accessList === undefined)
			(defaultedTxData as AccessListEIP2930TxData<HexString>).accessList = [];
	}

	private static async _handleTxPricing(
		txData:
			| BaseTxData<HexString>
			| AccessListEIP2930TxData<HexString>
			| FeeMarketEIP1559TxData<HexString>,
		txType: HexString,
		web3Context: Web3Context<EthExecutionAPI>,
	) {
		const web3Eth = new Web3Eth(web3Context.currentProvider);
		if (txType === '0x2') {
			const block = await web3Eth.getBlock(BlockTags.LATEST);
			if (block?.baseFeePerGas === undefined)
				// TODO - Replace error
				throw new Error("Network doesn't support eip-1559");
			const maxPriorityFeePerGas =
				// TODO - Replace hardcoded value with configurable one
				(txData as FeeMarketEIP1559TxData<HexString>).maxPriorityFeePerGas ?? '0x9502F900'; // 2.5
			return {
				maxPriorityFeePerGas,
				maxFeePerGas:
					(txData as FeeMarketEIP1559TxData<HexString>).maxFeePerGas ??
					toHex(BigInt(block.baseFeePerGas) * BigInt(2) + BigInt(maxPriorityFeePerGas)),
			};
		} else if (txType === '0x1' || txType === '0x0') {
			return { gasPrice: txData.gasPrice ?? await web3Eth.getGasPrice() };
		} else {
			throw new Error('txType not specified');
		}
	}
}
