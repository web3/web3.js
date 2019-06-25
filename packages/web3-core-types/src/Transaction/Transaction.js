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
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import * as Types from '..';
import BigNumber, {isBigNumber} from 'bignumber.js';
import {isNaN, isInteger, isString, isNil, assign} from 'lodash';

export default class Transaction {
    /**
     * @dev Wrap as object
     * @param {Address|Number|String} from
     * @param {Address|"deploy"} to
     * @param {Number|BigNumber|String|"none"} value
     * @param {Number|"auto"} gas
     * @param {Number|BigNumber|String|"auto"} gasPrice
     * @param {String|"none"} data
     * @param {Number|"auto"} nonce
     * @param {Number|"main"} chainId
     *
     * @constructor
     */
    constructor(params) {
        assign(this, params);
    }

    /**
     * Set the from property
     *
     * @property from
     */
    set from(value) {
        if (value.isAddress || isInteger(value)) {
            this._from = value;
            return;
        }

        if (isString(value) && Types.Address.isValid(value)) {
            this._from = new Types.Address(value);
            return;
        }

        throw new Error(
            `The given "from" parameter "${value}" needs to be an address string, an Address object, or a wallet index number.`
        );
    }

    /**
     * Gets the from property
     *
     * @property from
     *
     * @returns {String} from
     */
    get from() {
        if (!isNil(this._from)) {
            return this._from.toString();
        }
    }

    /**
     * Set the to property
     *
     * @property to
     */
    set to(value) {
        if (value.isAddress || value === 'deploy') {
            this._to = value;
            return;
        }

        if (isString(value) && Types.Address.isValid(value)) {
            this._to = new Types.Address(value);
            return;
        }

        throw new Error(`The given "to" parameter "${value}" needs to be an address or 'deploy' when deploying code.`);
    }

    /**
     * Gets the to property. Returns undefined for 'deploy'
     *
     * @property to
     *
     * @returns {String} to
     */
    get to() {
        if (!isNil(this._to) && this._to !== 'deploy') {
            return this._to.toString();
        }
    }

    /**
     * Set the value property
     *
     * @property value
     */
    set value(value) {
        if (
            (!isNaN(value) && Number.isInteger(value) && value >= 0) ||
            isBigNumber(value) ||
            (typeof value === 'string' && /(\d)+/gm.test(value) && BigNumber(value))
        ) {
            this._value = BigNumber(value.toString());
            return;
        }

        if (value === undefined || value === 'none') {
            this._value = BigNumber(0);
            return;
        }

        throw new Error(
            `The given "value" parameter "${value}" needs to be zero or positive, and in number, BigNumber or string format.\n` +
                'Use "none" to add 0 ether to the transaction.'
        );
    }

    /**
     * Gets the value property
     *
     * @property value
     *
     * @returns {String} value
     */
    get value() {
        if (!isNil(this._value)) {
            return this._value.toString();
        }
    }

    /**
     * Set the gas property
     *
     * @property gas
     */
    set gas(value) {
        if (Number.isInteger(value)) {
            this._gas = value;
            return;
        }

        if (value === undefined || value === 'auto') {
            this._gas = 'auto';
            return;
        }

        throw new Error(
            `The given "gas" parameter "${value}" needs to be an integer.\n` +
                'Use "auto" to set the gas the node calculates.'
        );
    }

    /**
     * Gets the gas property
     *
     * @property gas
     *
     * @returns {String} gas
     */
    get gas() {
        if (!isNil(this._gas)) {
            return this._gas.toString();
        }
    }

    /**
     * Set the gasPrice property
     *
     * @property gasPrice
     */
    set gasPrice(value) {
        if (
            (!isNaN(value) && Number.isInteger(value) && value >= 0) ||
            isBigNumber(value) ||
            (typeof value === 'string' && BigNumber(value))
        ) {
            this._gasPrice = BigNumber(value.toString());
            return;
        }

        if (value === undefined || value === 'auto') {
            this._gasPrice = 'auto';
            return;
        }

        throw new Error(
            `The given "gasPrice" parameter "${value}" needs to be zero or positive, and in number, BigNumber or string format.\n` +
                'Use "auto" to set the gas price the node calculates.'
        );
    }

    /**
     * Gets the gasPrice property
     *
     * @property gasPrice
     *
     * @returns {String} gasPrice
     */
    get gasPrice() {
        if (!isNil(this._gasPrice)) {
            return this._gasPrice.toString();
        }
    }

    /**
     * Set the data property
     *
     * @property data
     */
    set data(value) {
        if (value.isHex) {
            this._data = value;
            return;
        }

        if (Types.Hex.isValid(value)) {
            this._data = new Types.Hex(value);
            return;
        }

        if (value === undefined || value === 'none') {
            this._data = new Types.Hex('empty');
            return;
        }

        throw new Error(
            `The given "data" parameter "${value}" needs to be hex encoded or class Hex.\n` +
                "Use 'none' for no payload."
        );
    }

    /**
     * Gets the data property
     *
     * @property data
     *
     * @returns {String} data
     */
    get data() {
        if (!isNil(this._data)) {
            return this._data.toString();
        }
    }

    /**
     * Set the nonce property
     *
     * @property nonce
     */
    set nonce(value) {
        if (value === 0 || Number.isInteger(value)) {
            this._nonce = value;
            return;
        }

        if (value === undefined || value === 'auto') {
            this._nonce = 'auto';
            return;
        }

        throw new Error(
            `The given "nonce" parameter "${value}" needs to be an integer.\n` +
                "Use 'auto' to set the RPC-calculated nonce."
        );
    }

    /**
     * Gets the nonce property
     *
     * @property nonce
     *
     * @returns {Number} nonce
     */
    get nonce() {
        if (isInteger(this._nonce)) {
            return parseInt(this._nonce);
        }
    }

    /**
     * Set the chianId property
     *
     * @property chainId
     */
    set chainId(value) {
        if (isInteger(value)) {
            this._chainId = value.toString();
            return;
        }

        if (/main/i.test(value)) {
            this._chainId = '1';
            return;
        }

        throw new Error(
            `The given "chainId" parameter "${value}" needs to be an integer.\n` +
                "Use 'main' to set the chain ID to mainnet."
        );
    }

    /**
     * Gets the chainId property
     *
     * @property chainId
     *
     * @returns {String} chainId
     */
    get chainId() {
        if (!isNil(this._chainId)) {
            return this._chainId.toString();
        }
    }

    /**
     * Check if the transaction has valid content
     *
     * @method isValid
     *
     * @return {boolean|Error}
     *
     */
    isValid() {}

    /**
     * Override toString to print the transaction object
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return {
            from: this._from,
            to: this._to,
            gas: this._gas,
            gasPrice: this._gasPrice,
            value: this._value,
            data: this._data,
            nonce: this._nonce
        }.toString();
    }

    /**
     * Declare the type of the object
     *
     * @method isTransaction
     *
     * @return {boolean}
     */
    isTransaction() {
        return true;
    }
}
