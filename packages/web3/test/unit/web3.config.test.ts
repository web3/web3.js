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

import { ETH_DATA_FORMAT } from 'web3-types';
import { Web3Context } from 'web3-core';
import { Web3 } from '../../src';

describe('web3config web3 tests', () => {
	describe('web3config contract', () => {
		it('create web3context with configs and should set it for web3', async () => {
			const context = new Web3Context('http://127.0.0.1:8545');
			context.setConfig({ defaultTransactionType: '0x0' });
			const web3 = new Web3(context);
			expect(web3.getContextObject().config.defaultTransactionType).toBe('0x0');
			expect(web3.config.defaultTransactionType).toBe('0x0');
			expect(web3.eth.getContextObject().config.defaultTransactionType).toBe('0x0');
		});

		it('should be able to create web3 and setconfig for contracts', async () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			web3.setConfig({ defaultTransactionType: '0x0' });
			expect(web3.getContextObject().config.defaultTransactionType).toBe('0x0');
			expect(web3.config.defaultTransactionType).toBe('0x0');
			expect(web3.eth.getContextObject().config.defaultTransactionType).toBe('0x0');

			const contract = new web3.eth.Contract([], '');
			expect(contract.config.defaultTransactionType).toBe('0x0');
			expect(contract.getContextObject().config.defaultTransactionType).toBe('0x0');

			contract.setConfig({ contractDataInputFill: 'both' });
			expect(contract.getContextObject().config.contractDataInputFill).toBe('both');

			// web3 config shouldn't change
			expect(web3.getContextObject().config.contractDataInputFill).toBe('data');
			expect(web3.config.contractDataInputFill).toBe('data');
			expect(web3.eth.getContextObject().config.contractDataInputFill).toBe('data');
		});
		it('should change web3 config context but not contract config context', async () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			const contract = new web3.eth.Contract([]);
			web3.setConfig({ defaultTransactionType: '0x0' });
			expect(contract.getContextObject().config.defaultTransactionType).toBe('0x2');
			expect(web3.getContextObject().config.defaultTransactionType).toBe('0x0');
		});

		it('should not change web3config when changing contract config context', async () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			const contract = new web3.eth.Contract([]);
			contract.setConfig({ defaultTransactionType: '0x0' });
			expect(contract.getContextObject().config.defaultTransactionType).toBe('0x0');
			expect(web3.getContextObject().config.defaultTransactionType).toBe('0x2');
		});

		it('should create two contracts with different configs', () => {
			const web3 = new Web3('http://127.0.0.1:8545');

			web3.setConfig({ contractDataInputFill: 'data' });
			const c1 = new web3.eth.Contract([], '');

			const c2 = new web3.eth.Contract(
				[],
				new Web3Context({ config: { contractDataInputFill: 'input' } }),
			);

			const c3 = new web3.eth.Contract([], { dataInputFill: 'input' });
			expect(web3.config.contractDataInputFill).toBe('data');
			expect(c1.config.contractDataInputFill).toBe('data');
			expect(c2.config.contractDataInputFill).toBe('input');
			expect(c3.config.contractDataInputFill).toBe('input');
		});

		it('should create a contract with context and returnFormat properly with different parameters', () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			web3.setConfig({ contractDataInputFill: 'data' });

			// create contract with context in second param
			const c1 = new web3.eth.Contract(
				[],
				new Web3Context({ config: { contractDataInputFill: 'input' } }),
			);

			// create contract with context in third param
			const c2 = new web3.eth.Contract(
				[],
				'',
				new Web3Context({ config: { contractDataInputFill: 'both' } }),
			);

			// create contract with context in fourth param
			const c3 = new web3.eth.Contract(
				[],
				'',
				{ gas: 'gas' },
				new Web3Context({ config: { contractDataInputFill: 'both' } }),
			);

			expect(c1.config.contractDataInputFill).toBe('input');
			expect(c1.getContextObject().config.contractDataInputFill).toBe('input');

			expect(c2.config.contractDataInputFill).toBe('both');
			expect(c2.getContextObject().config.contractDataInputFill).toBe('both');

			expect(c3.config.contractDataInputFill).toBe('both');
			expect(c3.getContextObject().config.contractDataInputFill).toBe('both');

			// create contract with returnFormat in fourth param
			const c4 = new web3.eth.Contract([], '', { gas: 'gas' }, ETH_DATA_FORMAT);

			// create contract with returnFormat in fifth param
			const c5 = new web3.eth.Contract(
				[],
				'',
				{ gas: 'gas' },
				new Web3Context({ config: { contractDataInputFill: 'data' } }),
				ETH_DATA_FORMAT,
			);

			expect(c4.config.contractDataInputFill).toBe('data');
			expect(c4.getContextObject().config.contractDataInputFill).toBe('data');

			expect(c5.config.contractDataInputFill).toBe('data');
			expect(c5.getContextObject().config.contractDataInputFill).toBe('data');
		});

		it('should create contracts with different ways to configure', () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			web3.setConfig({ contractDataInputFill: 'data' });

			const c1 = new web3.eth.Contract([], '');

			const c2 = new web3.eth.Contract(
				[],
				new Web3Context({ config: { contractDataInputFill: 'input' } }),
			);

			const c3 = new web3.eth.Contract([], { dataInputFill: 'input' });

			expect(web3.config.contractDataInputFill).toBe('data');
			expect(c1.config.contractDataInputFill).toBe('data');
			expect(c2.config.contractDataInputFill).toBe('input');
			expect(c3.config.contractDataInputFill).toBe('input');
		});

		it('should populate dataInputFill properly', () => {
			const web3 = new Web3('http://127.0.0.1:8545');
			// create a contract with options as second parameter
			const c1 = new web3.eth.Contract([], { dataInputFill: 'both' });
			expect(c1.config.contractDataInputFill).toBe('both');

			// create a contract with options as third parameter
			const c2 = new web3.eth.Contract([], '', { dataInputFill: 'both' });
			expect(c2.config.contractDataInputFill).toBe('both');
		});
	});
	// TODO: finish config unit tests
});
