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

import {
	jsonInterfaceMethodToString,
	isAbiConstructorFragment,
	flattenTypes,
	mapTypes,
	formatParam,
	isOddHexstring,
	formatOddHexstrings,
	isAbiFragment,
} from '../../src/utils';
import {
	jsonInterfaceInvalidData,
	jsonInterfaceValidData,
	validIsAbiConstructorFragment,
	invalidIsAbiConstructorFragment,
	mapTypesValidData,
	formatParamValidData,
} from '../fixtures/data';

describe('utils', () => {
	describe('jsonInterfaceMethodToString', () => {
		describe('valid cases', () => {
			it.each(jsonInterfaceValidData)('%s', (input, output) => {
				expect(jsonInterfaceMethodToString(input)).toEqual(output);
			});
		});
		describe('default cases', () => {
			it('default json value', () => {
				// @ts-expect-error invalid input
				expect(jsonInterfaceMethodToString({})).toBe('()');
			});
			it('name value with brackets', () => {
				expect(
					jsonInterfaceMethodToString({
						name: '(test)',
						type: 'function',
						inputs: [],
					}),
				).toBe('(test)');
			});
		});
		describe('invalid cases', () => {
			// TODO: To be done after `sha3` is implemented
			it.todo('should throw error for invalid cases');
		});
	});
	describe('mapTypes', () => {
		describe('valid data', () => {
			it.each(mapTypesValidData)('%s', (input, output) => {
				expect(mapTypes(input)).toEqual(output);
			});
		});
	});
	describe('formatParam', () => {
		describe('default types', () => {
			it.each(formatParamValidData)('%s', (input, output) => {
				expect(formatParam(input[0], input[1])).toEqual(output);
			});
		});
	});
	describe('isOddHexstring', () => {
		it('not string param', () => {
			expect(isOddHexstring('')).toBeFalsy();
		});
	});
	describe('isAbiFragment', () => {
		it('nullish', () => {
			expect(isAbiFragment(undefined)).toBeFalsy();
		});
	});
	describe('formatOddHexstrings', () => {
		it('not string param', () => {
			expect(formatOddHexstrings('')).toBeFalsy();
		});
	});
	describe('flattenTypes', () => {
		it('default types with include tuples', () => {
			expect(
				flattenTypes(true, [
					{
						type: 'tuple',
						name: 'test',
						components: [
							{
								name: 'test',
								type: '[string,number]',
							},
						],
					},
				]),
			).toEqual(['tuple([string,number])']);
		});
	});
	describe('jsonInterface', () => {
		describe('valid cases', () => {
			it.each(jsonInterfaceValidData)('%s', (input, output) => {
				expect(jsonInterfaceMethodToString(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(jsonInterfaceInvalidData)('%s', (input, output) => {
				expect(() => jsonInterfaceMethodToString(input)).toThrow(output);
			});
		});
	});
	describe('isAbiConstructorFragment', () => {
		describe('valid cases', () => {
			it.each(validIsAbiConstructorFragment)('%s', ({ input }) => {
				expect(isAbiConstructorFragment(input)).toBeTruthy();
			});
		});

		describe('invalid cases', () => {
			it.each(invalidIsAbiConstructorFragment)('%s', ({ input }) => {
				expect(isAbiConstructorFragment(input)).toBeFalsy();
			});
		});
	});
});
