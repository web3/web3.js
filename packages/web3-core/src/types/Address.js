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

import Iban from '';
import AbstractType from '../../lib/types/AbstractType';

export default class Address extends AbstractType {
    /**
     * @param {String} address
     *
     * @constructor
     */
    constructor(address) {
        super(address);

        this.address = address;
    }

    /**
     * Getter for the address property.
     *
     * @property address
     *
     * @returns {String}
     */
    get address() {
        return this.properties;
    }

    /**
     * Setter for the address property.
     *
     * @property address
     *
     * @param {String} address
     */
    set address(address) {
        const iban = new Iban(address);

        if (iban.isValid() && iban.isDirect()) {
            this.properties = iban.toAddress().toLowerCase();
        }

        if (Address.isValid(address)) {
            this.properties = `0x${address.toLowerCase().replace('0x', '')}`;
        }

        throw new Error(
            `Provided address "${address}" is invalid, the capitalization checksum test failed, or its an indirect IBAN address which can't be converted.`
        );
    }
}
