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
import { isNullish, validator } from 'web3-validator';
import { InternalTransaction } from '../types';

// undefined is treated as null for JSON schema validator
const type0x0TransactionSchema = {
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
const type0x1TransactionSchema = {
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
const type0x2TransactionSchema = {
	type: 'object',
	properties: {
		gasPrice: {
			type: 'null',
		},
	},
};

export const defaultTransactionTypeParser: TransactionTypeParser = transaction => {
	const tx = transaction as unknown as Transaction;

	if (!isNullish(tx.type)) {
		switch (tx.type) {
			case '0x0':
				validator.validateJSONSchema(type0x0TransactionSchema, tx);
				break;
			case '0x1':
				validator.validateJSONSchema(type0x1TransactionSchema, tx);
				break;
			case '0x2':
				validator.validateJSONSchema(type0x2TransactionSchema, tx);
				break;

			default:
				break;
		}

		return format({ format: 'uint' }, tx.type, ETH_DATA_FORMAT);
	}

	// We don't check !isNullish(tx.gasPrice) here, because
	// if it's not undefined, we still don't know if the network
	// supports EIP-2718 (https://eips.ethereum.org/EIPS/eip-2718)
	// and whether we should return undefined for legacy txs,
	// or type 0x0 for legacy txs post EIP-2718

	if (!isNullish(tx.accessList)) {
		validator.validateJSONSchema(type0x1TransactionSchema, tx);
		return '0x1';
	}

	if (!isNullish(tx.maxFeePerGas) || !isNullish(tx.maxPriorityFeePerGas)) {
		validator.validateJSONSchema(type0x2TransactionSchema, tx);
		return '0x2';
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

	// For all pre-Berlin hardforks, return undefined since EIP-2718
	// isn't supported
	return undefined;
};

export const detectTransactionType = (
	transaction: InternalTransaction,
	web3Context?: Web3Context<EthExecutionAPI>,
) =>
	(web3Context?.transactionTypeParser ?? defaultTransactionTypeParser)(
		transaction as unknown as Record<string, unknown>,
	);

export const detectRawTransactionType = (transaction: Uint8Array) =>
	transaction[0] > 0x7f ? '0x0' : toHex(transaction[0]);
