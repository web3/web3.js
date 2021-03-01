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
 * @file batch.js
 * @author ChainSafe <info@chainsafe.io>
 * @date 2021
 */

import WebsocketProvider from 'web3-providers-ws'
import HttpProvider from 'web3-providers-http'
import IpcProvider from 'web3-providers-ipc'

import {
  ConnectionCloseError,
  InvalidResponse,
  InvalidProvider,
  ErrorResponse,
} from 'web3-core-helpers/errors';
import Jsonrpc = './jsonrpc.js';
import givenProvider from './givenProvider.js';
const noop = () => {}
/**
* It's responsible for passing messages to providers
* It's also responsible for polling the ethereum node for incoming messages
* Default poll timeout is 1 second
* Singleton
*
* @param {string|Object}provider
* @param {Net.Socket} net
*
* @constructor
*/

export default class RequestManager {
  constructor (provider, net) {
    this.provider = null;
    this.providers = RequestManager.providers;

    this.setProvider(provider, net);
    this.subscriptions = new Map();
  }

  get name () {
    return 'requestManager'
  }

/**
* sets the provider
*
* @method setProvider
*
* @param {Object||string} provider
* @param {net.Socket} net
*
* @returns void
*/

  setProvider (provider, net) {
    if (!provider && !net) return
    // autodetect provider
    if (typeof provider === 'string') {
      // HTTP
      if (/^http(s)?:\/\//i.test(provider)) {
        provider = new this.providers.HttpProvider(provider);

      // WS
      } else if (/^ws(s)?:\/\//i.test(provider)) {
        provider = new this.providers.WebsocketProvider(provider);

      // IPC
      } else if (provider && typeof net === 'object' && typeof net.connect === 'function') {
        provider = new this.providers.IpcProvider(provider, net);

      } else if (provider) {
        throw new Error('Can\'t autodetect provider for "' + provider + '"');
      }
    }


    // reset the old one before changing, if still connected
    if (this.provider && this.provider.connected) this.clearSubscriptions();

    // assign new provider
    this.provider = provider;

    // listen to incoming notifications
    if (this.provider && this.provider.on) {
      if (typeof provider.request === 'function') { // EIP-1193 provider
        this.provider.on('message', (payload) =>  {
          if (payload && payload.type === 'eth_subscription' && payload.data) {
            const data = payload.data
            if (data.subscription && this.subscriptions.has(data.subscription)) {
              this.subscriptions.get(data.subscription).callback(null, data.result);
            }
          }
        })
      } else { // legacy provider subscription event
        this.provider.on('data', (result, deprecatedResult) => {
          result = result || deprecatedResult; // this is for possible old providers, which may had the error first handler

          // if result is a subscription, call callback for that subscription
          if (result.method && result.params && result.params.subscription && this.subscriptions.has(result.params.subscription)) {
            this.subscriptions.get(result.params.subscription).callback(null, result.params.result);
          }
        });
      }
      // resubscribe if the provider has reconnected
      this.provider.on('connect', () => {
        this.subscriptions.forEach((subscription) => {
          subscription.subscription.resubscribe();
        });
      });

      // notify all subscriptions about the error condition
      this.provider.on('error', (error) => {
        this.subscriptions.forEach(function (subscription) {
          subscription.callback(error);
        });
      });

      // notify all subscriptions about bad close conditions
      const disconnect = (event) => {
        if (this._isCleanCloseEvent(event) || this._isIpcCloseError(event)) {
          this.subscriptions.forEach((subscription) => {
            subscription.callback(ConnectionCloseError(event));
            this.subscriptions.delete(subscription.subscription.id);
          });

          if (this.provider && this.provider.emit) {
            this.provider.emit('error', ConnectionCloseError(event));
          }
        }

        if (this.provider && this.provider.emit) {
          this.provider.emit('end', event);
        }

      };
      // TODO: Remove close once the standard allows it
      this.provider.on('close', disconnect.bind(this));
      this.provider.on('disconnect', disconnect.bind(this));

      // TODO add end, timeout??
    }
  }
/**
* Asynchronously send request to provider.
* Prefers to use the `request` method available on the provider as specified in [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193).
* If `request` is not available, falls back to `sendAsync` and `send` respectively.
* @method send
* @param {Object} data
* @param {Function} callback
* @returns void
*/

  async send (data, cb) {
    const provider = this.provider
    const { request, send, sendAsync } = provider
    const { method, params } = data
    // if none are available throw error
    if(!send && !sendAsync && !request) throw new Error('Provider does not have a request or send method to use.');
    // format the payload for either request or jsonRpc
    const payload = provider.request ? { method, params } : Jsonrpc.toPayload(method, params);
    // figure out which send method is available
    const sendMethod = request || (payload, cb) => {
      const send = sendAsync || send;
      let resolve, reject;
      const jsonResult = new Promise ((res, rej) => {
        resolve = resolve
      });
      // format the cb
      if (!cb) {
        cb = (err, res) => {
          if (err) return reject(err)
          resolve(res)
        }
      }
      const wrappedCb = this._jsonrpcResultCallback(cb, payload)
      send(payload, wrappedCb);
      return result
    }
    const result = await sendMethod(payload);
    return result
  }


