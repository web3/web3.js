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
import { IpcProvider } from 'web3-providers-ipc';
import accounts from '../shared_fixtures/accounts.json';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import WebSocketProvider from 'web3-providers-ws';
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

	await contract.methods
		// @ts-ignore
		.setValues(1, 'A'.repeat(DATA_AMOUNT), true)
		.send({ from: accounts[i].address });

	await contract.methods.getStringValue().call();
};

const test = async () => {
	const providerString = String(process.env.WEB3_SYSTEM_TEST_PROVIDER);
	console.log(`Start test with provider: ${providerString}`);
	const provider = providerString.includes('ipc')
		? new IpcProvider(providerString)
		: providerString;
	const web3 = new Web3(provider);

	for (const a of accounts) {
		const acc = web3.eth.accounts.privateKeyToAccount(a.privateKey);
		web3.eth.accounts.wallet.add(acc);
	}

	const prs = [];
	for (let i = 0; i < 15; i++) {
		prs.push(sendAndGetData(web3, i));
	}
	await Promise.all(prs);
	(web3.provider as unknown as WebSocketProvider).disconnect();
};

test().catch(console.error);
