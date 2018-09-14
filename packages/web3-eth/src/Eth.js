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
 * @file Eth.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');
var AbstractWeb3Object = require('web3-core-package');

/**
 * @param {Network} net
 * @param {Contract} contract
 * @param {Accounts} accounts
 * @param {Personal} personal
 * @param {Iban} iban
 * @param {Abi} abi
 * @param {ENS} ens
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {MethodPackage} methodPackage
 * @param {ProvidersPackage} providersPackage
 * @param {SubscriptionsResolver} subscriptionsResolver
 *
 * @constructor
 */
var Eth = function Eth(
    net,
    contract,
    accounts,
    personal,
    iban,
    abi,
    ens,
    utils,
    formatters,
    methodPackage,
    providersPackage,
    subscriptionsResolver
) {
    AbstractWeb3Object.call(provider, providersPackage, methodPackage);
    this.net = net;
    this.Contract = contract;
    this.accounts = accounts;
    this.personal = personal;
    this.iban = iban;
    this.abi = abi;
    this.ens = ens;
    this.utils = utils;
    this.formatters = formatters;
    this.subscriptionsResolver = subscriptionsResolver;
    this.methodPackage = methodPackage;
    this._defaultAccount = null;
    this._defaultBlock = 'latest';

    /**
     * Defines accessors for defaultAccount
     */
    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return this._defaultAccount;
        },
        set: function (val) {
            if (val) {
                this._defaultAccount = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(val));
            }
        },
        enumerable: true
    });

    /**
     * Defines accessors for defaultBlock
     */
    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return this._defaultBlock;
        },
        set: function (val) {
            this._defaultBlock = val;
        },
        enumerable: true
    });
};

/**
 * Gets and executes subscription for an given type
 *
 * @method subscribe
 *
 * @param {String} type
 * @param {Array} parameters
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {eventifiedPromise | Subscription}
 */
Eth.prototype.subscribe = function (type, parameters, callback) {
    return this.subscriptionsResolver.resolve(type, parameters, callback);
};

