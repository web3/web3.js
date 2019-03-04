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
 * @file MethodFactory
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    AbstractMethodFactory,
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    GetAccountsMethod,
    GetBalanceMethod,
    GetBlockMethod,
    GetBlockNumberMethod,
    GetBlockTransactionCountMethod,
    GetBlockUncleCountMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionFromBlockMethod,
    GetTransactionMethod,
    GetTransactionReceipt,
    GetUncleMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    RequestAccountsMethod,
    SendRawTransactionMethod,
    SendTransactionMethod,
    SignMethod,
    SignTransactionMethod,
    SubmitWorkMethod,
    VersionMethod
} from 'web3-core-method';

import {NewHeadsSubscription} from 'web3-core-subscriptions';
import TransactionObserver from '../observers/TransactionObserver';
import SendSignedTransactionMethod from '../methods/SendSignedTransactionMethod';

export default class MethodFactory extends AbstractMethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {SubscriptionsFactory} subscriptionsFactory
     *
     * @constructor
     */
    constructor(utils, formatters, subscriptionsFactory) {
        super(utils, formatters);
        this.subscriptionsFactory = subscriptionsFactory;

        this.methods = {
            getNodeInfo: GetNodeInfoMethod,
            getProtocolVersion: GetProtocolVersionMethod,
            getCoinbase: GetCoinbaseMethod,
            isMining: IsMiningMethod,
            getHashrate: GetHashrateMethod,
            isSyncing: IsSyncingMethod,
            getGasPrice: GetGasPriceMethod,
            getAccounts: GetAccountsMethod,
            getBlockNumber: GetBlockNumberMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getUncle: GetUncleMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getBlockUncleCount: GetBlockUncleCountMethod,
            getTransaction: GetTransactionMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceipt,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: SignTransactionMethod,
            sendTransaction: SendTransactionMethod,
            sign: SignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod,
            getId: VersionMethod,
            getChainId: ChainIdMethod
        };
    }

    /**
     * Returns an MethodModel
     *
     * @param {String} name
     *
     * @returns {AbstractMethod}
     */
    createMethod(name) {
        const method = this.methods[name];

        if (method.name === 'SendObservedTransactionMethod') {
            // eslint-disable-next-line new-cap
            return new method(
                this.utils,
                this.formatters,
                new TransactionObserver(
                    this.getMethod('getTransactionReceipt'),
                    this.getMethod('GetBlockMethod'),
                    new NewHeadsSubscription(this.utils, this.formatters)
                )
            );
        }

        if (method.name === 'SendSignedTransactionMethod') {
            const transactionObserver = new TransactionObserver(
                this.getMethod('getTransactionReceipt'),
                this.getMethod('GetBlockMethod'),
                new NewHeadsSubscription(this.utils, this.formatters)
            );

            // eslint-disable-next-line new-cap
            return new method(
                this.utils,
                this.formatters,
                transactionObserver,
                new ChainIdMethod(this.utils, this.formatters),
                new GetTransactionCountMethod(this.utils, this.formatters),
                new SendSignedTransactionMethod(this.utils, this.formatters, transactionObserver)
            );
        }

        // eslint-disable-next-line new-cap
        return new method(this.utils, this.formatters);
    }
}
