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
 * @file SendRawTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {TransactionReceipt} from 'web3-core';
import AbstractObservedTransactionMethod from '../../../lib/methods/transaction/AbstractObservedTransactionMethod';

export default class SendRawTransactionMethod extends AbstractObservedTransactionMethod {
    /**
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractTransactionObserver} transactionObserver
     *
     * @constructor
     */
    constructor(moduleInstance, transactionObserver) {
        super('eth_sendRawTransaction', 1, moduleInstance, transactionObserver);
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {Object}
     */
    afterExecution(response) {
        return new TransactionReceipt(response);
    }
}
