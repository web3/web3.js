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

export default class BlockNumber {
    /**
     * @param {String|Number} blockNumber
     *
     * @constructor
     */
    constructor(blockNumber) {
        if (BlockNumber.isPredefinedBlockNumber(blockNumber)) {
            this._blockNumber = blockNumber;

            return;
        }

        if (Hex.isValid(blockNumber)) {
            this._blockNumber = new Hex(blockNumber);

            return;
        }

        this._blockNumber = Hex.fromNumber(blockNumber);
    }

    /**
     * Returns the blockNumber value as string
     *
     * @method toString
     *
     * @returns {String}
     */
    toString() {
        if (isString(this._blockNumber)) {
            return this._blockNumber;
        }

        return this._blockNumber.toString();
    }

    /**
     * Checks if the given blockNumber properties is a pre-defined block number.
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
