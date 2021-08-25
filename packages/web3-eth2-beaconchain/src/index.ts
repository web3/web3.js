import initWeb3Provider from 'web3-core-provider';
import {
    StateId,
    Status,
    AttestationData,
    AttesterSlashing,
    Web3EthOptions,
    ProposerSlashing,
    SyncCommittee,
    SignedVoluntaryExit,
    BeaconBlock,
    BlockId,
} from './types';
import { Eth2RequestArguments, IWeb3Provider } from 'web3-core-types/lib/types';
import { ValidTypesEnum } from 'web3-utils/lib/types';

export default class Web3Beacon {
    private _defaultReturnType: ValidTypesEnum;

    provider: IWeb3Provider;

    constructor(options: Web3EthOptions) {
        this.provider = initWeb3Provider(options.web3Client) as IWeb3Provider;
        this._defaultReturnType =
            options.returnType || ValidTypesEnum.PrefixedHexString;
    }

    /**
     * Retrieve details of the chain's genesis which can be used to identify chain
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Genesis object
     */
    async getGenesis(
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: 'genesis',
            });
        } catch (error) {
            throw Error(`Error getting genesis: ${error.message}`);
        }
    }

    /**
     * Calculates HashTreeRoot for state with given stateId. If stateId is root, same value will be returned.
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot, hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} HashTreeRoot
     */

    async getStateRoot(
        stateId: StateId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/root`,
            });
        } catch (error) {
            throw Error(
                `Error getting state root from state Id: ${error.message}`
            );
        }
    }

    /**
     * Returns Fork object for state with given stateId.
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot, hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A fork object
     */

    async getStateFork(
        stateId: StateId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/fork`,
            });
        } catch (error) {
            throw Error(`Error getting state fork from Id: ${error.message}`);
        }
    }

    /**
     * Get finality checkpoints for state with given 'stateId'. In case finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot, hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Returns finality checkpoints for state with given 'stateId'. If finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root.
     */

    async getFinalityCheckpoints(
        stateId: StateId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/finality_checkpoints`,
            });
        } catch (error) {
            throw Error(`Error getting finality checkpoints: ${error.message}`);
        }
    }

    /**
     * Get a list of validators from state
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot or hex string encoded stateRoot with 0x prefix.
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @param {string[]} id (Optional) Array of ids, Either a hex string encoded public key (with 0x prefix) or validator index
     * @param {Status} status (Optional) Validator status specification https://hackmd.io/ofFJ5gOmQpu1jjHilHbdQQ
     * @returns {Promise} Array of the validators specified with balance, status and index
     */

    async getValidators(
        stateId: StateId,
        id?: string[],
        status?: Status[],
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/validators`,
                params: { id, status },
            });
        } catch (error) {
            throw Error(`Error getting validators: ${error.message}`);
        }
    }

    /**
     * Get validator from state by id
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot, hex string encoded stateRoot with 0x prefix
     * @param {string} validatorId Either hex string encoded public key or validator index
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} A validator specificied by state and id or public key along with status and balance
     */

    async getValidatorById(
        stateId: StateId,
        validatorId: string,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/validators/${validatorId}`,
            });
        } catch (error) {
            throw Error(`Error getting validator by Id: ${error.message}`);
        }
    }

    /**
     * Get Validator states from state
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot or hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @param {string[]} id (Optional) Array of either hex string encoded public keys or validator index
     * @returns {Promise} Returns filterable array of validators with their balance, status and index.
     */

    async getValidatorBalances(
        stateId: StateId,
        id?: string[],
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/validator_balances`,
                params: { id },
            });
        } catch (error) {
            throw Error(`Error getting validator balance: ${error.message}`);
        }
    }

    /**
     * Get the committees for the given state
     * @param {StateId} stateId State identifier, can be "head", "genesis", "finalized", "justified", slot, or hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @param {string} epoch (Optional) A number
     * @param {string} index (Optional) committee index
     * @param {string} slot (Optional) A slot
     * @returns {Promise} Comittees
     */

    async getCommittees(
        stateId: string,
        epoch?: string,
        index?: string,
        slot?: string,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/committee`,
                params: { epoch, index, slot },
            });
        } catch (error) {
            throw Error(`Error getting Committees: ${error.message}`);
        }
    }

    /**
     * Get the sync committees for the given state.
     * @param {StateId} stateId State identifier Can be "head", "genesis", "finalized", "justified", slot, or hex string encoded stateRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @param {string} epoch a number
     * @returns {Promise} Sync committees
     */

    async getSyncCommittees(
        stateId: StateId,
        requestArguments?: Partial<Eth2RequestArguments>,
        epoch?: string
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `states/${stateId}/sync_committees`,
                params: { epoch },
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block headers matching given query. By default it will fetch current head slot blocks
     * @param {string} slot a number
     * @param {string} parentRoot parent root
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Block header
     */

    async getBlockHeaders(
        slot: string,
        parent_root: string,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: 'headers',
                params: { slot, parent_root },
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block header for given block id.
     * @param {BlockId} blockId Block identifier, can be "head", "genesis", "finalized", slot or hex string encoded blockRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Block header
     */

    async getBlockHeadersById(
        blockId: BlockId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `headers/${blockId}`,
            });
        } catch (error) {
            throw Error(`Error getting block header by id: ${error.message}`);
        }
    }

    /**
     * Publish a signed block.
     * Instructs the beacon node to broadcast a newly signed beacon block to the beacon network,
     * to be included in the beacon chain
     * @param {BeaconBlock} signedBeaconBlock Beacon Block
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async postBlock(
        signedBeaconBlock: BeaconBlock,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: 'blocks',
                params: { signedBeaconBlock },
                providerOptions: {
                    httpMethod: 'post',
                },
            });
        } catch (error) {
            throw Error(`Error publishing block: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {BlockId} blockId Block identifier, can be "head", "genesis", "finalized", slot or hex string encoded blockRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlock(
        blockId: BlockId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `blocks/${blockId}`,
            });
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Retrieves block root of beaconBlock
     * @param {BlockId} blockId Block identifier, can be "head", "genesis", "finalized", slot or hex string encoded blockRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Block Root
     */

    async getBlockRoot(
        blockId: BlockId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `blocks/${blockId}/root`,
            });
        } catch (error) {
            throw Error(`Error getting block root: ${error.message}`);
        }
    }

    /**
     * Retrieves attestation included in requested block.
     * @param {BlockId} blockId Block identifier, can be "head", "genesis", "finalized", slot or hex string encoded blockRoot with 0x prefix
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockAttestations(
        blockId: BlockId,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `blocks/${blockId}/attestations`,
            });
        } catch (error) {
            throw Error(`Error getting block attestations: ${error.message}`);
        }
    }

    /**
     *Get Attestations from operations pool
     @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @param {string} slot (Optional) a number
     * @param {string} (Optional) comitteeIndex
     * @returns {Promise} SignedBeaconBlock
     */

    async getPoolAttestations(
        slot?: String,
        comitteeIndex?: String,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: 'pool/attestations',
                params: { slot, comitteeIndex },
            });
        } catch (error) {
            throw Error(
                `Error getting attestations from pool: ${error.message}`
            );
        }
    }

    /**
     * Submit Attestation objects to node
     * @param {AttestationData} attestation
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async postPoolAttestations(
        attestation: AttestationData,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: '`pool/attestations`',
                params: attestation,
                providerOptions: {
                    httpMethod: 'post',
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get AttesterSlashings from operations pool
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Attester slashings
     */

    async getAttesterSlashings(
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/attester_slashings`,
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Post AttesterSlashings from operations pool
     * @param {AttesterSlashing} attesterSlashings (Optional)
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Attester slashings
     */

    async postAttesterSlashings(
        attesterSlashings: AttesterSlashing,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/attester_slashings`,
                providerOptions: {
                    httpMethod: 'post',
                },
                params: attesterSlashings,
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get ProposerSlashings from operations pool
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Proposer Slashings
     */

    async getProposerSlashings(
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/proposer_slashings`,
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit ProposerSlashing object to node's pool
     * @param {ProposerSlashing} proposerSlashings
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async postProposerSlashings(
        proposerSlashings: ProposerSlashing,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/proposer_slashings`,
                providerOptions: {
                    httpMethod: 'post',
                },
                params: proposerSlashings,
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit sync committee signatures to node
     * @param {SyncCommittee} syncCommittee
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async postSyncCommittees(
        syncCommittee: SyncCommittee,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/sync_committees`,
                providerOptions: {
                    httpMethod: 'post',
                },
                params: syncCommittee,
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async getVoluntaryExits(
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/voluntary_exits`,
            });
        } catch (error) {
            throw Error(`Error getting voluntary exits: ${error.message}`);
        }
    }

    /**
     * Submit SignedVoluntaryExit object to node's pool
     * @param {SignedVoluntaryExit} signedVoluntaryExit
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} returns a response code
     */

    async PostVoluntaryExits(
        signedVoluntaryExit: SignedVoluntaryExit,
        requestArguments?: Partial<Eth2RequestArguments>
    ): Promise<{ [key: string]: any }> {
        try {
            return await this.provider.request({
                ...requestArguments,
                endpoint: `pool/voluntary_exits`,
                providerOptions: {
                    httpMethod: 'post',
                },
                params: signedVoluntaryExit,
            });
        } catch (error) {
            throw Error(`Error posting voluntary exits: ${error.message}`);
        }
    }
}
