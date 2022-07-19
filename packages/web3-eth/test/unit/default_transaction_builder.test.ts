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
import {
	EthExecutionAPI,
	PopulatedUnsignedEip1559Transaction,
	PopulatedUnsignedEip2930Transaction,
	Transaction,
} from 'web3-types';
import { Web3Context } from 'web3-core';
import HttpProvider from 'web3-providers-http';
import { isNullish } from 'web3-validator';
import {
	Eip1559NotSupportedError,
	UnableToPopulateNonceError,
	UnsupportedTransactionTypeError,
} from '../../src/errors';
import { defaultTransactionBuilder } from '../../src/utils/transaction_builder';
import * as rpcMethods from '../../src/rpc_methods';

jest.mock('../../src/rpc_methods');

const expectedNetworkId = '0x4';
jest.mock('web3-net', () => ({
	getId: jest.fn().mockImplementation(() => expectedNetworkId),
}));

describe('defaultTransactionBuilder', () => {
	const expectedFrom = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';
	const expectedNonce = '0x42';
	const expectedGas = BigInt(21000);
	const expectedGasLimit = expectedGas;
	const expectedGasPrice = '0x4a817c800';
	const expectedBaseFeePerGas = '0x13afe8b904';
	const expectedMaxPriorityFeePerGas = '0x9502f900';
	const expectedMaxFeePerGas = '0x27f4d46b08';
	const expectedChainId = '0x1';
	const defaultTransactionType = '0x0';
	const transaction: Transaction = {
		from: expectedFrom,
		to: '0x3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: expectedGas,
		gasLimit: expectedGasLimit,
		gasPrice: expectedGasPrice,
		type: '0x0',
		maxFeePerGas: expectedMaxFeePerGas,
		maxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
		data: '0x0',
		nonce: expectedNonce,
		chain: 'mainnet',
		hardfork: 'berlin',
		chainId: expectedChainId,
		networkId: expectedNetworkId,
		common: {
			customChain: {
				name: 'foo',
				networkId: expectedNetworkId,
				chainId: expectedChainId,
			},
			baseChain: 'mainnet',
			hardfork: 'berlin',
		},
	};
	const mockBlockData = {
		parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
		sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
		miner: '0xbb7b8287f3f0a933474a79eae42cbca977791171',
		stateRoot: '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
		transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		logsBloom:
			'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		difficulty: '0x4ea3f27bc',
		number: '0x1b4',
		gasLimit: '0x1388',
		gasUsed: '0x1c96e73',
		timestamp: '0x55ba467c',
		extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
		mixHash: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
		nonce: '0x1c11920a4',
		totalDifficulty: '0x78ed983323d',
		size: '0x220',
		transactions: [
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		],
		uncles: [
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		],
		hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		baseFeePerGas: expectedBaseFeePerGas,
	};
	let web3Context: Web3Context<EthExecutionAPI>;
	let getTransactionCountSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.spyOn(rpcMethods, 'getBlockByNumber').mockResolvedValue(mockBlockData);
		getTransactionCountSpy = jest
			.spyOn(rpcMethods, 'getTransactionCount')
			.mockResolvedValue(expectedNonce);
		jest.spyOn(rpcMethods, 'getGasPrice').mockResolvedValue(expectedGasPrice);
		jest.spyOn(rpcMethods, 'getChainId').mockResolvedValue(expectedChainId);

		web3Context = new Web3Context<EthExecutionAPI>(new HttpProvider('http://127.0.0.1'));
	});

	it.skip('should call override method', async () => {
		const overrideFunction = jest.fn();
		const input = { ...transaction };
		await defaultTransactionBuilder({
			transaction: input,
			web3Context,
			// VALID_ETH_BASE_TYPES.HexString,
			// '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			// overrideFunction,
		});
		expect(overrideFunction).toHaveBeenCalledWith(input);
	});

	describe('should populate from', () => {
		it('should use privateKey to populate', async () => {
			const input = { ...transaction };
			delete input.from;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			});
			expect(result.from).toBe(expectedFrom);
		});

		it('should use web3Context.defaultAccount to populate', async () => {
			web3Context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultAccount: expectedFrom,
				},
			});

			const input = { ...transaction };
			delete input.from;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.from).toBe(expectedFrom);
		});
	});

	describe('should populate nonce', () => {
		it('should throw UnableToPopulateNonceError', async () => {
			const input = { ...transaction };
			delete input.from;
			delete input.nonce;

			await expect(
				defaultTransactionBuilder({ transaction: input, web3Context }),
			).rejects.toThrow(new UnableToPopulateNonceError());
		});

		it('should use web3Eth.getTransactionCount to populate nonce', async () => {
			const input = { ...transaction };
			delete input.nonce;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.nonce).toBe(expectedNonce);
			expect(getTransactionCountSpy).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedFrom,
				web3Context.defaultBlock,
			);
		});
	});

	describe('should populate value', () => {
		it('should populate with 0x', async () => {
			const input = { ...transaction };
			delete input.value;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.value).toBe('0x');
		});
	});

	describe('should populate data', () => {
		it('should populate with 0x', async () => {
			const input = { ...transaction };
			delete input.data;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.data).toBe('0x');
		});
	});

	describe('should populate chain', () => {
		it('should populate with mainnet', async () => {
			const input = { ...transaction };
			delete input.chain;
			delete input.common;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.chain).toBe('mainnet');
		});

		it('should use web3Context.defaultChain to populate', async () => {
			web3Context = new Web3Context<EthExecutionAPI>(new HttpProvider('http://127.0.0.1'));

			const input = { ...transaction };
			delete input.chain;
			delete input.common;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.chain).toBe(web3Context.defaultChain);
		});
	});

	describe('should populate hardfork', () => {
		it('should populate with london', async () => {
			const input = { ...transaction };
			delete input.hardfork;
			delete input.common;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.hardfork).toBe('london');
		});

		it('should use web3Context.defaultHardfork to populate', async () => {
			web3Context = new Web3Context<EthExecutionAPI>(new HttpProvider('http://127.0.0.1'));

			const input = { ...transaction };
			delete input.hardfork;
			delete input.common;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.hardfork).toBe(web3Context.defaultHardfork);
		});
	});

	describe('should populate chainId', () => {
		it('should populate with web3Eth.getChainId', async () => {
			const input = { ...transaction };
			delete input.chainId;
			delete input.common;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.chainId).toBe(expectedChainId);
		});
	});

	describe('should populate networkId', () => {
		it('should populate with web3Net.getId', async () => {
			const input = { ...transaction };
			delete input.networkId;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.networkId).toBe(expectedNetworkId);
		});
	});

	describe('should populate gasLimit', () => {
		it('should populate with gas', async () => {
			const input = { ...transaction };
			delete input.gasLimit;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.gasLimit).toBe(expectedGasLimit);
		});
	});

	describe('should populate type', () => {
		it('should throw UnsupportedTransactionTypeError', async () => {
			const input = { ...transaction };
			input.type = '0x8'; // // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions

			await expect(
				defaultTransactionBuilder({ transaction: input, web3Context }),
			).rejects.toThrow(new UnsupportedTransactionTypeError(input.type));
		});

		it('should use web3Context.defaultTransactionType to populate', async () => {
			web3Context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultTransactionType,
				},
			});

			const input = { ...transaction };
			delete input.gas;
			delete input.gasLimit;
			delete input.gasPrice;
			delete input.maxFeePerGas;
			delete input.maxPriorityFeePerGas;
			delete input.accessList;
			delete input.type;

			input.hardfork = 'istanbul';
			if (!isNullish(input.common)) input.common.hardfork = 'istanbul';

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.type).toBe(web3Context.defaultTransactionType);
		});
	});

	describe('should populate gasPrice', () => {
		it('should populate with web3Eth.getGasPrice (tx.type 0x0)', async () => {
			const input = { ...transaction };
			delete input.gasPrice;
			input.type = '0x0';

			const result = await defaultTransactionBuilder({ transaction: input, web3Context });
			expect(result.gasPrice).toBe(expectedGasPrice);
		});

		it('should populate with web3Eth.getGasPrice (tx.type 0x1)', async () => {
			const input = { ...transaction };
			delete input.gasPrice;
			input.type = '0x1';

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
			});
			expect(result.gasPrice).toBe(expectedGasPrice);
		});
	});

	describe('should populate accessList', () => {
		it('should populate with [] (tx.type 0x1)', async () => {
			const input = { ...transaction };
			delete input.accessList;
			input.type = '0x1';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip2930Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.accessList).toStrictEqual([]);
		});

		it('should populate with [] (tx.type 0x2)', async () => {
			const input = { ...transaction };
			delete input.accessList;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.accessList).toStrictEqual([]);
		});
	});

	describe('should populate maxPriorityFeePerGas and maxFeePerGas', () => {
		it('should throw Eip1559NotSupportedError', async () => {
			const mockBlockDataNoBaseFeePerGas = { ...mockBlockData, baseFeePerGas: undefined };
			jest.spyOn(rpcMethods, 'getBlockByNumber').mockImplementation(
				// @ts-expect-error - Mocked implementation doesn't have correct method signature
				// (i.e. requestManager, blockNumber, hydrated params), but that doesn't matter for the test
				() => mockBlockDataNoBaseFeePerGas,
			);

			const input = { ...transaction };
			input.type = '0x2';

			await expect(
				defaultTransactionBuilder({ transaction: input, web3Context }),
			).rejects.toThrow(new Eip1559NotSupportedError());
		});

		it('should populate with gasPrice', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedGasPrice);
			expect(result.maxPriorityFeePerGas).toBe(expectedGasPrice);
			expect(result.gasPrice).toBeUndefined();
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas and maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas and maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			web3Context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			web3Context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.gasPrice;
			input.type = '0x2';

			web3Context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gwei, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});
	});
});
