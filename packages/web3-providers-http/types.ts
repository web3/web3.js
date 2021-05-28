import { AxiosRequestConfig } from 'axios';
import { RpcOptions } from 'web3-providers-base/types';

export type HttpOptions = AxiosRequestConfig;

export interface SubscriptionOptions extends RpcOptions {
    milisecondsBetweenRequests?: number;
}
