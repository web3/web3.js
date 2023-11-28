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
import WebSocketProvider from 'web3-providers-ws';
import { Web3Account } from 'web3-eth-accounts';
import { Web3, Contract, Numbers, EventLog } from 'web3';
import { BasicBytecode, BasicAbi } from '../../../../fixtures/build/Basic';
import { isWs, isIpc, getSystemTestProvider } from '../../../../scripts/system_tests_utils';

const contracts: { [key: string]: Contract<typeof BasicAbi> } = {};

const deployContracts = async (web3: Web3, accounts: Web3Account[]) => {
	const prs = [];
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		const sendOptions = { from: account.address };
		const deployOptions = {
			data: BasicBytecode,
			arguments: [123, ''] as [number, string],
			gas: BigInt(9000000000000),
			gasLimit: BigInt(9000000000000),
			type: BigInt(0),
		};
		const c = new web3.eth.Contract<typeof BasicAbi>(BasicAbi);
		prs.push(
			c
				.deploy(deployOptions)
				.send(sendOptions)
				.then((contract: typeof c) => {
					contracts[account.address] = contract;
				}),
		);
	}
	await Promise.all(prs);
};

const addAccount = async (
	web3: Web3,
	mainAcc: string,
	address: string,
	privateKey: string,
	nonce: Numbers,
) => {
	web3.eth.accounts.wallet.add(privateKey);
	return web3.eth.sendTransaction({
		from: mainAcc,
		to: address,
		nonce,
		gas: 1500000,
		value: '1000000000000000000',
	});
};

const prepareAccounts = async (web3: Web3, n = 1000) => {
	const prs = [];
	const list = await web3.eth.personal.getAccounts();
	const mainAcc = list[0];
	const accountList: Web3Account[] = [];
	const nonce = await web3.eth.getTransactionCount(mainAcc);
	for (let i = 0; i < n; i++) {
		const acc = web3.eth.accounts.create();
		prs.push(addAccount(web3, mainAcc, acc.address, acc.privateKey, Number(nonce) + i));
		accountList.push(acc);
	}
	await Promise.all(prs);
	return accountList;
};

const sendData = async (account: Web3Account) => {
	const contract = contracts[account.address];
	return contract.methods
		.firesStringEvent(`String event: ${account.address}`)
		.send({ from: account.address });
};

const getData = async (account: Web3Account) => {
	const contract = contracts[account.address];
	await contract.methods.getStringValue().call();
};

const receivedEvents: { [key: string]: EventLog } = {};
const subscribeContract = (acc: Web3Account) => {
	const contract = contracts[acc.address];
	const event = contract.events.StringEvent();

	event.on('data', res => {
		if (res.returnValues.str !== `String event: ${acc.address}`) {
			throw new Error('Event is not correct');
		}
		receivedEvents[acc.address] = res;
	});
};
const contractSubscriptions = (accounts: Web3Account[]) => {
	for (const acc of accounts) {
		subscribeContract(acc);
	}
};

describe('huge data', () => {
	let web3: Web3;
	let parallelCount = 100;
	let accounts: Web3Account[] = [];
	beforeAll(async () => {
		parallelCount = parallelCount;
		web3 = new Web3(getSystemTestProvider());
		accounts = await prepareAccounts(web3, parallelCount);
		await deployContracts(web3, accounts);
	});
	afterAll(() => {
		if (isWs || isIpc) {
			(web3.provider as unknown as WebSocketProvider).disconnect();
		}
	});
	it('send requests large number of requests', async () => {
		const sendPrs = [];
		for (let i = 0; i < parallelCount; i++) {
			sendPrs.push(sendData(accounts[i]));
		}
		await expect(Promise.all(sendPrs)).resolves.toBeDefined();
		// if socket subscribe to events
		if (isIpc || isWs) {
			contractSubscriptions(accounts);
		}
	});
	it('get requests', async () => {
		const getPrs = [];
		for (let i = 0; i < parallelCount; i++) {
			getPrs.push(getData(accounts[i]));
		}
		await expect(Promise.all(getPrs)).resolves.toBeDefined();
	});
});
