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
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

import { ErrorResponse, InvalidResponse } from 'web3-core-helpers/lib/errors';
import Jsonrpc from './jsonrpc';

export default class Batch {
  requestManager = null
  requests = null

  constructor (requestManager) {
      this.requestManager = requestManager;
      this.requests = [];
  }

  /**
   * Should be called to add create new request to batch request
   *
   * @method add
   * @param {Object} jsonrpc requet object
   */
  add (request) {
      this.requests.push(request);
  }

  /**
   * Should be called to execute batch request
   *
   * @method execute
   */
  execute () {
      this.requestManager.sendBatch(this.requests, (err, results = []) => {
          this.requests.map((request, index) => results[index] || {}).forEach((result, index) => {
              if (!this.requests[index].callback) {
                  return;
              }

              if (result && result.error) {
                  this.requests[index].callback(ErrorResponse(result));
              } else if (!Jsonrpc.isValidResponse(result)) {
                  this.requests[index].callback(InvalidResponse(result));
              } else {
                  const v = this.requests[index].format ?
                      this.requests[index].format(result.result) : result.result;
                  this.requests[index].callback(null, v);
              }
          });
      });
  }
}
