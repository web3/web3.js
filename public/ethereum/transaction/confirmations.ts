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

import {Observable} from 'rxjs';
import web3 from "../../index.js";
import {transactionConfirmations} from "internal/ethereum/src/subscriptions/operators/transactionConfirmations";
import TransactionConfirmationSubscription from "internal/ethereum/src/subscriptions/polling/TransactionConfirmationSubscription";
import NewHeadsSubscription from "internal/ethereum/src/subscriptions/socket/NewHeadsSubscription";
import EthereumConfiguration from "internal/ethereum/src/config/EthereumConfiguration";
import TransactionReceipt from "internal/ethereum/lib/types/output/TransactionReceipt";
import SocketSubscription from "internal/core/src/json-rpc/subscriptions/socket/SocketSubscription";
import PollingSubscription from "internal/core/src/json-rpc/subscriptions/polling/PollingSubscription";

/**
 * Starts a newHeads subscription or polls for the transaction receipt and emits if a valid confirmation happened.
 *
 * @method confirmations
 *
 * @param {String} txHash
 * @param {EthereumConfiguration} config
 *
 * @returns {Observable}
 */
export default function confirmations(
    txHash: string,
    config: EthereumConfiguration = web3.config.ethereum
): SocketSubscription<TransactionReceipt> | PollingSubscription<TransactionReceipt> {
    if (config.provider.supportsSubscriptions()) {
        return new NewHeadsSubscription(config).pipe(
            transactionConfirmations(config, txHash)
        ) as SocketSubscription<TransactionReceipt>;
    }

    return new TransactionConfirmationSubscription(config, txHash);
}