  static get givenProvider () {
    return givenProvider
  }

  static get providers () {
    return {
      WebsocketProvider,
      HttpProvider,
      IpcProvider,
    }
  }
  /**
  * Asynchronously send batch request.
  * Only works if provider supports batch methods through `sendAsync` or `send`.
  * if no callback is provided then an array of promises will be returned that
  * will resolve the results.
  * @method sendBatch
  * @param {Array} data - array of payload objects
  * @param {Function} optional callback
  */
  sendBatch (data, callback) {
    this._checkProvider()
    const payload = Jsonrpc.toBatchPayload(data);
    const sendMethod = this.provider.sendAsync || this.provider.send
    if (!sendMethod) throw new Error('Provider does not have a send method to use.')
    sendMethod(payload, function (err, results) {
      if (err) return callback(err);

      if (!Array.isArray(results)) {
        return callback(InvalidResponse(results));
      }
      callback(null, results);
    });
  }


  /**
  * Waits for notifications
  *
  * @method addSubscription
  * @param {Subscription} subscription         the subscription
  * @param {String} type         the subscription namespace (eth, personal, etc)
  * @param {Function} callback   the callback to call for incoming notifications
  */
  addSubscription(subscription, callback) {
    if (!this.provider.on) throw new Error('The provider doesn\'t support subscriptions: ' + this.provider.constructor.name);

    this.subscriptions.set(subscription.id, {
        callback: callback,
        subscription: subscription,
    });
  }

  /**
  *  removes subscriptions from provider
  *
  * @method removeSubscription
  * @param {String} id           the subscription id
  * @param {Function} callback   fired once the subscription is removed
  */
  removeSubscription (id, callback = noop) {
    if (this.subscriptions.has(id)) {
      const type = this.subscriptions.get(id).subscription.options.type;

      // remove subscription first to avoid reentry
      this.subscriptions.delete(id);

      // then, try to actually unsubscribe
      this.send({
        method: type + '_unsubscribe',
        params: [id]
      }, callback);

      return;
    }

    // call the callback if the subscription was already removed
    callback(null);
  }

  /**
  * Should be called to reset the subscriptions
  *
  * @method reset
  * @param {boolean} dontRemoveSyncing
  * @returns {boolean}
  */
  clearSubscriptions (dontRemoveSyncing) {
    try {
      var this = this;

      // uninstall all subscriptions
      if (this.subscriptions.size) {
        this.subscriptions.forEach(function (value, id) {
          if (dontRemoveSyncing && value.name === 'syncing') return;
          this.removeSubscription(id);
        });
      }

      //  reset notification callbacks etc.
      if (this.provider.reset) this.provider.reset();

      return true
    } catch (e) {
      throw new Error(`Error while clearing subscriptions: ${e}`)
    }
  }

  _checkProvider () {
    if (!this.provider) throw InvalidProvider()
  }

  /**
  * Evaluates WS close event
  *
  * @method _isCleanClose
  *
  * @param {CloseEvent | boolean} event WS close event or exception flag
  *
  * @returns {boolean}
  */
  _isCleanCloseEvent (event) {
    return typeof event === 'object' && ([1000].includes(event.code) || event.wasClean === true);
  }

  /**
  * Detects Ipc close error. The node.net module emits ('close', isException)
  *
  * @method _isIpcCloseError
  *
  * @param {CloseEvent | boolean} event WS close event or exception flag
  *
  * @returns {boolean}
  */
  _isIpcCloseError (event) {
    return typeof event === 'boolean' && event;
  }

  /**
  * The jsonrpc result callback for RequestManager.send
  *
  * @method _jsonrpcResultCallback
  *
  * @param {Function} callback the callback to use
  * @param {Object} payload the jsonrpc payload
  *
  * @returns {Function} return callback of form (err, result)
  *
  */
  _jsonrpcResultCallback (callback, payload) {
    return function (err, result) {
      if (err) return callback(err);

      if (result && result.id && payload.id !== result.id) {
        return callback(new Error(`Wrong response id ${result.id} (expected: ${payload.id}) in ${JSON.stringify(payload)}`));
      }

      if (result && result.error) {
        return callback(ErrorResponse(result));

      if (!Jsonrpc.isValidResponse(result)) {
        return callback(InvalidResponse(result));

      callback(null, result.result);
    }
  }
}