import { altair, phase0 } from '@chainsafe/lodestar-types';
import {
    PrefixedHexString,
    ValidTypesEnum,
} from 'web3-utils/lib/types';

export interface Web3EthOptions {
    web3Client: string;
    returnType?: ValidTypesEnum;
}

export type StateId =
    | 'head'
    | 'genesis'
    | 'finalized'
    | 'justified'
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

export type BlockId = 'head' | 'genesis' | 'finalized' | string;
export type AttestationData = phase0.AttestationData;
export type AttesterSlashing = phase0.AttesterSlashing;
export type ProposerSlashing = phase0.ProposerSlashing;
export type SyncCommittee = altair.SyncCommittee;
export type SignedVoluntaryExit = altair.SignedVoluntaryExit;
export type BeaconBlock = phase0.BeaconBlock;
