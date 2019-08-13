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
 * @file Transaction
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import Hex from './Hex';
import BigNumber from '@ethersproject/bignumber';
import TransactionReceipt from './TransactionReceipt';

export default class Transaction extends TransactionReceipt {
    /**
     * @param {Object} transaction
     *
     * @constructor
     */
    constructor(transaction) {
        super(transaction);

        this.nonce = transaction.nonce;
        this.gasPrice = transaction.gasPrice;
        this.value = transaction.value;
    }

    /**
     * Getter for the input property.
     *
     * @property input
     *
     * @returns {String}
     */
    get input() {
        return this.properties.input;
    }

    /**
     * Setter for the input property,
     *
     * @property input
     *
     * @param {String} input
     */
    set input(input) {
        this.properties.input = input;
    }

    /**
     * Getter for the nonce property.
     *
     * @property nonce
     *
     * @returns {Number}
     */
    get nonce() {
        return this.properties.nonce;
    }

    /**
     * Setter for the nonce property.
     *
     * @property nonce
     *
     * @param {String} nonce
     */
    set nonce(nonce) {
        this.properties.nonce = new Hex(nonce).toNumber();
    }

    /**
     * Getter for the v property.
     *
     * @property v
     *
     * @returns {String}
     */
    get v() {
        return this.properties.v;
    }

    /**
     * Setter for the v property.
     *
     * @property v
     *
     * @param {String} v
     */
    set v(v) {
        this.properties.v = v;
    }

    /**
     * Getter for the r property.
     *
     * @proeprty r
     *
     * @returns {String}
     */
    get r() {
        return this.properties.r;
    }

    /**
     * Setter for the r property.
     *
     * @property r
     *
     * @param r
     */
    set r(r) {
        this.properties.r = r;
    }

    /**
     * Getter for the s property.
     *
     * @property s
     *
     * @returns {String}
     */
    get s() {
        return this.properties.s;
    }

    /**
     * Setter for the s property.
     *
     * @property s
     *
     * @param {String} s
     */
    set s(s) {
        this.properties.s = s;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {String|Number}
     */
    get value() {
        return this.properties.value;
    }

    /**
     * Setter for the value property.
     *
     * @property value
     *
     * @param {String} value
     */
    set value(value) {
        this.properties.value = new BigNumber(value).toString(10);
    }

    /**
     * Getter for the gasPrice property.
     *
     * @property gasPrice
     *
     * @returns {String}
     */
    get gasPrice() {
        return this.properties.gasPrice;
    }

    /**
     * Setter for the gasPrice property.
     *
     * @property gasPrice
     *
     * @param gasPrice
     */
    set gasPrice(gasPrice) {
        this.properties.gasPrice = new BigNumber(gasPrice).toString(10);
    }
}
