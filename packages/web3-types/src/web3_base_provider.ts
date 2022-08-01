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

import { Socket } from 'net';
import { Web3Error } from './error_types';
import { EthExecutionAPI } from './eth_execution_api';
import {
	JsonRpcNotification,
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
	JsonRpcResult,
	JsonRpcSubscriptionResult,
} from './json_rpc_types';
import { Web3APISpec, Web3APIMethod, Web3APIReturnType, Web3APIPayload } from './web3_api_types';

const symbol = Symbol.for('web3/base-provider');

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#connectivity
export type Web3ProviderStatus = 'connecting' | 'connected' | 'disconnected';

export type Web3ProviderEventCallback<T = JsonRpcResult> = (
	error: Error | undefined,
	result?: JsonRpcSubscriptionResult | JsonRpcNotification<T>,
) => void;

export type Web3ProviderRequestCallback<ResultType = unknown> = (
	// Used "null" value to match the legacy version
	// eslint-disable-next-line @typescript-eslint/ban-types
	err?: Error | Web3Error | null | JsonRpcResponseWithError<Error>,
	response?: JsonRpcResponseWithResult<ResultType>,
) => void;

export interface LegacySendProvider {
	send<R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
		// Used "null" value to match the legacy version
		// eslint-disable-next-line @typescript-eslint/ban-types
		callback: (err?: Error | null, response?: JsonRpcResponse<R>) => void,
	): void;
}

export interface LegacySendAsyncProvider {
	sendAsync<R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
	): Promise<JsonRpcResponse<R>>;
}

export interface LegacyRequestProvider {
	request<R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
		callback: (err: Error | undefined, response: JsonRpcResponse<R>) => void,
	): void;
}

export interface EIP1193Provider<API extends Web3APISpec> {
	request<Method extends Web3APIMethod<API>, ResponseType = Web3APIReturnType<API, Method>>(
		request: Web3APIPayload<API, Method>,
		requestOptions?: unknown,
	): Promise<JsonRpcResponseWithResult<ResponseType>>;
}

// Provider interface compatible with EIP-1193
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
export abstract class Web3BaseProvider<API extends Web3APISpec = EthExecutionAPI>
	implements LegacySendProvider, LegacySendAsyncProvider, EIP1193Provider<API>
{
	public static isWeb3Provider(provider: unknown) {
		return (
			provider instanceof Web3BaseProvider ||
			Boolean(provider && (provider as { [symbol]: boolean })[symbol])
		);
	}

	// To match an object "instanceof" does not work if
	// matcher class and object is using different package versions
	// to overcome this bottleneck used this approach.
	// The symbol value for one string will always remain same regardless of package versions
	// eslint-disable-next-line class-methods-use-this
	public get [symbol]() {
		return true;
	}

	public abstract getStatus(): Web3ProviderStatus;
	public abstract supportsSubscriptions(): boolean;

	/**
	 * @deprecated Please use `.request` instead.
	 * @param payload - Request Payload
	 * @param callback - Callback
	 */
	public send<R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
		// eslint-disable-next-line @typescript-eslint/ban-types
		callback: (err?: Error | null, response?: JsonRpcResponse<R>) => void,
	) {
		this.request(payload as Web3APIPayload<API, any>)
			.then(response => {
				callback(undefined, response);
			})
			.catch((err: Error | Web3Error) => {
				callback(err);
			});
	}

	/**
	 * @deprecated Please use `.request` instead.
	 * @param payload - Request Payload
	 */
	public async sendAsync<R = JsonRpcResult, P = unknown>(payload: JsonRpcPayload<P>) {
		return this.request(payload as Web3APIPayload<API, any>) as Promise<JsonRpcResponse<R>>;
	}

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
	public abstract request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(
		request: Web3APIPayload<API, Method>,
		requestOptions?: unknown,
	): Promise<JsonRpcResponseWithResult<ResultType>>;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#events
	public abstract on<T = JsonRpcResult>(
		type: 'message' | 'disconnect' | string,
		callback: Web3ProviderEventCallback<T>,
	): void;
	public abstract on(
		type: 'connect' | 'chainChanged',
		callback: Web3ProviderEventCallback<{
			readonly [key: string]: unknown;
			readonly chainId: string;
		}>,
	): void;
	public abstract on(
		type: 'accountsChanged',
		callback: Web3ProviderEventCallback<{
			readonly [key: string]: unknown;
			readonly accountsChanged: string[];
		}>,
	): void;
	public abstract removeListener(type: string, callback: Web3ProviderEventCallback): void;

	public abstract once?<T = JsonRpcResult>(
		type: string,
		callback: Web3ProviderEventCallback<T>,
	): void;
	public abstract removeAllListeners?(type: string): void;
	public abstract connect(): void;
	public abstract disconnect(code?: number, reason?: string): void;
	public abstract reset(): void;
}

export type SupportedProviders<API extends Web3APISpec> =
	| Web3BaseProvider<API>
	| EIP1193Provider<API>
	| LegacyRequestProvider
	| LegacySendProvider
	| LegacySendAsyncProvider;

export type Web3BaseProviderConstructor = new <API extends Web3APISpec>(
	url: string,
	net?: Socket,
) => Web3BaseProvider<API>;
