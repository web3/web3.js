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
var Method = require('web3-core-method');
var utils = require('web3-utils');
var Net = require('web3-net');

var ENS = require('web3-eth-ens');
var Personal = require('web3-eth-personal');
var BaseContract = require('web3-eth-contract');
var Iban = require('web3-eth-iban');
var Accounts = require('web3-eth-accounts');
var ABI = require('web3-eth-abi');

var getNetworkType = require('./getNetworkType.js');
var EthSubscriptionResolver = require('./resolvers/EthSubscriptionResolver');
var formatter = helpers.formatters;


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
    this.setContractPackage(BaseContract);
    this.setNetPackage(new Net(this.currentProvider));
    this.setAccountsPackage(new Accounts(this.currentProvider));
    this.setPersonalPackage(new Personal(this.currentProvider));
    this.setIBANPackage(Iban);
    this.setABIPackage(ABI);
    this.setENSPackage(new ENS(this));
    this.setMethods();

    this.subscriptionResolver = new EthSubscriptionResolver(this.currentProvider);

    // sets _requestmanager
    core.packageInit(this, arguments);
};

core.addProviders(Eth);

/**
 * PACKAGE INIT (core.packageInit) overwrites setProvider!
 *
 * // overwrite setProvider
 var setProvider = this.setProvider;
 *
 *
 */
Eth.prototype.setProvider = function () {
    setProvider.apply(this, arguments);
    this.net.setProvider.apply(this, arguments);
    this.personal.setProvider.apply(this, arguments);
    this.accounts.setProvider.apply(this, arguments);
    this.Contract.setProvider(this.currentProvider, this.accounts);
};

/**
 * Sets the Contract package as property of Eth
 *
 * @param {Object} contractPackage
 */
Eth.prototype.setContractPackage = function (contractPackage) {
    // create a proxy Contract type for this instance, as a Contract's provider
    // is stored as a class member rather than an instance variable. If we do
    // not create this proxy type, changing the provider in one instance of
    // web3-eth would subsequently change the provider for _all_ contract
    // instances!
    var self = this;
    var Contract = function Contract() {
        contractPackage.apply(this, arguments);

        // when Eth.setProvider is called, call packageInit
        // on all contract instances instantiated via this Eth
        // instances. This will update the currentProvider for
        // the contract instances
        var _this = this;
        var setProvider = self.setProvider;
        self.setProvider = function() {
            setProvider.apply(self, arguments);
            core.packageInit(_this, [self.currentProvider]);
        };
    };

    Contract.setProvider = function() {
        contractPackage.setProvider.apply(this, arguments);
    };

    // make our proxy Contract inherit from web3-eth-contract so that it has all
    // the right functionality and so that instanceof and friends work properly
    Contract.prototype = Object.create(contractPackage.prototype);
    Contract.prototype.constructor = Contract;

    // add contract
    this.Contract = Contract;
    this.Contract.defaultAccount = this.defaultAccount;
    this.Contract.defaultBlock = this.defaultBlock;
    this.Contract.setProvider(this.currentProvider, this.accounts);

};

/**
 * Sets the Net package as property of Eth
 *
 * @param {Object} net
 */
Eth.prototype.setNetPackage = function (net) {
    this.net = net;
    this.net.getNetworkType = getNetworkType.bind(this);
};

/**
 * Sets the Accounts package as property of Eth
 *
 * @param {Object} accounts
 */
Eth.prototype.setAccountsPackage = function (accounts) {
    this.accounts = accounts;
};

/**
 * Sets the Personal package as property of Eth
 *
 * @param {Object} personal
 */
Eth.prototype.setPersonalPackage = function (personal) {
    this.personal = personal;
    this.personal.defaultAccount = this.defaultAccount;
};

/**
 * Sets the Iban package as property of Eth
 *
 * @param {Object} iban
 */
Eth.prototype.setIBANPackage = function (iban) {
    this.Iban = iban;
};

/**
 * Sets the ABI package as property of Eth
 *
 * @param {Object} abi
 */
Eth.prototype.setABIPackage = function (abi) {
    this.abi = abi;
};

/**
 * Sets the ENS package as property of Eth
 *
 * @param {Object} ens
 */
Eth.prototype.setENSPackage = function (ens) {
    this.ens = ens;
};

/**
 * Defines accessors for defaultAccount
 */
Object.defineProperty(Eth, 'defaultAccount', {
    get: function () {
        return this.defaultAccount ? this.defaultAccount : null;
    },
    set: function (val) {
        if(val) {
            this.defaultAccount = utils.toChecksumAddress(formatter.inputAddressFormatter(val));
        }

        // also set on the Contract object
        _this.Contract.defaultAccount = defaultAccount;
        _this.personal.defaultAccount = defaultAccount;

        // update defaultBlock
        methods.forEach(function(method) {
            method.defaultAccount = defaultAccount;
        });

        return val;
    },
    enumerable: true
});

/**
 * Defines accessors for defaultBlock
 */
Object.defineProperty(Eth, 'defaultBlock', {
    get: function () {
        return this.defaultBlock ? this.defaultBlock : 'latest';
    },
    set: function (val) {
        var self = this;
        this.defaultBlock = val;

        // also set on the Contract object
        this.Contract.defaultBlock = this.defaultBlock;
        this.personal.defaultBlock = this.defaultBlock;

        // update defaultBlock
        methods.forEach(function(method) {
            method.defaultBlock = self.defaultBlock;
        });

        return val;
    },
    enumerable: true
});

