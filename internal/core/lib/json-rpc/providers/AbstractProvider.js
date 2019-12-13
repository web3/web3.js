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

export default class AbstractProvider extends EventEmitter {
    /**
     * @constructor
     */
    constructor() {
        super();

        this.messageId = 0;
    }

    /**
     * Returns the payload object by the given method and parameters
     *
     * @method toPayload
     *
     * @param {String} method
     * @param {Array<any>} params
     *
     * @returns {{method: *, id: number, jsonrpc: string, params: (*|Array)}}
     */
    toPayload(method, params) {
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
     * @param {Object} response
     * @param {Object|Array} payload
     *
     * @returns {Boolean | Error}
     */
    validate(response, payload = false) {
        if (isObject(response)) {
            if (response.error) {
                if (response.error instanceof Error) {
                    return new NodeError(response.error.message, this.host, payload, response);
                }

                return new NodeError(JSON.stringify(response.error), this.host, payload, response);
            }

            if (payload && response.id !== payload.id) {
                return new ValidationError(`Invalid JSON-RPC response ID (request: ${payload.id} / response: ${response.id})`, this.host, payload, response);
            }

            if (response.result === undefined) {
                return new ValidationError('Undefined JSON-RPC result', this.host, payload, response);
            }

            return true;
        }

        return new ValidationError('Response should be of type Object', this.host, payload, response);
    }
}
