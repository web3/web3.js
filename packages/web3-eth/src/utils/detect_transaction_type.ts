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

import { ETH_DATA_FORMAT, format, toHex } from 'web3-utils';
import { TransactionTypeParser, Web3Context } from 'web3-core';
import { EthExecutionAPI, Transaction } from 'web3-types';
import { isNullish } from 'web3-validator';
import { InternalTransaction } from '../types';

export const defaultTransactionTypeParser: TransactionTypeParser = transaction => {
	const tx = transaction as unknown as Transaction;

	if (!isNullish(tx.type)) return format({ eth: 'uint' }, tx.type, ETH_DATA_FORMAT);

	if (
		!isNullish(tx.maxFeePerGas) ||
		!isNullish(tx.maxPriorityFeePerGas) ||
		tx.hardfork === 'london' ||
		tx.common?.hardfork === 'london'
	)
		return '0x2';

	if (!isNullish(tx.accessList) || tx.hardfork === 'berlin' || tx.common?.hardfork === 'berlin')
		return '0x1';

	return undefined;
};

export const detectTransactionType = (
	transaction: InternalTransaction,
	web3Context?: Web3Context<EthExecutionAPI>,
) =>
	(web3Context?.transactionTypeParser ?? defaultTransactionTypeParser)(
		transaction as unknown as Record<string, unknown>,
	);

export const detectRawTransactionType = (transaction: Buffer) =>
	transaction[0] > 0x7f ? '0x0' : toHex(transaction[0]);
