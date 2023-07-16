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
import { ZodIssueBase } from 'zod';
import { JSONSchema4 } from 'json-schema';

export type ValidInputTypes = Uint8Array | bigint | string | number | boolean;
export type EthBaseTypes = 'bool' | 'bytes' | 'string' | 'uint' | 'int' | 'address' | 'tuple';
export type EthBaseTypesWithMeta =
	| `string${string}`
	| `string${string}[${number}]`
	| `bytes${string}`
	| `bytes${string}[${number}]`
	| `address[${number}]`
	| `bool[${number}]`
	| `int${string}`
	| `int${string}[${number}]`
	| `uint${string}`
	| `uint${string}[${number}]`
	| `tuple[]`
	| `tuple[${number}]`;

export type EthExtendedTypes =
	| 'hex'
	| 'number'
	| 'blockNumber'
	| 'blockNumberOrTag'
	| 'filter'
	| 'bloom';

export type FullValidationSchema = ReadonlyArray<AbiParameter>;
export type ShortValidationSchema = ReadonlyArray<
	string | EthBaseTypes | EthExtendedTypes | EthBaseTypesWithMeta | ShortValidationSchema
>;
export type ValidationSchemaInput = FullValidationSchema | ShortValidationSchema;

export type Web3ValidationOptions = {
	readonly silent: boolean;
};

export type Json = string | number | boolean | Array<Json> | { [id: string]: Json };

export type ValidationError = ZodIssueBase;

export interface Validate {
	(value: Json): boolean;
	errors?: ValidationError[];
}
type Schema = JSONSchema4 & { format?: string };

export type JsonSchema = Schema & { items?: Array<Schema> | Schema } & {
	properties?: { [key: string]: Schema };
};
