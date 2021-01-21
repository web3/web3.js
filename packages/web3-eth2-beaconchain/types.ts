import {
    Slot,
    Root,
    Genesis,
    Fork,
    FinalityCheckpoints,
    Validator,
    ValidatorResponse,
    ValidatorBalance,
    Epoch,
    BeaconCommitteeResponse,
    SignedBeaconHeaderResponse,
    Attestation,
    CommitteeIndex,
    IndexedAttestation,
    ProposerSlashing,
    SignedVoluntaryExit
  } from '@chainsafe/lodestar-types'
  
  export type StateId = 'head' | 'genesis' | 'finalized' | 'justified' | Slot | Root
  export type BlockId = 'head' | 'genesis' | 'finalized' | Slot | Root
  
  export interface ETH2BeaconChain {
    getGenesis(): Promise<Genesis | null>
    getHashRoot(params: {stateId: StateId}): Promise<{ root: Root }>
    getForkData(params: {stateId: StateId}): Promise<Fork>
    getFinalityCheckpoint(params: {stateId: StateId}): Promise<FinalityCheckpoints>
    getValidators(params: {stateId: StateId}): Promise<Validator[]>
    getValidatorById(params: {stateId: StateId, validatorId: string}): Promise<ValidatorResponse>
    getValidatorBalances(params: {stateId: StateId}): Promise<ValidatorBalance>
    getEpochCommittees(params: {stateId: StateId, epoch: Epoch}): Promise<BeaconCommitteeResponse>
    getBlockHeaders(): Promise<SignedBeaconHeaderResponse[]>
    getBlockHeader(params: {blockId: BlockId}): Promise<SignedBeaconHeaderResponse>
    publishSignedBlock(): Promise<void>
    getBlock(params: {blockId: BlockId}): Promise<SignedBeaconHeaderResponse>
    getBlockRoot(params: {blockId: BlockId}): Promise<Root>
    getBlockAttestations(params: {blockId: BlockId}): Promise<Attestation>
    getAttestationsFromPool(params: {slot: Slot, committee_index: CommitteeIndex}): Promise<Attestation[]>
    submitAttestation(): Promise<void>
    getAttesterSlashings(): Promise<{ [index: string]: IndexedAttestation }>
    submitAttesterSlashings(): Promise<void>
    getProposerSlashings(): Promise<ProposerSlashing[]>
    submitProposerSlashings(): Promise<void>
    getSignedVoluntaryExits(): Promise<SignedVoluntaryExit[]>
    submitVoluntaryExit(): Promise<void>
  }
  