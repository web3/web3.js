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
const { Web3 } = require('../../../lib/commonjs');
const { IpcProvider } = require('../../../../web3-providers-ipc/lib/commonjs');
const contractData = require('../../../../../fixtures/build/Basic.json');

const providerString = process.env.WEB3_SYSTEM_TEST_PROVIDER;
const isWs = providerString.startsWith('ws');
const isIpc = providerString.includes('ipc');
const contracts = {};

const deployContracts = async (web3, accounts) => {
	const prs = [];
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		const sendOptions = { from: account.address };
		const deployOptions = {
			data: contractData.evm.bytecode.object,
			arguments: [123, ''],
			gas: BigInt(9000000000000),
			gasLimit: BigInt(9000000000000),
			type: BigInt(0),
		};
		const c = new web3.eth.Contract(contractData.abi);
		prs.push(
			c
				.deploy(deployOptions)
				.send(sendOptions)
				.then(contract => {
					contracts[account.address] = contract;
				}),
		);
	}
	await Promise.all(prs);
};

const addAccount = async (web3, mainAcc, address, privateKey, nonce) => {
	web3.eth.accounts.wallet.add(privateKey);
	return web3.eth.sendTransaction({
		from: mainAcc,
		to: address,
		nonce,
		gas: 1500000,
		value: '1000000000000000000',
	});
};

const prepareAccounts = async (web3, n = 1000) => {
	const prs = [];
	const list = await web3.eth.personal.getAccounts();
	const mainAcc = list[0];
	const accountList = [];
	const nonce = await web3.eth.getTransactionCount(mainAcc);
	for (let i = 0; i < n; i++) {
		const acc = web3.eth.accounts.create();
		prs.push(addAccount(web3, mainAcc, acc.address, acc.privateKey, Number(nonce) + i));
		accountList.push(acc);
	}
	await Promise.all(prs);
	return accountList;
};

const sendData = async (web3, account) => {
	const contract = contracts[account.address];
	return contract.methods
		.firesStringEvent(`String event: ${account.address}`)
		.send({ from: account.address });
};

const getData = async (web3, account) => {
	const contract = contracts[account.address];
	await contract.methods.getStringValue().call();
};

const receivedEvents = {};
const subscribeContract = acc => {
	const contract = contracts[acc.address];
	const event = contract.events.StringEvent();

	event.on('data', res => {
		if (res.returnValues.str !== `String event: ${acc.address}`) {
			throw new Error('Event is not correct');
		}
		receivedEvents[acc.address] = res;
	});
};
const contractSubscriptions = (web3, accounts) => {
	console.log(`Subscribe to ${accounts.length} contracts events`);
	for (const acc of accounts) {
		subscribeContract(acc);
	}
};
const test = async () => {
	console.log(`Start test with provider: ${providerString}`);
	const provider = isIpc
		? new IpcProvider(providerString)
		: isWs
		? new Web3.providers.WebsocketProvider(providerString)
		: new Web3.providers.HttpProvider(providerString);
	const web3 = new Web3(provider);
	const n = Number(process.env.PARALLEL_COUNT) || 500;

	console.log(`Prepare ${n} accounts in parallel`);
	const accounts = await prepareAccounts(web3, n);

	console.log(`Deploy ${n} contracts in parallel`);
	await deployContracts(web3, accounts);
	// if socket subscribe to events
	if (isIpc || isWs) {
		contractSubscriptions(web3, accounts);
	}

	console.log(`Send data from ${n} accounts in parallel`);
	const sendPrs = [];
	for (let i = 0; i < n; i++) {
		sendPrs.push(sendData(web3, accounts[i]));
	}
	await Promise.all(sendPrs);

	if (isIpc || isWs) {
		if (Object.keys(receivedEvents).length !== accounts.length) {
			throw new Error('Incorrect event count');
		}
	}

	console.log(`Get data from ${n} accounts in parallel`);
	const getPrs = [];
	for (let i = 0; i < n; i++) {
		getPrs.push(getData(web3, accounts[i]));
	}
	await Promise.all(getPrs);
	if (isIpc || isWs) {
		web3.provider.disconnect();
	}
};

test().catch(console.error);
