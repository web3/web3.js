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
 * @file TransactionConfirmationModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class TransactionConfirmationModel {

    /**
     * @constructor
     */
    constructor() {
        this.confirmations = [];
        this.timeoutCounter = 0;
        this._pollingTimeout = 15;
        this.timeoutBlock = 50;
        this.confirmationBlocks = 24;
    }

    /**
     * Getter for pollingTimeout
     *
     * @property pollingTimeout
     *
     * @returns {Number}
     */
    get pollingTimeout() {
        return this._pollingTimeout * this.timeoutBlock;
    }

    /**
     * Setter for pollingTimeout
     *
     * @property pollingTimeout
     *
     * @param {Number} value
     */
    set pollingTimeout(value) {
        this._pollingTimeout = value;
    }

    /**
     * Adds a receipt to the confirmation array
     *
     * @method addConfirmation
     *
     * @param {Object} receipt
     */
    addConfirmation(receipt) {
        this.confirmations.push(receipt);
    }

    /**
     * Checks if enough confirmations are registered to set the transaction as approved
     *
     * @method isConfirmed
     *
     * @returns {Boolean}
     */
    isConfirmed() {
        return this.confirmations.length === (this.confirmationBlocks + 1);
    }

    /**
     * Checks if the timeout time is exceeded
     *
     * @method isTimeoutTimeExceeded
     *
     * @returns {Boolean}
     */
    isTimeoutTimeExceeded(watcherIsPolling) {
        if (watcherIsPolling) {
            return (this.timeoutCounter - 1) >= this.pollingTimeout;
        }

        return (this.timeoutCounter - 1) >= this.timeoutBlock;
    }
}
