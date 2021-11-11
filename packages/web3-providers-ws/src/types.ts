import { Web3APIMethod, Web3APIPayload, Web3APISpec } from 'web3-common';
import { DeferredPromise } from './deferred_promise';

export type ReconnectOptions = {
	autoReconnect: boolean;
	delay: number;
	maxAttempts: number;
};

export interface WSRequestItem<
	API extends Web3APISpec,
	Method extends Web3APIMethod<API>,
	ResponseType,
> {
	payload: Web3APIPayload<API, Method>;
	deferredPromise: DeferredPromise<ResponseType>;
}
