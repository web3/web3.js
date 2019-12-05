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
 * @file Transaction.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import web3 from "../index.js";
import SendTransactionMethod from "../../modules/ethereum/src/methods/eth/transaction/SendTransactionMethod";

/**
 * POC
 */
export default class Transaction {
    /**
     * @param {Object} options
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(options, config = web3.config.ethereum) {
        this.options = options;
        this.config = config;
        this.hash = null;
    }

    /**
     * Executes the transaction and returns itself with the hash property set
     *
     * @returns {Promise<Transaction>}
     */
    async send() {
        // TODO: Move options property checks and pre filling of them to this object on the public_api layer
        this.hash = new SendTransactionMethod(this.config, [this.options]).execute();

        return this;
    }

    /**
     * Resolves with the transaction receipt if the configured requirements are here.
     *
     * @method mined
     *
     * @param {TransactionConfirmationConfig} config
     *
     * @returns {Promise<TransactionReceipt>}
     */
    async mined(config) {
        // Resolve if enough confirmations did happen (can be configured with the passed config object)
    }

    /**
     * Resolves with the transaction receipt if the configured requirements are here.
     *
     * @method confirmations
     *
     * @returns {Observable}
     */
    confirmations() {
        // Resolve if enough confirmations did happen (can be configured with the passed config object)
    }
}
