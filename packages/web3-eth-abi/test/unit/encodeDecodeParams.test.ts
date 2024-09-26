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

import { AbiInput } from 'web3-types';
import { decodeParameters, encodeParameters, inferTypesAndEncodeParameters } from '../../src';
import testsData from '../fixtures/abitestsdata.json';
import { deepEqualTolerateBigInt, removeKey } from './test_utils';

describe('encodeParameters decodeParameters tests should pass', () => {
	it.each(testsData)(`unit test of encodeParameters - $name`, encoderTestObj => {
		const encodedResult = encodeParameters([encoderTestObj.type], [encoderTestObj.value]);
		expect(encodedResult).toEqual(encoderTestObj.encoded);
	});

	it.each(testsData)(`unit test of encodeParameters - $name`, encoderTestObj => {
		// skip for types that are not supported by infer-types
		// the unsupported types are uint(other than 256), int(other than 256), bytes(that has a number like bytes1 or bytes2), and arrays
		if (/((?<!u)int)|((?<!uint\d)uint(?!256))|(bytes\d)|(\[.*?\])/.test(encoderTestObj.type)) {
			return;
		}

		const encodedResult = inferTypesAndEncodeParameters([encoderTestObj.value]);
		expect(encodedResult).toEqual(encoderTestObj.encoded);
	});

	it.each(testsData)('unit test of decodeParameters - $name', decoderTestObj => {
		const decodedResult = decodeParameters(
			[decoderTestObj.type] as AbiInput[],
			decoderTestObj.encoded,
		);

		removeKey(decodedResult[0], '__length__');

		expect(deepEqualTolerateBigInt(decodedResult[0], decoderTestObj.value)).toBeTruthy();
	});

	it('unit test of decodeParameters with first immutable param', () => {
		const bytes =
			'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000015a828c295b2bea094b70a05e96ae19c876417adf3a9083500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040729a97ba5090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000634d6f6f20c3a9f09f9a80c3a96f4d6f206f20c3a9204d4dc3a9f09f9a802020c3a96f4df09f9a806ff09f9a804df09f9a806fc3a920f09f9a80c3a94df09f9a80f09f9a8020c3a920f09f9a8020c3a9c3a96f4d6fc3a96fc3a94dc3a94dc3a96f6f4d6f0000000000000000000000000000000000000000000000000000000000';

		const result = [
			'531024955072740163537488200975830992725163050550575040565',
			[
				'Moo é🚀éoMo o é MMé🚀  éoM🚀o🚀M🚀oé 🚀éM🚀🚀 é 🚀 ééoMoéoéMéMéooMo',
				'0x729a97ba5090',
			],
		];
		const readonlyArray = ['(uint192,(string,bytes6))'] as const; // should allow immutable array as first param

		const decodedResult = decodeParameters(readonlyArray, bytes);

		removeKey(decodedResult[0], '__length__');
		expect(deepEqualTolerateBigInt(decodedResult[0], result)).toBeTruthy();
	});
});
