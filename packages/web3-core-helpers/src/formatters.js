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


import _ from 'lodash';
import {
    toBN,
    isHex,
    numberToHex,
    utf8ToHex,
    hexToNumber,
    isAddress,
    toChecksumAddress,
    fromUtf8,
    sha3,
    toUtf8,
} from 'web3-utils/lib/utils';
import Iban from 'web3-eth-iban';

/**
 * Check if block is predefined
 */
function isPredefinedBlockNumber (blockNumber) {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
}

/**
 * Should the format output to a big number
 *
 * @method outputBigNumberFormatter
 * @param {String|Number|BigNumber} number
 * @returns {BigNumber} object
 */
export function outputBigNumberFormatter (number) {
    return toBN(number).toString(10);
}

export function inputAddressFormatter (address) {
    const iban = new Iban(address);
    if (iban.isValid() && iban.isDirect()) {
        return iban.toAddress().toLowerCase();
    } else if (isAddress(address)) {
        return `0x${address.toLowerCase().replace('0x', '')}`;
    }
    throw new Error(`Provided address "${address}" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted.`);
}

export function inputBlockNumberFormatter (blockNumber) {
    if (blockNumber === undefined) {
        return undefined;
    } else if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }

    if (isHex(blockNumber)) {
        return _.isString(blockNumber) ? blockNumber.toLowerCase() : blockNumber;
    }

    return numberToHex(blockNumber);
}

export function inputDefaultBlockNumberFormatter (blockNumber) {
    if (this && (blockNumber === undefined || blockNumber === null)) {
        return this.defaultBlock;
    }
    if (blockNumber === 'genesis' || blockNumber === 'earliest') {
        return '0x0';
    }
    return inputBlockNumberFormatter(blockNumber);
}

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputCallFormatter
 * @param {Object} transaction options
 * @returns object
