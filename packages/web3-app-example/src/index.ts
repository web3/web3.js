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
import { numberToHex } from 'web3-utils/dist';
import Wallet from './wallet';
import Account from './account';

(async () => {
	// example of utils
	// eslint-disable-next-line no-console
	console.log(numberToHex(23));

	// example of account
	const acc = new Account('0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd');
	const currentAccount = acc.getAccount();
	// eslint-disable-next-line no-console
	console.log('currentAccount', currentAccount);

	// example of wallet
	const wallet = new Wallet('0xb45b02f408a0dd0996aab2b55a54f4ed7735f82b133c0786a9ff372ffaaf11bd');
	// eslint-disable-next-line no-console
	console.log('balance ', await wallet.getBalance());

	await wallet.sendEther('0xcd9df751bc720112727ed0d4a8040ecfdc918041', '0x1');

	// eslint-disable-next-line no-console
	console.log(
		'Recipient balance',
		await wallet.getBalance('0xcd9df751bc720112727ed0d4a8040ecfdc918041'),
	);
})().catch(console.error);
