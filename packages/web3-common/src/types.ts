export type JsonRpcId = string | number | null;
export type JsonRpcResult = string | number | boolean | Record<string, unknown>;
export type JsonRpcIdentifier = '2.0' | '1.0';

export interface JsonRpcError<T = JsonRpcResult> {
	readonly code: number;
	readonly message: string;
	readonly data?: T;
}

export interface JsonRpcResponseWithError<T = JsonRpcResult> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error: JsonRpcError<T>;
	readonly result?: never;
}

export interface JsonRpcResponseWithResult<T = JsonRpcResult> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error?: never;
	readonly result: T;
}

export type JsonRpcResponse<T = JsonRpcResult> =
	| JsonRpcResponseWithError
	| JsonRpcResponseWithResult<T>;

export interface JsonRpcRequest<T = unknown[]> {
	readonly method: string;
	readonly params?: T;
}

export interface JsonRpcPayload<T = unknown[]> extends JsonRpcRequest<T> {
	readonly jsonrpc: JsonRpcIdentifier;
	readonly id?: JsonRpcId;
}
