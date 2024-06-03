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
import { JsonRpcNotification, SubscriptionParams } from 'web3-types';

const responseWithResult = { jsonrpc: '2.0', id: 1, result: '' };
const responseWithError = { jsonrpc: '2.0', id: 1, error: { code: 1, message: 'string' } };
const responseWithRpcError = { jsonrpc: '2.0', id: 1, error: { code: -32000, message: 'string' } };
const responseWithSubscription = { id: 1, jsonrpc: '2.0', result: '' };
const responseWithNotfication = {
	jsonrpc: '2.0',
	method: 'subscribe',
	params: { subscription: '', result: '' } as SubscriptionParams,
} as JsonRpcNotification;
export const isResponseWithResultValidTest: [any, boolean][] = [
	[responseWithResult, true],
	[responseWithError, false],
	[{ ...responseWithResult, id: '1' }, true],
];

export const isResponseWithErrorValidTest: [any, boolean][] = [
	[responseWithResult, false],
	[responseWithError, true],
	[{ ...responseWithError, id: '1' }, true],
];

export const isResponseWithNotificationValidTest: [JsonRpcNotification, boolean][] = [
	[responseWithNotfication, true],
];

export const isSubscriptionResultValidTest: [any, boolean][] = [[responseWithSubscription, true]];

export const isValidResponseValidTest: [any, boolean][] = [
	[responseWithResult, true],
	[responseWithError, true],
];

export const isBatchResponseValidTest: [any, boolean][] = [
	[[responseWithResult, responseWithError], true],
	[[responseWithNotfication], false],
];

export const toPayloadValidTest: [any, any][] = [
	[
		{ method: 'delete' },
		{
			method: 'delete',
			id: expect.stringMatching(
				// Uuid
				'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
			),
			jsonrpc: '2.0',
			params: undefined,
		},
	],
	[
		{ method: 'add', jsonrpc: '1.0', id: 1 },
		{
			method: 'add',
			id: 1,
			jsonrpc: '1.0',
			params: undefined,
		},
	],
];

export const isResponseRpcErrorValidData: [any, boolean][] = [
	[responseWithRpcError, true],
	[responseWithError, false],
];

export const isBatchRequestValidData: [any, boolean][] = [
	[
		[
			{
				method: 'add',
				id: 1,
				jsonrpc: '1.0',
				params: undefined,
			},
		],
		true,
	],
	[
		{
			method: 'add',
			id: 1,
			jsonrpc: '1.0',
			params: undefined,
		},
		false,
	],
];
