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
import { prepareTransactionForSigning } from 'web3-eth';
import accounts from '../shared_fixtures/accounts.json';
import { context } from './helpers';

export const processingTx = async () => {
	return prepareTransactionForSigning(
		{
			from: accounts[0].address,
			to: accounts[1].address,
			value: BigInt(1),
			nonce: 0,
			chainId: 0,
			gas: BigInt(100000),
			gasPrice: BigInt(10000),
		},
		context,
		undefined,
		false,
		false,
	);
};
