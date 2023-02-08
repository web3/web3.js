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

/* eslint-disable @typescript-eslint/no-unsafe-member-access, no-undef, @typescript-eslint/no-unsafe-call, no-console, @typescript-eslint/no-unsafe-assignment */
const miningThreads = 6;
let txBlock = 0;

function checkWork() {
	if (eth.getBlock('pending').transactions.length > 0) {
		txBlock = eth.getBlock('pending').number;
		if (eth.mining) return;
		//
		console.log('  Transactions pending. Mining...');
		miner.start(miningThreads);
		while (eth.getBlock('latest').number < txBlock + 12) {
			if (eth.getBlock('pending').transactions.length > 0)
				txBlock = eth.getBlock('pending').number;
		}
		console.log('  12 confirmations achieved; mining stopped.');
		miner.stop();
	} else {
		miner.stop();
	}
}

const latestFilter = eth.filter('latest', (err, block) => {
	console.log('Inside latest filter');
	checkWork();
});

const pendingFilter = eth.filter('pending', (err, block) => {
	console.log('Inside pending filter');
	checkWork();
});

latestFilter.watch((error, result) => {
	if (!error) console.log(result);
});

pendingFilter.watch((error, result) => {
	if (!error) console.log(result);
});

checkWork();
console.log(`**********\nMining script loaded \n**********`);
