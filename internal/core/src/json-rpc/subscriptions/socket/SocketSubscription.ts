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

import {Observable, Subscription, PartialObserver, Subscriber} from 'rxjs';
import JsonRpcConfiguration from "../../config/JsonRpcConfiguration";

export default class SocketSubscription<T> extends Observable<T> {
    /**
     * @property id
     */
    public id: string = '';

    /**
     * @param {String} type
     * @param {String} method
     * @param {JsonRpcConfiguration} config
     * @param {Array} parameters
     *
     * @constructor
     */
    public constructor(
        public type: string,
        public method: string,
        public config: JsonRpcConfiguration,
        public parameters: any[] = []
    ) {
        super();
    }

    /**
     * TODO: Remove ts-ignore as soon as RxJs has removed the deprecated method signatures
     *
     * Sends the JSON-RPC request and returns a RxJs Subscription object
     *
     * @method subscribe
     *
     *
     * @returns {Subscription}
     * @param observerOrNext
     * @param error
     * @param complete
     */
    // @ts-ignore
    public subscribe(
        observerOrNext?: PartialObserver<any> | ((value: any) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        // @ts-ignore
        const subscription: Subscriber<any> = super.subscribe(observerOrNext, error, complete);

        this.config.provider.subscribe(this.type, this.method, this.parameters)
            .then((id: string) => {
                this.id = id;
                this.config.provider.on('error', subscription.error.bind(subscription));
                this.config.provider.on(this.id, subscription.next.bind(subscription));
            })
            .catch((error: Error) => {
                subscription.error(error);
                subscription.complete();
            });

        subscription.add(this.unsubscribe.bind(this, subscription));

        return subscription;
    }

    /**
     * Unsubscribes the subscription from the given JSON-RPC provider
     *
     * @method _unsubscribe
     *
     * @param {Subscription} subscription
     *
     * @private
     */
    private unsubscribe(subscription: Subscriber<T>): void {
        this.config.provider.unsubscribe(
            this.id,
            this.type.slice(0, 3) + '_unsubscribe'
        ).then((response: boolean) => {
            if (!response) {
                throw new Error('Error on unsubscribe!');
            }

            this.config.provider.removeListener('error', subscription.error);
            this.config.provider.removeListener(this.id, subscription.next);
            this.id = '';
        });
    }
}
