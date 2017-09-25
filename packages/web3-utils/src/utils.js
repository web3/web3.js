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
 * @file utils.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import _ from 'lodash';

import BN from 'bn.js';
import ethjsUnit from 'ethjs-unit';
import numberToBN from 'number-to-bn';
import utf8 from 'utf8';
import Hash from 'eth-lib/lib/hash';
import randomHex from 'randomhex';

// Get unit map
const { unitMap } = ethjsUnit;
const { keccak256 } = Hash;

/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param {Object} object
 * @return {Boolean}
 */
export function isBN (object) {
    return object instanceof BN ||
    (object && object.constructor && object.constructor.name === 'BN');
}

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object} object
 * @return {Boolean}
 */
export function isBigNumber (object) {
    return object && object.constructor && object.constructor.name === 'BigNumber';
}

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} number, string, HEX string or BN
 * @return {BN} BN
 */
export function toBN (...args) {
    try {
        return numberToBN(...args);
    } catch (e) {
        throw new Error(`${e} Given value: ${args[0]}`);
    }
}


/**
 * Check if string is HEX
 *
 * @method isHex
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
export function isHex (hex) {
    return ((_.isString(hex) || _.isNumber(hex)) && /^(-)?0x[0-9a-f]+$/i.test(hex));
}

/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 * @param {string} hex
 * @return {Array} the byte array
 */
export function hexToBytes (value) {
    let hex = value.toString(16);
    if (!isHex(hex)) {
        throw new Error(`Given value "${hex}" is not a valid hex string.`);
    }

    hex = hex.replace(/^0x/i, '');
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

/**
 * Hashes values to a sha3 hash using keccak 256
 *
 * To hash a HEX string the hex must have 0x in front.
 *
 * @method sha3
 * @return {String} the sha3 string
 */
const SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
export function sha3 (input) {
    let value = input;

    if (isHex(value) && /^0x/i.test((value).toString())) {
        value = hexToBytes(value);
    }

    const returnValue = keccak256(value);
    if (returnValue === SHA3_NULL_S) {
        return null;
    }

    return returnValue;
}


/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
export function checkAddressChecksum (value) {
    // Check each case
    const address = value.replace(/^0x/i, '');
    const addressHash = sha3(address.toLowerCase()).replace(/^0x/i, '');

    for (let i = 0; i < 40; i += 1) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
      || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}


/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
export function isAddress (address) {
    // check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
    } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
    // If it's all lowercase or all upppercase
        return true;
    }

    // Otherwise check each case
    return checkAddressChecksum(address);
}


/**
 * Should be called to pad string to expected length
 *
 * @method leftPad
 * @param {String} string to be padded
 * @param {Number} chars that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
export function leftPad (value, chars, sign) {
    const hasPrefix = /^0x/i.test(value) || typeof value === 'number';
    const str = value.toString(16).replace(/^0x/i, '');
    const padding = ((chars - str.length) + 1 >= 0) ? (chars - str.length) + 1 : 0;
    return (hasPrefix ? '0x' : '') + new Array(padding).join(sign || '0') + str;
}
export const padLeft = leftPad; // alias

/**
 * Should be called to pad string to expected length
 *
 * @method rightPad
 * @param {String} string to be padded
 * @param {Number} chars that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
export function rightPad (value, chars, sign) {
    const hasPrefix = /^0x/i.test(value) || typeof value === 'number';
    const str = value.toString(16).replace(/^0x/i, '');
    const padding = ((chars - str.length) + 1 >= 0) ? (chars - str.length) + 1 : 0;
    return (hasPrefix ? '0x' : '') + str + (new Array(padding).join(sign || '0'));
}
export const padRight = rightPad; // alias

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
export function utf8ToHex (value) {
    let str = utf8.encode(value);
    // remove \u0000 padding from either side
    str = str.replace(/^(?:\u0000)*/, '');
    str = str.split('').reverse().join('');
    str = str.replace(/^(?:\u0000)*/, '');
    str = str.split('').reverse().join('');

    let hex = '';
    for (let i = 0; i < str.length; i += 1) {
        const code = str.charCodeAt(i);
        // if (code !== 0) {
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    // }
    }

    return `0x${hex}`;
}
// Aliases
export const stringToHex = utf8ToHex;
export const fromUtf8 = utf8ToHex;

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method hexToUtf8
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
export function hexToUtf8 (value) {
    if (!isHex(value)) { throw new Error(`The parameter "${value}" must be a valid HEX string.`); }

    let str = '';
    let code = 0;
    let hex = value.replace(/^0x/i, '');

    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex.split('').reverse().join('');
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex.split('').reverse().join('');

    const l = hex.length;

    for (let i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        // if (code !== 0) {
        str += String.fromCharCode(code);
    // }
    }

    return utf8.decode(str);
}
// Aliases
export const hexToString = hexToUtf8;
export const toUtf8 = hexToUtf8;

