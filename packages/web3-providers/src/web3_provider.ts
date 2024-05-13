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

import HttpProvider from "web3-providers-http";
import WebSocketProvider from "web3-providers-ws";
import {
    EthExecutionAPI, JsonRpcResult, ProviderConnectInfo, ProviderMessage,
    ProviderRpcError, Web3APIMethod, Web3APIPayload, Web3APIReturnType, Web3APISpec, Web3BaseProvider,
    Web3Eip1193ProviderEventCallback,
    Web3ProviderEventCallback,
    Web3ProviderMessageEventCallback,
    Web3ProviderStatus
} from "web3-types";
import { Eip1193Provider } from "web3-utils";
import { Transport, Network } from "./types.js";

export abstract class Web3ExternalProvider <
API extends Web3APISpec = EthExecutionAPI,
> extends Eip1193Provider {

    provider!: Web3BaseProvider;
    private readonly transport: Transport;

    public abstract getRPCURL(network: Network,transport: Transport,token: string): string;

    constructor(
        network: Network,
        transport: Transport,
        token: string) {
            
        super();

        this.transport = transport;
        if (transport === Transport.HTTPS) {
            this.provider = new HttpProvider(this.getRPCURL(network, transport, token));
        }
        else if (transport === Transport.WebSocket) {
            this.provider = new WebSocketProvider(this.getRPCURL(network, transport, token));
        }
    }

    public async request<
        Method extends Web3APIMethod<API>,
        ResultType = Web3APIReturnType<API, Method>,
    >(
        payload: Web3APIPayload<EthExecutionAPI, Method>,
        requestOptions?: RequestInit,
    ): Promise<ResultType> {

        if (this.transport === Transport.HTTPS) {
            return ( (this.provider as HttpProvider).request(payload, requestOptions)) as any;// .result as Promise<ResultType>;
        }
        
            return ( (this.provider as WebSocketProvider).request(payload)) as any;// .result as Promise<ResultType>;
        
    }

    getStatus(): Web3ProviderStatus {
        return this.provider.getStatus();
    }
    supportsSubscriptions(): boolean {
        return this.provider.supportsSubscriptions();
    }
    once(type: "disconnect", listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>): void;
    once<T = JsonRpcResult>(type: string, listener: Web3Eip1193ProviderEventCallback<ProviderMessage> | Web3ProviderEventCallback<T>): void;
    once(type: "connect", listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>): void;
    once(type: "chainChanged", listener: Web3Eip1193ProviderEventCallback<string>): void;
    once(type: "accountsChanged", listener: Web3Eip1193ProviderEventCallback<string[]>): void;
    once(_type: string, _listener: unknown): void {
        if (this.provider && this.provider.once)
            this.provider.once(_type, _listener as any);
    }
    removeAllListeners?(_type: string): void {
        if (this.provider && this.provider.removeAllListeners)
            this.provider.removeAllListeners(_type);
    }
    connect(): void {
        if (this.provider && this.provider.connect)
            this.provider.connect();
    }
    disconnect(_code?: number | undefined, _data?: string | undefined): void {
        if (this.provider && this.provider.disconnect)
            this.provider.disconnect(_code, _data);
    }
    reset(): void {
        if (this.provider && this.provider.reset)
            this.provider.reset();
    }

    on(type: "disconnect", listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>): void;
    on<T = JsonRpcResult>(type: string, listener: Web3Eip1193ProviderEventCallback<ProviderMessage> | Web3ProviderMessageEventCallback<T>): void;
    on<T = JsonRpcResult>(type: string, listener: Web3Eip1193ProviderEventCallback<ProviderMessage> | Web3ProviderMessageEventCallback<T>): void;
    on(type: "connect", listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>): void;
    on(type: "chainChanged", listener: Web3Eip1193ProviderEventCallback<string>): void;
    on(type: "accountsChanged", listener: Web3Eip1193ProviderEventCallback<string[]>): void;
    on(_type: unknown, _listener: unknown): void {
        if (this.provider)
            this.provider.on(_type as any, _listener as any);
    }
    removeListener(type: "disconnect", listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>): void;
    removeListener<T = JsonRpcResult>(type: string, listener: Web3Eip1193ProviderEventCallback<ProviderMessage> | Web3ProviderEventCallback<T>): void;
    removeListener(type: "connect", listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>): void;
    removeListener(type: "chainChanged", listener: Web3Eip1193ProviderEventCallback<string>): void;
    removeListener(type: "accountsChanged", listener: Web3Eip1193ProviderEventCallback<string[]>): void;
    removeListener(_type: unknown, _listener: unknown): void {
        if (this.provider)
            this.provider.removeListener(_type as any, _listener as any);
    }
}