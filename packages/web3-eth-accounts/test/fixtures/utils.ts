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
import { hexToBytes } from '../../src/rlp/utils';

// Global symbols in both browsers and Node.js since v11
// See https://github.com/microsoft/TypeScript/issues/31535
declare const TextDecoder: any;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
export const bytesToUtf8 = (bytes: Uint8Array): string => new TextDecoder().decode(bytes);

export const numberToBytes = (a: bigint): Uint8Array => {
	const hex = a.toString(16);
	const pad = hex.length % 2 ? `0${hex}` : hex;
	return hexToBytes(pad);
};
