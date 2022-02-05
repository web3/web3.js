import {
	AccessList,
	AccessListEntry,
	BaseTransaction,
	Transaction1559Unsigned,
	Transaction2930Unsigned,
	TransactionCall,
	TransactionLegacyUnsigned,
	TransactionWithSender,
} from 'web3-common';
import { InvalidTransactionCall, InvalidTransactionWithSender } from '../../src/errors';

export const isBaseTransactionValidData: [BaseTransaction, true][] = [
	[
		{
			type: '0x0',
			nonce: '0x0',
			gas: '0x5208',
			value: '0x1',
			input: '0x0',
			chainId: '0x1',
		},
		true,
	],
	[
		{
			to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			type: '0x1',
			nonce: '0x1',
			gas: '0x5208',
			value: '0x1',
			input: '0x1',
		},
		true,
	],
];

export const isAccessListEntryValidData: [AccessListEntry, true][] = [
	[{}, true],
	[
		{
			address: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
		},
		true,
	],
	[
		{
			storageKeys: [
				'0x22f30f0608f88c510de0016370f1525b330e5839026bdff93f9ceef24d2275e6',
				'0x63a01bba0d4f0ad913a241aed52f5c55807be35f554536abd1e451d4e6515b29',
			],
		},
		true,
	],
	[
		{
			address: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			storageKeys: [
				'0x22f30f0608f88c510de0016370f1525b330e5839026bdff93f9ceef24d2275e6',
				'0x63a01bba0d4f0ad913a241aed52f5c55807be35f554536abd1e451d4e6515b29',
			],
		},
		true,
	],
];

export const isAccessListValidData = (): [AccessList, true][] => [
	[isAccessListEntryValidData.map(entry => entry[0]), true],
];

export const isTransaction1559UnsignedValidData = (): [Transaction1559Unsigned, true][] =>
	isBaseTransactionValidData.map(transaction => {
		return [
			{
				...transaction[0],
				maxFeePerGas: '0x1',
				maxPriorityFeePerGas: '0x1',
				accessList: [],
			},
			true,
		];
	});

export const isTransactionLegacyUnsignedValidData = (): [TransactionLegacyUnsigned, true][] =>
	isBaseTransactionValidData.map(transaction => {
		return [
			{
				...transaction[0],
				gasPrice: '0x1',
			},
			true,
		];
	});

export const isTransaction2930UnsignedValidData = (): [Transaction2930Unsigned, true][] =>
	isTransactionLegacyUnsignedValidData().map(transaction => {
		return [
			{
				...transaction[0],
				accessList: [],
			},
			true,
		];
	});

export const isTransactionWithSenderValidData = (): [TransactionWithSender, true][] => {
	const transactions = [
		...isTransaction1559UnsignedValidData(),
		...isTransactionLegacyUnsignedValidData(),
		...isTransaction2930UnsignedValidData(),
	];
	return transactions.map(transaction => {
		return [
			{
				...transaction[0],
				from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			},
			true,
		];
	});
};

export const validateTransactionWithSenderInvalidData = (): [
	any,
	InvalidTransactionWithSender,
][] => {
	const transactions = [
		...isTransaction1559UnsignedValidData(),
		...isTransactionLegacyUnsignedValidData(),
		...isTransaction2930UnsignedValidData(),
	];
	return transactions.map(transaction => {
		return [transaction[0], new InvalidTransactionWithSender(transaction[0])];
	});
};

export const isTransactionCallValidData: [TransactionCall, true][] = [
	[{ to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4' }, true],
	[
		{
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			gas: '0x5208',
			value: '0x1',
		},
		true,
	],
	[
		{
			from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			to: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			gas: '0x5208',
			gasPrice: '0x5208',
			value: '0x1',
			data: '0x0',
		},
		true,
	],
];

export const validateTransactionCallInvalidData = (): [any, InvalidTransactionCall][] =>
	validateTransactionWithSenderInvalidData().map(transaction => {
		return [transaction[0], new InvalidTransactionCall(transaction[0])];
	});
