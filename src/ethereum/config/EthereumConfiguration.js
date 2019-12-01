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
 * @date 2018
 */

import {toChecksumAddress} from 'web3-utils';
import AbstractJsonRpcConfiguration from "../../../lib/config/AbstractJsonRpcConfiguration";

export default class EthereumConfiguration extends AbstractJsonRpcConfiguration {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options = {}) {
        super(options);

        this.defaultAccount = options.defaultAccount;
        this.defaultBlock = options.defaultBlock || 'latest';
        this.transactionBlockTimeout = options.transactionBlockTimeout || 50;
        this.transactionConfirmationBlocks = options.transactionConfirmationBlocks || 0;
        this.transactionPollingTimeout = options.transactionPollingTimeout || 750;
        this.defaultGasPrice = options.defaultGasPrice;
        this.defaultGas = options.defaultGas;
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    get defaultAccount() {
        return this._defaultAccount;
    }

    /**
     * TODO: Add utils and formatters as dependency or create the core-types module and pass the factory to the
     * TODO: AbstractWeb3Module (factory.createAddress())
     *
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    set defaultAccount(value) {
        if (value) {
            this._defaultAccount = toChecksumAddress(value);
        }

        this._defaultAccount = undefined;
    }
}
