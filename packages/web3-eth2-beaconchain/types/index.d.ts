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

export interface IETH2BeaconChain {
  getGenesis(): Promise<Genesis | null>
  getHashRoot(stateId: StateId): Promise<{ root: Root }>
  getForkData(stateId: StateId): Promise<Fork>
  getFinalityCheckpoint(stateId: StateId): Promise<FinalityCheckpoints>
  getValidators(stateId: StateId): Promise<Validator[]>
  getValidatorById(stateId: StateId, validatorId: string): Promise<ValidatorResponse>
  getValidatorBalances(stateId: StateId): Promise<ValidatorBalance>
  getEpochCommittees(stateId: StateId, epoch: Epoch): Promise<BeaconCommitteeResponse>
  getBlockHeaders(): Promise<SignedBeaconHeaderResponse[]>
  getBlockHeader(blockId: BlockId): Promise<SignedBeaconHeaderResponse>
  publishSignedBlock(): Promise<void>
  getBlock(blockId: BlockId): Promise<SignedBeaconHeaderResponse>
  getBlockRoot(blockId: BlockId): Promise<Root>
  getBlockAttestations(blockId: BlockId): Promise<Attestation>
  getAttestationsFromPool(slot: Slot, committee_index: CommitteeIndex): Promise<Attestation[]>
  submitAttestation(): Promise<void>
  getAttesterSlashings(): Promise<{ [index: string]: IndexedAttestation }>
  submitAttesterSlashings(): Promise<void>
  getProposerSlashings(): Promise<ProposerSlashing[]>
  submitProposerSlashings(): Promise<void>
  getSignedVoluntaryExits(): Promise<SignedVoluntaryExit[]>
  submitVoluntaryExit(): Promise<void>
}
