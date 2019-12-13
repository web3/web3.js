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

import Address from './Address';
import Hex from "../../../../core/src/utility/Hex";
import TransactionOptionsProperties from "./interfaces/TransactionOptionsProperties";

export default class TransactionOptions {
    /**
     * @property properties
     */
    private properties: any;

    /**
     * TODO: Add optional config parameter and handle default values
     *
     * @param {TransactionOptionsProperties} txOptions
     *
     * @constructor
     */
    public constructor(txOptions: TransactionOptionsProperties) {
        if (!txOptions.from) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        this.properties = txOptions;

        this.from = txOptions.from;
        this.to = txOptions.to;
        this.data = txOptions.data;
        this.gas = txOptions.gas;
        this.gasPrice = txOptions.gasPrice;
        this.value = txOptions.value;
        this.nonce = txOptions.nonce;
    }

    /**
     * Getter for the from property.
     *
     * @property from
     *
     * @returns {String}
     */
    public get from() {
        return this.properties.from;
    }

    /**
     * Setter for the from property.
     *
     * @property from
     *
     * @param {String} from
     */
    public set from(from: string) {
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
    public get to() {
        return this.properties.to;
    }

    /**
     * Setter for the to property.
     *
     * @property to
     *
     * @param {String} to
     */
    public set to(to: string) {
        this.properties.to = new Address(to).toString();
    }

    /**
     * Getter of the data property.
     *
     * @property data
     *
     * @returns {String}
     */
    public get data() {
        return this.properties.data;
    }

    /**
     * Setter of the data property.
     *
     * @property data
     *
     * @param {String} data
     */
    public set data(data: string) {
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
    public get gas() {
        return this.properties.gas;
    }

    /**
     * Setter of the gas property.
     *
     * @property gas
     *
     * @param {Number} gas
     */
    public set gas(gas: number) {
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
    public get gasPrice() {
        return this.properties.gasPrice;
    }

    /**
     * Setter of the gasPrice property.
     *
     * @property gasPrice
     *
     * @param {Number} gasPrice
     */
    public set gasPrice(gasPrice: number) {
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
    public get value() {
        return this.properties.value;
    }

    /**
     * Setter of the properties property.
     *
     * @property properties
     *
     * @param {Number} value
     */
    public set value(value: number) {
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
    public get nonce() {
        return this.properties.nonce;
    }

    /**
     * Setter of the nonce property.
     *
     * @property nonce
     *
     * @param {Number} nonce
     */
    public set nonce(nonce: number) {
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
    public toJSON() {
        return this.properties;
    }
}
