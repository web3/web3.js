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
 * @file AbstractCallMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractMethod from './AbstractMethod';

export default class AbstractCallMethod extends AbstractMethod {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, utils, formatters) {
        super(rpcMethod, parametersAmount, utils, formatters);
    }

    /**
     * TODO: Implementing of a custom 'instanceof' with an JS reflection would remove this type and we could do:
     * TODO: ConcreteCallMethod instanceof AbstractCallMethod
     * Returns the commandType of this Method
     *
     * @property CommandType
     *
     * @returns {String}
     */
    static get Type() {
        return 'CALL';
    }

    /**
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object|String>}
     */
    async execute(moduleInstance) {
        this.beforeExecution(moduleInstance);

        if (this.parameters.length !== this.parametersAmount) {
            throw new Error(
                `Invalid Arguments length: expected: ${this.parametersAmount}, given: ${this.parameters.length}`
            );
        }

        try {
            const response = await moduleInstance.currentProvider.send(this.rpcMethod, this.parameters);

            const mappedResponse = this.afterExecution(response);

            if (this.callback) {
                this.callback(false, mappedResponse);
            }

            return mappedResponse;
        } catch (error) {
            if (this.callback) {
                this.callback(error, null);
            }

            throw error;
        }
    }
}
