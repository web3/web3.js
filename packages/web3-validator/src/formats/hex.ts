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

import { FormatDefinition } from 'ajv';
import { isHex, isHexStrict, isHexString32Bytes, isHexString8Bytes } from '../validation/string';

export const hex: FormatDefinition<string> = { validate: (data: string) => isHex(data) };

export const hexStrict: FormatDefinition<string> = {
	validate: (data: string) => isHexStrict(data),
};

export const hex8Bytes: FormatDefinition<string> = {
	validate: (data: string) => isHexString8Bytes(data),
};

export const hexString32Bytes: FormatDefinition<string> = {
	validate: (data: string) => isHexString32Bytes(data),
};
