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
 * @file SendContractMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import _ from 'underscore';
import {SendTransactionMethodModel} from 'web3-core-method';

export default class SendContractMethodModel extends SendTransactionMethodModel {
    /**
     * @param {ABIItemModel} abiItemModel
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(abiItemModel, allEventsLogDecoder, utils, formatters, accounts) {
        super(utils, formatters, accounts);

        this.abiItemModel = abiItemModel;
        this.allEventsLogDecoder = allEventsLogDecoder;
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Object} response
     *
     * @returns {*}
     */
    afterExecution(response) {
        if (_.isArray(response.logs)) {
            response.events = {};

            response.logs.map(function(log) {
                return this.allEventsLogDecoder.decode(null, log);
            });

            response.logs.forEach((log, index) => {
                if (log.event) {
                    if (response.events[log.event]) {
                        if (_.isArray(response.events[log.event])) {
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

        return response;
    }
}
