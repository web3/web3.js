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

import { InvalidAddressError, InvalidNumberError } from 'web3-errors';
import { Address, Numbers } from 'web3-types';
import { CreateTestData, testData } from '../fixtures/create';
import { create2ContractAddress, createContractAddress } from '../../src/utils';
import { create2TestData } from '../fixtures/create2';

describe('createContractAddress', () => {
	it.each(testData)(
		'creates correct contract address for input: %o',
		(testCase: CreateTestData) => {
			const { address, input } = testCase;
			const result = createContractAddress(input.from, input.nonce);
			expect(result).toBe(address);
		},
	);

	it('should throw InvalidAddressError for invalid address', () => {
		expect(() => createContractAddress('invalid_address', 1)).toThrow(InvalidAddressError);
	});

	it('should throw Error for invalid nonce', () => {
		expect(() =>
			createContractAddress('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', ''),
		).toThrow(InvalidNumberError);
	});

	it('should handle different nonce types correctly', () => {
		const from: Address = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0';
		const testCases: [Numbers, string][] = [
			[1, '0x343c43A37D37dfF08AE8C4A11544c718AbB4fCF8'],
			['0x2', '0xf778B86FA74E846c4f0a1fBd1335FE81c00a0C91'],
			[BigInt(3), '0xffFd933A0bC612844eaF0C6Fe3E5b8E9B6C1d19c'],
		];

		testCases.forEach(([nonce, expectedAddress]) => {
			const result = createContractAddress(from, nonce);
			expect(result).toBe(expectedAddress);
		});
	});

	it('should create different addresses for different nonces', () => {
		const from: Address = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0';
		const address1 = createContractAddress(from, 0);
		const address2 = createContractAddress(from, 1);

		expect(address1).not.toBe(address2);
	});

	it('should create different addresses for different sender addresses', () => {
		const from1: Address = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0';
		const from2: Address = '0x1234567890123456789012345678901234567890';
		const nonce: Numbers = 0;

		const address1 = createContractAddress(from1, nonce);
		const address2 = createContractAddress(from2, nonce);

		expect(address1).not.toBe(address2);
	});
});

describe('create2ContractAddress', () => {
	it.each(create2TestData)('creates correct contract address for input: %o', testCase => {
		const result = create2ContractAddress(testCase.address, testCase.salt, testCase.init_code);
		expect(result).toBe(testCase.result);
	});

	it('should throw an InvalidAddressError if the from address is invalid', () => {
		expect(() =>
			create2ContractAddress(
				'0xinvalidaddress',
				create2TestData[0].salt,
				create2TestData[0].init_code,
			),
		).toThrow('Invalid address given 0xinvalidaddress');
	});

	it('should throw an InvalidMethodParamsError if the salt is invalid', () => {
		expect(() =>
			create2ContractAddress(
				create2TestData[0].address,
				'0xinvalidsalt',
				create2TestData[0].init_code,
			),
		).toThrow('Invalid salt value 0xinvalidsalt');
	});

	it('should throw an InvalidMethodParamsError if the initCode is invalid', () => {
		expect(() =>
			create2ContractAddress(
				create2TestData[0].address,
				create2TestData[0].salt,
				'0xinvalidcode',
			),
		).toThrow('Invalid initCode value 0xinvalidcode');
	});
});
