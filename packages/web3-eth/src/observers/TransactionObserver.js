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
    constructor(
        provider,
        timeout,
        blockConfirmations,
        getTransactionReceiptMethod,
        getBlockMethod,
        newHeadsSubscription
    ) {
        this.provider = provider;
        this.timeout = timeout;
        this.blockConfirmations = blockConfirmations;
        this.getTransactionReceiptMethod = getTransactionReceiptMethod;
        this.getBlockMethod = getBlockMethod;
        this.newHeadsSubscription = newHeadsSubscription;

        this.lastBlock = false;
        this.confirmations = 0;
        this.confirmationChecks = 0;
    }

    /**
     * TODO: Pass timeout, blockConfirmations, and provider over the constructor
     *
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
            if (this.isSocketBasedProvider(provider)) {
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
        this.newHeadsSubscription.subscribe((newHead) => {
            this.getTransactionReceiptMethod.parameters = [transactionHash];

            this.getTransactionReceiptMethod.execute(moduleInstance).then((receipt) => {
                if (receipt) {
                    this.confirmations++;

                    observer.next(receipt);

                    if (this.isConfirmed(blockConfirmations)) {
                        this.newHeadsSubscription.unsubscribe();

                        observer.complete(receipt);
                    }
                }

                this.confirmationChecks++;

                if (this.isTimeoutTimeExceeded(timeout)) {
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

                    if (this.isConfirmed(blockConfirmations)) {
                        clearInterval(interval);
                        observer.complete(receipt);
                    }

                    this.lastBlock = block;
                }
            }

            this.confirmationChecks++;

            if (this.isTimeoutTimeExceeded(timeout)) {
                clearInterval(interval);
                observer.error('Timeout exceeded during the transaction confirmation observation!');
            }
        }, 1000);
    }

    /**
     * TODO: Create GetBlockByHashMethod and GetBlockByNumberMethod and combine them in the Eth module to a GetBlockMethod.
     *
     * Returns a the block by the given blockHash
     *
     * @method getBlock
     *
     * @param {String} blockHash
     *
     * @returns {Promise<Object>}
     */
    getBlock(blockHash) {
        this.getBlockMethod.parameters = [blockHash];

        return this.getBlockMethod.execute();
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
