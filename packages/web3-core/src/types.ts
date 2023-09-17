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

import { HexString, Transaction } from 'web3-types';
// eslint-disable-next-line import/no-cycle
import { Web3Context } from './web3_context.js';

export type TransactionTypeParser = (
	transaction: Transaction,
	web3Context: Web3Context,
) => Promise<HexString | undefined>;

export interface Method {
	name: string;
	call: string;
}

export interface ExtensionObject {
	property?: string;
	methods: Method[];
}
