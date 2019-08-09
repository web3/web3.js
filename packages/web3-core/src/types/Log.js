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
import AbstractType from '../../lib/types/AbstractType';

export default class Log extends AbstractType {
    /**
     * @param {Object} log
     *
     * @constructor
     */
    constructor(log) {
        super(log);

        this.blockHash = log.blockHash;
        this.transactionHash = log.transactionHash;
        this.value.id = this.generateId(log);
        this.blockNumber = log.blockNumber;
        this.transactionIndex = log.transactionIndex;
        this.logIndex = log.logIndex;
        this.address = log.address;
    }

    /**
     * Getter for the id property.
     *
     * @property id
     *
     * @returns {String}
     */
    get id() {
        return this.value.id;
    }

    /**
     * Setter for the blockNumber property.
     *
     * @property blockNumber
     *
     * @param {String} blockNumber
     */
    set blockNumber(blockNumber) {
        if (blockNumber !== null) {
            this.value.blockNumber = new Hex(blockNumber).toNumber();
        }
    }

    /**
     * Getter for the blockNumber property.
     *
     * @property blockNumber
     *
     * @returns {Number}
     */
    get blockNumber() {
        return this.value.blockNumber;
    }

    /**
     * Setter for the transactionIndex property.
     *
     * @property transactionIndex
     *
     * @param {String} transactionIndex
     */
    set transactionIndex(transactionIndex) {
        if (transactionIndex !== null) {
            this.value.transactionIndex = new Hex(transactionIndex).toNumber();
        }
    }

    /**
     * Getter for the transactionIndex property.
     *
     * @property transactionIndex
     *
     * @returns {Number}
     */
    get transactionIndex() {
        return this.value.transactionIndex;
    }

    /**
     * Setter for the logIndex property.
     *
     * @property logIndex
     *
     * @param {String} logIndex
     */
    set logIndex(logIndex) {
        if (logIndex !== null) {
            this.value.logIndex = new Hex(logIndex).toNumber();
        }
    }

    /**
     * Getter for the logIndex property.
     *
     * @property logIndex
     *
     * @returns {Number}
     */
    get logIndex() {
        return this.value.logIndex;
    }

    /**
     * Setter for the address property.
     *
     * @property address
     *
     * @param {String} address
     */
    set address(address) {
        if (address) {
            this.value.address = new Address(address).toChecksumAddress();
        }
    }

    /**
     * Getter for the address property.
     *
     * @property address
     *
     * @returns {String}
     */
    get address() {
        return this.value.address;
    }

    /**
     * Generates the id with the blockHash, transactionHash, and logIndex.
     *
     * @method generateId
     *
     * @param log
     *
     * @returns {String|null}
     */
    generateId(log) {
        if (
            typeof log.blockHash === 'string' &&
            typeof log.transactionHash === 'string' &&
            typeof log.logIndex === 'string'
        ) {
            const shaId = Crypto.keccak256(
                log.blockHash.replace('0x', '') + log.transactionHash.replace('0x', '') + log.logIndex.replace('0x', '')
            );

            shaId.replace('0x', '').substr(0, 8);

            return `log_${shaId}`;
        }

        if (!log.id) {
            return null;
        }
    }
}