*/
export function inputCallFormatter (options) {
    /* eslint-disable no-param-reassign */
    const from = options.from || (this ? this.defaultAccount : null);

    if (from) {
        options.from = inputAddressFormatter(from);
    }

    if (options.to) { // it might be contract creation
        options.to = inputAddressFormatter(options.to);
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gas = options.gas || options.gasLimit;
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(key => options[key] !== undefined).forEach((key) => {
        options[key] = numberToHex(options[key]);
    });

    return options;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 * @param {Object} options
 * @returns object
*/
export function inputTransactionFormatter (options) {
    /* eslint-disable no-param-reassign */

    // check from, only if not number, or object
    if (!_.isNumber(options.from) && !_.isObject(options.from)) {
        options.from = options.from || (this ? this.defaultAccount : null);

        if (!options.from && !_.isNumber(options.from)) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        options.from = inputAddressFormatter(options.from);
    }

    if (options.to) { // it might be contract creation
        options.to = inputAddressFormatter(options.to);
    }

    // allow both
    if (options.gas || options.gasLimit) {
        options.gas = options.gas || options.gasLimit;
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(key => options[key] !== undefined).forEach((key) => {
        options[key] = numberToHex(options[key]);
    });

    return options;
    /* eslint-enable no-param-reassign */
}

/**
 * Hex encodes the data passed to eth_sign and personal_sign
 *
 * @method inputSignFormatter
 * @param {String} data
 * @returns {String}
 */
export function inputSignFormatter (data) {
    return (isHex(data)) ? data : utf8ToHex(data);
}

/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
*/
export function outputTransactionFormatter (tx) {
    /* eslint-disable no-param-reassign */
    if (tx.blockNumber !== null) { tx.blockNumber = hexToNumber(tx.blockNumber); }
    if (tx.transactionIndex !== null) { tx.transactionIndex = hexToNumber(tx.transactionIndex); }
    tx.nonce = hexToNumber(tx.nonce);
    tx.gas = hexToNumber(tx.gas);
    tx.gasPrice = outputBigNumberFormatter(tx.gasPrice);
    tx.value = outputBigNumberFormatter(tx.value);

    if (tx.to && isAddress(tx.to)) { // tx.to could be `0x0` or `null` while contract creation
        tx.to = toChecksumAddress(tx.to);
    } else {
        tx.to = null; // set to `null` if invalid address
    }

    if (tx.from) {
        tx.from = toChecksumAddress(tx.from);
    }

    return tx;
    /* eslint-enable no-param-reassign */
}


/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
*/
export function outputLogFormatter (log) {
    /* eslint-disable no-param-reassign */
    // generate a custom log id
    if (typeof log.blockHash === 'string' &&
       typeof log.transactionHash === 'string' &&
       typeof log.logIndex === 'string') {
        const shaId = sha3(log.blockHash.replace('0x', '') + log.transactionHash.replace('0x', '') + log.logIndex.replace('0x', ''));
        log.id = `log_${shaId.replace('0x', '').substr(0, 8)}`;
    } else if (!log.id) {
        log.id = null;
    }

    if (log.blockNumber !== null) { log.blockNumber = hexToNumber(log.blockNumber); }
    if (log.transactionIndex !== null) { log.transactionIndex = hexToNumber(log.transactionIndex); }
    if (log.logIndex !== null) { log.logIndex = hexToNumber(log.logIndex); }

    if (log.address) { log.address = toChecksumAddress(log.address); }

    return log;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the output of a transaction receipt to its proper values
 *
 * @method outputTransactionReceiptFormatter
 * @param {Object} receipt
 * @returns {Object}
*/
export function outputTransactionReceiptFormatter (receipt) {
    /* eslint-disable no-param-reassign */
    if (typeof receipt !== 'object') {
        throw new Error(`Received receipt is invalid: ${receipt}`);
    }

    if (receipt.blockNumber !== null) {
        receipt.blockNumber = hexToNumber(receipt.blockNumber);
    }

    if (receipt.transactionIndex !== null) {
        receipt.transactionIndex = hexToNumber(receipt.transactionIndex);
    }

    receipt.cumulativeGasUsed = hexToNumber(receipt.cumulativeGasUsed);
    receipt.gasUsed = hexToNumber(receipt.gasUsed);

    if (_.isArray(receipt.logs)) {
        receipt.logs = receipt.logs.map(outputLogFormatter);
    }

    if (receipt.contractAddress) {
        receipt.contractAddress = toChecksumAddress(receipt.contractAddress);
    }

    return receipt;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 * @param {Object} block
 * @returns {Object}
*/
export function outputBlockFormatter (block) {
    /* eslint-disable no-param-reassign */

    // transform to number
    block.gasLimit = hexToNumber(block.gasLimit);
    block.gasUsed = hexToNumber(block.gasUsed);
    block.size = hexToNumber(block.size);
    block.timestamp = hexToNumber(block.timestamp);
    if (block.number !== null) { block.number = hexToNumber(block.number); }

    if (block.difficulty) {
        block.difficulty = outputBigNumberFormatter(block.difficulty);
    }

    if (block.totalDifficulty) {
        block.totalDifficulty = outputBigNumberFormatter(block.totalDifficulty);
    }

    if (_.isArray(block.transactions)) {
        block.transactions.forEach((item) => {
            if (!_.isString(item)) {
                return outputTransactionFormatter(item);
            }

            return null;
        });
    }

    if (block.miner) {
        block.miner = toChecksumAddress(block.miner);
    }

    return block;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the input of a log
 *
 * @method inputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
*/
export function inputLogFormatter (options) {
    /* eslint-disable no-param-reassign */
    let toTopic = (v) => {
        let value = v;
        if (value === null || typeof value === 'undefined') {
            return null;
        }

        value = String(value);
        if (value.indexOf('0x') === 0) {
            return value;
        }
        return fromUtf8(value);
    };

    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map((topic) => {
        if (_.isArray(topic)) {
            return topic.map(toTopic);
        }
        return toTopic(topic);
    });

    toTopic = null;
    if (options.address) {
        options.address = inputAddressFormatter(options.address);
    }

    return options;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the input of a whisper post and converts all values to HEX
 *
 * @method inputPostFormatter
 * @param {Object} transaction object
 * @returns {Object}
*/
export function inputPostFormatter (post) {
    /* eslint-disable no-param-reassign */
    // post.payload = toHex(post.payload);

    if (post.ttl) { post.ttl = numberToHex(post.ttl); }
    if (post.workToProve) { post.workToProve = numberToHex(post.workToProve); }
    if (post.priority) { post.priority = numberToHex(post.priority); }

    // fallback
    if (!_.isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map(topic =>
    // convert only if not hex
        ((topic.indexOf('0x') === 0) ? topic : fromUtf8(topic)));

    return post;
    /* eslint-enable no-param-reassign */
}

/**
 * Formats the output of a received post message
 *
 * @method outputPostFormatter
 * @param {Object}
 * @returns {Object}
 */
export function outputPostFormatter (post) {
    /* eslint-disable no-param-reassign */

    post.expiry = hexToNumber(post.expiry);
    post.sent = hexToNumber(post.sent);
    post.ttl = hexToNumber(post.ttl);
    post.workProved = hexToNumber(post.workProved);
    // post.payloadRaw = post.payload;
    // post.payload = hexToAscii(post.payload);

    // if (isJson(post.payload)) {
    //     post.payload = JSON.parse(post.payload);
    // }

    // format the following options
    if (!post.topics) {
        post.topics = [];
    }
    post.topics = post.topics.map(topic => toUtf8(topic));

    return post;
    /* eslint-enable no-param-reassign */
}

export function outputSyncingFormatter (result) {
    /* eslint-disable no-param-reassign */
    result.startingBlock = hexToNumber(result.startingBlock);
    result.currentBlock = hexToNumber(result.currentBlock);
    result.highestBlock = hexToNumber(result.highestBlock);
    if (result.knownStates) {
        result.knownStates = hexToNumber(result.knownStates);
        result.pulledStates = hexToNumber(result.pulledStates);
    }

    return result;
    /* eslint-enable no-param-reassign */
}
