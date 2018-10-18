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

import web3CoreMethod from 'web3-core-method';

export default class MethodModelFactory extends web3CoreMethod.AbstractMethodModelFactory {

    /**
     * @param {Object} utils
     * @param {Object} formatters
     * @param {Accounts} accounts
     *
     * @constructor
     */
    constructor(utils, formatters, accounts) {
        super({
            getNodeInfo: web3CoreMethod.GetNodeInfoMethodModel,
            getProtocolVersion: web3CoreMethod.GetProtocolVersionMethodModel,
            getCoinbase: web3CoreMethod.GetCoinbaseMethodModel,
            isMining: web3CoreMethod.IsMiningMethodModel,
            getHashrate: web3CoreMethod.GetHashrateMethodModel,
            isSyncing: web3CoreMethod.IsSyncingMethodModel,
            getGasPrice: web3CoreMethod.GetGasPriceMethodModel,
            getAccounts: web3CoreMethod.GetAccountsMethodModel,
            getBlockNumber: web3CoreMethod.GetBlockNumberMethodModel,
            getBalance: web3CoreMethod.GetBalanceMethodModel,
            getStorageAt: web3CoreMethod.GetStroageAtMethodModel,
            getCode: web3CoreMethod.GetCodeMethodModel,
            getBlock: web3CoreMethod.GetBlockMethodModel,
            getUncle: web3CoreMethod.GetUncleMethodModel,
            getBlockTransactionCount: web3CoreMethod.GetBlockTransactionCountMethodModel,
            getBlockUncleCount: web3CoreMethod.GetBlockUncleCountMethodModel,
            getTransaction: web3CoreMethod.GetTransactionMethodModel,
            getTransactionFromBlock: web3CoreMethod.GetTransactionFromBlockMethodModel,
            getTransactionReceipt: web3CoreMethod.GetTransactionReceipt,
            getTransactionCount: web3CoreMethod.GetTransactionCountMethodModel,
            sendSignedTransaction: web3CoreMethod.SendSignedTransactionMethodModel,
            signTransaction: web3CoreMethod.SignTransactionMethodModel,
            sendTransaction: web3CoreMethod.SendTransactionMethodModel,
            sign: web3CoreMethod.SignMethodModel,
            call: web3CoreMethod.CallMethodModel,
            estimateGas: web3CoreMethod.EstimateGasMethodModel,
            submitWork: web3CoreMethod.SubmitWorkMethodModel,
            getWork: web3CoreMethod.GetWorkMethodModel,
            getPastLogs: web3CoreMethod.GetPastLogsMethodModel
        }, utils, formatters);

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
