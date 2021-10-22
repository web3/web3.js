import { OutgoingHttpHeaders } from 'http';
import { JsonRpcPayload, JsonRpcResponse } from 'web3-common';
import { IClientConfig } from 'websocket';
import { DeferredPromise } from './deferredPromise';

export type ReconnectOptions = {
	auto: boolean;
	delay: number;
	maxAttempts: number;
	onTimeout: boolean;
};

export interface WebSocketOptions {
	protocol?: string;
	headers?: OutgoingHttpHeaders;
	/* eslint-disable @typescript-eslint/ban-types */
	requestOptions?: Object;
	clientConfig?: IClientConfig;
	customTimeout: number;
	reconnectOptions?: ReconnectOptions;
	timeout?: number;
	reconnectDelay?: number;
	origin?: string;
}

export interface WSRequestItem<T = unknown[], T2 = JsonRpcResponse> {
	payload: JsonRpcPayload<T>;
	deferredPromise: DeferredPromise<T2>;
}
