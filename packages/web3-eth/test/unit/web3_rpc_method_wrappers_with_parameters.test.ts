/* eslint-disable import/namespace */

import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';
import {
	estimateGas,
	getBalance,
	getBlock,
	getBlockNumber,
	getBlockTransactionCount,
	getBlockUncleCount,
	getFeeHistory,
	getGasPrice,
	getHashRate,
	getTransaction,
	getTransactionCount,
	getTransactionFromBlock,
	getTransactionReceipt,
	getUncle,
} from '../../src/rpc_method_wrappers';
import {
	estimateGasValidData,
	getBalanceValidData,
	getBlockNumberValidData,
	getBlockTransactionCountValidData,
	getBlockUncleCountValidData,
	getBlockValidData,
	getFeeHistoryValidData,
	getGasPriceValidData,
	getHashRateValidData,
	getTransactionCountValidData,
	getTransactionFromBlockValidData,
	getTransactionReceiptValidData,
	getTransactionValidData,
	getUncleValidData,
} from '../fixtures/rpc_methods_wrappers';

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
						expect(await getHashRate(web3Eth.web3Context, returnType)).toBe(output);
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
						expect(await getGasPrice(web3Eth.web3Context, returnType)).toBe(output);
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
						expect(await getBlockNumber(web3Eth.web3Context, returnType)).toBe(output);
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
							expect(await getBalance(web3Eth.web3Context, ...input)).toBe(output);
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
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await getBlock(web3Eth.web3Context, ...input)).toStrictEqual(
								output,
							);
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
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(
								await getBlockTransactionCount(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
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
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(
								await getBlockUncleCount(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
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
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await getUncle(web3Eth.web3Context, ...input)).toStrictEqual(
								output,
							);
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransaction', () => {
					it.each(getTransactionValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.getTransactionByHash as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(
								await getTransaction(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
							expect(rpcMethods.getTransactionByHash).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionFromBlock', () => {
					it.each(getTransactionFromBlockValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (
							input,
							mockRpcResponse,
							expectedRpcMethodToBeCalled,
							rpcMethodParameters,
							output,
						) => {
							(
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(
								await getTransactionFromBlock(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
							expect(rpcMethods[expectedRpcMethodToBeCalled]).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionReceipt', () => {
					it.each(getTransactionReceiptValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.getTransactionReceipt as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(
								await getTransactionReceipt(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
							expect(rpcMethods.getTransactionReceipt).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionCount', () => {
					it.each(getTransactionCountValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.getTransactionCount as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(
								await getTransactionCount(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
							expect(rpcMethods.getTransactionCount).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('estimateGas', () => {
					it.each(estimateGasValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.estimateGas as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await estimateGas(web3Eth.web3Context, ...input)).toStrictEqual(
								output,
							);
							expect(rpcMethods.estimateGas).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getFeeHistory', () => {
					it.each(getFeeHistoryValidData)(
						'input: %s\nmockRpcResponse: %s\nexpectedRpcMethodToBeCalled: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters, output) => {
							(rpcMethods.getFeeHistory as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(
								await getFeeHistory(web3Eth.web3Context, ...input),
							).toStrictEqual(output);
							expect(rpcMethods.getFeeHistory).toHaveBeenCalledWith(
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
