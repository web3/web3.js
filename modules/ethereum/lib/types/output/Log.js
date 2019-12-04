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

import Hex from './Hex';
import Address from './Address';
import Hash from 'eth-lib/lib/hash';

export default class Log {
    /**
     * @param {Object} log
     *
     * @constructor
     */
    constructor(log) {
        this.properties = log;

        this.properties.id = this.generateId();
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
        return this.properties.id;
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
            this.properties.blockNumber = new Hex(blockNumber).toNumber();
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
        return this.properties.blockNumber;
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
            this.properties.transactionIndex = new Hex(transactionIndex).toNumber();
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
        return this.properties.transactionIndex;
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
            this.properties.logIndex = new Hex(logIndex).toNumber();
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
        return this.properties.logIndex;
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
            this.properties.address = Address.toChecksum(address);
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
        return this.properties.address;
    }

    /**
     * Getter for the removed property.
     *
     * @property removed
     *
     * @returns {Boolean}
     */
    get removed() {
        return this.properties.removed;
    }

    /**
     * Setter for the removed property.
     *
     * @property removed
     *
     * @param {Boolean} value
     */
    set removed(value) {
        this.properties.removed = value;
    }

    /**
     * Getter for the blockHash property.
     *
     * @property blockHash
     *
     * @returns {String}
     */
    get blockHash() {
        return this.properties.blockHash;
    }

    /**
     * Setter for the blockHash property.
     *
     * @property blockHash
     *
     * @param {String} value
     */
    set blockHash(value) {
        this.properties.blockHash = value;
    }

    /**
     * Getter for the transactionHash property.
     *
     * @property transactionHash
     *
     * @returns {String}
     */
    get transactionHash() {
        return this.properties.transactionHash;
    }

    /**
     * Setter for the transactionHash property.
     *
     * @property transactionHash
     *
     * @param {String} transactionHash
     */
    set transactionHash(transactionHash) {
        this.properties.transactionHash = transactionHash;
    }

    /**
     * Getter for the data property.
     *
     * @property data
     *
     * @returns {String}
     */
    get data() {
        return this.properties.data;
    }

    /**
     * Setter for the data property.
     *
     * @property data
     *
     * @param {String} data
     */
    set data(data) {
        this.properties.data = data;
    }

    /**
     * Getter for the topics property.
     *
     * @property topics
     *
     * @returns {Array<String>}
     */
    get topics() {
        return this.properties.topics;
    }

    /**
     * Setter for the topics property.
     *
     * @property topics
     *
     * @param topics
     */
    set topics(topics) {
        this.properties.topics = topics;
    }

    /**
     * Generates the id with the blockHash, transactionHash, and logIndex.
     *
     * @method generateId
     *
     * @returns {String|null}
     */
    generateId() {
        if (
            typeof this.properties.blockHash === 'string' &&
            typeof this.properties.transactionHash === 'string' &&
            typeof this.properties.logIndex === 'string'
        ) {
            const shaId = Hash.keccak256(
                this.properties.blockHash.replace('0x', '') +
                    this.properties.transactionHash.replace('0x', '') +
                    this.properties.logIndex.replace('0x', '')
            );

            shaId.replace('0x', '').substr(0, 8);

            return `log_${shaId}`;
        }

        return null;
    }
}
