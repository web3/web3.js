import { ReceiptInfo } from 'web3-common';
import { HexString } from 'web3-utils';

const expectedTransactionHash =
	'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547';
const expectedReceiptInfo: ReceiptInfo = {
	transactionHash: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	transactionIndex: '0x41',
	blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
	blockNumber: '0x5daf3b',
	from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
	to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
	cumulativeGasUsed: '0x33bc', // 13244
	effectiveGasPrice: '0x13a21bc946', // 84324108614
	gasUsed: '0x4dc', // 1244
	contractAddress: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
	logs: [],
	logsBloom: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	root: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	status: '0x1',
};

/**
 * Array consists of:
 * - Test title
 * - Input signed transaction
 * - Expected transaction hash
 * - Expected receipt info
 */
export const testData: [string, HexString, HexString, ReceiptInfo][] = [
	[
		'Signed transaction',
		'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
		expectedTransactionHash,
		expectedReceiptInfo,
	],
];
