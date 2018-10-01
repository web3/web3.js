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
 * @file EventFilterEncoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ABICoder} abiCoder
 *
 * @constructor
 */
function EventFilterEncoder(abiCoder) {
    this.abiCoder = abiCoder;
}

/**
 * Creates encoded topics from filter option of an event.
 *
 * @param {ABIItemModel} abiItemModel
 * @param {*} filter
 *
 * @returns {Array}
 */
EventFilterEncoder.prototype.encode = function (abiItemModel, filter) {
    var indexedInputs = abiItemModel.getIndexedInputs(),
        topics = [],
        self = this;

    indexedInputs.forEach(function(indexedInput) {
        if (typeof filter[indexedInput.name] !== 'undefined') {
            var filterItem = filter[indexedInput.name];

            if (_.isArray(filterItem)) {
                filterItem.map(function(item) {
                    return self.abiCoder.encodeParameter(indexedInput.type, item);
                });

                topics.push(filterItem);

                return;
            }

            topics.push(self.abiCoder.encodeParameter(indexedInput.type, filterItem));
        }
    });

    return topics;
};
