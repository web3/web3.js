// These need to be imported first in order for cross-fetch
// to be mocked correctly
import fetchMock from 'jest-fetch-mock';
jest.setMock('cross-fetch', fetchMock);

import { JsonRpcPayload, JsonRpcResponseWithError, JsonRpcResponseWithResult } from 'web3-common';

import { HttpProvider } from '../../src/index';
import { httpProviderOptions } from '../fixtures/http_provider_options';

describe('HttpProvider.send', () => {
	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	it('should call HttpProvider.request with correct parameters', () => {
		const mockGetBalanceResponse = {
			id: 1,
			jsonrpc: '2.0',
			result: '0x0234c8a3397aab58', // 158972490234375000
		};
		fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

		const requestSpy = jest.spyOn(httpProvider, 'request');
		const jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
		} as JsonRpcPayload;
		const callback = jest.fn(
			(error?: JsonRpcResponseWithError, result?: JsonRpcResponseWithResult) => {
                expect(error).toBe(undefined);
                expect(result).toStrictEqual(mockGetBalanceResponse);
			},
		);

		httpProvider.send(jsonRpcPayload, callback, httpProviderOptions);

		expect(requestSpy).toHaveBeenCalledWith(jsonRpcPayload, httpProviderOptions);
	});
});
