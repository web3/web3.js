/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import * as Utils from 'conflux-web-utils';

/**
 *
 * Should format the output to a object of type BigNumber
 *
 * @method outputBigNumberFormatter
 *
 * @param {String|Number|BigNumber} number
 *
 * @returns {String} number
 */
export const outputBigNumberFormatter = (number) => {
    return Utils.toBN(number).toString(10);
};

/**
 * @method isPredefinedEpochNumber
 *
 * @param {String} epochNumber
 *
 * @returns {Boolean}
 */
export const isPredefinedEpochNumber = (epochNumber) => {
    return epochNumber === 'latest_state' || epochNumber === 'latest_mined' || epochNumber === 'earliest';
};

/**
 * Determines if it should use the default epoch by the given package or not.
 *
 * @param {String|Number} epochNumber
 * @param {AbstractConfluxWebModule} moduleInstance
 *
 * @returns {String}
 */
export const inputDefaultEpochNumberFormatter = (epochNumber, moduleInstance) => {
    if (epochNumber === undefined || epochNumber === null) {
        return moduleInstance.defaultEpoch;
    }

    return inputBlockAddressFormatter(epochNumber);
};

/**
 * @method inputEpochNumberFormatter
 *
 * @param {String|Number} epochNumber
 *
 * @returns {String|Number}
 */
export const inputEpochNumberFormatter = (epochNumber) => {
    if (epochNumber === undefined || epochNumber === null || isPredefinedEpochNumber(epochNumber)) {
        return epochNumber;
    }
    return Utils.numberToHex(epochNumber);
};

/**
 * @method inputBlockAddressFormatter
 *
 * @param {String|Number} blockAddress
 *
 * @returns {String|Number}
 */
