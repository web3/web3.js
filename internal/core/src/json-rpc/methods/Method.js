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
 * @file Method.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class Method {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {JsonRpcConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, config, parameters) {
        this.rpcMethod = rpcMethod;
        this.parametersAmount = parametersAmount;
        this.config = config;
        this.parameters = parameters;
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
     * @returns {Promise<any>}
     */
    async execute() {
        await this.beforeExecution();

        if (this.parameters.length !== this.parametersAmount) {
            throw new Error(
                `Invalid Arguments length: expected: ${this.parametersAmount}, given: ${this.parameters.length}`
            );
        }

        let response = await this.config.provider.send(this.rpcMethod, this.parameters);

        return this.afterExecution(response);
    }
}
