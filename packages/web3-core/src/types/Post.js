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

export default class Post {
    /**
     * @param {Object} post
     *
     * @constructor
     */
    constructor(post) {
        this._value = null;
        this.value = post;
    }

    /**
     * Setter for the value property.
     *
     * @property value
     *
     * @param {Object} post
     */
    set value(post) {
        post.expiry = new Hex(post.expiry).toNumber();
        post.sent = new Hex(post.sent).toNumber();
        post.ttl = new Hex(post.ttl).toNumber();
        post.workProved = new Hex(post.workProved).toNumber();

        // TODO: Check why out-commented
        // post.payloadRaw = post.payload;
        // post.payload = Utils.hexToAscii(post.payload);

        // if (Utils.isJson(post.payload)) {
        //     post.payload = JSON.parse(post.payload);
        // }

        // format the following options
        if (!post.topics) {
            post.topics = [];
        }

        post.topics = post.topics.map((topic) => {
            return new Hex(topic).toUtf8();
        });

        this._value = post;
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
