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
 * @file PollingSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable, interval} from 'rxjs';

export default class PollingSubscription extends Observable {
    /**
     * @param {Method} method
     *
     * @constructor
     */
    constructor(method) {
        super();
        this.method = method;
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
        const observer = this.getObserver(observerOrNext, error, complete);

        const subscription = super.subscribe(observer);

        const intervalSub = interval(this.config.pollingInterval).subscribe({
            next: async () => {
                observer.next(await this.method.execute());
            },
            error: (error) => {
                observer.error(error);
            },
            complete: () => {
                observer.complete();
            }
        });


        subscription.add(intervalSub.unsubscribe.bind(intervalSub));

        return subscription;
    }

    /**
     * Returns a observer object by the given values
     *
     * @method getObserver
     *
     * @param {Function} observerOrNext
     * @param {Function} error
     * @param {Function} complete
     *
     * @returns {{next: *, error: *, complete: *}|*}
     */
    getObserver(observerOrNext, error, complete) {
        if (typeof observerOrNext !== 'function') {
            return observerOrNext;
        }

        return {
            next: observerOrNext,
            error: error,
            complete: complete
        }
    }
}
