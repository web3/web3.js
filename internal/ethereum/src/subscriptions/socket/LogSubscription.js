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
 * @file LogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable} from 'rxjs';
import LogOptions from "../../../lib/types/input/LogOptions";
import SocketSubscription from "../../../../core/src/json-rpc/subscriptions/socket/SocketSubscription";
import Log from "../../../lib/types/output/Log";

export default class LogSubscription extends SocketSubscription {
    /**
     * @param {EthereumConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    constructor(config, parameters) {
        super('eth_subscribe', 'logs', config, [new LogOptions(parameters[0])]);
    }

    /**
     * TODO: create operator for this: log.removed ? this.emit('changed', log);
     *
     * Sends the JSON-RPC request and returns a RxJs Subscription object
     *
     * @method subscribe
     *
     * @param {Function} observerOrNext
     * @param {Function} error
     * @param {Function} complete
     *
     * @returns {Subscription}
     */
    subscribe(observerOrNext, error, complete) {
        return new Observable((observer) => {
            return super.subscribe({
                next(log) {
                    observer.next(new Log(log))
                },
                error(error) {
                    observer.error(error);
                },
                complete() {
                    observer.complete();
                }
            });
        })
    }
}
