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
 * @file BlockNumber.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import isString from 'lodash/isString';
import Hex from './Hex';
import AbstractType from '../../lib/types/AbstractType';

export default class BlockNumber extends AbstractType {
    /**
     * @param {String|Number} blockNumber
     *
     * @constructor
     */
    constructor(blockNumber) {
        super(blockNumber);

        this.blockNumber = blockNumber;
    }

    /**
     * Setter for the blockNumber property
     *
     * @property blockNumber
     *
     * @param {any} blockNumber
     */
    set blockNumber(blockNumber) {
        if (blockNumber === undefined || blockNumber === null || BlockNumber.isPredefinedBlockNumber(blockNumber)) {
            this.value = blockNumber;

            return;
        }

        if (Hex.isStrict(blockNumber)) {
            if (isString(blockNumber)) {
                return blockNumber.toLowerCase();
            }

            this.value = blockNumber;

            return;
        }

        super.value = Hex.fromNumber(blockNumber);
    }

    /**
     * Getter for the blockNumber property.
     *
     * @property blockNumber
     *
     * @returns {String}
     */
    get blockNumber() {
        return this.value;
    }

    /**
     * Checks if the given blockNumber value is a pre-defined block number.
     *
     * @method isPredefinedBlockNumber
     *
     * @param blockNumber
     *
     * @returns {Boolean}
     */
    static isPredefinedBlockNumber(blockNumber) {
        return ['latest', 'pending', 'earliest'].includes(blockNumber);
    }
}
