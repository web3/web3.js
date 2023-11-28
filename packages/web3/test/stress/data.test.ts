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

/* eslint-disable */
import { Web3 } from 'web3';
import WebSocketProvider from 'web3-providers-ws';
import accounts from '../../../../scripts/accounts.json';
import { BasicAbi, BasicBytecode } from '../../../../fixtures/build/Basic';
import { getSystemTestProvider, isWs, isIpc } from '../shared_fixtures/system_tests_utils';

const DATA_AMOUNT = 50 * 1024; // 50 kB

const sendAndGetData = async (web3: Web3, i: number) => {
	const sendOptions = { from: accounts[i].address };
	const deployOptions = {
		data: BasicBytecode,
		arguments: [0, ''] as [number, string],
		gasPrice: await web3.eth.getGasPrice(),
		gas: BigInt(9000000000000),
		gasLimit: BigInt(9000000000000),
		type: BigInt(0),
	};
	const c = new web3.eth.Contract<typeof BasicAbi>(BasicAbi);
	const contract = await c.deploy(deployOptions).send(sendOptions);

	await expect(
		contract.methods
			.setValues(1, 'A'.repeat(DATA_AMOUNT), true)
			.send({ from: accounts[i].address }),
	).resolves.toBeDefined();

	await expect(contract.methods.getStringValue().call()).resolves.toBe('A'.repeat(DATA_AMOUNT));
};

describe('huge data', () => {
	let web3: Web3;
	beforeAll(() => {
		web3 = new Web3(getSystemTestProvider());
	});
	afterAll(() => {
		if (isWs || isIpc) {
			(web3.provider as unknown as WebSocketProvider).disconnect();
		}
	});

	it('send and get large data', async () => {
		for (const a of accounts) {
			const acc = web3.eth.accounts.privateKeyToAccount(a.privateKey);
			web3.eth.accounts.wallet.add(acc);
		}

		const prs = [];
		for (let i = 0; i < 15; i++) {
			prs.push(sendAndGetData(web3, i));
		}
		await expect(Promise.all(prs)).resolves.toBeDefined();
	});
});
