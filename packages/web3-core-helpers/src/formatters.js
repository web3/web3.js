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

import {isString, isObject, isNumber, isArray} from 'underscore';
import Utils from 'web3-utils';
import {Iban} from 'web3-eth-iban';

/**
 * Should the format output to a big number
 *
 * @method outputBigNumberFormatter
 * @param {String|Number|BigNumber} number
 * @returns {BigNumber} object
 */
const outputBigNumberFormatter = number => {
    return Utils.toBN(number).toString(10);
};

const isPredefinedBlockNumber = blockNumber => {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
};

/**
 * Determines if it should use the default block by the given package or not,
 * will map 'genesis' and 'earlist' to '0x0' and runs the inputBlockNumberFormatter.
 *
 * @param {String|Number} blockNumber
 * @param {AbstractWeb3Module} moduleInstance
 *
 * @returns {String}
 */
const inputDefaultBlockNumberFormatter = (blockNumber, moduleInstance) => {
    if (blockNumber === undefined || blockNumber === null) {
        return moduleInstance.defaultBlock;
    }

    if (blockNumber === 'genesis' || blockNumber === 'earliest') {
        return '0x0';
    }

    return inputBlockNumberFormatter(blockNumber);
};

const inputBlockNumberFormatter = blockNumber => {
    if (blockNumber === undefined) {
        return undefined;
    }

    if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }

    return (Utils.isHexStrict(blockNumber)) ? ((isString(blockNumber)) ? blockNumber.toLowerCase() : blockNumber) : Utils.numberToHex(blockNumber);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method _txInputFormatter
 * @param {Object} transaction options
 * @returns object
 */
