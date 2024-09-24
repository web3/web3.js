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

import { EthExecutionAPI, HexString, Web3NetAPI, Transaction as TransactionType } from 'web3-types';
import { Web3Context } from 'web3-core';
import HttpProvider from 'web3-providers-http';
import { isNullish } from 'web3-validator';

import { ethRpcMethods } from 'web3-rpc-methods';

import { bytesToHex, hexToBytes } from 'web3-utils';
import {
	AccessListEIP2930Transaction,
	FeeMarketEIP1559Transaction,
	Transaction,
	Hardfork,
	TypedTransaction,
	TransactionFactory,
} from 'web3-eth-accounts';
import { prepareTransactionForSigning } from '../../src/utils/prepare_transaction_for_signing';
import { validTransactions } from '../fixtures/prepare_transaction_for_signing';
import { transactionSchema } from '../../src/schemas';
import { CustomFieldTransaction } from '../fixtures/format_transaction';

describe('prepareTransactionForSigning', () => {
	const web3Context = new Web3Context<EthExecutionAPI>({
		provider: new HttpProvider('http://127.0.0.1'),
		config: { defaultNetworkId: '0x1' },
	});

	describe('default', () => {
		it('use default common', async () => {
			const context = new Web3Context<EthExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: { defaultNetworkId: '0x1' },
			});
			context.defaultChain = 'mainnet';
			context.defaultCommon = {
				customChain: {
					name: 'test',
					networkId: 457,
					chainId: 1458,
				},
				baseChain: 'mainnet',
			};

			async function transactionBuilder<ReturnType = TransactionType>(options: {
				transaction: TransactionType;
				web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
				privateKey?: HexString | Uint8Array;
				fillGasPrice?: boolean;
				fillGasLimit?: boolean;
			}): Promise<ReturnType> {
				const tx = { ...options.transaction };

				if (isNullish(tx.common)) {
					if (options.web3Context.defaultCommon) {
						const common = options.web3Context.defaultCommon;
						const chainId = common.customChain.chainId as string;
						const networkId = common.customChain.networkId as string;
						const name = common.customChain.name as string;
						tx.common = {
							...common,
							customChain: { chainId, networkId, name },
						};
					}
				}
				return tx as unknown as ReturnType;
			}

			context.transactionBuilder = transactionBuilder;

			const ethereumjsTx = await prepareTransactionForSigning(
				{
					chainId: 1458,
					nonce: 1,
					gasPrice: BigInt(20000000000),
					gas: BigInt(21000),
					to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
					from: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
					value: '1000000000',
					input: '',
				},
				context,
			);
			expect(Number(ethereumjsTx.common.networkId())).toBe(457);
			expect(ethereumjsTx.common.chainName()).toBe('test');
		});
	});

	it('should be able to read Hardfork from context.defaultHardfork', async () => {
		const context = new Web3Context<EthExecutionAPI>({
			provider: new HttpProvider('http://127.0.0.1'),
			config: { defaultNetworkId: '0x9' },
		});
		context.defaultChain = 'mainnet';
		context.defaultHardfork = Hardfork.Istanbul;

		async function transactionBuilder<ReturnType = TransactionType>(options: {
			transaction: TransactionType;
			web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
			privateKey?: HexString | Uint8Array;
			fillGasPrice?: boolean;
			fillGasLimit?: boolean;
		}): Promise<ReturnType> {
			const tx = { ...options.transaction };
			return tx as unknown as ReturnType;
		}

		context.transactionBuilder = transactionBuilder;

		const ethereumjsTx = await prepareTransactionForSigning(
			{
				chainId: 1458,
				nonce: 1,
				gasPrice: BigInt(20000000000),
				gas: BigInt(21000),
				to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
				from: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
				value: '1000000000',
				input: '',
				networkId: 999,
			},
			context,
		);
		expect(ethereumjsTx.common.hardfork()).toBe(Hardfork.Istanbul);
		expect(ethereumjsTx.common.networkId().toString()).toBe('999');
	});

	it('should be able to read Hardfork from context.config.defaultHardfork and context.defaultCommon.hardfork', async () => {
		const context = new Web3Context<EthExecutionAPI>({
			provider: new HttpProvider('http://127.0.0.1'),
			config: { defaultNetworkId: '0x9' },
		});
		context.defaultChain = 'mainnet';

		// if the value here is different from the one in context.defaultCommon.hardfork
		// Then an error will be thrown:
		// "ConfigHardforkMismatchError: Web3Config hardfork doesnt match in defaultHardfork london and common.hardfork istanbul"
		context.config.defaultHardfork = Hardfork.Istanbul;
		context.defaultCommon = {
			customChain: {
				name: 'test',
				networkId: 111,
				chainId: 1458,
			},
			hardfork: Hardfork.Istanbul,
			baseChain: 'mainnet',
		} as any;

		async function transactionBuilder<ReturnType = TransactionType>(options: {
			transaction: TransactionType;
			web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
			privateKey?: HexString | Uint8Array;
			fillGasPrice?: boolean;
			fillGasLimit?: boolean;
		}): Promise<ReturnType> {
			const tx = { ...options.transaction };
			return tx as unknown as ReturnType;
		}

		context.transactionBuilder = transactionBuilder;

		const ethereumjsTx = await prepareTransactionForSigning(
			{
				chainId: 1458,
				nonce: 1,
				gasPrice: BigInt(20000000000),
				gas: BigInt(21000),
				to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
				from: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
				value: '1000000000',
				input: '',
			},
			context,
		);
		expect(ethereumjsTx.common.hardfork()).toBe(Hardfork.Istanbul);
		expect(ethereumjsTx.common.networkId().toString()).toBe('111');
	});

	it('should give priorities to tx.hardfork and tx.networkId over values from context', async () => {
		const context = new Web3Context<EthExecutionAPI>({
			provider: new HttpProvider('http://127.0.0.1'),
			config: { defaultNetworkId: '0x9' },
		});
		context.defaultChain = 'mainnet';

		// if the value here is different from the one in context.defaultCommon.hardfork
		// Then an error will be thrown:
		// "ConfigHardforkMismatchError: Web3Config hardfork doesnt match in defaultHardfork london and common.hardfork istanbul"
		context.config.defaultHardfork = Hardfork.Istanbul;
		context.defaultCommon = {
			customChain: {
				name: 'test',
				networkId: 111,
				chainId: 1458,
			},
			hardfork: Hardfork.Istanbul,
			baseChain: 'mainnet',
		} as any;

		async function transactionBuilder<ReturnType = TransactionType>(options: {
			transaction: TransactionType;
			web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
			privateKey?: HexString | Uint8Array;
			fillGasPrice?: boolean;
			fillGasLimit?: boolean;
		}): Promise<ReturnType> {
			const tx = { ...options.transaction };
			return tx as unknown as ReturnType;
		}

		context.transactionBuilder = transactionBuilder;

		// context.transactionBuilder = defaultTransactionBuilder;

		const ethereumjsTx = await prepareTransactionForSigning(
			{
				chainId: 1458,
				nonce: 1,
				gasPrice: BigInt(20000000000),
				gas: BigInt(21000),
				to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
				from: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
				value: '1000000000',
				input: '',
				networkId: 999,
				hardfork: Hardfork.Chainstart,
				chain: 'mainnet',
			},
			context,
		);
		expect(ethereumjsTx.common.hardfork()).toBe(Hardfork.Chainstart);
		expect(ethereumjsTx.common.networkId().toString()).toBe('999');
	});

	describe('should return an web3-utils/tx instance with expected properties', () => {
		it.each(validTransactions)(
			'mockBlock: %s\nexpectedTransaction: %s\nexpectedPrivateKey: %s\nexpectedAddress: %s\nexpectedRlpEncodedTransaction: %s\nexpectedTransactionHash: %s\nexpectedMessageToSign: %s\nexpectedV: %s\nexpectedR: %s\nexpectedS: %s',
			async (
				mockBlock,
				expectedTransaction,
				expectedPrivateKey,
				expectedAddress,
				expectedRlpEncodedTransaction,
				expectedTransactionHash,
				expectedMessageToSign,
				expectedV,
				expectedR,
				expectedS,
			) => {
				// (i.e. requestManager, blockNumber, hydrated params), but that doesn't matter for the test
				jest.spyOn(ethRpcMethods, 'estimateGas').mockImplementation(
					// @ts-expect-error - Mocked implementation doesn't have correct method signature
					() => expectedTransaction.gas,
				);
				// @ts-expect-error - Mocked implementation doesn't have correct method signature
				jest.spyOn(ethRpcMethods, 'getBlockByNumber').mockImplementation(() => mockBlock);

				const ethereumjsTx = await prepareTransactionForSigning(
					expectedTransaction,
					web3Context,
					expectedPrivateKey,
					true,
				);

				// should produce an web3-utils/tx instance
				expect(
					ethereumjsTx instanceof Transaction ||
						ethereumjsTx instanceof AccessListEIP2930Transaction ||
						ethereumjsTx instanceof FeeMarketEIP1559Transaction,
				).toBeTruthy();
				expect(ethereumjsTx.sign).toBeDefined();

				// should sign transaction
				const signedTransaction = ethereumjsTx.sign(
					hexToBytes(expectedPrivateKey.substring(2)),
				);

				const senderAddress = signedTransaction.getSenderAddress().toString();
				expect(senderAddress).toBe(expectedAddress.toLowerCase());

				// should be able to obtain expectedRlpEncodedTransaction
				const rlpEncodedTransaction = bytesToHex(signedTransaction.serialize());
				expect(rlpEncodedTransaction).toBe(expectedRlpEncodedTransaction);

				// should be able to obtain expectedTransactionHash
				const transactionHash = bytesToHex(signedTransaction.hash());
				expect(transactionHash).toBe(expectedTransactionHash);

				// should be able to obtain expectedMessageToSign
				const messageToSign = bytesToHex(signedTransaction.getMessageToSign());
				expect(messageToSign).toBe(expectedMessageToSign);
				// should have expected v, r, and s
				const v = !isNullish(signedTransaction.v)
					? `0x${signedTransaction.v.toString(16)}`
					: '';
				const r = !isNullish(signedTransaction.r)
					? `0x${signedTransaction.r.toString(16)}`
					: '';
				const s = !isNullish(signedTransaction.s)
					? `0x${signedTransaction.s.toString(16)}`
					: '';
				expect(v).toBe(expectedV);
				expect(r).toBe(expectedR);
				expect(s).toBe(expectedS);
			},
		);
	});

	it('should not remove extra fields when using a custom schema', async () => {
		const context = new Web3Context<EthExecutionAPI>({
			provider: new HttpProvider('http://127.0.0.1'),
			config: {
				defaultNetworkId: '0x1',
				customTransactionSchema: {
					type: 'object',
					properties: {
						...transactionSchema.properties,
						feeCurrency: { format: 'address' },
					},
				},
			},
		});

		async function transactionBuilder<ReturnType = TransactionType>(options: {
			transaction: TransactionType;
			web3Context: Web3Context<EthExecutionAPI & Web3NetAPI>;
			privateKey?: HexString | Uint8Array;
			fillGasPrice?: boolean;
			fillGasLimit?: boolean;
		}): Promise<ReturnType> {
			const tx = { ...options.transaction };
			return tx as unknown as ReturnType;
		}

		context.transactionBuilder = transactionBuilder;

		const spy = jest.spyOn(TransactionFactory, 'fromTxData');
		(await prepareTransactionForSigning(
			{
				chainId: 1458,
				nonce: 1,
				gasPrice: BigInt(20000000000),
				gasLimit: BigInt(21000),
				to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
				from: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
				value: '1000000000',
				input: '',
				feeCurrency: '0x1234567890123456789012345678901234567890',
			} as CustomFieldTransaction,
			context,
		)) as TypedTransaction & { feeCurrency: string };

		// @ts-expect-error feeCurrency is a custom field for testing here
		expect(spy.mock.lastCall[0].feeCurrency).toBe('0x1234567890123456789012345678901234567890');
	});
});
