import {
	JsonRpcBatchResponse,
	JsonRpcOptionalRequest,
	DeferredPromise,
	jsonRpc,
	JsonRpcRequest,
	ResponseError,
	OperationAbortError,
	OperationTimeoutError,
} from 'web3-common';
import { Web3RequestManager } from './web3_request_manager';

export const DEFAULT_BATCH_REQUEST_TIMEOUT = 1000;

export class Web3BatchRequest {
	private readonly _requestManager: Web3RequestManager;
	private readonly _requests: Map<
		number,
		{ payload: JsonRpcRequest; promise: DeferredPromise<unknown> }
	>;

	public constructor(requestManager: Web3RequestManager) {
		this._requestManager = requestManager;
		this._requests = new Map();
	}

	public get requests() {
		return [...this._requests.values()].map(r => r.payload);
	}

	public add<ResponseType = unknown>(request: JsonRpcOptionalRequest<unknown>) {
		const payload = jsonRpc.toPayload(request) as JsonRpcRequest;
		const promise = new DeferredPromise<ResponseType>();

		this._requests.set(payload.id as number, { payload, promise });

		return promise;
	}

	// eslint-disable-next-line class-methods-use-this
	public async execute(): Promise<JsonRpcBatchResponse<unknown, unknown>> {
		if (this.requests.length === 0) {
			return Promise.resolve([]);
		}

		const request = new DeferredPromise<JsonRpcBatchResponse<unknown, unknown>>({
			timeout: DEFAULT_BATCH_REQUEST_TIMEOUT,
			eagerStart: true,
			timeoutMessage: 'Batch request timeout',
		});

		this._processBatchRequest(request).catch(err => request.reject(err));

		request.catch((err: Error) => {
			if (err instanceof OperationTimeoutError) {
				this._abortAllRequests('Batch request timeout');
			}

			request.reject(err);
		});

		return request;
	}

	private async _processBatchRequest(
		promise: DeferredPromise<JsonRpcBatchResponse<unknown, unknown>>,
	) {
		const response = await this._requestManager.sendBatch(
			[...this._requests.values()].map(r => r.payload),
		);

		if (response.length !== this._requests.size) {
			this._abortAllRequests('Invalid batch response');

			throw new ResponseError(
				response,
				`Batch request size mismatch the results size. Requests: ${this._requests.size}, Responses: ${response.length}`,
			);
		}

		const requestIds = this.requests
			.map(r => r.id)
			.map(Number)
			.sort((a, b) => a - b);

		const responseIds = response
			.map(r => r.id)
			.map(Number)
			.sort((a, b) => a - b);

		if (JSON.stringify(requestIds) !== JSON.stringify(responseIds)) {
			this._abortAllRequests('Invalid batch response');

			throw new ResponseError(
				response,
				`Batch request mismatch the results. Requests: [${requestIds.join()}], Responses: [${responseIds.join()}]`,
			);
		}

		for (const res of response) {
			if (jsonRpc.isResponseWithResult(res)) {
				this._requests.get(res.id as number)?.promise.resolve(res.result);
			} else if (jsonRpc.isResponseWithError(res)) {
				this._requests.get(res.id as number)?.promise.reject(res.error);
			}
		}

		promise.resolve(response);
	}

	private _abortAllRequests(msg: string) {
		for (const { promise } of this._requests.values()) {
			promise.reject(new OperationAbortError(msg));
		}
	}
}
