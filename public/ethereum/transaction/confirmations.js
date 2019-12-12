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

import {interval, from} from 'rxjs'

import web3 from "../../index.js";
import GetTransactionReceiptMethod from "../../../internal/ethereum/src/methods/eth/transaction/GetTransactionReceiptMethod.js";
import GetBlockByNumberMethod from "../../../internal/ethereum/src/methods/eth/block/GetBlockByNumberMethod.js";
import {transactionConfirmations} from "../../../internal/ethereum/src/subscriptions/operators/transactionConfirmations";

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
    const getTransactionReceiptMethod = new GetTransactionReceiptMethod(config, [txHash]);

    // on parity nodes you can get the receipt without it being mined
    // so the receipt may not have a block number at this point
    if (config.provider.supportsSubscriptions()) {
        return new NewHeadsSubscription(config).pipe(transactionConfirmations(config, txHash));
    } else {
        let lastBlock;
        let getBlockByNumber = new GetBlockByNumberMethod(config, []);

        return interval(1000).pipe(
            mergeMapTest(() => {
                return from(getTransactionReceiptMethod.execute());
            }),
            filterTest(async (receipt) => {
                if (receipt && (receipt.blockNumber === 0 || receipt.blockNumber)) {
                    if (lastBlock) {
                        getBlockByNumber.parameters = [lastBlock.number + 1];
                        const block = await getBlockByNumber.execute();

                        if (block) {
                            lastBlock = block;

                            return true;
                        }
                    } else {
                        getBlockByNumber.parameters = [receipt.blockNumber];
                        lastBlock = await getBlockByNumber.execute();

                        return true;
                    }
                }

                return false;
            })
        );
    }
}

