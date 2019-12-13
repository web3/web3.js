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

import {Observable, interval, PartialObserver, Subscription, Subscriber} from 'rxjs';
import Method from '../../methods/Method';
import JsonRpcConfiguration from "../../config/JsonRpcConfiguration";

export default class PollingSubscription<T> extends Observable<T> {
    /**
     * @param {JsonRpcConfiguration} config
     * @param {Method} method
     *
     * @constructor
     */
    public constructor(public config: JsonRpcConfiguration, public method: Method) {
        super();
    }

    /**
     * TODO: Remove ts-ignore as soon as RxJs has removed the deprecated method signatures
     * Polls the given Method and returns a RxJs Subscription object
     *
     * @method subscribe
     *
     * @param {Observer|Function} observerOrNext
     * @param {Function} error
     * @param {Function} complete
     *
     * @returns {Subscription}
     */
    // @ts-ignore
    public subscribe(
        observerOrNext?: PartialObserver<T> | ((value: T) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        // @ts-ignore
        const subscription: Subscriber<T> = super.subscribe(observerOrNext, error, complete);

        const intervalSub = interval(this.config.pollingInterval).subscribe({
            next: async () => {
                subscription.next(await this.method.execute());
            },
            error: (error: Error) => {
                subscription.error(error);
            },
            complete: () => {
                subscription.complete();
            }
        });


        subscription.add(intervalSub.unsubscribe.bind(intervalSub));

        return subscription;
    }
}
