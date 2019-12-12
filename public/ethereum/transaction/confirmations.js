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
 * @file confirmations.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import web3 from "../../index.js";
import {transactionConfirmations} from "../../../internal/ethereum/src/subscriptions/operators/transactionConfirmations";
import PollingTransactionConfirmationSubscription
  from "../../../internal/ethereum/src/subscriptions/PollingTransactionConfirmationSubscription";

/**
 * POC
 *
 * @method confirmations
 *
 * @param {String} txHash
 * @param {EthereumConfiguration} config
 *
 * @returns {Observable}
 */
export default function confirmations(txHash, config = web3.config.ethereum) {
  if (config.provider.supportsSubscriptions()) {
    return new NewHeadsSubscription(config).pipe(transactionConfirmations(config, txHash));
  }

  return new PollingTransactionConfirmationSubscription(config, txHash);
}
