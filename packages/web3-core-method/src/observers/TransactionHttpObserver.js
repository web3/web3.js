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
 * @file TransactionHTTPObserver.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2019
 */

import {Observable} from 'rxjs';
import AbstractTransactionObserver from '../../lib/observer/AbstractTransactionObserver';

export default class TransactionHTTPObserver extends AbstractTransactionObserver {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Number} timeout
     * @param {Number} blockConfirmations
     * @param {Boolean} instantmine
     * @param {GetTransactionReceiptMethod} getTransactionReceiptMethod
     * @param {GetBlockByNumberMethod} getBlockByNumberMethod
     *
     * @constructor
     */
    constructor(
        provider,
        timeout,
        blockConfirmations,
        instantmine,
        getTransactionReceiptMethod,
        getBlockByNumberMethod
    ) {
        super(provider, timeout, blockConfirmations, instantmine, getTransactionReceiptMethod);

        this.getBlockByNumberMethod = getBlockByNumberMethod;
        this.lastBlock = false;
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
        return Observable.create(async (observer) => {
            const interval = setInterval(async () => {
                try {
                    if (observer.closed) {
                        clearInterval(interval);

                        return;
                    }

                    this.getTransactionReceiptMethod.parameters = [transactionHash];
                    const receipt = await this.getTransactionReceiptMethod.execute();

                    // on parity nodes you can get the receipt without it being mined
                    // so the receipt may not have a block number at this point
                    if (receipt && receipt.blockNumber) {
                        if (this.lastBlock) {
                            const block = await this.getBlockByNumber(this.lastBlock.number + 1);
                            if (block) {
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
                            observer.complete();
                            clearInterval(interval);
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
}
