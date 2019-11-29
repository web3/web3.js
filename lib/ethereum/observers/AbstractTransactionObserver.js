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
 * @file AbstractTransactionObserver.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2019
 */

export default class AbstractTransactionObserver {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Number} timeout
     * @param {Number} blockConfirmations
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     *
     * @constructor
     */
    constructor(provider, timeout, blockConfirmations, getTransactionReceiptMethod) {
        this.provider = provider;
        this.timeout = timeout;
        this.blockConfirmations = blockConfirmations;
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;

        this.confirmations = 0;
        this.confirmationChecks = 0;
    }

    /**
     * Observes the transaction by the given transactionHash
     *
     * @method observe
     *
     * @param {String} transactionHash
     *
     * @returns {Observable}
     */
    observe(transactionHash) {}

    /**
     * Calls the next callback method of the Observer
     *
     * @method emitNext
     *
     * @param {Object} receipt
     * @param {Observer} observer
     */
    emitNext(receipt, observer) {
        observer.next({receipt, confirmations: this.confirmations});
    }

    /**
     * Calls the error callback method of the Observer
     *
     * @method emitError
     *
     * @param {Error} error
     * @param {Object} receipt
     * @param {Observer} observer
     */
    emitError(error, receipt, observer) {
        observer.error({
            error,
            receipt,
            confirmations: this.confirmations,
            confirmationChecks: this.confirmationChecks
        });
    }

    /**
     * Checks if enough confirmations happened
     *
     * @method isConfirmed
     *
     *
     * @returns {Boolean}
     */
    isConfirmed() {
        return this.confirmations === this.blockConfirmations;
    }

    /**
     * Checks if the timeout time is reached
     *
     * @method isTimeoutTimeExceeded
     *
     * @returns {Boolean}
     */
    isTimeoutTimeExceeded() {
        return this.confirmationChecks === this.timeout;
    }

    /**
     * Returns the transaction receipt
     *
     * @method getTransactionReceipt
     *
     * @param {String} transactionHash
     *
     * @returns {Promise<Object|null>}
     */
    getTransactionReceipt(transactionHash) {
        this.getTransactionReceiptMethod.parameters = [transactionHash];

        return this.getTransactionReceiptMethod.execute();
    }
}
