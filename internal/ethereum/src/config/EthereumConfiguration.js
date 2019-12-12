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
 * @file EthereumConfiguration.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import JsonRpcConfiguration from "../../../core/src/json-rpc/config/JsonRpcConfiguration.js";
import Address from "../../lib/types/input/Address.js";

export default class EthereumConfiguration extends JsonRpcConfiguration {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options = {}) {
        super(options);

        this.account = options.account;
        this.block = options.block || 'latest';

        this.transaction = options.transaction || {};
        this.transaction.blockTimeout = this.transaction.blockTimeout || 50;
        this.transaction.confirmationBlocks = this.transaction.confirmationBlocks || 0;
        this.transaction.pollingTimeout = this.transaction.pollingTimeout || 750;
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    get account() {
        return this._account;
    }

    /**
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set account(value) {
        if (value) {
            this._account = Address.isValid((value));
        }

        this._account = undefined;
    }
}
