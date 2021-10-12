export type JsonRpcId = string | number | null;
export type JsonRpcResponseData = string | number | boolean | Record<string, unknown> | unknown[];
export type JsonRpcIdentifier = '2.0' | '1.0';

export enum SupportedProtocolsEnum {
	EXECUTION,
	CONSENSUS,
}

export interface ExecutionJsonRpcRequest<T = unknown[]> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly method: string;
	readonly params?: T;
	readonly protocol?: SupportedProtocolsEnum.EXECUTION;
}

export interface ConsensusJsonRpcRequest<T = unknown> {
	readonly endpoint: string;
	readonly requestBody?: T;
	readonly protocol: SupportedProtocolsEnum.CONSENSUS;
}

export type JsonRpcRequest<T = unknown> = ExecutionJsonRpcRequest<T> | ConsensusJsonRpcRequest<T>;

export interface ExecutionJsonRpcResponse<T = JsonRpcResponseData> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error?: never;
	readonly result: T;
}

export interface ConsensusJsonRpcResponse<T = unknown> {
	readonly data: T;
}

export interface JsonRpcError {
	readonly code: number;
	readonly message: string;
}

export interface ExecutionJsonRpcError extends JsonRpcError {
	readonly data?: JsonRpcResponseData;
}

export interface ExecutionJsonRpcResponseError {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error: ExecutionJsonRpcError;
	readonly result?: never;
}

export interface ConsensusJsonRpcResponseError extends JsonRpcError {
	readonly failures?: Record<string, unknown>[];
}

export type JsonRpcResponseResult<T = JsonRpcResponseData> =
	| ExecutionJsonRpcResponse<T>
	| ConsensusJsonRpcResponse<T>;

export type JsonRpcResponseError = ExecutionJsonRpcResponseError | ConsensusJsonRpcResponseError;

export type JsonRpcResponse<T = JsonRpcResponseData> =
	| JsonRpcResponseResult<T>
	| JsonRpcResponseError;
