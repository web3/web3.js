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
 * @file ModuleOptions.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import Address from './Address';
import BlockNumber from './BlockNumber';

export default class ModuleOptions {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options) {
        this.properties = options;

        if (options.defaultAccount) {
            this.defaultAccount = options.defaultAccount;
        }

        if (options.defaultBlock) {
            this.defaultBlock = options.defaultBlock;
        }
    }

    /**
     * Getter for the defaultBlock property
     *
     * @property defaultBlock
     *
     * @returns {String|Number}
     */
    get defaultBlock() {
        if (this.properties.defaultBlock) {
            return this.properties.defaultBlock;
        }

        return 'latest';
    }

    /**
     * Setter for the defaultAccount property
     *
     * @property defaultBlock
     *
     * @param {String|Number} block
     */
    set defaultBlock(block) {
        this.properties.defaultBlock = new BlockNumber(block).toString();
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    get defaultAccount() {
        if (this.properties.defaultAccount) {
            return this.properties.defaultAccount;
        }

        return null;
    }

    /**
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} address
     */
    set defaultAccount(address) {
        this.properties.defaultAccount = new Address(address).toChecksum();
    }

    /**
     * Getter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @returns {Number}
     */
    get transactionBlockTimeout() {
        if (this.properties.transactionBlockTimeout || this.properties.transactionBlockTimeout === 0) {
            return this.properties.transactionBlockTimeout;
        }

        return 50;
    }

    /**
     * Setter for the transactionBlockTimeout property
     *
     * @property transactionBlockTimeout
     *
     * @param {Number} transactionBlockTimeout
     */
    set transactionBlockTimeout(transactionBlockTimeout) {
        this.properties.transactionBlockTimeout = transactionBlockTimeout;
    }

    /**
     * Getter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @returns {Number}
     */
    get transactionConfirmationBlocks() {
        if (this.properties.transactionConfirmationBlocks || this.properties.transactionConfirmationBlocks === 0) {
            return this.properties.transactionConfirmationBlocks;
        }

        return 0;
    }

    /**
     * Setter for the transactionConfirmationBlocks property
     *
     * @property transactionConfirmationBlocks
     *
     * @param {Number} transactionConfirmationBlocks
     */
    set transactionConfirmationBlocks(transactionConfirmationBlocks) {
        this.properties.transactionConfirmationBlocks = transactionConfirmationBlocks;
    }

    /**
     * Getter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @returns {Number}
     */
    get transactionPollingTimeout() {
        if (this.properties.transactionPollingTimeout || this.properties.transactionPollingTimeout === 0) {
            return this.properties.transactionPollingTimeout;
        }

        return 750;
    }

    /**
     * Setter for the transactionPollingTimeout property
     *
     * @property transactionPollingTimeout
     *
     * @param {Number} transactionPollingTimeout
     */
    set transactionPollingTimeout(transactionPollingTimeout) {
        this.properties.transactionPollingTimeout = transactionPollingTimeout;
    }

    /**
     * Getter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @returns {Number|String}
     */
    get defaultGasPrice() {
        return this.properties.defaultGasPrice;
    }

    /**
     * Setter for the defaultGasPrice property
     *
     * @property defaultGasPrice
     *
     * @param {Number|String} defaultGasPrice
     */
    set defaultGasPrice(defaultGasPrice) {
        this.properties.defaultGasPrice = defaultGasPrice;
    }

    /**
     * Getter for the defaultGas property
     *
     * @property defaultGas
     *
     * @returns {Number|String}
     */
    get defaultGas() {
        return this.properties.defaultGas;
    }

    /**
     * Setter for the defaultGas property
     *
     * @property defaultGas
     *
     * @param {Number|String} defaultGas
     */
    set defaultGas(defaultGas) {
        this.properties.defaultGas = defaultGas;
    }
}
