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
     * @param {MethodFactory} methodFactory
     * @param {SubscriptionsFactory} subscriptionsFactory
     *
     * @constructor
     */
    constructor(methodFactory, subscriptionsFactory) {
        this.methodFactory = methodFactory;
        this.subscriptionsFactory = subscriptionsFactory;
    }

    /**
     * Observes the transaction by the given transactionHash
     *
     * @method observe
     *
     * @param transactionHash
     * @param moduleInstance
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

    startSocketObserver(transactionHash, moduleInstance, observer) {
        this.subscriptionsFactory.getSubscription('newHeads')
            .subscribe((newHeads) => {
                // check if lastBlock is set
                // get block
                // check if txHash exists
                // set lastBlock property
                // increase confirmations counter
                // Check if enough confirmations
                // wait on new head
                // check if lastBlock depends on new block
                // increase confirmations counter
                // check if enough confirmations
            });
    }

    startHttpObserver(observer) {
        const getTransactionReceipt = this.methodFactory.getMethod('getTransactionReceipt');
        getTransactionReceipt.parameters = [transactionHash];

        getTransactionReceipt.execute(moduleInstance).then((receipt) => {
            if (receipt) {
                // check blocks since receipt block aka confirmations
                if (this.isConfirmed(receipt)) {
                    observer.next(receipt);
                    observer.complete(receipt);

                    return;
                }

                this.startHttpObserver(observer);

                return;
            }

            this.startHttpObserver(observer);
        });
    }

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
