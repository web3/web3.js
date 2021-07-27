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
    ProviderCallOptions,
    HttpOptions,
    RpcStringResult,
    AxiosRequestUserConfig,
} from 'web3-providers-base/lib/types';

export default class Web3Beacon {
    private _requestManager: Web3RequestManager;

    constructor(options: Web3EthOptions) {
        this._requestManager = new Web3RequestManager({
            providerUrl: `${options.providerUrl}/eth/v1/beacon`,
        });
    }

    private _send(
        providerCallOptions: ProviderCallOptions
    ): Promise<RpcResponse> {
        return this._requestManager.send(providerCallOptions);
    }

    private _subscribe(
        providerCallOptions: ProviderCallOptions
    ): Promise<SubscriptionResponse> {
        return this._requestManager.subscribe(providerCallOptions);
    }

    /**
     * Retrieve details of the chain's genesis which can be used to identify chain.
     * @returns {Promise} Genesis object
     */
    async getGenesis(
        callOptions?: Partial<CallOptions>
    ): Promise<RpcStringResult | SubscriptionResponse> {
        // if (callOptions.method){ //check if its http
            const providerCallOptions = callOptions?.providerCallOptions
        // }
        try {
            const filledCallOptions = {
                ...callOptions,
                providerCallOptions: {
                    ...providerCallOptions,
                    url: 'genesis',
                    method: 'get'
                }
                // httpOptions: {
                //     ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                //     url: 'genesis',
                //     method: 'get',
                // },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions.providerCallOptions)
                : await this._send(filledCallOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting genesis: ${error.message}`);
        }
    }

    /**
     * Calculates HashTreeRoot for state with given 'stateId'. If stateId is root, same value will be returned.
     * @param {StateId} state_id state
     * @returns {Promise} HashTreeRoot
     */

    async getStateRoot(
        stateId: StateId,
        callOptions?: Partial<CallOptions>
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            const filledCallOptions = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/root`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions.ProviderCallOptions)
                : await this._send(filledCallOptions.ProviderCallOptions);
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
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            const filledCallOptions = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/fork`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions.providerCallOptions)
                : await this._send(filledCallOptions.providerCallOptions);
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
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            const filledCallOptions = {
                ...callOptions,
                providerCallOptions: {
                    ...callOptions?.providerCallOptions, //If its either HttpOptions, WSoptions, IPCOptions,
                    url: `states/${stateId}/finality_checkpoints`,
                    method: 'get',
                },
            };

            return callOptions?.subscribe
                ? await this._subscribe(filledCallOptions.providerCallOptions.providerCallOptions)
                : await this._send(filledCallOptions.providerCallOptions.providerCallOptions);
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
        state_id: StateId,
        callOptions: CallOptions,
        id?: [string],
        status?: [Status]
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `states/${state_id}/validators`,
                method: 'get',
                params: { id, status },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        state_id: StateId,
        validator_id: string,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `states/${state_id}/validators/${validator_id}`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        state_id: string,
        callOptions: CallOptions,
        id?: [string]
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `states/${state_id}/validator_balances`,
                method: 'get',
                params: { id },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting validator balance: ${error.message}`);
        }
    }

    /**
     * Get the committees for the given state
     * @param {string} state_id State
     * @param {string} epoch Fetch committees for the given epoch
     * @param {string} index Restrict returned values to those matching the supplied committee index
     * @param {string} slot Restrict returned values to those matching the supplied slot
     * @returns {Promise} Comittees
     */

    async getCommittees(
        state_id: string,
        callOptions: CallOptions,
        epoch?: string,
        index?: string,
        slot?: string
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `states/${state_id}/committee`,
                method: 'get',
                params: { epoch, index, slot },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        state_id: string,
        callOptions: CallOptions,
        epoch?: string
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `states/${state_id}/sync_committees`,
                method: 'get',
                params: { epoch },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        callOptions: CallOptions,
        slot: string,
        parent_root: string
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `headers`,
                method: 'get',
                params: { slot, parent_root },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block header for given block id.
     * @param {StateId} blockId Block Id
     * @returns {Promise} Block header
     */

    async getBlockHeadersById(
        blockId: StateId,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `headers/${blockId}`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
     * @param {StateId} blockId Block Id
     * @returns {Promise} Response code
     */

    async postBlock(
        signedBeaconBlock: StateId, //type BeaconBlock
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `blocks`,
                method: 'POST',
                data: { signedBeaconBlock },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error publishing block: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockV1(
        blockId: StateId,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `blocks/${blockId}`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockV2(
        blockId: StateId,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `/eth/v2/beacon/blocks/${blockId}`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    }

    /**
     * Retrieves block root of beaconBlock
     * @param {StateId} blockId Block Id
     * @returns {Promise} Block Root
     */

    async getBlockRoot(
        blockId: StateId,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `blocks/${blockId}/root`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        blockId: StateId,
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `blocks/${blockId}/root`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/attestations`,
                method: 'get',
                params: { slot, comitteeIndex },
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
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
        callOptions: CallOptions,
        attestation: AttestationData
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/attestations`,
                method: 'get',
                data: [attestation],
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get AttesterSlashings from operations pool
     * @returns {Promise} Attester slashings
     */

    async getAttesterSlashings(
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/attester_slashings`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Post AttesterSlashings from operations pool
     * @returns {Promise} Attester slashings
     */

    async postAttesterSlashings(
        callOptions: CallOptions,
        attesterSlashings: AttesterSlashing
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/attester_slashings`,
                method: 'POST',
                data: attesterSlashings,
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Get ProposerSlashings from operations pool
     * @returns {Promise} Proposer Slashings
     */

    async getProposerSlashings(
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/proposer_slashings`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit ProposerSlashing object to node's pool
     * @returns {Promise} Response code
     */

    async postProposerSlashings(
        callOptions: CallOptions,
        proposerSlashings: ProposerSlashing
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/proposer_slashings`,
                method: 'POST',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Submit sync committee signatures to node
     * @returns {Promise} Response code
     */

    async postSyncCommittees(
        callOptions: CallOptions,
        syncCommittee: SyncCommittee
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/sync_committees`,
                method: 'POST',
                data: [syncCommittee],
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

    async getVoluntaryExits(
        callOptions: CallOptions
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/voluntary_exits`,
                method: 'get',
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error getting voluntary exits: ${error.message}`);
        }
    }

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

    async PostVoluntaryExits(
        callOptions: CallOptions,
        signedVoluntaryExit: SignedVoluntaryExit
    ): Promise<RpcStringResult | SubscriptionResponse> {
        try {
            callOptions.providerCallOptions.axiosConfig = {
                url: `pool/voluntary_exits`,
                method: 'POST',
                data: signedVoluntaryExit,
            };

            return callOptions?.subscribe
                ? await this._subscribe(callOptions.providerCallOptions)
                : await this._send(callOptions.providerCallOptions);
        } catch (error) {
            throw Error(`Error posting voluntary exits: ${error.message}`);
        }
    }
}
