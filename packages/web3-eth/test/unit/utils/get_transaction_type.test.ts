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

import { EthExecutionAPI, Transaction, ETH_DATA_FORMAT } from 'web3-types';
import HttpProvider from 'web3-providers-http';
import { Web3Context } from 'web3-core';
import { format } from 'web3-utils';

import { transactionSchema } from '../../../src/schemas';
import { getTransactionType } from '../../../src/utils/transaction_builder';

describe('getTransactionType', () => {
	const expectedFrom = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';
	const expectedNonce = '0x42';
	const expectedGas = BigInt(21000);
	const expectedGasPrice = '0x4a817c800';
	const expectedChainId = '0x1';
	const expectedNetworkId = '0x4';

	it('getTransactionType should return transaction type 0 when provider does not support type 2 transactions', async () => {
		jest.mock('../../../src/rpc_method_wrappers', () => ({
			getBlock: { baseFeePerGas: undefined },
		}));

		const transaction: Transaction = {
			from: expectedFrom,
			to: '0x3535353535353535353535353535353535353535',
			value: '0x174876e800',
			gas: expectedGas,
			gasPrice: expectedGasPrice,
			type: '0x0',
			data: '0x',
			nonce: expectedNonce,
			chain: 'mainnet',
			hardfork: 'berlin',
			chainId: expectedChainId,
			networkId: expectedNetworkId,
			common: {
				customChain: {
					name: 'foo',
					networkId: expectedNetworkId,
					chainId: expectedChainId,
				},
				baseChain: 'mainnet',
				hardfork: 'berlin',
			},
		};
		const input = format(transactionSchema, transaction, ETH_DATA_FORMAT);

		const web3Context = new Web3Context<EthExecutionAPI>({
			provider: new HttpProvider('http://127.0.0.1:80'),
			config: {
				defaultAccount: expectedFrom,
			},
		});
		const transactionType = await getTransactionType(input, web3Context);
		expect(transactionType).toBe('0x0');
	});
});
