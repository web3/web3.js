import { InvalidResponseError, JsonRpcPayload, JsonRpcResponseWithError, JsonRpcResponseWithResult, JsonRpcResult, Web3BaseProvider, MethodNotImplementedError, JsonRpcResponse, Web3BaseProviderStatus } from 'web3-common';

import { HttpProviderOptions } from './types';

export class HttpProvider extends Web3BaseProvider {
    private readonly clientUrl: string;
    private readonly httpProviderOptions: HttpProviderOptions | undefined;

    public constructor(clientUrl: string, httpProviderOptions?: HttpProviderOptions) {
        super();
        // TODO replace error
        if (!HttpProvider._validateClientUrl(clientUrl)) throw Error('Invalid client url');
        this.clientUrl = clientUrl;
        this.httpProviderOptions = httpProviderOptions;
    }

    public send<T = JsonRpcResult, T2 = unknown[], T3 = RequestInit>(
        payload: JsonRpcPayload<T2>,
        callback: (
            error?: JsonRpcResponseWithError<T>,
			result?: JsonRpcResponseWithResult<T>
        ) => void,
        providerOptions?: T3,
    ): void {
        this.request<T, T2, T3>(payload, providerOptions)
            .then(d =>
                callback(undefined, { result: d, id: payload.id ?? 0, jsonrpc: payload.jsonrpc ?? '2.0' })
            )
            .catch(e => callback(e, undefined));
    }

    public getStatus(): Web3BaseProviderStatus {
        throw new MethodNotImplementedError();
    }

    public supportsSubscriptions() {
        return false
    }

    public async request<T = JsonRpcResponse, T2 = unknown[], T3 = RequestInit>(request: JsonRpcPayload<T2>, providerOptions?: T3): Promise<T> {
        const providerOptionsCombined = {
            ...this.httpProviderOptions?.providerOptions,
            ...providerOptions
        };
        const response = await fetch(
            this.clientUrl,
            {
                ...providerOptionsCombined,
                method: 'POST',
                headers: {
                    ...providerOptionsCombined.headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: request.id ?? Math.floor(Math.random() * 999999), // Generate random integer between 0 and 999,999
                    jsonrpc: request.jsonrpc ?? '2.0',
                    method: request.method,
                    params: request.params ?? []
                })
            }
        );

        if(!response.ok) throw new InvalidResponseError(await response.json() as T)

        return await response.json() as T
    }

    public on() {
        throw new MethodNotImplementedError();
    }

    public removeListener() {
        throw new MethodNotImplementedError();
    }

    public once() {
        throw new MethodNotImplementedError();
    }

    public removeAllListeners() {
        throw new MethodNotImplementedError();
    }

    public connect() {
        throw new MethodNotImplementedError();
    }

    public disconnect() {
        throw new MethodNotImplementedError();
    }

    public reset() {
        throw new MethodNotImplementedError();
    }

    public reconnect() {
        throw new MethodNotImplementedError();
    }

    private static _validateClientUrl(clientUrl: string): boolean {
        try {
            return typeof clientUrl === 'string'
                ? /^http(s)?:\/\//i.test(clientUrl)
                : false;
        } catch (e) {
            // TODO replace
            throw Error(`Failed to validate client url: ${(e as Error).message}`);
        }
    }
}
