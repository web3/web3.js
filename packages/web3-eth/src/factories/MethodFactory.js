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
    GetBlockNumberMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionMethod,
    GetTransactionReceiptMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    RequestAccountsMethod,
    SendRawTransactionMethod,
    SubmitWorkMethod,
    VersionMethod
} from 'web3-core-method';

import {NewHeadsSubscription} from 'web3-core-subscriptions';
import TransactionObserver from '../../../web3-core-method/src/observers/TransactionObserver';
import SendSignedTransactionMethod from '../methods/SendSignedTransactionMethod';
import GetBlockMethod from '../methods/GetBlockMethod';
import GetUncleMethod from '../methods/GetUncleMethod';
import GetBlockTransactionCountMethod from '../methods/GetBlockTransactionCountMethod';
import GetBlockUncleCountMethod from '../methods/GetBlockUncleCountMethod';
import GetTransactionFromBlockMethod from '../methods/GetTransactionFromBlockMethod';
import SignTransactionMethod from '../methods/SignTransactionMethod';
import SendTransactionMethod from 'web3-core-method/src/methods/transaction/SendTransactionMethod';
import SignMethod from '../methods/SignMethod';
import GetBlockByHashMethod from 'web3-core-method/src/methods/block/GetBlockByHashMethod';

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
            getTransactionReceipt: GetTransactionReceiptMethod,
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
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {AbstractMethod}
     */
    createMethod(name, moduleInstance) {
        const method = this.methods[name];

        if (!method.name.startsWith('Send')) {
            // eslint-disable-next-line new-cap
            return new method(this.utils, this.formatters, moduleInstance);
        }

        let timeout = moduleInstance.transactionBlockTimeout;
        const providerName = moduleInstance.currentProvider.constructor.name;

        if (providerName === 'HttpProvider' || providerName === 'CustomProvider') {
            timeout = moduleInstance.transactionPollingTimeout;
        }

        const transactionObserver = new TransactionObserver(
            moduleInstance.currentProvider,
            timeout,
            moduleInstance.transactionConfirmationBlocks,
            new GetTransactionReceiptMethod(this.utils, this.formatters, moduleInstance),
            new GetBlockByHashMethod(this.utils, this.formatters, moduleInstance),
            new NewHeadsSubscription(this.utils, this.formatters, moduleInstance)
        );

        if (method.name === 'SendObservedTransactionMethod') {
            // eslint-disable-next-line new-cap
            return new method(this.utils, this.formatters, moduleInstance, transactionObserver);
        }

        // eslint-disable-next-line new-cap
        return new method(
            this.utils,
            this.formatters,
            moduleInstance,
            transactionObserver,
            new ChainIdMethod(this.utils, this.formatters, moduleInstance),
            new GetTransactionCountMethod(this.utils, this.formatters, moduleInstance),
            new SendSignedTransactionMethod(this.utils, this.formatters, moduleInstance, transactionObserver)
        );
    }
}
