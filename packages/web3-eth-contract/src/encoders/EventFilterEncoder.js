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

/**
 * @param {String} type
 * @param {String | Number} param
 * @param {AbiCoder} abiCoder
 *
 * @returns {String} encoded plain param
 */
const encodeParameter = (type, param, abiCoder) => {
    if (type === 'string' || type === 'string[]') {
        return abiCoder.utils.keccak256(param);
    }

    return abiCoder.encodeParameter(type, param);
};

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
        let topics = [];

        abiItemModel.getIndexedInputs().forEach((input) => {
            if (filter[input.name]) {
                let filterItem = filter[input.name];

                if (isArray(filterItem)) {
                    filterItem = filterItem.map((item) => {
                        return encodeParameter(input.type, item, this.abiCoder);
                    });

                    topics.push(filterItem);

                    return;
                }

                topics.push(encodeParameter(input.type, filterItem, this.abiCoder));

                return;
            }

            topics.push(null);
        });

        return topics;
    }
}
