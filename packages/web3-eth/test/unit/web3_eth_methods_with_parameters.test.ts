/* eslint-disable import/namespace */

import Web3Eth from '../../src/index';
import * as rpcMethods from '../../src/rpc_methods';
import {
	estimateGasValidData,
	getBalanceValidData,
	getBlockNumberValidData,
	getBlockTransactionCountValidData,
	getBlockUncleCountValidData,
	getBlockValidData,
	getCodeValidData,
	getFeeHistoryValidData,
	getGasPriceValidData,
	getHashRateValidData,
	getPastLogsValidData,
	getStorageAtValidData,
	getTransactionCountValidData,
	getTransactionFromBlockValidData,
	getTransactionReceiptValidData,
	getTransactionValidData,
	getUncleValidData,
	sendSignedTransactionValidData,
	signValidData,
	submitWorkValidData,
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
								rpcMethods[expectedRpcMethodToBeCalled] as jest.Mock
							).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.getBlock(...input)).toStrictEqual(output);
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
							expect(await web3Eth.getBlockTransactionCount(...input)).toStrictEqual(
								output,
							);
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
							expect(await web3Eth.getBlockUncleCount(...input)).toStrictEqual(
								output,
							);
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
							expect(await web3Eth.getUncle(...input)).toStrictEqual(output);
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
							expect(await web3Eth.getTransaction(...input)).toStrictEqual(output);
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
							expect(await web3Eth.getTransactionFromBlock(...input)).toStrictEqual(
								output,
							);
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
							expect(await web3Eth.getTransactionReceipt(...input)).toStrictEqual(
								output,
							);
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
							expect(await web3Eth.getTransactionCount(...input)).toStrictEqual(
								output,
							);
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
							expect(await web3Eth.estimateGas(...input)).toStrictEqual(output);
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
							expect(await web3Eth.getFeeHistory(...input)).toStrictEqual(output);
							expect(rpcMethods.getFeeHistory).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});
			});

			describe("doesn't have returnType parameter", () => {
				describe('getStorageAt', () => {
					it.each(getStorageAtValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters) => {
							(rpcMethods.getStorageAt as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.getStorageAt(...input)).toBe(mockRpcResponse);
							expect(rpcMethods.getStorageAt).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getCode', () => {
					it.each(getCodeValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse, rpcMethodParameters) => {
							(rpcMethods.getCode as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.getCode(...input)).toBe(mockRpcResponse);
							expect(rpcMethods.getCode).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('sendSignedTransaction', () => {
					it.each(sendSignedTransactionValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s\noutput: %s',
						async (input, mockRpcResponse) => {
							(rpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.sendSignedTransaction(input)).toBe(
								mockRpcResponse,
							);
							expect(rpcMethods.sendRawTransaction).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								input,
							);
						},
					);
				});

				describe('sign', () => {
					it.each(signValidData)(
						'input: %s\nmockRpcResponse: %s',
						async (input, mockRpcResponse) => {
							(rpcMethods.sign as jest.Mock).mockResolvedValueOnce(mockRpcResponse);
							expect(await web3Eth.sign(...input)).toBe(mockRpcResponse);
							expect(rpcMethods.sign).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								// web3-eth methods takes sign(message, address)
								// RPC method takes sign(address, message)
								// so we manually swap them here
								input[1],
								input[0],
							);
						},
					);
				});

				describe('getPastLogs', () => {
					it.each(getPastLogsValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s',
						async (input, mockRpcResponse, rpcMethodParameters) => {
							(rpcMethods.getLogs as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.getPastLogs(input)).toBe(mockRpcResponse);
							expect(rpcMethods.getLogs).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								rpcMethodParameters,
							);
						},
					);
				});

				describe('submitWork', () => {
					it.each(submitWorkValidData)(
						'input: %s\nmockRpcResponse: %s\nrpcMethodParameters: %s',
						async (input, mockRpcResponse) => {
							(rpcMethods.submitWork as jest.Mock).mockResolvedValueOnce(
								mockRpcResponse,
							);
							expect(await web3Eth.submitWork(...input)).toBe(mockRpcResponse);
							expect(rpcMethods.submitWork).toHaveBeenCalledWith(
								web3Eth.web3Context.requestManager,
								...input,
							);
						},
					);
				});
			});
		});
	});
});
