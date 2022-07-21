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

// These need to be imported first in order for cross-fetch to be mocked correctly
import fetchMock from 'jest-fetch-mock';

jest.setMock('cross-fetch', fetchMock);

/* eslint-disable-next-line import/first */
import { Web3APIPayload, EthExecutionAPI } from 'web3-types';
/* eslint-disable-next-line import/first */
import { ResponseError } from 'web3-errors';
/* eslint-disable-next-line import/first */
import HttpProvider from '../../src/index';
/* eslint-disable-next-line import/first */
import { mockGetBalanceResponse } from '../fixtures/test_data';

describe('HttpProvider - implemented methods', () => {
	const jsonRpcPayload = {
		jsonrpc: '2.0',
		id: 42,
		method: 'eth_getBalance',
		params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
	} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	describe('httpProvider.supportsSubscriptions', () => {
		it('should return false', () => {
			expect(httpProvider.supportsSubscriptions()).toBe(false);
		});
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			expect(await httpProvider.request(jsonRpcPayload)).toStrictEqual(
				mockGetBalanceResponse,
			);
		});

		it('should return ResponseError', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse), { status: 400 });

			await expect(httpProvider.request(jsonRpcPayload)).rejects.toThrow(ResponseError);
		});
	});
});
