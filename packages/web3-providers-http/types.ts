import { AxiosRequestConfig } from 'axios';
import { RpcOptions, SubscriptionResponse } from 'web3-providers-base/types';

export interface HttpOptions {
    axiosConfig?: AxiosRequestConfig;
    subscriptionOptions?: SubscriptionOptions;
}

export interface SubscriptionOptions {
    milisecondsBetweenRequests?: number;
}
