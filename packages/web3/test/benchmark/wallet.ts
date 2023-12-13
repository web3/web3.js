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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Wallet, create, Web3Account, recover } from 'web3-eth-accounts';
import { Web3AccountProvider } from 'web3-types';
import { context } from './helpers';

const wallet = new Wallet(context.accountProvider as Web3AccountProvider<any>);
const acc = create();
wallet.add(acc);

export const sign = async () => {
	return (wallet.get(acc.address) as Web3Account).sign('Some data');
};

const signedData = {
	message: 'Some data',
	messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
	v: '0x1c',
	r: '0x297a764ab50bf53381d19ce1dc2b7dd4c456c91e38722ebced5b9f5bb54648f3',
	s: '0x41f216d7482608ca295651a7fa4f66a5ee5336d06a9d5b344f8a9160e1e9c2aa',
	signature:
		'0x297a764ab50bf53381d19ce1dc2b7dd4c456c91e38722ebced5b9f5bb54648f341f216d7482608ca295651a7fa4f66a5ee5336d06a9d5b344f8a9160e1e9c2aa1c',
};

export const verify = async () => {
	return recover(signedData.message, signedData.v, signedData.r, signedData.s);
};
