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
 * @file TransactionSocketObserver.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2019
 */

import {Observable} from 'rxjs';
import AbstractTransactionObserver from '../../lib/observer/AbstractTransactionObserver';

export default class TransactionSocketObserver extends AbstractTransactionObserver {
    /**
     * @param {AbstractSocketProvider|HttpProvider|CustomProvider} provider
     * @param {Number} timeout
     * @param {Number} blockConfirmations
     * @param {Boolean} instantmine
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
        instantmine,
        getTransactionReceiptMethod,
        getBlockByNumberMethod,
        newHeadsSubscription
    ) {
        super(provider, timeout, blockConfirmations, instantmine, getTransactionReceiptMethod);

        this.newHeadsSubscription = newHeadsSubscription;
        this.blockNumbers = [];
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
        });
    }
}
