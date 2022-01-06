import { VALID_ETH_BASE_TYPES } from './constants';
import { FullValidationSchema, ShortValidationSchema, ValidationSchemaInput } from './types';
import { isAbiParameterSchema } from './validation/abi';

export const parseBaseType = <T = typeof VALID_ETH_BASE_TYPES[number]>(
	type: string,
): {
	baseType?: T;
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
		strippedType = 'int';
	} else if (strippedType.startsWith('uint')) {
		baseTypeSize = parseInt(type.substring(4), 10);
		strippedType = 'uint';
	} else if (strippedType.startsWith('bytes')) {
		baseTypeSize = parseInt(strippedType.substring(5), 10);
		strippedType = 'bytes';
	} else {
		return { baseType: undefined, isArray: false, baseTypeSize: undefined, arrayLength: -1 };
	}

	return { baseType: strippedType as unknown as T, isArray, baseTypeSize, arrayLength };
};

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

		// If its a complete Abi Parameter
		// e.g. {name: 'a', type: 'uint'}
		if (isAbiParameterSchema(abi)) {
			abiType = abi.type;
			abiName = abi.name;
			abiComponents = abi.components as FullValidationSchema;
			// If its short form string value e.g. ['uint']
		} else if (typeof abi === 'string') {
			abiType = abi;
			abiName = `${level ?? ''}/${index}`;

			// If its provided in short form of tuple e.g. [['uint', 'string']]
		} else if (Array.isArray(abi)) {
			// If its custom tuple e.g. ['tuple[2]', ['uint', 'string']]
			if (abi[1] && Array.isArray(abi[1])) {
				abiType = abi[0] as string;
				abiName = `${level ?? ''}/${index}`;
				abiComponents = abi[1] as ReadonlyArray<ShortValidationSchema>;
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

export const ethAbiToJsonSchema = (abis: ValidationSchemaInput) => abiSchemaToJsonSchema(abis);

/**
 * Code points to int
 */

export const codePointToInt = (codePoint: number): number => {
	if (codePoint >= 48 && codePoint <= 57) {
		/* ['0'..'9'] -> [0..9] */
		return codePoint - 48;
	}

	if (codePoint >= 65 && codePoint <= 70) {
		/* ['A'..'F'] -> [10..15] */
		return codePoint - 55;
	}

	if (codePoint >= 97 && codePoint <= 102) {
		/* ['a'..'f'] -> [10..15] */
		return codePoint - 87;
	}

	throw new Error(`Invalid code point: ${codePoint}`);
};
