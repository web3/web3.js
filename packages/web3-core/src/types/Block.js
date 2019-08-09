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
        super(block);

        this.gasLimit = block.gasLimit;
        this.gasUsed = block.gasUsed;
        this.size = block.size;
        this.timestamp = block.timestamp;
        this.number = block.number;
        this.difficulty = block.difficulty;
        this.totalDifficulty = block.totalDifficulty;
        this.transactions = block.transactions;
        this.miner = block.miner;
    }

    /**
     * Getter for the gasLimit property.
     *
     * @property gasLimit
     *
     * @returns {*}
     */
    get gasLimit() {
        return this.value.gasLimit;
    }

    /**
     * Setter for the gasLimit property.
     *
     * @property gasLimit
     *
     * @returns {*}
     */
    set gasLimit(gasLimit) {
        this.value.gasLimit = new Hex(gasLimit).toNumber();
    }

    /**
     * Getter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {*}
     */
    get gasUsed() {
        return this.value.gasUsed;
    }

    /**
     * Setter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {*}
     */
    set gasUsed(gasUsed) {
        this.value.gasUsed = new Hex(gasUsed).toNumber();
    }

    /**
     * Getter for the size property.
     *
     * @property size
     *
     * @returns {*}
     */
    get size() {
        return this.value.size;
    }

    /**
     * Setter for the size property.
     *
     * @property size
     *
     * @returns {*}
     */
    set size(size) {
        this.value.size = new Hex(size).toNumber();
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

        this.value.timestamp = timestamp;
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
            this.value.number = new Hex(number).toNumber();
        }

        this.value.number = number;
    }

    /**
     * Getter for the difficulty property.
     *
     * @property difficulty
     *
     * @returns {}
     */
    get difficulty() {
        return this.value.difficulty;
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
            this.value.difficulty = new BigNumber(difficulty).toString(10);
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
        return this.value.totalDifficulty;
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
            this.value.totalDifficulty = new BigNumber(totalDifficulty).toString(10);
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
        return this.transactions;
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
            this.value.transactions = transactions.map((item) => {
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
        return this.value.miner;
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
            this.value.miner = new Address(miner).toChecksumAddress();
        }
    }
}
