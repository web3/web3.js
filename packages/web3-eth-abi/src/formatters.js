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
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2017
 */

var _ = require('underscore');
var utils = require('web3-utils');
var BN = require('bn.js');
var SolidityParam = require('./param');



/**
 * Formats input value to byte representation of int
 * If value is negative, return it's two's complement
 * If the value is floating point, round it down
 *
 * @method formatInputInt
 * @param {String|Number|BN} value that needs to be formatted
 * @returns {SolidityParam}
 */
var formatInputInt = function (value) {
    if(_.isNumber(value)) {
        value = Math.trunc(value);
    }
    return new SolidityParam(utils.toTwosComplement(value).replace('0x',''));
};

/**
 * Formats input bytes
 *
 * @method formatInputBytes
 * @param {String} value
 * @returns {SolidityParam}
 */
var formatInputBytes = function (value) {
    if(!utils.isHexStrict(value)) {
        throw new Error('Given parameter is not bytes: "'+ value + '"');
    }

    var result = value.replace(/^0x/i,'');

    if(result.length % 2 !== 0) {
        throw new Error('Given parameter bytes has an invalid length: "'+ value + '"');
    }

    if (result.length > 64) {
        throw new Error('Given parameter bytes is too long: "' + value + '"');
    }

    var l = Math.floor((result.length + 63) / 64);
    result = utils.padRight(result, l * 64);
    return new SolidityParam(result);
};

/**
 * Formats input bytes
 *
 * @method formatDynamicInputBytes
 * @param {String} value
 * @returns {SolidityParam}
 */
var formatInputDynamicBytes = function (value) {
    if(!utils.isHexStrict(value)) {
        throw new Error('Given parameter is not bytes: "'+ value + '"');
    }

    var result = value.replace(/^0x/i,'');

    if(result.length % 2 !== 0) {
        throw new Error('Given parameter bytes has an invalid length: "'+ value + '"');
    }

    var length = result.length / 2;
    var l = Math.floor((result.length + 63) / 64);
    result = utils.padRight(result, l * 64);
    return new SolidityParam(formatInputInt(length).value + result);
};

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputString
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputString = function (value) {
    var result = utils.utf8ToHex(value).replace(/^0x/i,'');
    var length = result.length / 2;
    var l = Math.floor((result.length + 63) / 64);
    result = utils.padRight(result, l * 64);
    return new SolidityParam(formatInputInt(length).value + result);
};

/**
 * Formats input value to byte representation of bool
 *
 * @method formatInputBool
 * @param {Boolean}
 * @returns {SolidityParam}
 */
var formatInputBool = function (value) {
    var result = '000000000000000000000000000000000000000000000000000000000000000' + (value ?  '1' : '0');
    return new SolidityParam(result);
};


/**
 * Check if input value is negative
 *
 * @method signedIsNegative
 * @param {String} value is hex format
 * @returns {Boolean} true if it is negative, otherwise false
 */
var signedIsNegative = function (value) {
    return (new BN(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
};

/**
 * Formats right-aligned output bytes to int
 *
 * @method formatOutputInt
 * @param {SolidityParam} param
 * @returns {BN} right-aligned output bytes formatted to big number
 */
var formatOutputInt = function (param) {
    var value = param.staticPart() || "0";

    // check if it's negative number
    // it it is, return two's complement
    if (signedIsNegative(value)) {
        return new BN(value, 16).fromTwos(256).toString(10);
    }
    return new BN(value, 16).toString(10);
};

/**
 * Formats right-aligned output bytes to uint
 *
 * @method formatOutputUInt
 * @param {SolidityParam} param
 * @returns {BN} right-aligned output bytes formatted to uint
 */
var formatOutputUInt = function (param, name) {
    var value = param.staticPart();

    if(!value && param.rawValue) {
        throw new Error('Couldn\'t decode '+ name +' from ABI: 0x'+ param.rawValue);
    }

    return new BN(value, 16).toString(10);
};



/**
 * Should be used to format output bool
 *
 * @method formatOutputBool
 * @param {SolidityParam} param
 * @returns {Boolean} right-aligned input bytes formatted to bool
 */
var formatOutputBool = function (param, name) {
    var value = param.staticPart();

    if(!value) {
        throw new Error('Couldn\'t decode '+ name +' from ABI: 0x'+ param.rawValue);
    }

    return (value === '0000000000000000000000000000000000000000000000000000000000000001');
};

/**
 * Should be used to format output bytes
 *
 * @method formatOutputBytes
 * @param {SolidityParam} param left-aligned hex representation of string
 * @param {String} name type name
 * @returns {String} hex string
 */
var formatOutputBytes = function (param, name) {
    var matches = name.match(/^bytes([0-9]*)/);
    var size = parseInt(matches[1]);

    if(param.staticPart().slice(0, 2 * size).length !== size * 2) {
        throw new Error('Couldn\'t decode '+ name +' from ABI: 0x'+ param.rawValue + ' The size doesn\'t match.');
    }

    return '0x' + param.staticPart().slice(0, 2 * size);
};

/**
 * Should be used to format output bytes
 *
 * @method formatOutputDynamicBytes
 * @param {SolidityParam} param left-aligned hex representation of string
 * @returns {String} hex string
 */
var formatOutputDynamicBytes = function (param) {
    var length = (new BN(param.dynamicPart().slice(0, 64), 16)).toNumber() * 2;
    return '0x' + param.dynamicPart().substr(64, length);
};

/**
 * Should be used to format output string
 *
 * @method formatOutputString
 * @param {SolidityParam} left-aligned hex representation of string
 * @returns {String} ascii string
 */
var formatOutputString = function (param) {
    var hex = param.dynamicPart().slice(0, 64);
    if(hex) {
        var length = (new BN(hex, 16)).toNumber() * 2;
        return length ? utils.hexToUtf8('0x'+ param.dynamicPart().substr(64, length).replace(/^0x/i, '')) : '';
    } else {
        throw new Error('ERROR: The returned value is not a convertible string:'+ hex);
    }
};

/**
 * Should be used to format output address
 *
 * @method formatOutputAddress
 * @param {Object} param right-aligned input bytes
 * @returns {String} address
 */
var formatOutputAddress = function (param) {
    var value = param.staticPart();
    return utils.toChecksumAddress("0x" + value.slice(value.length - 40, value.length));
};

module.exports = {
    formatInputInt: formatInputInt,
    formatInputBytes: formatInputBytes,
    formatInputDynamicBytes: formatInputDynamicBytes,
    formatInputString: formatInputString,
    formatInputBool: formatInputBool,
    formatOutputInt: formatOutputInt,
    formatOutputUInt: formatOutputUInt,
    formatOutputBool: formatOutputBool,
    formatOutputBytes: formatOutputBytes,
    formatOutputDynamicBytes: formatOutputDynamicBytes,
    formatOutputString: formatOutputString,
    formatOutputAddress: formatOutputAddress,
    toTwosComplement: utils.toTwosComplement
};
