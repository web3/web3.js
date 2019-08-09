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
 * @file Post.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import Hex from './Hex';
import AbstractType from '../../lib/types/AbstractType';

export default class Post extends AbstractType {
    /**
     * @param {Object} post
     *
     * @constructor
     */
    constructor(post) {
        super(post);

        this.expiry = post.expiry;
        this.sent = post.sent;
        this.ttl = post.ttl;
        this.workProved = post.workProved;
        this.topics = post.topics;
    }

    /**
     * Setter for the expiry property
     *
     * @property expiry
     *
     * @param {String} expiry
     */
    set expiry(expiry) {
        this.value.expiry = new Hex(expiry).toNumber();
    }

    /**
     * Getter for the expiry property
     *
     * @property expiry
     *
     * @returns {Number}
     */
    get expiry() {
        return this.value.expiry;
    }

    /**
     * Setter for the sent property
     *
     * @property sent
     *
     * @param {String} sent
     */
    set sent(sent) {
        this.value.sent = new Hex(sent).toNumber();
    }

    /**
     * Getter for the sent property
     *
     * @property sent
     *
     * @returns {Number}
     */
    get sent() {
        return this.value.sent;
    }

    /**
     * Setter for the ttl property
     *
     * @property ttl
     *
     * @param {String} ttl
     */
    set ttl(ttl) {
        this.value.ttl = new Hex(ttl).toNumber();
    }

    /**
     * Getter for the ttl property
     *
     * @property ttl
     *
     * @returns {Number}
     */
    get ttl() {
        return this.value.ttl;
    }

    /**
     * Setter for the workProved property
     *
     * @property workProved
     *
     * @param {String} workProved
     */
    set workProved(workProved) {
        return new Hex(workProved).toNumber();
    }

    /**
     * Getter for the workProved property
     *
     * @property workProved
     *
     * @returns {Number}
     */
    get workProved() {
        return this.value.workProved;
    }

    /**
     * Setter for the topics property
     *
     * @property topics
     *
     * @param {Array<String>} topics
     */
    set topics(topics) {
        if (!topics) {
            this.value.topics = topics;
        }

        this.value.topics = topics.map((topic) => {
            return new Hex(topic).toUtf8();
        });
    }

    /**
     * Getter for the topics property
     *
     * @property topics
     *
     * @returns {Number}
     */
    get topics() {
        return this.value.topics;
    }

    /**
     * Setter for the payload property.
     *
     * @param {Object} payload
     */
    set payload(payload) {
        this.value.payload = new Hex(payload).toAscii();
    }

    /**
     * Getter for the payload property
     *
     * @property payload
     *
     * @returns {Number}
     */
    get payload() {
        return this.value.payload;
    }
}
