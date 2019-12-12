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
 * @file SocketSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable} from 'rxjs';

export default class SocketSubscription extends Observable {
    /**
     * @param {String} type
     * @param {String} method
     * @param {JsonRpcConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    constructor(type, method, config, parameters = []) {
        super();
        this.type = type;
        this.method = method;
        this.config = config;
        this.parameters = parameters;
        this.id = null;
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
        this.observer = this.getObserver(observerOrNext, error, complete);

        const subscription = super.subscribe(this.observer);

        this.config.provider.subscribe(this.type, this.method, this.parameters)
            .then((id) => {
                this.id = id;
                this.config.provider.on('error', this.observer.error);
                this.config.provider.on(this.id, this.observer.next);
            })
            .catch((error) => {
                this.observer.error(error);
                this.observer.complete();
            });

        subscription.add(this._unsubscribe.bind(this));

        return subscription;
    }

    /**
     * Unsubscribes the subscription from the given JSON-RPC provider
     *
     * @method _unsubscribe
     *
     * @private
     */
    _unsubscribe() {
        this.config.provider.unsubscribe(this.id, this.type.slice(0, 3) + '_unsubscribe').then((response) => {
            if (!response) {
                throw new Error('Error on unsubscribe!');
            }

            this.config.provider.removeListener('error', this.observer.error);
            this.config.provider.removeListener(this.id, this.observer.next);
            this.id = null;
        });
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
