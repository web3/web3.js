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

import { keccak256 } from 'js-sha3';
import {
	sha3,
	sha3Raw,
	soliditySha3,
	soliditySha3Raw,
	encodePacked,
	keccak256 as web3keccak256,
} from '../../src/hash';
import {
	sha3Data,
	sha3ValidData,
	soliditySha3RawValidData,
	sha3RawValidData,
	soliditySha3ValidData,
	soliditySha3InvalidData,
	compareSha3JSValidData,
	compareSha3JSRawValidData,
	encodePackData,
	encodePackedInvalidData,
	keccak256ValidData,
} from '../fixtures/hash';

describe('hash', () => {
	describe('sha3', () => {
		describe('valid cases', () => {
			it.each(sha3ValidData)('%s', (input, output) => {
				expect(sha3(input)).toEqual(output);
			});
		});

		describe('compare with js-sha3 normal cases', () => {
			it.each(sha3Data)('%s', input => {
				expect(sha3(input)).toBe(`0x${keccak256(input)}`);
			});
		});

		describe('compare with js-sha3 buffer cases', () => {
			it.each(compareSha3JSValidData)('%s', (input, output) => {
				expect(sha3(input)).toBe(`0x${keccak256(output)}`);
			});
		});
	});

	describe('sha3Raw', () => {
		describe('valid cases', () => {
			it.each(sha3RawValidData)('%s', (input, output) => {
				expect(sha3Raw(input)).toEqual(output);
			});
		});
		describe('comparing with js-sha3 cases', () => {
			it.each(compareSha3JSRawValidData)('%s', (input, output) => {
				expect(sha3Raw(input)).toBe(`0x${keccak256(output)}`);
			});
		});
	});

	describe('soliditySha3', () => {
		describe('valid cases', () => {
			it.each(soliditySha3ValidData)('%s', (input, output) => {
				expect(soliditySha3(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(soliditySha3InvalidData)('%s', (input, output) => {
				expect(() => soliditySha3(input)).toThrow(output);
			});
		});
	});

	describe('soliditySha3Raw', () => {
		describe('valid cases', () => {
			it.each(soliditySha3RawValidData)('%s', (input, output) => {
				expect(soliditySha3Raw(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(soliditySha3InvalidData)('%s', (input, output) => {
				expect(() => soliditySha3Raw(input)).toThrow(output);
			});
		});
	});

	describe('encodePacked', () => {
		describe('valid cases', () => {
			it.each(encodePackData)('%s', (input, output) => {
				expect(encodePacked(...input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(encodePackedInvalidData)('%s', (input, output) => {
				expect(() => encodePacked(input)).toThrow(output);
			});
		});
	});
	describe('keccak256', () => {
		describe('valid cases', () => {
			it.each(keccak256ValidData)('%s', (input, output) => {
				expect(web3keccak256(input)).toEqual(output);
			});
		});
	});
});
