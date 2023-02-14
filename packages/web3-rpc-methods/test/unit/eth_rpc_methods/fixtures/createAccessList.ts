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
import { BlockNumberOrTag, BlockTags, TransactionWithSenderAPI } from 'web3-types';

export const mockRpcResponse =
	'{"accessList":[{"address":"0xc285289346689ee7cd63e4bb1a3b40f5f6e7973c","storageKeys":["0x0000000000000000000000000000000000000000000000000000000000000000"]}],"gasUsed":"0x6a5b"}';

const callObj: Partial<TransactionWithSenderAPI> = {
	from: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: '0xc285289346689ee7cd63e4bb1a3b40f5f6e7973c',
	value: '0x174876e800',
	gas: '0x5208',
	type: '0x2',
	maxFeePerGas: '0x1229298c00',
	maxPriorityFeePerGas: '0x49504f80',
	data: '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 * 	   - callObj
 *     - blockNumber
 */
type TestData = [
	string,
	[TransactionWithSenderAPI | Partial<TransactionWithSenderAPI>, BlockNumberOrTag],
];

export const testData: TestData[] = [
	[`${JSON.stringify(callObj)}\nblockNumber = BlockTags.LATEST`, [callObj, BlockTags.LATEST]],
	[`${JSON.stringify(callObj)}\nblockNumber = BlockTags.EARLIEST`, [callObj, BlockTags.EARLIEST]],
	[`${JSON.stringify(callObj)}\nblockNumber = BlockTags.PENDING`, [callObj, BlockTags.PENDING]],
	[`${JSON.stringify(callObj)}\nblockNumber = BlockTags.SAFE`, [callObj, BlockTags.SAFE]],
	[
		`${JSON.stringify(callObj)}\nblockNumber = BlockTags.FINALIZED`,
		[callObj, BlockTags.FINALIZED],
	],
	[`${JSON.stringify(callObj)}\nblockNumber = "0x4b7"`, [callObj, '0x4b7']],
];
