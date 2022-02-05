import { Web3Validator } from '../../src/web3_validator';
import * as keywords from '../../src/keywords';
import * as formats from '../../src/formats';

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
		});
	});
});
