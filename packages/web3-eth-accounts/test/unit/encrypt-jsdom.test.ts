/**
 * @jest-environment jsdom
 */

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

// ignore the rule `header/header` to allow keeping `@jest-environment jsdom` on top:
// eslint-disable-next-line header/header
import { TextEncoder } from 'util';

/* eslint-disable import/first */
global.TextEncoder = TextEncoder; // polyfill TextEncoder for jsdom

import { InsecureContextError } from 'web3-errors';
import { encrypt } from '../../src/account';
import { validEncryptData } from '../fixtures/account';

describe('encrypt/decrypt in jsdom', () => {
	describe('encrypt', () => {
		describe('valid cases', () => {
			it.each(validEncryptData)('%s', async input => {
				const result = encrypt(input[0], input[1], input[2]);
				await expect(result).rejects.toThrow(InsecureContextError);
			});
		});
	});
});
