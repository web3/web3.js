import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';
import {
    getBalanceValidData,
	getBlockNumberValidData,
	getBlockTransactionCountValidData,
	getBlockUncleCountValidData,
	getBlockValidData,
	getGasPriceValidData,
	getHashRateValidData,
    getUncleValidData,
} from '../fixtures/web3_eth_methods';

jest.mock('../../src/rpc_methods');

describe('web3_eth_methods_with_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with expected parameters', () => {
		describe('only has returnType parameter', () => {
			describe('getHashRate', () => {
				it.each(getHashRateValidData)(
					'returnType: %s mockRpcResponse: %s output: %s',
					async (returnType, mockRpcResponse, output) => {
						(rpcMethods.getHashRate as jest.Mock).mockResolvedValueOnce(
							mockRpcResponse,
						);
						expect(await web3Eth.getHashRate(returnType)).toBe(output);
						expect(rpcMethods.getHashRate).toHaveBeenCalledWith(
							web3Eth.web3Context.requestManager,
						);
					},
				);
			});

			describe('getGasPrice', () => {
				it.each(getGasPriceValidData)(
					'returnType: %s mockRpcResponse: %s output: %s',
					async (returnType, mockRpcResponse, output) => {
						(rpcMethods.getGasPrice as jest.Mock).mockResolvedValueOnce(
							mockRpcResponse,
						);
						expect(await web3Eth.getGasPrice(returnType)).toBe(output);
						expect(rpcMethods.getGasPrice).toHaveBeenCalledWith(
							web3Eth.web3Context.requestManager,
						);
					},
				);
			});

			describe('getBlockNumber', () => {
				it.each(getBlockNumberValidData)(
					'returnType: %s mockRpcResponse: %s output: %s',
					async (returnType, mockRpcResponse, output) => {
						(rpcMethods.getBlockNumber as jest.Mock).mockResolvedValueOnce(
							mockRpcResponse,
						);
						expect(await web3Eth.getBlockNumber(returnType)).toBe(output);
						expect(rpcMethods.getBlockNumber).toHaveBeenCalledWith(
							web3Eth.web3Context.requestManager,
						);
					},
				);
			});
		});

		describe('has multiple parameters', () => {
			describe('has returnType parameter', () => {
				describe('getBalance', () => {
					it.each(getBalanceValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.getBalance as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.getBalance(...input)).toBe(output);
							expect(rpcMethods.getBalance).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getBlock', () => {
					it.each(getBlockValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (
							input,
							mockRpcResponse,
							expectedRpcMethodToBeCalled,
							rpcMethodParameters,
							output,
						) => {
                            (
                                // eslint-disable-next-line import/namespace
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.getBlock(...input)).toStrictEqual(output);
                            // eslint-disable-next-line import/namespace
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

                describe('getBlockTransactionCount', () => {
					it.each(getBlockTransactionCountValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (
							input,
							mockRpcResponse,
							expectedRpcMethodToBeCalled,
							rpcMethodParameters,
							output,
						) => {
                            (
                                // eslint-disable-next-line import/namespace
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.getBlockTransactionCount(...input)).toStrictEqual(output);
                            // eslint-disable-next-line import/namespace
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

                describe('getBlockUncleCount', () => {
					it.each(getBlockUncleCountValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (
							input,
							mockRpcResponse,
							expectedRpcMethodToBeCalled,
							rpcMethodParameters,
							output,
						) => {
                            (
                                // eslint-disable-next-line import/namespace
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.getBlockUncleCount(...input)).toStrictEqual(output);
                            // eslint-disable-next-line import/namespace
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

                describe('getUncle', () => {
					it.each(getUncleValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (
							input,
							mockRpcResponse,
							expectedRpcMethodToBeCalled,
							rpcMethodParameters,
							output,
						) => {
                            (
                                // eslint-disable-next-line import/namespace
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.getUncle(...input)).toStrictEqual(output);
                            // eslint-disable-next-line import/namespace
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});
			});
		});
	});
});
