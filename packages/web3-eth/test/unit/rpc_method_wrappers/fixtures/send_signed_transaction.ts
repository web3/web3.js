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
import { Bytes, TransactionReceipt } from 'web3-types';

export const expectedTransactionHash =
	'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547';
export const expectedTransactionReceipt: TransactionReceipt = {
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
 * - Input parameters:
 *     - signedTransaction
 */
export const testData: [string, Bytes][] = [
	[
		'signedTransaction = HexString',
		'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
	],
	[
		'signedTransaction = Buffer',
		Buffer.from(
			'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
		),
	],
	[
		'signedTransaction = Uint8Array',
		new Uint8Array([
			30, 78, 64, 34, 36, 65, 38, 64, 64, 36, 37, 63, 35, 64, 33, 32, 62, 65, 38, 64, 34, 36,
			65, 38, 64, 64, 36, 37, 63, 35, 64, 33, 32, 62, 65, 38, 30, 35, 38, 62, 62, 38, 65, 62,
			39, 37, 30, 38, 37, 30, 66, 30, 37, 32, 34, 34, 35, 36, 37, 35, 30, 35, 38, 62, 62, 38,
			65, 62, 39, 37, 30, 38, 37, 30, 66, 30, 37, 32, 34, 34, 35, 36, 37, 35,
		]),
	],
];
