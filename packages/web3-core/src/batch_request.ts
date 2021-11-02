import {
	JsonRpcBatchResponse,
	JsonRpcOptionalRequest,
	DeferredPromise,
	jsonRpc,
	JsonRpcRequest,
} from 'web3-common';
import { Web3RequestManager } from './web3_request_manager';

export const DEFAULT_BATCH_REQUEST_TIMEOUT = 1000;

export class BatchRequest {
	private readonly _requestManager: Web3RequestManager;
	private readonly _requests: Map<
		number,
		{ payload: JsonRpcRequest; promise: DeferredPromise<unknown> }
	>;

	public constructor(requestManager: Web3RequestManager) {
		this._requestManager = requestManager;
		this._requests = new Map();
	}

	public add<ResponseType = unknown>(request: JsonRpcOptionalRequest<unknown>) {
		const payload = jsonRpc.toPayload(request) as JsonRpcRequest;
		const promise = new DeferredPromise<ResponseType>(DEFAULT_BATCH_REQUEST_TIMEOUT);

		this._requests.set(payload.id as number, { payload, promise });

		return promise;
	}

	public async execute(): Promise<JsonRpcBatchResponse<unknown, unknown>> {
		const response = await this._requestManager.sendBatch(
			[...this._requests.values()].map(r => r.payload),
		);

		if (response.length !== this._requests.size) {
			throw new Error(
				`Batch request mismatch the results. Requests: ${this._requests.size}, Responses: ${response.length}`,
			);
		}

		for (const res of response) {
			if (jsonRpc.isResponseWithResult(res)) {
				this._requests.get(res.id as number)?.promise.resolve(res.result);
			} else if (jsonRpc.isResponseWithError(res)) {
				this._requests.get(res.id as number)?.promise.reject(res.error);
			}
		}

		return response;
	}
}
