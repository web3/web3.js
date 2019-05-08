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
 * @file BatchRequest.js
 * @author Samuel Furter <samuel@ethereum.org>, Marek Kotewicz <marek@ethdev.com>
 * @date 2018
 */

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';
import JsonRpcMapper from '../mappers/JsonRpcMapper';

export default class BatchRequest {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(moduleInstance) {
        this.moduleInstance = moduleInstance;
        this.methods = [];
    }

    /**
     * Should be called to add create new request to batch request
     *
     * @method add
     *
     * @param {AbstractMethod} method
     */
    add(method) {
        if (!isObject(method) && method) {
            throw new Error('Please provide a object of type AbstractMethod.');
        }

        this.methods.push(method);
    }

    /**
     * Should be called to execute batch request
     *
     * @method execute
     *
     * @returns Promise<{methods: AbstractMethod[], response: Object[]}|Error[]>
     */
    async execute() {
        const payload = await this.toPayload();
        const response = await this.moduleInstance.currentProvider.sendPayload(payload);
        let errors = [];

        let index = 0;
        for (const method of this.methods) {
            if (!isArray(response)) {
                if (method.callback) {
                    method.callback(
                        new Error(`BatchRequest error: Response should be of type Array but is: ${typeof response}`),
                        null
                    );

                    return;
                }

                errors.push(`Response should be of type Array but is: ${typeof response}`);

                return;
            }

            const responseItem = response[index] || null;

            const validationResult = JsonRpcResponseValidator.validate(responseItem);

            if (validationResult) {
                try {
                    let mappedResult;

                    // TODO: Find a better handling for custom behaviours in a batch request (afterBatchRequest?)
                    if (method.Type === 'eth-send-transaction-method') {
                        mappedResult = await method.observeTransaction(responseItem.result);
                    } else {
                        mappedResult = method.afterExecution(responseItem.result);
                    }


                    response[index] = mappedResult;
                    method.callback(false, mappedResult);
                } catch (error) {
                    errors.push(error);
                    method.callback(error, null);
                }

                return;
            }

            errors.push(validationResult);

            if (method.callback) {
                method.callback(validationResult, null);
            }

            i++;
        }

        if (errors.length > 0) {
            throw new Error(`BatchRequest error: ${errors}`);
        }

        return {
            methods: this.methods,
            response
        };
    }

    /**
     *  Creates a payload and signs the transactions locally if required.
     *
     * @method toPayload
     *
     * @returns {Promise<Array>}
     */
    async toPayload() {
        let payload = [];

        for (const method of this.methods) {
            method.beforeExecution(this.moduleInstance);

            if (this.moduleInstance.accounts && method.Type === 'eth-send-transaction-method' && method.hasAccounts()) {
                const account = this.moduleInstance.accounts.wallet[method.parameters[0].from];

                if (account) {
                    const response = await method.signTransaction(account);
                    method.parameters = [response.rawTransaction];
                    method.rpcMethod = 'eth_sendRawTransaction';
                }
            }

            payload.push(JsonRpcMapper.toPayload(method.rpcMethod, method.parameters));
        }

        return payload;
    }
}
