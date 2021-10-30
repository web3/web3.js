import { Socket } from 'net';
import {
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResult,
	Web3BaseProvider,
	Web3APISpec,
} from 'web3-common';

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

export type SupportedProviders<API extends Web3APISpec> =
	| Web3BaseProvider<API>
	| LegacyRequestProvider
	| LegacySendProvider
	| LegacySendAsyncProvider;

export type Web3BaseProviderConstructor = new <API extends Web3APISpec>(
	url: string,
	net?: Socket,
) => Web3BaseProvider<API>;
