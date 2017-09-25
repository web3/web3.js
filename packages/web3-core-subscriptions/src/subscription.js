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
 * @file subscription.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import { InvalidNumberOfParams } from 'web3-core-helpers/lib/errors';
import EventEmitter from 'eventemitter3';

export default class Subscription extends EventEmitter {
    constructor (options = {}) {
        super();

        this.id = null;
        this.callback = null;
        this.arguments = null;
        this._reconnectIntervalId = null;
        this.options = {
            subscription: options.subscription,
            type: options.type,
            requestManager: options.requestManager,
        };
    }

    /**
     * Should be called to check if the number of arguments is correct
     *
     * @method validateArgs
     * @param {Array} arguments
     * @throws {Error} if it is not
     */
    _validateArgs (args) {
        const { subscription = {} } = this.options;
        const { params = 0 } = subscription;
        if (args.length !== params) {
            throw InvalidNumberOfParams(args.length, params + 1, args[0]);
        }
    }

    /**
     * Should be called to format input args of method
     *
     * @method formatInput
     * @param {Array}
     * @return {Array}
     */
    _formatInput (args) {
        const { subscription } = this.options;
        if (!subscription || !subscription.inputFormatter) {
            return args;
        }

        return subscription.inputFormatter.map((formatter, index) => {
            if (formatter) {
                return formatter(args[index]);
            }
            return args[index];
        });
    }

    /**
     * Should be called to format output(result) of method
     *
     * @method formatOutput
     * @param {Object}
     * @return {Object}
     */

    _formatOutput (result) {
        const { subscription } = this.options;
        if (subscription && subscription.outputFormatter && result) {
            return subscription.outputFormatter(result);
        }
        return result;
    }

    /**
     * Should create payload from given input args
     *
     * @method toPayload
     * @param {Array} args
     * @return {Object}
     */
    _toPayload (args) {
        let params = [];
        if (_.isFunction(args[args.length - 1])) {
            this.callback = args.pop(); // eslint-disable-line no-param-reassign
        } else {
            this.callback = null;
        }

        if (!this.subscriptionMethod) {
            this.subscriptionMethod = args.shift();

            // replace subscription with given name
            if (this.options.subscription.subscriptionName) {
                this.subscriptionMethod = this.options.subscription.subscriptionName;
            }
        }

        if (!this.arguments) {
            this.arguments = this._formatInput(args);
            this._validateArgs(this.arguments);
            // make empty after validation
            args = []; // eslint-disable-line no-param-reassign
        }

        // re-add subscriptionName
        params.push(this.subscriptionMethod);
        params = params.concat(this.arguments);

        if (args.length) {
            throw new Error('Only a callback is allowed as parameter on an already instantiated subscription.');
        }

        return {
            method: `${this.options.type}_subscribe`,
            params,
        };
    }

    /**
     * Unsubscribes and clears callbacks
     *
     * @method unsubscribe
     * @return {Object}
     */
    unsubscribe (callback) {
        this.options.requestManager.removeSubscription(this.id, callback);
        this.id = null;
        this.removeAllListeners();
        clearInterval(this._reconnectIntervalId);
    }

    /**
     * Subscribes and watches for changes
     *
     * @method subscribe
     * @param {String} subscription the subscription
     * @param {Object} options the options object with address topics and fromBlock
     * @return {Object}
     */
    subscribe (...args) {
        const payload = this._toPayload(args);

        if (!payload) {
            return this;
        }

        if (!this.options.requestManager.provider) {
            const err1 = new Error('No provider set.');
            this.callback(err1, null, this);
            this.emit('error', err1);
            return this;
        }

        // throw error, if provider doesnt support subscriptions
        if (!this.options.requestManager.provider.on) {
            const err2 = new Error(`The current provider doesn't support subscriptions: ${this.options.requestManager.provider.constructor.name}`);
            this.callback(err2, null, this);
            this.emit('error', err2);
            return this;
        }

        // if id is there unsubscribe first
        if (this.id) {
            this.unsubscribe();
        }

        // store the params in the options object
        [this.options.params] = payload.params;

        // get past logs, if fromBlock is available
        if (
            payload.params[0] === 'logs'
            && _.isObject(payload.params[1])
            && Object.prototype.hasOwnProperty.call(payload.params[1], 'fromBlock')
            && isFinite(payload.params[1].fromBlock) // eslint-disable-line no-restricted-globals
        ) {
            // send the subscription request
            this.options.requestManager.send({
                method: 'eth_getLogs',
                params: [payload.params[1]],
            }, (err, logs) => {
                if (!err) {
                    logs.forEach((log) => {
                        const output = this._formatOutput(log);
                        this.callback(null, output, this);
                        this.emit('data', output);
                    });

                    // TODO subscribe here? after the past logs?
                } else {
                    this.callback(err, null, this);
                    this.emit('error', err);
                }
            });
        }

        // create subscription
        // TODO move to separate function? so that past logs can go first?

        if (typeof payload.params[1] === 'object') {
            delete payload.params[1].fromBlock;
        }

        this.options.requestManager.send(payload, (err, result) => {
            if (!err && result) {
                this.id = result;

                const c = (callbackError, callbackResult) => {
                    // TODO remove once its fixed in geth
                    let res = callbackResult;
                    if (_.isArray(res)) {
                        ([res] = res);
                    }

                    const output = this._formatOutput(res);
                    if (!callbackError) {
                        const { subscriptionHandler } = this.options.subscription;
                        if (_.isFunction(subscriptionHandler)) {
                            subscriptionHandler.call(this, output);
                            return;
                        }
                        this.emit('data', output);
                    } else {
                        // unsubscribe, but keep listeners
                        this.options.requestManager.removeSubscription(this.id);

                        // re-subscribe, if connection fails
                        if (this.options.requestManager.provider.once) {
                            this._reconnectIntervalId = setInterval(() => {
                                // TODO check if that makes sense!
                                this.options.requestManager.provider.reconnect();
                            }, 500);

                            this.options.requestManager.provider.once('connect', () => {
                                clearInterval(this._reconnectIntervalId);
                                this.subscribe(this.callback);
                            });
                        }
                        this.emit('error', callbackError);
                    }

                    // call the callback, last so that unsubscribe there won't affect the emit above
                    if (_.isFunction(this.callback)) {
                        this.callback(err, output, this);
                    }
                };

                // call callback on notifications
                this.options.requestManager
                    .addSubscription(this.id, payload.params[0], this.options.type, c);
            } else if (_.isFunction(this.callback)) {
                this.callback(err, null, this);
                this.emit('error', err);
            }
        });

        // return an object to cancel the subscription
        return this;
    }
}
