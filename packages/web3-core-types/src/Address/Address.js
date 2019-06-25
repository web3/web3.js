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
import {isObject, isString, assign} from 'lodash';
import Iban from './Iban';

export default class Address {
    /**
     * @dev Wrap as object
     * @param {String} address
     * @param {boolean} isChecksummed
     *
     * @constructor
     */
    constructor(params) {
        if (!isObject(params)) {
            params = {
                address: params
            };
        }

        assign(this, params);
    }

    /**
     * Set the address property
     *
     * @property from
     */
    set address(value) {
        if (isString(value) && /^(0x)?([0-9a-fA-F]{40})$/.test(value)) {
            this._address = value.replace(/^(0x)([0-9a-fA-F]{40})$/, '0x$2');
            this._isChecksummed = Address.isValid(this._address);

            return;
        }

        throw new Error(
            `The given "address" parameter "${value}" needs to be hex encoded (numbers and letters, a through f), supplied as a string.\n` +
                'Addresses may be prefixed with 0x and are 40 hex characters long.'
        );
    }

    /**
     * Check for a valid checksum if the address is supposed to be
     * checksummed
     *
     * @method isValid
     *
     * @param {String} address
     *
     * @returns {boolean}
     */
    static isValid(value) {
        if (!isString(value)) {
            return false;
        }

        const address = value.replace('0x', '');

        const addressHash = sha3(address.toLowerCase())
            .toLowerCase()
            .replace('0x', '');

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const isChecksummed = address.split('').every((v, i) => {
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
    static toChecksum(value) {
        const address = value.replace('0x', '');

        const addressHash = sha3(address.toLowerCase())
            .toLowerCase()
            .replace('0x', '');

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const checksummed = address
            .split('')
            .map((v, i) => {
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
     * Change an address to make it checksummed
     *
     * @method toChecksum
     *
     * @returns {Address}
     */
    toChecksum() {
        return Address.toChecksum(this._address);
    }

    /**
     * Check for a valid checksum of the caller
     *
     * @method isValid
     *
     * @returns {boolean}
     */
    isValid() {
        return this._isChecksummed;
    }

    /**
     * Override toString to print the plaintext address
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return this._address;
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
