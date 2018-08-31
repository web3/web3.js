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

/**
 * @constructor
 */
function TransactionConfirmationModel() {
    this.confirmations = [];
    this.timeoutCounter = 0;
}

/**
 * Defines accessors for POLLINGTIMEOUT. This is the average block time (seconds) * TIMEOUTBLOCK
 *
 * Created empty setter that it acts like a constant.
 */
Object.defineProperty(TransactionConfirmationModel, 'POLLINGTIMEOUT', {
    get: function () {
        return 15 * this.TIMEOUTBLOCK;
    },
    set: function () {},
    enumerable: true
});

/**
 * Defines accessors for TIMEOUTBLOCK
 *
 * Created empty setter that it acts like a constant.
 */
Object.defineProperty(TransactionConfirmationModel, 'TIMEOUTBLOCK', {
    get: function () {
        return 50;
    },
    set: function () {},
    enumerable: true
});

/**
 * Defines accessors for CONFIRMATIONBLOCKS
 *
 * Created empty setter that it acts like a constant.
 */
Object.defineProperty(TransactionConfirmationModel, 'CONFIRMATIONBLOCKS', {
    get: function () {
        return 24;
    },
    set: function () {},
    enumerable: true
});

/**
 * Defines accessors for confirmationsCount
 */
Object.defineProperty(TransactionConfirmationModel, 'confirmationsCount', {
    get: function () {
        return this.confirmations.length;
    },
    set: function () {},
    enumerable: true
});

/**
 * Adds a receipt to the confirmation array
 *
 * @method addConfirmation
 *
 * @param {Object} receipt
 */
TransactionConfirmationModel.prototype.addConfirmation = function (receipt) {
    this.confirmations.push(receipt);
};

/**
 * Checks if enough confirmations are registered to set the transaction as approved
 *
 * @method isConfirmed
 *
 * @returns {boolean}
 */
TransactionConfirmationModel.prototype.isConfirmed = function () {
    return this.confirmationsCount === (this.CONFIRMATIONBLOCKS + 1);
};

/**
 * Checks if the timeout time is exceeded
 *
 * @method isTimeoutTimeExceeded
 *
 * @returns {boolean}
 */
TransactionConfirmationModel.prototype.isTimeoutTimeExceeded = function (watcherIsPolling) {
    if (watcherIsPolling) {
        return (this.timeoutCounter - 1) >= this.POLLINGTIMEOUT;
    }

    return (this.timeoutCounter - 1) >= this.TIMEOUTBLOCK;
};

module.exports = TransactionConfirmationModel;
