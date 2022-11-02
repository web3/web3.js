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
import { abiToJsonSchemaCases } from '../fixtures/abi_to_json_schema';
import { Web3Validator } from '../../src/web3_validator';
import { Web3ValidatorError } from '../../src/errors';
import * as keywords from '../../src/keywords';
import * as formats from '../../src/formats';
import { validNotBaseTypeData } from '../fixtures/validation';

describe('web3-validator', () => {
	describe('Web3Validator', () => {
		let validator: Web3Validator;

		beforeEach(() => {
			validator = new Web3Validator();
		});

		it('should initialize the validator', () => {
			expect(validator['_validator']).toBeDefined();
		});

		it.each(Object.keys(keywords))('should have keyword "%s"', keyword => {
			expect(validator['_validator'].getKeyword(keyword)).toBeDefined();
		});

		it.each(Object.keys(formats))('should have format "%s"', format => {
			expect(validator['_validator'].formats[format]).toEqual(
				// eslint-disable-next-line import/namespace
				formats[format as keyof typeof formats],
			);
		});

		describe('validate', () => {
			it('should pass for valid data', () => {
				expect(validator.validate(['uint'], [1])).toBeUndefined();
			});

			it('should raise error with empty value', () => {
				expect(() => validator.validate(['string'], [])).toThrow(
					'must NOT have fewer than 1 items',
				);
			});

			it('should raise error with less value', () => {
				expect(() => validator.validate(['string', 'string'], ['value'])).toThrow(
					'must NOT have fewer than 2 items',
				);
			});

			it('should raise error with more value', () => {
				expect(() => validator.validate(['string'], ['value', 'value2'])).toThrow(
					'must NOT have more than 1 items',
				);
			});

			it('should raise error by default', () => {
				expect(() => validator.validate(['uint'], [-1])).toThrow(
					'Web3 validator found 1 error[s]:\nvalue "-1" at "/0" must pass "uint" validation',
				);
			});

			it('should return errors if set silent', () => {
				expect(validator.validate(['uint'], [-1], { silent: true })).toEqual([
					{
						instancePath: '/0',
						keyword: 'eth',
						message: 'must pass "uint" validation',
						params: { value: -1 },
						schemaPath: '#/items/0/eth',
					},
				]);
			});

			it('should return undefined for empty schema and empty data', () => {
				expect(validator.validate([], [])).toBeUndefined();
			});

			it('should return error is schema is empty but data no', () => {
				const data = [1];
				const testFunction = () => {
					validator.validate([], data);
				};
				expect(testFunction).toThrow(
					'value at "/0" empty schema against data can not be validated',
				);

				expect(testFunction).toThrow(Web3ValidatorError);
			});

			it.each(validNotBaseTypeData)(
				'should pass for valid non base type data %s',
				({ dataType, data }: { dataType: string; data: any }) => {
					expect(validator.validate([dataType], [data])).toBeUndefined();
				},
			);
		});
		describe('validateJsonSchema', () => {
			it.each(abiToJsonSchemaCases.slice(0, 5))('should pass for valid data', abi => {
				const jsonSchema = abi.json;
				expect(
					validator.validateJSONSchema(jsonSchema.fullSchema, jsonSchema.data),
				).toBeUndefined();
			});

			it('should throw', () => {
				expect(() => {
					validator.validateJSONSchema(
						{
							type: 'array',
							items: [{ $id: 'a', eth: 'uint' }],
							minItems: 1,
							maxItems: 1,
						},
						[],
					);
				}).toThrow(Web3ValidatorError);
			});
			it('should return errors on silent', () => {
				expect(
					validator.validateJSONSchema(
						{
							type: 'array',
							items: [{ $id: 'a', eth: 'uint' }],
							minItems: 1,
							maxItems: 1,
						},
						[],
						{ silent: true },
					),
				).toMatchObject([
					{
						instancePath: '',
						schemaPath: '#/minItems',
						keyword: 'minItems',
						params: { limit: 1 },
						message: 'must NOT have fewer than 1 items',
					},
				]);
			});
		});
	});
});
