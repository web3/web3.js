import Web3RequestManager from 'web3-core-requestmanager';
import { HttpRpcOptions } from 'web3-providers-http/types';
import { StateId, Status } from '../types';
import {
    CallOptions,
    RpcResponse,
    SubscriptionResponse
} from 'web3-providers-base/types';

import {
    Web3EthOptions,
    EthStringResult,
} from '../types';

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

    async getGenesis(callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = "/eth/v1/beacon/genesis"
            const requestParameters: [string, string, HttpParams, CallOptions | undefined] = [
                path,
                "GET",
                {},
                callOptions
            ]
            
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

    async getStateRoot(state_id: StateId, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/root`
            const requestParameters: [string, string, HttpParams, CallOptions | undefined] = [
                path,
                "GET",
                {},
                callOptions
            ]

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting state root from state Id: ${error.message}`);
        }
    }

    /**
     * Returns Fork object for state with given 'stateId'.
     * @param {string} state_id State
     * @returns {Promise} Fork object 
     */

     async getStateFork(state_id: string, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/root`
            const requestParameters: [string, string, HttpParams, CallOptions | undefined] = [
                path,
                "GET",
                {},
                callOptions
            ]

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting state fork from Id: ${error.message}`);
        }
    }

    /**
     * Get finality checkpoints for state with given 'stateId'. In case finality is not yet achieved, checkpoint should return epoch 0 and ZERO_HASH as root.
     * @param {string} state_id State
     * @returns {Promise} Finality checkpoints
     */

    async getFinalityCheckpoints(state_id: string, callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/finality_checkpoints`
            const requestParameters: [string, string, HttpParams, CallOptions | undefined] = [
                path,
                "GET",
                {},
                callOptions
            ]

            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Get validator from state by id
     * @param {string} state_id State
     * @returns {Promise} data of the validator specified
     */

     async getValidators(state_id: string, id?:[string], status?:[]  callOptions?: CallOptions): Promise<Web3Eth2Result | SubscriptionResponse> {
        try {
            const path = `/eth/v1/beacon/states/${state_id}/validators`
            const requestParameters: [string, string, HttpParams, CallOptions | undefined] = [
                path,
                "GET",
                {},
                callOptions
            ]
            
            return callOptions?.subscribe
                ? await this._subscribe(...requestParameters)
                : await this._send(...requestParameters);
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {string} state_id State
     * @param {string} validator_id Either hex encoded public key or validator index 
     * @returns {Promise} data of the validator specified
     */

     async getValidatorById(state_id: string, validator_id: string): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                path: `/eth/v1/beacon/states/${state_id}/validators/${validator_id}`,
                method: 'web3_clientVersion',
                httpMethod: "GET",
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Returns filterable list of validators with their balance, status and index.
     * @param {string} state_id State
     * @param {string} validator_id Either hex encoded public key or validator index 
     * @returns {Promise} Data of the validator specified
     */

     async getValidatorByBalances(state_id: string, validator_id: string): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                path: `/eth/v1/beacon/states/${state_id}/validators/${validator_id}`,
                method: 'web3_clientVersion',
                httpMethod: "GET",
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Get the committees for the given state.g
     * @param {string} state_id State
     * @returns {Promise} Comittees 
     */

    async getCommittees(state_id: string): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                path: `/eth/v1/beacon/states/${state_id}/committees`,
                method: 'web3_clientVersion',
                httpMethod: "GET",
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

    /**
     * Get the sync committees for the given state.
     * @param {string} state_id State
     * @returns {Promise} Committees 
     */

     async getSyncCommittees(state_id: string): Promise<EthStringResult> {
        try {
            return await this._requestManager.send({
                path: `/eth/v1/beacon/states/${state_id}/sync_committees`,
                method: 'web3_clientVersion',
                httpMethod: "GET",
                params: [],
            });
        } catch (error) {
            throw Error(`Error getting client version: ${error.message}`);
        }
    }

}