/**
 * Sends the JSON-RPC request web3_clientVersion and gets the node information
 *
 * @method getNodeInfo
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getNodeInfo = function (callback) {
    return this.methodPackage.create(this.currentProvider, 'web3_clientVersion', [], null, null).send(callback);
};

/**
 * Sends the JSON-RPC request eth_protocolVersion and gets the protocol version.
 *
 * @method getProtocolVersion
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getProtocolVersion = function (callback) {
    return this.methodPackage.create(this.currentProvider, 'eth_protocolVersion', [], null, null).send(callback);
};

/**
 * Sends the JSON-RPC request eth_coinbase and gets the coinbase
 *
 * @method getCoinbase
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getCoinbase = function (callback) {
    return this.methodPackage.create(this.currentProvider, 'eth_coinbase', [], null, null).send(callback);
};

/**
 * Sends the JSON-RPC request eth_mining and checks if the node is mining
 *
 * @method isMining
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.isMining = function (callback) {
    return this.methodPackage.create(this.currentProvider, 'eth_mining', [], null, null).send(callback);
};

/**
 * Sends the JSON-RPC request eth_hashrate and returns the current hashrate
 *
 * @method getHashrate
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getHashrate = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_hashrate',
        [],
        null,
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_syncing and checks if the node is syncing
 *
 * @method isSyncing
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.isSyncing = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_syncing',
        [],
        null,
        this.formatters.outputSyncingFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_gasPrice and returns the current gasPrice from this node
 *
 * @method getGasPrice
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getGasPrice = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_gasPrice',
        [],
        null,
        this.formatters.outputBigNumberFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_accounts and returns a list of addresses owned by client.
 *
 * @method getAccounts
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getAccounts = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_accounts',
        [],
        null,
        this.utils.toChecksumAddress
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_blockNumber and returns the current block number.
 *
 * @method getBlockNumber
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockNumber = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_blockNumber',
        [],
        null,
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getBalance and returns the balance of an address
 *
 * @method getBalance
 *
 * @param {String} address
 * @param {Number} block
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBalance = function (address, block, callback) {
    if (!block) {
        block = this.defaultBlock;
    }

    return this.methodPackage.create(
        this.currentProvider,
        'eth_getBalance',
        [address, block],
        [
            this.formatters.inputAddressFormatter,
            this.formatters.inputDefaultBlockNumberFormatter
        ],
        this.formatters.outputBigNumberFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getStorageAt and returns the value from a storage position at a given address
 *
 * @method getStorageAt
 *
 * @param {String} address
 * @param {Number} position
 * @param {Number} block
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getStorageAt = function (address, position, block, callback) {
    if (!block) {
        block = this.defaultBlock;
    }

    return this.methodPackage.create(
        this.currentProvider,
        'eth_getStorageAt',
        [address, position, block],
        [
            this.formatters.inputAddressFormatter,
            this.utils.numberToHex,
            this.formatters.inputDefaultBlockNumberFormatter
        ],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getCode and returns the code of a contract at a given address
 *
 * @method getCode
 *
 * @param {String} address
 * @param {Number} block
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getCode = function (address, block, callback) {
    if (!block) {
        block = this.defaultBlock;
    }

    return this.methodPackage.create(
        this.currentProvider,
        'eth_getCode',
        [address, block],
        [
            this.formatters.inputAddressFormatter,
            this.formatters.inputDefaultBlockNumberFormatter
        ],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getBlockByNumber and returns a block by his number.
 *
 * @method getBlockByNumber
 *
 * @param {Number} blockNumber
 * @param {boolean} returnTransactionObjects
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockByNumber = function (blockNumber, returnTransactionObjects, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getBlockByNumber',
        [blockNumber, returnTransactionObjects],
        [
            this.formatters.inputBlockNumberFormatter,
            function (val) {
                return !!val;
            }
        ],
        this.formatters.outputBlockFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getBlockByHash and return a block by his hash.
 *
 * @method getBlockByHash
 *
 * @param {String} blockHash
 * @param {boolean} returnTransactionObjects
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockByHash = function (blockHash, returnTransactionObjects, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getBlockByHash',
        [blockHash, returnTransactionObjects],
        [
            this.formatters.inputBlockNumberFormatter,
            function (val) {
                return !!val;
            }
        ],
        this.formatters.outputBlockFormatter
    ).send(callback);
};

/**
 * Gets block by hash or number.
 *
 * TODO: Define this method as deprecated
 *
 * @method getBlock
 *
 * @param {String|Number} blockHashOrBlockNumber
 * @param {boolean} returnTransactionObjects
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlock = function (blockHashOrBlockNumber, returnTransactionObjects, callback) {
    if (this.isBlockHash(blockHashOrBlockNumber)) {
        return this.getBlockByHash(returnTransactionObjects, callback);
    }

    return this.getBlockByNumber(blockHashOrBlockNumber, returnTransactionObjects, callback);
};

/**
 * Gets uncle by hash or number.
 *
 * TODO: Define this method as deprecated
 *
 * @method getUncle
 *
 * @param {String|Number} blockHashOrBlockNumber
 * @param {Number} uncleIndex
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getUncle = function (blockHashOrBlockNumber, uncleIndex, callback) {
    if (this.isBlockHash(blockHashOrBlockNumber)) {
        return this.getUnlceByBlockHash(blockHashOrBlockNumber, uncleIndex, callback);
    }

    return this.getUncleByBlockNumber(blockHashOrBlockNumber, uncleIndex, callback);
};

/**
 * Sends the JSON-RPC request eth_getUncleByBlockNumberAndIndex and returns the uncle block by his number and index
 *
 * @method getUncleByBlockNumber
 *
 * @param {Number} blockNumber
 * @param {Number} uncleIndex
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getUncleByBlockNumber = function (blockNumber, uncleIndex, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getUncleByBlockNumberAndIndex',
        [blockNumber, uncleIndex],
        [
            this.formatters.inputBlockNumberFormatter,
            this.utils.numberToHex
        ],
        this.formatters.outputBlockFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getUncleByBlockHashAndIndex and returns the uncle block by his hash and index
 *
 * @method getUnlceByBlockHash
 *
 * @param {String} blockHash
 * @param {Number} uncleIndex
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getUnlceByBlockHash = function (blockHash, uncleIndex, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getUncleByBlockHashAndIndex',
        [blockHash, uncleIndex],
        [
            this.formatters.inputBlockNumberFormatter,
            this.utils.numberToHex
        ],
        this.formatters.outputBlockFormatter
    ).send(callback);
};

/**
 * Gets block transaction count by hash or number.
 *
 * TODO: Define this method as deprecated
 *
 * @method getBlockTransactionCount
 *
 * @param {String|Number} blockHashOrBlockNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockTransactionCount = function (blockHashOrBlockNumber, callback) {
    if (this.isBlockHash(blockHashOrBlockNumber)) {
        return this.getBlockTransactionCountByBlockHash(blockHashOrBlockNumber, callback);
    }

    return this.getBlockTransactionCountByBlockNumber(blockHashOrBlockNumber, callback);
};

/**
 * Sends the JSON-RPC request eth_getBlockTransactionCountByNumber and returns the block transaction count
 * from a block by his number
 *
 * @method getBlockTransactionCountByBlockNumber
 *
 * @param {Number} blockNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockTransactionCountByBlockNumber = function (blockNumber, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getBlockTransactionCountByNumber',
        [blockNumber],
        [
            this.formatters.inputBlockNumberFormatter
        ],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getBlockTransactionCountByHash and returns the block transaction count
 * from a block by his hash
 *
 * @method getBlockTransactionCountByBlockHash
 *
 * @param {String} blockHash
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockTransactionCountByBlockHash = function (blockHash, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getBlockTransactionCountByHash',
        [blockNumber],
        [
            this.formatters.inputBlockNumberFormatter
        ],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Gets block transaction count by hash or number.
 *
 * TODO: Define this method as deprecated
 *
 * @method getBlockUncleCount
 *
 * @param {String|number} blockHashOrBlockNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockUncleCount = function (blockHashOrBlockNumber, callback) {
    if (this.isBlockHash(blockHashOrBlockNumber)) {
        return this.getBlockUncleCountByBlockHash(blockHashOrBlockNumber, callback);
    }

    return this.getBlockUncleCountByBlockNumber(blockHashOrBlockNumber, callback);
};

/**
 * Sends the JSON-RPC request eth_getUncleCountByBlockHash and returns the uncle count of a block by his hash
 *
 * @method getBlockUncleCountByBlockHash
 *
 * @param {String} blockHash
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockUncleCountByBlockHash = function (blockHash, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getUncleCountByBlockHash',
        [blockHash],
        [
            this.formatters.inputBlockNumberFormatter
        ],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getUncleCountByBlockHash and returns the uncle count of a block by his number
 *
 * @method getBlockUncleCountByBlockNumber
 *
 * @param {Number} blockNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getBlockUncleCountByBlockNumber = function (blockNumber, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getUncleCountByBlockNumber',
        [blockNumber],
        [
            this.formatters.inputBlockNumberFormatter
        ],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getTransactionByHash and returns the transaction by his hash
 *
 * @method getTransaction
 *
 * @param {String} transactionHash
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransaction = function (transactionHash, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getTransactionByHash',
        [transactionHash],
        null,
        this.formatters.outputTransactionFormatter
    ).send(callback);
};

/**
 * Gets transaction from block hash or number and index.
 *
 * TODO: Define this method as deprecated
 *
 * @method getTransactionFromBlock
 *
 * @param {String|Number} hashStringOrNumber
 * @param {Number} indexNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransactionFromBlock = function (hashStringOrNumber, indexNumber, callback) {
    if (this.isBlockHash(hashStringOrNumber)) {
        return this.getTransactionFromBlockByBlockHash(hashStringOrNumber, indexNumber, callback);
    }
    return this.getTransactionFromBlockByBlockNumber(hashStringOrNumber, indexNumber, callback);
};

/**
 * Sends the JSON-RPC request eth_getTransactionByBlockHashAndIndex and returns a transaction
 * by his index from a block with the block hash.
 *
 * @method getTransactionFromBlockByBlockHash
 *
 * @param {String} transactionHash
 * @param {Number} indexNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransactionFromBlockByBlockHash = function (transactionHash, indexNumber, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getTransactionByBlockHashAndIndex',
        [transactionHash, indexNumber],
        [
            this.formatters.inputBlockNumberFormatter,
            this.utils.numberToHex
        ],
        this.formatters.outputTransactionFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getTransactionByBlockHashAndIndex and returns a transaction
 * by his index from a block with the block number.
 *
 * @method getTransactionFromBlockByBlockNumber
 *
 * @param {Number} blockNumber
 * @param {Number} indexNumber
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransactionFromBlockByBlockNumber = function (blockNumber, indexNumber, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getTransactionByBlockNumberAndIndex',
        [blockNumber, indexNumber],
        [
            this.formatters.inputBlockNumberFormatter,
            this.utils.numberToHex
        ],
        this.formatters.outputTransactionFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getTransactionReceipt and returns the transaction receipt by his transaction hash
 *
 * @method getTransactionReceipt
 *
 * @param {String} transactionHash
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransactionReceipt = function (transactionHash, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getTransactionReceipt',
        [transactionHash],
        null,
        this.formatters.outputTransactionReceiptFormatter
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getTransactionCount and returns the transaction count of an address
 *
 * @method getTransactionCount
 *
 * @param {String} address
 * @param {Number} block
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getTransactionCount = function (address, block, callback) {
    if (!block) {
        block = this.defaultBlock;
    }

    return this.methodPackage.create(
        this.currentProvider,
        'eth_getTransactionCount',
        [address, block],
        [
            this.formatters.inputAddressFormatter,
            this.formatters.inputDefaultBlockNumberFormatter
        ],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_sendRawTransaction and returns the transaction hash
 *
 * @method sendSignedTransaction
 *
 * @param {String} signedTransactionData
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.sendSignedTransaction = function (signedTransactionData, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_sendRawTransaction',
        [signedTransactionData],
        null,
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_signTransaction and returns the signed transaction
 *
 * @method signTransaction
 *
 * @param {Object} transactionObject
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.signTransaction = function (transactionObject, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_signTransaction',
        [transactionObject],
        [this.formatters.inputTransactionFormatter],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_sendTransaction and returns the transaction hash
 *
 * @method sendTransaction
 *
 * @param {Object} transactionObject
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.sendTransaction = function (transactionObject, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_sendTransaction',
        [transactionObject],
        [this.formatters.inputTransactionFormatter],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_sign and returns the signed data
 *
 * @method sign
 *
 * @param {String} dataToSign
 * @param {String} address
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.sign = function (dataToSign, address, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_sign',
        [address, dataToSign],
        [
            this.formatters.inputSignFormatter,
            this.formatters.inputAddressFormatter
        ],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_call and returns the return value of the executed contract
 *
 * @method call
 *
 * @param {Object} callObject
 * @param {Number|String} block
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.call = function (callObject, block, callback) {
    if (!block) {
        block = this.defaultBlock;
    }

    return this.methodPackage.create(
        this.currentProvider,
        'eth_call',
        [callObject, block],
        [
            this.formatters.inputCallFormatter,
            this.formatters.inputDefaultBlockNumberFormatter
        ],
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_estimateGas and returns the estimated gas
 *
 * @method estimateGas
 *
 * @param {Object} callObject
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.estimateGas = function (callObject, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_estimateGas',
        [callObject],
        [this.formatters.inputCallFormatter],
        this.utils.hexToNumber
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_submitWork and returns the validation result
 *
 * @method submitWork
 *
 * @param {String} nonce
 * @param {String} powHash
 * @param {String} digest
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.submitWork = function (nonce, powHash, digest, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_submitWork',
        [nonce, powHash, digest],
        null,
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getWork and returns the hash of the current block, the seedHash, and the
 * boundary condition to be met ("target").
 *
 * @method getWork
 *
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getWork = function (callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getWork',
        [],
        null,
        null
    ).send(callback);
};

/**
 * Sends the JSON-RPC request eth_getLogs and returns an array of all logs matching a given filter object
 *
 * @method getPastLogs
 *
 * @param {Object} options
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {Promise}
 */
