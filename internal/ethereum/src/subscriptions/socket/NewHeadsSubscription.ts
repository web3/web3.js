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
 * @file NewHeadsSubscription
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import {PartialObserver, Subscription, Subscriber} from 'rxjs';
import SocketSubscription from "../../../../core/src/json-rpc/subscriptions/socket/SocketSubscription";
import Block from "../../../lib/types/output/Block";
import EthereumConfiguration from "../../config/EthereumConfiguration";
import BlockProperties from "../../../lib/types/output/interfaces/block/BlockProperties";

export default class NewHeadsSubscription extends SocketSubscription<Block> {
    /**
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    public constructor(config: EthereumConfiguration) {
        super('eth_subscribe', 'newHeads', config);
    }

    /**
     * Sends the JSON-RPC request and returns a RxJs Subscription object
     *
     * @method subscribe
     *
     * @param {Observer|Function} observerOrNext
     * @param {Function} error
     * @param {Function} complete
     *
     * @returns {Subscription}
     */
    public subscribe(
        observerOrNext?: PartialObserver<Block> | ((value: Block) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        const subscriber: Subscriber<Block> = new Subscriber(observerOrNext, error, complete);

        return super.subscribe({
            next: (blockProperties: BlockProperties): void => {
                subscriber.next(new Block(blockProperties));
            },
            error: (error: Error): void => {
                subscriber.error(error);
            },
            complete: (): void => {
                subscriber.complete();
            }
        });
    }
}
