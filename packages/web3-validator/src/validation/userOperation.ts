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

import { UserOperation } from 'web3-types';
import { isHexStrict } from './string';

/**
 * UserOperation a full user-operation struct. All fields MUST be set as hex values. empty bytes block (e.g. empty initCode) MUST be set to "0x"
 * @param userOperation
 * @returns boolean
 */
export const isUserOperationAllHex = (userOperation: UserOperation): boolean =>
	Object.values(userOperation).every(isHexStrict);
