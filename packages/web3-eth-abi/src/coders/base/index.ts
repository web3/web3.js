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
import { EncoderResult, DecoderResult } from '../types';
import { decodeAddress, encodeAddress } from './address';
// eslint-disable-next-line import/no-cycle
import { decodeArray, encodeArray } from './array';
import { decodeBool, encodeBoolean } from './bool';
import { decodeBytes, encodeBytes } from './bytes';
import { decodeNumber, encodeNumber } from './number';
import { decodeString, encodeString } from './string';
// eslint-disable-next-line import/no-cycle
import { decodeTuple, encodeTuple } from './tuple';

export { encodeAddress } from './address';
export { encodeBoolean } from './bool';
export { encodeBytes } from './bytes';
export { encodeNumber } from './number';
export { encodeString } from './string';
// eslint-disable-next-line import/no-cycle
export { encodeTuple } from './tuple';

export function encodeParamFromAbiParameter(param: AbiParameter, value: unknown): EncoderResult {
	if (param.type === 'string') {
		return encodeString(param, value);
	}
	if (param.type === 'bool') {
		return encodeBoolean(param, value);
	}
	if (param.type === 'address') {
		return encodeAddress(param, value);
	}
	if (param.type === 'tuple') {
		return encodeTuple(param, value);
	}
	if (param.type.startsWith('bytes')) {
		return encodeBytes(param, value);
	}
	if (param.type.endsWith(']')) {
		return encodeArray(param, value);
	}
	if (param.type.startsWith('uint') || param.type.startsWith('int')) {
		return encodeNumber(param, value);
	}
	throw new Error('Unsupported');
}

export function decodeParamFromAbiParameter(param: AbiParameter, bytes: Uint8Array): DecoderResult {
	if (param.type === 'string') {
		return decodeString(param, bytes);
	}
	if (param.type === 'bool') {
		return decodeBool(param, bytes);
	}
	if (param.type === 'address') {
		return decodeAddress(param, bytes);
	}
	if (param.type === 'tuple') {
		return decodeTuple(param, bytes);
	}
	if (param.type.startsWith('bytes')) {
		return decodeBytes(param, bytes);
	}
	if (param.type.endsWith(']')) {
		return decodeArray(param, bytes);
	}
	if (param.type.startsWith('uint') || param.type.startsWith('int')) {
		return decodeNumber(param, bytes);
	}
	throw new Error('Unsupported');
}
