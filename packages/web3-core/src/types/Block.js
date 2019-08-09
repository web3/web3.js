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
 * @file Block.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import Hex from './Hex';
import Address from './Address';
import BigNumber from './BigNumber';
import Transaction from './Transaction';

export default class Block {
    /**
     * @param {Object} block
     *
     * @constructor
     */
    constructor(block) {
        this._value = null;
        this.value = block;
    }

    /**
     * Setter for the value property.
     *
     * @property value
     *
     * @param block
     */
    set value(block) {
        block.gasLimit = new Hex(block.gasLimit).toNumber();
        block.gasUsed = new Hex(block.gasUsed).toNumber();
        block.size = new Hex(block.size).toNumber();

        const timestamp = new BigNumber(block.timestamp);

        if (timestamp.bitLength() <= 53) {
            block.timestamp = timestamp.toNumber();
        } else {
            block.timestamp = timestamp.toString(10);
        }

        if (block.number !== null) {
            block.number = new Hex(block.number).toNumber();
        }

        if (block.difficulty) {
            block.difficulty = new BigNumber(block.difficulty).toString(10);
        }

        if (block.totalDifficulty) {
            block.totalDifficulty = new BigNumber(block.totalDifficulty).toString(10);
        }

        if (isArray(block.transactions)) {
            block.transactions = block.transactions.map((item) => {
                if (!isString(item)) {
                    return new Transaction(item).toObject();
                }
            });
        }

        if (block.miner) {
            block.miner = new Address(block.miner).toChecksumAddress();
        }

        this._value = block;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {null|Object}
     */
    get value() {
        return this._value;
    }
}
