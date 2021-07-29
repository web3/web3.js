import { altair, phase0 } from '@chainsafe/lodestar-types';

export interface Web3EthOptions {
    packageName?: string;
    providerUrl: string;
}

export type PrefixedHexString = string;
export type StateId = string | 'head' | 'genesis' | 'finalized' | 'justified';
export type BlockId = string | 'head' | 'gensis' | 'finalized';
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

export type Slot = phase0.Slot;
export type ValidatorIndex = phase0.ValidatorIndex;
export type AttestationData = phase0.AttestationData;
export type AttesterSlashing = phase0.AttesterSlashing;
export type ProposerSlashing = phase0.ProposerSlashing;
export type SyncCommittee = altair.SyncCommittee;
export type SignedVoluntaryExit = altair.SignedVoluntaryExit;
export type status = phase0.Status;
export type BeaconBlock = phase0.BeaconBlock;
