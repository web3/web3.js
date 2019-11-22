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
 * @file formatters.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2017
 */

"use strict";

var _ = require('underscore');
var utils = require('web3-utils');
var Iban = require('web3-eth-iban');


/**
 * Will format the given storage key array values to hex strings.
 *
 * @method inputStorageKeysFormatter
 *
 * @param {Array<Number|String|BN|BigNumber>} keys
 *
 * @returns {Array<String>}
 */
var inputStorageKeysFormatter = function (keys) {
    return keys.map(utils.numberToHex);
};

/**
 * Will format the given proof response from the node.
 *
 * @method outputProofFormatter
 *
 * @param {object} proof
 *
 * @returns {object}
 */
var outputProofFormatter = function (proof) {
    proof.address = utils.toChecksumAddress(proof.address);
    proof.nonce = outputBigNumberFormatter(proof.nonce);
    proof.balance = outputBigNumberFormatter(proof.balance);

    return proof;
};

/**
 * Should the format output to a big number
 *
 * @method outputBigNumberFormatter
 *
 * @param {String|Number|BigNumber|BN} number
 *
 * @returns {BN} object
 */
var outputBigNumberFormatter = function (number) {
    if (!number) {
        return number;
    }

    return utils.toBN(number).toString(10);
};

/**
 * Returns true if the given blockNumber is 'latest', 'pending', or 'earliest.
 *
 * @method isPredefinedBlockNumber
 *
 * @param {String} blockNumber
 *
 * @returns {Boolean}
 */
var isPredefinedBlockNumber = function (blockNumber) {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
};

/**
 * Returns the given block number as hex string or does return the defaultBlock property of the current module
 *
 * @method inputDefaultBlockNumberFormatter
 *
 * @param {String|Number|BN|BigNumber} blockNumber
 *
 * @returns {String}
 */
var inputDefaultBlockNumberFormatter = function (blockNumber) {
    if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }

    if (this && (blockNumber === undefined || blockNumber === null)) {
        return utils.numberToHex(this.defaultBlock);
    }
    if (blockNumber === 'genesis' || blockNumber === 'earliest') {
        return '0x0';
    }
    return inputBlockNumberFormatter(blockNumber);
};

/**
 * Returns the given block number as hex string or the predefined block number 'latest', 'pending', 'earliest', 'genesis'
 *
 * @param {String|Number|undefined} blockNumber
 *
 * @returns {String|Number|BN|BigNumber}
 */
var inputBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined) {
        return undefined;
    } else if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }
    return (utils.isHexStrict(blockNumber)) ? ((_.isString(blockNumber)) ? blockNumber.toLowerCase() : blockNumber) : utils.numberToHex(blockNumber);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method _txInputFormatter
 * @param {Object} transaction options
 * @returns object
 */
