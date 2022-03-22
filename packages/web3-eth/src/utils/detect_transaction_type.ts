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

import { EthExecutionAPI } from 'web3-common';
import { TransactionTypeParser, Web3Context } from 'web3-core';
import { convertToValidType, HexString, ValidTypes } from 'web3-utils';
import { Transaction } from '../types';

export const defaultTransactionTypeParser: TransactionTypeParser = transaction => {
	const tx = transaction as unknown as Transaction;

	if (tx.type !== undefined)
		return convertToValidType(tx.type, ValidTypes.HexString) as HexString;

	if (
		tx.maxFeePerGas !== undefined ||
		tx.maxPriorityFeePerGas !== undefined ||
		tx.hardfork === 'london' ||
		tx.common?.hardfork === 'london'
	)
		return '0x2';

	if (tx.accessList !== undefined || tx.hardfork === 'berlin' || tx.common?.hardfork === 'berlin')
		return '0x1';

	return undefined;
};

export const detectTransactionType = (
	transaction: Transaction,
	web3Context?: Web3Context<EthExecutionAPI>,
) =>
	(web3Context?.transactionTypeParser ?? defaultTransactionTypeParser)(
		transaction as unknown as Record<string, unknown>,
	);
