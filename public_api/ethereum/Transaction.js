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

import {interval} from 'rxjs'
import {map, filter} from 'rxjs/operators'
import web3 from "../index.js";
import SendTransactionMethod from "../../modules/ethereum/src/methods/eth/transaction/SendTransactionMethod";
import GetGasPriceMethod from "../../modules/ethereum/src/methods/eth/node/GetGasPriceMethod";
import EstimateGasMethod from "../../modules/ethereum/src/methods/eth/EstimateGasMethod";
import NewHeadsSubscription from "../../modules/ethereum/src/subscriptions/NewHeadsSubscription";
import GetTransactionReceiptMethod from "../../modules/ethereum/src/methods/eth/transaction/GetTransactionReceiptMethod";
import GetBlockByNumberMethod from "../../modules/ethereum/src/methods/eth/block/GetBlockByNumberMethod";

/**
 * POC
 */
export default class Transaction {
    /**
     * @param {Object} options
     * @param {EthereumConfiguration} config
     *
     * @constructor
     */
    constructor(options, config = web3.config.ethereum) {
        this.options = options;
        this.config = config;
        this.hash = null;
    }

    /**
     * Executes the transaction and returns itself with the hash property set
     *
     * @returns {Promise<Transaction>}
     */
    async send() {
        if (!this.options.gasPrice && this.options.gasPrice !== 0) {
            if (!this.config.transaction.gasPrice) {
                this.options.gasPrice = await new GetGasPriceMethod(this.config).execute()
            }

            this.options.gasPrice = this.config.transaction.gasPrice;
        }

        if (!this.options.gas) {
            this.options.gas = await new EstimateGasMethod(this.config, this.options).execute();
        }

        // TODO: Create new wallet. Probably a user password should get passed here to unlock the specific account.
        // if (this.hasAccounts() && this.isDefaultSigner()) {
        //     const account = this.config.wallet.getAccount(this.options.from);
        //
        //     if (account) {
        //         return this.sendRawTransaction(account);
        //     }
        // }
        //
        // if (this.hasCustomSigner()) {
        //     return this.sendRawTransaction();
        // }


        this.hash = await new SendTransactionMethod(this.config, [this.options]).execute();

        return this;
    }

    /**
     * Resolves with the transaction receipt if the configured requirements are here.
     *
     * @method mined
     *
     * @param {TransactionConfirmationConfig} config
     *
     * @returns {Promise<TransactionReceipt>}
     */
    async mined(config) {
        // Resolve if enough confirmations did happen (can be configured with the passed config object)
    }

    /**
     * Returns a Observable which does trigger the next listener on each confirmation
     *
     * @method confirmations
     *
     * @returns {Observable}
     */
    confirmations() {
        const getTransactionReceiptMethod = new GetTransactionReceiptMethod(this.config, [this.hash]);

        // on parity nodes you can get the receipt without it being mined
        // so the receipt may not have a block number at this point
        if (this.config.provider.supportsSubscriptions()) {
            let blockNumbers = [];

            return new NewHeadsSubscription(this.config).pipe(
                map(async (newHead) => {
                    return {newHeadNumber: newHead.number, receipt: await getTransactionReceiptMethod.execute()};
                }),
                filter((value) => {
                    if (
                        value.receipt &&
                        (value.receipt.blockNumber === 0 || value.receipt.blockNumber) &&
                        !blockNumbers.includes(value.newHeadNumber)
                    ) {
                        blockNumbers.push(value.newHeadNumber);

                        return true;
                    }

                    return false;
                }),
                map(value => value.receipt)
            );
        } else {
            let lastBlock;
            let getBlockByNumber = new GetBlockByNumberMethod(this.config, []);

            return interval(1000).pipe(
                map(async () => {
                    return await getTransactionReceiptMethod.execute()
                }),
                filter(async (value) => {
                    if (value && (value.blockNumber === 0 || value.blockNumber)) {
                        if (lastBlock) {
                            getBlockByNumber.parameters = [lastBlock.number + 1];
                            const block = await getBlockByNumber.execute();

                            if (block) {
                                lastBlock = block;

                                return true;
                            }
                        } else {
                            getBlockByNumber.parameters = [lastBlock.number + 1];
                            lastBlock = await getBlockByNumber.execute();

                            return true;
                        }
                    }

                    return false;
                })
            );
        }
    }
}
