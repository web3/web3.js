import { HttpRpcResponse } from 'web3-providers-http/types';

export interface Web3EthOptions {
    packageName?: string;
    providerUrl: string;
}

export interface EthStringResult extends HttpRpcResponse {
    result: string;
}

export type PrefixedHexString = string;
export type Slot = number;
export type StateId =
    | 'head'
    | 'genesis'
    | 'finalized'
    | 'justified'
    | Slot
    | PrefixedHexString;
export type Status =
    | 'pending_initialized'
    | 'pending_queued'
    | 'active_ongoing'
    | 'active_exiting'
    | 'active_slashed'
    | 'exited_unslashed'
    | 'exited_slashed'
    | 'withdrawal_possible'
    | 'withdrawal_done';
