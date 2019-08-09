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
import AbstractType from '../../lib/types/AbstractType';

export default class Block extends AbstractType {
    /**
     * @param {Object} block
     *
     * @constructor
     */
    constructor(block) {
        super();

        this.gasLimit = block.gasLimit;
        this.gasUsed = block.gasUsed;
        this.size = block.size;
        this.timestamp = block.timestamp;
        this.number = block.number;
        this.difficulty = block.difficulty;
        this.totalDifficulty = block.totalDifficulty;
        this.transactions = block.transactions;
        this.miner = block.miner;
        this.rawValue = block;
    }

    /**
     * Getter for the gasLimit property.
     *
     * @property gasLimit
     *
     * @returns {*}
     */
    get gasLimit() {
        return this.rawValue.gasLimit;
    }

    /**
     * Setter for the gasLimit property.
     *
     * @property gasLimit
     *
     * @returns {*}
     */
    set gasLimit(gasLimit) {
        this.rawValue.gasLimit = new Hex(gasLimit).toNumber();
    }

    /**
     * Getter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {*}
     */
    get gasUsed() {
        return this.rawValue.gasUsed;
    }

    /**
     * Setter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {*}
     */
    set gasUsed(gasUsed) {
        this.rawValue.gasUsed = new Hex(gasUsed).toNumber();
    }

    /**
     * Getter for the size property.
     *
     * @property size
     *
     * @returns {*}
     */
    get size() {
        return this.rawValue.size;
    }

    /**
     * Setter for the size property.
     *
     * @property size
     *
     * @returns {*}
     */
    set size(size) {
        this.rawValue.size = new Hex(size).toNumber();
    }

    /**
     * Getter for the timestamp property.
     *
     * @property timestamp
     *
     * @returns {*}
     */
    get timestamp() {
        return this.value.timestamp;
    }

    /**
     * Setter for the timestamp property.
     *
     * @property timestamp
     *
     * @returns {*}
     */
    set timestamp(timestamp) {
        timestamp = new BigNumber(timestamp);

        if (timestamp.bitLength() <= 53) {
            timestamp = timestamp.toNumber();
        } else {
            timestamp = timestamp.toString(10);
        }

        this.rawValue.timestamp = timestamp;
    }

    /**
     * Getter for the number property.
     *
     * @property number
     *
     * @returns {*}
     */
    get number() {
        return this.value.number;
    }

    /**
     * Getter for the number property.
     *
     * @property number
     *
     * @returns {*}
     */
    set number(number) {
        if (number !== null) {
            this.rawValue.number = new Hex(number).toNumber();
        }

        this.rawValue.number = number;
    }

    /**
     * Getter for the difficulty property.
     *
     * @property difficulty
     *
     * @returns {}
     */
    get difficulty() {
        return this.rawValue.difficulty;
    }

    /**
     * Setter for the difficulty property.
     *
     * @property difficulty
     *
     * @returns {}
     */
    set difficulty(difficulty) {
        if (difficulty) {
            this.rawValue.difficulty = new BigNumber(difficulty).toString(10);
        }
    }

    /**
     * Getter for the totalDifficulty property.
     *
     * @property totalDifficulty
     *
     * @returns {}
     */
    get totalDifficulty() {
        return this.rawValue.totalDifficulty;
    }

    /**
     * Getter for the totalDifficulty property.
     *
     * @property totalDifficulty
     *
     * @returns {}
     */
    set totalDifficulty(totalDifficulty) {
        if (totalDifficulty) {
            this.rawValue.totalDifficulty = new BigNumber(totalDifficulty).toString(10);
        }
    }

    /**
     * Getter for the transactions property.
     *
     * @property transactions
     *
     * @returns {}
     */
    get transactions() {
        return this.rawValue.transactions;
    }

    /**
     * Getter for the transactions property.
     *
     * @property transactions
     *
     * @returns {}
     */
    set transactions(transactions) {
        if (isArray(transactions)) {
            this.rawValue.transactions = transactions.map((item) => {
                if (!isString(item)) {
                    return new Transaction(item).toObject();
                }
            });
        }
    }

    /**
     * Getter for the miner property.
     *
     * @property miner
     *
     * @returns {*|string|string}
     */
    get miner() {
        return this.rawValue.miner;
    }

    /**
     * Setter for the miner property.
     *
     * @property miner
     *
     * @returns {*|string|string}
     */
    set miner(miner) {
        if (miner) {
            this.rawValue.miner = new Address(miner).toChecksumAddress();
        }
    }
}