const _txInputFormatter = options => {

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

    if(options.data && !Utils.isHex(options.data)) {
        throw new Error('The data field must be HEX encoded data.');
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gas = options.gas || options.gasLimit;
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(key => {
        return options[key] !== undefined;
    }).forEach(key => {
        options[key] = Utils.numberToHex(options[key]);
    });

    return options;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputCallFormatter
 *
 * @param {Object} options
 * @param {AbstractWeb3Module} moduleInstance
 *
 * @returns object
*/
const inputCallFormatter = (options, moduleInstance) => {
    options = _txInputFormatter(options);
    let from = moduleInstance.defaultAccount;

    if (options.from) {
        from = options.from
    }

    if (from) {
        options.from = inputAddressFormatter(from);
    }

    return options;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 *
 * @param {Object} options
 * @param {AbstractWeb3Module} moduleInstance
 *
 * @returns object
*/
const inputTransactionFormatter = (options, moduleInstance) => {
    options = _txInputFormatter(options);

    if (!isNumber(options.from) && !isObject(options.from)) {
        if (!options.from) {
            options.from = moduleInstance.defaultAccount;
        }

        if (!options.from && !isNumber(options.from)) {
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
const inputSignFormatter = data => {
    return (Utils.isHexStrict(data)) ? data : Utils.utf8ToHex(data);
};

/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
*/
const outputTransactionFormatter = tx => {
    if(tx.blockNumber !== null)
        tx.blockNumber = Utils.hexToNumber(tx.blockNumber);
    if(tx.transactionIndex !== null)
        tx.transactionIndex = Utils.hexToNumber(tx.transactionIndex);
    tx.nonce = Utils.hexToNumber(tx.nonce);
    tx.gas = Utils.hexToNumber(tx.gas);
    tx.gasPrice = outputBigNumberFormatter(tx.gasPrice);
    tx.value = outputBigNumberFormatter(tx.value);

    if(tx.to && Utils.isAddress(tx.to)) { // tx.to could be `0x0` or `null` while contract creation
        tx.to = Utils.toChecksumAddress(tx.to);
    } else {
        tx.to = null; // set to `null` if invalid address
    }

    if(tx.from) {
        tx.from = Utils.toChecksumAddress(tx.from);
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
const outputTransactionReceiptFormatter = receipt => {
    if(typeof receipt !== 'object') {
        throw new Error(`Received receipt is invalid: ${receipt}`);
    }

    if(receipt.blockNumber !== null)
        receipt.blockNumber = Utils.hexToNumber(receipt.blockNumber);
    if(receipt.transactionIndex !== null)
        receipt.transactionIndex = Utils.hexToNumber(receipt.transactionIndex);
    receipt.cumulativeGasUsed = Utils.hexToNumber(receipt.cumulativeGasUsed);
    receipt.gasUsed = Utils.hexToNumber(receipt.gasUsed);

    if(isArray(receipt.logs)) {
        receipt.logs = receipt.logs.map(outputLogFormatter);
    }

    if(receipt.contractAddress) {
        receipt.contractAddress = Utils.toChecksumAddress(receipt.contractAddress);
    }

    if(typeof receipt.status !== 'undefined') {
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
const outputBlockFormatter = block => {

    // transform to number
    block.gasLimit = Utils.hexToNumber(block.gasLimit);
    block.gasUsed = Utils.hexToNumber(block.gasUsed);
    block.size = Utils.hexToNumber(block.size);
    block.timestamp = Utils.hexToNumber(block.timestamp);
    if (block.number !== null)
        block.number = Utils.hexToNumber(block.number);

    if(block.difficulty)
        block.difficulty = outputBigNumberFormatter(block.difficulty);
    if(block.totalDifficulty)
        block.totalDifficulty = outputBigNumberFormatter(block.totalDifficulty);

    if (isArray(block.transactions)) {
        block.transactions.forEach(item => {
            if(!isString(item))
                return outputTransactionFormatter(item);
        });
    }

    if (block.miner)
        block.miner = Utils.toChecksumAddress(block.miner);

    return block;
};

/**
 * Formats the input of a log
 *
 * @method inputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
*/
const inputLogFormatter = options => {
    let toTopic = value => {

        if(value === null || typeof value === 'undefined')
            return null;

        value = String(value);

        if(value.indexOf('0x') === 0)
            return value;
        else
            return Utils.fromUtf8(value);
    };

    if (options.fromBlock)
        options.fromBlock = inputBlockNumberFormatter(options.fromBlock);

    if (options.toBlock)
        options.toBlock = inputBlockNumberFormatter(options.toBlock);


    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map(topic => {
        return (isArray(topic)) ? topic.map(toTopic) : toTopic(topic);
    });

    toTopic = null;

    if (options.address) {
        options.address = (isArray(options.address)) ? options.address.map(addr => {
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
const outputLogFormatter = log => {

    // generate a custom log id
    if(typeof log.blockHash === 'string' &&
       typeof log.transactionHash === 'string' &&
       typeof log.logIndex === 'string') {
        const shaId = Utils.sha3(log.blockHash.replace('0x','') + log.transactionHash.replace('0x','') + log.logIndex.replace('0x',''));
        log.id = `log_${shaId.replace('0x','').substr(0,8)}`;
    } else if(!log.id) {
        log.id = null;
    }

    if (log.blockNumber !== null)
        log.blockNumber = Utils.hexToNumber(log.blockNumber);
    if (log.transactionIndex !== null)
        log.transactionIndex = Utils.hexToNumber(log.transactionIndex);
    if (log.logIndex !== null)
        log.logIndex = Utils.hexToNumber(log.logIndex);

    if (log.address) {
        log.address = Utils.toChecksumAddress(log.address);
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
const inputPostFormatter = post => {

    // post.payload = Utils.toHex(post.payload);

    if (post.ttl)
        post.ttl = Utils.numberToHex(post.ttl);
    if (post.workToProve)
        post.workToProve = Utils.numberToHex(post.workToProve);
    if (post.priority)
        post.priority = Utils.numberToHex(post.priority);

    // fallback
    if (!isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map(topic => {
        // convert only if not hex
        return (topic.indexOf('0x') === 0) ? topic : Utils.fromUtf8(topic);
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
const outputPostFormatter = post => {
    post.expiry = Utils.hexToNumber(post.expiry);
    post.sent = Utils.hexToNumber(post.sent);
    post.ttl = Utils.hexToNumber(post.ttl);
    post.workProved = Utils.hexToNumber(post.workProved);
    // post.payloadRaw = post.payload;
    // post.payload = Utils.hexToAscii(post.payload);

    // if (Utils.isJson(post.payload)) {
    //     post.payload = JSON.parse(post.payload);
    // }

    // format the following options
    if (!post.topics) {
        post.topics = [];
    }
    post.topics = post.topics.map(topic => {
        return Utils.toUtf8(topic);
    });

    return post;
};

var inputAddressFormatter = address => {
    const iban = new Iban(address);

    if (iban.isValid() && iban.isDirect()) {
        return iban.toAddress().toLowerCase();
    } else if (Utils.isAddress(address)) {
        return `0x${address.toLowerCase().replace('0x','')}`;
    }

    throw new Error(`Provided address "${address}" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted.`);
};


const outputSyncingFormatter = result => {

    result.startingBlock = Utils.hexToNumber(result.startingBlock);
    result.currentBlock = Utils.hexToNumber(result.currentBlock);
    result.highestBlock = Utils.hexToNumber(result.highestBlock);
    if (result.knownStates) {
        result.knownStates = Utils.hexToNumber(result.knownStates);
        result.pulledStates = Utils.hexToNumber(result.pulledStates);
    }

    return result;
};

export default {
    inputDefaultBlockNumberFormatter,
    inputBlockNumberFormatter,
    inputCallFormatter,
    inputTransactionFormatter,
    inputAddressFormatter,
    inputPostFormatter,
    inputLogFormatter,
    inputSignFormatter,
    outputBigNumberFormatter,
    outputTransactionFormatter,
    outputTransactionReceiptFormatter,
    outputBlockFormatter,
    outputLogFormatter,
    outputPostFormatter,
    outputSyncingFormatter
};

