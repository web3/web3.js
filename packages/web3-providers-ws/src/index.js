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
/** @file WebsocketProvider.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import {
  InvalidResponse,
  InvalidConnection,
} from 'web3-core-helpers/lib/errors';

import websocket from 'websocket';

// Websocket
const Ws = websocket.w3cwebsocket ? websocket.w3cwebsocket : websocket;

export default class WebsocketProvider {
  responseCallbacks = null
  notificationCallbacks = null
  connection = null

  // Default connection ws://localhost:8546
  constructor (url = 'ws://localhost:8546') {
    this.responseCallbacks = {};
    this.notificationCallbacks = [];
    this.connection = new Ws(url);

    this.addDefaultEvents();

    // Listen for connection responses
    this.connection.onmessage = (e) => {
      const data = _.isString(e.data) ? e.data : '';

      this._parseResponse(data).forEach((result) => {
        let id = null;

        // get the id which matches the returned id
        if (_.isArray(result)) {
          result.forEach((load) => {
            if (this.responseCallbacks[load.id]) {
              ({ id } = load);
            }
          });
        } else {
          ({ id } = result);
        }

        // notification
        if (!id && result.method.indexOf('_subscription') !== -1) {
          this.notificationCallbacks.forEach((callback) => {
            if (_.isFunction(callback)) {
              callback(null, result);
            }
          });

          // fire the callback
        } else if (this.responseCallbacks[id]) {
          this.responseCallbacks[id](null, result);
          delete this.responseCallbacks[id];
        }
      });
    };
  }


  /**
   Will add the error and end event to timeout existing calls

   @method addDefaultEvents
   */
  addDefaultEvents () {
    this.connection.onerror = () => {
      this._timeout();
    };

    this.connection.onclose = (e) => {
      this._timeout();

      const noteCb = this.notificationCallbacks;

      // reset all requests and callbacks
      this.reset();

      // cancel subscriptions
      noteCb.forEach((callback) => {
        if (_.isFunction(callback)) {
          callback(e);
        }
      });
    };

    // this.connection.on('timeout', function(){
    //     this._timeout();
    // });
  }

  /**
   Will parse the response and make an array out of it.

   @method _parseResponse
   @param {String} data
   */
  _parseResponse (value) {
    const returnValues = [];

    // DE-CHUNKER
    const dechunkedData = value
      .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
      .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
      .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
      .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
      .split('|--|');

    dechunkedData.forEach((data) => {
      // prepend the last chunk
      if (this.lastChunk) {
        data = this.lastChunk + data; // eslint-disable-line no-param-reassign
      }

      let result = null;

      try {
        result = JSON.parse(data);
      } catch (e) {
        this.lastChunk = data;

        // start timeout to cancel all requests
        clearTimeout(this.lastChunkTimeout);
        this.lastChunkTimeout = setTimeout(() => {
          this._timeout();
          throw InvalidResponse(data);
        }, 1000 * 15);

        return;
      }

      // cancel timeout and set chunk to null
      clearTimeout(this.lastChunkTimeout);
      this.lastChunk = null;

      if (result) {
        returnValues.push(result);
      }
    });

    return returnValues;
  }


  /**
   Get the adds a callback to the responseCallbacks object,
   which will be called if a response matching the response Id will arrive.

   @method _addResponseCallback
   */
  _addResponseCallback (payload, callback) {
    const id = payload.id || payload[0].id;
    const method = payload.method || payload[0].method;

    this.responseCallbacks[id] = callback;
    this.responseCallbacks[id].method = method;
  }

  /**
   Timeout all requests when the end/error event is fired

   @method _timeout
   */
  _timeout () {
    Object.keys(this.responseCallbacks).forEach((key) => {
      this.responseCallbacks[key](InvalidConnection('on IPC'));
      delete this.responseCallbacks[key];
    });
  }

  send (payload, callback) {
    if (this.connection.readyState === this.connection.CONNECTING) {
      setTimeout(() => {
        this.send(payload, callback);
      }, 10);
      return;
    }

    // try reconnect, when connection is gone
    // if(!this.connection.writable)
    //     this.connection.connect({url: this.url});

    this.connection.send(JSON.stringify(payload));
    this._addResponseCallback(payload, callback);
  }

  /**
   Subscribes to provider events.provider

   @method on
   @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
   @param {Function} callback   the callback to call
   */
  on (type, callback) {
    if (typeof callback !== 'function') {
      throw new Error('The second parameter callback must be a function.');
    }

    switch (type) {
      case 'data':
        this.notificationCallbacks.push(callback);
        break;

      case 'connect':
        this.connection.onopen = callback;
        break;

      case 'end':
        this.connection.onclose = callback;
        break;

      case 'error':
        this.connection.onerror = callback;
        break;

      default:
        // this.connection.on(type, callback);
        break;
    }
  }

  // TODO add once

  /**
   Removes event listener

   @method removeListener
   @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
   @param {Function} callback   the callback to call
   */
  removeListener (type, callback) {
    switch (type) {
      case 'data':
        this.notificationCallbacks.forEach((cb, index) => {
          if (cb === callback) {
            this.notificationCallbacks.splice(index, 1);
          }
        });
        break;

      // TODO remvoving connect missing

      default:
        // this.connection.removeListener(type, callback);
        break;
    }
  }

  /**
   Removes all event listeners

   @method removeAllListeners
   @param {String} type    'notifcation', 'connect', 'error', 'end' or 'data'
   */
  removeAllListeners (type) {
    switch (type) {
      case 'data':
        this.notificationCallbacks = [];
        break;

        // TODO remvoving connect properly missing

      case 'connect':
        this.connection.onopen = null;
        break;

      case 'end':
        this.connection.onclose = null;
        break;

      case 'error':
        this.connection.onerror = null;
        break;

      default:
        // this.connection.removeAllListeners(type);
        break;
    }
  }

  /**
   Resets the providers, clears all callbacks

   @method reset
   */
  reset () {
    this._timeout();
    this.notificationCallbacks = [];

    // this.connection.removeAllListeners('error');
    // this.connection.removeAllListeners('end');
    // this.connection.removeAllListeners('timeout');

    this.addDefaultEvents();
  }
}
