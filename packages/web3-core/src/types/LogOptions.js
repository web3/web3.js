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
 * @file LogOptions.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import isArray from 'lodash/isArray';
import Utf8 from './Utf8';
import Address from './Address';
import BlockNumber from './BlockNumber';
import AbstractType from '../../lib/types/AbstractType';

export default class LogOptions extends AbstractType {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options) {
        super(options);

        this.fromBlock = options.fromBlock;
        this.toBlock = options.toBlock;
        this.topics = options.topics;
        this.address = options.address;
    }

    /**
     * Getter for the fromBlock property
     *
     * @property fromBlock
     *
     * @returns {String}
     */
    get fromBlock() {
        return this.properties.fromBlock;
    }

    /**
     * Setter for the fromBlock property
     *
     * @property fromBlock
     *
     * @param {any}
     */
    set fromBlock(fromBlock) {
        if (fromBlock) {
            this.properties.fromBlock = new BlockNumber(fromBlock).toString();
        }
    }

    /**
     * Getter for the toBlock property
     *
     * @property toBlock
     *
     * @returns {String}
     */
    get toBlock() {
        return this.properties.toBlock;
    }

    /**
     * Getter for the toBlock property
     *
     * @property toBlock
     *
     * @param {String} toBlock
     */
    set toBlock(toBlock) {
        if (toBlock) {
            this.properties.toBlock = new BlockNumber(toBlock).toString();
        }
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
     * @param {any} topics
     */
    set topics(topics) {
        // make sure topics, get converted to hex
        if (isArray(topics)) {
            this.properties.topics = topics.map((topic) => {
                if (isArray(topic)) {
                    return topic.map(this.toTopic);
                }

                return this.toTopic(topic);
            });

            return;
        }

        this.properties.topics = [];
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
     * Setter for the address property.
     *
     * @property address
     *
     * @param {String} address
     */
    set address(address) {
        if (address) {
            if (isArray(address)) {
                this.properties.address = address.map((addr) => {
                    return new Address(addr).toString();
                });

                return;
            }

            this.properties.address = new Address(this.properties.address).toString();
        }
    }

    /**
     * Converts the given topic to a hex string
     *
     * @method toTopic
     *
     * @param {string} properties
     *
     * @returns {string}
     */
    toTopic(properties) {
        if (properties === null || typeof properties === 'undefined') {
            return null;
        }

        properties = String(properties);

        if (properties.indexOf('0x') === 0) {
            return properties;
        }

        return new Utf8(properties).toHex();
    }
}
