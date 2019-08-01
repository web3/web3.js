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
 * @file Address.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import {sha3} from 'web3-utils';
import isString from 'lodash/isString';
import Iban from './Iban';

export default class Address {
    /**
     * @param {String} address
     *
     * @constructor
     */
    constructor(address) {
        this.value = address;
    }

    /**
     * Set the address property
     *
     * @property value
     */
    set value(address) {
        if (!Address.isValid(address)) {
            throw new Error(
                `The given address ${address} needs to be prefixed with 0x and hex encoded (numbers and letters, a through f), supplied as a string.`
            );
        }

        this._value = address;
    }

    /**
     * Get the hashed value of an address
     *
     * @method hashAddress
     *
     * @param {String} address
     *
     * @returns {String}
     */
    static hashAddress(address) {
        return sha3(address.replace('0x', '').toLowerCase())
            .toLowerCase()
            .replace('0x', '');
    }

    /**
     * Check for a valid checksum
     *
     * @method isValid
     *
     * @param {String} address
     *
     * @returns {boolean}
     */
    static isValid(address) {
        if (!isString(address)) {
            return false;
        }

        const addressHash = Address.hashAddress(address);

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const isChecksummed = address
            .replace('0x', '')
            .split('')
            .every((v, i) => {
                /* test for digit ? test for 8 or higher || test for uppercase hex : true */
                return !/^\d$/.test(v) ? !/^[8-9a-f]$/.test(addressHash[i]) || /^[A-F]$/.test(v) : true;
            });

        return isChecksummed;
    }

    /**
     * Change an address to make it checksummed
     *
     * @method toChecksum
     *
     * @param {String} address
     *
     * @returns {Address}
     */
    static toChecksum(address) {
        const addressHash = Address.hashAddress(address);

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const checksummed = address
            .replace('0x', '')
            .split('')
            .map((v, i) => {
                /* (test for digit && test for 8 or higher) ? to uppercase : to lowercase */
                return !/^\d$/.test(v) && /^[8-9a-f]$/.test(addressHash[i]) ? v.toUpperCase() : v.toLowerCase();
            })
            .join('');

        return new Address(`0x${checksummed}`);
    }

    /**
     * Create an Address object from an IBAN string
     *
     * @param {String} iban
     *
     * @returns {Address}
     */
    static fromIban(iban) {
        return new Address(Iban.toAddress(iban));
    }

    /**
     * Check for a valid checksum of the caller
     *
     * @method isValid
     *
     * @returns {boolean}
     */
    isValid() {
        return Address.isValid(this._value);
    }

    /**
     * Override toString to print the plaintext address
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return this._value.toString();
    }

    /**
     * Declare the type of the object
     *
     * @method isAddress
     *
     * @return {boolean}
     */
    isAddress() {
        return true;
    }
}
