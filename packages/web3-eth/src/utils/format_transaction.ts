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

import { convertToValidType, Numbers, ValidReturnTypes, ValidTypes, mergeDeep } from 'web3-utils';
import { TransactionDataAndInputError } from '../errors';
import { Transaction } from '../types';

export function formatTransaction<
	DesiredType extends ValidTypes,
	NumberType extends ValidReturnTypes[DesiredType] = ValidReturnTypes[DesiredType],
>(transaction: Transaction, desiredType: DesiredType): Transaction<NumberType> {
	const formattedTransaction = mergeDeep(
		{},
		transaction as Record<string, unknown>,
	) as Transaction;
	if (transaction.common !== undefined) {
		formattedTransaction.common = { ...transaction.common };
		if (transaction.common.customChain !== undefined)
			formattedTransaction.common.customChain = { ...transaction.common.customChain };
	}

	const formattableProperties: (keyof Transaction)[] = [
		'value',
		'gas',
		'gasPrice',
		'type',
		'maxFeePerGas',
		'maxPriorityFeePerGas',
		'nonce',
		'chainId',
		'gasLimit',
		'v',
	];
	for (const transactionProperty of formattableProperties) {
		const formattedProperty = formattedTransaction[transactionProperty];
		if (
			formattedProperty !== undefined &&
			formattedProperty !== null &&
			typeof formattedProperty !== 'object' &&
			!Array.isArray(formattedProperty)
		) {
			if (transactionProperty === 'value' && formattedProperty === '0x') continue;
			(formattedTransaction[transactionProperty] as Numbers) = convertToValidType(
				formattedProperty,
				desiredType,
			);
		}
	}

	if (formattedTransaction.common?.customChain !== undefined) {
		if (formattedTransaction.common.customChain.networkId !== undefined)
			formattedTransaction.common.customChain.networkId = convertToValidType(
				formattedTransaction.common.customChain.networkId,
				desiredType,
			);
		if (formattedTransaction.common.customChain.chainId !== undefined)
			formattedTransaction.common.customChain.chainId = convertToValidType(
				formattedTransaction.common.customChain.chainId,
				desiredType,
			);
	}

	if (formattedTransaction.data !== undefined && formattedTransaction.input !== undefined)
		throw new TransactionDataAndInputError({
			data: formattedTransaction.data,
			input: formattedTransaction.input,
		});
	else if (formattedTransaction.input !== undefined) {
		formattedTransaction.data = formattedTransaction.input;
		delete formattedTransaction.input;
	}

	return formattedTransaction as Transaction<NumberType>;
}
