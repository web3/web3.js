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
 * @file AllEventsFilterEncoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var EventFilterEncoder = require('./EventFilterEncoder');

/**
 * @param {ABICoder} abiCoder
 *
 * @constructor
 */
function AllEventsFilterEncoder(abiCoder) {
    EventFilterEncoder.call(this, abiCoder);
}

/**
 * Creates encoded topics from filter option of an event.
 *
 * @param {ABIModel} abiModel
 * @param {*} filter
 *
 * @returns {Array}
 */
AllEventsFilterEncoder.prototype.encode = function (abiModel, filter) {
    var self = this,
        events = abiModel.getEvents(),
        topics = [];

    Object.keys(events).forEach(function (key) {
        topics.push(EventFilterEncoder.prototype.encode.call(self, events[key], filter));
    });

    return topics;
};

AllEventsFilterEncoder.prototype = Object.create(EventFilterEncoder.prototype);
AllEventsFilterEncoder.prototype.constructor = AllEventsFilterEncoder;

module.exports = AllEventsFilterEncoder;
