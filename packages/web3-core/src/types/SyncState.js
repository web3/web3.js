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
 * @file SyncState.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import Hex from './Hex';
import AbstractType from '../../lib/types/AbstractType';

export default class SyncState {
    /**
     * @param {Object} syncState
     *
     * @constructor
     */
    constructor(syncState) {
        this.properties = syncState;

        this.startingBlock = syncState.startingBlock;
        this.currentBlock = syncState.currentBlock;
        this.highestBlock = syncState.highestBlock;
        this.knownStates = syncState.knownStates;
        this.pulledStates = syncState.pulledStates;
    }

    /**
     * Getter for the startingBlock property.
     *
     * @property startingBlock
     *
     * @returns {Number}
     */
    get startingBlock() {
        return this.properties.startingBlock;
    }

    /**
     * Setter for the startingBlock property.
     *
     * @property startingBlock
     *
     * @param {String} startingBlock
     */
    set startingBlock(startingBlock) {
        this.properties.startingBlock = new Hex(startingBlock).toNumber();
    }

    /**
     * Getter for the currentBlock property.
     *
     * @property currentBlock
     *
     * @returns {String}
     */
    get currentBlock() {
        return this.properties.currentBlock;
    }

    /**
     * Setter for the currentBlock property.
     *
     * @property currentBlock
     *
     * @param {String} currentBlock
     */
    set currentBlock(currentBlock) {
        this.properties.currentBlock = new Hex(currentBlock).toNumber();
    }

    /**
     * Getter for the highestBlock property.
     *
     * @property highestBlock
     *
     * @returns {Number}
     */
    get highestBlock() {
        return this.properties.highestBlock;
    }

    /**
     * Setter for the highestBlock property.
     *
     * @property highestBlock
     *
     * @param {String} highestBlock
     */
    set highestBlock(highestBlock) {
        this.properties.highestBlock = new Hex(highestBlock).toNumber();
    }

    /**
     * Getter for the knownStates property.
     *
     * @property knownStates
     *
     * @returns {Number}
     */
    get knownStates() {
        return this.properties.knownStates;
    }

    /**
     * Setter for the knownStates property.
     *
     * @property knownStates
     *
     * @param {String} knownStates
     */
    set knownStates(knownStates) {
        if (knownStates) {
            this.properties.knownStates = new Hex(knownStates).toNumber();
        }
    }

    /**
     * Getter for the pulledStates property.
     *
     * @property pulledStates
     *
     * @returns {Number}
     */
    get pulledStates() {
        return this.properties.pulledStates;
    }

    /**
     * Setter for the pulledStates property.
     *
     * @property pulledStates
     *
     * @param {String} pulledStates
     */
    set pulledStates(pulledStates) {
        if (pulledStates) {
            this.properties.pulledStates = new Hex(pulledStates).toNumber();
        }
    }
}
