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

import {Observable} from 'rxjs';

export default class TransactionObserver {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Number} timeout
     * @param {Number} blockConfirmations
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     * @param {GetBlockByNumberMethod} getBlockByNumberMethod
     * @param {NewHeadsSubscription} newHeadsSubscription
     *
     * @constructor
     */
    constructor(
        provider,
        timeout,
        blockConfirmations,
        getTransactionReceiptMethod,
        getBlockByNumberMethod,
        newHeadsSubscription
    ) {
        this.provider = provider;
        this.timeout = timeout;
        this.blockConfirmations = blockConfirmations;
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;
        this.getBlockByNumberMethod = getBlockByNumberMethod;
        this.newHeadsSubscription = newHeadsSubscription;

        this.blockNumbers = [];
        this.lastBlock = false;
        this.confirmations = 0;
        this.confirmationChecks = 0;
        this.interval = false;
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
    observe(transactionHash) {
        return Observable.create((observer) => {
            if (this.provider.supportsSubscriptions()) {
                this.startSocketObserver(transactionHash, observer);
            } else {
                this.startHttpObserver(transactionHash, observer);
            }
        });
    }

    /**
     * Observes the transaction with the newHeads subscriptions which sends the cfx_getTransactionReceipt method on each item
     *
     * @method startSocketObserver
     *
     * @param {String} transactionHash
     * @param {Observer} observer
     */
    startSocketObserver(transactionHash, observer) {
        this.newHeadsSubscription.subscribe(async (error, newHead) => {
            try {
                if (observer.closed) {
                    await this.newHeadsSubscription.unsubscribe();

                    return;
                }

                if (error) {
                    throw error;
                }

                this.getTransactionReceiptMethod.parameters = [transactionHash];
                const receipt = await this.getTransactionReceiptMethod.execute();

                if (!this.blockNumbers.includes(newHead.number)) {
                    if (receipt) {
                        this.confirmations++;
                        this.emitNext(receipt, observer);

                        if (this.isConfirmed()) {
                            await this.newHeadsSubscription.unsubscribe();
                            observer.complete();
                        }
                    }

                    this.blockNumbers.push(newHead.number);
                    this.confirmationChecks++;

                    if (this.isTimeoutTimeExceeded()) {
                        await this.newHeadsSubscription.unsubscribe();

                        this.emitError(
                            new Error(
                                'Timeout exceeded during the transaction confirmation process. Be aware the transaction could still get confirmed!'
                            ),
                            receipt,
                            observer
                        );
                    }
                }
            } catch (error2) {
                this.emitError(error2, false, observer);
            }
        });
    }

    /**
     * Observes the transaction with sending cfx_getTransactionReceipt and checking if there is really a new block
     *
     * @method checkOverHttp
     *
     * @param {String} transactionHash
     * @param {Observer} observer
     */
    startHttpObserver(transactionHash, observer) {
        const interval = setInterval(async () => {
            try {
                if (observer.closed) {
                    clearInterval(interval);

                    return;
                }

                this.getTransactionReceiptMethod.parameters = [transactionHash];

                const receipt = await this.getTransactionReceiptMethod.execute();

                if (receipt) {
                    if (this.lastBlock) {
                        const block = await this.getBlockByNumber(this.increaseBlockNumber(this.lastBlock.number));

                        if (block && this.isValidConfirmation(block)) {
                            this.lastBlock = block;
                            this.confirmations++;
                            this.emitNext(receipt, observer);
                        }
                    } else {
                        this.lastBlock = await this.getBlockByNumber(receipt.blockNumber);
                        this.confirmations++;
                        this.emitNext(receipt, observer);
                    }

                    if (this.isConfirmed()) {
                        clearInterval(interval);
                        observer.complete();
                    }
                }

                this.confirmationChecks++;

                if (this.isTimeoutTimeExceeded()) {
                    clearInterval(interval);

                    this.emitError(
                        new Error(
                            'Timeout exceeded during the transaction confirmation process. Be aware the transaction could still get confirmed!'
                        ),
                        receipt,
                        observer
                    );
                }
            } catch (error) {
                clearInterval(interval);
                this.emitError(error, false, observer);
            }
        }, 1000);
    }

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
     * Returns a block by the given blockNumber
     *
     * @method getBlockByNumber
     *
     * @param {String} blockNumber
     *
     * @returns {Promise<Object>}
     */
    getBlockByNumber(blockNumber) {
        this.getBlockByNumberMethod.parameters = [blockNumber];

        return this.getBlockByNumberMethod.execute();
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
     * Checks if the new block counts as confirmation
     *
     * @method isValidConfirmation
     *
     * @param {Object} block
     *
     * @returns {Boolean}
     */
    isValidConfirmation(block) {
        return this.lastBlock.hash === block.parentHash && this.lastBlock.number !== block.number;
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
     * Increases the blockNumber hash by one.
     *
     * @method increaseBlockNumber
     *
     * @param {String} blockNumber
     *
     * @returns {String}
     */
    increaseBlockNumber(blockNumber) {
        return '0x' + (parseInt(blockNumber, 16) + 1).toString(16);
    }
}
