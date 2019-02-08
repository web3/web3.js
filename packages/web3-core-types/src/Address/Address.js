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
import {cloneDeep, isBoolean, isObject} from 'lodash';

export default class Address {
    /**
     * @dev Wrap as object
     * @param {String} address
     * @param {boolean} isChecksummed
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        this.error = error;

        this.initParams = initParams;

        this.props = cloneDeep(initParams);

        if (!isObject(params)) {
            params = {
                address: params,
                isChecksummed: false
            };
        }

        /* Check for type and format validity */
        /* Check the address for minimum requirements */
        this.props.address = /^(0x)?([0-9a-fA-F]{40})$/gm.test(params.address)
            ? params.address.replace(/^(0x)([0-9a-fA-F]{40})$/gm, '0x$2')
            : undefined;

        /* If the address should be checksummed but isn't, throw. Otherwise, check and assign. */
        if (isBoolean(params.isChecksummed) && (params.isChecksummed && !Address.isValid(params.address))) {
            this.props.isChecksummed = params.isChecksummed;
        } else if (isBoolean(params.isChecksummed) && !params.isChecksummed) {
            this.props.isChecksummed = Address.isValid(this.props.address);
        }

        /* Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });

        /* Make the props immutable */
        Object.freeze(this.props);
    }

    /* Class functions */

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
    static isValid(_address) {
        /* Remove the prefix in case it still has it */
        const address = _address.replace('0x', '');

        /* Hash the lowercased address, make it lowercase, and remove the prefix if present */
        const addressHash = sha3(address.toLowerCase())
            .toLowerCase()
            .replace('0x', '');

        /* If the hex digit is not a number, it must be uppercase if
         *  the first bit of the binary value of
         *  the corresponding index of the hash
         *  i.e. if the hex value is between 8 and f. (1___) */
        const isChecksummed = address.split('').every((v, i) => {
            /* test for digit ? test for 8 or higher || test for uppercase hex : true */
            return !/\d/gm.test(v) ? !/[8-9a-f]/gm.test(addressHash[i]) || /[A-F]/gm.test(v) : true;
        });

        return isChecksummed;
    }

    /**
     * Change an address to make it checksummed
     *
     * @method toChecksum
     *
     * @param {Address} addressObj
     *
     * @returns {Address}
     */
    static toChecksum(addressObj) {
        /* Remove the prefix in case it still has it */
        const address = addressObj.props.address.replace('0x', '');

        /* Hash the lowercased address, make it lowercase, and remove the prefix if present */
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
                /* test for digit ? test for 8 or higher || to uppercase : to lowercase */
                return !/\d/gm.test(v) && /[8-9a-f]/gm.test(addressHash[i]) ? v.toUpperCase() : v.toLowerCase();
            })
            .join('');

        return new Address(
            {
                ...addressObj.props,
                address: `0x${checksummed}`,
                isChecksummed: true
            },
            addressObj.error,
            addressObj.initParams
        );
    }

    /* Instance accessors  */

    /**
     * Change an address to make it checksummed
     *
     * @method toChecksum
     *
     * @returns {Address}
     */
    toChecksum() {
        return Address.toChecksum(this);
    }

    /**
     * Check for a valid checksum of the caller
     *
     * @method isValid
     *
     * @returns {boolean}
     */
    isValid() {
        return this.props.isChecksummed;
    }

    /**
     * Override toString to print the plaintext address
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return this.props.address;
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

    /**
     * Wrap error throwing from the constructor for types
     *
     * @method _throw
     */
    _throw(message, value) {
        throw message(value);
    }
}
