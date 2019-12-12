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
 * @file TransactionOptions.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import Address from './Address.js';
import Hex from "../../../../core/src/utility/Hex.js";

export default class TransactionOptions {
    /**
     * TODO: Add optional config parameter and handle default values
     *
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options) {
        if (!options.from) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        this.properties = options;

        this.from = options.from;
        this.to = options.to;
        this.data = options.data;
        this.gas = options.gas;
        this.gasPrice = options.gasPrice;
        this.value = options.value;
        this.nonce = options.nonce;
    }

    /**
     * Getter for the from property.
     *
     * @property from
     *
     * @returns {String}
     */
    get from() {
        return this.properties.from;
    }

    /**
     * Setter for the from property.
     *
     * @property from
     *
     * @param {String} from
     */
    set from(from) {
        if (from) {
            this.properties.from = Address.toChecksum(from);
        }
    }

    /**
     * Getter for the to property.
     *
     * @property to
     *
     * @returns {String}
     */
    get to() {
        return this.properties.to;
    }

    /**
     * Setter for the to property.
     *
     * @property to
     *
     * @param {String} to
     */
    set to(to) {
        this.properties.to = new Address(to).toString();
    }

    /**
     * Getter of the data property.
     *
     * @property data
     *
     * @returns {String}
     */
    get data() {
        return this.properties.data;
    }

    /**
     * Setter of the data property.
     *
     * @property data
     *
     * @param {String} data
     */
    set data(data) {
        if (!data) {
            return;
        }

        if (Hex.isValid(data)) {
            this.properties.data = data;

            return;
        }

        throw new Error('The data field must be HEX encoded data.');
    }

    /**
     * Getter of the gas property.
     *
     * @property gas
     *
     * @returns {String}
     */
    get gas() {
        return this.properties.gas;
    }

    /**
     * Setter of the gas property.
     *
     * @property gas
     *
     * @param {Number} gas
     */
    set gas(gas) {
        if (gas || gas === 0) {
            this.properties.gas = Hex.fromNumber(gas).toString();
        }
    }

    /**
     * Getter of the gasPrice property.
     *
     * @property gasPrice
     *
     * @returns {String}
     */
    get gasPrice() {
        return this.properties.gasPrice;
    }

    /**
     * Setter of the gasPrice property.
     *
     * @property gasPrice
     *
     * @param {Number} gasPrice
     */
    set gasPrice(gasPrice) {
        if (gasPrice || gasPrice === 0) {
            this.properties.gasPrice = Hex.fromNumber(gasPrice).toString();
        }
    }

    /**
     * Getter of the properties property.
     *
     * @property properties
     *
     * @returns {String}
     */
    get value() {
        return this.properties.value;
    }

    /**
     * Setter of the properties property.
     *
     * @property properties
     *
     * @param {Number} value
     */
    set value(value) {
        if (value || value === 0) {
            this.properties.value = Hex.fromNumber(value).toString();
        }
    }

    /**
     * Getter of the nonce property.
     *
     * @property nonce
     *
     * @returns {String}
     */
    get nonce() {
        return this.properties.nonce;
    }

    /**
     * Setter of the nonce property.
     *
     * @property nonce
     *
     * @param {Number} nonce
     */
    set nonce(nonce) {
        if (nonce || nonce === 0) {
            this.properties.nonce = Hex.fromNumber(nonce).toString();
        }
    }

    /**
     * Returns the options as JSON serializable object.
     *
     * @method toJSON
     *
     * @returns {Object}
     */
    toJSON() {
        return this.properties;
    }
}
