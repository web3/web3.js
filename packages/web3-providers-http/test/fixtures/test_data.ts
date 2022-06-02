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

export const validClients = [
	'http://localhost:8545',
	'http://www.localhost',
	'http://localhost',
	'http://foo.com',
	'http://foo.ninja',
	'https://foo.com',
	'http://foo.com:8545',
];

export const invalidClients = [
	'htt://localhost:8545',
	'http//localhost:8545',
	'ws://localhost:8545',
	'',
	// Using "null" value intentionally for validation
	// eslint-disable-next-line no-null/no-null
	null,
	undefined,
	/* eslint-disable @typescript-eslint/no-magic-numbers */
	42,
];

export const httpProviderOptions = {
	providerOptions: {
		body: undefined,
		cache: 'force-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		integrity: 'foo',
		keepalive: true,
		method: 'GET',
		mode: 'same-origin',
		redirect: 'error',
		referrer: 'foo',
		referrerPolicy: 'same-origin',
		signal: undefined,
		window: undefined,
	} as RequestInit,
};

export const mockGetBalanceResponse = {
	id: 1,
	jsonrpc: '2.0',
	result: '0x0234c8a3397aab58', // 158972490234375000
};
