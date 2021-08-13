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
} from './types';
import {
    RpcResponse,
    RpcStringResult,
    RpcPrefixedHexStringResult,
    RpcValidTypeResult,
    RpcBooleanResult,
    RpcSyncingResult,
    RpcAccountsResult,
    RpcBlockResult,
    RpcTransactionResult,
    RpcTransactionReceiptResult,
    RpcStringArrayResult,
    RpcCompiledSolidityResult,
    RpcLogResult,
    RequestArguments,
    IWeb3Provider,
} from 'web3-core-types/lib/types';
import { ValidTypesEnum } from 'web3-utils/lib/types';
import { BeaconBlock } from '@chainsafe/lodestar-types/lib/allForks/types';

export default class Web3Beacon {
    private _defaultReturnType: ValidTypesEnum;

    provider: IWeb3Provider;

    constructor(options: Web3EthOptions) {
        this.provider = initWeb3Provider(options.web3Client);
        this._defaultReturnType =
            options.returnType || ValidTypesEnum.PrefixedHexString;
    }

    /**
     * Retrieve details of the chain's genesis which can be used to identify chain.
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Genesis object
     */
    async getGenesis(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `genesis`,
                        method: 'get',
                    },
                },
            });
        } catch (error) {
            throw Error(`Error getting genesis: ${error.message}`);
        }
    }

    /**
     * Calculates HashTreeRoot for state with given 'stateId'. If stateId is root, same value will be returned.
     * @param {StateId} stateId state
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} HashTreeRoot
     */

    async getStateRoot(
        stateId: StateId,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/root`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(
                `Error getting state root from state Id: ${error.message}`
            );
        }
    }

    /**
     * Returns Fork object for state with given 'stateId'.
     * @param {StateId} stateId State
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Fork object
     */

    async getStateFork(
        stateId: StateId,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/fork`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting state fork from Id: ${error.message}`);
        }
    }

    /**
     * Get finality checkpoints for state with given 'stateId'. In case finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root.
     * @param {StateId} stateId State
     * @param {object} requestArguments (Optional) rpcOptions, providerOptions, and desired returnType rpcOptions, providerOptions, and desired returnType
     * @returns {Promise} Finality checkpoints
     */

    async getFinalityCheckpoints(
        stateId: StateId,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/finality_checkpoints`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting finality checkpoints: ${error.message}`);
        }
    }

    /**
     * Get validator from state by id
     * @param {StateId} state_id State
     * @param {string} id Array of ids
     * @param {Status} status Validator status specification
     * @returns {Promise} data of the validator specified
     */

    async getValidators(
        stateId: StateId,
        requestArguments?: Partial<RequestArguments>,
        id?: [string],
        status?: [Status]
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/validators`,
                        method: 'get',
                        params: { id, status },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting validators: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {StateId} state_id State
     * @param {string} validator_id Either hex encoded public key or validator index
     * @returns {Promise} data of the validator specified
     */

    async getValidatorById(
        stateId: StateId,
        validator_id: string,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/validators/${validator_id}`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting validator by Id: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {string} state_id State
     * @param {string} id Array of either hex encoded public keys or validator index
     * @returns {Promise} Balance of the validator specified
     */

    async getValidatorBalances(
        stateId: string,
        requestArguments?: Partial<RequestArguments>,
        id?: [string]
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/validator_balances`,
                        method: 'get',
                        params: { id },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting validator balance: ${error.message}`);
        }
    }

    /**
     * Get the committees for the given state
     * @param {string} stateId State
     * @param {string} epoch Fetch committees for the given epoch
     * @param {string} index Restrict returned values to those matching the supplied committee index
     * @param {string} slot Restrict returned values to those matching the supplied slot
     * @returns {Promise} Comittees
     */

    async getCommittees(
        stateId: string,
        requestArguments?: Partial<RequestArguments>,
        epoch?: string,
        index?: string,
        slot?: string
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/committee`,
                        method: 'get',
                        params: { epoch, index, slot },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting Committees: ${error.message}`);
        }
    }

    /**
     * Get the sync committees for the given state.
     * @param {string} state_id State
     * @param {string} epoch Epoch
     * @returns {Promise} Sync committees
     */

    async getSyncCommittees(
        stateId: string,
        requestArguments?: Partial<RequestArguments>,
        epoch?: string
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `states/${stateId}/sync_committees`,
                        method: 'get',
                        params: { epoch },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block headers matching given query. By default it will fetch current head slot blocks.
     * @param {string} slot Slot
     * @param {string} parentRoot parent root
     * @returns {Promise} Block header
     */

    async getBlockHeaders(
        slot: string,
        parent_root: string,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `headers`,
                        method: 'get',
                        params: { slot, parent_root },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block header for given block id.
     * @param {BlockIdentifier} blockId Block Id
     * @returns {Promise} Block header
     */

    async getBlockHeadersById(
        blockId: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `headers/${blockId}`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting block header by id: ${error.message}`);
        }
    }

    /**
     * Publish a signed block.
     * Instructs the beacon node to broadcast a newly signed beacon block to the beacon network,
     * to be included in the beacon chain. The beacon node is not required to validate the signed BeaconBlock,
     * and a successful response (20X) only indicates that the broadcast has been successful.
     * The beacon node is expected to integrate the new block into its state, and therefore validate the block internally,
     * however blocks which fail the validation are still broadcast but a different status code is returned (202)
     * @param {BeaconBlock} signedBeaconBlock Beacon Block
     * @returns {Promise} Response code
     */

    async postBlock(
        signedBeaconBlock: BeaconBlock,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `blocks`,
                        method: 'post',
                        data: { signedBeaconBlock },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error publishing block: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {BlockIdentifier} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlock(
        blockId: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `blocks/${blockId}`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Retrieves block root of beaconBlock
     * @param {BlockIdentifier} blockId Block Id
     * @returns {Promise} Block Root
     */

    async getBlockRoot(
        blockId: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `blocks/${blockId}/root`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting block root: ${error.message}`);
        }
    }

    /**
     * Retrieves attestation included in requested block.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockAttestations(
        blockId: BlockIdentifier,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `blocks/${blockId}/attestations`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting block attestations: ${error.message}`);
        }
    }

    /**
     *Get Attestations from operations pool
     * @param {string} slot
     * @param {string} comitteeIndex
     * @returns {Promise} SignedBeaconBlock
     */

    async getPoolAttestations(
        requestArguments?: Partial<RequestArguments>,
        slot?: String,
        comitteeIndex?: String
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/attestations`,
                        method: 'get',
                        data: { slot, comitteeIndex },
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(
                `Error getting attestations from pool: ${error.message}`
            );
        }
    }

    /**
     * Submit Attestation objects to node
     * @returns {Promise} Response code
     */

    async postPoolAttestations(
        attestation: AttestationData,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/attestations`,
                        method: 'post',
                        data: attestation,
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get AttesterSlashings from operations pool
     * @returns {Promise} Attester slashings
     */

    async getAttesterSlashings(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/attester_slashings`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Post AttesterSlashings from operations pool
     * @returns {Promise} Attester slashings
     */

    async postAttesterSlashings(
        attesterSlashings: AttesterSlashing,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/attester_slashings`,
                        method: 'post',
                        data: attesterSlashings,
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get ProposerSlashings from operations pool
     * @returns {Promise} Proposer Slashings
     */

    async getProposerSlashings(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/proposer_slashings`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit ProposerSlashing object to node's pool
     * @returns {Promise} Response code
     */

    async postProposerSlashings(
        proposerSlashings: ProposerSlashing,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/proposer_slashings`,
                        method: 'post',
                        data: proposerSlashings,
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit sync committee signatures to node
     * @returns {Promise} Response code
     */

    async postSyncCommittees(
        syncCommittee: SyncCommittee,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/sync_committees`,
                        method: 'post',
                        data: syncCommittee,
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

    async getVoluntaryExits(
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/voluntary_exits`,
                        method: 'get',
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error getting voluntary exits: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

    async PostVoluntaryExits(
        signedVoluntaryExit: SignedVoluntaryExit,
        requestArguments?: Partial<RequestArguments>
    ): Promise<RpcStringResult> {
        try {
            return await this.provider.request({
                ...requestArguments,
                providerOptions: {
                    ...requestArguments?.providerOptions,
                    axiosConfig: {
                        url: `pool/voluntary_exits`,
                        method: 'post',
                        data: signedVoluntaryExit,
                    },
                    ethVersion: 2,
                },
            });
        } catch (error) {
            throw Error(`Error posting voluntary exits: ${error.message}`);
        }
    }
}
