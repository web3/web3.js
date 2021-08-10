import { altair, phase0 } from '@chainsafe/lodestar-types';
import {
    PrefixedHexString,
    ValidTypes,
    ValidTypesEnum,
} from 'web3-utils/lib/types';

/**
 * @param gas eth_call consumes zero gas, but this parameter may be needed by some executions
 */
export type EthCallTransaction = {
    from: PrefixedHexString;
    to: PrefixedHexString;
    gas?: ValidTypes;
    gasPrice?: ValidTypes;
    value?: ValidTypes;
    data?: PrefixedHexString;
};

export interface Web3EthOptions {
    web3Client: string;
    returnType?: ValidTypesEnum;
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

export type AttestationData = phase0.AttestationData;
export type AttesterSlashing = phase0.AttesterSlashing;
export type ProposerSlashing = phase0.ProposerSlashing;
export type SyncCommittee = altair.SyncCommittee;
export type SignedVoluntaryExit = altair.SignedVoluntaryExit;
