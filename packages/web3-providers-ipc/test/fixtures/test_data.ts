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

export const validConnectionStrings = [
	'ws://localhost:8545',
	'ws://www.localhost',
	'ws://localhost',
	'wss://foo.com',
	'ws://foo.ninja',
	'wss://foo.com',
	'ws://foo.com:8545',
];

export const invalidConnectionStrings = [
	'htt://localhost:8545',
	'http//localhost:8545',
	'ipc://localhost:8545',
	'',
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	null,
	undefined,
	42,
];

export const wsProviderOptions = {
	followRedirects: true,
	handshakeTimeout: 1500,
	maxRedirects: 3,
	perMessageDeflate: true,
};
