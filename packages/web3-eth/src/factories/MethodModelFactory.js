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
 * @file MethodModelFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {
    AbstractMethodModelFactory,
    GetNodeInfoMethodModel,
    GetProtocolVersionMethodModel,
    GetCoinbaseMethodModel,
    IsMiningMethodModel,
    GetHashrateMethodModel,
    IsSyncingMethodModel,
    GetGasPriceMethodModel,
    GetAccountsMethodModel,
    GetBlockNumberMethodModel,
    GetBalanceMethodModel,
    GetStorageAtMethodModel,
    GetCodeMethodModel,
    GetBlockMethodModel,
    GetUncleMethodModel,
    GetBlockTransactionCountMethodModel,
    GetBlockUncleCountMethodModel,
    GetTransactionMethodModel,
    GetTransactionFromBlockMethodModel,
    GetTransactionReceipt,
    GetTransactionCountMethodModel,
    SendSignedTransactionMethodModel,
    SignTransactionMethodModel,
    SendTransactionMethodModel,
    SignMethodModel,
    CallMethodModel,
    EstimateGasMethodModel,
    SubmitWorkMethodModel,
    GetWorkMethodModel,
    GetPastLogsMethodModel
} from 'web3-core-method';

export default class MethodModelFactory extends AbstractMethodModelFactory {
    /**
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(utils, formatters, accounts) {
        super(
            {
                getNodeInfo: GetNodeInfoMethodModel,
                getProtocolVersion: GetProtocolVersionMethodModel,
                getCoinbase: GetCoinbaseMethodModel,
                isMining: IsMiningMethodModel,
                getHashrate: GetHashrateMethodModel,
                isSyncing: IsSyncingMethodModel,
                getGasPrice: GetGasPriceMethodModel,
                getAccounts: GetAccountsMethodModel,
                getBlockNumber: GetBlockNumberMethodModel,
                getBalance: GetBalanceMethodModel,
                getStorageAt: GetStorageAtMethodModel,
                getCode: GetCodeMethodModel,
                getBlock: GetBlockMethodModel,
                getUncle: GetUncleMethodModel,
                getBlockTransactionCount: GetBlockTransactionCountMethodModel,
                getBlockUncleCount: GetBlockUncleCountMethodModel,
                getTransaction: GetTransactionMethodModel,
                getTransactionFromBlock: GetTransactionFromBlockMethodModel,
                getTransactionReceipt: GetTransactionReceipt,
                getTransactionCount: GetTransactionCountMethodModel,
                sendSignedTransaction: SendSignedTransactionMethodModel,
                signTransaction: SignTransactionMethodModel,
                sendTransaction: SendTransactionMethodModel,
                sign: SignMethodModel,
                call: CallMethodModel,
                estimateGas: EstimateGasMethodModel,
                submitWork: SubmitWorkMethodModel,
                getWork: GetWorkMethodModel,
                getPastLogs: GetPastLogsMethodModel
            },
            utils,
            formatters
        );

        this.accounts = accounts;
    }

    /**
     * Returns an MethodModel object
     *
     * @method createMethodModel
     *
     * @param {String} name
     *
     * @returns {AbstractMethodModel}
     */
    createMethodModel(name) {
        return new this.methodModels[name](this.utils, this.formatters, this.accounts);
    }
}
