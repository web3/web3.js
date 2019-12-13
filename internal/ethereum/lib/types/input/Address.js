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
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import Hex from "../../../../core/src/utility/Hex";
import {keccak256} from 'eth-lib/lib/hash';
import Iban from './Iban';

export default class Address {
    /**
     * TODO: Add IBAN compatibility
     *
     * @param {String} address
     *
     * @constructor
     */
    constructor(address) {
        this.address = address;
    }

    /**
     * Setter for the address property
     *
     * @property address
     *
     * @param {String} address
     */
    set address(address) {
        const iban = new Iban(address);

        if (iban.isValid() && iban.isDirect()) {
            this._address = iban.toAddress().toLowerCase();

            return;
        }

        if (Address.isValid(address)) {
            this._address = address.toLowerCase();

            return;
        }

        throw new Error(
            `Provided address "${address}" is invalid, the capitalization checksum test failed, or its an indirect IBAN address which can't be converted.`
        );
    }

    /**
     * Getter for the address property.
     *
     * @property address
     *
     * @returns {String}
     */
    get address() {
        return this._address;
    }

    /**
     * Address property wrapper.
     *
     * @method toString
     *
     * @returns {String}
     */
    toString() {
        return this.address;
    }

    /**
     * Returns the checksum of the current address
     *
     * @method toChecksum
     *
     * @param {Number} chainId
     *
     * @returns {String}
     */
    toChecksum(chainId = null) {
        return Address.toChecksum(this.address, chainId);
    }

    /**
     * Maps the given address to a checksum address.
     *
     * @method toChecksum
     *
     * @param {String} address
     * @param {Number} chainId
     *
     * @returns {String}
     */
    static toChecksum(address, chainId = null) {
        const stripAddress = Hex.stripPrefix(address).toLowerCase();
        let prefix = '';

        if (chainId != null) {
            prefix = chainId.toString() + '0x';
        }

        const keccakHash = keccak256(prefix + stripAddress)
            .toString('hex')
            .replace(/^0x/i, '');

        let checksumAddress = '0x';

        for (let i = 0; i < stripAddress.length; i++) {
            if (parseInt(keccakHash[i], 16) >= 8) {
                checksumAddress += stripAddress[i].toUpperCase();
            } else {
                checksumAddress += stripAddress[i];
            }
        }

        return checksumAddress;
    }

    /**
     * Validate address checksum.
     *
     * @method isValidChecksum
     *
     * @param {String} address
     * @param {Number} chainId - RSKIP-60 https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
     *
     * @returns {Boolean}
     */
    static isValidChecksum(address, chainId = null) {
        return Address.toChecksum(address, chainId) === address;
    }

    /**
     * Validates the given address.
     *
     * @method isValid
     *
     * @param {String} address
     * @param {Number} chainId - RSKIP-60 https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
     *
     * @returns {Boolean}
     */
    static isValid(address, chainId = null) {
        // check if it has the basic requirements of an address
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        }

        // If it's ALL lowercase or ALL upppercase
        if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
            return true;
        }

        // Otherwise check each case
        return Address.isValidChecksum(address, chainId);
    }
}
