import { Socket } from 'net';
import {
	EthExecutionAPI,
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResult,
	Web3APISpec,
	Web3BaseProvider,
} from 'web3-common';
import { HexString, Numbers, ValidTypes } from 'web3-utils';
// eslint-disable-next-line import/no-cycle
import { Web3Context } from './web3_context';

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
	| LegacySendAsyncProvider
	| string;

export type Web3BaseProviderConstructor = new <API extends Web3APISpec>(
	url: string,
	net?: Socket,
) => Web3BaseProvider<API>;

// TODO: When we have `web3-types` package we can share TransactionType
export type TransactionTypeParser = (transaction: Record<string, unknown>) => HexString | undefined;

// TODO: When we have `web3-types` package we can share TransactionType
export type TransactionBuilder = <
	ReturnType = Record<string, unknown>,
	API extends EthExecutionAPI = EthExecutionAPI,
>(options: {
	transaction: Record<string, unknown>;
	web3Context: Web3Context<API>;
	privateKey?: HexString | Buffer;
}) => Promise<ReturnType>;

export interface Web3ConfigOptions {
	handleRevert: boolean;
	defaultAccount: HexString | null;
	defaultBlock: HexString;
	transactionBlockTimeout: number;
	transactionConfirmationBlocks: number;
	transactionPollingInterval: number;
	transactionPollingTimeout: number;
	transactionReceiptPollingInterval: number | null;
	transactionConfirmationPollingInterval: number | null;
	blockHeaderTimeout: number;
	maxListenersWarningThreshold: number;
	defaultNetworkId: Numbers | null;
	defaultChain: string;
	defaultHardfork: string;
	defaultCommon: Record<string, unknown> | null;
	defaultReturnType: ValidTypes;
	defaultTransactionType: Numbers;
	defaultMaxPriorityFeePerGas: Numbers;
	transactionBuilder?: TransactionBuilder;
	transactionTypeParser?: TransactionTypeParser;
}
