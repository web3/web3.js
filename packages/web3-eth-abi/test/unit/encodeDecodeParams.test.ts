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
import { decodeParameters, encodeParameters } from '../../src';
import testsData from '../fixtures/abitestsdata.json';
import { deepEqualTolerateBigInt, removeKey } from './test_utils';

describe('encodeParameters decodeParameters tests should pass', () => {
	it.each(testsData)(`unit test of encodeParameters - $name`, encoderTestObj => {
		const encodedResult = encodeParameters([encoderTestObj.type], [encoderTestObj.value]);
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
});
