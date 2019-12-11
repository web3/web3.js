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
 * @file NewHeadsSubscription
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable} from 'rxjs';
import Subscription from "../../../core/src/json-rpc/subscriptions/Subscription";
import Block from "../../lib/types/output/Block";

export default class NewHeadsSubscription extends Subscription {
    /**
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(config) {
        super('eth_subscribe', 'newHeads', config);
    }

    /**
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
                next(block) {
                    observer.next(new Block(block))
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
