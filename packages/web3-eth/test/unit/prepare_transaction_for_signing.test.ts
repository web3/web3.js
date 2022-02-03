import { EthExecutionAPI } from 'web3-common';
import { Web3Context } from 'web3-core';
import HttpProvider from 'web3-providers-http';
import {
	AccessListEIP2930Transaction,
	FeeMarketEIP1559Transaction,
	Transaction,
} from '@ethereumjs/tx';

import * as rpcMethods from '../../src/rpc_methods';
import { prepareTransactionForSigning } from '../../src/eth_tx';
import { validTransactions } from '../fixtures/prepare_transaction_for_signing';

describe('prepareTransactionForSigning', () => {
	const web3Context = new Web3Context<EthExecutionAPI>(new HttpProvider('http://127.0.0.1'));

	describe('should return an @ethereumjs/tx instance with expected properties', () => {
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
				// @ts-expect-error - Mocked implementation doesn't have correct method signature
				// (i.e. requestManager, blockNumber, hydrated params), but that doesn't matter for the test
				jest.spyOn(rpcMethods, 'getBlockByNumber').mockImplementation(() => mockBlock);

				const ethereumjsTx = await prepareTransactionForSigning(
					expectedTransaction,
					web3Context,
					expectedPrivateKey,
				);

				// should produce an @ethereumjs/tx instance
				expect(
					ethereumjsTx instanceof Transaction ||
						ethereumjsTx instanceof AccessListEIP2930Transaction ||
						ethereumjsTx instanceof FeeMarketEIP1559Transaction,
				).toBeTruthy();
				expect(ethereumjsTx.sign).toBeDefined();

				// should sign transaction
				const signedTransaction = ethereumjsTx.sign(
					Buffer.from(expectedPrivateKey.substring(2), 'hex'),
				);

				const senderAddress = signedTransaction.getSenderAddress().toString();
				expect(senderAddress).toBe(expectedAddress.toLowerCase());

				// should be able to obtain expectedRlpEncodedTransaction
				const rlpEncodedTransaction = `0x${signedTransaction.serialize().toString('hex')}`;
				expect(rlpEncodedTransaction).toBe(expectedRlpEncodedTransaction);

				// should be able to obtain expectedTransactionHash
				const transactionHash = `0x${signedTransaction.hash().toString('hex')}`;
				expect(transactionHash).toBe(expectedTransactionHash);

				// should be able to obtain expectedMessageToSign
				const messageToSign = `0x${signedTransaction.getMessageToSign().toString('hex')}`;
				expect(messageToSign).toBe(expectedMessageToSign);

				// should have expected v, r, and s
				const v =
					signedTransaction.v !== undefined
						? `0x${signedTransaction.v.toString('hex')}`
						: '';
				const r =
					signedTransaction.r !== undefined
						? `0x${signedTransaction.r.toString('hex')}`
						: '';
				const s =
					signedTransaction.s !== undefined
						? `0x${signedTransaction.s.toString('hex')}`
						: '';
				expect(v).toBe(expectedV);
				expect(r).toBe(expectedR);
				expect(s).toBe(expectedS);
			},
		);
	});
});
