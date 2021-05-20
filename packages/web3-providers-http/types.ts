import { BaseRpcOptions } from 'web3-providers-base/types';

export interface SubscriptionOptions extends BaseRpcOptions {
    milisecondsBetweenRequests?: number;
}
