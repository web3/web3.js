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
 * @file SendTransactionMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractObservedTransactionMethod from '../../../lib/methods/transaction/AbstractObservedTransactionMethod';

export default class SendTransactionMethod extends AbstractObservedTransactionMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractConfluxWebModule} moduleInstance
     * @param {TransactionObserver} transactionObserver
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance, transactionObserver) {
        super('eth_sendTransaction', 1, utils, formatters, moduleInstance, transactionObserver);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractConfluxWebModule} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputTransactionFormatter(this.parameters[0], moduleInstance);
    }
}
