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
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     * @param {GetBlockMethod} getBlockMethod
     * @param {NewHeadsSubscription} newHeadsSubscription
     *
     * @constructor
     */
    constructor(getTransactionReceiptMethod, getBlockMethod, newHeadsSubscription) {
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;
        this.getBlockMethod = getBlockMethod;
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
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Observable}
     */
    observe(transactionHash, moduleInstance) {
        return Observable.create((observer) => {
            if (this.isSocketBasedProvider(moduleInstance.currentProvider)) {
                this.startSocketObserver(transactionHash, moduleInstance, observer);
            } else {
                this.startHttpObserver(transactionHash, moduleInstance, observer);
            }
        });
    }

    /**
     * Observes the transaction with the newHeads subscriptions which sends the eth_getTransactionReceipt method on each item
     *
     * @method startSocketObserver
     *
     * @param {String} transactionHash
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Observer} observer
     */
    startSocketObserver(transactionHash, moduleInstance, observer) {
        // TODO: Improve moduleInstance handling for subscriptions
        this.newHeadsSubscription.moduleInstance = moduleInstance;

        this.newHeadsSubscription.subscribe((newHead) => {
                this.getTransactionReceiptMethod.parameters = [transactionHash];

                this.getTransactionReceiptMethod.execute(moduleInstance).then((receipt) => {
                    if (receipt) {
                        this.confirmations++;

                        observer.next(receipt);

                        if (this.isConfirmed(moduleInstance)) {
                            this.newHeadsSubscription.unsubscribe();

                            observer.complete(receipt);
                        }
                    }

                    this.confirmationChecks++;

                    if (this.isTimeoutTimeExceeded(moduleInstance)) {
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
     * @param {AbstractWeb3Module} moduleInstance
     * @param {Observer} observer
     */
    startHttpObserver(transactionHash, moduleInstance, observer) {
        const interval = setInterval(async () => {
            this.getTransactionReceiptMethod.parameters = [transactionHash];

            const receipt = await this.getTransactionReceiptMethod.execute(moduleInstance);

            if (receipt) {
                const block = await this.getBlock(receipt.blockHash, moduleInstance);

                if (!this.lastBlock) {
                    this.lastBlock = block;
                    this.confirmations++;
                    observer.next(receipt);
                }

                if (this.lastBlock.hash === block.parentHash) {
                    this.confirmations++;
                    observer.next(receipt);

                    if (this.isConfirmed(moduleInstance)) {
                        clearInterval(interval);
                        observer.complete(receipt);
                    }

                    this.lastBlock = block;
                }

            }

            this.confirmationChecks++;

            if (this.isTimeoutTimeExceeded(moduleInstance)) {
                clearInterval(interval);
                observer.error('Timeout exceeded during the transaction confirmation observation!');
            }
        }, 1000);
    }

    /**
     * Returns a the block by the given blockHash
     *
     * @method getBlock
     *
     * @param {String} blockHash
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<Object>}
     */
    getBlock(blockHash, moduleInstance) {
        this.getBlockMethod.parameters = [blockHash];

        return this.getBlockMethod.execute(moduleInstance);
    }

    /**
     * Checks if enough confirmations happened
     *
     * @method isConfirmed
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    isConfirmed(moduleInstance) {
        return this.confirmations >= moduleInstance.transactionConfirmationBlocks;
    }

    /**
     * Checks if the timeout time is reached
     *
     * @method isTimeoutTimeExceeded
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Boolean}
     */
    isTimeoutTimeExceeded(moduleInstance) {
        let confirmationChecks = moduleInstance.transactionBlockTimeout;

        if (this.isSocketBasedProvider(moduleInstance.currentProvider)) {
            confirmationChecks = moduleInstance.transactionPollingTimeout;
        }

        return this.confirmationChecks > confirmationChecks;
    }

    /**
     * Checks if the given provider is a socket based provider.
     *
     * @method isSocketBasedProvider
     *
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     *
     * @returns {Boolean}
     */
    isSocketBasedProvider(provider) {
        switch (provider.constructor.name) {
            case 'CustomProvider':
            case 'HttpProvider':
                return false;
            default:
                return true;
        }
    }
}
