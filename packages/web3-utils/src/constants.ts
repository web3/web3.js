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
import { Buffer } from 'buffer';
import { CURVE } from 'ethereum-cryptography/secp256k1';

/**
 * 2^64-1
 */
export const MAX_UINT64 = BigInt('0xffffffffffffffff');

/**
 * The max integer that the evm can handle (2^256-1)
 */
export const MAX_INTEGER = BigInt(
	'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

/**
 * The max integer that the evm can handle (2^256-1) as a bigint
 * 2^256-1 equals to 340282366920938463463374607431768211455
 * We use literal value instead of calculated value for compatibility issue.
 */
export const MAX_INTEGER_BIGINT = BigInt(
	'115792089237316195423570985008687907853269984665640564039457584007913129639935',
);

export const SECP256K1_ORDER = CURVE.n;
export const SECP256K1_ORDER_DIV_2 = CURVE.n / BigInt(2);

/**
 * 2^256
 */
export const TWO_POW256 = BigInt(
	'0x10000000000000000000000000000000000000000000000000000000000000000',
);

/**
 * Keccak-256 hash of null
 */
export const KECCAK256_NULL_S = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

/**
 * Keccak-256 hash of null
 */
export const KECCAK256_NULL = Buffer.from(KECCAK256_NULL_S, 'hex');

/**
 * Keccak-256 of an RLP of an empty array
 */
export const KECCAK256_RLP_ARRAY_S =
	'1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347';

/**
 * Keccak-256 of an RLP of an empty array
 */
export const KECCAK256_RLP_ARRAY = Buffer.from(KECCAK256_RLP_ARRAY_S, 'hex');

/**
 * Keccak-256 hash of the RLP of null
 */
export const KECCAK256_RLP_S = '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421';

/**
 * Keccak-256 hash of the RLP of null
 */
export const KECCAK256_RLP = Buffer.from(KECCAK256_RLP_S, 'hex');

/**
 *  RLP encoded empty string
 */
export const RLP_EMPTY_STRING = Buffer.from([0x80]);

export const MAX_WITHDRAWALS_PER_PAYLOAD = 16;
