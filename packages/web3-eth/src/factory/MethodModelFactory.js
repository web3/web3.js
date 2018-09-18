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

"use strict";

var AbstractMethodModelFactory = require('web3-core-method').AbstractMethodModelFactory;
var GetNodeInfoMethodModel = require('../methods/GetNodeInfoMethodModel');
var GetProtocolVersionMethodModel = require('../methods/GetProtocolVersionMethodModel');
var GetCoinbaseMethodModel = require('../methods/GetCoinbaseMethodModel');
var IsMiningMethodModel = require('../methods/IsMiningMethodModel');
var GetHashrateMethodModel = require('../methods/GetHashrateMethodModel');
var IsSyncingMethodModel = require('../methods/IsSyncingMethodModel');
var GetGasPriceMethodModel = require('../methods/GetGasPriceMethodModel');
var GetAccountsMethodModel = require('../methods/GetAccountsMethodModel');
var GetBlockNumberMethodModel = require('../methods/GetBlockNumberMethodModel');
var GetBalanceMethodModel = require('../methods/GetBalanceMethodModel');
var GetStroageAtMethodModel = require('../methods/GetStroageAtMethodModel');
var GetCodeMethodModel = require('../methods/GetCodeMethodModel');
var GetBlockMethodModel = require('../methods/GetBlockMethodModel');
var GetUncleMethodModel = require('../methods/GetUncleMethodModel');
var GetBlockTransactionCountMethodModel = require('../methods/GetBlockTransactionCountMethodModel');
var GetBlockUncleCountMethodModel = require('../methods/GetBlockUncleCountMethodModel');
var GetTransactionMethodModel = require('../methods/GetTransactionMethodModel');
var GetTransactionFromBlockMethodModel = require('../methods/GetTransactionFromBlockMethodModel');
var GetTransactionReceipt = require('../methods/GetTransactionReceipt');
var GetTransactionCountMethodModel = require('../methods/GetTransactionCountMethodModel');
var SendSignedTransactionMethodModel = require('../methods/SendSignedTransactionMethodModel');
var SignTransactionMethodModel = require('../methods/SignTransactionMethodModel');
var SendTransactionMethodModel = require('../methods/SendTransactionMethodModel');
var SignMethodModel = require('../methods/SignMethodModel');
var CallMethodModel = require('../methods/CallMethodModel');
var EstimateGasMethodModel = require('../methods/EstimateGasMethodModel');
var SubmitWorkMethodModel = require('../methods/SubmitWorkMethodModel');
var GetWorkMethodModel = require('../methods/GetWorkMethodModel');
var GetPastLogsMethodModel = require('../methods/GetPastLogsMethodModel');

/**
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @constructor
 */
function MethodModelFactory(formatters, accounts) {
    AbstractMethodModelFactory.call(this, formatters, accounts);

    this.methodModels = {
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
        getStorageAt: GetStroageAtMethodModel,
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
    };

}

MethodModelFactory.prototype = Object.create(AbstractMethodModelFactory);

module.exports = MethodModelFactory;
