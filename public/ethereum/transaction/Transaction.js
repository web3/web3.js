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

import web3 from "../../index.js";
import send from "./send.js";
import confirmations from "./confirmations.js";
import mined from "./mined.js";

export default class Transaction {
    /**
     * @param {TransactionOptions} options
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
        this.hash = await send(this.options, this.config);

        return this;
    }

    /**
     * Resolves with the transaction receipt if the configured amount of confirmations is reached
     *
     * @method mined
     *
     * @returns {Promise<TransactionReceipt>}
     */
    mined() {
        return mined(this.hash, this.config)
    }

    /**
     * Returns a Observable which does trigger the next listener on each valid confirmation
     *
     * @method confirmations
     *
     * @returns {Observable}
     */
    confirmations() {
        return confirmations(this.hash, this.config);
    }
}
