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
import { InvalidResponseError, ProviderError, ResponseError } from 'web3-errors';
import HttpProvider from 'web3-providers-http';
import IpcProvider from 'web3-providers-ipc';
import WSProvider from 'web3-providers-ws';
import {
	EthExecutionAPI,
	JsonRpcBatchRequest,
	JsonRpcBatchResponse,
	JsonRpcPayload,
	JsonRpcResponse,
	SupportedProviders,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIRequest,
	Web3APIReturnType,
	Web3APISpec,
	Web3BaseProvider,
	Web3BaseProviderConstructor,
} from 'web3-types';
import { isNullish, jsonRpc } from 'web3-utils';
import {
	isEIP1193Provider,
	isLegacyRequestProvider,
	isLegacySendAsyncProvider,
	isLegacySendProvider,
	isWeb3Provider,
} from './utils';
import { Web3EventEmitter } from './web3_event_emitter';

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
	[key in Web3RequestManagerEvent]: SupportedProviders<API> | undefined;
}> {
	private _provider?: SupportedProviders<API>;

	public constructor(provider?: SupportedProviders<API> | string, net?: Socket) {
		super();

		if (!isNullish(provider)) {
			this.setProvider(provider, net);
		}
	}

	public static get providers() {
		return availableProviders;
	}

	public get provider() {
		return this._provider;
	}

	// eslint-disable-next-line class-methods-use-this
	public get providers() {
		return availableProviders;
	}

	/**
	 * Use to set provider. Provider can be a provider instance or a string.
	 * To set IPC provider as a string please use the IPC socket file which name ends with .ipc
	 */
	public setProvider(provider?: SupportedProviders<API> | string, net?: Socket): boolean {
		let newProvider: SupportedProviders<API> | undefined;

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
			} else if (provider.toLowerCase().endsWith('.ipc')) {
				newProvider = new this.providers.IpcProvider<API>(provider);
			} else {
				throw new ProviderError(`Can't autodetect provider for "${provider}"`);
			}
		} else if (isNullish(provider)) {
			// In case want to unset the provider
			newProvider = undefined;
		} else {
			newProvider = provider as SupportedProviders<API>;
		}

		this.emit(Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE, this._provider);
		this._provider = newProvider;
		this.emit(Web3RequestManagerEvent.PROVIDER_CHANGED, this._provider);
		return true;
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

		if (isNullish(provider)) {
			throw new ProviderError(
				'Provider not available. Use `.setProvider` or `.provider=` to initialize the provider.',
			);
		}

		const payload = jsonRpc.isBatchRequest(request)
			? jsonRpc.toBatchPayload(request)
			: jsonRpc.toPayload(request);

		if (isWeb3Provider(provider)) {
			let response;

			try {
				response = await provider.request<Method, ResponseType>(
					payload as Web3APIPayload<API, Method>,
				);
			} catch (error) {
				// Check if the provider throw an error instead of reject with error
				response = error as JsonRpcResponse<ResponseType>;
			}

			return this._processJsonRpcResponse(payload, response, { legacy: false, error: false });
		}

		if (isEIP1193Provider(provider)) {
			return (provider as Web3BaseProvider<API>)
				.request<Method, ResponseType>(payload as Web3APIPayload<API, Method>)
				.then(res =>
					this._processJsonRpcResponse(payload, res, { legacy: true, error: false }),
				)
				.catch(error =>
					this._processJsonRpcResponse(
						payload,
						error as JsonRpcResponse<ResponseType, unknown>,
						{ legacy: true, error: true },
					),
				);
		}

		// TODO: This should be deprecated and removed.
		if (isLegacyRequestProvider(provider)) {
			return new Promise<JsonRpcResponse<ResponseType>>((resolve, reject): void => {
				provider.request<ResponseType>(payload, (err, response) => {
					if (err) {
						return reject(
							this._processJsonRpcResponse(
								payload,
								err as unknown as JsonRpcResponse<ResponseType>,
								{
									legacy: true,
									error: true,
								},
							),
						);
					}

					return resolve(
						this._processJsonRpcResponse(payload, response, {
							legacy: true,
							error: false,
						}),
					);
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendProvider(provider)) {
			return new Promise<JsonRpcResponse<ResponseType>>((resolve, reject): void => {
				provider.send<ResponseType>(payload, (err, response) => {
					if (err) {
						return reject(
							this._processJsonRpcResponse(
								payload,
								err as unknown as JsonRpcResponse<ResponseType>,
								{
									legacy: true,
									error: true,
								},
							),
						);
					}

					if (isNullish(response)) {
						throw new ResponseError(
							'' as never,
							'Got a "nullish" response from provider.',
						);
					}

					return resolve(
						this._processJsonRpcResponse(payload, response, {
							legacy: true,
							error: false,
						}),
					);
				});
			});
		}

		// TODO: This should be deprecated and removed.
		if (isLegacySendAsyncProvider(provider)) {
			return provider
				.sendAsync<ResponseType>(payload)
				.then(response =>
					this._processJsonRpcResponse(payload, response, { legacy: true, error: false }),
				)
				.catch(error =>
					this._processJsonRpcResponse(payload, error as JsonRpcResponse<ResponseType>, {
						legacy: true,
						error: true,
					}),
				);
		}

		throw new ProviderError('Provider does not have a request or send method to use.');
	}

	// eslint-disable-next-line class-methods-use-this
	private _processJsonRpcResponse<ResultType, ErrorType, RequestType>(
		payload: JsonRpcPayload<RequestType>,
		response: JsonRpcResponse<ResultType, ErrorType>,
		{ legacy, error }: { legacy: boolean; error: boolean },
	): JsonRpcResponse<ResultType> | never {
		if (isNullish(response)) {
			return this._buildResponse(
				payload,
				// Some providers uses "null" as valid empty response
				// eslint-disable-next-line no-null/no-null
				null as unknown as JsonRpcResponse<ResultType, ErrorType>,
				error,
			);
		}

		// This is the majority of the cases so check these first
		// A valid JSON-RPC response with error object
		if (jsonRpc.isResponseWithError<ErrorType>(response)) {
			throw new InvalidResponseError<ErrorType>(response);
		}

		// This is the majority of the cases so check these first
		// A valid JSON-RPC response with result object
		if (jsonRpc.isResponseWithResult<ResultType>(response)) {
			return response;
		}

		if ((response as unknown) instanceof Error) {
			throw response;
		}

		if (!legacy && jsonRpc.isBatchRequest(payload) && jsonRpc.isBatchResponse(response)) {
			return response as JsonRpcBatchResponse<ResultType>;
		}

		if (legacy && !error && jsonRpc.isBatchRequest(payload)) {
			return response as JsonRpcBatchResponse<ResultType>;
		}

		if (legacy && error && jsonRpc.isBatchRequest(payload)) {
			// In case of error batch response we don't want to throw Invalid response
			throw response;
		}

		if (
			legacy &&
			!jsonRpc.isResponseWithError(response) &&
			!jsonRpc.isResponseWithResult(response)
		) {
			return this._buildResponse(payload, response, error);
		}

		if (jsonRpc.isBatchRequest(payload) && !Array.isArray(response)) {
			throw new ResponseError(response, 'Got normal response for a batch request.');
		}

		if (!jsonRpc.isBatchRequest(payload) && Array.isArray(response)) {
			throw new ResponseError(response, 'Got batch response for a normal request.');
		}

		if (
			(jsonRpc.isResponseWithError(response) || jsonRpc.isResponseWithResult(response)) &&
			!jsonRpc.isBatchRequest(payload)
		) {
			if (response.id && payload.id !== response.id) {
				throw new InvalidResponseError<ErrorType>(response);
			}
		}

		throw new ResponseError(response, 'Invalid response');
	}

	// Need to use same types as _processJsonRpcResponse so have to declare as instance method
	// eslint-disable-next-line class-methods-use-this
	private _buildResponse<ResultType, ErrorType, RequestType>(
		payload: JsonRpcPayload<RequestType>,
		response: JsonRpcResponse<ResultType, ErrorType>,
		error: boolean,
	): JsonRpcResponse<ResultType> {
		const res = {
			jsonrpc: '2.0',
			// eslint-disable-next-line no-nested-ternary
			id: jsonRpc.isBatchRequest(payload)
				? payload[0].id
				: 'id' in payload
				? payload.id
				: // Have to use the null here explicitly
				  // eslint-disable-next-line no-null/no-null
				  null,
		};

		if (error) {
			return {
				...res,
				error: response as unknown,
			} as JsonRpcResponse<ResultType>;
		}

		return {
			...res,
			result: response as unknown,
		} as JsonRpcResponse<ResultType>;
	}
}
