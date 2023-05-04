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
import { hexToBytes } from 'web3-utils';

import Web3, { FMT_BYTES, FMT_NUMBER } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { getSystemE2ETestProvider, getE2ETestAccountAddress } from '../e2e_utils';

describe(`${getSystemTestBackend()} tests - call`, () => {
	const provider = getSystemE2ETestProvider();

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			format: string;
		}>({
			format: Object.values(FMT_BYTES),
		}),
	)('should call retrieve method from deployed contract', async ({ format }) => {
		const result = await web3.eth.call(
			{
				to: '0xEdFd52255571b4a9A9d4445989E39f5c14Ff0447',
				input: '0x2e64cec1',
			},
			undefined,
			{
				number: FMT_NUMBER.HEX,
				bytes: format as FMT_BYTES,
			},
		);

		switch (format) {
			case 'BYTES_HEX':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toBe(
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual(
					new Uint8Array(
						hexToBytes(
							'0x0000000000000000000000000000000000000000000000000000000000000000',
						),
					),
				);
				break;
			default:
				throw new Error('Unhandled format');
		}
	});

	it.each(
		toAllVariants<{
			format: string;
		}>({
			format: Object.values(FMT_BYTES),
		}),
	)('should call getOwner method from deployed contract', async ({ format }) => {
		const expectedResult = `0x000000000000000000000000${getE2ETestAccountAddress()
			.substring(2)
			.toLowerCase()}`;
		const result = await web3.eth.call(
			{
				to: '0xEdFd52255571b4a9A9d4445989E39f5c14Ff0447',
				input: '0x893d20e8',
			},
			undefined,
			{
				number: FMT_NUMBER.HEX,
				bytes: format as FMT_BYTES,
			},
		);

		switch (format) {
			case 'BYTES_HEX':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toBe(expectedResult);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(result).toStrictEqual(new Uint8Array(hexToBytes(expectedResult)));
				break;
			default:
				throw new Error('Unhandled format');
		}
	});
});