/**
 * Gets and executes subscription for an given type
 *
 * @param {string} type
 * @param {*} parameters
 * @param {Function} callback
 */
Eth.prototype.subscribe = function (type, parameters, callback) {
   return this.subscriptionResolver.resolve(type, parameters).subscribe(callback);
};

/**
 * Appends rpc methods to Eth
 */
Eth.prototype.setMethods = function () {
    var methods = [
        new Method({
            name: 'getNodeInfo',
            call: 'web3_clientVersion'
        }),
        new Method({
            name: 'getProtocolVersion',
            call: 'eth_protocolVersion',
            params: 0
        }),
        new Method({
            name: 'getCoinbase',
            call: 'eth_coinbase',
            params: 0
        }),
        new Method({
            name: 'isMining',
            call: 'eth_mining',
            params: 0
        }),
        new Method({
            name: 'getHashrate',
            call: 'eth_hashrate',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'isSyncing',
            call: 'eth_syncing',
            params: 0,
            outputFormatter: formatter.outputSyncingFormatter
        }),
        new Method({
            name: 'getGasPrice',
            call: 'eth_gasPrice',
            params: 0,
            outputFormatter: formatter.outputBigNumberFormatter
        }),
        new Method({
            name: 'getAccounts',
            call: 'eth_accounts',
            params: 0,
            outputFormatter: utils.toChecksumAddress
        }),
        new Method({
            name: 'getBlockNumber',
            call: 'eth_blockNumber',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getBalance',
            call: 'eth_getBalance',
            params: 2,
            inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter],
            outputFormatter: formatter.outputBigNumberFormatter
        }),
        new Method({
            name: 'getStorageAt',
            call: 'eth_getStorageAt',
            params: 3,
            inputFormatter: [formatter.inputAddressFormatter, utils.numberToHex, formatter.inputDefaultBlockNumberFormatter]
        }),
        new Method({
            name: 'getCode',
            call: 'eth_getCode',
            params: 2,
            inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter]
        }),
        new Method({
            name: 'getBlock',
            call: blockCall,
            params: 2,
            inputFormatter: [formatter.inputBlockNumberFormatter, function (val) { return !!val; }],
            outputFormatter: formatter.outputBlockFormatter
        }),
        new Method({
            name: 'getUncle',
            call: uncleCall,
            params: 2,
            inputFormatter: [formatter.inputBlockNumberFormatter, utils.numberToHex],
            outputFormatter: formatter.outputBlockFormatter,

        }),
        new Method({
            name: 'getBlockTransactionCount',
            call: getBlockTransactionCountCall,
            params: 1,
            inputFormatter: [formatter.inputBlockNumberFormatter],
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getBlockUncleCount',
            call: uncleCountCall,
            params: 1,
            inputFormatter: [formatter.inputBlockNumberFormatter],
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getTransaction',
            call: 'eth_getTransactionByHash',
            params: 1,
            inputFormatter: [null],
            outputFormatter: formatter.outputTransactionFormatter
        }),
        new Method({
            name: 'getTransactionFromBlock',
            call: transactionFromBlockCall,
            params: 2,
            inputFormatter: [formatter.inputBlockNumberFormatter, utils.numberToHex],
            outputFormatter: formatter.outputTransactionFormatter
        }),
        new Method({
            name: 'getTransactionReceipt',
            call: 'eth_getTransactionReceipt',
            params: 1,
            inputFormatter: [null],
            outputFormatter: formatter.outputTransactionReceiptFormatter
        }),
        new Method({
            name: 'getTransactionCount',
            call: 'eth_getTransactionCount',
            params: 2,
            inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter],
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'sendSignedTransaction',
            call: 'eth_sendRawTransaction',
            params: 1,
            inputFormatter: [null]
        }),
        new Method({
            name: 'signTransaction',
            call: 'eth_signTransaction',
            params: 1,
            inputFormatter: [formatter.inputTransactionFormatter]
        }),
        new Method({
            name: 'sendTransaction',
            call: 'eth_sendTransaction',
            params: 1,
            inputFormatter: [formatter.inputTransactionFormatter]
        }),
        new Method({
            name: 'sign',
            call: 'eth_sign',
            params: 2,
            inputFormatter: [formatter.inputSignFormatter, formatter.inputAddressFormatter],
            transformPayload: function (payload) {
                payload.params.reverse();
                return payload;
            }
        }),
        new Method({
            name: 'call',
            call: 'eth_call',
            params: 2,
            inputFormatter: [formatter.inputCallFormatter, formatter.inputDefaultBlockNumberFormatter]
        }),
        new Method({
            name: 'estimateGas',
            call: 'eth_estimateGas',
            params: 1,
            inputFormatter: [formatter.inputCallFormatter],
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'submitWork',
            call: 'eth_submitWork',
            params: 3
        }),
        new Method({
            name: 'getWork',
            call: 'eth_getWork',
            params: 0
        }),
        new Method({
            name: 'getPastLogs',
            call: 'eth_getLogs',
            params: 1,
            inputFormatter: [formatter.inputLogFormatter],
            outputFormatter: formatter.outputLogFormatter
        }),
    ];

    methods.forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager, _this.accounts); // second param means is eth.accounts (necessary for wallet signing)
        method.defaultBlock = _this.defaultBlock;
        method.defaultAccount = _this.defaultAccount;
    });

};

/**
 * Extends Eth with clearSubscriptions from the current provider
 */
Eth.prototype.clearSubscriptions = this.currentProvider.clearSubscriptions;

module.exports = Eth;
