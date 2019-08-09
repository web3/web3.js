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
 * @file Log.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import Crypto from '';
import Hex from './Hex';
import Address from './Address';

export default class Log {
    /**
     * @param {Object} log
     *
     * @constructor
     */
    constructor(log) {
        this._value = null;
        this.value = log;
    }

    /**
     * Setter of the value property.
     *
     * @property value
     *
     * @param {Object} log
     */
    set value(log) {
        // generate a custom log id
        if (
            typeof log.blockHash === 'string' &&
            typeof log.transactionHash === 'string' &&
            typeof log.logIndex === 'string'
        ) {
            const shaId = Crypto.keccak256(
                log.blockHash.replace('0x', '') + log.transactionHash.replace('0x', '') + log.logIndex.replace('0x', '')
            );

            shaId.replace('0x', '').substr(0, 8);

            log.id = `log_${shaId}`;
        } else if (!log.id) {
            log.id = null;
        }

        if (log.blockNumber !== null) {
            log.blockNumber = new Hex(log.blockNumber).toNumber();
        }

        if (log.transactionIndex !== null) {
            log.transactionIndex = new Hex(log.transactionIndex).toNumber();
        }

        if (log.logIndex !== null) {
            log.logIndex = new Hex(log.logIndex).toNumber();
        }

        if (log.address) {
            log.address = new Address(log.address).toChecksumAddress();
        }

        this._value = log;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {Object}
     */
    get value() {
        return this._value;
    }
}
