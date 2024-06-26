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

import { InvalidAddressError, InvalidNumberError } from "web3-errors";
import { Address, Numbers } from "web3-types";
import { CreateTestData, testData } from '../fixtures/create';
import { createContractAddress } from "../../src/utils";


describe('createContractAddress', () => {

    it.each(testData)('creates correct contract address for input: %o', (testCase: CreateTestData) => {
        const { address, input } = testCase;
        const result = createContractAddress(input.from , input.nonce );
        expect(result).toBe(address);
      });

    it('should throw InvalidAddressError for invalid address', () => {
        expect(() => createContractAddress('invalid_address', 1)).toThrow(InvalidAddressError);
    });

    it('should throw Error for invalid nonce', () => {
        expect(() => createContractAddress('0xe2597eb05cf9a87eb1309e86750c903ec38e527e', "")).toThrow(InvalidNumberError);
    });

    it('should create contract address for valid inputs', () => {
        const from: Address = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0';
        const nonce: Numbers = 0;
        const expectedAddress = '0x343c43a37d37dff08ae8c4a11544c718abb4fcf8';

        const result = createContractAddress(from, nonce);

        expect(result).toBe(expectedAddress);
    });

    it('should handle different nonce types correctly', () => {
        const from: Address = '0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0';
        const testCases: [Numbers, string][] = [
            [1, '0xf0f6f18bca1b28cd68e4357452947e021241e9ce'],
            ['2', '0x2f015c4d6c3f24d2a4f5b659dc07489d68a19678'],
            [BigInt(3), '0xd2153229f47ab76e3855e7babc4a3bd3b7d2d7be'],
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
