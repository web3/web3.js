import { AxiosRequestConfig } from 'axios';

export interface HttpOptions {
    axiosConfig?: AxiosRequestConfig;
    subscriptionOptions?: SubscriptionOptions;
}

export interface SubscriptionOptions {
    milisecondsBetweenRequests?: number;
}
