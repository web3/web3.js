import { VALID_ETH_BASE_TYPES } from './constants';
import { AbiParameter } from './private_types';
import { ValidationSchemaInput, FullValidationSchema, ShortValidationSchema } from './types';

export const parseBaseType = <T = typeof VALID_ETH_BASE_TYPES[number]>(
	type: string,
): {
	baseType: T;
	baseTypeSize: number | undefined;
	isArray: boolean;
	arrayLength: number | undefined;
} => {
	let strippedType = type;
	let baseTypeSize: number | undefined;
	let isArray = false;
	let arrayLength: number | undefined;

	if (type.endsWith(']')) {
		// TODO: Validate for nested arrays
		strippedType = type.slice(0, type.indexOf('['));

		isArray = true;
		arrayLength = parseInt(
			type.substring(type.lastIndexOf('[') + 1, type.lastIndexOf(']')),
			10,
		);
		arrayLength = Number.isNaN(arrayLength) ? undefined : arrayLength;
	}

	// TODO: Investigate why "strippedType" cause error
	if (VALID_ETH_BASE_TYPES.includes(strippedType as never)) {
		return { baseType: strippedType as unknown as T, isArray, baseTypeSize, arrayLength };
	}

	if (strippedType.startsWith('int')) {
		baseTypeSize = parseInt(strippedType.substring(3), 10);
	} else if (strippedType.startsWith('uint')) {
		baseTypeSize = parseInt(type.substring(4), 10);
	} else if (strippedType.startsWith('bytes')) {
		baseTypeSize = parseInt(strippedType.substring(5), 10);
	}

	return { baseType: strippedType as unknown as T, isArray, baseTypeSize, arrayLength };
};

export const isAbiParameterSchema = (
	schema: string | ShortValidationSchema | AbiParameter,
): schema is AbiParameter => typeof schema === 'object' && 'type' in schema && 'name' in schema;

export const abiSchemaToJsonSchema = (
	abis: ShortValidationSchema | FullValidationSchema,
	level?: number,
) => {
	const schema: {
		type: string;
		items?: unknown[];
		maxItems?: number;
		additionalItems?: boolean;
	} = {
		type: 'array',
		items: [],
	};

	for (const [index, abi] of abis.entries()) {
		// eslint-disable-next-line no-nested-ternary
		let abiType!: string;
		let abiName!: string;
		let abiComponents: ShortValidationSchema | FullValidationSchema | undefined = [];

		if (isAbiParameterSchema(abi)) {
			abiType = abi.type;
			abiName = abi.name;
			abiComponents = abi.components as FullValidationSchema;
		} else if (typeof abi === 'string') {
			abiType = abi;
			abiName = `${level ?? ''}/${index}`;
		} else if (Array.isArray(abi)) {
			if (abi[1] && Array.isArray(abi[1])) {
				abiType = abi[0] as string;
				abiName = `${level ?? ''}/${index}`;
				abiComponents = abi[1] as ReadonlyArray<string>;
			} else {
				abiType = 'tuple';
				abiName = `${level ?? ''}/${index}`;
				abiComponents = abi;
			}
		}

		const { baseType, isArray, arrayLength } = parseBaseType(abiType);

		if (baseType === 'tuple' && !isArray) {
			schema.items?.push(abiSchemaToJsonSchema(abiComponents, index));
		} else if (baseType === 'tuple' && isArray) {
			schema.items?.push({
				$id: abiName,
				type: 'array',
				items: abiSchemaToJsonSchema(abiComponents, index),
				maxItems: arrayLength,
				minItems: arrayLength,
			});
		} else if (isArray) {
			const item = {
				type: 'array',
				$id: abiName,
				items: {
					eth: baseType,
				},
				minItems: arrayLength,
				maxItems: arrayLength,
			};

			schema.items?.push(item);
		} else {
			schema.items?.push({ $id: abiName, eth: abiType });
		}
	}

	return schema;
};

// export const parseMinAbiSchema = (value: string): ShortValidationSchema => {
// 	// Remove all spaces
// 	let val = value.replace(/ /g, '');

// 	// Split on the tuples
// 	val = val.replace(/(\])(,)(\[)/g, '$1|$3').split('|');
// };

export const ethAbiToJsonSchema = (abis: ValidationSchemaInput) => abiSchemaToJsonSchema(abis);