var _txInputFormatter = function (options) {

    if (options.to) { // it might be contract creation
        options.to = inputAddressFormatter(options.to);
    }

    if (options.data && options.input) {
        throw new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
    }

    if (!options.data && options.input) {
        options.data = options.input;
        delete options.input;
    }

    if (options.data && !utils.isHex(options.data)) {
        throw new Error('The data field must be HEX encoded data.');
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gas = options.gas || options.gasLimit;
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function (key) {
        options[key] = utils.numberToHex(options[key]);
    });

    return options;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputCallFormatter
 * @param {Object} transaction options
 * @returns object
 */
var inputCallFormatter = function (options) {

    options = _txInputFormatter(options);

    var from = options.from || (this ? this.defaultAccount : null);

    if (from) {
        options.from = inputAddressFormatter(from);
    }


    return options;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 * @param {Object} options
 * @returns object
 */
var inputTransactionFormatter = function (options) {

    options = _txInputFormatter(options);

    // check from, only if not number, or object
    if (!_.isNumber(options.from) && !_.isObject(options.from)) {
        options.from = options.from || (this ? this.defaultAccount : null);

        if (!options.from && !_.isNumber(options.from)) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        options.from = inputAddressFormatter(options.from);
    }

    return options;
};

/**
 * Hex encodes the data passed to eth_sign and personal_sign
 *
 * @method inputSignFormatter
 * @param {String} data
 * @returns {String}
 */
var inputSignFormatter = function (data) {
    return (utils.isHexStrict(data)) ? data : utils.utf8ToHex(data);
};

/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
 */
var outputTransactionFormatter = function (tx) {
    tx.transactionIndex = utils.hexToNumber(tx.transactionIndex);
    tx.blockNumber = outputBigNumberFormatter(tx.blockNumber);
    tx.nonce = outputBigNumberFormatter(tx.nonce);
    tx.value = outputBigNumberFormatter(tx.value);
    tx.gasPrice = outputBigNumberFormatter(tx.gasPrice);
    tx.gas = outputBigNumberFormatter(tx.gas);

    if (tx.to && utils.isAddress(tx.to)) { // tx.to could be `0x0` or `null` while contract creation
        tx.to = utils.toChecksumAddress(tx.to);
    } else {
        tx.to = null; // set to `null` if invalid address
    }

    if (tx.from) {
        tx.from = utils.toChecksumAddress(tx.from);
    }

    return tx;
};

/**
 * Formats the output of a transaction receipt to its proper values
 *
 * @method outputTransactionReceiptFormatter
 * @param {Object} receipt
 * @returns {Object}
 */
var outputTransactionReceiptFormatter = function (receipt) {
    if (typeof receipt !== 'object') {
        throw new Error('Received receipt is invalid: ' + receipt);
    }

    receipt.blockNumber = outputBigNumberFormatter(receipt.blockNumber);
    receipt.cumulativeGasUsed = outputBigNumberFormatter(receipt.cumulativeGasUsed);
    receipt.gasUsed = outputBigNumberFormatter(receipt.gasUsed);
    receipt.transactionIndex = utils.hexToNumber(receipt.transactionIndex);

    if (_.isArray(receipt.logs)) {
        receipt.logs = receipt.logs.map(outputLogFormatter);
    }

    if (receipt.contractAddress) {
        receipt.contractAddress = utils.toChecksumAddress(receipt.contractAddress);
    }

    if (typeof receipt.status !== 'undefined' && receipt.status !== null) {
        receipt.status = Boolean(parseInt(receipt.status));
    }

    return receipt;
};

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 * @param {Object} block
 * @returns {Object}
 */
var outputBlockFormatter = function (block) {
    // transform to number
    block.gasLimit = outputBigNumberFormatter(block.gasLimit);
    block.gasUsed = outputBigNumberFormatter(block.gasUsed);
    block.size = outputBigNumberFormatter(block.size);
    block.timestamp = outputBigNumberFormatter(block.timestamp);
    block.number = outputBigNumberFormatter(block.number);

    if (block.difficulty) {
        block.difficulty = outputBigNumberFormatter(block.difficulty);
    }

    if (block.totalDifficulty) {
        block.totalDifficulty = outputBigNumberFormatter(block.totalDifficulty);
    }

    if (_.isArray(block.transactions)) {
        block.transactions.forEach(function (item) {
            if (!_.isString(item))
                return outputTransactionFormatter(item);
        });
    }

    if (block.miner)
        block.miner = utils.toChecksumAddress(block.miner);

    return block;
};

/**
 * Formats the input of a log
 *
 * @method inputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
 */
var inputLogFormatter = function (options) {
    var toTopic = function (value) {

        if (value === null || typeof value === 'undefined')
            return null;

        value = String(value);

        if (value.indexOf('0x') === 0)
            return value;
        else
            return utils.fromUtf8(value);
    };

    if (options.fromBlock || options.fromBlock === 0)
        options.fromBlock = inputBlockNumberFormatter(options.fromBlock);

    if (options.toBlock || options.toBlock === 0)
        options.toBlock = inputBlockNumberFormatter(options.toBlock);


    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map(function (topic) {
        return (_.isArray(topic)) ? topic.map(toTopic) : toTopic(topic);
    });

    toTopic = null;

    if (options.address) {
        options.address = (_.isArray(options.address)) ? options.address.map(function (addr) {
            return inputAddressFormatter(addr);
        }) : inputAddressFormatter(options.address);
    }

    return options;
};

/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
 */
var outputLogFormatter = function (log) {
    // generate a custom log id
    if (typeof log.blockHash === 'string' &&
        typeof log.transactionHash === 'string' &&
        typeof log.logIndex === 'string') {
        var shaId = utils.sha3(log.blockHash.replace('0x', '') + log.transactionHash.replace('0x', '') + log.logIndex.replace('0x', ''));
        log.id = 'log_' + shaId.replace('0x', '').substr(0, 8);
    } else if (!log.id) {
        log.id = null;
    }

    log.blockNumber = outputBigNumberFormatter(log.blockNumber);
    log.transactionIndex = utils.hexToNumber(log.transactionIndex);
    log.logIndex = utils.hexToNumber(log.logIndex);

    if (log.address) {
        log.address = utils.toChecksumAddress(log.address);
    }

    return log;
};

/**
 * Formats the input of a whisper post and converts all values to HEX
 *
 * @method inputPostFormatter
 * @param {Object} transaction object
 * @returns {Object}
 */
var inputPostFormatter = function (post) {

    // post.payload = utils.toHex(post.payload);

    if (post.ttl)
        post.ttl = utils.numberToHex(post.ttl);
    if (post.workToProve)
        post.workToProve = utils.numberToHex(post.workToProve);
    if (post.priority)
        post.priority = utils.numberToHex(post.priority);

    // fallback
    if (!_.isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map(function (topic) {
        // convert only if not hex
        return (topic.indexOf('0x') === 0) ? topic : utils.fromUtf8(topic);
    });

    return post;
};

/**
 * Formats the output of a received post message
 *
 * @method outputPostFormatter
 * @param {Object}
 * @returns {Object}
 */
var outputPostFormatter = function (post) {

    post.expiry = utils.hexToNumber(post.expiry);
    post.sent = utils.hexToNumber(post.sent);
    post.ttl = utils.hexToNumber(post.ttl);
    post.workProved = utils.hexToNumber(post.workProved);
    // post.payloadRaw = post.payload;
    // post.payload = utils.hexToAscii(post.payload);

    // if (utils.isJson(post.payload)) {
    //     post.payload = JSON.parse(post.payload);
    // }

    // format the following options
    if (!post.topics) {
        post.topics = [];
    }
    post.topics = post.topics.map(function (topic) {
        return utils.toUtf8(topic);
    });

    return post;
};

var inputAddressFormatter = function (address) {
    var iban = new Iban(address);
    if (iban.isValid() && iban.isDirect()) {
        return iban.toAddress().toLowerCase();
    } else if (utils.isAddress(address)) {
        return '0x' + address.toLowerCase().replace('0x', '');
    }
    throw new Error('Provided address "' + address + '" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can\'t be converted.');
};


var outputSyncingFormatter = function (result) {

    result.startingBlock = outputBigNumberFormatter(result.startingBlock);
    result.currentBlock = outputBigNumberFormatter(result.currentBlock);
    result.highestBlock = outputBigNumberFormatter(result.highestBlock);
    if (result.knownStates) {
        result.knownStates = outputBigNumberFormatter(result.knownStates);
        result.pulledStates = outputBigNumberFormatter(result.pulledStates);
    }

    return result;
};

module.exports = {
    inputDefaultBlockNumberFormatter: inputDefaultBlockNumberFormatter,
    inputBlockNumberFormatter: inputBlockNumberFormatter,
    inputCallFormatter: inputCallFormatter,
    inputTransactionFormatter: inputTransactionFormatter,
    inputAddressFormatter: inputAddressFormatter,
    inputPostFormatter: inputPostFormatter,
    inputLogFormatter: inputLogFormatter,
    inputSignFormatter: inputSignFormatter,
    inputStorageKeysFormatter: inputStorageKeysFormatter,
    outputProofFormatter: outputProofFormatter,
    outputBigNumberFormatter: outputBigNumberFormatter,
    outputTransactionFormatter: outputTransactionFormatter,
    outputTransactionReceiptFormatter: outputTransactionReceiptFormatter,
    outputBlockFormatter: outputBlockFormatter,
    outputLogFormatter: outputLogFormatter,
    outputPostFormatter: outputPostFormatter,
    outputSyncingFormatter: outputSyncingFormatter
};

