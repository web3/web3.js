import * as validatorUtils from 'web3-validator';
import {
	inputAddressFormatter,
	inputBlockNumberFormatter,
	inputDefaultBlockNumberFormatter,
	inputPostFormatter,
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
import { BlockTags } from '../../src/types';

jest.mock('web3-validator');

describe('formatters', () => {
	beforeEach(() => {
		jest.spyOn(validatorUtils, 'isHexStrict').mockReturnValue(true);
		jest.spyOn(validatorUtils, 'isAddress').mockReturnValue(true);
	});

	describe('outputProofFormatter', () => {
		it('should format the values correctly', () => {
			const result = outputProofFormatter({
				address: '0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
				nonce: '0xFF',
				balance: '0xFA',
			});

			expect(result).toEqual({
				address: '0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
				balance: '250',
				nonce: '255',
			});
		});
	});

	describe('outputBigIntegerFormatter', () => {
		it('should convert input to number', () => {
			const result = outputBigIntegerFormatter(12n);

			expect(result).toBe(12);
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
			jest.spyOn(validatorUtils, 'isHexStrict').mockReturnValue(true);
			const result = inputBlockNumberFormatter('0xAF0AF');

			expect(validatorUtils.isHexStrict).toHaveBeenCalledWith('0xAF0AF');
			expect(result).toBe('0xaf0af');
		});

		it('should try parsing number if given value is not valid hex string', () => {
			jest.spyOn(validatorUtils, 'isHexStrict').mockReturnValue(false);
			const result = inputBlockNumberFormatter('0xAF0AF');

			expect(validatorUtils.isHexStrict).toHaveBeenCalledWith('0xAF0AF');
			expect(result).toBeUndefined();
		});
	});

	describe('inputDefaultBlockNumberFormatter', () => {
		it('should return default block if block number not provided', () => {
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0xff');

			expect(inputDefaultBlockNumberFormatter(undefined, 255)).toBe('0xff');

			expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(255);
		});

		it('should return block number if block number provided', () => {
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0xa');

			expect(inputDefaultBlockNumberFormatter(10, 255)).toBe('0xa');

			expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(10);
		});
	});

	describe('inputAddressFormatter', () => {
		it('should return lowercase address if given value is iban', () => {
			const address = '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8';

			jest.spyOn(validatorUtils.utils, 'padLeft').mockReturnValue(address);

			expect(inputAddressFormatter('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS')).toBe(address);
		});

		it('should return lower case value if valid address', () => {
			jest.spyOn(validatorUtils, 'isAddress').mockReturnValue(true);

			expect(inputAddressFormatter('0xAcb')).toBe('0xacb');
		});

		it('should throw error if not a valid address or iban', () => {
			jest.spyOn(validatorUtils, 'isAddress').mockReturnValue(false);

			expect(() => inputAddressFormatter('0xAcb')).toThrow(
				'Provided address 0xAcb is invalid',
			);
		});
	});

	describe('txInputOptionsFormatter', () => {
		let txInput: any;

		beforeEach(() => {
			jest.spyOn(validatorUtils, 'isAddress').mockReturnValue(true);
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

		it('should replace "data" with "input" if "input" is given and "data" is not', () => {
			const result = txInputOptionsFormatter({ ...txInput, input: '0xff0011' });

			expect(result).toEqual(expect.objectContaining({ data: '0xff0011' }));
			expect(Object.keys(result)).not.toContain('input');
		});

		it('should prefix "data" with "0x" if not already', () => {
			expect(txInputOptionsFormatter({ ...txInput, data: 'ff0011' })).toEqual(
				expect.objectContaining({ data: '0xff0011' }),
			);
		});

		it('should throw error if "data" is not a valid hex string', () => {
			jest.spyOn(validatorUtils, 'isHexStrict').mockReturnValue(false);

			expect(() => txInputOptionsFormatter({ ...txInput, data: 'ff0011' })).toThrow(
				'The data field must be HEX encoded data.',
			);
			expect(validatorUtils.isHexStrict).toHaveBeenCalledWith('0xff0011');
		});
		it('should set "gas" equal to "gas" if provided', () => {
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0x7b');

			expect(txInputOptionsFormatter({ ...txInput, data: '0xff0011', gas: '123' })).toEqual(
				expect.objectContaining({ gas: '0x7b' }),
			);

			expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(123);
		});

		it('should set "gas" equal to "gasLimit" if "gas" not provided', () => {
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0x1be');
			expect(
				txInputOptionsFormatter({ ...txInput, data: '0xff0011', gasLimit: '446' }),
			).toEqual(expect.objectContaining({ gas: '0x1be' }));

			expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(446);
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
				jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0x162e');

				expect(
					txInputOptionsFormatter({ ...txInput, data: '0xff0011', [attr]: 5678n }),
				).toEqual(expect.objectContaining({ [attr]: '0x162e' }));

				expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(5678n);
			},
		);
	});

	describe('outputLogFormatter', () => {
		it('should set log id from "blockHash", "transactionHash" and "logIndex"', () => {
			const sha3Result = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0x1',
			});

			expect(result.id).toEqual(`log_${sha3Result.substr(0, 8)}`);
		});

		it('should convert "blockNumber" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0x1',
				blockNumber: '0xFF0011',
			});

			expect(result.blockNumber).toBe(16711697);
		});

		it('should convert "transactionIndex" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0x1',
				transactionIndex: '0xFF0011',
			});

			expect(result.transactionIndex).toBe(16711697);
		});

		it('should convert "logIndex" from hex to number', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0xFF0011',
			});
			expect(result.logIndex).toBe(16711697);
		});

		it('should convert "address" to checksum address', () => {
			const result = outputLogFormatter({
				blockHash: 'blockHash',
				transactionHash: 'transactionHash',
				logIndex: '0xFF0011',
				address: '0x09d7bd9e185fbc2d265d8dbe81e5e888e391688b',
			});

			expect(result.address).toBe('0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b');
		});
	});

	describe('outputTransactionReceiptFormatter', () => {
		const validReceipt = { cumulativeGasUsed: '0x1234', gasUsed: '0x4567' };

		it('should convert "blockNumber" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				blockNumber: '0x12',
			});

			expect(result).toEqual(expect.objectContaining({ blockNumber: 18 }));
		});

		it('should convert "transactionIndex" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				transactionIndex: '0x12',
			});

			expect(result).toEqual(expect.objectContaining({ transactionIndex: 18 }));
		});

		it('should convert "cumulativeGasUsed" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
			});

			expect(result).toEqual(expect.objectContaining({ cumulativeGasUsed: 4660 }));
		});

		it('should convert "gasUsed" from hex to number', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
			});

			expect(result).toEqual(expect.objectContaining({ gasUsed: 17767 }));
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

		it('should convert "contractAddress" to checksum address', () => {
			const result = outputTransactionReceiptFormatter({
				...validReceipt,
				contractAddress: '0x09d7bd9e185fbc2d265d8dbe81e5e888e391688b',
			});

			expect(result).toEqual(
				expect.objectContaining({
					contractAddress: '0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b',
				}),
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

			expect(result).toEqual(
				expect.objectContaining({ effectiveGasPrice: 36267774588438875n }),
			);
		});
	});

	describe('outputBlockFormatter', () => {
		const validBlock = {
			gasLimit: '0x1034',
			gasUsed: '0xa3',
			size: '0x400',
			timestamp: '0x2626CC97F',
		};

		it('should convert "gasLimit" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(result).toEqual(expect.objectContaining({ gasLimit: 4148 }));
		});

		it('should convert "gasUsed" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(result).toEqual(expect.objectContaining({ gasUsed: 163 }));
		});

		it('should convert "size" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(result).toEqual(expect.objectContaining({ size: 1024 }));
		});

		it('should convert "timestamp" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock } as any);

			expect(result).toEqual(expect.objectContaining({ timestamp: 10241231231 }));
		});

		it('should convert "number" from hex to number', () => {
			const result = outputBlockFormatter({ ...validBlock, number: '0x4004a' } as any);

			expect(result).toEqual(expect.objectContaining({ number: 262218 }));
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
			const result = outputBlockFormatter({
				...validBlock,
				miner: '0x09d7bd9e185fbc2d265d8dbe81e5e888e391688b',
			} as any);

			expect(result).toEqual(
				expect.objectContaining({ miner: '0x09d7bD9E185fbC2d265D8DBe81e5e888E391688b' }),
			);
		});

		it('should convert "baseFeePerGas" from hex to number', () => {
			const result = outputBlockFormatter({
				...validBlock,
				baseFeePerGas: '0xa452b',
			} as any);

			expect(result).toEqual(expect.objectContaining({ baseFeePerGas: 673067 }));
		});
	});

	describe('inputPostFormatter', () => {
		it('should convert "ttl" from number to hex', () => {
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue('0x64');

			const result = inputPostFormatter({ ttl: 100 } as any);

			expect(validatorUtils.utils.numberToHex).toHaveBeenCalledWith(100);
			expect(result).toEqual(expect.objectContaining({ ttl: '0x64' }));
		});

		it('should convert "workToProve" from number to hex', () => {
			const numberTohexResult = '0x2D6671';
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue(numberTohexResult);
			const result = inputPostFormatter({ workToProve: 2975345 } as any);

			expect(result).toEqual(expect.objectContaining({ workToProve: numberTohexResult }));
		});

		it('should convert "priority" from number to hex', () => {
			const numberTohexResult = '0x2D6671';
			jest.spyOn(validatorUtils.utils, 'numberToHex').mockReturnValue(numberTohexResult);
			const result = inputPostFormatter({ priority: 2975345 } as any);

			expect(result).toEqual(expect.objectContaining({ priority: numberTohexResult }));
		});

		it('should convert "topics" to array if single value provided', () => {
			const result = inputPostFormatter({ topics: '0x123' } as any);

			expect(result).toEqual(expect.objectContaining({ topics: ['0x123'] }));
		});

		it('should convert "topics" to hex if not already', () => {
			const result = inputPostFormatter({ topics: ['0x123', 'non-hex-value'] } as any);

			expect(result).toEqual(
				expect.objectContaining({ topics: ['0x123', '0x6e6f6e2d6865782d76616c7565'] }),
			);
		});
	});

	describe('outputPostFormatter', () => {
		it('should convert "expiry" from hex to number', () => {
			const result = outputPostFormatter({ expiry: '0x1a' } as any);

			expect(result).toEqual(expect.objectContaining({ expiry: 26 }));
		});

		it('should convert "sent" from hex to number', () => {
			const result = outputPostFormatter({ sent: '0x1a23' } as any);

			expect(result).toEqual(expect.objectContaining({ sent: 6691 }));
		});

		it('should convert "ttl" from hex to number', () => {
			const result = outputPostFormatter({ ttl: '0x10' } as any);

			expect(result).toEqual(expect.objectContaining({ ttl: 16 }));
		});

		it('should convert "workProved" from hex to number', () => {
			const result = outputPostFormatter({ workProved: '0x10' } as any);

			expect(result).toEqual(expect.objectContaining({ workProved: 16 }));
		});

		it('should set "topics" to empty array if not provided', () => {
			const result = outputPostFormatter({} as any);

			expect(result).toEqual(expect.objectContaining({ topics: [] }));
		});

		it('should convert "topics" from hex to utf8', () => {
			const topics = ['0x76616c75655265636569766564', '0x66756e64735472616e73666572726564'];

			const result = outputPostFormatter({ topics } as any);

			expect(result).toEqual(
				expect.objectContaining({ topics: ['valueReceived', 'fundsTransferred'] }),
			);
		});
	});

	describe('outputSyncingFormatter', () => {
		const validObject = {
			startingBlock: '0x11',
			currentBlock: '0x43a',
			highestBlock: '0x7b843',
		};

		it('should convert "startingBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(result).toEqual(expect.objectContaining({ startingBlock: 17 }));
		});

		it('should convert "currentBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(result).toEqual(expect.objectContaining({ currentBlock: 1082 }));
		});

		it('should convert "highestBlock" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject });

			expect(result).toEqual(expect.objectContaining({ highestBlock: 505923 }));
		});

		it('should convert "knownStates" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject, knownStates: '0x231' });

			expect(result).toEqual(expect.objectContaining({ knownStates: 561 }));
		});

		it('should convert "pulledStates" from hex to number', () => {
			const result = outputSyncingFormatter({ ...validObject, pulledStates: '0x423' });

			expect(result).toEqual(expect.objectContaining({ pulledStates: 1059 }));
		});
	});
});
