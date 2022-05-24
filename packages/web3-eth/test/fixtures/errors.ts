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

export const InvalidTransactionWithSenderData: [unknown, string][] = [
	[
		BigInt(9007199254740991),
		'Invalid value given "9007199254740991". Error: invalid transaction with sender.',
	],
	['Invalid data', 'Invalid value given "Invalid data". Error: invalid transaction with sender.'],
	['0x0', 'Invalid value given "0x0". Error: invalid transaction with sender.'],
	[0, 'Invalid value given "0". Error: invalid transaction with sender.'],
];

export const InvalidTransactionCallData: [unknown, string][] = [
	[
		BigInt(9007199254740991),
		'Invalid value given "9007199254740991". Error: invalid transaction call',
	],
	['Invalid data', 'Invalid value given "Invalid data". Error: invalid transaction call'],
	['0x0', 'Invalid value given "0x0". Error: invalid transaction call'],
	[0, 'Invalid value given "0". Error: invalid transaction call'],
];
