import { convertToValidType, mergeDeep, Numbers, ValidReturnTypes, ValidTypes } from 'web3-utils';
import { TransactionDataAndInputError } from '../errors';
import { Transaction } from '../types';

function formatNonNestedProperties<
	DesiredType extends ValidTypes,
	NumberType extends ValidReturnTypes[DesiredType] = ValidReturnTypes[DesiredType],
>(transaction: Transaction, desiredType: DesiredType): Transaction<NumberType> {
	const formattedProperties: Transaction<NumberType> = {};
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
		// 'to',
		// 'from',
	];
	for (const formattableProperty of formattableProperties) {
		const transactionProperty = transaction[formattableProperty];
		if (
			transactionProperty !== undefined &&
			transactionProperty !== null &&
			typeof transactionProperty !== 'object' &&
			!Array.isArray(transactionProperty)
		) {
			// if (transactionProperty === 'to' || transactionProperty === 'from') {
			// 	// formattedTransaction[formattableProperty] = toChecksumAddress(formattableProperty);
			// 	continue;
			// }

			if (formattableProperty === 'value' && transactionProperty === '0x') continue;

			(formattedProperties[formattableProperty] as Numbers) = convertToValidType(
				transactionProperty,
				desiredType,
			);
		}
	}

	if (transaction.data !== undefined && transaction.input !== undefined)
		throw new TransactionDataAndInputError({
			data: transaction.data,
			input: transaction.input,
		});
	else if (transaction.input !== undefined) {
		formattedProperties.data = transaction.input;
	}

	return formattedProperties;
}

export function formatTransaction<
	DesiredType extends ValidTypes,
	NumberType extends ValidReturnTypes[DesiredType] = ValidReturnTypes[DesiredType],
>(transaction: Transaction, desiredType: DesiredType): Transaction<NumberType> {
	const formattedTransaction: Transaction = mergeDeep({}, {
		...transaction,
		...formatNonNestedProperties(transaction, desiredType),
	} as Record<string, unknown>);

	if (formattedTransaction.common?.customChain.networkId !== undefined)
		formattedTransaction.common.customChain.networkId = convertToValidType(
			formattedTransaction.common.customChain.networkId,
			desiredType,
		);

	if (formattedTransaction.common?.customChain.chainId !== undefined)
		formattedTransaction.common.customChain.chainId = convertToValidType(
			formattedTransaction.common.customChain.chainId,
			desiredType,
		);

	return formattedTransaction as Transaction<NumberType>;
}
