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
import AbstractType from '../../lib/types/AbstractType';

export default class PostOptions extends AbstractType {
    /**
     * @param {Object} options
     *
     * @constructor
     */
    constructor(options) {
        super(options);

        this.value.ttl = options.ttl;
        this.value.workToProve = options.workToProve;
        this.value.priority = options.priority;
        this.value.topics = options.topics;
    }

    /**
     * Getter for the ttl property.
     *
     * @property ttl
     *
     * @returns {Number}
     */
    get ttl() {
        return this.value.ttl;
    }

    /**
     * Setter for the ttl property.
     *
     * @property ttl
     *
     * @param {Number} ttl
     */
    set ttl(ttl) {
        if (ttl) {
            this.value.ttl = Hex.fromNumber(ttl).toString();
        }
    }

    /**
     * Getter for the workToProve property.
     *
     * @property workToProve
     *
     * @returns {String}
     */
    get workToProve() {
        return this.value.workToProve;
    }

    /**
     * Setter for the workToProve property.
     *
     * @property workToProve
     *
     * @param {String} workToProve
     */
    set workToProve(workToProve) {
        if (workToProve) {
            this.value.workToProve = Hex.fromNumber(workToProve).toString();
        }
    }

    /**
     * Getter for the priority property.
     *
     * @property priority
     *
     * @returns {String}
     */
    get priority() {
        return this.value.priority;
    }

    /**
     * Setter for the priority property.
     *
     * @property priority
     *
     * @param {Number} priority
     */
    set priority(priority) {
        if (priority) {
            this.value.priority = Hex.fromNumber(this.value.priority).toString();
        }
    }

    /**
     * Getter for the topics array.
     *
     * @property topics
     *
     * @returns {Array<String>}
     */
    get topics() {
        return this.value.topics;
    }

    /**
     * Setter for the topics property.
     *
     * @property topics
     *
     * @param {any} topics
     */
    set topics(topics) {
        if (!isArray(topics)) {
            if (topics) {
                this.value.topics = [topics];

                return;
            }

            this.value.topics = [];
        }

        // format the following options
        this.value.topics = this.value.topics.map((topic) => {
            // convert only if not hex
            if (topic.startsWith('0x') === 0) {
                return topic;
            }

            return new Utf8(topic).toHex();
        });
    }
}
