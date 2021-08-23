import { altair, phase0 } from '@chainsafe/lodestar-types';
import { ValidTypesEnum } from 'web3-utils/lib/types';

export interface Web3EthOptions {
    web3Client: string;
    returnType?: ValidTypesEnum;
}

export enum StateId {
    head = 'head',
    genesis = 'genesis',
    finalized = 'finalized',
    justified = 'justified',
    PrefixedHexString = 'PrefixedHexString',
}

export enum Status {
    PendingInitialized = 'pending_initialized',
    Pending_queued = 'pending_queued',
    Active_ongoing = 'active_ongoing',
    Active_exiting = 'active_exiting',
    Active_slashed = 'active_slashed',
    Exited_unslashed = 'exited_unslashed',
    Exited_slashed = 'exited_slashed',
    Withdrawal_possible = 'withdrawal_possible',
    Withdrawal_done = 'withdrawal_done',
    Active = 'active',
    Pending = 'pending',
    Exited = 'exited',
    Withdrawal = 'withdrawal',
}

export type BlockId = 'head' | 'genesis' | 'finalized' | string;
export type AttestationData = phase0.AttestationData;
export type AttesterSlashing = phase0.AttesterSlashing;
export type ProposerSlashing = phase0.ProposerSlashing;
export type SyncCommittee = altair.SyncCommittee;
export type SignedVoluntaryExit = altair.SignedVoluntaryExit;
export type BeaconBlock = phase0.BeaconBlock;