/**
 * Converts value to it's number representation
 *
 * @method hexToNumber
 * @param {String|Number|BN} value
 * @return {String}
 */
export function hexToNumber (value) {
    if (!value) {
        return value;
    }

    return toBN(value).toNumber();
}
export const toDecimal = hexToNumber; // Alias

/**
 * Converts value to it's decimal representation in string
 *
 * @method hexToNumberString
 * @param {String|Number|BN} value
 * @return {String}
 */
export function hexToNumberString (value) {
    if (!value) return value;

    return toBN(value).toString(10);
}


/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */
export function numberToHex (value) {
    if (!isFinite(value) && !_.isString(value)) {
        return value;
    }

    const number = toBN(value);
    const result = number.toString(16);

    return number.lt(new BN(0)) ? `-0x${result.substr(1)}` : `0x${result}`;
}
export const fromDecimal = numberToHex; // alias

/**
 * Convert a byte array to a hex string
 *
 * Note: Implementation from crypto-js
 *
 * @method bytesToHex
 * @param {Array} bytes
 * @return {String} the hex string
 */
export function bytesToHex (bytes) {
    const hex = [];
    for (let i = 0; i < bytes.length; i += 1) {
    /* eslint-disable no-bitwise */
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    /* eslint-enable no-bitwise */
    }
    return `0x${hex.join('')}`;
}

/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param {String|Number|BN|Object} value
 * @param {Boolean} returnType
 * @return {String}
 */
export function toHex (value, returnType) {
    if (isAddress(value)) {
        return returnType ? 'address' : `0x${value.toLowerCase().replace(/^0x/i, '')}`;
    }

    if (_.isBoolean(value)) {
        if (returnType) return 'bool';
        return value ? '0x01' : '0x00';
    }

    if (_.isObject(value) && !isBigNumber(value) && !isBN(value)) {
        if (returnType) return 'string';
        return utf8ToHex(JSON.stringify(value));
    }

    // if its a negative number, pass it through numberToHex
    if (_.isString(value)) {
        if (value.indexOf('-0x') === 0 || value.indexOf('-0X') === 0) {
            return returnType ? 'int256' : numberToHex(value);
        } else if (value.indexOf('0x') === 0 || value.indexOf('0X') === 0) {
            return returnType ? 'bytes' : value;
        } else if (!isFinite(value)) {
            return returnType ? 'string' : utf8ToHex(value);
        }
    }

    if (returnType) {
        return value < 0 ? 'int256' : 'uint256';
    }
    return numberToHex(value);
}


/**
 * Returns true if given string is a valid Ethereum block header bloom.
 *
 * TODO UNDOCUMENTED
 *
 * @method isBloom
 * @param {String} hex encoded bloom filter
 * @return {Boolean}
 */
export function isBloom (bloom) {
    if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
        return false;
    } else if (/^(0x)?[0-9a-f]{512}$/.test(bloom) || /^(0x)?[0-9A-F]{512}$/.test(bloom)) {
        return true;
    }
    return false;
}

/**
 * Returns true if given string is a valid log topic.
 *
 * TODO UNDOCUMENTED
 *
 * @method isTopic
 * @param {String} hex encoded topic
 * @return {Boolean}
 */
export function isTopic (topic) {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
        return false;
    } else if (/^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic)) {
        return true;
    }
    return false;
}


/**
 * Fires an error in an event emitter and callback and returns the eventemitter
 *
 * @method fireError
 * @param {Object} error a string, a error, or an object with {message, data}
 * @param {Object} emitter
 * @param {Function} reject
 * @param {Function} callback
 * @return {Object} the emitter
 */
