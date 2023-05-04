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
import { hexToBytes } from 'web3-utils';

export const expectedTransactionHash =
	'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547';
export const expectedTransactionReceipt: TransactionReceipt = {
	transactionHash: '0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
	transactionIndex: '0x41',
	blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
	blockNumber: '0x5daf3b',
	from: '0x7ed0e85b8e1e925600b4373e6d108f34ab38a401',
	to: '0x0000000000000000000000000000000000000000',
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
const signedTransaction =
	'0xf8650f8415aa14088252089400000000000000000000000000000000000000000180820a95a0e6d6bc9c7af306733eb44b2a8a4a4efed5db2fbff947e21521fe81dfb144a00aa01a8a87c872f59564abbbe60e9d4e54dee5e1f1647477ab170ecd7e2704d3c94d';
export const testData: [string, Bytes][] = [
	['signedTransaction = HexString', signedTransaction],
	['signedTransaction = Uint8Array', hexToBytes(signedTransaction)],
];
