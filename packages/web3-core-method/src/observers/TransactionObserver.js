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
 * @file TransactionObserver.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable} from 'rxjs';

export default class TransactionObserver {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Number} timeout
     * @param {Number} blockConfirmations
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     * @param {GetBlockByHashMethod} getBlockByHashMethod
     * @param {NewHeadsSubscription} newHeadsSubscription
     *
     * @constructor
     */
    constructor(
        provider,
        timeout,
        blockConfirmations,
        getTransactionReceiptMethod,
        getBlockByHashMethod,
        newHeadsSubscription
    ) {
        this.provider = provider;
        this.timeout = timeout;
        this.blockConfirmations = blockConfirmations;
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;
        this.getBlockByHashMethod = getBlockByHashMethod;
        this.newHeadsSubscription = newHeadsSubscription;

        this.lastBlock = false;
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
    observe(transactionHash) {
        return Observable.create((observer) => {
            if (this.isSocketBasedProvider()) {
                this.startSocketObserver(transactionHash, observer);
            } else {
                this.startHttpObserver(transactionHash, observer);
            }
        });
    }

    /**
     * Observes the transaction with the newHeads subscriptions which sends the eth_getTransactionReceipt method on each item
     *
     * @method startSocketObserver
     *
     * @param {String} transactionHash
     * @param {Observer} observer
     */
    startSocketObserver(transactionHash, observer) {
        this.newHeadsSubscription.subscribe(() => {
            this.getTransactionReceiptMethod.parameters = [transactionHash];

            this.getTransactionReceiptMethod.execute().then((receipt) => {
                if (receipt) {
                    this.confirmations++;

                    observer.next({receipt, count: this.confirmations});

                    if (this.isConfirmed()) {
                        this.newHeadsSubscription.unsubscribe();

                        observer.complete();
                    }
                }

                this.confirmationChecks++;

                if (this.isTimeoutTimeExceeded()) {
                    this.newHeadsSubscription.unsubscribe();

                    observer.error('Timeout exceeded during the transaction confirmation observation!');
                }
            });
        });
    }

    /**
     * Observes the transaction with sending eth_getTransactionReceipt and checking if there is really a new block
     *
     * @method checkOverHttp
     *
     * @param {String} transactionHash
     * @param {Observer} observer
     */
    startHttpObserver(transactionHash, observer) {
        const interval = setInterval(async () => {
            try {
                this.getTransactionReceiptMethod.parameters = [transactionHash];

                const receipt = await this.getTransactionReceiptMethod.execute();

                if (receipt) {
                    if (this.lastBlock) {
                        const block = await this.getBlock(receipt.blockHash);
                        if(this.isValidConfirmation(block)) {
                            this.confirmations++;
                            observer.next({receipt, count: this.confirmations});
                            this.lastBlock = block;
                        }
                    } else {
                        this.lastBlock = await this.getBlock(receipt.blockHash);
                        this.confirmations++;
                        observer.next({receipt, count: this.confirmations});
                    }

                    if (this.isConfirmed()) {
                        clearInterval(interval);
                        observer.complete();
                    }
                }

                this.confirmationChecks++;

                if (this.isTimeoutTimeExceeded()) {
                    clearInterval(interval);
                    observer.error('Timeout exceeded during the transaction confirmation observation!');
                }
            } catch (error) {
                clearInterval(interval);
                observer.error(error);
            }
        }, 1000);
    }

    /**
     * Returns a the block by the given blockHash
     *
     * @method getBlock
     *
     * @param {String} blockHash
     *
     * @returns {Promise<Object>}
     */
    getBlock(blockHash) {
        this.getBlockByHashMethod.parameters = [blockHash];

        return this.getBlockByHashMethod.execute();
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
     * Checks if the given provider is a socket based provider.
     *
     * @method isSocketBasedProvider
     *
     * @returns {Boolean}
     */
    isSocketBasedProvider() {
        switch (this.provider.constructor.name) {
            case 'CustomProvider':
            case 'HttpProvider':
                return false;
            default:
                return true;
        }
    }
}
