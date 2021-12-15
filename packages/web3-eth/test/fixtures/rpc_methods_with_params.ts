import { TransactionCall, TransactionWithSender } from 'web3-common';
import {
	Address,
	BlockNumberOrTag,
	BlockTags,
	Filter,
	HexString32Bytes,
	HexStringBytes,
	Uint,
	Uint256,
} from 'web3-utils';

import { isTransactionCallValidData, isTransactionWithSenderValidData } from './validation';

export const getBalanceValidData: [Address, BlockNumberOrTag][] = [
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
];

export const getStorageAtValidData: [Address, Uint256, BlockNumberOrTag][] = [
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1', '0x1'],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1', BlockTags.EARLIEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1', BlockTags.LATEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1', BlockTags.PENDING],
];

export const getTransactionCountValidData: [Address, BlockNumberOrTag][] = [
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
];

export const getBlockTransactionCountByHashValidData: [HexString32Bytes][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
];

export const getBlockTransactionCountByNumberValidData: [BlockNumberOrTag][] = [
	['0x1'],
	[BlockTags.EARLIEST],
	[BlockTags.LATEST],
	[BlockTags.PENDING],
];

export const getUncleCountByBlockHashValidData: [HexString32Bytes][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
];

export const getUncleCountByBlockNumberValidData: [BlockNumberOrTag][] = [
	['0x1'],
	[BlockTags.EARLIEST],
	[BlockTags.LATEST],
	[BlockTags.PENDING],
];

export const getCodeValidData: [Address, BlockNumberOrTag][] = [
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
];

export const signValidData: [Address, HexStringBytes][] = [
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'],
	['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0xdeadbeaf'],
];

export const signTransactionValidData = (): [TransactionWithSender][] =>
	isTransactionWithSenderValidData().map(transaction => [transaction[0]]);

export const sendTransactionValidData = (): [TransactionWithSender][] =>
	isTransactionWithSenderValidData().map(transaction => [transaction[0]]);

export const sendRawTransactionValidData: [HexStringBytes][] = [
	['0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'],
];

export const callValidData = (): [TransactionCall, BlockNumberOrTag][] => {
	const validData: [TransactionCall, BlockNumberOrTag][] = [];
	isTransactionCallValidData.forEach(transaction => {
		validData.push([transaction[0], '0x1']);
		validData.push([transaction[0], BlockTags.EARLIEST]);
		validData.push([transaction[0], BlockTags.LATEST]);
		validData.push([transaction[0], BlockTags.PENDING]);
	});
	return validData;
};

export const estimateGasValidData = (): [Partial<TransactionWithSender>, BlockNumberOrTag][] => {
	const validData: [TransactionCall, BlockNumberOrTag][] = [];
	isTransactionCallValidData.forEach(transaction => {
		validData.push([transaction[0], '0x1']);
		validData.push([transaction[0], BlockTags.EARLIEST]);
		validData.push([transaction[0], BlockTags.LATEST]);
		validData.push([transaction[0], BlockTags.PENDING]);
	});
	return validData;
};

export const getBlockByHashValidData: [HexString32Bytes, boolean][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', true],
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', false],
];

export const getBlockByNumberValidData: [BlockNumberOrTag, boolean][] = [
	['0x1', true],
	[BlockTags.EARLIEST, true],
	[BlockTags.LATEST, true],
	[BlockTags.PENDING, true],
	['0x1', false],
	[BlockTags.EARLIEST, false],
	[BlockTags.LATEST, false],
	[BlockTags.PENDING, false],
];

export const getTransactionByHashValidData: [HexString32Bytes][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
];

export const getTransactionByBlockHashAndIndexValidData: [HexString32Bytes, Uint][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', '0x0'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238', '0xc0ffe'],
];

export const getTransactionByBlockNumberAndIndexValidData: [BlockNumberOrTag, Uint][] = [
	['0x1', '0x0'],
	[BlockTags.EARLIEST, '0x0'],
	[BlockTags.LATEST, '0x0'],
	[BlockTags.PENDING, '0x0'],
];

export const getTransactionReceiptValidData: [HexString32Bytes][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'],
];

export const getUncleByBlockHashAndIndexValidData: [HexString32Bytes, Uint][] = [
	['0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2', '0x0'],
	['0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238', '0xc0ffe'],
];

export const getUncleByBlockNumberAndIndexValidData: [BlockNumberOrTag, Uint][] = [
	['0x1', '0x0'],
	[BlockTags.EARLIEST, '0x0'],
	[BlockTags.LATEST, '0x0'],
	[BlockTags.PENDING, '0x0'],
];

export const compileSolidityValidData: [string][] = [
	['contract test { function multiply(uint a) returns(uint d) {   return a * 7;   } }'],
];

export const compileLLLValidData: [string][] = [['(returnlll (suicide (caller)))']];

export const compileSerpentValidData: [string][] = [['/* some serpent */']];

export const isFilterObjectValidData: [Filter, true][] = [
	[
		{
			fromBlock: '0xc0ff3',
		},
		true,
	],
	[
		{
			toBlock: '0xc0ff3',
		},
		true,
	],
	[
		{
			address: '0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
		},
		true,
	],
	[
		{
			address: [
				'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
				'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
			],
		},
		true,
	],
	[
		{
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
		true,
	],
	[
		{
			fromBlock: '0xc0ff3',
			toBlock: '0xc0ff3',
			address: [
				'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
				'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
			],
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
		true,
	],
];

export const newFilterValidData = (): [Filter][] =>
	isFilterObjectValidData.map(transaction => [transaction[0]]);

export const uninstallFilterValidData: [Uint][] = [['0x0'], ['0x42'], ['0xc0ffe']];

export const getFilterChangesValidData: [Uint][] = [['0x0'], ['0x42'], ['0xc0ffe']];

export const getFilterLogsValidData: [Uint][] = [['0x0'], ['0x42'], ['0xc0ffe']];

export const getLogsValidData = (): [Filter][] =>
	isFilterObjectValidData.map(transaction => [transaction[0]]);

export const submitWorkValidData: [HexString32Bytes, HexString32Bytes, HexString32Bytes][] = [
	[
		'0x0000000000000001',
		'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
		'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
	],
];

export const submitHashrateValidData: [HexString32Bytes, HexString32Bytes][] = [
	[
		'0x0000000000000000000000000000000000000000000000000000000000500000',
		'0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
	],
];

export const getFeeHistoryValidData: [Uint, BlockNumberOrTag, number[]][] = [
	['0x1', '0x1', [42]],
	['0x1', BlockTags.EARLIEST, [42]],
	['0x1', BlockTags.LATEST, [42]],
	['0x1', BlockTags.PENDING, [42]],
];
