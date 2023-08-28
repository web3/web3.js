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

import { AbiError } from 'web3-errors';
import type { AbiParameter } from 'web3-types';
import { bytesToHex, toBigInt } from 'web3-utils';
import { DecoderResult, EncoderResult } from '../types.js';
import { allocUnsafe, WORD_SIZE } from '../utils.js';

function bigIntToUint8Array(value: bigint, byteLength = WORD_SIZE): Uint8Array {
	const uint8Array = allocUnsafe(byteLength);
	let isNegative = false;

	let a = value;

	// Convert the BigInt value to a positive number and set the sign flag if it's negative.
	if (value < BigInt(0)) {
		a = -value;
		isNegative = true;
	}

	// Write the binary representation of the value to the Uint8Array.
	for (let i = byteLength - 1; i >= 0; i -= 1) {
		// eslint-disable-next-line no-bitwise
		const byteValue = Number(a & BigInt(0xff));
		uint8Array[i] = byteValue;
		// eslint-disable-next-line no-bitwise
		a >>= BigInt(8);
	}

	// If the value is negative, convert it to two's complement.
	if (isNegative) {
		for (let i = 0; i < byteLength; i += 1) {
			// eslint-disable-next-line no-bitwise
			uint8Array[i] = ~uint8Array[i];
		}
		for (let i = byteLength - 1; i >= 0; i -= 1) {
			const byteValue = uint8Array[i] + 1;
			// eslint-disable-next-line no-bitwise
			uint8Array[i] = byteValue & 0xff;
			if (byteValue <= 0xff) {
				break;
			}
		}
	}

	return uint8Array;
}

const numberLimits = new Map<string, { min: bigint; max: bigint }>();

// precalculate all the limits
for (let i = 8; i <= 256; i *= 2) {
	numberLimits.set(`uint${i}`, {
		min: BigInt(0),
		max: BigInt(2) ** BigInt(i) - BigInt(1),
	});
	numberLimits.set(`int${i}`, {
		min: -(BigInt(2) ** BigInt(i - 1)),
		max: BigInt(2) ** BigInt(i - 1) - BigInt(1),
	});
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
numberLimits.set(`int`, numberLimits.get('int256')!);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
numberLimits.set(`uint`, numberLimits.get('uint256')!);

export function encodeNumber(param: AbiParameter, input: unknown): EncoderResult {
	let value;
	try {
		value = toBigInt(input);
	} catch (e) {
		throw new AbiError('provided input is not number value', {
			type: param.type,
			value: input,
			name: param.name,
		});
	}
	const limit = numberLimits.get(param.type);
	if (!limit) {
		throw new AbiError('provided abi contains invalid number datatype', { type: param.type });
	}
	if (value < limit.min) {
		throw new AbiError('provided input is less then minimum for given type', {
			type: param.type,
			value: input,
			name: param.name,
			minimum: limit.min.toString(),
		});
	}
	if (value > limit.max) {
		throw new AbiError('provided input is greater then maximum for given type', {
			type: param.type,
			value: input,
			name: param.name,
			maximum: limit.max.toString(),
		});
	}
	return {
		dynamic: false,
		encoded: bigIntToUint8Array(value),
	};
}

export function decodeNumber(param: AbiParameter, bytes: Uint8Array): DecoderResult<bigint> {
	if (bytes.length < WORD_SIZE) {
		throw new AbiError('Not enough bytes left to decode', { param, bytesLeft: bytes.length });
	}
	const boolBytes = bytes.subarray(0, WORD_SIZE);
	const limit = numberLimits.get(param.type);
	if (!limit) {
		throw new AbiError('provided abi contains invalid number datatype', { type: param.type });
	}
	// TODO: negative number decoding. See "bigIntToUint8Array" as you need to implement decoding mannually

	const numberResult = toBigInt(bytesToHex(boolBytes));

	if (numberResult < limit.min) {
		throw new AbiError('decoded value is less then minimum for given type', {
			type: param.type,
			value: numberResult,
			name: param.name,
			minimum: limit.min.toString(),
		});
	}
	if (numberResult > limit.max) {
		throw new AbiError('decoded value is greater then maximum for given type', {
			type: param.type,
			value: numberResult,
			name: param.name,
			maximum: limit.max.toString(),
		});
	}
	return {
		result: numberResult,
		encoded: bytes.subarray(WORD_SIZE),
		consumed: WORD_SIZE,
	};
}
