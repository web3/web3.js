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
     * @returns {Number}
     */
    get gasLimit() {
        return this.properties.gasLimit;
    }

    /**
     * Setter for the gasLimit property.
     *
     * @property gasLimit
     */
    set gasLimit(gasLimit) {
        this.properties.gasLimit = new Hex(gasLimit).toNumber();
    }

    /**
     * Getter for the gasUsed property.
     *
     * @property gasUsed
     *
     * @returns {Number}
     */
    get gasUsed() {
        return this.properties.gasUsed;
    }

    /**
     * Setter for the gasUsed property.
     *
     * @property gasUsed
     */
    set gasUsed(gasUsed) {
        this.properties.gasUsed = new Hex(gasUsed).toNumber();
    }

    /**
     * Getter for the size property.
     *
     * @property size
     *
     * @returns {Number}
     */
    get size() {
        return this.properties.size;
    }

    /**
     * Setter for the size property.
     *
     * @property size
     */
    set size(size) {
        this.properties.size = new Hex(size).toNumber();
    }

    /**
     * Getter for the timestamp property.
     *
     * @property timestamp
     *
     * @returns {String|Number}
     */
    get timestamp() {
        return this.properties.timestamp;
    }

    /**
     * Setter for the timestamp property.
     *
     * @property timestamp
     */
    set timestamp(timestamp) {
        timestamp = new BigNumber(timestamp);

        if (timestamp.bitLength() <= 53) {
            timestamp = timestamp.toNumber();
        } else {
            timestamp = timestamp.toString(10);
        }

        this.properties.timestamp = timestamp;
    }

    /**
     * Getter for the number property.
     *
     * @property number
     *
     * @returns {Number|null}
     */
    get number() {
        return this.properties.number;
    }

    /**
     * Getter for the number property.
     *
     * @property number
     */
    set number(number) {
        if (number !== null) {
            this.properties.number = new Hex(number).toNumber();
        }

        this.properties.number = number;
    }

    /**
     * Getter for the difficulty property.
     *
     * @property difficulty
     *
     * @returns {String}
     */
    get difficulty() {
        return this.properties.difficulty;
    }

    /**
     * Setter for the difficulty property.
     *
     * @property difficulty
     */
    set difficulty(difficulty) {
        if (difficulty) {
            this.properties.difficulty = new BigNumber(difficulty).toString(10);
        }
    }

    /**
     * Getter for the totalDifficulty property.
     *
     * @property totalDifficulty
     *
     * @returns {String}
     */
    get totalDifficulty() {
        return this.properties.totalDifficulty;
    }

    /**
     * Getter for the totalDifficulty property.
     *
     * @property totalDifficulty
     */
    set totalDifficulty(totalDifficulty) {
        if (totalDifficulty) {
            this.properties.totalDifficulty = new BigNumber(totalDifficulty).toString(10);
        }
    }

    /**
     * Getter for the transactions property.
     *
     * @property transactions
     *
     * @returns {Array<Transaction>}
     */
    get transactions() {
        return this.transactions;
    }

    /**
     * Getter for the transactions property.
     *
     * @property transactions
     */
    set transactions(transactions) {
        if (isArray(transactions)) {
            this.properties.transactions = transactions.map((item) => {
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
     * @returns {String}
     */
    get miner() {
        return this.properties.miner;
    }

    /**
     * Setter for the miner property.
     *
     * @property miner
     */
    set miner(miner) {
        if (miner) {
            this.properties.miner = new Address(miner).toChecksumAddress();
        }
    }
}
