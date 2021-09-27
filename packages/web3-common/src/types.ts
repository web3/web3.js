export type JSONRPCId = string | number | null;
export type JSONRPCResult = string | number | boolean | Record<string, unknown>;
export type JSONRPCIdentifier = '2.0' | '1.0';

export interface JSONRPCError<T = JSONRPCResult> {
	readonly code: number;
	readonly message: string;
	readonly data?: T;
}

export interface JSONRPCResponseWithError<T = JSONRPCResult> {
	readonly id: JSONRPCId;
	readonly jsonrpc: JSONRPCIdentifier;
	readonly error: JSONRPCError<T>;
	readonly result?: never;
}

export interface JSONRPCResponseWithResult<T = JSONRPCResult> {
	readonly id: JSONRPCId;
	readonly jsonrpc: JSONRPCIdentifier;
	readonly error?: never;
	readonly result: T;
}

export type JSONRPCResponse<T = JSONRPCResult> =
	| JSONRPCResponseWithError
	| JSONRPCResponseWithResult<T>;

export interface JSONRPCRequest<T = unknown[]> {
	readonly method: string;
	readonly params?: T;
}

export interface JSONRPCPayload<T = unknown[]> extends JSONRPCRequest<T> {
	readonly jsonrpc: JSONRPCIdentifier;
	readonly id?: JSONRPCId;
}
