/* eslint-disable */
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

import util from 'util';
import Web3 from 'web3';
// import WebSocketProvider from 'web3-providers-ws';
import ERC20Token from './fixtures/build/ERC20Token.json';

const isWs = (backendMode: string) => backendMode === 'ws';

const maxNumberOfAttempts = 10;
const intervalTime = 5000; // ms

const waitForOpenConnection = async (
	web3: Web3,
	backenMode: string,
	currentAttempt = 1,
	status = 'connected',
) =>
	new Promise<void>((resolve, reject) => {
		if (!isWs(backenMode)) {
			resolve();
			return;
		}

		const interval = setInterval(() => {
			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval);
				reject(new Error('Maximum number of attempts exceeded'));
				//not type safe, but, npm installing other packages creates an error
				//see here: https://github.com/ChainSafe/web3.js/runs/7545108665?check_suite_focus=true
			} else if ((web3.provider as any).getStatus() === status) {
				clearInterval(interval);
				resolve();
			}
			// eslint-disable-next-line no-plusplus, no-param-reassign
			currentAttempt++;
		}, intervalTime);
	});
const { log } = console;

async function main() {
	let web3: Web3;
	if (!process.env.MODE) throw new Error('No mode env variable!');
	const backendMode = process.env.MODE as string;

	let providerUrl = isWs(backendMode) ? process.env.INFURA_WSS : process.env.INFURA_HTTP;

	if (providerUrl === undefined) throw new Error('Provider url is undefined!');
	else providerUrl = providerUrl as string;

	log('Running on backend mode: ', backendMode);

	web3 = new Web3(providerUrl);

	if (isWs(backendMode)) console.log('^^^^^^^^^', await waitForOpenConnection(web3, backendMode));

	log();
	log('>>>>>>');
	log(`${backendMode?.toUpperCase()}:MAINNET getBlock`);
	log('>>>>>>');

	const block = await web3.eth.getBlock('latest');
	log(util.inspect(block));

	// Accounts
	log();
	log('>>>>>>');
	log('eth.accounts.createAccount');
	log('>>>>>>');

	const account = web3.eth.accounts.create();
	log(util.inspect(account));

	log();
	log('>>>>>>');
	log('eth.accounts.hashMessage');
	log('>>>>>>');

	const hash = web3.eth.accounts.hashMessage('Hello World');
	log(util.inspect(hash));

	//BatchRequest
	log();
	log('>>>>>>');
	log('BatchRequest');
	log('>>>>>>');

	const account2 = web3.eth.accounts.create();
	//todo add types to request/import
	const request1 = {
			id: 10,
			method: 'eth_getBalance',
			params: [account.address, 'latest'],
		},
		request2 = {
			id: 11,
			method: 'eth_getBalance',
			params: [account2.address, 'latest'],
		};

	const batch = new web3.BatchRequest();

	const request1Promise = batch.add(request1);
	const request2Promise = batch.add(request2);

	const executePromise = batch.execute();
	const response = await Promise.all([request1Promise, request2Promise, executePromise]);

	log(util.inspect(response));

	//ERC20 contract
	log();
	log('>>>>>>');
	log('ERC20');
	log('>>>>>>');

	const USDTAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
	const contract = new web3.eth.Contract(ERC20Token.abi, USDTAddress);

	const contractName = await contract.methods.name().call();
	const contractSymbol = await contract.methods.symbol().call();
	const initialSupply = await contract.methods.totalSupply().call();

	log('ERC20 Name', contractName);
	log('ERC20 Symbol', contractSymbol);
	log('ERC20 initial supply', initialSupply);

	//getTransaction
	log();
	log('>>>>>>');
	log('web3.eth.getTransaction');
	log('>>>>>>');
	const randomUSDTTransferTx =
		'0x133048bfcf6c0f7f8d1f5681df9607802894667acb46f4a3ba8ba187421dfc2b';
	let tx = await web3.eth.getTransaction(randomUSDTTransferTx);

	log(util.inspect(tx));
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		log(err);
		process.exit(1);
	});
