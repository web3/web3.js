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

const { log } = console;

export const getEnvVar = (name: string): string | undefined => process.env[name];

export const DEFAULT_SYSTEM_PROVIDER = 'http://localhost:8545';
export const getSystemTestProvider = (): string =>
	getEnvVar('WEB3_SYSTEM_TEST_PROVIDER') ?? DEFAULT_SYSTEM_PROVIDER;
export const isHttp = getSystemTestProvider().startsWith('http');

async function main() {
	let web3: Web3;

	console.log('inside main');

	const providerUrl = isHttp ? process.env.INFURA_HTTP : process.env.INFURA_WSS;
	console.log('Provider url', providerUrl);
	log('-----matrix.mode', process.env.MODE);

	// Providers
	log();
	log('>>>>>>');
	log('HTTP:MAINNET getBlock');
	log('>>>>>>');

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