export const inputBlockAddressFormatter = (blockAddress) => {
    if (blockAddress === undefined || blockAddress === null || isPredefinedEpochNumber(blockAddress)) {
        return blockAddress;
    }

    if (Utils.isHexStrict(blockAddress)) {
        if (isString(blockAddress)) {
            return blockAddress.toLowerCase();
        }

        return blockAddress;
    }

    return Utils.numberToHex(blockAddress);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method txInputFormatter
 *
 * @param {Object} txObject
 *
 * @returns {Object}
 */
export const txInputFormatter = (txObject) => {
    if (txObject.to) {
        // it might be contract creation
        txObject.to = inputAddressFormatter(txObject.to);
    }

    if (txObject.data && txObject.input) {
        throw new Error(
            'You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.'
        );
    }

    if (!txObject.data && txObject.input) {
        txObject.data = txObject.input;
        delete txObject.input;
    }

    if (txObject.data && !Utils.isHex(txObject.data)) {
        throw new Error('The data field must be HEX encoded data.');
    }

    // allow both
    if (txObject.gas || txObject.gasLimit) {
        txObject.gas = txObject.gas || txObject.gasLimit;
    }

    ['gasPrice', 'gas', 'value', 'nonce']
        .filter((key) => {
            return txObject[key] !== undefined;
        })
        .forEach((key) => {
            txObject[key] = Utils.numberToHex(txObject[key]);
        });

    return txObject;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputCallFormatter
 *
 * @param {Object} txObject
 * @param {AbstractConfluxWebModule} moduleInstance
 *
 * @returns {Object}
 */
export const inputCallFormatter = (txObject, moduleInstance) => {
    txObject = txInputFormatter(txObject);
    let from = moduleInstance.defaultAccount;

    if (txObject.from) {
        from = txObject.from;
    }

    if (from) {
        txObject.from = inputAddressFormatter(from);
    }
    return txObject;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 *
 * @param {Object} txObject
 * @param {AbstractConfluxWebModule} moduleInstance
 *
 * @returns {Object}
 */
export const inputTransactionFormatter = (txObject, moduleInstance) => {
    txObject = txInputFormatter(txObject);

    if (!isNumber(txObject.from) && !isObject(txObject.from)) {
        if (!txObject.from) {
            txObject.from = moduleInstance.defaultAccount;
        }

        if (!txObject.from && !isNumber(txObject.from)) {
            throw new Error('The send transactions "from" field must be defined!');
        }

        txObject.from = inputAddressFormatter(txObject.from);
    }

    return txObject;
};

/**
 * Hex encodes the data passed to cfx_sign
 *
 * @method inputSignFormatter
 *
 * @param {String} data
 *
 * @returns {String}
 */
export const inputSignFormatter = (data) => {
    return Utils.isHexStrict(data) ? data : Utils.utf8ToHex(data);
};

/**
 * TODO: Check where this is used and why the method below (outputTransactionReceiptFormatter) also exists.
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 *
 * @param {Object} receipt
 *
 * @returns {Object}
 */
export const outputTransactionFormatter = (receipt) => {
    if (receipt.transactionIndex !== null) {
        receipt.transactionIndex = Utils.hexToNumber(receipt.transactionIndex);
    }

    if (receipt.gasPrice) {
        receipt.gasPrice = outputBigNumberFormatter(receipt.gasPrice);
    }

    if (receipt.value) {
        receipt.value = outputBigNumberFormatter(receipt.value);
    }

    receipt.nonce = Utils.hexToNumber(receipt.nonce);
    receipt.gas = Utils.hexToNumber(receipt.gas);

    if (receipt.to && Utils.isAddress(receipt.to)) {
        // tx.to could be `0x0` or `null` while contract creation
        receipt.to = Utils.toChecksumAddress(receipt.to);
    } else {
        receipt.to = null; // set to `null` if invalid address
    }

    if (receipt.from) {
        receipt.from = Utils.toChecksumAddress(receipt.from);
    }

    receipt.v = Utils.hexToNumber(receipt.v);

    return receipt;
};

// TODO: port to Conflux Receipt
/**
 * Formats the output of a transaction receipt to its proper values
 *
 * @method outputTransactionReceiptFormatter
 *
 * @param {Object} receipt
 *
 * @returns {Object}
 */
export const outputTransactionReceiptFormatter = (receipt) => {
    if (receipt.epochNumber !== null) {
        receipt.epochNumber = Utils.hexToNumber(receipt.epochNumber);
    }

    if (receipt.transactionIndex !== null) {
        receipt.transactionIndex = Utils.hexToNumber(receipt.transactionIndex);
    }

    receipt.cumulativeGasUsed = Utils.hexToNumber(receipt.cumulativeGasUsed);
    receipt.gasUsed = Utils.hexToNumber(receipt.gasUsed);

    if (isArray(receipt.logs)) {
        receipt.logs = receipt.logs.map(outputLogFormatter);
    }

    if (receipt.contractAddress) {
        receipt.contractAddress = Utils.toChecksumAddress(receipt.contractAddress);
    }

    if (typeof receipt.status !== 'undefined' && receipt.status !== null) {
        receipt.status = Boolean(parseInt(receipt.status));
    } else {
        receipt.status = true;
    }

    return receipt;
};

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 *
 * @param {Object} block
 *
 * @returns {Object}
 */
export const outputBlockFormatter = (block) => {
    block.gasLimit = Utils.hexToNumber(block.gasLimit);
    block.size = Utils.hexToNumber(block.size);
    block.timestamp = Utils.hexToNumber(block.timestamp);

    if (block.height !== null) {
        block.height = Utils.hexToNumber(block.height);
    }
    if (block.epochNumber !== null) block.epochNumber = Utils.hexToNumber(block.epochNumber);

    if (block.difficulty) {
        block.difficulty = outputBigNumberFormatter(block.difficulty);
    }

    if (isArray(block.transactions)) {
        block.transactions.forEach((item) => {
            if (!isString(item)) return outputTransactionFormatter(item);
        });
    }

    if (block.miner) {
        block.miner = Utils.toChecksumAddress(block.miner);
    }

    return block;
};

/**
 * Formats the input of a log
 *
 * @method inputLogFormatter
 *
 * @param {Object} options
 *
 * @returns {Object} log
 */
export const inputLogFormatter = (options) => {
    let toTopic = (value) => {
        if (value === null || typeof value === 'undefined') {
            return null;
        }

        value = String(value);

        if (value.indexOf('0x') === 0) {
            return value;
        }

        return Utils.fromUtf8(value);
    };

    if (options.fromEpoch) {
        options.fromEpoch = inputEpochNumberFormatter(options.fromEpoch);
    }

    if (options.toEpoch) {
        options.toEpoch = inputEpochNumberFormatter(options.toEpoch);
    }

    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map((topic) => {
        return isArray(topic) ? topic.map(toTopic) : toTopic(topic);
    });

    toTopic = null;

    if (options.address) {
        if (isArray(options.address)) {
            options.address = options.address.map((addr) => {
                return inputAddressFormatter(addr);
            });
        } else {
            options.address = inputAddressFormatter(options.address);
        }
    }

    return options;
};

/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 *
 * @param {Object} log object
 *
 * @returns {Object} log
 */
export const outputLogFormatter = (log) => {
    // generate a custom log id
    if (
        typeof log.blockHash === 'string' &&
        typeof log.transactionHash === 'string' &&
        typeof log.logIndex === 'string'
    ) {
        const shaId = Utils.sha3(
            log.blockHash.replace('0x', '') + log.transactionHash.replace('0x', '') + log.logIndex.replace('0x', '')
        );

        shaId.replace('0x', '').substr(0, 8);

        log.id = `log_${shaId}`;
    } else if (!log.id) {
        log.id = null;
    }

    if (log.epochNumber !== null) {
        log.epochNumber = Utils.hexToNumber(log.epochNumber);
    }

    if (log.transactionIndex !== null) {
        log.transactionIndex = Utils.hexToNumber(log.transactionIndex);
    }

    if (log.logIndex !== null) {
        log.logIndex = Utils.hexToNumber(log.logIndex);
    }

    if (log.address) {
        log.address = Utils.toChecksumAddress(log.address);
    }

    return log;
};

/**
 * Formats the input of a whisper post and converts all values to HEX
 *
 * @method inputPostFormatter
 *
 * @param {Object} post
 *
 * @returns {Object}
 */
export const inputPostFormatter = (post) => {
    if (post.ttl) {
        post.ttl = Utils.numberToHex(post.ttl);
    }

    if (post.workToProve) {
        post.workToProve = Utils.numberToHex(post.workToProve);
    }

    if (post.priority) {
        post.priority = Utils.numberToHex(post.priority);
    }

    // fallback
    if (!isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map((topic) => {
        // convert only if not hex
        return topic.indexOf('0x') === 0 ? topic : Utils.fromUtf8(topic);
    });

    return post;
};

/**
 * Formats the output of a received post message
 *
 * @method outputPostFormatter
 *
 * @param {Object} post
 *
 * @returns {Object}
 */
export const outputPostFormatter = (post) => {
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

    post.topics = post.topics.map((topic) => {
        return Utils.toUtf8(topic);
    });

    return post;
};

/**
 * @method inputAddressFormatter
 *
 * @param address
 *
 * @returns {String}
 * @throws {Error}
 */
export const inputAddressFormatter = (address) => {
    if (Utils.isAddress(address)) {
        return `0x${address.toLowerCase().replace('0x', '')}`;
    }

    throw new Error(`Provided address "${address}" is invalid, the capitalization checksum test failed.`);
};

/**
 * @method outputSyncingFormatter
 *
 * @param {Object} result
 *
 * @returns {Object}
 */
export const outputSyncingFormatter = (result) => {
    result.startingBlock = Utils.hexToNumber(result.startingBlock);
    result.currentBlock = Utils.hexToNumber(result.currentBlock);
    result.highestBlock = Utils.hexToNumber(result.highestBlock);
    if (result.knownStates) {
        result.knownStates = Utils.hexToNumber(result.knownStates);
        result.pulledStates = Utils.hexToNumber(result.pulledStates);
    }

    return result;
};
