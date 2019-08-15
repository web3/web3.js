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
 * @file AllEventsOptionsMapper.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {BlockNumber} from 'web3-core';
import isArray from 'lodash/isArray';

// TODO: Remove code duplication and create a AbstractEventsOptionsMapper
export default class AllEventsOptionsMapper {
    /**
     * @param {AllEventsFilterEncoder} allEventsFilterEncoder
     *
     * @constructor
     */
    constructor(allEventsFilterEncoder) {
        this.allEventsFilterEncoder = allEventsFilterEncoder;
    }

    /**
     * @param {AbiModel} abiModel
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {Object}
     */
    map(abiModel, contract, options) {
        if (!options) {
            options = {};
        }

        if (!isArray(options.topics)) {
            options.topics = [];
        }

        if (typeof options.fromBlock !== 'undefined') {
            options.fromBlock = new BlockNumber(options.fromBlock).toString();
        } else if (contract.defaultBlock !== null) {
            options.fromBlock = contract.defaultBlock;
        }

        if (typeof options.toBlock !== 'undefined') {
            options.toBlock = new BlockNumber(options.toBlock).toString();
        }

        if (typeof options.filter !== 'undefined') {
            options.topics = options.topics.concat(this.allEventsFilterEncoder.encode(abiModel, options.filter));
            delete options.filter;
        }

        if (!options.address) {
            options.address = contract.address;
        }

        return options;
    }
}
