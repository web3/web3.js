// These need to be imported first in order for cross-fetch to be mocked correctly
import fetchMock from 'jest-fetch-mock';

jest.setMock('cross-fetch', fetchMock);

/* eslint-disable-next-line import/first */
import {
	ExecutionJsonRpcRequest,
	ConsensusJsonRpcRequest,
	ResponseError,
	JsonRpcResponseError,
	JsonRpcResponse,
	SupportedProtocolsEnum,
} from 'web3-common';

/* eslint-disable-next-line import/first */
import { HttpProvider } from '../../src/index';
/* eslint-disable-next-line import/first */
import {
	httpProviderOptions,
	mockBeaconBlockHeaderResponse,
	mockGetBalanceResponse,
} from '../fixtures/test_data';

describe('HttpProvider - implemented methods', () => {
	const executionJsonRpcPayload = {
		jsonrpc: '2.0',
		id: 42,
		method: 'eth_getBalance',
		params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
	} as ExecutionJsonRpcRequest;

	const consensusJsonRpcPayload = {
		endpoint: '/eth/v1/beacon/headers/42',
		protocol: SupportedProtocolsEnum.CONSENSUS,
	} as ConsensusJsonRpcRequest;

	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	describe('httpProvider.send', () => {
		it('Should call HttpProvider.request with correct providerOptions - Execution', () => {
			const globalProviderOptions = {
				providerOptions: {
					...httpProviderOptions.providerOptions,
					integrity: 'shouldBeOverwritten',
					referer: 'shouldBeOverwritten',
				},
			};
			const httpProviderWithProviderOptions = new HttpProvider(
				'http://localhost:8545',
				globalProviderOptions,
			);

			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			const requestSpy = jest.spyOn(httpProviderWithProviderOptions, 'request');
			httpProviderWithProviderOptions.send(
				executionJsonRpcPayload,
				jest.fn(),
				httpProviderOptions.providerOptions,
			);

			expect(requestSpy).toHaveBeenCalledWith(
				executionJsonRpcPayload,
				httpProviderOptions.providerOptions,
			);
		});

		it('Should call HttpProvider.request with correct providerOptions - Consensus', () => {
			const globalProviderOptions = {
				providerOptions: {
					...httpProviderOptions.providerOptions,
					integrity: 'shouldBeOverwritten',
					referer: 'shouldBeOverwritten',
				},
			};
			const httpProviderWithProviderOptions = new HttpProvider(
				'http://localhost:8545',
				globalProviderOptions,
			);

			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse));

			const requestSpy = jest.spyOn(httpProviderWithProviderOptions, 'request');
			httpProviderWithProviderOptions.send(
				consensusJsonRpcPayload,
				jest.fn(),
				httpProviderOptions.providerOptions,
			);

			expect(requestSpy).toHaveBeenCalledWith(
				consensusJsonRpcPayload,
				httpProviderOptions.providerOptions,
			);
		});

		it('Should call HttpProvider.request with correct parameters - Execution', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			const requestSpy = jest.spyOn(httpProvider, 'request');
			httpProvider.send(
				executionJsonRpcPayload,
				jest.fn(),
				httpProviderOptions.providerOptions,
			);

			expect(requestSpy).toHaveBeenCalledWith(
				executionJsonRpcPayload,
				httpProviderOptions.providerOptions,
			);
		});

		it('Should call HttpProvider.request with correct parameters - Consensus', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse));

			const requestSpy = jest.spyOn(httpProvider, 'request');
			httpProvider.send(
				consensusJsonRpcPayload,
				jest.fn(),
				httpProviderOptions.providerOptions,
			);

			expect(requestSpy).toHaveBeenCalledWith(
				consensusJsonRpcPayload,
				httpProviderOptions.providerOptions,
			);
		});

		it('callback should receive expected values - Execution Success', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			const callback = jest.fn((error?: JsonRpcResponseError, result?: JsonRpcResponse) => {
				expect(error).toBeUndefined();
				expect(result).toStrictEqual(mockGetBalanceResponse);
			});

			httpProvider.send(
				executionJsonRpcPayload,
				callback,
				httpProviderOptions.providerOptions,
			);
		});

		it('callback should receive expected values - Consensus Success', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse));

			const callback = jest.fn((error?: JsonRpcResponseError, result?: JsonRpcResponse) => {
				expect(error).toBeUndefined();
				expect(result).toStrictEqual(mockBeaconBlockHeaderResponse);
			});

			httpProvider.send(
				consensusJsonRpcPayload,
				callback,
				httpProviderOptions.providerOptions,
			);
		});

		it('callback should receive expected values - Execution ResponseError', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse), { status: 400 });

			const callback = jest.fn((error?: JsonRpcResponseError, result?: JsonRpcResponse) => {
				expect(error).toBeInstanceOf(ResponseError);
				expect(result).toBeUndefined();
			});

			httpProvider.send(
				executionJsonRpcPayload,
				callback,
				httpProviderOptions.providerOptions,
			);
		});

		it('callback should receive expected values - Consensus ResponseError', () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse), {
				status: 400,
			});

			const callback = jest.fn((error?: JsonRpcResponseError, result?: JsonRpcResponse) => {
				expect(error).toBeInstanceOf(ResponseError);
				expect(result).toBeUndefined();
			});

			httpProvider.send(
				consensusJsonRpcPayload,
				callback,
				httpProviderOptions.providerOptions,
			);
		});
	});

	describe('httpProvider.supportsSubscriptions', () => {
		it('should return false', () => {
			expect(httpProvider.supportsSubscriptions()).toBe(false);
		});
	});

	describe('httpProvider.request', () => {
		it('should return expected response - Execution', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse));

			expect(await httpProvider.request(executionJsonRpcPayload)).toStrictEqual(
				mockGetBalanceResponse,
			);
		});

		it('should return expected response - Consensus', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse));

			expect(await httpProvider.request(consensusJsonRpcPayload)).toStrictEqual(
				mockBeaconBlockHeaderResponse,
			);
		});

		it('should return ResponseError - Execution', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockGetBalanceResponse), { status: 400 });

			await expect(httpProvider.request(executionJsonRpcPayload)).rejects.toThrow(
				ResponseError,
			);
		});

		it('should return ResponseError - Consensus', async () => {
			fetchMock.mockResponseOnce(JSON.stringify(mockBeaconBlockHeaderResponse), {
				status: 400,
			});

			await expect(httpProvider.request(consensusJsonRpcPayload)).rejects.toThrow(
				ResponseError,
			);
		});
	});
});
