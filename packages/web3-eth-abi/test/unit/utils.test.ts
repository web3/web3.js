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

import { jsonInterfaceMethodToString } from '../../src/utils';
import { jsonInterfaceInvalidData, jsonInterfaceValidData } from '../fixtures/data';

describe('utils', () => {
	describe('jsonInterfaceMethodToString', () => {
		describe('valid cases', () => {
			it.each(jsonInterfaceValidData)('%s', (input, output) => {
				expect(jsonInterfaceMethodToString(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			// TODO: To be done after `sha3` is implemented
			it.todo('should throw error for invalid cases');
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
});
