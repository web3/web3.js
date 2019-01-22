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

import isArray from 'lodash/isArray';

export default class EventFilterEncoder {
    /**
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(abiCoder) {
        this.abiCoder = abiCoder;
    }

    /**
     * Creates encoded topics from filter option of an event.
     *
     * @param {AbiItemModel} abiItemModel
     * @param {*} filter
     *
     * @returns {Array}
     */
    encode(abiItemModel, filter) {
        const indexedInputs = abiItemModel.getIndexedInputs();
        let topics = [];

        indexedInputs.forEach((indexedInput) => {
            if (filter[indexedInput.name]) {
                let filterItem = filter[indexedInput.name];

                if (isArray(filterItem)) {
                    filterItem = filterItem.map((item) => {
                        return this.abiCoder.encodeParameter(indexedInput.type, item);
                    });

                    topics.push(filterItem);

                    return;
                }

                topics.push(this.abiCoder.encodeParameter(indexedInput.type, filterItem));
            }
        });

        return topics;
    }
}
