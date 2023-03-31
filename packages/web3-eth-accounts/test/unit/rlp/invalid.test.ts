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

import { RLP } from '../../../src';
import { hexToBytes } from '../../../src/rlp/utils';

import * as invalid from '../../fixtures/invalid.json';

const invalidTests = Object.entries(invalid.tests).map(([testName, testData]) => ({
	testName,
	testData,
}));

describe('invalid tests', () => {
	it.each(invalidTests)(`should pass %s`, ({ testData }) => {
		let { out } = testData;
		const { error } = testData;
		if (out.startsWith('0') && out[1] === 'x') {
			out = out.slice(2);
		}
		const byte = hexToBytes(out);
		expect(() => RLP.decode(byte)).toThrow(error);
	});

	// it('should pass long string sanity check test', (st) => {
	//   // long string invalid test; string length > 55
	//   const longBufferTest = RLP.encode(
	//     'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss'
	//   )
	//   // sanity checks
	//   st.ok(longBufferTest[0] > 0xb7)
	//   st.ok(longBufferTest[0] <= 0xbf)
	//
	//   // try to decode the partial buffer
	//   st.throws(() => {
	//     RLP.decode(longBufferTest.slice(1, longBufferTest.length - 1))
	//   }, 'string longer than 55 bytes: should throw')
	//   st.end()
	// })
});

// The tests below are taken from Geth
// https://github.com/ethereum/go-ethereum/blob/99be62a9b16fd7b3d1e2e17f1e571d3bef34f122/rlp/decode_test.go
// Not all tests were taken; some which throw due to type errors in Geth are ran against Geth's RLPdump to
// see if there is a decode error or not. In both cases, the test is converted to either reflect the
// expected value, or if the test is invalid, it is added as error test case

// const invalidGethCases: string[] = [
//   'F800',
//   'BA0002FFFF',
//   'B90000',
//   'B800',
//   '817F',
//   '8100',
//   '8101',
//   'C8C9010101010101010101',
//   'F90000',
//   'F90055',
//   'FA0002FFFF',
//   'BFFFFFFFFFFFFFFFFFFF',
//   'C801',
//   'CD04040404FFFFFFFFFFFFFFFFFF0303',
//   'C40102030401',
//   'C4010203048180',
//   '81',
//   'BFFFFFFFFFFFFFFF',
//   'C801',
//   'c330f9c030f93030ce3030303030303030bd303030303030',
//   '8105',
//   'B8020004',
//   'F8020004',
// ]

// describe('invalid geth tests', () => {
//   for (const gethCase of invalidGethCases) {
//     const input = hexToBytes(gethCase)
//     it('should pass Geth test', (st) => {
//       st.throws(() => {
//         RLP.decode(input)
//       }, `should throw: ${gethCase}`)
//       st.end()
//     })
//   }
// })
