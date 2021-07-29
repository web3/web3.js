import Web3RequestManager from 'web3-core-requestmanager';
import {
    StateId,
    Status,
    AttestationData,
    AttesterSlashing,
    Web3EthOptions,
    ProposerSlashing,
    SyncCommittee,
    SignedVoluntaryExit,
} from '../types';
import {
    CallOptions,
    RpcResponse,
    SubscriptionResponse,
    ApiResponse,
    ApiResponse,
} from 'web3-providers-base/src/types';

export default class Web3Beacon {
    private _requestManager: Web3RequestManager;

    constructor(options: Web3EthOptions) {
        this._requestManager = new Web3RequestManager({
            providerUrl: `${options.providerUrl}/eth/v1/beacon`,
        });
    }

    private _send(callOptions: Partial<CallOptions>): Promise<ApiResponse> {
        return this._requestManager.send(callOptions);
    }

    private _subscribe(
        callOptions: Partial<CallOptions>
    ): Promise<SubscriptionResponse> {
        return this._requestManager.subscribe(callOptions);
    }

    /**
     * Retrieve details of the chain's genesis which can be used to identify chain.
     * @returns {Promise} Genesis object
     */
    async getGenesis(
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions,
                    url: 'genesis',
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting genesis: ${error.message}`);
        }
    }

    /**
     * Calculates HashTreeRoot for state with given 'stateId'. If stateId is root, same value will be returned.
     * @param {StateId} stateId state
     * @returns {Promise} HashTreeRoot
     */

    async getStateRoot(
        stateId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/root`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(
                `Error getting state root from state Id: ${error.message}`
            );
        }
    }

    /**
     * Returns Fork object for state with given 'stateId'.
     * @param {StateId} stateId State
     * @returns {Promise} Fork object
     */

    async getStateFork(
        stateId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/fork`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting state fork from Id: ${error.message}`);
        }
    }

    /**
     * Get finality checkpoints for state with given 'stateId'. In case finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root.
     * @param {StateId} stateId State
     * @returns {Promise} Finality checkpoints
     */

    async getFinalityCheckpoints(
        stateId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/finality_checkpoints`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting finality checkpoints: ${error.message}`);
        }
    }

    /**
     * Get validator from state by id
     * @param {StateId} stateId State
     * @param {[String]} ids Array of ids
     * @param {[Status]} status Array of validator status specifications
     * @returns {Promise} data of the validator specified
     */

    async getValidators(
        stateId: StateId,
        callOptions?: Partial<CallOptions>,
        id?: [String],
        status?: [Status]
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/validators`,
                    method: 'get',
                    params: {
                        id,
                        status,
                    },
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting validators: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {StateId} stateId State identifier
     * @param {String} validatorId Either hex encoded public key or validator index
     * @returns {Promise} data of the validator specified
     */

    async getValidatorById(
        stateId: StateId,
        validatorId: Hex | ValidatorIndex,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/validators/${validatorId}`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting validator by Id: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {State} stateId State
     * @param {[Hex | ValidatorIndex]} id Array of either hex encoded public keys or validator index
     * @returns {Promise} Balance of the validator specified
     */

    async getValidatorBalances(
        stateId: String,
        callOptions?: Partial<CallOptions>,
        id?: [String]
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/validator_balances`,
                    method: 'get',
                    params: { id },
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting validator balance: ${error.message}`);
        }
    }

    /**
     * Get the committees for the given state
     * @param {State | Slot | hex} stateId State
     * @param {String} epoch Fetch committees for the given epoch
     * @param {String} index Restrict returned values to those matching the supplied committee index
     * @param {String} slot Restrict returned values to those matching the supplied slot
     * @returns {Promise} Comittees
     */

    async getCommittees(
        stateId: string,
        callOptions?: Partial<CallOptions>,
        epoch?: string,
        index?: string,
        slot?: string
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/committee`,
                    method: 'get',
                    params: { epoch, index, slot },
                },
            };
            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting Committees: ${error.message}`);
        }
    }

    /**
     * Get the sync committees for the given state.
     * @param {State | Slot | Hex} stateId State
     * @param {String} epoch Epoch
     * @returns {Promise} Sync committees
     */

    async getSyncCommittees(
        stateId: string,
        callOptions?: Partial<CallOptions>,
        epoch?: string
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/sync_committees`,
                    method: 'get',
                    params: { epoch },
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block headers matching given query. By default it will fetch current head slot blocks.
     * @param {Slot} slot Slot
     * @param {string} parentRoot parent root
     * @returns {Promise} Block header
     */

    async getBlockHeaders(
        slot: Slot,
        parentRoot: String,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `headers`,
                    method: 'get',
                    params: { slot },
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block header for given block id.
     * @param {StateId | Slot | Hex } blockId Block Id
     * @returns {Promise} Block header
     */

    async getBlockHeadersById(
        blockId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `headers/${blockId}`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._send(filledCallOptions)
                : await this._subscribe(filledCallOptions);
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
     * @param {BeaconBlock} blockId Block Id
     * @returns {Promise} Response code
     */

    async postBlock(
        signedBeaconBlock: BeaconBlock, //type BeaconBlock
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `blocks`,
                    method: 'post',
                    data: { signedBeaconBlock },
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error publishing block: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId | Slot | Hex } blockId Block Id
     * @returns {Promise} SignedBeaconBlock Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     */

    async getBlockV1(
        blockId: StateId | Slot | Hex,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `blocks/${blockId}`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId | Slot | Hex} blockId Block Id
     * @returns {Promise} Retrieves block details for given block id. Depending on Accept header it can be returned either as json or as bytes serialized by SSZ
     */

    async getBlockV2(
        blockId: StateId | Slot | Hex,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `blocks/${blockId}`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Retrieves block root of beaconBlock
     * @param {StateId | Slot | Hex } blockId Block Id
     * @returns {Promise} Block Root
     */

    async getBlockRoot(
        blockId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `blocks/${blockId}/root`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting block root: ${error.message}`);
        }
    }

    /**
     * Retrieves attestation included in requested block.
     * @param {StateId | Slot | Hex} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockAttestations(
        blockId: StateId | Slot | Hex,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `blocks/${blockId}/root`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting block root: ${error.message}`);
        }
    }

    /**
     *Get Attestations from operations pool
     * @param {string} slot
     * @param {string} comitteeIndex
     * @returns {Promise} SignedBeaconBlock
     */

    async getPoolAttestations(
        slot: String,
        comitteeIndex: String,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/attestations`,
                    method: 'get',
                    params: { slot, comitteeIndex}
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(
                `Error getting attestations from pool: ${error.message}`
            );
        }
    }

    /**
     * Submit Attestation objects to node
     * @param {Attestation} attestation
     * @returns {Promise} Response code
     */

    async postPoolAttestations(
        attestation: AttestationData,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/attestations`,
                    method: 'post',
                    data: attestation
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get AttesterSlashings from operations pool
     * @returns {Promise} Attester slashings
     */

    async getAttesterSlashings(
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/attester_slashings`,
                    method: 'post'
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Post AttesterSlashings from operations pool
     * @param {AttesterSlashings} attesterSlashings
     * @returns {Promise} Attester slashings
     */

    async postAttesterSlashings(
        attesterSlashings: AttesterSlashing,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/attester_slashings`,
                    method: 'post',
                    data: attesterSlashings
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get ProposerSlashings from operations pool
     * @returns {Promise} Proposer Slashings
     */

    async getProposerSlashings(
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/proposer_slashings`,
                    method: 'get'
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit ProposerSlashing object to node's pool
     * @param {proposerSlashings} proposerSlashings
     * @returns {Promise} Response code
     */

    async postProposerSlashings(
        proposerSlashings: ProposerSlashing,
        callOptions?: Partial<CallOptions>,
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/proposer_slashings`,
                    method: 'post',
                    data: {proposerSlashings}
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit sync committee signatures to node
     * @param {SyncCommittee} syncCommittee
     * @returns {Promise} Response code
     */

    async postSyncCommittees(
        syncCommittee: SyncCommittee,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/sync_committees`,
                    method: 'post',
                    data: {syncCommittee}
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

    async getVoluntaryExits(
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/voluntary_exits`,
                    method: 'get'
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error getting voluntary exits: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @params {SignedVoluntaryExit} signedVoluntaryExit
     * @returns {Promise} Response code
     */

    async PostVoluntaryExits(
        signedVoluntaryExit: SignedVoluntaryExit,
        callOptions?: Partial<CallOptions>
    ): Promise<ApiResponse | SubscriptionResponse> {
        try {
            const filledCallOptions: Partial<CallOptions> = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `pool/voluntary_exits`,
                    method: 'post',
                    data: { signedVoluntaryExit }
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions)
                : await this._send(filledCallOptions);
        } catch (error) {
            throw Error(`Error posting voluntary exits: ${error.message}`);
        }
    }
}
