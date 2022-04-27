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
import { Block, TransactionInfo } from 'web3-common';
import { BlockNumberOrTag, BlockTags, Bytes } from 'web3-utils';

export const mockRpcResponse: Block = {
	parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
	sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
	miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
	stateRoot: '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
	transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	logsBloom:
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	difficulty: '0x4ea3f27bc',
	number: '0x1b4',
	gasLimit: '0x1388',
	gasUsed: '0x1c96e73',
	timestamp: '0x55ba467c',
	extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
	mixHash: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
	nonce: '0x1c11920a4',
	totalDifficulty: '0x78ed983323d',
	size: '0x220',
	transactions: [
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
	],
	uncles: [
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
	],
	hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
	baseFeePerGas: '0x13afe8b904',
};
const hydratedTransaction: TransactionInfo = {
	blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
	blockNumber: '0x5daf3b',
	from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
	gas: '0xc350',
	gasPrice: '0x4a817c800',
	hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
	input: '0x68656c6c6f21',
	nonce: '0x15',
	to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
	transactionIndex: '0x41',
	value: '0xf3dbb76162000',
	v: '0x25',
	r: '0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea',
	s: '0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c',
	type: '0x0',
};
export const mockRpcResponseHydrated: Block = {
	...mockRpcResponse,
	transactions: [hydratedTransaction, hydratedTransaction, hydratedTransaction],
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - blockNumber
 *     - hydrated
 */
type TestData = [string, [Bytes | BlockNumberOrTag | undefined, boolean]];
export const testData: TestData[] = [
	// Testing block cases, hydrated = false
	// blockNumber = bytes
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", hydrated = false',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', false],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), hydrated = false',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), false],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), hydrated = false',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			false,
		],
	],
	// blockNumber = BlockTag
	['blockNumber = BlockTags.LATEST, hydrated = false', [BlockTags.LATEST, false]],
	['blockNumber = BlockTags.EARLIEST, hydrated = false', [BlockTags.EARLIEST, false]],
	['blockNumber = BlockTags.PENDING, hydrated = false', [BlockTags.PENDING, false]],
	// blockNumber = Numbers
	['blockNumber = "0x4b7", hydrated = false', ['0x4b7', false]],
	['blockNumber = 1207, hydrated = false', [1207, false]],
	['blockNumber = "1207", hydrated = false', ['1207', false]],
	['blockNumber = BigInt("0x4b7"), hydrated = false', [BigInt('0x4b7'), false]],
	['blockNumber = undefined, hydrated = false', [undefined, false]],

	// Testing block cases, hydrated = true
	// blockNumber = bytes
	[
		'blockNumber = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", hydrated = true',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', true],
	],
	[
		'blockNumber = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex"), hydrated = true',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), true],
	],
	[
		'blockNumber = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8"), hydrated = true',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			true,
		],
	],
	// blockNumber = BlockTag
	['blockNumber = BlockTags.LATEST, hydrated = true', [BlockTags.LATEST, true]],
	['blockNumber = BlockTags.EARLIEST, hydrated = true', [BlockTags.EARLIEST, true]],
	['blockNumber = BlockTags.PENDING, hydrated = true', [BlockTags.PENDING, true]],
	// // blockNumber = Numbers
	['blockNumber = "0x4b7", hydrated = true', ['0x4b7', true]],
	['blockNumber = 1207, hydrated = true', [1207, true]],
	['blockNumber = "1207", hydrated = true', ['1207', true]],
	['blockNumber = BigInt("0x4b7"), hydrated = true', [BigInt('0x4b7'), true]],
	['blockNumber = undefined, hydrated = true', [undefined, true]],
];
