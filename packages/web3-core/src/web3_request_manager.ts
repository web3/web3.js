import { HttpProvider } from 'web3-providers-http';
import { Socket } from 'net';
import {
	InvalidProviderError,
	InvalidResponseError,
	JsonRpcPayload,
	JsonRpcBatchRequest,
	Web3BaseProvider,
	Web3EventEmitter,
	ProviderError,
	JsonRpcOptionalRequest,
	jsonRpc,
	ResponseError,
	JsonRpcBatchResponse,
	JsonRpcResponse,
} from 'web3-common';
import { SupportedProviders, Web3BaseProviderConstructor } from './types';
import {
	isLegacyRequestProvider,
	isLegacySendAsyncProvider,
	isLegacySendProvider,
	isWeb3Provider,
} from './utils';

export enum Web3RequestManagerEvent {
	PROVIDER_CHANGED = 'PROVIDER_CHANGED',
	BEFORE_PROVIDER_CHANGE = 'BEFORE_PROVIDER_CHANGE',
}

export class Web3RequestManager extends Web3EventEmitter<{
	[key in Web3RequestManagerEvent]: SupportedProviders;
}> {
	private _provider!: SupportedProviders;
	private readonly _providers: { [key: string]: Web3BaseProviderConstructor };

	public constructor(provider?: SupportedProviders | string, net?: Socket) {
		super();

		if (provider) {
			this.setProvider(provider, net);
		}

		this._providers = Web3RequestManager.providers;
	}

	public static get providers() {
		// TODO: Link the providers
		return {
			HttpProvider,
			WebsocketProvider: {} as Web3BaseProviderConstructor,
			IpcProvider: {} as Web3BaseProviderConstructor,
		};
	}

	public get provider() {
		if (!this._provider) {
			throw new ProviderError('Provider not available');
		}

		return this._provider;
	}

	public get providers() {
		return this._providers;
	}

	public setProvider(provider: SupportedProviders | string, net?: Socket) {
		let newProvider!: Web3BaseProvider;

		// autodetect provider
		if (provider && typeof provider === 'string' && this.providers) {
			// HTTP
			if (/^http(s)?:\/\//i.test(provider)) {
				newProvider = new this.providers.HttpProvider(provider);

				// WS
			} else if (/^ws(s)?:\/\//i.test(provider)) {
				newProvider = new this.providers.WebsocketProvider(provider);

				// IPC
			} else if (typeof net === 'object' && typeof net.connect === 'function') {
				newProvider = new this.providers.IpcProvider(provider, net);
			} else {
				throw new ProviderError(`Can't autodetect provider for "${provider}'"`);
			}
		}

		this.emit(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, this._provider);
		this._provider = newProvider ?? provider ?? null;
		this.emit(Web3RequestManagerEvent.PROVIDER_CHANGED, this._provider);
	}

	public async send<ResultType>(request: JsonRpcOptionalRequest<unknown>): Promise<ResultType> {
		const response = await this._sendRequest<ResultType>(request);

		if (jsonRpc.isResponseWithResult(response)) {
			return response.result;
		}

		throw new ResponseError(response);
	}

	public async sendBatch(request: JsonRpcBatchRequest): Promise<JsonRpcBatchResponse<unknown>> {
		const response = await this._sendRequest<unknown>(request);

		return response as JsonRpcBatchResponse<unknown>;
	}

	private async _sendRequest<ResultType>(
		// We accept any type of request params here
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		request: JsonRpcOptionalRequest<any> | JsonRpcBatchRequest,
	): Promise<JsonRpcResponse<ResultType>> {
		const { provider } = this;

		const payload = jsonRpc.isBatchRequest(request)
			? jsonRpc.toBatchPayload(request)
			: jsonRpc.toPayload(request);

		if (isWeb3Provider(provider)) {
			const response = await provider.request<ResultType>(payload);

			return this._processJsonRpcResponse(payload, response);
		}

		// TODO: This should be deprecated and removed.
		if (isLegacyRequestProvider(provider)) {
			return new Promise((resolve): void => {
				provider.request<ResultType>(payload, (err, response) => {
					if (err) {
						throw err;
					}

					return resolve(this._processJsonRpcResponse(payload, response));
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendProvider(provider)) {
			return new Promise((resolve): void => {
				provider.send<ResultType>(payload, (err, response) => {
					if (err) {
						throw err;
					}

					return resolve(this._processJsonRpcResponse(payload, response));
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendAsyncProvider(provider)) {
			return provider
				.sendAsync<ResultType>(payload)
				.then(response => this._processJsonRpcResponse(payload, response));
		}

		throw new InvalidProviderError('Provider does not have a request or send method to use.');
	}

	// eslint-disable-next-line class-methods-use-this
	private _processJsonRpcResponse<ResultType, ErrorType, RequestType>(
		payload: JsonRpcPayload<RequestType>,
		response: JsonRpcResponse<ResultType, ErrorType>,
	): JsonRpcResponse<ResultType> | never {
		if (jsonRpc.isBatchRequest(payload) && !Array.isArray(response)) {
			throw new ResponseError(response, 'Got normal response for a batch request.');
		}

		if (!jsonRpc.isBatchRequest(payload) && Array.isArray(response)) {
			throw new ResponseError(response, 'Got batch response for a normal request.');
		}

		if (jsonRpc.isBatchResponse(response)) {
			return response as JsonRpcBatchResponse<ResultType>;
		}

		if (
			(jsonRpc.isResponseWithError(response) || jsonRpc.isResponseWithResult(response)) &&
			!jsonRpc.isBatchRequest(payload)
		) {
			if (response.id && payload.id !== response.id) {
				throw new InvalidResponseError<ErrorType>(response);
			}
		}

		if (jsonRpc.isResponseWithError<ErrorType>(response)) {
			throw new InvalidResponseError<ErrorType>(response);
		}

		if (jsonRpc.isResponseWithResult<ResultType>(response)) {
			return response;
		}

		throw new ResponseError(response, 'Invalid response');
	}
}
