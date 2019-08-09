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

export default class LogOptions {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options) {
        this._value = null;
        this.value = options;
    }

    /**
     * Setter for the value property.
     *
     * @param {Object} options
     */
    set value(options) {
        if (options.fromBlock) {
            options.fromBlock = new BlockNumber(options.fromBlock).toString();
        }

        if (options.toBlock) {
            options.toBlock = new BlockNumber(options.toBlock).toString();
        }

        // make sure topics, get converted to hex
        if (isArray(options.topics)) {
            options.topics = options.topics.map((topic) => {
                if (isArray(topic)) {
                    return topic.map(this.toTopic);
                }

                return this.toTopic(topic);
            });
        } else {
            options.topics = [];
        }

        if (options.address) {
            if (isArray(options.address)) {
                options.address = options.address.map((addr) => {
                    return new Address(addr).toString();
                });
            } else {
                options.address = new Address(options.address).toString();
            }
        }

        this._value = options;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {null|Object}
     */
    get value() {
        return this._value;
    }

    /**
     * Converts the given topic to a hex string
     *
     * @method toTopic
     *
     * @param {string} value
     *
     * @returns {string}
     */
    toTopic(value) {
        if (value === null || typeof value === 'undefined') {
            return null;
        }

        value = String(value);

        if (value.indexOf('0x') === 0) {
            return value;
        }

        return new Utf8(value).toHex();
    }
}
