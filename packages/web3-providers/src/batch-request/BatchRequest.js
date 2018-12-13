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

import isFunction from 'underscore-es/isFunction';
import isObject from 'underscore-es/isObject';
import isArray from 'underscore-es/isArray';
import JsonRpcMapper from '../mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

export default class BatchRequest {
    /**
     * @param {AbstractProviderAdapter} provider
     *
     * @constructor
     */
    constructor(provider) {
        this.provider = provider;
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
        this.methods.push(method);
    }

    /**
     * Should be called to execute batch request
     *
     * @method execute
     *
     * @returns Promise<Array|Error[]>
     */
    execute() {
        return new Promise((resolve, reject) => {
            this.provider.sendBatch(JsonRpcMapper.toBatchPayload(this.methods), (error, response) => {
                if (error) {
                    reject(error);

                    return;
                }

                let errors = [];
                this.methods.forEach((method, index) => {
                    if (error) {
                        if (isFunction(method.callback)) {
                            method.callback(error);

                            return;
                        }
                    }

                    if (!isArray(response)) {
                        const responseError = new Error(
                            `Response should be of type Array but is: ${typeof response}`
                        );

                        method.callback(responseError);
                        errors.push(responseError);

                        return;
                    }

                    const responseItem = response[index] || null;

                    if (isFunction(method.callback)) {
                        if (isObject(responseItem) && responseItem.error) {
                            const nodeError = new Error(`Returned node error: ${responseItem.error}`);

                            method.callback(nodeError);
                            errors.push(nodeError);
                        }

                        if (!JsonRpcResponseValidator.validate(responseItem)) {
                            const responseError = new Error(`Invalid JSON RPC response: ${JSON.stringify(responseItem)}`);

                            method.callback(responseError);
                            errors.push(responseError);
                        }

                        try {
                            const mappedResult = method.afterExecution(responseItem.result);

                            responseItem.result = mappedResult;
                            method.callback(null, mappedResult);
                        } catch (error) {
                            errors.push(error);
                            method.callback(error, null);
                        }
                    }
                });

                if (errors.length > 0) {
                    reject(errors);
                }

                resolve({
                    methods: this.methods,
                    response
                });
            });
        });
    }
}
