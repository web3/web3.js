import { JsonRpcRequest, JsonRpcResponse } from 'web3-common';
import { DeferredPromise } from './deferred_promise';

export type ReconnectOptions = {
	autoReconnect: boolean;
	delay: number;
	maxAttempts: number;
};

export interface WSRequestItem<T = unknown[], T2 = JsonRpcResponse> {
	payload: JsonRpcRequest<T>;
	deferredPromise: DeferredPromise<T2>;
}
