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

/* eslint-disable */
<<<<<<<< HEAD:packages/web3/test/stress/large_validator_data/index.js
const { Web3Validator } = require('../../../../web3-validator/lib/commonjs');
========
import { Web3Validator, JsonSchema, Json } from 'web3-validator';
>>>>>>>> ok/5563-Stress-Tests-2---QA-Tests:packages/web3/test/stress/validator.ts

const abi = [
	{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
	{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
	{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
];

const abiJsonSchema = {
	type: 'array',
	items: [
		{ name: 'from', format: 'address' },
		{ name: 'to', format: 'address' },
		{ name: 'value', format: 'uint256' },
	],
};

const abiData = [
	'0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
	'0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
	'0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
];

const simpleSchema = {
	type: 'object',
	required: ['blockHash', 'blockNumber', 'from', 'to', 'data'],
	properties: {
		blockHash: {
			format: 'bytes32',
		},
		blockNumber: {
			format: 'uint',
		},
		from: {
			format: 'address',
		},
		to: {
			oneOf: [{ format: 'address' }, { type: 'null' }],
		},
		data: {
			format: 'bytes',
		},
	},
};

const simpleData = {
	blockHash: '0x0dec0518fa672a70027b04c286582e543ab17319fbdd384fa7bc8f3d5a542c0b',
	blockNumber: BigInt(2),
	from: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
	to: '0xCB00CDE33a7a0Fba30C63745534F1f7Ae607076b',
	data: '0xafea',
};

const createHugeSchema = (
	schema: JsonSchema,
	data: Json,
	n = 3,
): { schema: JsonSchema; data: Json } => {
	if (n > 0) {
		const { data: resultData, schema: resultSchema } = createHugeSchema(
			{ ...simpleSchema },
			{ ...simpleData } as unknown as Json,
			n - 1,
		);
		return {
			data: { ...(typeof data === 'object' ? data : { data }), simple: resultData },
			schema: { ...schema, properties: { ...schema.properties, simple: resultSchema } },
		};
	}
	return {
		schema,
		data,
	};
};

const { schema: hugeSchema, data: hugeData } = createHugeSchema(
	{ ...simpleSchema },
	{ ...simpleData } as unknown as Json,
	500,
);

const { schema: hugeSchema1000, data: hugeData1000 } = createHugeSchema(
	{ ...simpleSchema },
	{ ...simpleData } as unknown as Json,
	1000,
);

const index = new Web3Validator();

<<<<<<<< HEAD:packages/web3/test/stress/large_validator_data/index.js
console.time('huge schema');
index.validateJSONSchema(hugeSchema, hugeData);
console.timeLog('huge schema');

console.time('huge schema 1000');
index.validateJSONSchema(hugeSchema1000, hugeData1000);
console.timeLog('huge schema 1000');
========
validator.validateJSONSchema(hugeSchema, hugeData as object);

validator.validateJSONSchema(hugeSchema1000, hugeData1000 as object);
>>>>>>>> ok/5563-Stress-Tests-2---QA-Tests:packages/web3/test/stress/validator.ts

for (let i = 0; i < 500; i += 1) {
	index.validateJSONSchema(simpleSchema, simpleData);
}

for (let i = 0; i < 1000; i += 1) {
	index.validateJSONSchema(simpleSchema, simpleData);
}

for (let i = 0; i < 1000; i += 1) {
	index.validateJSONSchema(abiJsonSchema, abiData);
}

for (let i = 0; i < 1000; i += 1) {
	index.validate(abi, abiData);
}
