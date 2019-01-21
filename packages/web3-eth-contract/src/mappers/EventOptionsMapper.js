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
 * @file EventOptionsMapper.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {isArray} from 'lodash';

export default class EventOptionsMapper {
    /**
     * @param {Object} formatters
     * @param {EventFilterEncoder} eventFilterEncoder
     *
     * @constructor
     */
    constructor(formatters, eventFilterEncoder) {
        this.formatters = formatters;
        this.eventFilterEncoder = eventFilterEncoder;
    }

    /**
     * @param {AbiItemModel} abiItemModel
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {Object}
     */
    map(abiItemModel, contract, options) {
        if (!options) {
            options = {};
        }

        if (!isArray(options.topics)) {
            options.topics = [];
        }

        if (typeof options.fromBlock !== 'undefined') {
            options.fromBlock = this.formatters.inputBlockNumberFormatter(options.fromBlock);
        } else if (contract.defaultBlock !== null) {
            options.fromBlock = contract.defaultBlock;
        }

        if (typeof options.toBlock !== 'undefined') {
            options.toBlock = this.formatters.inputBlockNumberFormatter(options.toBlock);
        }

        if (!abiItemModel.anonymous) {
            options.topics.unshift(abiItemModel.signature);
        }

        if (typeof options.filter !== 'undefined') {
            options.topics = options.topics.concat(this.eventFilterEncoder.encode(abiItemModel, options.filter));
        }

        if (!options.address) {
            options.address = contract.address;
        }

        return options;
    }
}
