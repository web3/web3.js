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
 * @file MessagesSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription';

export default class MessagesSubscription extends AbstractSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Configuration} moduleInstance
     *
     * @constructor
     */
    constructor(options, utils, formatters, moduleInstance) {
        super('shh_subscribe', 'messages', options, utils, formatters, moduleInstance);
    }
}
