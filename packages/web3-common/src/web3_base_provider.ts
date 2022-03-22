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

import { EthExecutionAPI } from './eth_execution_api';
import {
	Web3APIPayload,
	Web3APIReturnType,
	JsonRpcResponse,
	JsonRpcResult,
	Web3APIMethod,
	Web3APISpec,
	Web3BaseProviderStatus,
	Web3BaseProviderCallback,
} from './types';

const symbol = Symbol.for('web3/base-provider');

// Provider interface compatible with EIP-1193
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
export abstract class Web3BaseProvider<API extends Web3APISpec = EthExecutionAPI> {
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

	public abstract getStatus(): Web3BaseProviderStatus;
	public abstract supportsSubscriptions(): boolean;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
	public abstract request<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(
		request: Web3APIPayload<API, Method>,
		requestOptions?: unknown,
	): Promise<JsonRpcResponse<ResponseType>>;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#events
	public abstract on<T = JsonRpcResult>(
		type: 'message' | 'disconnect' | string,
		callback: Web3BaseProviderCallback<T>,
	): void;
	public abstract on(
		type: 'connect' | 'chainChanged',
		callback: Web3BaseProviderCallback<{
			readonly [key: string]: unknown;
			readonly chainId: string;
		}>,
	): void;
	public abstract on(
		type: 'accountsChanged',
		callback: Web3BaseProviderCallback<{
			readonly [key: string]: unknown;
			readonly accountsChanged: string[];
		}>,
	): void;
	public abstract removeListener(type: string, callback: Web3BaseProviderCallback): void;

	public abstract once?<T = JsonRpcResult>(
		type: string,
		callback: Web3BaseProviderCallback<T>,
	): void;
	public abstract removeAllListeners?(type: string): void;
	public abstract connect(): void;
	public abstract disconnect(code: number, reason: string): void;
	public abstract reset(): void;
}
