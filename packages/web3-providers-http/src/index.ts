import {
	ResponseError,
	Web3BaseProvider,
	MethodNotImplementedError,
	JsonRpcResponse,
	Web3BaseProviderStatus,
	InvalidClientError,
	EthExecutionAPI,
	Web3APISpec,
	Web3APIReturnType,
	Web3APIPayload,
	Web3APIMethod,
} from 'web3-common';
import fetch from 'cross-fetch';

import { HttpProviderOptions } from './types';

export class HttpProvider<API extends Web3APISpec = EthExecutionAPI> extends Web3BaseProvider<API> {
	private readonly clientUrl: string;
	private readonly httpProviderOptions: HttpProviderOptions | undefined;

	public constructor(clientUrl: string, httpProviderOptions?: HttpProviderOptions) {
		super();
		if (!HttpProvider.validateClientUrl(clientUrl)) throw new InvalidClientError(clientUrl);
		this.clientUrl = clientUrl;
		this.httpProviderOptions = httpProviderOptions;
	}

	private static validateClientUrl(clientUrl: string): boolean {
		return typeof clientUrl === 'string' ? /^http(s)?:\/\//i.test(clientUrl) : false;
	}

	/* eslint-disable class-methods-use-this */
	public getStatus(): Web3BaseProviderStatus {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions() {
		return false;
	}

	public async request<
		Method extends Web3APIMethod<API>,
		ResponseType = Web3APIReturnType<API, Method>,
	>(
		request: Web3APIPayload<API, Method>,
		requestOptions?: RequestInit,
	): Promise<JsonRpcResponse<ResponseType>> {
		const providerOptionsCombined = {
			...this.httpProviderOptions?.providerOptions,
			...requestOptions,
		};
		const response = await fetch(this.clientUrl, {
			...providerOptionsCombined,
			method: 'POST',
			headers: {
				...providerOptionsCombined.headers,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: request.id ?? Math.floor(Math.random() * 999999), // Generate random integer between 0 and 999,999
				jsonrpc: request.jsonrpc ?? '2.0',
				method: request.method,
				params: request.params ?? [],
			}),
		});

		if (!response.ok) throw new ResponseError(await response.json());

		return (await response.json()) as JsonRpcResponse<ResponseType>;
	}

	/* eslint-disable class-methods-use-this */
	public on() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public removeListener() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public once() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public removeAllListeners() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public connect() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public disconnect() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public reset() {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public reconnect() {
		throw new MethodNotImplementedError();
	}
}
