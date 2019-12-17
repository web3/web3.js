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
 * @file Transaction.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import TransactionOptionsProperties from "internal/ethereum/lib/types/input/interfaces/TransactionOptionsProperties";
import TransactionReceipt from "internal/ethereum/lib/types/output/TransactionReceipt";
import EthereumConfiguration from "internal/ethereum/src/config/EthereumConfiguration";
import SocketSubscription from "internal/core/src/json-rpc/subscriptions/socket/SocketSubscription";
import PollingSubscription from "internal/core/src/json-rpc/subscriptions/polling/PollingSubscription";
import web3 from "../../index";
import send from "./send";
import confirmations from "./confirmations";
import receipt from "./receipt";

export default class Transaction {
    /**
     * @property hash
     */
    public hash: string = '';

    /**
     * @param {TransactionOptionsProperties} options
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(
        public options: TransactionOptionsProperties,
        public config: EthereumConfiguration = web3.config.ethereum
    ) {}

    /**
     * Executes the transaction and returns itself with the hash property set
     *
     * @returns {Promise<Transaction>}
     */
    async send(): Promise<Transaction> {
        this.hash = await send(this.options, this.config);

        return this;
    }

    /**
     * Resolves with the transaction receipt if the configured amount of confirmations is reached
     *
     * @method mined
     *
     * @returns {Promise<TransactionReceipt>}
     */
    receipt(): Promise<TransactionReceipt> {
        return receipt(this.hash, this.config)
    }

    /**
     * Returns a Observable which does trigger the next listener on each valid confirmation
     *
     * @method confirmations
     *
     * @returns {SocketSubscription<TransactionReceipt> | PollingSubscription<TransactionReceipt>}
     */
    confirmations(): SocketSubscription<TransactionReceipt> | PollingSubscription<TransactionReceipt> {
        return confirmations(this.hash, this.config);
    }
}
