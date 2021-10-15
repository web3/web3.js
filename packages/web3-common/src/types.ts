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
	readonly method?: never;
	readonly params?: never;
}

export interface JsonRpcResponseWithResult<T = JsonRpcResult> {
	readonly id: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly error?: never;
	readonly result: T;
	readonly method?: never;
	readonly params?: never;
}

export interface Params<T = JsonRpcResult>{
	readonly subscription: string; // for subscription id
	readonly result: T;
}
export interface JsonRpcResponseWithSubscriptionResult<T = JsonRpcResult> {
	readonly id?: JsonRpcId;
	readonly jsonrpc: JsonRpcIdentifier;
	readonly method: string;  	// for subscription
	readonly params: Params<T>;	// for subscription results
	readonly error?: never;
	readonly result: never;
}

export type JsonRpcResponse<T = JsonRpcResult> =
	| JsonRpcResponseWithError
	| JsonRpcResponseWithResult<T>
	| JsonRpcResponseWithSubscriptionResult<T>;

export interface JsonRpcRequest<T = unknown[]> {
	readonly method: string;
	readonly params?: T;
}

export interface JsonRpcPayload<T = unknown[]> extends JsonRpcRequest<T> {
	readonly jsonrpc: JsonRpcIdentifier;
	readonly id?: JsonRpcId;
}

export interface RequestItem<T = unknown[], T2 = JsonRpcResult> {
    payload: JsonRpcPayload<T>;
    callback?: (error?: JsonRpcResponseWithError<T2> | Error, result?: JsonRpcResponseWithResult<T2>) => void;
}