Eth.prototype.getPastLogs = function (options, callback) {
    return this.methodPackage.create(
        this.currentProvider,
        'eth_getLogs',
        [],
        [this.formatters.inputLogFormatter],
        this.formatters.outputLogFormatter
    ).send(callback);
};

/**
 * Determines if given block parameter is of type hash or number
 *
 * @method isBlockHash
 *
 * @param {String|Number} blockParameter
 * @returns {boolean}
 */
Eth.prototype.isBlockHash = function (blockParameter) {
    return _.isString(blockParameter) && blockParameter.indexOf('0x') === 0
};

/**
 * Extends Eth with clearSubscriptions from the current provider
 */
Eth.prototype.clearSubscriptions = function () {
    this.currentProvider.clearSubscriptions();
};

/**
 * Extends setProvider method from AbstractWeb3Object.
 * This is required for updating the provider also in the sub packages and objects related to Eth.
 *
 * @param {any} provider
 */
Eth.prototype.setProvider = function (provider) {
    AbstractWeb3Object.setProvider.call(provider);

    this.subscriptionsResolver.setProvider(provider);
    this.net.setProvider(provider);
    this.accounts.setProvider(provider);
    this.personal.setProvider(provider);
    this.ens.setProvider(provider);
};

Eth.prototype = Object.create(AbstractWeb3Object.prototype);

module.exports = Eth;
