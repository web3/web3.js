import { JsonRpcRequest, JsonRpcPayload, JsonRpcResponse } from './types';

let messageId = 0;

export const toPayload = <ParamType = unknown[]>(
	method: string,
	params: ParamType,
): JsonRpcPayload<ParamType> => {
	messageId += 1;

	return {
		jsonrpc: '2.0',
		id: messageId,
		method,
		params: params ?? undefined,
	};
};

export const validateResponse = (response: JsonRpcResponse): boolean =>
	!!response &&
	!response.error &&
	response.jsonrpc === '2.0' &&
	(typeof response.id === 'number' || typeof response.id === 'string') &&
	response.result !== undefined; // only undefined is not valid json object

export const isValidResponse = (response: JsonRpcResponse | JsonRpcResponse[]): boolean =>
	Array.isArray(response) ? response.every(validateResponse) : validateResponse(response);

export const toBatchPayload = (requests: JsonRpcRequest[]) =>
	requests.map(request => toPayload(request.method, request.params));