export function fireError (err, emitter, reject, callback) {
    let error = err;

    // add data if given
    if (_.isObject(error) && !(error instanceof Error) && error.data) {
        if (_.isObject(error.data) || _.isArray(error.data)) {
            error.data = JSON.stringify(error.data, null, 2);
        }

        error = `${error.message}\n${error.data}`;
    }

    if (_.isString(error)) {
        error = new Error(error);
    }

    if (_.isFunction(callback)) {
        callback(error);
    }

    if (_.isFunction(reject)) {
    // suppress uncatched error if an error listener is present
        if (emitter &&
      _.isFunction(emitter.listeners) &&
      emitter.listeners('error').length &&
      _.isFunction(emitter.suppressUnhandledRejections)) {
            emitter.suppressUnhandledRejections();
        }
        // reject later, to be able to return emitter
        setTimeout(() => {
            reject(error);
        }, 1);
    }

    if (emitter && _.isFunction(emitter.emit)) {
    // emit later, to be able to return emitter
        setTimeout(() => {
            emitter.emit('error', error);
            emitter.removeAllListeners();
        }, 1);
    }

    return emitter;
}

/**
 * Should be used to create full function/event name from json abi
 *
 * @method jsonInterfaceMethodToString
 * @param {Object} json
 * @return {String} full function/event name
 */
export function jsonInterfaceMethodToString (json) {
    if (_.isObject(json) && json.name && json.name.indexOf('(') !== -1) {
        return json.name;
    }

    const typeName = json.inputs.map(i => i.type).join(',');
    return `${json.name}(${typeName})`;
}

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
export function hexToAscii (hex) {
    if (!isHex(hex)) {
        throw new Error('The parameter must be a valid HEX string.');
    }

    let str = '';
    let i = 0;
    const l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }

    for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
}
export const toAscii = hexToAscii; // alias

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
export function asciiToHex (str) {
    let hex = '';
    for (let i = 0; i < str.length; i += 1) {
        const code = str.charCodeAt(i);
        const n = code.toString(16);
        hex += n.length < 2 ? `0${n}` : n;
    }

    return `0x${hex}`;
}
export const fromAscii = asciiToHex; // alias

/**
 * Returns value of unit in Wei
 *
 * @method unitValue
 * @param {String} unit the unit to convert to, default ether
 * @returns {BN} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
export function unitValue (value) {
    const unit = value ? value.toLowerCase() : 'ether';
    if (!unitMap[unit]) {
        const v = JSON.stringify(unitMap, null, 2);
        throw new Error(`This unit ${unit} doesn't exist, please use the one of the following units ${v}`);
    }
    return unit;
}

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 * @return {String|Object} When given a BN object it returns one as well, otherwise a number
 */
export function fromWei (number, value) {
    const unit = unitValue(value);
    if (isBN(number)) {
        return ethjsUnit.fromWei(number, unit);
    }
    return ethjsUnit.fromWei(number, unit).toString(10);
}

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 * @param {Number|String|BN} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 * @return {String|Object} When given a BN object it returns one as well, otherwise a number
 */
export function toWei (number, value) {
    const unit = unitValue(value);
    if (isBN(number)) {
        return ethjsUnit.toWei(number, unit);
    }
    return ethjsUnit.toWei(number, unit).toString(10);
}


/**
 * Converts to a checksum address
 *
 * @method toChecksumAddress
 * @param {String} address the given HEX address
 * @return {String}
 */
export function toChecksumAddress (value) {
    if (!value) return '';

    if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
        throw new Error(`Given address "${value}" is not a valid Ethereum address.`);
    }

    const address = value.toLowerCase().replace(/^0x/i, '');
    const addressHash = sha3(address).replace(/^0x/i, '');
    let checksumAddress = '0x';

    for (let i = 0; i < address.length; i += 1) {
    // If ith character is 9 to f then make it uppercase
        if (parseInt(addressHash[i], 16) > 7) {
            checksumAddress += address[i].toUpperCase();
        } else {
            checksumAddress += address[i];
        }
    }

    return checksumAddress;
}

export {
    randomHex,
    unitMap,
    Hash,
    BN,
};
