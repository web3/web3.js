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
import { ethRpcMethods } from 'web3-rpc-methods';

import { TransactionInfoAPI } from 'web3-types';
import Web3Eth from '../../src/index';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';
import {
	getBlockNumberValidData,
	getChainIdValidData,
	getGasPriceValidData,
	getHashRateValidData,
} from '../fixtures/rpc_methods_wrappers';
import {
	estimateGasValidData,
	getBalanceValidData,
	getBlockTransactionCountValidData,
	getBlockUncleCountValidData,
	getBlockValidData,
	getCodeValidData,
	getFeeHistoryValidData,
	getPastLogsValidData,
	getProofValidData,
	getStorageAtValidData,
	getTransactionCountValidData,
	getTransactionFromBlockValidData,
	getTransactionReceiptValidData,
	getTransactionValidData,
	getUncleValidData,
	sendSignedTransactionValidData,
	signValidData,
	submitWorkValidData,
	tx,
	txReceipt,
} from '../fixtures/web3_eth_methods_with_parameters';

import { testData as createAccessListTestData } from './rpc_method_wrappers/fixtures/createAccessList';

jest.mock('web3-rpc-methods');
jest.mock('../../src/rpc_method_wrappers');
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
jest.spyOn(rpcMethodWrappers, 'getTransaction').mockResolvedValue(tx as TransactionInfoAPI);
jest.spyOn(rpcMethodWrappers, 'getTransactionReceipt').mockResolvedValue(txReceipt);

describe('web3_eth_methods_with_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with expected parameters', () => {
		describe('only has returnFormat parameter', () => {
			describe('getHashRate', () => {
				it.each(getHashRateValidData)('returnFormat: %s', async returnFormat => {
					await web3Eth.getHashRate(returnFormat);
					expect(rpcMethodWrappers.getHashRate).toHaveBeenCalledWith(
						web3Eth,
						returnFormat,
					);
				});
			});

			describe('getHashrate', () => {
				it.each(getHashRateValidData)('returnFormat: %s', async returnFormat => {
					// eslint-disable-next-line deprecation/deprecation
					await web3Eth.getHashrate(returnFormat);
					expect(rpcMethodWrappers.getHashRate).toHaveBeenCalledWith(
						web3Eth,
						returnFormat,
					);
				});
			});

			describe('getGasPrice', () => {
				it.each(getGasPriceValidData)('returnFormat: %s', async returnFormat => {
					await web3Eth.getGasPrice(returnFormat);
					expect(rpcMethodWrappers.getGasPrice).toHaveBeenCalledWith(
						web3Eth,
						returnFormat,
					);
				});
			});

			describe('getBlockNumber', () => {
				it.each(getBlockNumberValidData)('returnFormat: %s', async returnFormat => {
					await web3Eth.getBlockNumber(returnFormat);
					expect(rpcMethodWrappers.getBlockNumber).toHaveBeenCalledWith(
						web3Eth,
						returnFormat,
					);
				});
			});

			describe('getChainId', () => {
				it.each(getChainIdValidData)('returnFormat: %s', async returnFormat => {
					await web3Eth.getChainId(returnFormat);
					expect(rpcMethodWrappers.getChainId).toHaveBeenCalledWith(
						web3Eth,
						returnFormat,
					);
				});
			});
		});

		describe('has multiple parameters', () => {
			describe('has returnFormat parameter', () => {
				describe('getBalance', () => {
					it.each(getBalanceValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getBalance(...input);
							expect(rpcMethodWrappers.getBalance).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getBlock', () => {
					it.each(getBlockValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getBlock(...input);
							expect(rpcMethodWrappers.getBlock).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getBlockTransactionCount', () => {
					it.each(getBlockTransactionCountValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getBlockTransactionCount(...input);
							expect(rpcMethodWrappers.getBlockTransactionCount).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getBlockUncleCount', () => {
					it.each(getBlockUncleCountValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getBlockUncleCount(...input);
							expect(rpcMethodWrappers.getBlockUncleCount).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getUncle', () => {
					it.each(getUncleValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getUncle(...input);
							expect(rpcMethodWrappers.getUncle).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransaction', () => {
					it.each(getTransactionValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getTransaction(...input);
							expect(rpcMethodWrappers.getTransaction).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionFromBlock', () => {
					it.each(getTransactionFromBlockValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getTransactionFromBlock(...input);
							expect(rpcMethodWrappers.getTransactionFromBlock).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionReceipt', () => {
					it.each(getTransactionReceiptValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getTransactionReceipt(...input);
							expect(rpcMethodWrappers.getTransactionReceipt).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getTransactionCount', () => {
					it.each(getTransactionCountValidData)(
						'input: %s\rpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getTransactionCount(...input);
							expect(rpcMethodWrappers.getTransactionCount).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('estimateGas', () => {
					it.each(estimateGasValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.estimateGas(...input);
							expect(rpcMethodWrappers.estimateGas).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getFeeHistory', () => {
					it.each(getFeeHistoryValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getFeeHistory(...input);
							expect(rpcMethodWrappers.getFeeHistory).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getProof', () => {
					it.each(getProofValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getProof(...input);
							expect(rpcMethodWrappers.getProof).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getStorageAt', () => {
					it.each(getStorageAtValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getStorageAt(...input);
							expect(rpcMethodWrappers.getStorageAt).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getCode', () => {
					it.each(getCodeValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getCode(...input);
							expect(rpcMethodWrappers.getCode).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('sendSignedTransaction', () => {
					it.each(sendSignedTransactionValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.sendSignedTransaction(...input);
							expect(rpcMethodWrappers.sendSignedTransaction).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('sign', () => {
					it.each(signValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.sign(...input);
							expect(rpcMethodWrappers.sign).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('getPastLogs', () => {
					it.each(getPastLogsValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (input, rpcMethodParameters) => {
							await web3Eth.getPastLogs(...input);
							expect(rpcMethodWrappers.getLogs).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});
				describe('getPastLogs called with rpcMethodWrappers', () => {
					it.each(getPastLogsValidData)(
						'input: %s\nrpcMethodParameters: %s',
						async (_, rpcMethodParameters) => {
							await rpcMethodWrappers.getLogs(web3Eth, ...rpcMethodParameters);
							expect(rpcMethodWrappers.getLogs).toHaveBeenCalledWith(
								web3Eth,
								...rpcMethodParameters,
							);
						},
					);
				});

				describe('createAccessList', () => {
					it.each(createAccessListTestData)(
						'input: %s\nrpcMethodParameters: %s',
						async (_, input) => {
							await web3Eth.createAccessList(...input);
							expect(rpcMethodWrappers.createAccessList).toHaveBeenCalledWith(
								web3Eth,
								...input,
							);
						},
					);
				});
			});

			describe("doesn't have returnFormat parameter", () => {
				describe('submitWork', () => {
					it.each(submitWorkValidData)('input: %s', async input => {
						await web3Eth.submitWork(...input);
						expect(ethRpcMethods.submitWork).toHaveBeenCalledWith(
							web3Eth.requestManager,
							...input,
						);
					});
				});
			});
		});
	});
});
