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

import { ValidInputTypes } from '../types';

/**
 * checks input if typeof data is valid string input
 */
export const isString = (value: ValidInputTypes) => typeof value === 'string';

export const isHexStrict = (hex: ValidInputTypes) =>
	typeof hex === 'string' && /^(-)?0x[0-9a-f]*$/i.test(hex);

export const isHex = (hex: ValidInputTypes): boolean =>
	typeof hex === 'number' ||
	typeof hex === 'bigint' ||
	(typeof hex === 'string' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex));

export const isHexString8Bytes = (value: string, prefixed = true) =>
	prefixed ? isHexStrict(value) && value.length === 18 : isHex(value) && value.length === 16;

export const isHexString32Bytes = (value: string, prefixed = true) =>
	prefixed ? isHexStrict(value) && value.length === 66 : isHex(value) && value.length === 64;
