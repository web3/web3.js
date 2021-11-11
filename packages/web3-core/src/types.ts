import { JsonRpcPayload, JsonRpcResponse, JsonRpcResult, Web3BaseProvider } from 'web3-common';

export type LegacyRequestProvider = {
	request: <R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
		cb: (err: Error | null, response: JsonRpcResponse<R>) => void,
	) => void;
};

export type LegacySendProvider = {
	send: <R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
		cb: (err: Error | null, response: JsonRpcResponse<R>) => void,
	) => void;
};

export type LegacySendAsyncProvider = {
	sendAsync: <R = JsonRpcResult, P = unknown>(
		payload: JsonRpcPayload<P>,
	) => Promise<JsonRpcResponse<R>>;
};

export type SupportedProviders =
	| Web3BaseProvider
	| LegacyRequestProvider
	| LegacySendProvider
	| LegacySendAsyncProvider;

export type Web3BaseProviderConstructor = new (url: string, ...args: any) => Web3BaseProvider;
