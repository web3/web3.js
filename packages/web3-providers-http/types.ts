import { AxiosRequestConfig } from 'axios';
import { RpcOptions } from 'web3-providers-base/types';

export interface HttpOptions {
    axiosConfig?: AxiosRequestConfig;
    milisecondsBetweenRequests?: number;
}

export interface SubscriptionOptions extends RpcOptions {
    milisecondsBetweenRequests?: number;
}
