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
        if (this.hasAccounts(moduleInstance) && this.isDefaultSigner(moduleInstance)) {
            if (moduleInstance.accounts.wallet[this.parameters[0].from]) {
                return this.signLocally(moduleInstance);
            }
        }

        if (this.hasCustomSigner(moduleInstance)) {
            return this.signLocally(moduleInstance);
        }

        return super.execute(moduleInstance);
    }

    /**
     * Signs the message on the client.
     *
     * @method signLocally
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<String>}
     */
    async signLocally(moduleInstance) {
        try {
            this.beforeExecution(moduleInstance);

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

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method isDefaultSigner
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    isDefaultSigner(moduleInstance) {
        return moduleInstance.transactionSigner.constructor.name === 'TransactionSigner';
    }

    /**
     * Checks if the current module has decrypted accounts
     *
     * @method hasAccounts
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasAccounts(moduleInstance) {
        return moduleInstance.accounts && moduleInstance.accounts.accountsIndex > 0;
    }

    /**
     * Checks if a custom signer is given.
     *
     * @method hasCustomerSigner
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    hasCustomSigner(moduleInstance) {
        return moduleInstance.transactionSigner.constructor.name !== 'TransactionSigner';
    }
}
