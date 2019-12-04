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
 * @file AbstractMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import isString from 'lodash/isString';

export default class Method {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {Array} parameters
     * @param {JsonRpcConfiguration} config
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, parameters, config) {
        this.config = config;
        this.parameters = parameters;
        this.rpcMethod = rpcMethod;
        this.parametersAmount = parametersAmount;
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {Configuration} moduleInstance - The package where the method is called from for example Eth.
     */
    async beforeExecution(moduleInstance) {}

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {*} response
     *
     * @returns {*}
     */
    async afterExecution(response) {
        return response;
    }

    /**
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @returns {Promise<Object|String>}
     */
    async execute() {
        await this.beforeExecution();

        if (this.parameters.length !== this.parametersAmount) {
            throw new Error(
                `Invalid Arguments length: expected: ${this.parametersAmount}, given: ${this.parameters.length}`
            );
        }

        let response = await this.config.provider.send(this.rpcMethod, this.parameters);

        if (response) {
            response = await this.afterExecution(response);
        }

        return response;
    }

    /**
     * Checks if the given parameter is of type hash
     *
     * @method isHash
     *
     * @param {String} parameter
     *
     * @returns {Boolean}
     */
    isHash(parameter) {
        return isString(parameter) && parameter.startsWith('0x');
    }
}
