import {
	ResponseError,
	Web3BaseProvider,
	MethodNotImplementedError,
	JsonRpcResponse,
	Web3BaseProviderStatus,
	InvalidClientError,
	SupportedProtocolsEnum,
	JsonRpcRequest,
	JsonRpcResponseData,
	ExecutionJsonRpcResponse,
	JsonRpcResponseError,
	ConsensusJsonRpcRequest,
	ExecutionJsonRpcRequest,
	ConsensusJsonRpcResponse,
} from 'web3-common';
import fetch from 'cross-fetch';

import { HttpProviderOptions } from './types';

export class HttpProvider extends Web3BaseProvider {
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

	// T = type of params (for Execution requests) or requestBody (for Consensus requests)
	public send<T = unknown, T2 = JsonRpcResponseData>(
		payload: JsonRpcRequest<T>,
		callback: (error?: JsonRpcResponseError, result?: JsonRpcResponse<T2>) => void,
		providerOptions?: RequestInit,
	): void {
		this.request<T, T2>(payload, providerOptions)
			.then(d => callback(undefined, d))
			.catch(e => callback(e, undefined));
	}

	/* eslint-disable class-methods-use-this */
	public getStatus(): Web3BaseProviderStatus {
		throw new MethodNotImplementedError();
	}

	/* eslint-disable class-methods-use-this */
	public supportsSubscriptions() {
		return false;
	}

	// T = type of params (for Execution requests) or requestBody (for Consensus requests)
	public async request<T = unknown, T2 = JsonRpcResponseData>(
		request: JsonRpcRequest<T>,
		providerOptions?: RequestInit,
	): Promise<JsonRpcResponse<T2>> {
		const providerOptionsCombined = {
			...this.httpProviderOptions?.providerOptions,
			...providerOptions,
		};

		if (request?.protocol === SupportedProtocolsEnum.CONSENSUS) {
			return this.consensusRequest<T, T2>(request, providerOptionsCombined);
		}

		return this.executionRequest<T, T2>(request, providerOptionsCombined);
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

	// T = type of params
	private async executionRequest<T = unknown[], T2 = JsonRpcResponseData>(
		request: ExecutionJsonRpcRequest<T>,
		providerOptions: RequestInit,
	): Promise<ExecutionJsonRpcResponse<T2>> {
		const response = await fetch(this.clientUrl, {
			...providerOptions,
			method: 'POST',
			headers: {
				...providerOptions.headers,
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

		return (await response.json()) as ExecutionJsonRpcResponse<T2>;
	}

	// T = type of requestBody
	private async consensusRequest<T = unknown, T2 = JsonRpcResponseData>(
		request: ConsensusJsonRpcRequest<T>,
		providerOptions: RequestInit,
	): Promise<ConsensusJsonRpcResponse<T2>> {
		const response = await fetch(`${this.clientUrl}${request.endpoint}`, {
			...providerOptions,
			method: providerOptions.method ?? 'GET',
			headers: {
				...providerOptions.headers,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request.requestBody) ?? undefined,
		});

		if (!response.ok) throw new ResponseError(await response.json());

		return (await response.json()) as ConsensusJsonRpcResponse<T2>;
	}
}
