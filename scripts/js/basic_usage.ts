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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Web3Context } from 'web3-core';
import types from 'web3-types';

const isWs = (backendMode: string) => backendMode === 'ws';

const maxNumberOfAttempts = 10;
const intervalTime = 5000; // ms

const waitForOpenConnection = async (
	web3Context: Web3Context<any>,
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
			} else if (
				(web3Context.provider as unknown as types.Web3BaseProvider).getStatus() === status
			) {
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
	if (!typeof process.env.MODE) throw new Error('No mode env variable!');
	const backendMode = process.env.MODE as string;

	let providerUrl = isWs(backendMode) ? process.env.INFURA_WSS : process.env.INFURA_HTTP;

	if (typeof providerUrl === undefined) throw new Error('Provider url is undefined!');
	else providerUrl = providerUrl as string;

	log('Running on backend mode: ', backendMode);

	// Providers
	log();
	log('>>>>>>');
	log(`${backendMode?.toUpperCase()}:MAINNET getBlock`);
	log('>>>>>>');

	web3 = new Web3(providerUrl as string);

	console.log('^^^^^^^^^', await waitForOpenConnection(web3, backendMode));
	// Accounts
	web3 = new Web3();

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
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		log(err);
		process.exit(1);
	});
