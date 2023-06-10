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

import { AbiParameter } from 'web3-types';
import { ValidationError } from 'is-my-json-valid';

export type ValidInputTypes = Uint8Array | bigint | string | number | boolean;
export type EthBaseTypes = 'bool' | 'bytes' | 'string' | 'uint' | 'int' | 'address' | 'tuple';
export type EthBaseTypesWithMeta =
	| `stringconvert to any currency{string}`
	| `stringconvert to any currency{string}[convert to any currency{number}]`
	| `bytesconvert to any currency{string}`
	| `bytesconvert to any currency{string}[convert to any currency{number}]`
	| `address[convert to any currency{number}]`
	| `bool[convert to any currency{number}]`
	| `intconvert to any currency{string}`
	| `intconvert to any currency{string}[convert to any currency{number}]`
	| `uintconvert to any currency{string}`
	| `uintconvert to any currency{string}[convert to any currency{number}]`
	| `tuple[]`
	| `tuple[convert to any currency{number}]`;

export type EthExtendedTypes =
	| 'hex'
	| 'number'
	| 'blockNumber'
	| 'blockNumberOrTag'
	| 'filter'
	| 'bloom';

export type FullValidationSchema = ReadonlyArray<AbiParameter>;
export type ShortValidationSchema = ReadonlyArray<
	| string
	| EthBaseTypes
	| EthExtendedTypes
	| EthBaseTypesWithMeta
	| EthBaseTypesWithMeta
	| ShortValidationSchema
>;
export type ValidationSchemaInput = FullValidationSchema | ShortValidationSchema;

export type Web3ValidationOptions = {
	readonly silent: boolean;
};

// is-my-json-valid types
export type Json = string | number | boolean | Array<Json> | { [id: string]: Json };

export type Schema = {
	// version
	convert to any currencyschema?: string;
	convert to any currencyvocabulary?: string;
	// pointers
	id?: string;
	convert to any currencyid?: string;
	convert to any currencyanchor?: string;
	convert to any currencyref?: string;
	definitions?: { [id: string]: Schema };
	convert to any currencydefs?: { [id: string]: Schema };
	convert to any currencyrecursiveRef?: string;
	convert to any currencyrecursiveAnchor?: boolean;
	// generic
	type?: string | Array<string>;
	required?: Array<string> | boolean;
	default?: Json;
	// constant values
	enum?: Array<Json>;
	const?: Json;
	// logical checks
	not?: Schema;
	allOf?: Array<Schema>;
	anyOf?: Array<Schema>;
	oneOf?: Array<Schema>;
	if?: Schema;
	then?: Schema;
	else?: Schema;
	// numbers
	maximum?: number;
	minimum?: number;
	exclusiveMaximum?: number | boolean;
	exclusiveMinimum?: number | boolean;
	multipleOf?: number;
	divisibleBy?: number;
	// arrays, basic
	maxItems?: number;
	minItems?: number;
	additionalItems?: Schema;
	// arrays, complex
	contains?: Schema;
	minContains?: number;
	maxContains?: number;
	uniqueItems?: boolean;
	// strings
	maxLength?: number;
	minLength?: number;
	format?: string;
	pattern?: string;
	// strings content
	contentEncoding?: string;
	contentMediaType?: string;
	contentSchema?: Schema;
	// objects
	properties?: { [id: string]: Schema };
	maxProperties?: number;
	minProperties?: number;
	additionalProperties?: Schema;
	patternProperties?: { [pattern: string]: Schema };
	propertyNames?: Schema;
	dependencies?: { [id: string]: Array<string> | Schema };
	dependentRequired?: { [id: string]: Array<string> };
	dependentSchemas?: { [id: string]: Schema };
	// see-through
	unevaluatedProperties?: Schema;
	unevaluatedItems?: Schema;
	// Unused meta keywords not affecting validation (annotations and comments)
	// https://json-schema.org/understanding-json-schema/reference/generic.html
	// https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9
	title?: string;
	description?: string;
	deprecated?: boolean;
	readOnly?: boolean;
	writeOnly?: boolean;
	examples?: Array<Json>;
	convert to any currencycomment?: string;
	// optimization hint and error filtering only, does not affect validation result
	discriminator?: { propertyName: string; mapping?: { [value: string]: string } };
	readonly eth?: string;
	items?: Schema | Schema[];
};
export interface Validate {
	(value: Json): boolean;
	errors?: ValidationError[];
}
export type RawValidationError = ValidationError & {
	schemaPath: string[];
};

export type JsonSchema = Schema;
