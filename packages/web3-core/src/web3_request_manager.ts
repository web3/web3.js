/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Socket } from 'net';
import {
	EthExecutionAPI,
	InvalidResponseError,
	jsonRpc,
	JsonRpcBatchRequest,
	JsonRpcBatchResponse,
	JsonRpcPayload,
	JsonRpcResponse,
	ProviderError,
	ResponseError,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIRequest,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3EventEmitter,
} from 'web3-common';
import HttpProvider from 'web3-providers-http';
import WSProvider from 'web3-providers-ws';
import IpcProvider from 'web3-providers-ipc';
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

const availableProviders = {
	HttpProvider: HttpProvider as Web3BaseProviderConstructor,
	WebsocketProvider: WSProvider as Web3BaseProviderConstructor,
	IpcProvider: IpcProvider as Web3BaseProviderConstructor,
};

export class Web3RequestManager<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3EventEmitter<{
	[key in Web3RequestManagerEvent]: SupportedProviders<API>;
}> {
	private _provider!: SupportedProviders<API>;

	public constructor(provider?: SupportedProviders<API>, net?: Socket) {
		super();

		if (provider) {
			this.setProvider(provider, net);
		}
	}

	public static get providers() {
		return availableProviders;
	}

	public get provider() {
		if (!this._provider) {
			throw new ProviderError('Provider not available');
		}

		return this._provider;
	}

	// eslint-disable-next-line class-methods-use-this
	public get providers() {
		return availableProviders;
	}

	public setProvider(provider: SupportedProviders<API>, net?: Socket) {
		let newProvider!: Web3BaseProvider<API>;

		// autodetect provider
		if (provider && typeof provider === 'string' && this.providers) {
			// HTTP
			if (/^http(s)?:\/\//i.test(provider)) {
				newProvider = new this.providers.HttpProvider<API>(provider);

				// WS
			} else if (/^ws(s)?:\/\//i.test(provider)) {
				newProvider = new this.providers.WebsocketProvider<API>(provider);

				// IPC
			} else if (typeof net === 'object' && typeof net.connect === 'function') {
				newProvider = new this.providers.IpcProvider<API>(provider, net);
			} else {
				throw new ProviderError(`Can't autodetect provider for "${provider}'"`);
			}
		}

		this.emit(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, this._provider);
		this._provider = newProvider ?? provider ?? null;
		this.emit(Web3RequestManagerEvent.PROVIDER_CHANGED, this._provider);
	}

	public async send<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(request: Web3APIRequest<API, Method>): Promise<ResponseType> {
		const response = await this._sendRequest<Method, ResponseType>(request);

		if (jsonRpc.isResponseWithResult(response)) {
			return response.result;
		}

		throw new ResponseError(response);
	}

	public async sendBatch(request: JsonRpcBatchRequest): Promise<JsonRpcBatchResponse<unknown>> {
		const response = await this._sendRequest<never, never>(request);

		return response as JsonRpcBatchResponse<unknown>;
	}

	private async _sendRequest<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(
		request: Web3APIRequest<API, Method> | JsonRpcBatchRequest,
	): Promise<JsonRpcResponse<ResponseType>> {
		const { provider } = this;

		const payload = jsonRpc.isBatchRequest(request)
			? jsonRpc.toBatchPayload(request)
			: jsonRpc.toPayload(request);

		if (isWeb3Provider(provider)) {
			const response = await provider.request<Method, ResponseType>(
				payload as Web3APIPayload<API, Method>,
			);

			return this._processJsonRpcResponse(payload, response);
		}

		// TODO: This should be deprecated and removed.
		if (isLegacyRequestProvider(provider)) {
			return new Promise<JsonRpcResponse<ResponseType>>((resolve): void => {
				provider.request<ResponseType>(payload, (err, response) => {
					if (err) {
						throw err;
					}

					return resolve(this._processJsonRpcResponse(payload, response));
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendProvider(provider)) {
			return new Promise<JsonRpcResponse<ResponseType>>((resolve): void => {
				provider.send<ResponseType>(payload, (err, response) => {
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
				.sendAsync<ResponseType>(payload)
				.then(response => this._processJsonRpcResponse(payload, response));
		}

		throw new ProviderError('Provider does not have a request or send method to use.');
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
