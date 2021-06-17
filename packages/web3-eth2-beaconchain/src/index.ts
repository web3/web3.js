import Web3RequestManager from 'web3-core-requestmanager';
import { HttpRpcOptions } from 'web3-providers-http/types';
import { StateId, Status } from '../types';
import {
    CallOptions,
    RpcResponse,
    SubscriptionResponse,
} from 'web3-providers-base/types';

import { Web3EthOptions, EthStringResult } from '../types';

type Web3Eth2Result = any;
type HttpParams = object;

export default class Web3Beacon {
    private _requestManager: Web3RequestManager;
    private _DEFAULT_JSON_RPC_VERSION = '2.0';

    constructor(options: Web3EthOptions) {
        this._requestManager = new Web3RequestManager({
            providerUrl: options.providerUrl,
        });
    }

    private _send(
        path: string,
        httpMethod: string,
        params: HttpParams,
        callOptions?: CallOptions
    ): Promise<RpcResponse> {
        return this._requestManager.send(
            {
                ...callOptions?.rpcOptions,
                path,
                httpMethod,
                params,
            },
            callOptions?.providerCallOptions
        );
    }

    private _subscribe(
        path: string,
        httpMethod: string,
        params: HttpParams,
        callOptions?: CallOptions
    ): Promise<SubscriptionResponse> {
        return this._requestManager.subscribe(
            {
                ...callOptions?.rpcOptions,
                path,
                httpMethod,
                params,
            },
            callOptions?.providerCallOptions
        );
    }

    /**
     * Retrieve details of the chain's genesis which can be used to identify chain.
     * @returns {Promise} Genesis object
     */

    async getGenesis(
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = '/eth/v1/beacon/genesis';
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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
        state_id: StateId,
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/root`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(
                `Error getting state root from state Id: ${error.message}`
            );
        }
    }

    /**
     * Returns Fork object for state with given 'stateId'.
     * @param {StateId} state_id State
     * @returns {Promise} Fork object
     */

    async getStateFork(
        state_id: StateId,
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/root`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting state fork from Id: ${error.message}`);
        }
    }

    /**
     * Get finality checkpoints for state with given 'stateId'. In case finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root.
     * @param {StateId} state_id State
     * @returns {Promise} Finality checkpoints
     */

    async getFinalityCheckpoints(
        state_id: StateId,
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/finality_checkpoints`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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
        id?: [string],
        status?: [],
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/validators`;
            const httpParams: HttpParams  = {id, status}
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/validators/${validator_id}`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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
        id: string,
        callOptions?: CallOptions
    ): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/validator_balances`;
            const httpParams = {id}
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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

    async getCommittees(state_id: string, epoch: string, index: string, slot: string, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/committee`;
            const httpParams = {epoch, index, slot}
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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

    async getSyncCommittees(state_id: string, epoch: string, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/sync_committees`;
            const httpParams = {epoch}
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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

    async getBlockHeaders(slot: string, parent_root: string, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/headers`;
            const httpParams = {slot, parent_root}
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Retrieves block header for given block id.
     * @param {StateId} blockId Block Id
     * @returns {Promise} Block header
     */
    
     async getBlockHeadersById(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/headers/${blockId}`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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
    
     async postBlock(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/blocks`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'POST', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error publishing block: ${error.message}`);
        }
    }

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */
    
     async getBlockV1(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/blocks/${blockId}`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    } 

    /**
     * Returns the complete SignedBeaconBlock for a given block ID. Depending on the Accept header it can be returned either as JSON or SSZ-serialized bytes.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */
    
     async getBlockV2(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v2/beacon/blocks/${blockId}`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting block by block Id: ${error.message}`);
        }
    } 

    /**
     * Retrieves block root of beaconBlock
     * @param {StateId} blockId Block Id
     * @returns {Promise} Block Root
     */
    
     async getBlockRoot(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/blocks/${blockId}/root`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting block root: ${error.message}`);
        }
    } 

    /**
     * Retrieves attestation included in requested block.
     * @param {StateId} blockId Block Id
     * @returns {Promise} SignedBeaconBlock
     */

    async getBlockAttestations(blockId: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/blocks/${blockId}/root`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
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

     async getPoolAttestations(slot: String, comitteeIndex: String, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/blocks/${blockId}/root`;
            const httpParams = {comitteeIndex, slot}

            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', httpParams, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting attestations from pool: ${error.message}`);
        }
    } 

    /**
     * Submit Attestation objects to node
     * @returns {Promise} Response code
     */

     async postPoolAttestations(callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/pool/attestations`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    } 

    /**
     * Submit sync committee signatures to node
     * @returns {Promise} Response code
     */

     async postSyncCommittees(callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/pool/sync_committees`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'POST', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error posting attestations to pool: ${error.message}`);
        }
    } 

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

     async getVoluntaryExits(callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/pool/voluntary_exits`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'GET', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting voluntary exits: ${error.message}`);
        }
    } 

    /**
     * Retrieves voluntary exits known by the node but not necessarily incorporated into any block
     * @returns {Promise} Response code
     */

     async PostVoluntaryExits(callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/pool/voluntary_exits`;
            const requestParameters: [
                string,
                string,
                HttpParams,
                CallOptions | undefined
            ] = [path, 'POST', {}, callOptions];

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error posting voluntary exits: ${error.message}`);
        }
    } 

}
