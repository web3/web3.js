import { Socket } from 'net';
import {
	Web3APISpec,
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResult,
	Web3BaseProvider,
} from 'web3-common';
import { HexString, ValidTypes } from 'web3-utils';

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

export interface Web3ConfigOptions {
	handleRevert: boolean;
	defaultAccount: HexString | null;
	defaultBlock: HexString;
	transactionBlockTimeout: number;
	transactionConfirmationBlocks: number;
	transactionPollingTimeout: number;
	blockHeaderTimeout: number;
	maxListenersWarningThreshold: number;
	defaultChain: string | null;
	defaultHardfork: string | null;
	defaultCommon: Record<string, unknown> | null;
	defaultReturnType: ValidTypes;
}
