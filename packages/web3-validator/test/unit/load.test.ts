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

import { Validator } from '../../src/validator';
import { Json, JsonSchema } from '../../';

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
// @ts-ignore
const createHugeSchema = (schema: JsonSchema, data: object, n = 3) => {
	if (n > 0) {
		// @ts-ignore
		const { data: resultData, schema: resultSchema } = createHugeSchema(
			// @ts-ignore
			{ ...simpleSchema },
			// @ts-ignore
			{ ...simpleData },
			n - 1,
		);
		return {
			data: { ...data, simple: resultData },
			schema: { ...schema, properties: { ...schema.properties, simple: resultSchema } },
		};
	} else {
		return {
			schema,
			data,
		};
	}
};
const { schema: hugeSchema, data: hugeData } = createHugeSchema(
	{ ...simpleSchema },
	{ ...simpleData },
	1000,
);
describe('instance of validator', () => {
	let validator: Validator;
	beforeAll(() => {
		validator = Validator.factory();
	});

	it('huge schema', () => {
		expect(() => {
			console.time('hugeData');
			validator.validate(hugeSchema, hugeData);
			console.timeLog('hugeData');
		}).not.toThrow();
	});
	it('simple schema multiple times', () => {
		expect(() => {
			console.time('hugeData');
			for (let i = 0; i < 1000; i++) {
				validator.validate(simpleSchema, simpleData as unknown as Json);
			}
			console.timeLog('hugeData');
		}).not.toThrow();
	});
});
