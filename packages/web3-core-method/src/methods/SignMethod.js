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
 * @file SignMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractCallMethod from '../../lib/methods/AbstractCallMethod';

// TODO: Move local signing logic to the eth module
export default class SignMethod extends AbstractCallMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super('eth_sign', 2, utils, formatters);
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
    execute(moduleInstance) {
        if (moduleInstance.accounts && moduleInstance.accounts.wallet[this.parameters[1]]) {
            this.beforeExecution(moduleInstance);

            return this.signOnClient(moduleInstance);
        }

        return super.execute(moduleInstance);
    }

    /**
     * Signs the message on the client.
     *
     * @method signOnClient
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<String>}
     */
    async signOnClient(moduleInstance) {
        try {
            let signedMessage = moduleInstance.accounts.sign(
                this.parameters[0],
                moduleInstance.accounts.wallet[this.parameters[1]].privateKey
            );

            if (this.callback) {
                this.callback(false, signedMessage);
            }

            return signedMessage;
        } catch (error) {
            if (this.callback) {
                this.callback(error, null);
            }

            throw error;
        }
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputSignFormatter(this.parameters[0]);
        this.parameters[1] = this.formatters.inputAddressFormatter(this.parameters[1]);
    }
}
