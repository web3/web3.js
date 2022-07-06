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

// duplicate types from web3-common for avoiding cyclic dep between web3-errors and web3-common
export type ConnectionEvent = {
	code: number;
	reason: string;
	wasClean?: boolean; // if WS connection was closed properly
};

// To avoid dependency of `web3-common` have to use fixed types
export type Log = {
	readonly removed?: boolean;
	readonly logIndex?: bigint;
	readonly transactionIndex?: bigint;
	readonly transactionHash?: string;
	readonly blockHash?: string;
	readonly blockNumber?: bigint;
	readonly address?: string;
	readonly data?: string;
	readonly topics?: string[];
};

export type ReceiptInfo = {
	readonly logs: Record<string, unknown>[];
	readonly [key: string]: unknown;
};
