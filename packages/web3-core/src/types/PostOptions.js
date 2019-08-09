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
 * @file PostOptions.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import isArray from 'lodash/isArray';
import Hex from './Hex';
import Utf8 from './Utf8';

export default class PostOptions {
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
     * @property value
     *
     * @param {Object} options
     */
    set value(options) {
        if (options.ttl) {
            options.ttl = Hex.fromNumber(options.ttl).toString();
        }

        if (options.workToProve) {
            options.workToProve = Hex.fromNumber(options.workToProve).toString();
        }

        if (options.priority) {
            options.priority = Hex.fromNumber(options.priority).toString();
        }

        // fallback
        if (!isArray(options.topics)) {
            options.topics = options.topics ? [options.topics] : [];
        }

        // format the following options
        options.topics = options.topics.map((topic) => {
            // convert only if not hex
            if (topic.indexOf('0x') === 0) {
                return topic;
            }

            return new Utf8(topic).toHex();
        });

        this._value = options;
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
