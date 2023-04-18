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

import { Web3Eth } from 'web3-eth';

import * as abi from 'web3-eth-abi';
import * as accounts from 'web3-eth-accounts';
import * as contract from 'web3-eth-contract';
import * as ens from 'web3-eth-ens';
import * as personal from 'web3-eth-personal';
import * as iban from 'web3-eth-iban';

import * as http from 'web3-providers-http';
import * as ws from 'web3-providers-ws';

import Web3Default, { Web3, providers, eth } from '../../src/index';

describe('exports of web3 package', () => {
	describe('eth exports', () => {
		it('`Web3` is the default exported class', () => {
			expect(Web3).toEqual(Web3Default);
		});

		it('`Web3Eth` is available under `eth`', () => {
			expect(eth.Web3Eth).toEqual(Web3Eth);
		});

		it('eth sub-namespaces are available under `eth`', () => {
			expect(eth.abi).toEqual(abi);
			expect(eth.accounts).toEqual(accounts);
			expect(eth.contract).toEqual(contract);
			expect(eth.ens).toEqual(ens);
			expect(eth.personal).toEqual(personal);
			expect(eth.iban).toEqual(iban);
		});
	});

	describe('providers exports', () => {
		it('providers main objects are available under `providers`', () => {
			expect(providers.Eip1193Provider).toBeTruthy();
			expect(providers.SocketProvider).toBeTruthy();
		});

		it('providers sub-namespaces are available under `providers`', () => {
			expect(providers.http).toEqual(http);
			expect(providers.ws).toEqual(ws);
		});
	});
});
