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

export default class SyncState {
    /**
     * @param {Object} syncState
     *
     * @constructor
     */
    constructor(syncState) {
        this._value = null;
        this.value = syncState;
    }

    /**
     * Setter of the value property
     *
     * @property value
     *
     * @param {Object} syncState
     */
    set value(syncState) {
        syncState.startingBlock = new Hex(syncState.startingBlock).toNumber();
        syncState.currentBlock = new Hex(syncState.currentBlock).toNumber();
        syncState.highestBlock = new Hex(syncState.highestBlock).toNumber();

        if (syncState.knownStates) {
            syncState.knownStates = new Hex(syncState.knownStates).toNumber();
            syncState.pulledStates = new Hex(syncState.pulledStates).toNumber();
        }

        this._value = syncState;
    }

    /**
     * Getter of the value property.
     *
     * @property value
     *
     * @returns {Object}
     */
    get value() {
        return this._value;
    }
}
