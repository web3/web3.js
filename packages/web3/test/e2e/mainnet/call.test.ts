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
import { bytesToHex } from 'web3-utils';
import Web3, { FMT_BYTES, FMT_NUMBER } from '../../../src';
import {
	closeOpenConnection,
	getSystemTestBackend,
} from '../../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { getSystemE2ETestProvider } from '../e2e_utils';

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
				to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				input: '0x18160ddd',
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
				expect(result).toMatch(/0[xX][0-9a-fA-F]{64}/i);
				break;
			case 'BYTES_UINT8ARRAY':
				// eslint-disable-next-line jest/no-conditional-expect
				expect(bytesToHex(result)).toMatch(/0[xX][0-9a-fA-F]{64}/i);
				break;
			default:
				throw new Error('Unhandled format');
		}
	});
});
