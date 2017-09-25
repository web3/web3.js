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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import Subscription from './subscription.js';

class Subscriptions {
    name = null
    type = null
    subscriptions = null
    requestManager = null

    constructor (options = {}) {
        this.name = options.name;
        this.type = options.type;
        this.subscriptions = options.subscriptions || {};
        this.requestManager = null;
    }

    setRequestManager (rm) {
        this.requestManager = rm;
    }

    attachToObject (obj) {
        /* eslint-disable no-param-reassign */
        const func = this.buildCall();
        func.call = this.call;
        const name = this.name.split('.');
        if (name.length > 1) {
            obj[name[0]] = obj[name[0]] || {};
            obj[name[0]][name[1]] = func;
        } else {
            obj[name[0]] = func;
        }
        /* eslint-enable no-param-reassign */
    }


    buildCall () {
        return (s, ...args) => {
            if (!this.subscriptions[s]) {
                console.warn(`Subscription ${JSON.stringify(s)} doesn't exist. Subscribing anyway.`); // eslint-disable-line no-console
            }

            const subscription = new Subscription({
                subscription: this.subscriptions[s],
                requestManager: this.requestManager,
                type: this.type,
            });

            return subscription.subscribe(s, ...args);
        };
    }
}

export const subscriptions = Subscriptions;
export const subscription = Subscription;
