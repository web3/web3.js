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
import Web3 from 'web3';
import {
	closeOpenConnection,
	getSystemTestProvider,
	isWs,
	itIf,
} from 'web3/test/shared_fixtures/system_tests_utils';

describe('Black Box Unit Tests - web3.eth.getTransaction', () => {
	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(getSystemTestProvider());
	});

	afterAll(async () => {
		if (isWs) await closeOpenConnection(web3);
	});

	itIf(process.env.WEB3_SYSTEM_TEST_BACKEND === 'infura')(
		'should get specific USDT transaction',
		async () => {
			const expectedTxObject = {
				accessList: [],
				blockHash: '0x8ad298dbdf859f953b97cc27218e7f7f2af4237817a8dbd1d987891520286612',
				blockNumber: BigInt(15230806),
				chainId: BigInt(1),
				from: '0x4c9af439b1a6761b8e549d8d226a468a6b2803a8',
				gas: BigInt(120000),
				gasPrice: BigInt(9022588986),
				hash: '0x133048bfcf6c0f7f8d1f5681df9607802894667acb46f4a3ba8ba187421dfc2b',
				input: '0xa9059cbb000000000000000000000000d9e46776dbc0e37d6f89be3a23885234c75702b6000000000000000000000000000000000000000000000000000000012a05f200',
				maxFeePerGas: BigInt(32251128981),
				maxPriorityFeePerGas: BigInt(1000000000),
				nonce: BigInt(83553),
				r: '0x1240db6f5b2245729b8593ff43230795e3c4c1005776dd6841de68da926096e9',
				s: '0x48678639e5b752a69dcc62b4ef9417b3f65e4d4c75ec99df8457b02b339799de',
				to: '0xdac17f958d2ee523a2206206994597c13d831ec7',
				transactionIndex: BigInt(190),
				type: BigInt(2),
				v: BigInt(1),
				value: BigInt(0),
			};

			const response = await web3.eth.getTransaction(
				'0x133048bfcf6c0f7f8d1f5681df9607802894667acb46f4a3ba8ba187421dfc2b',
			);
			// eslint-disable-next-line jest/no-standalone-expect
			expect(response).toStrictEqual(expectedTxObject);
		},
	);
});
