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

import {Subscriber, PartialObserver, Subscription} from "rxjs";
import PollingSubscription from "../../../../core/src/json-rpc/subscriptions/polling/PollingSubscription";
import GetBlockByNumberMethod from "../../methods/eth/block/GetBlockByNumberMethod";
import GetTransactionReceiptMethod from "../../methods/eth/transaction/GetTransactionReceiptMethod";
import EthereumConfiguration from "../../config/EthereumConfiguration";
import TransactionReceipt from "../../../lib/types/output/TransactionReceipt";
import Block from "../../../lib/types/output/Block";

export default class TransactionConfirmationSubscription extends PollingSubscription<TransactionReceipt> {
    /**
     * @param {EthereumConfiguration} config
     * @param {String} txHash
     *
     * @constructor
     */
    constructor(config: EthereumConfiguration, txHash: string) {
        super(config, new GetTransactionReceiptMethod(config, [txHash]));
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
    subscribe(
        observerOrNext?: PartialObserver<TransactionReceipt | Error | undefined> | ((value: TransactionReceipt) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        let lastBlock: Block;
        const subscriber: Subscriber<TransactionReceipt> = new Subscriber(observerOrNext, error, complete);

        return super.subscribe({
            next: async (receipt: TransactionReceipt): Promise<void> => {
                try {
                    let getBlockByNumber = new GetBlockByNumberMethod(this.config, []);

                    if (receipt && (receipt.blockNumber === 0 || receipt.blockNumber)) {
                        if (lastBlock) {
                            getBlockByNumber.parameters = [lastBlock.number + 1];
                            const block = await getBlockByNumber.execute();

                            if (block) {
                                lastBlock = block;

                                subscriber.next(receipt);
                            }
                        } else {
                            getBlockByNumber.parameters = [receipt.blockNumber];
                            lastBlock = await getBlockByNumber.execute();

                            subscriber.next(receipt);
                        }
                    }
                } catch (error) {
                    subscriber.error(error);
                }
            },
            error: (error): void => {
                subscriber.error(error);
            },
            complete: (): void => {
                subscriber.complete();
            }
        });
    }
}