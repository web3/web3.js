import {
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
	JsonRpcResult,
} from './types';

export interface ProviderMessage<T = JsonRpcResult> {
	type: string;
	data: T;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#connectivity
export type Web3BaseProviderStatus = 'connecting' | 'connected' | 'disconnected';
export type Web3BaseProviderCallback<T = JsonRpcResult> = (
	error: Error | null,
	result?: ProviderMessage<T>,
) => void;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#provider-errors
export const JSONRPC_ERR_REJECTED_REQUEST = 4001;
export const JSONRPC_ERR_UNAUTHORIZED = 4001;
export const JSONRPC_ERR_UNSUPPORTED_METHOD = 4200;
export const JSONRPC_ERR_DISCONNECTED = 4900;
export const JSONRPC_ERR_CHAIN_DISCONNECTED = 4901;

// Provider interface compatible with EIP-1193
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
export abstract class Web3BaseProvider {
	// TODO: For legacy support, should be deprecated and removed in favor of `request`
	public send<T = JsonRpcResult, T2 = unknown[], T3 = unknown>(
		payload: JsonRpcPayload<T2>,
		callback: (
			error?: JsonRpcResponseWithError<T>,
			result?: JsonRpcResponseWithResult<T>,
		) => void,
		providerOptions?: T3,
	): void {
		this.request<JsonRpcResponseWithResult<T>, T2, T3>(payload, providerOptions)
			.then(d => callback(undefined, d))
			.catch(e => callback(e, undefined));
	}

	abstract getStatus(): Web3BaseProviderStatus;
	abstract supportsSubscriptions(): boolean;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
	abstract request<T = JsonRpcResponse, T2 = unknown[], T3 = unknown>(
		request: JsonRpcPayload<T2>,
		providerOptions?: T3,
	): Promise<T>;

	// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#events
	abstract on<T = JsonRpcResult>(
		type: 'message' | 'disconnect' | string,
		callback: Web3BaseProviderCallback<T>,
	): void;
	abstract on(
		type: 'connect' | 'chainChanged',
		callback: Web3BaseProviderCallback<{
			readonly [key: string]: unknown;
			readonly chainId: string;
		}>,
	): void;
	abstract on(
		type: 'accountsChanged',
		callback: Web3BaseProviderCallback<{
			readonly [key: string]: unknown;
			readonly accountsChanged: string[];
		}>,
	): void;
	abstract removeListener(type: string, callback: Web3BaseProviderCallback): void;

	abstract once?<T = JsonRpcResult>(type: string, callback: Web3BaseProviderCallback<T>): void;
	abstract removeAllListeners?(type: string): void;
	abstract connect(): void;
	abstract disconnect(code: number, reason: string): void;
	abstract reset(): void;
	abstract reconnect(): void;
}
