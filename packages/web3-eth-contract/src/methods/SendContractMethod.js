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
 * @file SendContractMethod.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isArray from 'lodash/isArray';
import {EthSendTransactionMethod} from 'web3-core-method';

// TODO: Implement revert handling (AbstractContractMethod)
export default class SendContractMethod extends EthSendTransactionMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     * @param {TransactionObserver} transactionObserver
     * @param {ChainIdMethod} chainIdMethod
     * @param {GetTransactionCountMethod} getTransactionCountMethod
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     *
     * @constructor
     */
    constructor(
        utils,
        formatters,
        moduleInstance,
        transactionObserver,
        chainIdMethod,
        getTransactionCountMethod,
        allEventsLogDecoder,
        abiModel
    ) {
        super(utils, formatters, moduleInstance, transactionObserver, chainIdMethod, getTransactionCountMethod);

        this.allEventsLogDecoder = allEventsLogDecoder;
        this.abiModel = abiModel;
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
        if (isArray(response.logs)) {
            response.events = {};

            response.logs.forEach((log, index) => {
                log = this.allEventsLogDecoder.decode(this.abiModel, log);

                if (log.event) {
                    if (response.events[log.event]) {
                        if (isArray(response.events[log.event])) {
                            response.events[log.event].push(log);

                            return;
                        }

                        response.events[log.event] = [response.events[log.event], log];

                        return;
                    }

                    response.events[log.event] = log;

                    return;
                }

                response.events[index] = log;
            });

            delete response.logs;
        }

        return super.afterExecution(response);
    }
}
