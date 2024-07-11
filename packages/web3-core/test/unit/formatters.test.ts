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

import * as utils from 'web3-utils';
import { BlockTags, TransactionInput, Filter } from 'web3-types';
import { Iban } from 'web3-eth-iban';
import { FormatterError } from 'web3-errors';
import {
	inputAddressFormatter,
	inputBlockNumberFormatter,
	inputDefaultBlockNumberFormatter,
	inputPostFormatter,
	inputTopicFormatter,
	outputBigIntegerFormatter,
	outputBlockFormatter,
	outputLogFormatter,
	outputPostFormatter,
	outputProofFormatter,
	outputSyncingFormatter,
	outputTransactionReceiptFormatter,
	txInputOptionsFormatter,
} from '../../src/formatters';

import * as formatters from '../../src/formatters';

/* eslint-disable deprecation/deprecation */
jest.mock('web3-eth-iban');
jest.mock('web3-utils');

describe('formatters', () => {
	const toNumberResult = 12345;
	const numberToHexResult = '0xff';
	const hexToNumberResult = 123;
	const sha3Result = 'sha3Result';
	const toChecksumAddressResult = 'toChecksumAddress';
	const hexToNumberStringResult = '1234';

	beforeEach(() => {
		jest.spyOn(utils, 'toChecksumAddress').mockReturnValue(toChecksumAddressResult);
		jest.spyOn(utils, 'hexToNumberString').mockReturnValue(hexToNumberStringResult);
		jest.spyOn(utils, 'toNumber').mockReturnValue(toNumberResult);
		jest.spyOn(utils, 'numberToHex').mockReturnValue(numberToHexResult);
		jest.spyOn(utils, 'hexToNumber').mockReturnValue(hexToNumberResult);
		jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);
		jest.spyOn(utils, 'isAddress').mockReturnValue(true);
		jest.spyOn(utils, 'sha3Raw').mockReturnValue(sha3Result);
		jest.spyOn(Iban, 'isValid').mockImplementation(() => false);
		jest.spyOn(Iban, 'isDirect').mockImplementation(() => false);
	});

	describe('outputProofFormatter', () => {
		it('should format the values correctly', () => {
			const result = outputProofFormatter({
				address: '0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
				nonce: '0xFF',
				balance: '0xFA',
			});

			expect(utils.toChecksumAddress).toHaveBeenCalledWith(
				'0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
			);
			expect(utils.hexToNumberString).toHaveBeenCalledWith('0xFF');
			expect(utils.hexToNumberString).toHaveBeenCalledWith('0xFA');

			expect(result).toEqual({
				address: toChecksumAddressResult,
				balance: hexToNumberStringResult,
				nonce: hexToNumberStringResult,
			});
		});
	});

	describe('inputTopicFormatter', () => {
		it('check params', () => {
			expect(inputTopicFormatter('0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b')).toBe(
				'0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
			);
			// @ts-expect-error invalid param
			// eslint-disable-next-line no-null/no-null
			expect(inputTopicFormatter(null)).toBeNull();
		});
	});

	describe('outputBigIntegerFormatter', () => {
		it('should convert input to number', () => {
			const result = outputBigIntegerFormatter(BigInt(12));

			expect(utils.toNumber).toHaveBeenCalledWith(BigInt(12));
			expect(result).toEqual(toNumberResult);
		});
	});

	describe('inputBlockNumberFormatter', () => {
		it('should return undefined if block number not given', () => {
			expect(inputBlockNumberFormatter(undefined)).toBeUndefined();
		});

		it.each([BlockTags.EARLIEST, BlockTags.LATEST, BlockTags.PENDING])(
			'should return "%s" values for "%s" block numbers',
			blockNumber => {
				expect(inputBlockNumberFormatter(blockNumber)).toEqual(blockNumber);
			},
		);

		it('should return valid genesis block number', () => {
			expect(inputBlockNumberFormatter('genesis')).toBe('0x0');
		});

		it('should return lower case hex value for a valid hex string', () => {
			jest.spyOn(utils, 'isHexStrict').mockReturnValue(true);
			const result = inputBlockNumberFormatter('0xAF0AF');

			expect(utils.isHexStrict).toHaveBeenCalledWith('0xAF0AF');
			expect(utils.numberToHex).not.toHaveBeenCalled();
			expect(result).toBe('0xaf0af');
		});

		it('should try parsing number if given value is not valid hex string', () => {
			jest.spyOn(utils, 'isHexStrict').mockReturnValue(false);
			const result = inputBlockNumberFormatter('0xAF0AF');

			expect(utils.isHexStrict).toHaveBeenCalledWith('0xAF0AF');
			expect(utils.numberToHex).toHaveBeenCalledWith('0xAF0AF');
			expect(result).toEqual(numberToHexResult);
		});
	});

	describe('inputDefaultBlockNumberFormatter', () => {
		it('should return default block if block number not provided', () => {
			expect(inputDefaultBlockNumberFormatter(undefined, 255)).toBe('0xff');
		});

		it('should return block number if block number provided', () => {
			expect(inputDefaultBlockNumberFormatter(10, 255)).toEqual(numberToHexResult);

			expect(utils.numberToHex).toHaveBeenCalledWith(10);
		});
	});

	describe('inputAddressFormatter', () => {
		it('should return lowercase address if given value is iban', () => {
			const address = '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8';
			Iban.prototype.toAddress = jest.fn(() => address);

			jest.spyOn(Iban, 'isValid').mockImplementation(() => true);
			jest.spyOn(Iban, 'isDirect').mockImplementation(() => true);

			expect(inputAddressFormatter('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS')).toBe(address);
			expect(Iban.prototype.toAddress).toHaveBeenCalled();
		});

		it('should return lower case value if valid address', () => {
			jest.spyOn(utils, 'isAddress').mockReturnValue(true);

			expect(inputAddressFormatter('0xAcb')).toBe('0xacb');
		});

		it('should throw error if not a valid address or iban', () => {
			jest.spyOn(utils, 'isAddress').mockReturnValue(false);

			expect(() => inputAddressFormatter('0xAcb')).toThrow(
				'Provided address 0xAcb is invalid',
			);
		});
	});

	describe('txInputOptionsFormatter', () => {
		let txInput: any;

		beforeEach(() => {
			jest.spyOn(utils, 'isAddress').mockReturnValue(true);
			txInput = {
				to: '0xabcd',
			};
		});

		it('should format "to" address if provided', () => {
			expect(txInputOptionsFormatter({ ...txInput, to: '0xABCD' })).toEqual(
				expect.objectContaining({ to: '0xabcd' }),
			);
		});

		it('should throw error if "data" and "input" both are provided', () => {
			expect(() =>
				txInputOptionsFormatter({ ...txInput, input: '0xff0011', data: '0xff' }),
			).toThrow(
				'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.',
			);
		});

		it('should replace "input" with "data" if "data" is given and "input" is not', () => {
			const result = txInputOptionsFormatter({ ...txInput, data: '0xff0011' });

			expect(result).toEqual(expect.objectContaining({ input: '0xff0011' }));
			expect(Object.keys(result)).not.toContain('data');
		});

		it('should prefix "input" with "0x" if not already', () => {
			expect(txInputOptionsFormatter({ ...txInput, input: 'ff0011' })).toEqual(
				expect.objectContaining({ input: '0xff0011' }),
			);
		});

		it('should throw error if "input" is not a valid hex string', () => {
			jest.spyOn(utils, 'isHexStrict').mockReturnValue(false);

			expect(() => txInputOptionsFormatter({ ...txInput, input: 'ff0011' })).toThrow(
				'The input field must be HEX encoded data.',
			);
			expect(utils.isHexStrict).toHaveBeenCalledWith('0xff0011');
		});
		it('should set "gas" equal to "gas" if provided', () => {
			expect(txInputOptionsFormatter({ ...txInput, data: '0xff0011', gas: '123' })).toEqual(
				expect.objectContaining({ gas: numberToHexResult }),
			);
			expect(utils.toNumber).toHaveBeenCalledWith('123');
		});

		it('should set "gas" equal to "gasLimit" if "gas" not provided', () => {
			expect(
				txInputOptionsFormatter({ ...txInput, data: '0xff0011', gasLimit: '446' }),
			).toEqual(expect.objectContaining({ gas: numberToHexResult }));
			expect(utils.toNumber).toHaveBeenCalledWith('446');
		});

		it('should remove "gasPrice" if "maxPriorityFeePerGas" or "maxFeePerGas" is given', () => {
			const result = txInputOptionsFormatter({
				...txInput,
				input: '0xff0011',
				gasPrice: '123',
				maxPriorityFeePerGas: '456',
			});
			expect(Object.keys(result)).not.toContain('gasPrice');

			const result2 = txInputOptionsFormatter({
				...txInput,
				input: '0xff0011',
				gasPrice: '123',
				maxFeePerGas: '456',
			});
			expect(Object.keys(result2)).not.toContain('gasPrice');
		});

		it.each(['gasPrice', 'gas', 'value', 'maxPriorityFeePerGas', 'maxFeePerGas', 'nonce'])(
			'should convert "%s" number value to hex',
			attr => {
				jest.spyOn(utils, 'toNumber').mockReturnValue(BigInt(5678));

				expect(
					txInputOptionsFormatter({ ...txInput, data: '0xff0011', [attr]: BigInt(5678) }),
				).toEqual(expect.objectContaining({ [attr]: numberToHexResult }));

				expect(utils.numberToHex).toHaveBeenCalledWith(BigInt(5678));
			},
		);
	});

	describe('inputCallFormatter', () => {
		let txInput: any;

		beforeEach(() => {
			jest.spyOn(utils, 'isAddress').mockReturnValue(true);
			txInput = {
				to: '0xabcd',
			};
		});

		it('should format "to" address if provided', () => {
			expect(formatters.inputCallFormatter({ ...txInput, to: '0xABCD' })).toEqual(
				expect.objectContaining({ to: '0xabcd' }),
			);
		});

		it('should format "from" if defaultAddress is provided', () => {
			expect(formatters.inputCallFormatter({ ...txInput, to: '0xABCD' }, '0xABCDE')).toEqual(
				expect.objectContaining({ from: '0xabcde', to: '0xabcd' }),
			);
		});
	});

	describe('inputTransactionFormatter', () => {
		let txInput: any;

		beforeEach(() => {
			jest.spyOn(utils, 'isAddress').mockReturnValue(true);
			txInput = {
				to: '0xabcd',
			};
		});
		it('should format and populate "from"', () => {
			expect(
				formatters.inputTransactionFormatter({ ...txInput, to: '0xabcd', from: '0xABCDE' }),
			).toEqual(expect.objectContaining({ from: '0xabcde', to: '0xabcd' }));
		});

		it('should throw an error when from is undefined', () => {
			expect(() => formatters.inputTransactionFormatter({ ...txInput })).toThrow(
				new FormatterError('The send transactions "from" field must be defined!'),
			);
		});
	});

	describe('outputTransactionFormatter', () => {
		it('should correctly format blockNumber from hex to number', () => {
			const txInput: TransactionInput = {
				to: '0x1234567890abcdef',
				from: '0xabcdef1234567890',
				gas: '0x123456',
				gasPrice: '0x987654321',
				nonce: '0x1',
				value: '0x9876543210',
				blockNumber: '0x123',
				transactionIndex: '0x1',
				maxFeePerGas: '0x87654321',
				maxPriorityFeePerGas: '0x7654321',
				type: '0x1',
			};

			const formattedTxOutput = formatters.outputTransactionFormatter(txInput);
			// should return the mocked values;
			expect(formattedTxOutput.blockNumber).toBe(123);
			expect(formattedTxOutput.to).toBe('toChecksumAddress');
			expect(formattedTxOutput.from).toBe('toChecksumAddress');
			expect(formattedTxOutput.gas).toBe(123);
			expect(formattedTxOutput.nonce).toBe(123);
			expect(formattedTxOutput.transactionIndex).toBe(123);
			expect(formattedTxOutput.value).toBe(12345);
			expect(formattedTxOutput.maxFeePerGas).toBe(12345);
			expect(formattedTxOutput.maxPriorityFeePerGas).toBe(12345);
			expect(formattedTxOutput.type).toBe(123);
		});

		it('should make "to" property undefined', () => {
			const txInput = { gas: '0x', nonce: '1', value: '0x' };
			const formattedTxOutput = formatters.outputTransactionFormatter(txInput);

			expect(formattedTxOutput.to).toBeUndefined();
		});
	});

	describe('inputLogFormatter', () => {
		beforeAll(() => {
			const actualUtils = jest.requireActual('web3-utils');
			jest.spyOn(utils, 'mergeDeep').mockImplementation(actualUtils.mergeDeep);
		});
		it('should correctly format a filter with all fields provided', () => {
			const filter: Filter = {
				fromBlock: '0x1',
				toBlock: '0x2',
				address: '0x1234567890abcdef1234567890abcdef12345678',
				topics: ['0x123', ['0x456', '0x789']],
			};

			const formattedFilter = formatters.inputLogFormatter(filter);

			expect(formattedFilter.fromBlock).toBe('0x1');
			expect(formattedFilter.toBlock).toBe('0x2');
			expect(formattedFilter.address).toBe('0x1234567890abcdef1234567890abcdef12345678');
			expect(formattedFilter.topics).toEqual(['0x123', ['0x456', '0x789']]);
		});
		it('should correctly format a filter with no fromBlock', () => {
			const filter: Filter = {
				address: ['0x123', '0x222'],
			};

			const formattedFilter = formatters.inputLogFormatter(filter);

			expect(formattedFilter.fromBlock).toBe('latest');
			expect(formattedFilter.address).toEqual(['0x123', '0x222']);
		});
	});

	describe('outputLogFormatter', () => {
		it('should set log id from "blockHash", "transactionHash" and "logIndex"', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: 'logIndex',
			});

			expect(utils.sha3Raw).toHaveBeenCalledWith('blockHashtransactionHashlogIndex');

			expect(result.id).toBe(`log_${sha3Result.slice(0, 8)}`);
		});

		it('should convert "blockNumber" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: 'logIndex',
				blockNumber: '0xFF0011',
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith('0xFF0011');
			expect(result.blockNumber).toEqual(hexToNumberResult);
		});

		it('should convert "transactionIndex" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: 'logIndex',
				transactionIndex: '0xFF0011',
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith('0xFF0011');
			expect(result.transactionIndex).toEqual(hexToNumberResult);
		});

		it('should convert "logIndex" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0xFF0011',
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith('0xFF0011');
			expect(result.logIndex).toEqual(hexToNumberResult);
		});

		it('should convert "address" to checksum address', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0xFF0011',
				address: 'address',
			});

			expect(utils.toChecksumAddress).toHaveBeenCalledWith('address');
			expect(result.address).toEqual(toChecksumAddressResult);
		});
	});

	describe('outputTransactionReceiptFormatter', () => {
		const validReceipt = { cumulativeGasUsed: '0x1234', gasUsed: '0x4567' };

		it('should be FormatterError', () => {
			// @ts-expect-error invalid param
			expect(() => outputTransactionReceiptFormatter(1)).toThrow(
				`Received receipt is invalid: 1`,
			);
		});
		it('should convert "blockNumber" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				blockNumber: '0x12',
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith('0x12');
			expect(result).toEqual(expect.objectContaining({ blockNumber: hexToNumberResult }));
		});

		it('should convert "transactionIndex" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				transactionIndex: '0x12',
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith('0x12');
			expect(result).toEqual(
				expect.objectContaining({ transactionIndex: hexToNumberResult }),
			);
		});

		it('should convert "cumulativeGasUsed" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith(validReceipt.cumulativeGasUsed);
			expect(result).toEqual(
				expect.objectContaining({ cumulativeGasUsed: hexToNumberResult }),
			);
		});

		it('should convert "gasUsed" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith(validReceipt.gasUsed);
			expect(result).toEqual(expect.objectContaining({ gasUsed: hexToNumberResult }));
		});

		it('should format "logs" if available', () => {
			const logs = ['0x12' as any, '0x456' as any];
			jest.spyOn(formatters, 'outputLogFormatter').mockReturnValue(
				'outputLogFormatterResult' as any,
			);

			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				logs,
			});

			expect(formatters.outputLogFormatter).toHaveBeenCalledTimes(logs.length);

			expect(formatters.outputLogFormatter).toHaveBeenCalledWith(logs[0], 0, logs);

			expect(formatters.outputLogFormatter).toHaveBeenCalledWith(logs[1], 1, logs);
			expect(result.logs).toEqual(['outputLogFormatterResult', 'outputLogFormatterResult']);
		});

		it('when log doesn`t have id', () => {
			const res = formatters.outputLogFormatter({ blockHash: '0x1', logIndex: '0x1' });
			expect(res.id).toBeUndefined();
		});

		it('should convert "contractAddress" to checksum address', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				contractAddress: '0x12',
			});

			expect(utils.toChecksumAddress).toHaveBeenCalledWith('0x12');
			expect(result).toEqual(
				expect.objectContaining({ contractAddress: toChecksumAddressResult }),
			);
		});

		it('should convert "status" to boolean value "true"', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				status: '10',
			});

			expect(result.status).toBeTruthy();
		});

		it('should convert "status" to boolean value "false"', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				status: '0',
			});

			expect(result.status).toBeFalsy();
		});

		it('should convert "effectiveGasPrice" from hex to number', () => {
			const effectiveGasPrice = '0x80d9594d23495b';

			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				effectiveGasPrice,
			});

			expect(utils.hexToNumber).toHaveBeenCalledWith(effectiveGasPrice);
			expect(result).toEqual(
				expect.objectContaining({ effectiveGasPrice: hexToNumberResult }),
			);
		});
	});

	describe('outputBlockFormatter', () => {
		const validBlock = {
			gasLimit: 'gasLimit',
			gasUsed: 'gasUsed',
			size: 'size',
			timestamp: 'timestamp',
		};

		it('should convert "gasLimit" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('gasLimit');
			expect(result).toEqual(expect.objectContaining({ gasLimit: hexToNumberResult }));
		});

		it('should convert "gasUsed" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('gasUsed');
			expect(result).toEqual(expect.objectContaining({ gasUsed: hexToNumberResult }));
		});

		it('should convert "size" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('size');
			expect(result).toEqual(expect.objectContaining({ size: hexToNumberResult }));
		});

		it('should convert "timestamp" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('timestamp');
			expect(result).toEqual(expect.objectContaining({ timestamp: hexToNumberResult }));
		});

		it('should convert "number" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock, number: 'number' } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('number');
			expect(result).toEqual(expect.objectContaining({ number: hexToNumberResult }));
		});

		it('should convert "difficulty" to bigint', () => {
			jest.spyOn(formatters, 'outputBigIntegerFormatter').mockReturnValue(
				'outputBigIntegerFormatterResult' as any,
			);
			const result = outputBlockFormatter({ ...validBlock, difficulty: 'difficulty' } as any);

			expect(formatters.outputBigIntegerFormatter).toHaveBeenCalledWith('difficulty');
			expect(result).toEqual(
				expect.objectContaining({ difficulty: 'outputBigIntegerFormatterResult' }),
			);
		});

		it('should convert "totalDifficulty" to bigint', () => {
			jest.spyOn(formatters, 'outputBigIntegerFormatter').mockReturnValue(
				'outputBigIntegerFormatterResult' as any,
			);
			const result = outputBlockFormatter({
				...validBlock,
				totalDifficulty: 'totalDifficulty',
			} as any);

			expect(formatters.outputBigIntegerFormatter).toHaveBeenCalledWith('totalDifficulty');
			expect(result).toEqual(
				expect.objectContaining({ totalDifficulty: 'outputBigIntegerFormatterResult' }),
			);
		});

		it('should format "transactions" with correct formatter', () => {
			const transactions = ['trs1', 'trs2'];
			jest.spyOn(formatters, 'outputTransactionFormatter').mockReturnValue(
				'outputTransactionFormatterResult' as any,
			);

			const result = outputBlockFormatter({ ...validBlock, transactions } as any);

			expect(formatters.outputTransactionFormatter).toHaveBeenCalledTimes(
				transactions.length,
			);
			expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith(
				transactions[0],

				0,
				transactions,
			);
			expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith(
				transactions[1],

				1,
				transactions,
			);
			expect(result).toEqual(
				expect.objectContaining({
					transactions: [
						'outputTransactionFormatterResult',
						'outputTransactionFormatterResult',
					],
				}),
			);
		});

		it('should convert "miner" to checksum address', () => {
			const result = outputBlockFormatter({ ...validBlock, miner: 'miner' } as any);

			expect(utils.toChecksumAddress).toHaveBeenCalledWith('miner');
			expect(result).toEqual(expect.objectContaining({ miner: toChecksumAddressResult }));
		});

		it('should convert "baseFeePerGas" from hex to number', () => {
			jest.spyOn(formatters, 'outputBigIntegerFormatter').mockReturnValue(123);
			const result = outputBlockFormatter({
				...validBlock,
				baseFeePerGas: 'baseFeePerGas',
			} as any);

			expect(outputBigIntegerFormatter).toHaveBeenCalledWith('baseFeePerGas');
			expect(result).toEqual(expect.objectContaining({ baseFeePerGas: hexToNumberResult }));
		});
	});

	describe('inputPostFormatter', () => {
		it('should convert "ttl" from number to hex', () => {
			const result = inputPostFormatter({ ttl: 'ttl' } as any);

			expect(utils.numberToHex).toHaveBeenCalledWith('ttl');
			expect(result).toEqual(expect.objectContaining({ ttl: numberToHexResult }));
		});

		it('should convert "workToProve" from number to hex', () => {
			const result = inputPostFormatter({ workToProve: 'workToProve' } as any);

			expect(utils.numberToHex).toHaveBeenCalledWith('workToProve');
			expect(result).toEqual(expect.objectContaining({ workToProve: numberToHexResult }));
		});

		it('should convert "priority" from number to hex', () => {
			const result = inputPostFormatter({ priority: 'priority' } as any);

			expect(utils.numberToHex).toHaveBeenCalledWith('priority');
			expect(result).toEqual(expect.objectContaining({ priority: numberToHexResult }));
		});

		it('should convert "topics" to array if single value provided', () => {
			const result = inputPostFormatter({ topics: '0x123' } as any);

			expect(result).toEqual(expect.objectContaining({ topics: ['0x123'] }));
		});

		it('should convert "topics" to hex if not already', () => {
			jest.spyOn(utils, 'fromUtf8').mockReturnValue('fromUtf8Result');
			const result = inputPostFormatter({ topics: ['0x123', 'non-hex-value'] } as any);

			expect(utils.fromUtf8).toHaveBeenCalledTimes(1);
			expect(utils.fromUtf8).toHaveBeenCalledWith('non-hex-value');
			expect(result).toEqual(
				expect.objectContaining({ topics: ['0x123', 'fromUtf8Result'] }),
			);
		});
	});

	describe('outputPostFormatter', () => {
		it('should convert "expiry" from hex to number', () => {
			const result = outputPostFormatter({ expiry: 'expiry' } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('expiry');
			expect(result).toEqual(expect.objectContaining({ expiry: hexToNumberResult }));
		});

		it('should convert "sent" from hex to number', () => {
			const result = outputPostFormatter({ sent: 'sent' } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('sent');
			expect(result).toEqual(expect.objectContaining({ sent: hexToNumberResult }));
		});

		it('should convert "ttl" from hex to number', () => {
			const result = outputPostFormatter({ ttl: 'ttl' } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('ttl');
			expect(result).toEqual(expect.objectContaining({ ttl: hexToNumberResult }));
		});

		it('should convert "workProved" from hex to number', () => {
			const result = outputPostFormatter({ workProved: 'workProved' } as any);

			expect(utils.hexToNumber).toHaveBeenCalledWith('workProved');
			expect(result).toEqual(expect.objectContaining({ workProved: hexToNumberResult }));
		});

		it('should set "topics" to empty array if not provided', () => {
			const result = outputPostFormatter({} as any);

			expect(result).toEqual(expect.objectContaining({ topics: [] }));
		});

		it('should convert "topics" from utf8 to hex', () => {
			const topics = ['0x123', 'non-hex-value'];
			jest.spyOn(utils, 'toUtf8').mockReturnValue('toUtf8Result');

			const result = outputPostFormatter({ topics } as any);

			expect(utils.toUtf8).toHaveBeenCalledTimes(topics.length);

			expect(utils.toUtf8).toHaveBeenCalledWith(topics[0], 0, topics);

			expect(utils.toUtf8).toHaveBeenCalledWith(topics[1], 1, topics);
			expect(result).toEqual(
				expect.objectContaining({ topics: ['toUtf8Result', 'toUtf8Result'] }),
			);
		});
	});

	describe('outputSyncingFormatter', () => {
		const validObject = {
			startingBlock: 'startingBlock',
			currentBlock: 'currentBlock',
			highestBlock: 'highestBlock',
		};

		it('should convert "startingBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(utils.hexToNumber).toHaveBeenCalledWith('startingBlock');
			expect(result).toEqual(expect.objectContaining({ startingBlock: hexToNumberResult }));
		});

		it('should convert "currentBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(utils.hexToNumber).toHaveBeenCalledWith('currentBlock');
			expect(result).toEqual(expect.objectContaining({ currentBlock: hexToNumberResult }));
		});

		it('should convert "highestBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(utils.hexToNumber).toHaveBeenCalledWith('highestBlock');
			expect(result).toEqual(expect.objectContaining({ highestBlock: hexToNumberResult }));
		});

		it('should convert "knownStates" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject, knownStates: 'knownStates' });

			expect(utils.hexToNumber).toHaveBeenCalledWith('highestBlock');
			expect(result).toEqual(expect.objectContaining({ knownStates: hexToNumberResult }));
		});

		it('should convert "pulledStates" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject, pulledStates: 'pulledStates' });

			expect(utils.hexToNumber).toHaveBeenCalledWith('highestBlock');
			expect(result).toEqual(expect.objectContaining({ pulledStates: hexToNumberResult }));
		});
	});
});
