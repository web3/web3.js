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
var Method = require('web3-core-method');
var utils = require('web3-utils');
var Net = require('web3-net');

var Personal = require('web3-eth-personal');
var Contract = require('web3-eth-contract');
var Iban = require('web3-eth-iban');
var Accounts = require('web3-eth-accounts');
var abi = require('web3-eth-abi');



var getNetworkType = require('./getNetworkType.js');

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


var Eth = function Eth() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    this.clearSubscriptions = _this._requestManager.clearSubscriptions;

    methods().forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager, _this); // second param means is Eth (necessary for promiEvent)
    });

    // add net
    this.net = new Net(this.currentProvider);

    // add guess chain
    this.net.getNetworkType = getNetworkType.bind(this);


    // add accounts
    this.accounts = new Accounts(this);

    // add personal
    this.personal = new Personal(this.currentProvider);

    // add contract
    this.Contract = Contract;
    this.Contract.prototype._eth = this;

    // add IBAN
    this.Iban = Iban;

    // add ABI
    this.abi = abi;

};

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
        name: 'getProtocolVersion',
        call: 'eth_protocolVersion',
        params: 0
    });

    var getCoinbase = new Method({
        name: 'getCoinbase',
        call: 'eth_coinbase',
        params: 0
    });

    var getMining = new Method({
        name: 'isMining',
        call: 'eth_mining',
        params: 0
    });

    var getHashrate = new Method({
        name: 'getHashrate',
        call: 'eth_hashrate',
        params: 0,
        outputFormatter: utils.hexToNumber
    });

    var isSyncing = new Method({
        name: 'isSyncing',
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
        outputFormatter: utils.hexToNumber
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
        inputFormatter: [formatters.inputAddressFormatter, utils.numberToHex, formatters.inputDefaultBlockNumberFormatter]
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
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.numberToHex],
        outputFormatter: formatters.outputBlockFormatter,

    });

    var getBlockTransactionCount = new Method({
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    });

    var getBlockUncleCount = new Method({
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    });

    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'eth_getTransactionByHash',
        params: 1,
        inputFormatter: [null],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionFromBlock = new Method({
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.numberToHex],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionReceipt = new Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null],
        outputFormatter: formatters.outputTransactionReceiptFormatter
    });

    var getTransactionCount = new Method({
        name: 'getTransactionCount',
        call: 'eth_getTransactionCount',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.hexToNumber
    });

    var sendSignedTransaction = new Method({
        name: 'sendSignedTransaction',
        call: 'eth_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
    });

    var signTransaction = new Method({
        name: 'signTransaction',
        call: 'eth_signTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
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
        inputFormatter: [formatters.inputSignFormatter, formatters.inputAddressFormatter],
        transformPayload: function (payload) {
            payload.params.reverse();
            return payload;
        }
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
        outputFormatter: utils.hexToNumber
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
        type: 'eth',
        subscriptions: {
            'newBlockHeaders': {
                // TODO change name on RPC side?
                subscriptionName: 'newHeads', // replace subscription with this name
                params: 0,
                outputFormatter: formatters.outputBlockFormatter
            },
            'pendingTransactions': {
                params: 0
                // outputFormatter: formatters.outputTransactionFormatter // returns only hash???
            },
            'logs': {
                params: 1,
                inputFormatter: [formatters.inputLogFormatter],
                outputFormatter: formatters.outputLogFormatter,
                // DUBLICATE, also in web3-eth-contract
                subscriptionHandler: function (output) {
                    if(output.removed) {
                        this.emit('changed', output);
                    } else {
                        this.emit('data', output);
                    }

                    if (_.isFunction(this.callback)) {
                        this.callback(null, output, this);
                    }
                }
            },
            'syncing': {
                params: 0,
                outputFormatter: formatters.outputSyncingFormatter,
                subscriptionHandler: function (output) {
                    var _this = this;

                    // fire TRUE at start
                    if(this._isSyncing !== true) {
                        this._isSyncing = true;
                        this.emit('changed', _this._isSyncing);

                        if (_.isFunction(this.callback)) {
                            this.callback(null, _this._isSyncing, this);
                        }

                        setTimeout(function () {
                            _this.emit('data', output);

                            if (_.isFunction(_this.callback)) {
                                _this.callback(null, output, _this);
                            }
                        }, 0);

                    // fire sync status
                    } else {
                        this.emit('data', output);
                        if (_.isFunction(_this.callback)) {
                            this.callback(null, output, this);
                        }

                        // wait for some time before fireing the FALSE
                        clearTimeout(this._isSyncingTimeout);
                        this._isSyncingTimeout = setTimeout(function () {
                            if(output.currentBlock > output.highestBlock - 200) {
                                _this._isSyncing = false;
                                _this.emit('changed', _this._isSyncing);

                                if (_.isFunction(_this.callback)) {
                                    _this.callback(null, _this._isSyncing, _this);
                                }
                            }
                        }, 500);
                    }
                }
            }
        }
    });


    return [
        getVersion,
        getCoinbase,
        getMining,
        getHashrate,
        isSyncing,
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
        sendSignedTransaction,
        signTransaction,
        sendTransaction,
        sign,
        compileSolidity,
        compileLLL,
        compileSerpent,
        submitWork,
        getWork,
        getPastLogs,
        subscribe
    ];
};


module.exports = Eth;

