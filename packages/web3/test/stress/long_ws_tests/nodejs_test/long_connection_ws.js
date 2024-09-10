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
const { Web3 } = require('../../../../lib/commonjs');
const secrets = require('../../../../../../.secrets.json');

let web3;
let attempt = 0;
let intervalId;
let start;
let end;

// constantly send requests through WS for 10 hours
const sendRequests = () => {
	start = new Date();
	console.log('start:', start);
	return new Promise((resolve, reject) => {
		// send a request in intervals of 10 minutes
		intervalId = setInterval(async () => {
			try {
				const block = await web3.eth.getBlock();
				attempt++;
				console.log(block);
				console.log('successful calls:', attempt, 'has ran for:', attempt * 10, 'minutes');
				if (attempt === 144) {
					// after 10 hours
					clearInterval(intervalId);
					resolve('');
				}
			} catch (error) {
				clearInterval(intervalId);
				reject(error);
			}
		}, 600000); // every 10 minutes
	});
};

const main = async () => {
	try {
		// You will need to set mainnet infura provider
		const provider = secrets.MAINNET.WS;
		web3 = new Web3(provider);
		const promise = sendRequests();
		await promise;
		end = new Date();
		console.log('websocket test successful');
	} catch (e) {
		console.warn(
			'error occurred during ws test, on attempt: ',
			attempt,
			'program ran for: ',
			attempt,
			'minutes with error: ',
			e,
		);
	}
	console.log('start', start);
	console.log('end', end);
	process.exit();
};

main();
