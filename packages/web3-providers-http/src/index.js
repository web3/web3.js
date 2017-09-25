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
/** @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea
 *   Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2015
 */

import {
    InvalidResponse,
    ConnectionTimeout,
    InvalidConnection,
} from 'web3-core-helpers/lib/errors';

import XHR2 from 'xhr2';

/**
 * HttpProvider should be used to send rpc calls over http
 */
export default class HttpProvider {
  host = null
  timeout = 0
  connected = false

  constructor (host = 'http://localhost:8545', timeout = 0) {
      this.host = host;
      this.timeout = timeout;
  }


  /**
   * Should be used to make async request
   *
   * @method send
   * @param {Object} payload
   * @param {Function} callback triggered on end with (err, result)
   */
  send (payload, callback = () => {}) {
      const request = new XHR2();
      request.open('POST', this.host, true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onreadystatechange = () => {
          if (request.readyState === 4 && request.timeout !== 1) {
              let result = request.responseText;
              let error = null;

              try {
                  result = JSON.parse(result);
              } catch (e) {
                  error = InvalidResponse(request.responseText);
              }

              this.connected = true;
              callback(error, result);
          }
      };

      request.ontimeout = () => {
          this.connected = false;
          callback(ConnectionTimeout(this.timeout));
      };

      try {
          request.send(JSON.stringify(payload));
      } catch (error) {
          this.connected = false;
          callback(InvalidConnection(this.host));
      }
  }
}
