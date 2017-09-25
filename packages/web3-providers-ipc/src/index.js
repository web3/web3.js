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
/** @file index.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import { InvalidResponse, InvalidConnection } from 'web3-core-helpers/lib/errors';
import oboe from 'oboe';

export default class IpcProvider {
  responseCallbacks = null
  notificationCallbacks = null
  path = null
  connection = null

  constructor (path, net) {
      this.responseCallbacks = {};
      this.notificationCallbacks = [];
      this.path = path;

      this.connection = net.connect({
          path: this.path,
      });

      this.addDefaultEvents();

      // Listen for connection responses
      const callback = (result) => {
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
              this.notificationCallbacks.forEach((c) => {
                  if (_.isFunction(c)) {
                      c(null, result);
                  }
              });

              // fire the callback
          } else if (this.responseCallbacks[id]) {
              this.responseCallbacks[id](null, result);
              delete this.responseCallbacks[id];
          }
      };

      // use oboe.js for Sockets
      if (net.constructor.name === 'Socket') {
          oboe(this.connection).done(callback);
      } else {
          this.connection.on('data', (data) => {
              this._parseResponse(data.toString()).forEach(callback);
          });
      }
  }

  /**
  Will add the error and end event to timeout existing calls

  @method addDefaultEvents
  */
  addDefaultEvents () {
      this.connection.on('connect', () => {
      });

      this.connection.on('error', () => {
          this._timeout();
      });

      this.connection.on('end', () => {
          this._timeout();

          // inform notifications
          this.notificationCallbacks.forEach((callback) => {
              if (_.isFunction(callback)) {
                  callback(new Error('IPC socket connection closed'));
              }
          });
      });

      this.connection.on('timeout', () => {
          this._timeout();
      });
  }

  /**
   Will parse the response and make an array out of it.

   NOTE, this exists for backwards compatibility reasons.

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

  /**
   Try to reconnect

   @method reconnect
   */
  reconnect () {
      this.connection.connect({ path: this.path });
  }

  send (payload, callback) {
      // try reconnect, when connection is gone
      if (!this.connection.writable) {
          this.connection.connect({ path: this.path });
      }


      this.connection.write(JSON.stringify(payload));
      this._addResponseCallback(payload, callback);
  }

  /**
  Subscribes to provider events.provider

  @method on
  @param {String} type    'notification', 'connect', 'error', 'end' or 'data'
  @param {Function} callback   the callback to call
  */
  on (type, callback) {
      if (!_.isFunction(callback)) {
          throw new Error('The second parameter callback must be a function.');
      }

      switch (type) {
      case 'data':
          this.notificationCallbacks.push(callback);
          break;

      default:
          this.connection.on(type, callback);
          break;
      }
  }

  /**
   Subscribes to provider events.provider

   @method on
   @param {String} type    'connect', 'error', 'end' or 'data'
   @param {Function} callback   the callback to call
   */
  once (type, callback) {
      if (!_.isFunction(callback)) {
          throw new Error('The second parameter callback must be a function.');
      }

      this.connection.once(type, callback);
  }

  /**
  Removes event listener

  @method removeListener
  @param {String} type    'data', 'connect', 'error', 'end' or 'data'
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

      default:
          this.connection.removeListener(type, callback);
          break;
      }
  }

  /**
  Removes all event listeners

  @method removeAllListeners
  @param {String} type    'data', 'connect', 'error', 'end' or 'data'
  */
  removeAllListeners (type) {
      switch (type) {
      case 'data':
          this.notificationCallbacks = [];
          break;

      default:
          this.connection.removeAllListeners(type);
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

      this.connection.removeAllListeners('error');
      this.connection.removeAllListeners('end');
      this.connection.removeAllListeners('timeout');

      this.addDefaultEvents();
  }
}
