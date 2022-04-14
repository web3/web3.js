// import { DataFormat } from 'web3-common';
// import { HexString } from 'web3-utils';

// import { Transaction } from '../../../../src/types';
// import { returnFormats } from './return_formats';

// const transaction: Transaction = {
// 	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
// 	to: '0x3535353535353535353535353535353535353535',
// 	value: '0x174876e800',
// 	gas: '0x5208',
// 	gasPrice: '0x4a817c800',
// 	type: '0x0',
// 	maxFeePerGas: '0x1229298c00',
// 	maxPriorityFeePerGas: '0x49504f80',
// 	data: '0x',
// 	nonce: '0x4',
// 	chain: 'mainnet',
// 	hardfork: 'berlin',
// 	chainId: '0x1',
// 	gasLimit: '0x5208',
// 	v: '0x25',
// 	r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
// 	s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
// };
// const mockRpcResponse = {
// 	raw: '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
// 	tx: transaction
// };

// /**
//  * Array consists of:
//  * - Test title
//  * - Input parameters:
//  *     - transaction
//  */
// export const testCases: [string, [Transaction]][] = [
// 	[
// 		JSON.stringify(transaction),
// 		[transaction],
// 	],
// ];

// /**
//  * Array consists of:
//  * - Test title
//  * - Input parameters:
//  *     - blockNumber
//  *     - uncleIndex
//  *     - returnFormat
//  * - mockRpcResponse
//  */
// type TestData = [string, [Transaction, DataFormat], HexString];

// /**
//  * For each testCase in testCases, we add a version of testCase with each returnFormat in returnFormats.
//  * This also adds mockRpcResponse to each testCase
//  */
// export const testData = (() => {
// 	const _testData: TestData[] = [];
// 	for (const testCase of testCases) {
// 		for (const returnFormat of returnFormats) {
// 			const [testTitle, inputParameters] = testCase;
// 			_testData.push([
// 				testTitle,
// 				[...inputParameters, returnFormat],
// 				mockRpcResponse
// 			]);
// 		}
// 	}
// 	return _testData;
// })();
