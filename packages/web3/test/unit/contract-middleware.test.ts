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

import { CTransactionMiddleware } from 
// eslint-disable-next-line import/no-relative-packages
"../fixtures/transaction_middleware";

import { Web3 } from '../../src/index';
import {
	ERC20TokenAbi,
	// eslint-disable-next-line import/no-relative-packages
} from '../shared_fixtures/contracts/ERC20Token';

describe('Contract Middleware', () => {
	it('should set transaction middleware in contract new instance if its set at eth package', async () => {
		const web3 = new Web3();
		const contractA = new web3.eth.Contract(
			ERC20TokenAbi,
			'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		);

		expect(web3.eth.getTransactionMiddleware()).toBeUndefined();
		expect(contractA.getTransactionMiddleware()).toBeUndefined();

		const middleware = new CTransactionMiddleware();
		web3.eth.setTransactionMiddleware(middleware);

		const contractB = new web3.eth.Contract(
			ERC20TokenAbi,
			'0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
		);

		expect(web3.eth.getTransactionMiddleware()).toBeDefined();
		expect(contractB.getTransactionMiddleware()).toBeDefined();
		expect(web3.eth.getTransactionMiddleware()).toEqual(contractB.getTransactionMiddleware());

	});

});

