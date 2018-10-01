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
 * @file EventLogDecoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ABICoder} abiCoder
 * @param {Object} formatters
 *
 * @constructor
 */
function EventLogDecoder(abiCoder, formatters) {
    this.abiCoder = abiCoder;
    this.formatters = formatters;
}

/**
 * Decodes the event subscription response
 *
 * @method decoder
 *
 * @param {ABIItemModel} abiItemModel
 * @param {Object} response
 *
 * @returns {Object}
 */
EventLogDecoder.prototype.decode = function(abiItemModel, response) {
    response.data = response.data || '';
    response.topics = response.topics || [];

    // // if allEvents get the right event
    // if(event.name === 'ALLEVENTS') {
    //     event = event.jsonInterface.find(function (intf) {
    //         return (intf.signature === data.topics[0]);
    //     }) || {anonymous: true};
    // }

    var argTopics = response.topics;
    if (abiItemModel.anonymous) {
        argTopics = response.topics.slice(1);
    }

    var result = this.formatters.outputLogFormatter(response);
    result.returnValues = this.abiCoder.decodeLog(abiItemModel.getInputs(), response.data, argTopics);

    // add name
    result.event = abiItemModel.name;

    // add signature
    result.signature = data.topics[0];

    if (event.anonymous || !data.topics[0]) {
        result.signature = null;
    }

    // move the data and topics to "raw"
    result.raw = {
        data: result.data,
        topics: result.topics
    };

    delete result.returnValues.__length__;
    delete result.data;
    delete result.topics;

    return result;
};

module.exports = EventLogDecoder;
