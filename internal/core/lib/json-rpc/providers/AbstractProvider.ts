/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file AbstractProvider
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {isObject} from 'lodash';
import {EventEmitter} from "eventemitter3";
import ValidationError from "../../../src/errors/json-rpc/ValidationError";
import NodeError from "../../../src/errors/json-rpc/NodeError";
import JsonRpcPayload from "./interfaces/JsonRpcPayload";
import JsonRpcResponse from "./interfaces/JsonRpcResponse";
import ProviderError from "../../../src/errors/json-rpc/ProviderError";

export default abstract class AbstractProvider extends EventEmitter {
    /**
     * @property timeout
     */
    protected timeout: number = 0;

    /**
     * @property host
     */
    protected host: string = '';

    /**
     * @property messageId
     */
    protected messageId: number = 0;

    /**
     * @constructor
     */
    protected constructor() {
        super();
    }

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    public abstract send(method: string, parameters: any[]): Promise<any>

    /**
     * TODO: Add the correct method to determine the capabilities of a provider as soon as EIP-1193 is finalized.
     *
     * Method for checking subscriptions support of a internal provider
     *
     * @method supportsSubscriptions
     *
     * @returns {Boolean}
     */
    public abstract supportsSubscriptions(): boolean;

    /**
     * Added this method to have a better error message if someone is trying to create a subscription with this provider.
     */
    public async subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string> {
        throw new ProviderError('Subscriptions are not supported with the current provider.', this.host);
    }

    /**
     * Added this method to have a better error message if someone is trying to unsubscribe with this provider.
     */
    public async unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean> {
        throw new ProviderError('Subscriptions are not supported with the current provider.', this.host);
    }

    /**
     * Returns the payload object by the given method and parameters
     *
     * @method toPayload
     *
     * @param {String} method
     * @param {any[]} params
     *
     * @returns {{method: *, id: number, jsonrpc: string, params: (*|Array)}}
     */
    public toPayload(method: string, params: any[]): JsonRpcPayload {
        const id = this.messageId;
        this.messageId++;

        return {
            jsonrpc: '2.0',
            id,
            method,
            params: params || []
        };
    }

    /**
     * Executes JSON-RPC response validation
     *
     * @method isValid
     *
     * @param {JsonRpcResponse} response
     * @param {JsonRpcResponse|Boolean} payload
     *
     * @returns {Error | Boolean}
     */
    public validate(response: JsonRpcResponse, payload?: JsonRpcPayload): Error | boolean {
        if (isObject(response)) {
            if (response.error) {
                if (response.error instanceof Error) {
                    return new NodeError(response.error.message, this.host, payload, response);
                }

                return new NodeError(JSON.stringify(response.error), this.host, payload, response);
            }

            if (payload && response.id !== payload.id) {
                return new ValidationError(
                    `Invalid JSON-RPC response ID (request: ${payload.id} / response: ${response.id})`,
                    this.host,
                    payload,
                    response
                );
            }

            if (response.result === undefined) {
                return new ValidationError('Undefined JSON-RPC result', this.host, payload, response);
            }

            return true;
        }

        return new ValidationError('Response should be of type Object', this.host, payload, response);
    }
}
