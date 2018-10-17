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

        /**
         * Defines accessors for POLLINGTIMEOUT. This is the average block time (seconds) * TIMEOUTBLOCK
         */
        Object.defineProperty(this, 'POLLINGTIMEOUT', {
            get() {
                return 15 * this.TIMEOUTBLOCK;
            },
            set() {
            },
            enumerable: true
        });

        /**
         * Defines accessors for TIMEOUTBLOCK
         */
        Object.defineProperty(this, 'TIMEOUTBLOCK', {
            get() {
                return 50;
            },
            set() {
            },
            enumerable: true
        });

        /**
         * Defines accessors for CONFIRMATIONBLOCKS
         */
        Object.defineProperty(this, 'CONFIRMATIONBLOCKS', {
            get() {
                return 24;
            },
            set() {
            },
            enumerable: true
        });

        /**
         * Defines accessors for confirmationsCount
         */
        Object.defineProperty(this, 'confirmationsCount', {
            get() {
                return this.confirmations.length;
            },
            set() {
            },
            enumerable: true
        });
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
        return this.confirmationsCount === (this.CONFIRMATIONBLOCKS + 1);
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
            return (this.timeoutCounter - 1) >= this.POLLINGTIMEOUT;
        }

        return (this.timeoutCounter - 1) >= this.TIMEOUTBLOCK;
    }
}
