// These need to be imported first in order for cross-fetch to be mocked correctly
import fetchMock from 'jest-fetch-mock';

jest.setMock('cross-fetch', fetchMock);

/* eslint-disable-next-line import/first */
import {
	JsonRpcPayload,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
	ResponseError,
} from 'web3-common';

/* eslint-disable-next-line import/first */
import { HttpProvider } from '../../src/index';
/* eslint-disable-next-line import/first */
import { httpProviderOptions, mockGetBalanceResponse } from '../fixtures/test_data';

describe('HttpProvider - implemented methods', () => {
	const jsonRpcPayload = {
		jsonrpc: '2.0',
		id: 42,
		method: 'eth_getBalance',
		params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
	} as JsonRpcPayload;

	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	describe('httpProvider.send', () => {
		it('Should call HttpProvider.request with correct parameters', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			const requestSpy = jest.spyOn(httpProvider, 'request');
			httpProvider.send(jsonRpcPayload, jest.fn(), httpProviderOptions);

			expect(requestSpy).toHaveBeenCalledWith(jsonRpcPayload, httpProviderOptions);
		});

		it('callback should receive expected values - Success', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			const callback = jest.fn(
				(error?: JsonRpcResponseWithError, result?: JsonRpcResponseWithResult) => {
					expect(error).toBeUndefined();
					expect(result).toStrictEqual(mockGetBalanceResponse);
				},
			);

			httpProvider.send(jsonRpcPayload, callback, httpProviderOptions);
		});

		it('callback should receive expected values - ResponseError', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse), { status: 400 });

			const callback = jest.fn(
				(error?: JsonRpcResponseWithError, result?: JsonRpcResponseWithResult) => {
					expect(error).toBeInstanceOf(ResponseError);
					expect(result).toBeUndefined();
				},
			);

			httpProvider.send(jsonRpcPayload, callback, httpProviderOptions);
		});
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
