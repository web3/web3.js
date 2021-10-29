import { Socket } from 'net';
import {
	InvalidProviderError,
	InvalidResponseError,
	JsonRpcPayload,
	JsonRpcRequest,
	JsonRpcResponse,
	Web3BaseProvider,
	Web3EventEmitter,
	ProviderError,
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
	private _requestCounter = 0;
	private _provider!: SupportedProviders;
	private readonly _providers: { [key: string]: Web3BaseProviderConstructor };

	public constructor(provider?: Web3BaseProvider | string, net?: Socket) {
		super();

		if (provider) {
			this.setProvider(provider, net);
		}

		this._providers = Web3RequestManager.providers;
	}

	public static get providers() {
		// TODO: Link the providers
		return {
			HttpProvider: {} as Web3BaseProviderConstructor,
			WebsocketProvider: {} as Web3BaseProviderConstructor,
			IpcProvider: {} as Web3BaseProviderConstructor,
		};
	}

	public get provider() {
		return this._provider;
	}

	public get providers() {
		return this._providers;
	}

	public setProvider(provider: Web3BaseProvider | string, net?: Socket) {
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

		this.emit(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, this.provider);
		this._provider = newProvider ?? provider ?? null;
		this.emit(Web3RequestManagerEvent.PROVIDER_CHANGED, this.provider);
	}

	public async send<ResultType, RequestType = unknown>(request: JsonRpcRequest<RequestType>) {
		const { provider } = this;

		if (!provider) {
			throw new ProviderError('Provider not available');
		}

		if (isWeb3Provider(provider)) {
			return provider.request<ResultType, RequestType>(request);
		}

		// TODO: This should be deprecated and removed.
		if (isLegacyRequestProvider(provider)) {
			const payload = this._requestToPayload(request);

			return new Promise<ResultType>((resolve): void => {
				provider.request<ResultType, RequestType>(payload, (err, response) => {
					if (err) {
						throw err;
					}

					return resolve(this._processJsonRpcResponse(payload, response));
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendProvider(provider)) {
			const payload = this._requestToPayload(request);

			return new Promise<ResultType>((resolve): void => {
				provider.send<ResultType, RequestType>(payload, (err, response) => {
					if (err) {
						throw err;
					}

					return resolve(this._processJsonRpcResponse(payload, response));
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendAsyncProvider(provider)) {
			const payload = this._requestToPayload(request);

			return provider
				.sendAsync<ResultType, RequestType>(payload)
				.then(async response => this._processJsonRpcResponse(payload, response));
		}

		throw new InvalidProviderError('Provider does not have a request or send method to use.');
	}

	// eslint-disable-next-line @typescript-eslint/require-await, class-methods-use-this
	private async _processJsonRpcResponse<ResultType, ErrorType, RequestType>(
		payload: JsonRpcPayload<RequestType>,
		response: JsonRpcResponse<ResultType, ErrorType>,
	): Promise<ResultType> | never {
		if (response?.id && payload.id !== response.id) {
			throw new InvalidResponseError<ErrorType>(response);
		}

		if (response?.error) {
			throw new InvalidResponseError<ErrorType>(response);
		}

		return response.result;
	}

	private _requestToPayload<T>({ method, params }: JsonRpcRequest<T>): JsonRpcPayload<T> {
		return {
			jsonrpc: '2.0',
			id: this._nextRequestId(),
			method,
			params,
		};
	}

	private _nextRequestId(): number {
		this._requestCounter += 1;

		return this._requestCounter;
	}
}
