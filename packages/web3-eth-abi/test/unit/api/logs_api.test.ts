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

import { decodeLog } from '../../../src/api/logs_api';
import { validDecodeLogsData } from '../../fixtures/data';

describe('logs_api', () => {
	describe('decodeLog', () => {
		describe('valid data', () => {
			it.each(validDecodeLogsData)(
				'should pass for valid values: %j',
				({ input: { abi, data, topics }, output }) => {
					const expected = decodeLog(abi, data, topics);
					expect(JSON.parse(JSON.stringify(expected))).toEqual(output);
				},
			);
		});

		it('decodeLog with first immutable param', () => {
			const abi = [
				{
					type: 'string',
					name: 'myString',
				},
				{
					type: 'uint256',
					name: 'myNumber',
					indexed: true,
				},
				{
					type: 'uint8',
					name: 'mySmallNumber',
					indexed: true,
				},
			] as const;

			const data =
				'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000';

			const topics = [
				'0x000000000000000000000000000000000000000000000000000000000000f310',
				'0x0000000000000000000000000000000000000000000000000000000000000010',
			];

			const result = {
				'0': 'Hello%!',
				'1': '62224',
				'2': '16',
				__length__: 3,
				myString: 'Hello%!',
				myNumber: '62224',
				mySmallNumber: '16',
			};

			const expected = decodeLog(abi, data, topics);
			expect(JSON.parse(JSON.stringify(expected))).toEqual(result);
		});
	});
});
