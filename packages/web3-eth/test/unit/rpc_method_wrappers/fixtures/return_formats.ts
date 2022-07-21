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
import { DataFormat, FMT_BYTES, FMT_NUMBER } from 'web3-utils';

export const returnFormats: DataFormat[] = [
	{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX },
	{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX },
	{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.HEX },
	{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.HEX },

	{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.BUFFER },
	{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.BUFFER },
	{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER },
	{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.BUFFER },

	{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.UINT8ARRAY },
	{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.UINT8ARRAY },
	{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY },
	{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.UINT8ARRAY },
];
