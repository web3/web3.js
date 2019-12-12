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
 * @file PollingTransactionConfirmationSubscription
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {Observable} from 'rxjs';
import PollingSubscription from "../../../core/src/json-rpc/subscriptions/PollingSubscription";
import GetBlockByNumberMethod from "../methods/eth/block/GetBlockByNumberMethod";

export default class PollingTransactionConfirmationSubscription extends PollingSubscription {
  /**
   * @param {EthereumConfiguration} config
   * @param {Array} parameters
   *
   * @constructor
   */
  constructor(config, parameters) {
    super('eth_getTransactionReceipt', config, parameters)
  }

  /**
   * Sends the JSON-RPC request and returns a RxJs Subscription object
   *
   * @method subscribe
   *
   * @param {Function} observerOrNext
   * @param {Function} error
   * @param {Function} complete
   *
   * @returns {Subscription}
   */
  subscribe(observerOrNext, error, complete) {
    return new Observable((observer) => {
      return super.subscribe({
        async next(receipt) {
          try {
            let lastBlock;
            let getBlockByNumber = new GetBlockByNumberMethod(this.config, []);

            if (receipt && (receipt.blockNumber === 0 || receipt.blockNumber)) {
              if (lastBlock) {
                getBlockByNumber.parameters = [lastBlock.number + 1];
                const block = await getBlockByNumber.execute();

                if (block) {
                  lastBlock = block;

                  observer.next(receipt);
                }
              } else {
                getBlockByNumber.parameters = [receipt.blockNumber];
                lastBlock = await getBlockByNumber.execute();

                observer.next(receipt);
              }
            }
          } catch (error) {
            observer.error(error);
          }
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      });
    });
  }
}