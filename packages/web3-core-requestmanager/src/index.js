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

import _ from 'lodash';
import WebsocketProvider from 'web3-providers-ws';
import HttpProvider from 'web3-providers-http';
import IpcProvider from 'web3-providers-ipc';
import {
    InvalidProvider,
    ErrorResponse,
    InvalidResponse,
} from 'web3-core-helpers/lib/errors';

import Jsonrpc from './jsonrpc';
import BatchManager from './batch';
import givenProvider from './givenProvider';

/**
* It's responsible for passing messages to providers
* It's also responsible for polling the ethereum node for incoming messages
* Default poll timeout is 1 second
* Singleton
*/
class Manager {
    static givenProvider = givenProvider
    static providers = {
        WebsocketProvider,
        HttpProvider,
        IpcProvider,
    }

    provider = null
    providers = null
    subscriptions = null

    constructor (provider) {
        this.provider = null;
        this.providers = Manager.providers;

        this.setProvider(provider);
        this.subscriptions = {};
    }

    /**
   * Should be used to set provider of request manager
   *
   * @method setProvider
   * @param {Object} prov
   */
    setProvider (prov, net) {
        let p = prov;
        // autodetect provider
        if (p && typeof p === 'string' && this.providers) {
            // HTTP
            if (/^http(s)?:\/\//i.test(p)) {
                p = new this.providers.HttpProvider(p);

                // WS
            } else if (/^ws(s)?:\/\//i.test(p)) {
                p = new this.providers.WebsocketProvider(p);

                // IPC
            } else if (p && typeof net === 'object' && typeof net.connect === 'function') {
                p = new this.providers.IpcProvider(p, net);
            } else if (p) {
                throw new Error(`Can't autodetect provider for "${p}"`);
            }
        }

        // reset the old one before changing
        if (this.provider) {
            this.clearSubscriptions();
        }

        this.provider = p || null;

        // listen to incoming notifications
        if (this.provider && this.provider.on) {
            this.provider.on('data', (err, result) => {
                if (!err) {
                    const subscription = this.subscriptions[result.params.subscription];
                    if (subscription && subscription.callback) {
                        subscription.callback(null, result.params.result);
                    }
                } else {
                    Object.keys(this.subscriptions).forEach((id) => {
                        if (this.subscriptions[id].callback) {
                            this.subscriptions[id].callback(err);
                        }
                    });
                }
            });
        }
    }


    /**
   * Should be used to asynchronously send request
   *
   * @method sendAsync
   * @param {Object} data
   * @param {Function} callback
   */
    send (data, callback = () => {}) {
        if (!this.provider) {
            return callback(InvalidProvider());
        }

        const payload = Jsonrpc.toPayload(data.method, data.params);
        return this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, (err, result) => {
            if (result && result.id && payload.id !== result.id) {
                return callback(new Error(`Wrong response id "${result.id}" (expected: "${payload.id}") in ${JSON.stringify(payload)}`));
            }

            if (err) {
                return callback(err);
            }

            if (result && result.error) {
                return callback(ErrorResponse(result));
            }

            if (!Jsonrpc.isValidResponse(result)) {
                return callback(InvalidResponse(result));
            }

            return callback(null, result.result);
        });
    }

    /**
   * Should be called to asynchronously send batch request
   *
   * @method sendBatch
   * @param {Array} batch data
   * @param {Function} callback
   */
    sendBatch (data, callback = () => {}) {
        if (!this.provider) {
            return callback(InvalidProvider());
        }

        const payload = Jsonrpc.toBatchPayload(data);
        return this.provider.send(payload, (err, results) => {
            if (err) {
                return callback(err);
            }

            if (!_.isArray(results)) {
                return callback(InvalidResponse(results));
            }

            return callback(null, results);
        });
    }


    /**
   * Waits for notifications
   *
   * @method addSubscription
   * @param {String} id           the subscription id
   * @param {String} name         the subscription name
   * @param {String} type         the subscription namespace (eth, personal, etc)
   * @param {Function} callback   the callback to call for incoming notifications
   */
    addSubscription (id, name, type, callback) {
        if (this.provider.on) {
            this.subscriptions[id] = {
                callback,
                type,
                name,
            };
        } else {
            throw new Error(`The provider doesn't support subscriptions: ${this.provider.constructor.name}`);
        }
    }

    /**
   * Waits for notifications
   *
   * @method removeSubscription
   * @param {String} id           the subscription id
   * @param {Function} callback   fired once the subscription is removed
   */
    removeSubscription (id, callback) {
        if (this.subscriptions[id]) {
            this.send({
                method: `${this.subscriptions[id].type}_unsubscribe`,
                params: [id],
            }, callback);

            // remove subscription
            delete this.subscriptions[id];
        }
    }

    /**
   * Should be called to reset the subscriptions
   *
   * @method reset
   */
    clearSubscriptions (keepIsSyncing) {
        // uninstall all subscriptions
        Object.keys(this.subscriptions).forEach((id) => {
            if (!keepIsSyncing || this.subscriptions[id].name !== 'syncing') {
                this.removeSubscription(id);
            }
        });

        //  reset notification callbacks etc.
        if (this.provider.reset) {
            this.provider.reset();
        }
    }
}

export {
    Manager,
    BatchManager,
};
