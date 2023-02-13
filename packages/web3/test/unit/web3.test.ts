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

import { Contract } from 'web3-eth-contract';
import { Web3 } from '../../src/web3';

describe('Web3 object', () => {
	it('should be able to set and read web3 providers', () => {
		const web3NoProvider = new Web3();
		expect(web3NoProvider).toBeTruthy();
		expect(web3NoProvider.provider).toBeUndefined();

		const web3 = new Web3('http://somenode');
		expect(web3).toBeTruthy();
		expect(web3.provider).toEqual({
			clientUrl: 'http://somenode',
			httpProviderOptions: undefined,
		});
	});
	describe('creating a Contract object with the constructor at Web3 -> eth.Contract', () => {
		const Web3Contract = new Web3().eth.Contract;
		const address = '0x0000000000000000000000000000000000000000';
		const options = { gas: '100' };

		it('should work when `address`=`undefined` and `options`=`undefined`', () => {
			const contract1 = new Web3Contract([{}], undefined, undefined);
			expect(contract1).toBeInstanceOf(Contract);
			expect(contract1.options.address).toBeUndefined();
			expect(contract1.options.gas).toBeUndefined();
		});
		it('should accept when not passing `address` or `options`', () => {
			const contract2 = new Web3Contract([{}]);
			expect(contract2).toBeInstanceOf(Contract);
			expect(contract2.options.address).toBeUndefined();
			expect(contract2.options.gas).toBeUndefined();
		});
		it('should work when `address`=`undefined` and `options` is an object', () => {
			const contract3 = new Web3Contract([{}], undefined, options);
			expect(contract3).toBeInstanceOf(Contract);
			expect(contract3.options.address).toBeUndefined();
			expect(contract3.options.gas).toEqual(options.gas);
		});
		it('should work when `address` is an empty string and `options` is an object', () => {
			const contract4 = new Web3Contract([{}], '', options);
			expect(contract4).toBeInstanceOf(Contract);
			expect(contract4.options.address).toBe('');
			// TODO: uncomment the next line after fixing https://github.com/web3/web3.js/issues/5815
			// expect(contract4.options.gas).toEqual(options.gas);
		});
		it('should work when `address` is a string and `options` is not passed', () => {
			const contract5 = new Web3Contract([{}], address);
			expect(contract5).toBeInstanceOf(Contract);
			expect(contract5.options.address).toEqual(address);
			expect(contract5.options.gas).toBeUndefined();
		});
		it('should work when `address` is a string and `options` is an object', () => {
			// TODO: uncomment the next line after fixing https://github.com/web3/web3.js/issues/5815
			// const contract7 = new Web3Contract([{}], address, options);
			// expect(contract7).toBeInstanceOf(Contract);
			// expect(contract7.options.address).toEqual(address);
			// expect(contract7.options.gas).toEqual(options.gas);
		});
		it('should not accept if `options` is a function', () => {
			// TODO: uncomment the next line after fixing https://github.com/web3/web3.js/issues/5815
			// expect(() => {
			// 	new Web3Contract([{}], (() => {}) as ContractInitOptions);
			// }).toThrowError();
		});
	});
});
