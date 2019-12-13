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
 * @file Block.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {BigNumber} from '@ethersproject/bignumber';
import {isArray, isString} from 'lodash';
import Transaction from './Transaction';
import Hex from "../../../../core/src/utility/Hex";
import Address from "../input/Address";
import BlockProperties from './interfaces/block/BlockProperties';

export default class Block {
    /**
     * @property gasLimit
     */
    public gasLimit: number;

    /**
     * @property gasUsed
     */
    public gasUsed: number;

    /**
     * @property size
     */
    public size: number;

    /**
     * @property timestamp
     */
    public timestamp: string | number;

    /**
     * @property number
     */
    public number: number | null = null;

    /**
     * @property difficulty
     */
    public difficulty: string = '';

    /**
     * @property totalDifficulty
     */
    public totalDifficulty: string = '';

    /**
     * @property transactions
     */
    public transactions: Transaction[] | string[] = [];

    /**
     * @property miner
     */
    public miner: string = '';

    /**
     * @param {BlockProperties} block
     *
     * @constructor
     */
    public constructor(block: BlockProperties) {
        this.gasLimit = new Hex(block.gasLimit).toNumber();
        this.gasUsed = new Hex(block.gasUsed).toNumber();
        this.size = new Hex(block.size).toNumber();

        const value = BigNumber.from(block.timestamp);

        try {
            this.timestamp = value.toNumber();
        } catch (error) {
            this.timestamp = value.toString();
        }

        if (block.number) {
            this.number = new Hex(block.number).toNumber();
        }

        if (block.difficulty) {
            this.difficulty = BigNumber.from(block.difficulty).toString();
        }

        if (block.totalDifficulty) {
            this.totalDifficulty = BigNumber.from(block.totalDifficulty).toString();
        }

        if (isArray(block.transactions)) {
            this.transactions = <Transaction[] | string[]>block.transactions.map(
                (item: object | string): Transaction | string => {
                    if (!isString(item)) {
                        return new Transaction(item);
                    }

                    return item;
                }
            );
        }

        if (block.miner) {
            this.miner = Address.toChecksum(block.miner);
        }
    }

    /**
     * @method toJSON
     */
    toJSON() {
        return {
          gasLimit: this.gasLimit,
          gasUsed: this.gasUsed,
          size: this.size,
          timestamp: this.timestamp,
          number: this.number,
          difficulty: this.difficulty,
          totalDifficulty: this.totalDifficulty,
          transactions: this.transactions,
          miner: this.miner
        };
    }
}
