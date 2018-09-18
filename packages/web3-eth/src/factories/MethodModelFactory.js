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
var GetProtocolVersionMethodModel = require('../methods/network/GetProtocolVersionMethodModel');
var GetNodeInfoMethodModel = require('../methods/node/GetNodeInfoMethodModel');
var GetCoinbaseMethodModel = require('../methods/node/GetCoinbaseMethodModel');
var IsMiningMethodModel = require('../methods/node/IsMiningMethodModel');
var GetHashrateMethodModel = require('../methods/node/GetHashrateMethodModel');
var IsSyncingMethodModel = require('../methods/node/IsSyncingMethodModel');
var GetGasPriceMethodModel = require('../methods/node/GetGasPriceMethodModel');
var SubmitWorkMethodModel = require('../methods/node/SubmitWorkMethodModel');
var GetWorkMethodModel = require('../methods/node/GetWorkMethodModel');
var GetAccountsMethodModel = require('../methods/account/GetAccountsMethodModel');
var GetBalanceMethodModel = require('../methods/account/GetBalanceMethodModel');
var GetTransactionCountMethodModel = require('../methods/account/GetTransactionCountMethodModel');
var GetBlockNumberMethodModel = require('../methods/block/GetBlockNumberMethodModel');
var GetBlockMethodModel = require('../methods/block/GetBlockMethodModel');
var GetUncleMethodModel = require('../methods/block/GetUncleMethodModel');
var GetBlockTransactionCountMethodModel = require('../methods/block/GetBlockTransactionCountMethodModel');
var GetBlockUncleCountMethodModel = require('../methods/block/GetBlockUncleCountMethodModel');
var GetTransactionMethodModel = require('../methods/transaction/GetTransactionMethodModel');
var GetTransactionFromBlockMethodModel = require('../methods/transaction/GetTransactionFromBlockMethodModel');
var GetTransactionReceipt = require('../methods/transaction/GetTransactionReceipt');
var SendSignedTransactionMethodModel = require('../methods/transaction/SendSignedTransactionMethodModel');
var SignTransactionMethodModel = require('../methods/transaction/SignTransactionMethodModel');
var SendTransactionMethodModel = require('../methods/transaction/SendTransactionMethodModel');
var GetCodeMethodModel = require('../methods/GetCodeMethodModel');
var SignMethodModel = require('../methods/SignMethodModel');
var CallMethodModel = require('../methods/CallMethodModel');
var GetStroageAtMethodModel = require('../methods/GetStroageAtMethodModel');
var EstimateGasMethodModel = require('../methods/EstimateGasMethodModel');
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
