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
 * @file AbstractObservedTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import PromiEvent from '../../PromiEvent';
import AbstractMethod from '../AbstractMethod';

export default class AbstractObservedTransactionMethod extends AbstractMethod {
    /**
     * @param {String} rpcMethod
     * @param {Number} parametersAmount
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     * @param {TransactionObserver} transactionObserver
     *
     * @constructor
     */
    constructor(rpcMethod, parametersAmount, utils, formatters, moduleInstance, transactionObserver) {
        super(rpcMethod, parametersAmount, utils, formatters, moduleInstance);

        this.transactionObserver = transactionObserver;
        this.promiEvent = new PromiEvent();
    }

    /**
     * Sends the request and returns a PromiEvent Object
     *
     * @method execute
     *
     *
     * @callback callback callback(error, result)
     * @returns {PromiEvent}
     */
    execute() {
        this.beforeExecution(this.moduleInstance);

        this.moduleInstance.currentProvider.send(this.rpcMethod, this.parameters)
            .then((transactionHash) => {
                let count, receipt;

                if (this.callback) {
                    this.callback(false, transactionHash);

                    return;
                }

                this.promiEvent.emit('transactionHash', transactionHash);

                this.transactionObserver.observe(transactionHash).subscribe(
                    (confirmation) => {
                        count = confirmation.count;
                        receipt = confirmation.receipt;

                        this.promiEvent.emit('confirmation', count, receipt);
                    },
                    (error) => {
                        if (this.promiEvent.listenerCount('error') > 0) {
                            this.promiEvent.emit('error', error, receipt, count);
                            this.promiEvent.removeAllListeners();

                            return;
                        }

                        this.promiEvent.reject(error);
                    },
                    () => {
                        const mappedReceipt = this.afterExecution(receipt);

                        if (this.promiEvent.listenerCount('receipt') > 0) {
                            this.promiEvent.emit('receipt', mappedReceipt);
                            this.promiEvent.removeAllListeners();

                            return;
                        }

                        this.promiEvent.resolve(mappedReceipt);
                    }
                );
            })
            .catch((error) => {
                if (this.callback) {
                    this.callback(error, null);

                    return;
                }

                if (this.promiEvent.listenerCount('error') > 0) {
                    this.promiEvent.emit('error', error);
                    this.promiEvent.removeAllListeners();

                    return;
                }

                this.promiEvent.reject(error);
            });

        return this.promiEvent;
    }
}
