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

async function main() {
	let web3: Web3;

	console.log('inside main');

	const providerUrl = process.env.INFURA_WS ?? process.env.INFURA_HTTP;
	console.log('Provider url', providerUrl);
	log('-----', process.env.INFURA_HTTP);
	log('-----', process.env.INFURA_WS);
	log('-----', process.env.INFURA_WSS);
	log('-----', process.env.INFURA_GOERLI_WS);
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
