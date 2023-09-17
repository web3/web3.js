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

import { format, toHex } from 'web3-utils';
import { TransactionTypeParser, Web3Context } from 'web3-core';
import { EthExecutionAPI, HardforksOrdered, Transaction, ETH_DATA_FORMAT } from 'web3-types';
import { Web3ValidatorError, isNullish, validator } from 'web3-validator';
import { InvalidPropertiesForTransactionTypeError } from 'web3-errors';

// eslint-disable-next-line import/no-cycle
import { getBlock } from '../rpc_method_wrappers.js';
import { InternalTransaction } from '../types.js';

// undefined is treated as null for JSON schema validator
const transactionType0x0Schema = {
	type: 'object',
	properties: {
		accessList: {
			type: 'null',
		},
		maxFeePerGas: {
			type: 'null',
		},
		maxPriorityFeePerGas: {
			type: 'null',
		},
	},
};
const transactionType0x1Schema = {
	type: 'object',
	properties: {
		maxFeePerGas: {
			type: 'null',
		},
		maxPriorityFeePerGas: {
			type: 'null',
		},
	},
};
const transactionType0x2Schema = {
	type: 'object',
	properties: {
		gasPrice: {
			type: 'null',
		},
	},
};

const validateTxTypeAndHandleErrors = (
	txSchema: object,
	tx: Transaction,
	txType: '0x0' | '0x1' | '0x2',
) => {
	try {
		validator.validateJSONSchema(txSchema, tx);
	} catch (error) {
		if (error instanceof Web3ValidatorError)
			// Erroneously reported error
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			throw new InvalidPropertiesForTransactionTypeError(error.errors, txType);

		throw error;
	}
};

export const defaultTransactionTypeParser: TransactionTypeParser = async (
	transaction,
	web3Context,
) => {
	const tx = transaction as unknown as Transaction;
	if (!isNullish(tx.type)) {
		let txSchema;
		switch (tx.type) {
			case '0x0':
				txSchema = transactionType0x0Schema;
				break;
			case '0x1':
				txSchema = transactionType0x1Schema;
				break;
			case '0x2':
				txSchema = transactionType0x2Schema;
				break;

			default:
				return format({ format: 'uint' }, tx.type, ETH_DATA_FORMAT);
		}

		validateTxTypeAndHandleErrors(txSchema, tx, tx.type);

		return format({ format: 'uint' }, tx.type, ETH_DATA_FORMAT);
	}

	if (!isNullish(tx.maxFeePerGas) || !isNullish(tx.maxPriorityFeePerGas)) {
		validateTxTypeAndHandleErrors(transactionType0x2Schema, tx, '0x2');
		return '0x2';
	}

	if (!isNullish(tx.accessList)) {
		validateTxTypeAndHandleErrors(transactionType0x1Schema, tx, '0x1');
		return '0x1';
	}

	const givenHardfork = tx.hardfork ?? tx.common?.hardfork;
	// If we don't have a hardfork, then we can't be sure we're post
	// EIP-2718 where transaction types are available
	if (givenHardfork === undefined) return undefined;

	const hardforkIndex = Object.keys(HardforksOrdered).indexOf(givenHardfork);

	// Unknown hardfork
	if (hardforkIndex === undefined) return undefined;

	// givenHardfork is London or later, so EIP-2718 is supported
	if (hardforkIndex >= Object.keys(HardforksOrdered).indexOf('london'))
		return !isNullish(tx.gasPrice) ? '0x0' : '0x2';

	// givenHardfork is Berlin, tx.accessList is undefined, assume type is 0x0
	if (hardforkIndex === Object.keys(HardforksOrdered).indexOf('berlin')) return '0x0';

	const block = await getBlock(web3Context, web3Context.defaultBlock, false, ETH_DATA_FORMAT);

	// if gasprice is defined or eip 2718 isn't supported use type 0
	if (!isNullish(tx.gasPrice) || isNullish(block.baseFeePerGas)) {
		validateTxTypeAndHandleErrors(transactionType0x0Schema, tx, '0x0');
		return '0x0';
	}

	return undefined;
};

export const detectTransactionType = async (
	transaction: InternalTransaction,
	web3Context: Web3Context<EthExecutionAPI>,
) =>
	(web3Context?.transactionTypeParser ?? defaultTransactionTypeParser)(
		transaction as unknown as Record<string, unknown>,
		web3Context,
	);

export const detectRawTransactionType = (transaction: Uint8Array) =>
	transaction[0] > 0x7f ? '0x0' : toHex(transaction[0]);
