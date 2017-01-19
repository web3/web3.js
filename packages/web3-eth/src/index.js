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
 * @file index.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var _ = require('underscore');
var core = require('web3-core');
var helpers = require('web3-core-helpers');
var Subscriptions = require('web3-core-subscriptions').subscriptions;
var utils = require('web3-utils');
var Method = require('web3-core-method');
var Contract = require('./contract');

var formatters = helpers.formatters;


var blockCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (_.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
};


function Eth(provider) {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);


    methods().forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });


    // add contract
    this.contract = Contract;
    this.contract.prototype._eth = this;

}

core.addProviders(Eth);


Object.defineProperty(Eth.prototype, 'defaultBlock', {
    get: function () {
        return helpers.config.defaultBlock;
    },
    set: function (val) {
        helpers.config.defaultBlock = val;
        return val;
    },
    enumerable: true
});

Object.defineProperty(Eth.prototype, 'defaultAccount', {
    get: function () {
        return helpers.config.defaultAccount;
    },
    set: function (val) {
        helpers.config.defaultAccount = val;
        return val;
    },
    enumerable: true
});

var methods = function () {

    var getVersion = new Method({
        name: 'getVersion',
        call: 'eth_protocolVersion',
        params: 0
    });

    var getCoinbase = new Method({
        name: 'getCoinbase',
        call: 'eth_coinbase',
        params: 0
    });

    var getMining = new Method({
        name: 'getMining',
        call: 'eth_mining',
        params: 0
    });

    var getHashrate = new Method({
        name: 'getHashrate',
        call: 'eth_hashrate',
        params: 0,
        outputFormatter: utils.toDecimal
    });

    var getSyncing = new Method({
        name: 'getSyncing',
        call: 'eth_syncing',
        params: 0,
        outputFormatter: formatters.outputSyncingFormatter
    });

    var getGasPrice = new Method({
        name: 'getGasPrice',
        call: 'eth_gasPrice',
        params: 0,
        outputFormatter: formatters.outputBigNumberFormatter
    });

    var getAccounts = new Method({
        name: 'getAccounts',
        call: 'eth_accounts',
        params: 0,
        outputFormatter: utils.toChecksumAddress
        });

    var getBlockNumber = new Method({
        name: 'getBlockNumber',
        call: 'eth_blockNumber',
        params: 0,
        outputFormatter: utils.toDecimal
    });

    var getBalance = new Method({
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBigNumberFormatter
    });

    var getStorageAt = new Method({
        name: 'getStorageAt',
        call: 'eth_getStorageAt',
        params: 3,
        inputFormatter: [formatters.inputAddressFormatter, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
    });

    var getCode = new Method({
        name: 'getCode',
        call: 'eth_getCode',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var getBlock = new Method({
        name: 'getBlock',
        call: blockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
        outputFormatter: formatters.outputBlockFormatter
    });

    var getUncle = new Method({
        name: 'getUncle',
        call: uncleCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputBlockFormatter,

    });

    var getBlockTransactionCount = new Method({
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getBlockUncleCount = new Method({
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'eth_getTransactionByHash',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionFromBlock = new Method({
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionReceipt = new Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: formatters.outputTransactionReceiptFormatter
    });

    var getTransactionCount = new Method({
        name: 'getTransactionCount',
        call: 'eth_getTransactionCount',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var sendRawTransaction = new Method({
        name: 'sendRawTransaction',
        call: 'eth_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'eth_sendTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var sign = new Method({
        name: 'sign',
        call: 'eth_sign',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, null]
    });

    var call = new Method({
        name: 'call',
        call: 'eth_call',
        params: 2,
        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var estimateGas = new Method({
        name: 'estimateGas',
        call: 'eth_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.toDecimal
    });

    var getCompilers = new Method({
        name: 'getCompilers',
        call: 'eth_getCompilers',
        params: 0
    });

    var compileSolidity = new Method({
        name: 'compile.solidity',
        call: 'eth_compileSolidity',
        params: 1
    });

    var compileLLL = new Method({
        name: 'compile.lll',
        call: 'eth_compileLLL',
        params: 1
    });

    var compileSerpent = new Method({
        name: 'compile.serpent',
        call: 'eth_compileSerpent',
        params: 1
    });

    var submitWork = new Method({
        name: 'submitWork',
        call: 'eth_submitWork',
        params: 3
    });

    var getWork = new Method({
        name: 'getWork',
        call: 'eth_getWork',
        params: 0
    });

    var getPastLogs = new Method({
        name: 'getPastLogs',
        call: 'eth_getLogs',
        params: 1,
        inputFormatter: [formatters.inputLogFormatter],
        outputFormatter: formatters.outputLogFormatter
    });


    // subscriptions
    var subscribe = new Subscriptions({
        name: 'subscribe',
        subscribe: 'eth_subscribe',
        unsubscribe: 'eth_unsubscribe',
        subscriptions: {
            'newHeads': {
                params: 0,
                outputFormatter: formatters.outputBlockFormatter
            },
            'pendingTransactions': {
                params: 0,
                outputFormatter: formatters.outputTransactionFormatter
            },
            'logs': {
                params: 1,
                inputFormatter: [formatters.inputLogFormatter],
                outputFormatter: formatters.outputLogFormatter
            },
            'syncing': {
                params: 0,
                outputFormatter: formatters.outputSyncingFormatter
            }
        }
    });


    return [
        getVersion,
        getCoinbase,
        getMining,
        getHashrate,
        getSyncing,
        getGasPrice,
        getAccounts,
        getBlockNumber,
        getBalance,
        getStorageAt,
        getCode,
        getBlock,
        getUncle,
        getCompilers,
        getBlockTransactionCount,
        getBlockUncleCount,
        getTransaction,
        getTransactionFromBlock,
        getTransactionReceipt,
        getTransactionCount,
        call,
        estimateGas,
        sendRawTransaction,
        sendTransaction,
        sign,
        compileSolidity,
        compileLLL,
        compileSerpent,
        submitWork,
        getWork,
        subscribe,
        getPastLogs
    ];
};


module.exports = Eth;

