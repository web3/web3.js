import {
	JsonRpcPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
	JsonRpcResponseWithError,
	JsonRpcOptionalRequest,
	JsonRpcBatchRequest,
	JsonRpcNotification,
	JsonRpcRequest,
	JsonRpcBatchResponse,
} from './types';

let messageId = 0;

export const isResponseWithResult = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcResponseWithResult<Result> =>
	!Array.isArray(response) &&
	!!response &&
	response.jsonrpc === '2.0' &&
	response.result !== undefined &&
	!response.error &&
	(typeof response.id === 'number' || typeof response.id === 'string');

export const isResponseWithError = <Error = unknown, Result = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcResponseWithError<Error> =>
	!Array.isArray(response) &&
	response.jsonrpc === '2.0' &&
	!!response &&
	response.result === undefined &&
	response.error !== undefined &&
	(typeof response.id === 'number' || typeof response.id === 'string');

export const isResponseWithNotification = <Result>(
	response: JsonRpcNotification<Result>,
): response is JsonRpcNotification<Result> =>
	!Array.isArray(response) &&
	!!response &&
	response.jsonrpc === '2.0' &&
	response.params !== undefined;

export const validateResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): boolean => isResponseWithResult<Result>(response) || isResponseWithError<Error>(response);

export const isValidResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): boolean =>
	Array.isArray(response) ? response.every(validateResponse) : validateResponse(response);

export const isBatchResponse = <Result = unknown, Error = unknown>(
	response: JsonRpcResponse<Result, Error>,
): response is JsonRpcBatchResponse<Result, Error> =>
	Array.isArray(response) && response.length > 1 && isValidResponse(response);

export const toPayload = <ParamType = unknown[]>(
	request: JsonRpcOptionalRequest<ParamType>,
): JsonRpcPayload<ParamType> => {
	messageId += 1;

	return {
		jsonrpc: request.jsonrpc ?? '2.0',
		id: request.id ?? messageId,
		method: request.method,
		params: request.params ?? undefined,
	};
};

export const toBatchPayload = (requests: JsonRpcOptionalRequest<unknown>[]): JsonRpcBatchRequest =>
	requests.map(request => toPayload<unknown>(request)) as JsonRpcBatchRequest;

export const isBatchRequest = (
	request: JsonRpcBatchRequest | JsonRpcRequest<unknown> | JsonRpcOptionalRequest<unknown>,
): request is JsonRpcBatchRequest => Array.isArray(request) && request.length > 1;
