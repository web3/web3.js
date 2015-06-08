require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file coder.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var BigNumber = require('bignumber.js');
var utils = require('../utils/utils');
var f = require('./formatters');
var SolidityParam = require('./param');

/**
 * Should be used to check if a type is an array type
 *
 * @method isArrayType
 * @param {String} type
 * @return {Bool} true is the type is an array, otherwise false
 */
var isArrayType = function (type) {
    return type.slice(-2) === '[]';
};

/**
 * SolidityType prototype is used to encode/decode solidity params of certain type
 */
var SolidityType = function (config) {
    this._name = config.name;
    this._match = config.match;
    this._mode = config.mode;
    this._inputFormatter = config.inputFormatter;
    this._outputFormatter = config.outputFormatter;
};

/**
 * Should be used to determine if this SolidityType do match given type
 *
 * @method isType
 * @param {String} name
 * @return {Bool} true if type match this SolidityType, otherwise false
 */
SolidityType.prototype.isType = function (name) {
    if (this._match === 'strict') {
        return this._name === name || (name.indexOf(this._name) === 0 && name.slice(this._name.length) === '[]');
    } else if (this._match === 'prefix') {
        // TODO better type detection!
        return name.indexOf(this._name) === 0;
    }
};

/**
 * Should be used to transform plain param to SolidityParam object
 *
 * @method formatInput
 * @param {Object} param - plain object, or an array of objects
 * @param {Bool} arrayType - true if a param should be encoded as an array
 * @return {SolidityParam} encoded param wrapped in SolidityParam object 
 */
SolidityType.prototype.formatInput = function (param, arrayType) {
    if (utils.isArray(param) && arrayType) { // TODO: should fail if this two are not the same
        var self = this;
        return param.map(function (p) {
            return self._inputFormatter(p);
        }).reduce(function (acc, current) {
            return acc.combine(current);
        }, f.formatInputInt(param.length)).withOffset(32);
    } 
    return this._inputFormatter(param);
};

/**
 * Should be used to transoform SolidityParam to plain param
 *
 * @method formatOutput
 * @param {SolidityParam} byteArray
 * @param {Bool} arrayType - true if a param should be decoded as an array
 * @return {Object} plain decoded param
 */
SolidityType.prototype.formatOutput = function (param, arrayType) {
    if (arrayType) {
        // let's assume, that we solidity will never return long arrays :P 
        var result = [];
        var length = new BigNumber(param.dynamicPart().slice(0, 64), 16);
        for (var i = 0; i < length * 64; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(param.dynamicPart().substr(i + 64, 64))));
        }
        return result;
    }
    return this._outputFormatter(param);
};

/**
 * Should be used to slice single param from bytes
 *
 * @method sliceParam
 * @param {String} bytes
 * @param {Number} index of param to slice
 * @param {String} type
 * @returns {SolidityParam} param
 */
SolidityType.prototype.sliceParam = function (bytes, index, type) {
    if (this._mode === 'bytes') {
        return SolidityParam.decodeBytes(bytes, index);
    } else if (isArrayType(type)) {
        return SolidityParam.decodeArray(bytes, index);
    }
    return SolidityParam.decodeParam(bytes, index);
};

/**
 * SolidityCoder prototype should be used to encode/decode solidity params of any type
 */
var SolidityCoder = function (types) {
    this._types = types;
};

/**
 * This method should be used to transform type to SolidityType
 *
 * @method _requireType
 * @param {String} type
 * @returns {SolidityType} 
 * @throws {Error} throws if no matching type is found
 */
SolidityCoder.prototype._requireType = function (type) {
    var solidityType = this._types.filter(function (t) {
        return t.isType(type);
    })[0];

    if (!solidityType) {
        throw Error('invalid solidity type!: ' + type);
    }

    return solidityType;
};

/**
 * Should be used to transform plain param of given type to SolidityParam
 *
 * @method _formatInput
 * @param {String} type of param
 * @param {Object} plain param
 * @return {SolidityParam}
 */
SolidityCoder.prototype._formatInput = function (type, param) {
    return this._requireType(type).formatInput(param, isArrayType(type));
};

/**
 * Should be used to encode plain param
 *
 * @method encodeParam
 * @param {String} type
 * @param {Object} plain param
 * @return {String} encoded plain param
 */
SolidityCoder.prototype.encodeParam = function (type, param) {
    return this._formatInput(type, param).encode();
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParams
 * @param {Array} types
 * @param {Array} params
 * @return {String} encoded list of params
 */
SolidityCoder.prototype.encodeParams = function (types, params) {
    var self = this;
    var solidityParams = types.map(function (type, index) {
        return self._formatInput(type, params[index]);
    });

    return SolidityParam.encodeList(solidityParams);
};

/**
 * Should be used to decode bytes to plain param
 *
 * @method decodeParam
 * @param {String} type
 * @param {String} bytes
 * @return {Object} plain param
 */
SolidityCoder.prototype.decodeParam = function (type, bytes) {
    return this.decodeParams([type], bytes)[0];
};

/**
 * Should be used to decode list of params
 *
 * @method decodeParam
 * @param {Array} types
 * @param {String} bytes
 * @return {Array} array of plain params
 */
SolidityCoder.prototype.decodeParams = function (types, bytes) {
    var self = this;
    return types.map(function (type, index) {
        var solidityType = self._requireType(type);
        var p = solidityType.sliceParam(bytes, index, type);
        return solidityType.formatOutput(p, isArrayType(type));
    });
};

var coder = new SolidityCoder([
    new SolidityType({
        name: 'address',
        match: 'strict',
        mode: 'value',
        inputFormatter: f.formatInputInt,
        outputFormatter: f.formatOutputAddress
    }),
    new SolidityType({
        name: 'bool',
        match: 'strict',
        mode: 'value',
        inputFormatter: f.formatInputBool,
        outputFormatter: f.formatOutputBool
    }),
    new SolidityType({
        name: 'int',
        match: 'prefix',
        mode: 'value',
        inputFormatter: f.formatInputInt,
        outputFormatter: f.formatOutputInt,
    }),
    new SolidityType({
        name: 'uint',
        match: 'prefix',
        mode: 'value',
        inputFormatter: f.formatInputInt,
        outputFormatter: f.formatOutputUInt
    }),
    new SolidityType({
        name: 'bytes',
        match: 'strict',
        mode: 'bytes',
        inputFormatter: f.formatInputDynamicBytes,
        outputFormatter: f.formatOutputDynamicBytes
    }),
    new SolidityType({
        name: 'bytes',
        match: 'prefix',
        mode: 'value',
        inputFormatter: f.formatInputBytes,
        outputFormatter: f.formatOutputBytes
    }),
    new SolidityType({
        name: 'real',
        match: 'prefix',
        mode: 'value',
        inputFormatter: f.formatInputReal,
        outputFormatter: f.formatOutputReal
    }),
    new SolidityType({
        name: 'ureal',
        match: 'prefix',
        mode: 'value',
        inputFormatter: f.formatInputReal,
        outputFormatter: f.formatOutputUReal
    })
]);

module.exports = coder;


},{"../utils/utils":7,"./formatters":2,"./param":3,"bignumber.js":"bignumber.js"}],2:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var BigNumber = require('bignumber.js');
var utils = require('../utils/utils');
var c = require('../utils/config');
var SolidityParam = require('./param');


/**
 * Formats input value to byte representation of int
 * If value is negative, return it's two's complement
 * If the value is floating point, round it down
 *
 * @method formatInputInt
 * @param {String|Number|BigNumber} value that needs to be formatted
 * @returns {SolidityParam}
 */
var formatInputInt = function (value) {
    var padding = c.ETH_PADDING * 2;
    BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE);
    var result = utils.padLeft(utils.toTwosComplement(value).round().toString(16), padding);
    return new SolidityParam(result);
};

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputBytes
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputBytes = function (value) {
    var result = utils.fromAscii(value, c.ETH_PADDING).substr(2);
    return new SolidityParam(result);
};

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputDynamicBytes
 * @param {String}
 * @returns {SolidityParam}
 */
var formatInputDynamicBytes = function (value) {
    var result = utils.fromAscii(value, c.ETH_PADDING).substr(2);
    return new SolidityParam(formatInputInt(value.length).value + result, 32);
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
 * Formats input value to byte representation of real
 * Values are multiplied by 2^m and encoded as integers
 *
 * @method formatInputReal
 * @param {String|Number|BigNumber}
 * @returns {SolidityParam}
 */
var formatInputReal = function (value) {
    return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)));
};

/**
 * Check if input value is negative
 *
 * @method signedIsNegative
 * @param {String} value is hex format
 * @returns {Boolean} true if it is negative, otherwise false
 */
var signedIsNegative = function (value) {
    return (new BigNumber(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
};

/**
 * Formats right-aligned output bytes to int
 *
 * @method formatOutputInt
 * @param {SolidityParam} param
 * @returns {BigNumber} right-aligned output bytes formatted to big number
 */
var formatOutputInt = function (param) {
    var value = param.staticPart() || "0";

    // check if it's negative number
    // it it is, return two's complement
    if (signedIsNegative(value)) {
        return new BigNumber(value, 16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)).minus(1);
    }
    return new BigNumber(value, 16);
};

/**
 * Formats right-aligned output bytes to uint
 *
 * @method formatOutputUInt
 * @param {SolidityParam}
 * @returns {BigNumeber} right-aligned output bytes formatted to uint
 */
var formatOutputUInt = function (param) {
    var value = param.staticPart() || "0";
    return new BigNumber(value, 16);
};

/**
 * Formats right-aligned output bytes to real
 *
 * @method formatOutputReal
 * @param {SolidityParam}
 * @returns {BigNumber} input bytes formatted to real
 */
var formatOutputReal = function (param) {
    return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128)); 
};

/**
 * Formats right-aligned output bytes to ureal
 *
 * @method formatOutputUReal
 * @param {SolidityParam}
 * @returns {BigNumber} input bytes formatted to ureal
 */
var formatOutputUReal = function (param) {
    return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128)); 
};

/**
 * Should be used to format output bool
 *
 * @method formatOutputBool
 * @param {SolidityParam}
 * @returns {Boolean} right-aligned input bytes formatted to bool
 */
var formatOutputBool = function (param) {
    return param.staticPart() === '0000000000000000000000000000000000000000000000000000000000000001' ? true : false;
};

/**
 * Should be used to format output string
 *
 * @method formatOutputBytes
 * @param {SolidityParam} left-aligned hex representation of string
 * @returns {String} ascii string
 */
var formatOutputBytes = function (param) {
    // length might also be important!
    return utils.toAscii(param.staticPart());
};

/**
 * Should be used to format output string
 *
 * @method formatOutputDynamicBytes
 * @param {SolidityParam} left-aligned hex representation of string
 * @returns {String} ascii string
 */
var formatOutputDynamicBytes = function (param) {
    // length might also be important!
    return utils.toAscii(param.dynamicPart().slice(64));
};

/**
 * Should be used to format output address
 *
 * @method formatOutputAddress
 * @param {SolidityParam} right-aligned input bytes
 * @returns {String} address
 */
var formatOutputAddress = function (param) {
    var value = param.staticPart();
    return "0x" + value.slice(value.length - 40, value.length);
};

module.exports = {
    formatInputInt: formatInputInt,
    formatInputBytes: formatInputBytes,
    formatInputDynamicBytes: formatInputDynamicBytes,
    formatInputBool: formatInputBool,
    formatInputReal: formatInputReal,
    formatOutputInt: formatOutputInt,
    formatOutputUInt: formatOutputUInt,
    formatOutputReal: formatOutputReal,
    formatOutputUReal: formatOutputUReal,
    formatOutputBool: formatOutputBool,
    formatOutputBytes: formatOutputBytes,
    formatOutputDynamicBytes: formatOutputDynamicBytes,
    formatOutputAddress: formatOutputAddress
};


},{"../utils/config":5,"../utils/utils":7,"./param":3,"bignumber.js":"bignumber.js"}],3:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file param.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');

/**
 * SolidityParam object prototype.
 * Should be used when encoding, decoding solidity bytes
 */
var SolidityParam = function (value, offset) {
    this.value = value || '';
    this.offset = offset; // offset in bytes
};

/**
 * This method should be used to get length of params's dynamic part
 * 
 * @method dynamicPartLength
 * @returns {Number} length of dynamic part (in bytes)
 */
SolidityParam.prototype.dynamicPartLength = function () {
    return this.dynamicPart().length / 2;
};

/**
 * This method should be used to create copy of solidity param with different offset
 *
 * @method withOffset
 * @param {Number} offset length in bytes
 * @returns {SolidityParam} new solidity param with applied offset
 */
SolidityParam.prototype.withOffset = function (offset) {
    return new SolidityParam(this.value, offset);
};

/**
 * This method should be used to combine solidity params together
 * eg. when appending an array
 *
 * @method combine
 * @param {SolidityParam} param with which we should combine
 * @param {SolidityParam} result of combination
 */
SolidityParam.prototype.combine = function (param) {
    return new SolidityParam(this.value + param.value); 
};

/**
 * This method should be called to check if param has dynamic size.
 * If it has, it returns true, otherwise false
 *
 * @method isDynamic
 * @returns {Boolean}
 */
SolidityParam.prototype.isDynamic = function () {
    return this.value.length > 64 || this.offset !== undefined;
};

/**
 * This method should be called to transform offset to bytes
 *
 * @method offsetAsBytes
 * @returns {String} bytes representation of offset
 */
SolidityParam.prototype.offsetAsBytes = function () {
    return !this.isDynamic() ? '' : utils.padLeft(utils.toTwosComplement(this.offset).toString(16), 64);
};

/**
 * This method should be called to get static part of param
 *
 * @method staticPart
 * @returns {String} offset if it is a dynamic param, otherwise value
 */
SolidityParam.prototype.staticPart = function () {
    if (!this.isDynamic()) {
        return this.value; 
    } 
    return this.offsetAsBytes();
};

/**
 * This method should be called to get dynamic part of param
 *
 * @method dynamicPart
 * @returns {String} returns a value if it is a dynamic param, otherwise empty string
 */
SolidityParam.prototype.dynamicPart = function () {
    return this.isDynamic() ? this.value : '';
};

/**
 * This method should be called to encode param
 *
 * @method encode
 * @returns {String}
 */
SolidityParam.prototype.encode = function () {
    return this.staticPart() + this.dynamicPart();
};

/**
 * This method should be called to encode array of params
 *
 * @method encodeList
 * @param {Array[SolidityParam]} params
 * @returns {String}
 */
SolidityParam.encodeList = function (params) {
    
    // updating offsets
    var totalOffset = params.length * 32;
    var offsetParams = params.map(function (param) {
        if (!param.isDynamic()) {
            return param;
        }
        var offset = totalOffset;
        totalOffset += param.dynamicPartLength();
        return param.withOffset(offset);
    });

    // encode everything!
    return offsetParams.reduce(function (result, param) {
        return result + param.dynamicPart();
    }, offsetParams.reduce(function (result, param) {
        return result + param.staticPart();
    }, ''));
};

/**
 * This method should be used to decode plain (static) solidity param at given index
 *
 * @method decodeParam
 * @param {String} bytes
 * @param {Number} index
 * @returns {SolidityParam}
 */
SolidityParam.decodeParam = function (bytes, index) {
    index = index || 0;
    return new SolidityParam(bytes.substr(index * 64, 64)); 
};

/**
 * This method should be called to get offset value from bytes at given index
 *
 * @method getOffset
 * @param {String} bytes
 * @param {Number} index
 * @returns {Number} offset as number
 */
var getOffset = function (bytes, index) {
    // we can do this cause offset is rather small
    return parseInt('0x' + bytes.substr(index * 64, 64));
};

/**
 * This method should be called to decode solidity bytes param at given index
 *
 * @method decodeBytes
 * @param {String} bytes
 * @param {Number} index
 * @returns {SolidityParam}
 */
SolidityParam.decodeBytes = function (bytes, index) {
    index = index || 0;
    //TODO add support for strings longer than 32 bytes
    //var length = parseInt('0x' + bytes.substr(offset * 64, 64));

    var offset = getOffset(bytes, index);

    // 2 * , cause we also parse length
    return new SolidityParam(bytes.substr(offset * 2, 2 * 64), 0);
};

/**
 * This method should be used to decode solidity array at given index
 *
 * @method decodeArray
 * @param {String} bytes
 * @param {Number} index
 * @returns {SolidityParam}
 */
SolidityParam.decodeArray = function (bytes, index) {
    index = index || 0;
    var offset = getOffset(bytes, index);
    var length = parseInt('0x' + bytes.substr(offset * 2, 64));
    return new SolidityParam(bytes.substr(offset * 2, (length + 1) * 64), 0);
};

module.exports = SolidityParam;


},{"../utils/utils":7}],4:[function(require,module,exports){
'use strict';

// go env doesn't have and need XMLHttpRequest
if (typeof XMLHttpRequest === 'undefined') {
    exports.XMLHttpRequest = {};
} else {
    exports.XMLHttpRequest = XMLHttpRequest; // jshint ignore:line
}


},{}],5:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file config.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

/**
 * Utils
 * 
 * @module utils
 */

/**
 * Utility functions
 * 
 * @class [utils] config
 * @constructor
 */

/// required to define ETH_BIGNUMBER_ROUNDING_MODE
var BigNumber = require('bignumber.js');

var ETH_UNITS = [
    'wei',
    'kwei',
    'Mwei',
    'Gwei',
    'szabo',
    'finney',
    'femtoether',
    'picoether',
    'nanoether',
    'microether',
    'milliether',
    'nano',
    'micro',
    'milli',
    'ether',
    'grand',
    'Mether',
    'Gether',
    'Tether',
    'Pether',
    'Eether',
    'Zether',
    'Yether',
    'Nether',
    'Dether',
    'Vether',
    'Uether'
];

module.exports = {
    ETH_PADDING: 32,
    ETH_SIGNATURE_LENGTH: 4,
    ETH_UNITS: ETH_UNITS,
    ETH_BIGNUMBER_ROUNDING_MODE: { ROUNDING_MODE: BigNumber.ROUND_DOWN },
    ETH_POLLING_TIMEOUT: 1000/2,
    defaultBlock: 'latest',
    defaultAccount: undefined
};


},{"bignumber.js":"bignumber.js"}],6:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file sha3.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var utils = require('./utils');
var sha3 = require('crypto-js/sha3');

module.exports = function (str, isNew) {
    if (str.substr(0, 2) === '0x' && !isNew) {
        console.warn('requirement of using web3.fromAscii before sha3 is deprecated');
        console.warn('new usage: \'web3.sha3("hello")\'');
        console.warn('see https://github.com/ethereum/web3.js/pull/205');
        console.warn('if you need to hash hex value, you can do \'sha3("0xfff", true)\'');
        str = utils.toAscii(str);
    }

    return sha3(str, {
        outputLength: 256
    }).toString();
};


},{"./utils":7,"crypto-js/sha3":33}],7:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file utils.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

/**
 * Utils
 * 
 * @module utils
 */

/**
 * Utility functions
 * 
 * @class [utils] utils
 * @constructor
 */

var BigNumber = require('bignumber.js');

var unitMap = {
    'wei':          '1',
    'kwei':         '1000',
    'ada':          '1000',
    'femtoether':   '1000',
    'mwei':         '1000000',
    'babbage':      '1000000',
    'picoether':    '1000000',
    'gwei':         '1000000000',
    'shannon':      '1000000000',
    'nanoether':    '1000000000',
    'nano':         '1000000000',
    'szabo':        '1000000000000',
    'microether':   '1000000000000',
    'micro':        '1000000000000',
    'finney':       '1000000000000000',
    'milliether':    '1000000000000000',
    'milli':         '1000000000000000',
    'ether':        '1000000000000000000',
    'kether':       '1000000000000000000000',
    'grand':        '1000000000000000000000',
    'einstein':     '1000000000000000000000',
    'mether':       '1000000000000000000000000',
    'gether':       '1000000000000000000000000000',
    'tether':       '1000000000000000000000000000000'
};

/**
 * Should be called to pad string to expected length
 *
 * @method padLeft
 * @param {String} string to be padded
 * @param {Number} characters that result string should have
 * @param {String} sign, by default 0
 * @returns {String} right aligned string
 */
var padLeft = function (string, chars, sign) {
    return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
};

/** 
 * Should be called to get sting from it's hex representation
 *
 * @method toAscii
 * @param {String} string in hex
 * @returns {String} ascii string representation of hex value
 */
var toAscii = function(hex) {
// Find termination
    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code === 0) {
            break;
        }

        str += String.fromCharCode(code);
    }

    return str;
};
    
/**
 * Shold be called to get hex representation (prefixed by 0x) of ascii string 
 *
 * @method toHexNative
 * @param {String} string
 * @returns {String} hex representation of input string
 */
var toHexNative = function(str) {
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var n = str.charCodeAt(i).toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return hex;
};

/**
 * Shold be called to get hex representation (prefixed by 0x) of ascii string 
 *
 * @method fromAscii
 * @param {String} string
 * @param {Number} optional padding
 * @returns {String} hex representation of input string
 */
var fromAscii = function(str, pad) {
    pad = pad === undefined ? 0 : pad;
    var hex = toHexNative(str);
    while (hex.length < pad*2)
        hex += "00";
    return "0x" + hex;
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method transformToFullName
 * @param {Object} json-abi
 * @return {String} full fnction/event name
 */
var transformToFullName = function (json) {
    if (json.name.indexOf('(') !== -1) {
        return json.name;
    }

    var typeName = json.inputs.map(function(i){return i.type; }).join();
    return json.name + '(' + typeName + ')';
};

/**
 * Should be called to get display name of contract function
 * 
 * @method extractDisplayName
 * @param {String} name of function/event
 * @returns {String} display name for function/event eg. multiply(uint256) -> multiply
 */
var extractDisplayName = function (name) {
    var length = name.indexOf('('); 
    return length !== -1 ? name.substr(0, length) : name;
};

/// @returns overloaded part of function/event name
var extractTypeName = function (name) {
    /// TODO: make it invulnerable
    var length = name.indexOf('(');
    return length !== -1 ? name.substr(length + 1, name.length - 1 - (length + 1)).replace(' ', '') : "";
};

/**
 * Converts value to it's decimal representation in string
 *
 * @method toDecimal
 * @param {String|Number|BigNumber}
 * @return {String}
 */
var toDecimal = function (value) {
    return toBigNumber(value).toNumber();
};

/**
 * Converts value to it's hex representation
 *
 * @method fromDecimal
 * @param {String|Number|BigNumber}
 * @return {String}
 */
var fromDecimal = function (value) {
    var number = toBigNumber(value);
    var result = number.toString(16);

    return number.lessThan(0) ? '-0x' + result.substr(1) : '0x' + result;
};

/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param {String|Number|BigNumber|Object}
 * @return {String}
 */
var toHex = function (val) {
    /*jshint maxcomplexity:7 */

    if (isBoolean(val))
        return fromDecimal(+val);

    if (isBigNumber(val))
        return fromDecimal(val);

    if (isObject(val))
        return fromAscii(JSON.stringify(val));

    // if its a negative number, pass it through fromDecimal
    if (isString(val)) {
        if (val.indexOf('-0x') === 0)
           return fromDecimal(val);
        else if (!isFinite(val))
            return fromAscii(val);
    }

    return fromDecimal(val);
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
var getValueOfUnit = function (unit) {
    unit = unit ? unit.toLowerCase() : 'ether';
    var unitValue = unitMap[unit];
    if (unitValue === undefined) {
        throw new Error('This unit doesn\'t exists, please use the one of the following units' + JSON.stringify(unitMap, null, 2));
    }
    return new BigNumber(unitValue, 10);
};

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     ada
 * - mwei       picoether      babbage
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    einstein     grand 
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
*/
var fromWei = function(number, unit) {
    var returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));

    return isBigNumber(number) ? returnValue : returnValue.toString(10); 
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     ada
 * - mwei       picoether      babbage       
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    einstein     grand 
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
*/
var toWei = function(number, unit) {
    var returnValue = toBigNumber(number).times(getValueOfUnit(unit));

    return isBigNumber(number) ? returnValue : returnValue.toString(10); 
};

/**
 * Takes an input and transforms it into an bignumber
 *
 * @method toBigNumber
 * @param {Number|String|BigNumber} a number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
*/
var toBigNumber = function(number) {
    /*jshint maxcomplexity:5 */
    number = number || 0;
    if (isBigNumber(number))
        return number;

    if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
        return new BigNumber(number.replace('0x',''), 16);
    }
   
    return new BigNumber(number.toString(10), 10);
};

/**
 * Takes and input transforms it into bignumber and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BigNumber}
 * @return {BigNumber}
 */
var toTwosComplement = function (number) {
    var bigNumber = toBigNumber(number);
    if (bigNumber.lessThan(0)) {
        return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16).plus(bigNumber).plus(1);
    }
    return bigNumber;
};

/**
 * Checks if the given string is strictly an address
 *
 * @method isStrictAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isStrictAddress = function (address) {
    return /^0x[0-9a-f]{40}$/.test(address);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    return /^(0x)?[0-9a-f]{40}$/.test(address);
};

/**
 * Transforms given string to valid 20 bytes-length addres with 0x prefix
 *
 * @method toAddress
 * @param {String} address
 * @return {String} formatted address
 */
var toAddress = function (address) {
    if (isStrictAddress(address)) {
        return address;
    }
    
    if (/^[0-9a-f]{40}$/.test(address)) {
        return '0x' + address;
    }

    return '0x' + padLeft(toHex(address).substr(2), 40);
};


/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param {Object}
 * @return {Boolean} 
 */
var isBigNumber = function (object) {
    return object instanceof BigNumber ||
        (object && object.constructor && object.constructor.name === 'BigNumber');
};

/**
 * Returns true if object is string, otherwise false
 * 
 * @method isString
 * @param {Object}
 * @return {Boolean}
 */
var isString = function (object) {
    return typeof object === 'string' ||
        (object && object.constructor && object.constructor.name === 'String');
};

/**
 * Returns true if object is function, otherwise false
 *
 * @method isFunction
 * @param {Object}
 * @return {Boolean}
 */
var isFunction = function (object) {
    return typeof object === 'function';
};

/**
 * Returns true if object is Objet, otherwise false
 *
 * @method isObject
 * @param {Object}
 * @return {Boolean}
 */
var isObject = function (object) {
    return typeof object === 'object';
};

/**
 * Returns true if object is boolean, otherwise false
 *
 * @method isBoolean
 * @param {Object}
 * @return {Boolean}
 */
var isBoolean = function (object) {
    return typeof object === 'boolean';
};

/**
 * Returns true if object is array, otherwise false
 *
 * @method isArray
 * @param {Object}
 * @return {Boolean}
 */
var isArray = function (object) {
    return object instanceof Array; 
};

/**
 * Returns true if given string is valid json object
 * 
 * @method isJson
 * @param {String}
 * @return {Boolean}
 */
var isJson = function (str) {
    try {
        return !!JSON.parse(str);
    } catch (e) {
        return false;
    }
};

/**
 * This method should be called to check if string is valid ethereum IBAN number
 * Supports direct and indirect IBANs
 *
 * @method isIBAN
 * @param {String}
 * @return {Boolean}
 */
var isIBAN = function (iban) {
    return /^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30})$/.test(iban);
};

module.exports = {
    padLeft: padLeft,
    toHex: toHex,
    toDecimal: toDecimal,
    fromDecimal: fromDecimal,
    toAscii: toAscii,
    fromAscii: fromAscii,
    transformToFullName: transformToFullName,
    extractDisplayName: extractDisplayName,
    extractTypeName: extractTypeName,
    toWei: toWei,
    fromWei: fromWei,
    toBigNumber: toBigNumber,
    toTwosComplement: toTwosComplement,
    toAddress: toAddress,
    isBigNumber: isBigNumber,
    isStrictAddress: isStrictAddress,
    isAddress: isAddress,
    isFunction: isFunction,
    isString: isString,
    isObject: isObject,
    isBoolean: isBoolean,
    isArray: isArray,
    isJson: isJson,
    isIBAN: isIBAN
};


},{"bignumber.js":"bignumber.js"}],8:[function(require,module,exports){
module.exports={
    "version": "0.5.0"
}

},{}],9:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file web3.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var version = require('./version.json');
var net = require('./web3/net');
var eth = require('./web3/eth');
var db = require('./web3/db');
var shh = require('./web3/shh');
var watches = require('./web3/watches');
var Filter = require('./web3/filter');
var utils = require('./utils/utils');
var formatters = require('./web3/formatters');
var RequestManager = require('./web3/requestmanager');
var c = require('./utils/config');
var Property = require('./web3/property');
var Batch = require('./web3/batch');
var sha3 = require('./utils/sha3');

var web3Properties = [
    new Property({
        name: 'version.client',
        getter: 'web3_clientVersion'
    }),
    new Property({
        name: 'version.network',
        getter: 'net_version',
        inputFormatter: utils.toDecimal
    }),
    new Property({
        name: 'version.ethereum',
        getter: 'eth_protocolVersion',
        inputFormatter: utils.toDecimal
    }),
    new Property({
        name: 'version.whisper',
        getter: 'shh_version',
        inputFormatter: utils.toDecimal
    })
];

/// creates methods in a given object based on method description on input
/// setups api calls for these methods
var setupMethods = function (obj, methods) {
    methods.forEach(function (method) {
        method.attachToObject(obj);
    });
};

/// creates properties in a given object based on properties description on input
/// setups api calls for these properties
var setupProperties = function (obj, properties) {
    properties.forEach(function (property) {
        property.attachToObject(obj);
    });
};

/// setups web3 object, and it's in-browser executed methods
var web3 = {};
web3.providers = {};
web3.version = {};
web3.version.api = version.version;
web3.eth = {};

/*jshint maxparams:4 */
web3.eth.filter = function (fil, eventParams, options, formatter) {

    // if its event, treat it differently
    // TODO: simplify and remove
    if (fil._isEvent) {
        return fil(eventParams, options);
    }

    // output logs works for blockFilter and pendingTransaction filters?
    return new Filter(fil, watches.eth(), formatter || formatters.outputLogFormatter);
};
/*jshint maxparams:3 */

web3.shh = {};
web3.shh.filter = function (fil) {
    return new Filter(fil, watches.shh(), formatters.outputPostFormatter);
};
web3.net = {};
web3.db = {};
web3.setProvider = function (provider) {
    RequestManager.getInstance().setProvider(provider);
};
web3.reset = function () {
    RequestManager.getInstance().reset();
    c.defaultBlock = 'latest';
    c.defaultAccount = undefined;
};
web3.toHex = utils.toHex;
web3.toAscii = utils.toAscii;
web3.fromAscii = utils.fromAscii;
web3.toDecimal = utils.toDecimal;
web3.fromDecimal = utils.fromDecimal;
web3.toBigNumber = utils.toBigNumber;
web3.toWei = utils.toWei;
web3.fromWei = utils.fromWei;
web3.isAddress = utils.isAddress;
web3.isIBAN = utils.isIBAN;
web3.sha3 = sha3;
web3.createBatch = function () {
    return new Batch();
};

// ADD defaultblock
Object.defineProperty(web3.eth, 'defaultBlock', {
    get: function () {
        return c.defaultBlock;
    },
    set: function (val) {
        c.defaultBlock = val;
        return val;
    }
});

Object.defineProperty(web3.eth, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});


// EXTEND
web3._extend = function(extension){
    /*jshint maxcomplexity: 6 */

    if(extension.property && !web3[extension.property])
        web3[extension.property] = {};

    setupMethods(web3[extension.property] || web3, extension.methods || []);
    setupProperties(web3[extension.property] || web3, extension.properties || []);
};
web3._extend.formatters = formatters;
web3._extend.utils = utils;
web3._extend.Method = require('./web3/method');
web3._extend.Property = require('./web3/property');


/// setups all api methods
setupProperties(web3, web3Properties);
setupMethods(web3.net, net.methods);
setupProperties(web3.net, net.properties);
setupMethods(web3.eth, eth.methods);
setupProperties(web3.eth, eth.properties);
setupMethods(web3.db, db.methods);
setupMethods(web3.shh, shh.methods);

module.exports = web3;


},{"./utils/config":5,"./utils/sha3":6,"./utils/utils":7,"./version.json":8,"./web3/batch":10,"./web3/db":12,"./web3/eth":14,"./web3/filter":16,"./web3/formatters":17,"./web3/method":22,"./web3/net":24,"./web3/property":25,"./web3/requestmanager":27,"./web3/shh":28,"./web3/watches":30}],10:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file batch.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var RequestManager = require('./requestmanager');

var Batch = function () {
    this.requests = [];
};

/**
 * Should be called to add create new request to batch request
 *
 * @method add
 * @param {Object} jsonrpc requet object
 */
Batch.prototype.add = function (request) {
    this.requests.push(request);
};

/**
 * Should be called to execute batch request
 *
 * @method execute
 */
Batch.prototype.execute = function () {
    var requests = this.requests;
    RequestManager.getInstance().sendBatch(requests, function (err, results) {
        results = results || [];
        requests.map(function (request, index) {
            return results[index] || {};
        }).map(function (result, index) {
            return requests[index].format ? requests[index].format(result.result) : result.result;
        }).forEach(function (result, index) {
            if (requests[index].callback) {
                requests[index].callback(err, result);
            }
        });
    }); 
};

module.exports = Batch;


},{"./requestmanager":27}],11:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file contract.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var web3 = require('../web3'); 
var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var SolidityEvent = require('./event');
var SolidityFunction = require('./function');

/**
 * Should be called to encode constructor params
 *
 * @method encodeConstructorParams
 * @param {Array} abi
 * @param {Array} constructor params
 */
var encodeConstructorParams = function (abi, params) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';
};

/**
 * Should be called to add functions to contract object
 *
 * @method addFunctionsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addFunctionsToContract = function (contract, abi) {
    abi.filter(function (json) {
        return json.type === 'function';
    }).map(function (json) {
        return new SolidityFunction(json, contract.address);
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

/**
 * Should be called to add events to contract object
 *
 * @method addEventsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addEventsToContract = function (contract, abi) {
    abi.filter(function (json) {
        return json.type === 'event';
    }).map(function (json) {
        return new SolidityEvent(json, contract.address);
    }).forEach(function (e) {
        e.attachToContract(contract);
    });
};

/**
 * Should be called to create new ContractFactory
 *
 * @method contract
 * @param {Array} abi
 * @returns {ContractFactory} new contract factory
 */
var contract = function (abi) {
    return new ContractFactory(abi);
};

/**
 * Should be called to create new ContractFactory instance
 *
 * @method ContractFactory
 * @param {Array} abi
 */
var ContractFactory = function (abi) {
    this.abi = abi;
};

/**
 * Should be called to create new contract on a blockchain
 * 
 * @method new
 * @param {Any} contract constructor param1 (optional)
 * @param {Any} contract constructor param2 (optional)
 * @param {Object} contract transaction object (required)
 * @param {Function} callback
 * @returns {Contract} returns contract if no callback was passed,
 * otherwise calls callback function (err, contract)
 */
ContractFactory.prototype.new = function () {
    // parse arguments
    var options = {}; // required!
    var callback;

    var args = Array.prototype.slice.call(arguments);
    if (utils.isFunction(args[args.length - 1])) {
        callback = args.pop();
    }

    var last = args[args.length - 1];
    if (utils.isObject(last) && !utils.isArray(last)) {
        options = args.pop();
    }

    // throw an error if there are no options

    var bytes = encodeConstructorParams(this.abi, args);
    options.data += bytes;

    if (!callback) {
        var address = web3.eth.sendTransaction(options);
        return this.at(address);
    }
  
    var self = this;
    web3.eth.sendTransaction(options, function (err, address) {
        if (err) {
            callback(err);
        }
        self.at(address, callback); 
    }); 
};

/**
 * Should be called to get access to existing contract on a blockchain
 *
 * @method at
 * @param {Address} contract address (required)
 * @param {Function} callback {optional)
 * @returns {Contract} returns contract if no callback was passed,
 * otherwise calls callback function (err, contract)
 */
ContractFactory.prototype.at = function (address, callback) {
    // TODO: address is required
    
    if (callback) {
        callback(null, new Contract(this.abi, address));
    } 
    return new Contract(this.abi, address);
};

/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @param {Array} abi
 * @param {Address} contract address
 */
var Contract = function (abi, address) {
    this.address = address;
    addFunctionsToContract(this, abi);
    addEventsToContract(this, abi);
};

module.exports = contract;


},{"../solidity/coder":1,"../utils/utils":7,"../web3":9,"./event":15,"./function":18}],12:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file db.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Method = require('./method');

var putString = new Method({
    name: 'putString',
    call: 'db_putString',
    params: 3
});


var getString = new Method({
    name: 'getString',
    call: 'db_getString',
    params: 2
});

var putHex = new Method({
    name: 'putHex',
    call: 'db_putHex',
    params: 3
});

var getHex = new Method({
    name: 'getHex',
    call: 'db_getHex',
    params: 2
});

var methods = [
    putString, getString, putHex, getHex
];

module.exports = {
    methods: methods
};

},{"./method":22}],13:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file errors.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

module.exports = {
    InvalidNumberOfParams: function () {
        return new Error('Invalid number of input parameters');
    },
    InvalidConnection: function (host){
        return new Error('CONNECTION ERROR: Couldn\'t connect to node '+ host +', is it running?');
    },
    InvalidProvider: function () {
        return new Error('Providor not set or invalid');
    },
    InvalidResponse: function (result){
        var message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response';
        return new Error(message);
    }
};


},{}],14:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file eth.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

/**
 * Web3
 *
 * @module web3
 */

/**
 * Eth methods and properties
 *
 * An example method object can look as follows:
 *
 *      {
 *      name: 'getBlock',
 *      call: blockCall,
 *      params: 2,
 *      outputFormatter: formatters.outputBlockFormatter,
 *      inputFormatter: [ // can be a formatter funciton or an array of functions. Where each item in the array will be used for one parameter
 *           utils.toHex, // formats paramter 1
 *           function(param){ return !!param; } // formats paramter 2
 *         ]
 *       },
 *
 * @class [web3] eth
 * @constructor
 */

"use strict";

var formatters = require('./formatters');
var utils = require('../utils/utils');
var Method = require('./method');
var Property = require('./property');

var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
};

/// @returns an array of objects describing web3.eth api methods

var getBalance = new Method({
    name: 'getBalance',
    call: 'eth_getBalance',
    params: 2,
    inputFormatter: [utils.toAddress, formatters.inputDefaultBlockNumberFormatter],
    outputFormatter: formatters.outputBigNumberFormatter
});

var getStorageAt = new Method({
    name: 'getStorageAt',
    call: 'eth_getStorageAt',
    params: 3,
    inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
});

var getCode = new Method({
    name: 'getCode',
    call: 'eth_getCode',
    params: 2,
    inputFormatter: [utils.toAddress, formatters.inputDefaultBlockNumberFormatter]
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

var getCompilers = new Method({
    name: 'getCompilers',
    call: 'eth_getCompilers',
    params: 0
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
    outputFormatter: formatters.outputTransactionFormatter
});

var getTransactionFromBlock = new Method({
    name: 'getTransactionFromBlock',
    call: transactionFromBlockCall,
    params: 2,
    inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
    outputFormatter: formatters.outputTransactionFormatter
});

var getTransactionCount = new Method({
    name: 'getTransactionCount',
    call: 'eth_getTransactionCount',
    params: 2,
    inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
    outputFormatter: utils.toDecimal
});

var sendTransaction = new Method({
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    params: 1,
    inputFormatter: [formatters.inputTransactionFormatter]
});

var call = new Method({
    name: 'call',
    call: 'eth_call',
    params: 2,
    inputFormatter: [formatters.inputTransactionFormatter, formatters.inputDefaultBlockNumberFormatter]
});

var estimateGas = new Method({
    name: 'estimateGas',
    call: 'eth_estimateGas',
    params: 1,
    inputFormatter: [formatters.inputTransactionFormatter],
    outputFormatter: utils.toDecimal
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

var methods = [
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
    getTransactionCount,
    call,
    estimateGas,
    sendTransaction,
    compileSolidity,
    compileLLL,
    compileSerpent,
    submitWork,
    getWork
];

/// @returns an array of objects describing web3.eth api properties



var properties = [
    new Property({
        name: 'coinbase',
        getter: 'eth_coinbase'
    }),
    new Property({
        name: 'mining',
        getter: 'eth_mining'
    }),
    new Property({
        name: 'hashrate',
        getter: 'eth_hashrate',
        outputFormatter: utils.toDecimal
    }),
    new Property({
        name: 'gasPrice',
        getter: 'eth_gasPrice',
        outputFormatter: formatters.outputBigNumberFormatter
    }),
    new Property({
        name: 'accounts',
        getter: 'eth_accounts'
    }),
    new Property({
        name: 'blockNumber',
        getter: 'eth_blockNumber',
        outputFormatter: utils.toDecimal
    })
];

module.exports = {
    methods: methods,
    properties: properties
};


},{"../utils/utils":7,"./formatters":17,"./method":22,"./property":25}],15:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file event.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var web3 = require('../web3');
var formatters = require('./formatters');
var sha3 = require('../utils/sha3');

/**
 * This prototype should be used to create event filters
 */
var SolidityEvent = function (json, address) {
    this._params = json.inputs;
    this._name = utils.transformToFullName(json);
    this._address = address;
    this._anonymous = json.anonymous;
};

/**
 * Should be used to get filtered param types
 *
 * @method types
 * @param {Bool} decide if returned typed should be indexed
 * @return {Array} array of types
 */
SolidityEvent.prototype.types = function (indexed) {
    return this._params.filter(function (i) {
        return i.indexed === indexed;
    }).map(function (i) {
        return i.type;
    });
};

/**
 * Should be used to get event display name
 *
 * @method displayName
 * @return {String} event display name
 */
SolidityEvent.prototype.displayName = function () {
    return utils.extractDisplayName(this._name);
};

/**
 * Should be used to get event type name
 *
 * @method typeName
 * @return {String} event type name
 */
SolidityEvent.prototype.typeName = function () {
    return utils.extractTypeName(this._name);
};

/**
 * Should be used to get event signature
 *
 * @method signature
 * @return {String} event signature
 */
SolidityEvent.prototype.signature = function () {
    return sha3(this._name);
};

/**
 * Should be used to encode indexed params and options to one final object
 * 
 * @method encode
 * @param {Object} indexed
 * @param {Object} options
 * @return {Object} everything combined together and encoded
 */
SolidityEvent.prototype.encode = function (indexed, options) {
    indexed = indexed || {};
    options = options || {};
    var result = {};

    ['fromBlock', 'toBlock'].filter(function (f) {
        return options[f] !== undefined;
    }).forEach(function (f) {
        result[f] = formatters.inputBlockNumberFormatter(options[f]);
    });

    result.topics = [];

    if (!this._anonymous) {
        result.address = this._address;
        result.topics.push('0x' + this.signature());
    }

    var indexedTopics = this._params.filter(function (i) {
        return i.indexed === true;
    }).map(function (i) {
        var value = indexed[i.name];
        if (value === undefined || value === null) {
            return null;
        }
        
        if (utils.isArray(value)) {
            return value.map(function (v) {
                return '0x' + coder.encodeParam(i.type, v);
            });
        }
        return '0x' + coder.encodeParam(i.type, value);
    });

    result.topics = result.topics.concat(indexedTopics);

    return result;
};

/**
 * Should be used to decode indexed params and options
 *
 * @method decode
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
SolidityEvent.prototype.decode = function (data) {
 
    data.data = data.data || '';
    data.topics = data.topics || [];

    var argTopics = this._anonymous ? data.topics : data.topics.slice(1);
    var indexedData = argTopics.map(function (topics) { return topics.slice(2); }).join("");
    var indexedParams = coder.decodeParams(this.types(true), indexedData); 

    var notIndexedData = data.data.slice(2);
    var notIndexedParams = coder.decodeParams(this.types(false), notIndexedData);
    
    var result = formatters.outputLogFormatter(data);
    result.event = this.displayName();
    result.address = data.address;

    result.args = this._params.reduce(function (acc, current) {
        acc[current.name] = current.indexed ? indexedParams.shift() : notIndexedParams.shift();
        return acc;
    }, {});

    delete result.data;
    delete result.topics;

    return result;
};

/**
 * Should be used to create new filter object from event
 *
 * @method execute
 * @param {Object} indexed
 * @param {Object} options
 * @return {Object} filter object
 */
SolidityEvent.prototype.execute = function (indexed, options) {
    var o = this.encode(indexed, options);
    var formatter = this.decode.bind(this);
    return web3.eth.filter(o, undefined, undefined, formatter);
};

/**
 * Should be used to attach event to contract object
 *
 * @method attachToContract
 * @param {Contract}
 */
SolidityEvent.prototype.attachToContract = function (contract) {
    var execute = this.execute.bind(this);
    var displayName = this.displayName();
    if (!contract[displayName]) {
        contract[displayName] = execute;
    }
    contract[displayName][this.typeName()] = this.execute.bind(this, contract);
};

module.exports = SolidityEvent;


},{"../solidity/coder":1,"../utils/sha3":6,"../utils/utils":7,"../web3":9,"./formatters":17}],16:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file filter.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var RequestManager = require('./requestmanager');
var formatters = require('./formatters');
var utils = require('../utils/utils');

/**
* Converts a given topic to a hex string, but also allows null values.
*
* @param {Mixed} value
* @return {String}
*/
var toTopic = function(value){

    if(value === null || typeof value === 'undefined')
        return null;

    value = String(value);

    if(value.indexOf('0x') === 0)
        return value;
    else
        return utils.fromAscii(value);
};

/// This method should be called on options object, to verify deprecated properties && lazy load dynamic ones
/// @param should be string or object
/// @returns options string or object
var getOptions = function (options) {

    if (utils.isString(options)) {
        return options;
    } 

    options = options || {};

    // make sure topics, get converted to hex
    options.topics = options.topics || [];
    options.topics = options.topics.map(function(topic){
        return (utils.isArray(topic)) ? topic.map(toTopic) : toTopic(topic);
    });

    // lazy load
    return {
        topics: options.topics,
        to: options.to,
        address: options.address,
        fromBlock: formatters.inputBlockNumberFormatter(options.fromBlock),
        toBlock: formatters.inputBlockNumberFormatter(options.toBlock) 
    }; 
};

/**
Adds the callback and sets up the methods, to iterate over the results.

@method getLogsAtStart
@param {Object} self
@param {funciton} 
*/
var getLogsAtStart = function(self, callback){
    // call getFilterLogs for the first watch callback start
    if (!utils.isString(self.options)) {
        self.get(function (err, messages) {
            // don't send all the responses to all the watches again... just to self one
            if (err) {
                callback(err);
            }

            messages.forEach(function (message) {
                callback(null, message);
            });
        });
    }
};

/**
Adds the callback and sets up the methods, to iterate over the results.

@method pollFilter
@param {Object} self
*/
var pollFilter = function(self) {

    var onMessage = function (error, messages) {
        if (error) {
            return self.callbacks.forEach(function (callback) {
                callback(error);
            });
        }

        messages.forEach(function (message) {
            message = self.formatter ? self.formatter(message) : message;
            self.callbacks.forEach(function (callback) {
                callback(null, message);
            });
        });
    };

    RequestManager.getInstance().startPolling({
        method: self.implementation.poll.call,
        params: [self.filterId],
    }, self.filterId, onMessage, self.stopWatching.bind(self));

};

var Filter = function (options, methods, formatter) {
    var self = this;
    var implementation = {};
    methods.forEach(function (method) {
        method.attachToObject(implementation);
    });
    this.options = getOptions(options);
    this.implementation = implementation;
    this.callbacks = [];
    this.pollFilters = [];
    this.formatter = formatter;
    this.implementation.newFilter(this.options, function(error, id){
        if(error) {
            self.callbacks.forEach(function(callback){
                callback(error);
            });
        } else {
            self.filterId = id;
            // get filter logs at start
            self.callbacks.forEach(function(callback){
                getLogsAtStart(self, callback);
            });
            pollFilter(self);
        }
    });
};

Filter.prototype.watch = function (callback) {
    this.callbacks.push(callback);

    if(this.filterId) {
        getLogsAtStart(this, callback);
        pollFilter(this);
    }

    return this;
};

Filter.prototype.stopWatching = function () {
    RequestManager.getInstance().stopPolling(this.filterId);
    // remove filter async
    this.implementation.uninstallFilter(this.filterId, function(){});
    this.callbacks = [];
};

Filter.prototype.get = function (callback) {
    var self = this;
    if (utils.isFunction(callback)) {
        this.implementation.getLogs(this.filterId, function(err, res){
            if (err) {
                callback(err);
            } else {
                callback(null, res.map(function (log) {
                    return self.formatter ? self.formatter(log) : log;
                }));
            }
        });
    } else {
        var logs = this.implementation.getLogs(this.filterId);
        return logs.map(function (log) {
            return self.formatter ? self.formatter(log) : log;
        });
    }

    return this;
};

module.exports = Filter;


},{"../utils/utils":7,"./formatters":17,"./requestmanager":27}],17:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');
var config = require('../utils/config');

/**
 * Should the format output to a big number
 *
 * @method outputBigNumberFormatter
 * @param {String|Number|BigNumber}
 * @returns {BigNumber} object
 */
var outputBigNumberFormatter = function (number) {
    return utils.toBigNumber(number);
};

var isPredefinedBlockNumber = function (blockNumber) {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
};

var inputDefaultBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined) {
        return config.defaultBlock;
    }
    return inputBlockNumberFormatter(blockNumber);
};

var inputBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined) {
        return undefined;
    } else if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }
    return utils.toHex(blockNumber);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 * @param {Object} transaction options
 * @returns object
*/
var inputTransactionFormatter = function (options){

    options.from = options.from || config.defaultAccount;

    // make code -> data
    if (options.code) {
        options.data = options.code;
        delete options.code;
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = utils.fromDecimal(options[key]);
    });

    return options; 
};

/**
 * Formats the output of a transaction to its proper values
 * 
 * @method outputTransactionFormatter
 * @param {Object} transaction
 * @returns {Object} transaction
*/
var outputTransactionFormatter = function (tx){
    if(tx.blockNumber !== null)
        tx.blockNumber = utils.toDecimal(tx.blockNumber);
    if(tx.transactionIndex !== null)
        tx.transactionIndex = utils.toDecimal(tx.transactionIndex);
    tx.nonce = utils.toDecimal(tx.nonce);
    tx.gas = utils.toDecimal(tx.gas);
    tx.gasPrice = utils.toBigNumber(tx.gasPrice);
    tx.value = utils.toBigNumber(tx.value);
    return tx;
};

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 * @param {Object} block object 
 * @returns {Object} block object
*/
var outputBlockFormatter = function(block) {

    // transform to number
    block.gasLimit = utils.toDecimal(block.gasLimit);
    block.gasUsed = utils.toDecimal(block.gasUsed);
    block.size = utils.toDecimal(block.size);
    block.timestamp = utils.toDecimal(block.timestamp);
    if(block.number !== null)
        block.number = utils.toDecimal(block.number);

    block.difficulty = utils.toBigNumber(block.difficulty);
    block.totalDifficulty = utils.toBigNumber(block.totalDifficulty);

    if (utils.isArray(block.transactions)) {
        block.transactions.forEach(function(item){
            if(!utils.isString(item))
                return outputTransactionFormatter(item);
        });
    }

    return block;
};

/**
 * Formats the output of a log
 * 
 * @method outputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
*/
var outputLogFormatter = function(log) {
    if (log === null) { // 'pending' && 'latest' filters are nulls
        return null;
    }

    if(log.blockNumber !== null)
        log.blockNumber = utils.toDecimal(log.blockNumber);
    if(log.transactionIndex !== null)
        log.transactionIndex = utils.toDecimal(log.transactionIndex);
    if(log.logIndex !== null)
        log.logIndex = utils.toDecimal(log.logIndex);

    return log;
};

/**
 * Formats the input of a whisper post and converts all values to HEX
 *
 * @method inputPostFormatter
 * @param {Object} transaction object
 * @returns {Object}
*/
var inputPostFormatter = function(post) {

    post.payload = utils.toHex(post.payload);
    post.ttl = utils.fromDecimal(post.ttl);
    post.workToProve = utils.fromDecimal(post.workToProve);
    post.priority = utils.fromDecimal(post.priority);

    // fallback
    if (!utils.isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map(function(topic){
        return utils.fromAscii(topic);
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
var outputPostFormatter = function(post){

    post.expiry = utils.toDecimal(post.expiry);
    post.sent = utils.toDecimal(post.sent);
    post.ttl = utils.toDecimal(post.ttl);
    post.workProved = utils.toDecimal(post.workProved);
    post.payloadRaw = post.payload;
    post.payload = utils.toAscii(post.payload);

    if (utils.isJson(post.payload)) {
        post.payload = JSON.parse(post.payload);
    }

    // format the following options
    if (!post.topics) {
        post.topics = [];
    }
    post.topics = post.topics.map(function(topic){
        return utils.toAscii(topic);
    });

    return post;
};

module.exports = {
    inputDefaultBlockNumberFormatter: inputDefaultBlockNumberFormatter,
    inputBlockNumberFormatter: inputBlockNumberFormatter,
    inputTransactionFormatter: inputTransactionFormatter,
    inputPostFormatter: inputPostFormatter,
    outputBigNumberFormatter: outputBigNumberFormatter,
    outputTransactionFormatter: outputTransactionFormatter,
    outputBlockFormatter: outputBlockFormatter,
    outputLogFormatter: outputLogFormatter,
    outputPostFormatter: outputPostFormatter
};


},{"../utils/config":5,"../utils/utils":7}],18:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file function.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var web3 = require('../web3');
var coder = require('../solidity/coder');
var utils = require('../utils/utils');
var formatters = require('./formatters');
var sha3 = require('../utils/sha3');

/**
 * This prototype should be used to call/sendTransaction to solidity functions
 */
var SolidityFunction = function (json, address) {
    this._inputTypes = json.inputs.map(function (i) {
        return i.type;
    });
    this._outputTypes = json.outputs.map(function (i) {
        return i.type;
    });
    this._constant = json.constant;
    this._name = utils.transformToFullName(json);
    this._address = address;
};

SolidityFunction.prototype.extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

SolidityFunction.prototype.extractDefaultBlock = function (args) {
    if (args.length > this._inputTypes.length && !utils.isObject(args[args.length -1])) {
        return formatters.inputDefaultBlockNumberFormatter(args.pop()); // modify the args array!
    }
};

/**
 * Should be used to create payload from arguments
 *
 * @method toPayload
 * @param {Array} solidity function params
 * @param {Object} optional payload options
 */
SolidityFunction.prototype.toPayload = function (args) {
    var options = {};
    if (args.length > this._inputTypes.length && utils.isObject(args[args.length -1])) {
        options = args[args.length - 1];
    }
    options.to = this._address;
    options.data = '0x' + this.signature() + coder.encodeParams(this._inputTypes, args);
    return options;
};

/**
 * Should be used to get function signature
 *
 * @method signature
 * @return {String} function signature
 */
SolidityFunction.prototype.signature = function () {
    return sha3(this._name).slice(0, 8);
};


SolidityFunction.prototype.unpackOutput = function (output) {
    if (!output) {
        return;
    }

    output = output.length >= 2 ? output.slice(2) : output;
    var result = coder.decodeParams(this._outputTypes, output);
    return result.length === 1 ? result[0] : result;
};

/**
 * Calls a contract function.
 *
 * @method call
 * @param {...Object} Contract function arguments
 * @param {function} If the last argument is a function, the contract function
 *   call will be asynchronous, and the callback will be passed the
 *   error and result.
 * @return {String} output bytes
 */
SolidityFunction.prototype.call = function () {
    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
    var callback = this.extractCallback(args);
    var defaultBlock = this.extractDefaultBlock(args);
    var payload = this.toPayload(args);


    if (!callback) {
        var output = web3.eth.call(payload, defaultBlock);
        return this.unpackOutput(output);
    } 
        
    var self = this;
    web3.eth.call(payload, defaultBlock, function (error, output) {
        callback(error, self.unpackOutput(output));
    });
};

/**
 * Should be used to sendTransaction to solidity function
 *
 * @method sendTransaction
 * @param {Object} options
 */
SolidityFunction.prototype.sendTransaction = function () {
    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
    var callback = this.extractCallback(args);
    var payload = this.toPayload(args);

    if (!callback) {
        return web3.eth.sendTransaction(payload);
    }

    web3.eth.sendTransaction(payload, callback);
};

/**
 * Should be used to estimateGas of solidity function
 *
 * @method estimateGas
 * @param {Object} options
 */
SolidityFunction.prototype.estimateGas = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = this.extractCallback(args);
    var payload = this.toPayload(args);

    if (!callback) {
        return web3.eth.estimateGas(payload);
    }

    web3.eth.estimateGas(payload, callback);
};

/**
 * Should be used to get function display name
 *
 * @method displayName
 * @return {String} display name of the function
 */
SolidityFunction.prototype.displayName = function () {
    return utils.extractDisplayName(this._name);
};

/**
 * Should be used to get function type name
 *
 * @method typeName
 * @return {String} type name of the function
 */
SolidityFunction.prototype.typeName = function () {
    return utils.extractTypeName(this._name);
};

/**
 * Should be called to get rpc requests from solidity function
 *
 * @method request
 * @returns {Object}
 */
SolidityFunction.prototype.request = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = this.extractCallback(args);
    var payload = this.toPayload(args);
    var format = this.unpackOutput.bind(this);
    
    return {
        callback: callback,
        payload: payload, 
        format: format
    };
};

/**
 * Should be called to execute function
 *
 * @method execute
 */
SolidityFunction.prototype.execute = function () {
    var transaction = !this._constant;

    // send transaction
    if (transaction) {
        return this.sendTransaction.apply(this, Array.prototype.slice.call(arguments));
    }

    // call
    return this.call.apply(this, Array.prototype.slice.call(arguments));
};

/**
 * Should be called to attach function to contract
 *
 * @method attachToContract
 * @param {Contract}
 */
SolidityFunction.prototype.attachToContract = function (contract) {
    var execute = this.execute.bind(this);
    execute.request = this.request.bind(this);
    execute.call = this.call.bind(this);
    execute.sendTransaction = this.sendTransaction.bind(this);
    execute.estimateGas = this.estimateGas.bind(this);
    var displayName = this.displayName();
    if (!contract[displayName]) {
        contract[displayName] = execute;
    }
    contract[displayName][this.typeName()] = execute; // circular!!!!
};

module.exports = SolidityFunction;


},{"../solidity/coder":1,"../utils/sha3":6,"../utils/utils":7,"../web3":9,"./formatters":17}],19:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2014
 */

"use strict";

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; // jshint ignore:line
var errors = require('./errors');

var HttpProvider = function (host) {
    this.host = host || 'http://localhost:8545';
};

HttpProvider.prototype.send = function (payload) {
    var request = new XMLHttpRequest();

    request.open('POST', this.host, false);
    request.setRequestHeader('Content-type','application/json');
    
    try {
        request.send(JSON.stringify(payload));
    } catch(error) {
        throw errors.InvalidConnection(this.host);
    }


    // check request.status
    // TODO: throw an error here! it cannot silently fail!!!
    //if (request.status !== 200) {
        //return;
    //}

    var result = request.responseText;

    try {
        result = JSON.parse(result);
    } catch(e) {
        throw errors.InvalidResponse(result);                
    }

    return result;
};

HttpProvider.prototype.sendAsync = function (payload, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            var result = request.responseText;
            var error = null;

            try {
                result = JSON.parse(result);
            } catch(e) {
                error = errors.InvalidResponse(result);                
            }

            callback(error, result);
        }
    };

    request.open('POST', this.host, true);
    request.setRequestHeader('Content-type','application/json');
    
    try {
        request.send(JSON.stringify(payload));
    } catch(error) {
        callback(errors.InvalidConnection(this.host));
    }
};

module.exports = HttpProvider;


},{"./errors":13,"xmlhttprequest":4}],20:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file icap.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');

/**
 * This prototype should be used to extract necessary information from iban address
 *
 * @param {String} iban
 */
var ICAP = function (iban) {
    this._iban = iban;
};

/**
 * Should be called to check if icap is correct
 *
 * @method isValid
 * @returns {Boolean} true if it is, otherwise false
 */
ICAP.prototype.isValid = function () {
    return utils.isIBAN(this._iban);
};

/**
 * Should be called to check if iban number is direct
 *
 * @method isDirect
 * @returns {Boolean} true if it is, otherwise false
 */
ICAP.prototype.isDirect = function () {
    return this._iban.length === 34;
};

/**
 * Should be called to check if iban number if indirect
 *
 * @method isIndirect
 * @returns {Boolean} true if it is, otherwise false
 */
ICAP.prototype.isIndirect = function () {
    return this._iban.length === 20;
};

/**
 * Should be called to get iban checksum
 * Uses the mod-97-10 checksumming protocol (ISO/IEC 7064:2003)
 *
 * @method checksum
 * @returns {String} checksum
 */
ICAP.prototype.checksum = function () {
    return this._iban.substr(2, 2);
};

/**
 * Should be called to get institution identifier
 * eg. XREG
 *
 * @method institution
 * @returns {String} institution identifier
 */
ICAP.prototype.institution = function () {
    return this.isIndirect() ? this._iban.substr(7, 4) : '';
};

/**
 * Should be called to get client identifier within institution
 * eg. GAVOFYORK
 *
 * @method client
 * @returns {String} client identifier
 */
ICAP.prototype.client = function () {
    return this.isIndirect() ? this._iban.substr(11) : '';
};

/**
 * Should be called to get client direct address
 *
 * @method address
 * @returns {String} client direct address
 */
ICAP.prototype.address = function () {
    return this.isDirect() ? this._iban.substr(4) : '';
};

module.exports = ICAP;


},{"../utils/utils":7}],21:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file jsonrpc.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Jsonrpc = function () {
    // singleton pattern
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    arguments.callee._singletonInstance = this;

    this.messageId = 1;
};

/**
 * @return {Jsonrpc} singleton
 */
Jsonrpc.getInstance = function () {
    var instance = new Jsonrpc();
    return instance;
};

/**
 * Should be called to valid json create payload object
 *
 * @method toPayload
 * @param {Function} method of jsonrpc call, required
 * @param {Array} params, an array of method params, optional
 * @returns {Object} valid jsonrpc payload object
 */
Jsonrpc.prototype.toPayload = function (method, params) {
    if (!method)
        console.error('jsonrpc method should be specified!');

    return {
        jsonrpc: '2.0',
        method: method,
        params: params || [],
        id: this.messageId++
    };
};

/**
 * Should be called to check if jsonrpc response is valid
 *
 * @method isValidResponse
 * @param {Object}
 * @returns {Boolean} true if response is valid, otherwise false
 */
Jsonrpc.prototype.isValidResponse = function (response) {
    return !!response &&
        !response.error &&
        response.jsonrpc === '2.0' &&
        typeof response.id === 'number' &&
        response.result !== undefined; // only undefined is not valid json object
};

/**
 * Should be called to create batch payload object
 *
 * @method toBatchPayload
 * @param {Array} messages, an array of objects with method (required) and params (optional) fields
 * @returns {Array} batch payload
 */
Jsonrpc.prototype.toBatchPayload = function (messages) {
    var self = this;
    return messages.map(function (message) {
        return self.toPayload(message.method, message.params);
    });
};

module.exports = Jsonrpc;


},{}],22:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file method.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var RequestManager = require('./requestmanager');
var utils = require('../utils/utils');
var errors = require('./errors');

var Method = function (options) {
    this.name = options.name;
    this.call = options.call;
    this.params = options.params || 0;
    this.inputFormatter = options.inputFormatter;
    this.outputFormatter = options.outputFormatter;
};

/**
 * Should be used to determine name of the jsonrpc method based on arguments
 *
 * @method getCall
 * @param {Array} arguments
 * @return {String} name of jsonrpc method
 */
Method.prototype.getCall = function (args) {
    return utils.isFunction(this.call) ? this.call(args) : this.call;
};

/**
 * Should be used to extract callback from array of arguments. Modifies input param
 *
 * @method extractCallback
 * @param {Array} arguments
 * @return {Function|Null} callback, if exists
 */
Method.prototype.extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

/**
 * Should be called to check if the number of arguments is correct
 * 
 * @method validateArgs
 * @param {Array} arguments
 * @throws {Error} if it is not
 */
Method.prototype.validateArgs = function (args) {
    if (args.length !== this.params) {
        throw errors.InvalidNumberOfParams();
    }
};

/**
 * Should be called to format input args of method
 * 
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */
Method.prototype.formatInput = function (args) {
    if (!this.inputFormatter) {
        return args;
    }

    return this.inputFormatter.map(function (formatter, index) {
        return formatter ? formatter(args[index]) : args[index];
    });
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */
Method.prototype.formatOutput = function (result) {
    return this.outputFormatter && result !== null ? this.outputFormatter(result) : result;
};

/**
 * Should attach function to method
 * 
 * @method attachToObject
 * @param {Object}
 * @param {Function}
 */
Method.prototype.attachToObject = function (obj) {
    var func = this.send.bind(this);
    func.request = this.request.bind(this);
    func.call = this.call; // that's ugly. filter.js uses it
    var name = this.name.split('.');
    if (name.length > 1) {
        obj[name[0]] = obj[name[0]] || {};
        obj[name[0]][name[1]] = func;
    } else {
        obj[name[0]] = func; 
    }
};

/**
 * Should create payload from given input args
 *
 * @method toPayload
 * @param {Array} args
 * @return {Object}
 */
Method.prototype.toPayload = function (args) {
    var call = this.getCall(args);
    var callback = this.extractCallback(args);
    var params = this.formatInput(args);
    this.validateArgs(params);

    return {
        method: call,
        params: params,
        callback: callback
    };
};

/**
 * Should be called to create pure JSONRPC request which can be used in batch request
 *
 * @method request
 * @param {...} params
 * @return {Object} jsonrpc request
 */
Method.prototype.request = function () {
    var payload = this.toPayload(Array.prototype.slice.call(arguments));
    payload.format = this.formatOutput.bind(this);
    return payload;
};

/**
 * Should send request to the API
 *
 * @method send
 * @param list of params
 * @return result
 */
Method.prototype.send = function () {
    var payload = this.toPayload(Array.prototype.slice.call(arguments));
    if (payload.callback) {
        var self = this;
        return RequestManager.getInstance().sendAsync(payload, function (err, result) {
            payload.callback(err, self.formatOutput(result));
        });
    }
    return this.formatOutput(RequestManager.getInstance().send(payload));
};

module.exports = Method;


},{"../utils/utils":7,"./errors":13,"./requestmanager":27}],23:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file namereg.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var contract = require('./contract');

var address = '0xc6d9d2cd449a754c494264e1809c50e34d64562b';

var abi = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"name","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"subRegistrar","outputs":[{"name":"o_subRegistrar","type":"address"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_registrar","type":"address"}],"name":"setSubRegistrar","outputs":[],"type":"function"},
    {"constant":false,"inputs":[],"name":"Registrar","outputs":[],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"},{"name":"_primary","type":"bool"}],"name":"setAddress","outputs":[],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_content","type":"bytes32"}],"name":"setContent","outputs":[],"type":"function"},
    {"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"disown","outputs":[],"type":"function"},
    {"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"register","outputs":[{"name":"","type":"address"}],"type":"function"},
    {"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"}],"name":"PrimaryChanged","type":"event"}
];

module.exports = contract(abi).at(address);


},{"./contract":11}],24:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file eth.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');
var Property = require('./property');

/// @returns an array of objects describing web3.eth api methods
var methods = [
];

/// @returns an array of objects describing web3.eth api properties
var properties = [
    new Property({
        name: 'listening',
        getter: 'net_listening'
    }),
    new Property({
        name: 'peerCount',
        getter: 'net_peerCount',
        outputFormatter: utils.toDecimal
    })
];


module.exports = {
    methods: methods,
    properties: properties
};


},{"../utils/utils":7,"./property":25}],25:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file property.js
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var RequestManager = require('./requestmanager');

var Property = function (options) {
    this.name = options.name;
    this.getter = options.getter;
    this.setter = options.setter;
    this.outputFormatter = options.outputFormatter;
    this.inputFormatter = options.inputFormatter;
};

/**
 * Should be called to format input args of method
 * 
 * @method formatInput
 * @param {Array}
 * @return {Array}
 */
Property.prototype.formatInput = function (arg) {
    return this.inputFormatter ? this.inputFormatter(arg) : arg;
};

/**
 * Should be called to format output(result) of method
 *
 * @method formatOutput
 * @param {Object}
 * @return {Object}
 */
Property.prototype.formatOutput = function (result) {
    return this.outputFormatter && result !== null ? this.outputFormatter(result) : result;
};

/**
 * Should attach function to method
 * 
 * @method attachToObject
 * @param {Object}
 * @param {Function}
 */
Property.prototype.attachToObject = function (obj) {
    var proto = {
        get: this.get.bind(this),
    };

    var names = this.name.split('.');
    var name = names[0];
    if (names.length > 1) {
        obj[names[0]] = obj[names[0]] || {};
        obj = obj[names[0]];
        name = names[1];
    }
    
    Object.defineProperty(obj, name, proto);

    var toAsyncName = function (prefix, name) {
        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
    };

    obj[toAsyncName('get', name)] = this.getAsync.bind(this);
};

/**
 * Should be used to get value of the property
 *
 * @method get
 * @return {Object} value of the property
 */
Property.prototype.get = function () {
    return this.formatOutput(RequestManager.getInstance().send({
        method: this.getter
    }));
};

/**
 * Should be used to asynchrounously get value of property
 *
 * @method getAsync
 * @param {Function}
 */
Property.prototype.getAsync = function (callback) {
    var self = this;
    RequestManager.getInstance().sendAsync({
        method: this.getter
    }, function (err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, self.formatOutput(result));
    });
};

module.exports = Property;


},{"./requestmanager":27}],26:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file qtsync.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 * @date 2014
 */

var QtSyncProvider = function () {
};

QtSyncProvider.prototype.send = function (payload) {
    var result = navigator.qt.callMethod(JSON.stringify(payload));
    return JSON.parse(result);
};

module.exports = QtSyncProvider;


},{}],27:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file requestmanager.js
 * @author Jeffrey Wilcke <jeff@ethdev.com>
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Marian Oancea <marian@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @author Gav Wood <g@ethdev.com>
 * @date 2014
 */

var Jsonrpc = require('./jsonrpc');
var utils = require('../utils/utils');
var c = require('../utils/config');
var errors = require('./errors');

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 * Singleton
 */
var RequestManager = function (provider) {
    // singleton pattern
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    arguments.callee._singletonInstance = this;

    this.provider = provider;
    this.polls = {};
    this.timeout = null;
    this.poll();
};

/**
 * @return {RequestManager} singleton
 */
RequestManager.getInstance = function () {
    var instance = new RequestManager();
    return instance;
};

/**
 * Should be used to synchronously send request
 *
 * @method send
 * @param {Object} data
 * @return {Object}
 */
RequestManager.prototype.send = function (data) {
    if (!this.provider) {
        console.error(errors.InvalidProvider());
        return null;
    }

    var payload = Jsonrpc.getInstance().toPayload(data.method, data.params);
    var result = this.provider.send(payload);

    if (!Jsonrpc.getInstance().isValidResponse(result)) {
        throw errors.InvalidResponse(result);
    }

    return result.result;
};

/**
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object} data
 * @param {Function} callback
 */
RequestManager.prototype.sendAsync = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.getInstance().toPayload(data.method, data.params);
    this.provider.sendAsync(payload, function (err, result) {
        if (err) {
            return callback(err);
        }
        
        if (!Jsonrpc.getInstance().isValidResponse(result)) {
            return callback(errors.InvalidResponse(result));
        }

        callback(null, result.result);
    });
};

/**
 * Should be called to asynchronously send batch request
 *
 * @method sendBatch
 * @param {Array} batch data
 * @param {Function} callback
 */
RequestManager.prototype.sendBatch = function (data, callback) {
    if (!this.provider) {
        return callback(errors.InvalidProvider());
    }

    var payload = Jsonrpc.getInstance().toBatchPayload(data);

    this.provider.sendAsync(payload, function (err, results) {
        if (err) {
            return callback(err);
        }

        if (!utils.isArray(results)) {
            return callback(errors.InvalidResponse(results));
        }

        callback(err, results);
    }); 
};

/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 * @param {Object}
 */
RequestManager.prototype.setProvider = function (p) {
    this.provider = p;
};

/*jshint maxparams:4 */

/**
 * Should be used to start polling
 *
 * @method startPolling
 * @param {Object} data
 * @param {Number} pollId
 * @param {Function} callback
 * @param {Function} uninstall
 *
 * @todo cleanup number of params
 */
RequestManager.prototype.startPolling = function (data, pollId, callback, uninstall) {
    this.polls['poll_'+ pollId] = {data: data, id: pollId, callback: callback, uninstall: uninstall};
};
/*jshint maxparams:3 */

/**
 * Should be used to stop polling for filter with given id
 *
 * @method stopPolling
 * @param {Number} pollId
 */
RequestManager.prototype.stopPolling = function (pollId) {
    delete this.polls['poll_'+ pollId];
};

/**
 * Should be called to reset the polling mechanism of the request manager
 *
 * @method reset
 */
RequestManager.prototype.reset = function () {
    for (var key in this.polls) {
        if (this.polls.hasOwnProperty(key)) {
            this.polls[key].uninstall();
        }
    }
    this.polls = {};

    if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    this.poll();
};

/**
 * Should be called to poll for changes on filter with given id
 *
 * @method poll
 */
RequestManager.prototype.poll = function () {
    /*jshint maxcomplexity: 6 */
    this.timeout = setTimeout(this.poll.bind(this), c.ETH_POLLING_TIMEOUT);

    if (this.polls === {}) {
        return;
    }

    if (!this.provider) {
        console.error(errors.InvalidProvider());
        return;
    }

    var pollsData = [];
    var pollsKeys = [];
    for (var key in this.polls) {
        if (this.polls.hasOwnProperty(key)) {
            pollsData.push(this.polls[key].data);
            pollsKeys.push(key);
        }
    }

    if (pollsData.length === 0) {
        return;
    }

    var payload = Jsonrpc.getInstance().toBatchPayload(pollsData);

    var self = this;
    this.provider.sendAsync(payload, function (error, results) {
        // TODO: console log?
        if (error) {
            return;
        }

        if (!utils.isArray(results)) {
            throw errors.InvalidResponse(results);
        }

        results.map(function (result, index) {
            var key = pollsKeys[index];
            // make sure the filter is still installed after arrival of the request
            if(self.polls[key]) {
                result.callback = self.polls[key].callback;
                return result;
            } else
                return false;
        }).filter(function (result) {
            return (!result) ? false : true;
        }).filter(function (result) {
            var valid = Jsonrpc.getInstance().isValidResponse(result);
            if (!valid) {
                result.callback(errors.InvalidResponse(result));
            }
            return valid;
        }).filter(function (result) {
            return utils.isArray(result.result) && result.result.length > 0;
        }).forEach(function (result) {
            result.callback(null, result.result);
        });
    });
};

module.exports = RequestManager;


},{"../utils/config":5,"../utils/utils":7,"./errors":13,"./jsonrpc":21}],28:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file shh.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Method = require('./method');
var formatters = require('./formatters');

var post = new Method({
    name: 'post', 
    call: 'shh_post', 
    params: 1,
    inputFormatter: [formatters.inputPostFormatter]
});

var newIdentity = new Method({
    name: 'newIdentity',
    call: 'shh_newIdentity',
    params: 0
});

var hasIdentity = new Method({
    name: 'hasIdentity',
    call: 'shh_hasIdentity',
    params: 1
});

var newGroup = new Method({
    name: 'newGroup',
    call: 'shh_newGroup',
    params: 0
});

var addToGroup = new Method({
    name: 'addToGroup',
    call: 'shh_addToGroup',
    params: 0
});

var methods = [
    post,
    newIdentity,
    hasIdentity,
    newGroup,
    addToGroup
];

module.exports = {
    methods: methods
};


},{"./formatters":17,"./method":22}],29:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file transfer.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var web3 = require('../web3');
var ICAP = require('./icap');
var namereg = require('./namereg');
var contract = require('./contract');

/**
 * Should be used to make ICAP transfer
 *
 * @method transfer
 * @param {String} iban number
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transfer = function (from, iban, value, callback) {
    var icap = new ICAP(iban); 
    if (!icap.isValid()) {
        throw new Error('invalid iban address');
    }

    if (icap.isDirect()) {
        return transferToAddress(from, icap.address(), value, callback);
    }
    
    if (!callback) {
        var address = namereg.addr(icap.institution());
        return deposit(from, address, value, icap.client());
    }

    namereg.addr(icap.insitution(), function (err, address) {
        return deposit(from, address, value, icap.client(), callback);
    });
    
};

/**
 * Should be used to transfer funds to certain address
 *
 * @method transferToAddress
 * @param {String} address
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {Function} callback, callback
 */
var transferToAddress = function (from, address, value, callback) {
    return web3.eth.sendTransaction({
        address: address,
        from: from,
        value: value
    }, callback);
};

/**
 * Should be used to deposit funds to generic Exchange contract (must implement deposit(bytes32) method!)
 *
 * @method deposit
 * @param {String} address
 * @param {String} from (address)
 * @param {Value} value to be tranfered
 * @param {String} client unique identifier
 * @param {Function} callback, callback
 */
var deposit = function (from, address, value, client, callback) {
    var abi = [{"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"deposit","outputs":[],"type":"function"}];
    return contract(abi).at(address).deposit(client, {
        from: from,
        value: value
    }, callback);
};

module.exports = transfer;


},{"../web3":9,"./contract":11,"./icap":20,"./namereg":23}],30:[function(require,module,exports){
/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** @file watches.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var Method = require('./method');

/// @returns an array of objects describing web3.eth.filter api methods
var eth = function () {
    var newFilterCall = function (args) {
        var type = args[0];

        switch(type) {
            case 'latest':
                args.shift();
                this.params = 0;
                return 'eth_newBlockFilter';
            case 'pending':
                args.shift();
                this.params = 0;
                return 'eth_newPendingTransactionFilter';
            default:
                return 'eth_newFilter';
        }
    };

    var newFilter = new Method({
        name: 'newFilter',
        call: newFilterCall,
        params: 1
    });

    var uninstallFilter = new Method({
        name: 'uninstallFilter',
        call: 'eth_uninstallFilter',
        params: 1
    });

    var getLogs = new Method({
        name: 'getLogs',
        call: 'eth_getFilterLogs',
        params: 1
    });

    var poll = new Method({
        name: 'poll',
        call: 'eth_getFilterChanges',
        params: 1
    });

    return [
        newFilter,
        uninstallFilter,
        getLogs,
        poll
    ];
};

/// @returns an array of objects describing web3.shh.watch api methods
var shh = function () {
    var newFilter = new Method({
        name: 'newFilter',
        call: 'shh_newFilter',
        params: 1
    });

    var uninstallFilter = new Method({
        name: 'uninstallFilter',
        call: 'shh_uninstallFilter',
        params: 1
    });

    var getLogs = new Method({
        name: 'getLogs',
        call: 'shh_getMessages',
        params: 1
    });

    var poll = new Method({
        name: 'poll',
        call: 'shh_getFilterChanges',
        params: 1
    });

    return [
        newFilter,
        uninstallFilter,
        getLogs,
        poll
    ];
};

module.exports = {
    eth: eth,
    shh: shh
};


},{"./method":22}],31:[function(require,module,exports){

},{}],32:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {
	        function F() {}

	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                F.prototype = this;
	                var subtype = new F();

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init')) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],33:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var C_algo = C.algo;

	    // Constants tables
	    var RHO_OFFSETS = [];
	    var PI_INDEXES  = [];
	    var ROUND_CONSTANTS = [];

	    // Compute Constants
	    (function () {
	        // Compute rho offset constants
	        var x = 1, y = 0;
	        for (var t = 0; t < 24; t++) {
	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

	            var newX = y % 5;
	            var newY = (2 * x + 3 * y) % 5;
	            x = newX;
	            y = newY;
	        }

	        // Compute pi index constants
	        for (var x = 0; x < 5; x++) {
	            for (var y = 0; y < 5; y++) {
	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
	            }
	        }

	        // Compute round constants
	        var LFSR = 0x01;
	        for (var i = 0; i < 24; i++) {
	            var roundConstantMsw = 0;
	            var roundConstantLsw = 0;

	            for (var j = 0; j < 7; j++) {
	                if (LFSR & 0x01) {
	                    var bitPosition = (1 << j) - 1;
	                    if (bitPosition < 32) {
	                        roundConstantLsw ^= 1 << bitPosition;
	                    } else /* if (bitPosition >= 32) */ {
	                        roundConstantMsw ^= 1 << (bitPosition - 32);
	                    }
	                }

	                // Compute next LFSR
	                if (LFSR & 0x80) {
	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
	                    LFSR = (LFSR << 1) ^ 0x71;
	                } else {
	                    LFSR <<= 1;
	                }
	            }

	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	        }
	    }());

	    // Reusable objects for temporary values
	    var T = [];
	    (function () {
	        for (var i = 0; i < 25; i++) {
	            T[i] = X64Word.create();
	        }
	    }());

	    /**
	     * SHA-3 hash algorithm.
	     */
	    var SHA3 = C_algo.SHA3 = Hasher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} outputLength
	         *   The desired number of bits in the output hash.
	         *   Only values permitted are: 224, 256, 384, 512.
	         *   Default: 512
	         */
	        cfg: Hasher.cfg.extend({
	            outputLength: 512
	        }),

	        _doReset: function () {
	            var state = this._state = []
	            for (var i = 0; i < 25; i++) {
	                state[i] = new X64Word.init();
	            }

	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var state = this._state;
	            var nBlockSizeLanes = this.blockSize / 2;

	            // Absorb
	            for (var i = 0; i < nBlockSizeLanes; i++) {
	                // Shortcuts
	                var M2i  = M[offset + 2 * i];
	                var M2i1 = M[offset + 2 * i + 1];

	                // Swap endian
	                M2i = (
	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
	                );
	                M2i1 = (
	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
	                );

	                // Absorb message into state
	                var lane = state[i];
	                lane.high ^= M2i1;
	                lane.low  ^= M2i;
	            }

	            // Rounds
	            for (var round = 0; round < 24; round++) {
	                // Theta
	                for (var x = 0; x < 5; x++) {
	                    // Mix column lanes
	                    var tMsw = 0, tLsw = 0;
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        tMsw ^= lane.high;
	                        tLsw ^= lane.low;
	                    }

	                    // Temporary values
	                    var Tx = T[x];
	                    Tx.high = tMsw;
	                    Tx.low  = tLsw;
	                }
	                for (var x = 0; x < 5; x++) {
	                    // Shortcuts
	                    var Tx4 = T[(x + 4) % 5];
	                    var Tx1 = T[(x + 1) % 5];
	                    var Tx1Msw = Tx1.high;
	                    var Tx1Lsw = Tx1.low;

	                    // Mix surrounding columns
	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        lane.high ^= tMsw;
	                        lane.low  ^= tLsw;
	                    }
	                }

	                // Rho Pi
	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
	                    // Shortcuts
	                    var lane = state[laneIndex];
	                    var laneMsw = lane.high;
	                    var laneLsw = lane.low;
	                    var rhoOffset = RHO_OFFSETS[laneIndex];

	                    // Rotate lanes
	                    if (rhoOffset < 32) {
	                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
	                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
	                    } else /* if (rhoOffset >= 32) */ {
	                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
	                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
	                    }

	                    // Transpose lanes
	                    var TPiLane = T[PI_INDEXES[laneIndex]];
	                    TPiLane.high = tMsw;
	                    TPiLane.low  = tLsw;
	                }

	                // Rho pi at x = y = 0
	                var T0 = T[0];
	                var state0 = state[0];
	                T0.high = state0.high;
	                T0.low  = state0.low;

	                // Chi
	                for (var x = 0; x < 5; x++) {
	                    for (var y = 0; y < 5; y++) {
	                        // Shortcuts
	                        var laneIndex = x + 5 * y;
	                        var lane = state[laneIndex];
	                        var TLane = T[laneIndex];
	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

	                        // Mix rows
	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
	                    }
	                }

	                // Iota
	                var lane = state[0];
	                var roundConstant = ROUND_CONSTANTS[round];
	                lane.high ^= roundConstant.high;
	                lane.low  ^= roundConstant.low;;
	            }
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;
	            var blockSizeBits = this.blockSize * 32;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var state = this._state;
	            var outputLengthBytes = this.cfg.outputLength / 8;
	            var outputLengthLanes = outputLengthBytes / 8;

	            // Squeeze
	            var hashWords = [];
	            for (var i = 0; i < outputLengthLanes; i++) {
	                // Shortcuts
	                var lane = state[i];
	                var laneMsw = lane.high;
	                var laneLsw = lane.low;

	                // Swap endian
	                laneMsw = (
	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
	                );
	                laneLsw = (
	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
	                );

	                // Squeeze state to retrieve hash
	                hashWords.push(laneLsw);
	                hashWords.push(laneMsw);
	            }

	            // Return final computed hash
	            return new WordArray.init(hashWords, outputLengthBytes);
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);

	            var state = clone._state = this._state.slice(0);
	            for (var i = 0; i < 25; i++) {
	                state[i] = state[i].clone();
	            }

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA3('message');
	     *     var hash = CryptoJS.SHA3(wordArray);
	     */
	    C.SHA3 = Hasher._createHelper(SHA3);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA3(message, key);
	     */
	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
	}(Math));


	return CryptoJS.SHA3;

}));
},{"./core":32,"./x64-core":34}],34:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var X32WordArray = C_lib.WordArray;

	    /**
	     * x64 namespace.
	     */
	    var C_x64 = C.x64 = {};

	    /**
	     * A 64-bit word.
	     */
	    var X64Word = C_x64.Word = Base.extend({
	        /**
	         * Initializes a newly created 64-bit word.
	         *
	         * @param {number} high The high 32 bits.
	         * @param {number} low The low 32 bits.
	         *
	         * @example
	         *
	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
	         */
	        init: function (high, low) {
	            this.high = high;
	            this.low = low;
	        }

	        /**
	         * Bitwise NOTs this word.
	         *
	         * @return {X64Word} A new x64-Word object after negating.
	         *
	         * @example
	         *
	         *     var negated = x64Word.not();
	         */
	        // not: function () {
	            // var high = ~this.high;
	            // var low = ~this.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ANDs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to AND with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ANDing.
	         *
	         * @example
	         *
	         *     var anded = x64Word.and(anotherX64Word);
	         */
	        // and: function (word) {
	            // var high = this.high & word.high;
	            // var low = this.low & word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to OR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ORing.
	         *
	         * @example
	         *
	         *     var ored = x64Word.or(anotherX64Word);
	         */
	        // or: function (word) {
	            // var high = this.high | word.high;
	            // var low = this.low | word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise XORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to XOR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after XORing.
	         *
	         * @example
	         *
	         *     var xored = x64Word.xor(anotherX64Word);
	         */
	        // xor: function (word) {
	            // var high = this.high ^ word.high;
	            // var low = this.low ^ word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the left.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftL(25);
	         */
	        // shiftL: function (n) {
	            // if (n < 32) {
	                // var high = (this.high << n) | (this.low >>> (32 - n));
	                // var low = this.low << n;
	            // } else {
	                // var high = this.low << (n - 32);
	                // var low = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the right.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftR(7);
	         */
	        // shiftR: function (n) {
	            // if (n < 32) {
	                // var low = (this.low >>> n) | (this.high << (32 - n));
	                // var high = this.high >>> n;
	            // } else {
	                // var low = this.high >>> (n - 32);
	                // var high = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Rotates this word n bits to the left.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotL(25);
	         */
	        // rotL: function (n) {
	            // return this.shiftL(n).or(this.shiftR(64 - n));
	        // },

	        /**
	         * Rotates this word n bits to the right.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotR(7);
	         */
	        // rotR: function (n) {
	            // return this.shiftR(n).or(this.shiftL(64 - n));
	        // },

	        /**
	         * Adds this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to add with this word.
	         *
	         * @return {X64Word} A new x64-Word object after adding.
	         *
	         * @example
	         *
	         *     var added = x64Word.add(anotherX64Word);
	         */
	        // add: function (word) {
	            // var low = (this.low + word.low) | 0;
	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
	            // var high = (this.high + word.high + carry) | 0;

	            // return X64Word.create(high, low);
	        // }
	    });

	    /**
	     * An array of 64-bit words.
	     *
	     * @property {Array} words The array of CryptoJS.x64.Word objects.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var X64WordArray = C_x64.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create();
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ]);
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ], 10);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 8;
	            }
	        },

	        /**
	         * Converts this 64-bit word array to a 32-bit word array.
	         *
	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
	         *
	         * @example
	         *
	         *     var x32WordArray = x64WordArray.toX32();
	         */
	        toX32: function () {
	            // Shortcuts
	            var x64Words = this.words;
	            var x64WordsLength = x64Words.length;

	            // Convert
	            var x32Words = [];
	            for (var i = 0; i < x64WordsLength; i++) {
	                var x64Word = x64Words[i];
	                x32Words.push(x64Word.high);
	                x32Words.push(x64Word.low);
	            }

	            return X32WordArray.create(x32Words, this.sigBytes);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {X64WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = x64WordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);

	            // Clone "words" array
	            var words = clone.words = this.words.slice(0);

	            // Clone each X64Word object
	            var wordsLength = words.length;
	            for (var i = 0; i < wordsLength; i++) {
	                words[i] = words[i].clone();
	            }

	            return clone;
	        }
	    });
	}());


	return CryptoJS;

}));
},{"./core":32}],"bignumber.js":[function(require,module,exports){
/*! bignumber.js v2.0.7 https://github.com/MikeMcl/bignumber.js/LICENCE */

;(function (global) {
    'use strict';

    /*
      bignumber.js v2.0.7
      A JavaScript library for arbitrary-precision arithmetic.
      https://github.com/MikeMcl/bignumber.js
      Copyright (c) 2015 Michael Mclaughlin <M8ch88l@gmail.com>
      MIT Expat Licence
    */


    var BigNumber, crypto, parseNumeric,
        isNumeric = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        mathceil = Math.ceil,
        mathfloor = Math.floor,
        notBool = ' not a boolean or binary digit',
        roundingMode = 'rounding mode',
        tooManyDigits = 'number type has more than 15 significant digits',
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
        BASE = 1e14,
        LOG_BASE = 14,
        MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
        // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
        SQRT_BASE = 1e7,

        /*
         * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
         * the arguments to toExponential, toFixed, toFormat, and toPrecision, beyond which an
         * exception is thrown (if ERRORS is true).
         */
        MAX = 1E9;                                   // 0 to MAX_INT32


    /*
     * Create and return a BigNumber constructor.
     */
    function another(configObj) {
        var div,

            // id tracks the caller function, so its name can be included in error messages.
            id = 0,
            P = BigNumber.prototype,
            ONE = new BigNumber(1),


            /********************************* EDITABLE DEFAULTS **********************************/


            /*
             * The default values below must be integers within the inclusive ranges stated.
             * The values can also be changed at run-time using BigNumber.config.
             */

            // The maximum number of decimal places for operations involving division.
            DECIMAL_PLACES = 20,                     // 0 to MAX

            /*
             * The rounding mode used when rounding to the above decimal places, and when using
             * toExponential, toFixed, toFormat and toPrecision, and round (default value).
             * UP         0 Away from zero.
             * DOWN       1 Towards zero.
             * CEIL       2 Towards +Infinity.
             * FLOOR      3 Towards -Infinity.
             * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
             * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
             * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
             * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
             * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
             */
            ROUNDING_MODE = 4,                       // 0 to 8

            // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

            // The exponent value at and beneath which toString returns exponential notation.
            // Number type: -7
            TO_EXP_NEG = -7,                         // 0 to -MAX

            // The exponent value at and above which toString returns exponential notation.
            // Number type: 21
            TO_EXP_POS = 21,                         // 0 to MAX

            // RANGE : [MIN_EXP, MAX_EXP]

            // The minimum exponent value, beneath which underflow to zero occurs.
            // Number type: -324  (5e-324)
            MIN_EXP = -1e7,                          // -1 to -MAX

            // The maximum exponent value, above which overflow to Infinity occurs.
            // Number type:  308  (1.7976931348623157e+308)
            // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
            MAX_EXP = 1e7,                           // 1 to MAX

            // Whether BigNumber Errors are ever thrown.
            ERRORS = true,                           // true or false

            // Change to intValidatorNoErrors if ERRORS is false.
            isValidInt = intValidatorWithErrors,     // intValidatorWithErrors/intValidatorNoErrors

            // Whether to use cryptographically-secure random number generation, if available.
            CRYPTO = false,                          // true or false

            /*
             * The modulo mode used when calculating the modulus: a mod n.
             * The quotient (q = a / n) is calculated according to the corresponding rounding mode.
             * The remainder (r) is calculated as: r = a - n * q.
             *
             * UP        0 The remainder is positive if the dividend is negative, else is negative.
             * DOWN      1 The remainder has the same sign as the dividend.
             *             This modulo mode is commonly known as 'truncated division' and is
             *             equivalent to (a % n) in JavaScript.
             * FLOOR     3 The remainder has the same sign as the divisor (Python %).
             * HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
             * EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
             *             The remainder is always positive.
             *
             * The truncated division, floored division, Euclidian division and IEEE 754 remainder
             * modes are commonly used for the modulus operation.
             * Although the other rounding modes can also be used, they may not give useful results.
             */
            MODULO_MODE = 1,                         // 0 to 9

            // The maximum number of significant digits of the result of the toPower operation.
            // If POW_PRECISION is 0, there will be unlimited significant digits.
            POW_PRECISION = 100,                     // 0 to MAX

            // The format specification used by the BigNumber.prototype.toFormat method.
            FORMAT = {
                decimalSeparator: '.',
                groupSeparator: ',',
                groupSize: 3,
                secondaryGroupSize: 0,
                fractionGroupSeparator: '\xA0',      // non-breaking space
                fractionGroupSize: 0
            };


        /******************************************************************************************/


        // CONSTRUCTOR


        /*
         * The BigNumber constructor and exported function.
         * Create and return a new instance of a BigNumber object.
         *
         * n {number|string|BigNumber} A numeric value.
         * [b] {number} The base of n. Integer, 2 to 64 inclusive.
         */
        function BigNumber( n, b ) {
            var c, e, i, num, len, str,
                x = this;

            // Enable constructor usage without new.
            if ( !( x instanceof BigNumber ) ) {

                // 'BigNumber() constructor call without new: {n}'
                if (ERRORS) raise( 26, 'constructor call without new', n );
                return new BigNumber( n, b );
            }

            // 'new BigNumber() base not an integer: {b}'
            // 'new BigNumber() base out of range: {b}'
            if ( b == null || !isValidInt( b, 2, 64, id, 'base' ) ) {

                // Duplicate.
                if ( n instanceof BigNumber ) {
                    x.s = n.s;
                    x.e = n.e;
                    x.c = ( n = n.c ) ? n.slice() : n;
                    id = 0;
                    return;
                }

                if ( ( num = typeof n == 'number' ) && n * 0 == 0 ) {
                    x.s = 1 / n < 0 ? ( n = -n, -1 ) : 1;

                    // Fast path for integers.
                    if ( n === ~~n ) {
                        for ( e = 0, i = n; i >= 10; i /= 10, e++ );
                        x.e = e;
                        x.c = [n];
                        id = 0;
                        return;
                    }

                    str = n + '';
                } else {
                    if ( !isNumeric.test( str = n + '' ) ) return parseNumeric( x, str, num );
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }
            } else {
                b = b | 0;
                str = n + '';

                // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
                // Allow exponential notation to be used with base 10 argument.
                if ( b == 10 ) {
                    x = new BigNumber( n instanceof BigNumber ? n : str );
                    return round( x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE );
                }

                // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                // Any number in exponential form will fail due to the [Ee][+-].
                if ( ( num = typeof n == 'number' ) && n * 0 != 0 ||
                  !( new RegExp( '^-?' + ( c = '[' + ALPHABET.slice( 0, b ) + ']+' ) +
                    '(?:\\.' + c + ')?$',b < 37 ? 'i' : '' ) ).test(str) ) {
                    return parseNumeric( x, str, num, b );
                }

                if (num) {
                    x.s = 1 / n < 0 ? ( str = str.slice(1), -1 ) : 1;

                    if ( ERRORS && str.replace( /^0\.0*|\./, '' ).length > 15 ) {

                        // 'new BigNumber() number type has more than 15 significant digits: {n}'
                        raise( id, tooManyDigits, n );
                    }

                    // Prevent later check for length on converted number.
                    num = false;
                } else {
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }

                str = convertBase( str, 10, b, x.s );
            }

            // Decimal point?
            if ( ( e = str.indexOf('.') ) > -1 ) str = str.replace( '.', '' );

            // Exponential form?
            if ( ( i = str.search( /e/i ) ) > 0 ) {

                // Determine exponent.
                if ( e < 0 ) e = i;
                e += +str.slice( i + 1 );
                str = str.substring( 0, i );
            } else if ( e < 0 ) {

                // Integer.
                e = str.length;
            }

            // Determine leading zeros.
            for ( i = 0; str.charCodeAt(i) === 48; i++ );

            // Determine trailing zeros.
            for ( len = str.length; str.charCodeAt(--len) === 48; );
            str = str.slice( i, len + 1 );

            if (str) {
                len = str.length;

                // Disallow numbers with over 15 significant digits if number type.
                // 'new BigNumber() number type has more than 15 significant digits: {n}'
                if ( num && ERRORS && len > 15 ) raise( id, tooManyDigits, x.s * n );

                e = e - i - 1;

                 // Overflow?
                if ( e > MAX_EXP ) {

                    // Infinity.
                    x.c = x.e = null;

                // Underflow?
                } else if ( e < MIN_EXP ) {

                    // Zero.
                    x.c = [ x.e = 0 ];
                } else {
                    x.e = e;
                    x.c = [];

                    // Transform base

                    // e is the base 10 exponent.
                    // i is where to slice str to get the first element of the coefficient array.
                    i = ( e + 1 ) % LOG_BASE;
                    if ( e < 0 ) i += LOG_BASE;

                    if ( i < len ) {
                        if (i) x.c.push( +str.slice( 0, i ) );

                        for ( len -= LOG_BASE; i < len; ) {
                            x.c.push( +str.slice( i, i += LOG_BASE ) );
                        }

                        str = str.slice(i);
                        i = LOG_BASE - str.length;
                    } else {
                        i -= len;
                    }

                    for ( ; i--; str += '0' );
                    x.c.push( +str );
                }
            } else {

                // Zero.
                x.c = [ x.e = 0 ];
            }

            id = 0;
        }


        // CONSTRUCTOR PROPERTIES


        BigNumber.another = another;

        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;


        /*
         * Configure infrequently-changing library-wide settings.
         *
         * Accept an object or an argument list, with one or many of the following properties or
         * parameters respectively:
         *
         *   DECIMAL_PLACES  {number}  Integer, 0 to MAX inclusive
         *   ROUNDING_MODE   {number}  Integer, 0 to 8 inclusive
         *   EXPONENTIAL_AT  {number|number[]}  Integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to 0 incl., 0 to MAX incl.]
         *   RANGE           {number|number[]}  Non-zero integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to -1 incl., integer 1 to MAX incl.]
         *   ERRORS          {boolean|number}   true, false, 1 or 0
         *   CRYPTO          {boolean|number}   true, false, 1 or 0
         *   MODULO_MODE     {number}           0 to 9 inclusive
         *   POW_PRECISION   {number}           0 to MAX inclusive
         *   FORMAT          {object}           See BigNumber.prototype.toFormat
         *      decimalSeparator       {string}
         *      groupSeparator         {string}
         *      groupSize              {number}
         *      secondaryGroupSize     {number}
         *      fractionGroupSeparator {string}
         *      fractionGroupSize      {number}
         *
         * (The values assigned to the above FORMAT object properties are not checked for validity.)
         *
         * E.g.
         * BigNumber.config(20, 4) is equivalent to
         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
         *
         * Ignore properties/parameters set to null or undefined.
         * Return an object with the properties current values.
         */
        BigNumber.config = function () {
            var v, p,
                i = 0,
                r = {},
                a = arguments,
                o = a[0],
                has = o && typeof o == 'object'
                  ? function () { if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null; }
                  : function () { if ( a.length > i ) return ( v = a[i++] ) != null; };

            // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
            // 'config() DECIMAL_PLACES not an integer: {v}'
            // 'config() DECIMAL_PLACES out of range: {v}'
            if ( has( p = 'DECIMAL_PLACES' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                DECIMAL_PLACES = v | 0;
            }
            r[p] = DECIMAL_PLACES;

            // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
            // 'config() ROUNDING_MODE not an integer: {v}'
            // 'config() ROUNDING_MODE out of range: {v}'
            if ( has( p = 'ROUNDING_MODE' ) && isValidInt( v, 0, 8, 2, p ) ) {
                ROUNDING_MODE = v | 0;
            }
            r[p] = ROUNDING_MODE;

            // EXPONENTIAL_AT {number|number[]}
            // Integer, -MAX to MAX inclusive or [integer -MAX to 0 inclusive, 0 to MAX inclusive].
            // 'config() EXPONENTIAL_AT not an integer: {v}'
            // 'config() EXPONENTIAL_AT out of range: {v}'
            if ( has( p = 'EXPONENTIAL_AT' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, 0, 2, p ) && isValidInt( v[1], 0, MAX, 2, p ) ) {
                        TO_EXP_NEG = v[0] | 0;
                        TO_EXP_POS = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    TO_EXP_NEG = -( TO_EXP_POS = ( v < 0 ? -v : v ) | 0 );
                }
            }
            r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

            // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
            // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
            // 'config() RANGE not an integer: {v}'
            // 'config() RANGE cannot be zero: {v}'
            // 'config() RANGE out of range: {v}'
            if ( has( p = 'RANGE' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, -1, 2, p ) && isValidInt( v[1], 1, MAX, 2, p ) ) {
                        MIN_EXP = v[0] | 0;
                        MAX_EXP = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    if ( v | 0 ) MIN_EXP = -( MAX_EXP = ( v < 0 ? -v : v ) | 0 );
                    else if (ERRORS) raise( 2, p + ' cannot be zero', v );
                }
            }
            r[p] = [ MIN_EXP, MAX_EXP ];

            // ERRORS {boolean|number} true, false, 1 or 0.
            // 'config() ERRORS not a boolean or binary digit: {v}'
            if ( has( p = 'ERRORS' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    id = 0;
                    isValidInt = ( ERRORS = !!v ) ? intValidatorWithErrors : intValidatorNoErrors;
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = ERRORS;

            // CRYPTO {boolean|number} true, false, 1 or 0.
            // 'config() CRYPTO not a boolean or binary digit: {v}'
            // 'config() crypto unavailable: {crypto}'
            if ( has( p = 'CRYPTO' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    CRYPTO = !!( v && crypto && typeof crypto == 'object' );
                    if ( v && !CRYPTO && ERRORS ) raise( 2, 'crypto unavailable', crypto );
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = CRYPTO;

            // MODULO_MODE {number} Integer, 0 to 9 inclusive.
            // 'config() MODULO_MODE not an integer: {v}'
            // 'config() MODULO_MODE out of range: {v}'
            if ( has( p = 'MODULO_MODE' ) && isValidInt( v, 0, 9, 2, p ) ) {
                MODULO_MODE = v | 0;
            }
            r[p] = MODULO_MODE;

            // POW_PRECISION {number} Integer, 0 to MAX inclusive.
            // 'config() POW_PRECISION not an integer: {v}'
            // 'config() POW_PRECISION out of range: {v}'
            if ( has( p = 'POW_PRECISION' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                POW_PRECISION = v | 0;
            }
            r[p] = POW_PRECISION;

            // FORMAT {object}
            // 'config() FORMAT not an object: {v}'
            if ( has( p = 'FORMAT' ) ) {

                if ( typeof v == 'object' ) {
                    FORMAT = v;
                } else if (ERRORS) {
                    raise( 2, p + ' not an object', v );
                }
            }
            r[p] = FORMAT;

            return r;
        };


        /*
         * Return a new BigNumber whose value is the maximum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.max = function () { return maxOrMin( arguments, P.lt ); };


        /*
         * Return a new BigNumber whose value is the minimum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.min = function () { return maxOrMin( arguments, P.gt ); };


        /*
         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
         * zeros are produced).
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         *
         * 'random() decimal places not an integer: {dp}'
         * 'random() decimal places out of range: {dp}'
         * 'random() crypto unavailable: {crypto}'
         */
        BigNumber.random = (function () {
            var pow2_53 = 0x20000000000000;

            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
            // Check if Math.random() produces more than 32 bits of randomness.
            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
            var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
              ? function () { return mathfloor( Math.random() * pow2_53 ); }
              : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
                  (Math.random() * 0x800000 | 0); };

            return function (dp) {
                var a, b, e, k, v,
                    i = 0,
                    c = [],
                    rand = new BigNumber(ONE);

                dp = dp == null || !isValidInt( dp, 0, MAX, 14 ) ? DECIMAL_PLACES : dp | 0;
                k = mathceil( dp / LOG_BASE );

                if (CRYPTO) {

                    // Browsers supporting crypto.getRandomValues.
                    if ( crypto && crypto.getRandomValues ) {

                        a = crypto.getRandomValues( new Uint32Array( k *= 2 ) );

                        for ( ; i < k; ) {

                            // 53 bits:
                            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                            //                                     11111 11111111 11111111
                            // 0x20000 is 2^21.
                            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                            // Rejection sampling:
                            // 0 <= v < 9007199254740992
                            // Probability that v >= 9e15, is
                            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                            if ( v >= 9e15 ) {
                                b = crypto.getRandomValues( new Uint32Array(2) );
                                a[i] = b[0];
                                a[i + 1] = b[1];
                            } else {

                                // 0 <= v <= 8999999999999999
                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 2;
                            }
                        }
                        i = k / 2;

                    // Node.js supporting crypto.randomBytes.
                    } else if ( crypto && crypto.randomBytes ) {

                        // buffer
                        a = crypto.randomBytes( k *= 7 );

                        for ( ; i < k; ) {

                            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                            // 0x100000000 is 2^32, 0x1000000 is 2^24
                            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                            // 0 <= v < 9007199254740992
                            v = ( ( a[i] & 31 ) * 0x1000000000000 ) + ( a[i + 1] * 0x10000000000 ) +
                                  ( a[i + 2] * 0x100000000 ) + ( a[i + 3] * 0x1000000 ) +
                                  ( a[i + 4] << 16 ) + ( a[i + 5] << 8 ) + a[i + 6];

                            if ( v >= 9e15 ) {
                                crypto.randomBytes(7).copy( a, i );
                            } else {

                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 7;
                            }
                        }
                        i = k / 7;
                    } else if (ERRORS) {
                        raise( 14, 'crypto unavailable', crypto );
                    }
                }

                // Use Math.random: CRYPTO is false or crypto is unavailable and ERRORS is false.
                if (!i) {

                    for ( ; i < k; ) {
                        v = random53bitInt();
                        if ( v < 9e15 ) c[i++] = v % 1e14;
                    }
                }

                k = c[--i];
                dp %= LOG_BASE;

                // Convert trailing digits to zeros according to dp.
                if ( k && dp ) {
                    v = POWS_TEN[LOG_BASE - dp];
                    c[i] = mathfloor( k / v ) * v;
                }

                // Remove trailing elements which are zero.
                for ( ; c[i] === 0; c.pop(), i-- );

                // Zero?
                if ( i < 0 ) {
                    c = [ e = 0 ];
                } else {

                    // Remove leading elements which are zero and adjust exponent accordingly.
                    for ( e = -1 ; c[0] === 0; c.shift(), e -= LOG_BASE);

                    // Count the digits of the first element of c to determine leading zeros, and...
                    for ( i = 1, v = c[0]; v >= 10; v /= 10, i++);

                    // adjust the exponent accordingly.
                    if ( i < LOG_BASE ) e -= LOG_BASE - i;
                }

                rand.e = e;
                rand.c = c;
                return rand;
            };
        })();


        // PRIVATE FUNCTIONS


        // Convert a numeric string of baseIn to a numeric string of baseOut.
        function convertBase( str, baseOut, baseIn, sign ) {
            var d, e, k, r, x, xc, y,
                i = str.indexOf( '.' ),
                dp = DECIMAL_PLACES,
                rm = ROUNDING_MODE;

            if ( baseIn < 37 ) str = str.toLowerCase();

            // Non-integer.
            if ( i >= 0 ) {
                k = POW_PRECISION;

                // Unlimited precision.
                POW_PRECISION = 0;
                str = str.replace( '.', '' );
                y = new BigNumber(baseIn);
                x = y.pow( str.length - i );
                POW_PRECISION = k;

                // Convert str as if an integer, then restore the fraction part by dividing the
                // result by its base raised to a power.
                y.c = toBaseOut( toFixedPoint( coeffToString( x.c ), x.e ), 10, baseOut );
                y.e = y.c.length;
            }

            // Convert the number as integer.
            xc = toBaseOut( str, baseIn, baseOut );
            e = k = xc.length;

            // Remove trailing zeros.
            for ( ; xc[--k] == 0; xc.pop() );
            if ( !xc[0] ) return '0';

            if ( i < 0 ) {
                --e;
            } else {
                x.c = xc;
                x.e = e;

                // sign is needed for correct rounding.
                x.s = sign;
                x = div( x, y, dp, rm, baseOut );
                xc = x.c;
                r = x.r;
                e = x.e;
            }

            d = e + dp + 1;

            // The rounding digit, i.e. the digit to the right of the digit that may be rounded up.
            i = xc[d];
            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;

            r = rm < 4 ? ( i != null || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                       : i > k || i == k &&( rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                         rm == ( x.s < 0 ? 8 : 7 ) );

            if ( d < 1 || !xc[0] ) {

                // 1^-dp or 0.
                str = r ? toFixedPoint( '1', -dp ) : '0';
            } else {
                xc.length = d;

                if (r) {

                    // Rounding up may mean the previous digit has to be rounded up and so on.
                    for ( --baseOut; ++xc[--d] > baseOut; ) {
                        xc[d] = 0;

                        if ( !d ) {
                            ++e;
                            xc.unshift(1);
                        }
                    }
                }

                // Determine trailing zeros.
                for ( k = xc.length; !xc[--k]; );

                // E.g. [4, 11, 15] becomes 4bf.
                for ( i = 0, str = ''; i <= k; str += ALPHABET.charAt( xc[i++] ) );
                str = toFixedPoint( str, e );
            }

            // The caller will add the sign.
            return str;
        }


        // Perform division in the specified base. Called by div and convertBase.
        div = (function () {

            // Assume non-zero x and k.
            function multiply( x, k, base ) {
                var m, temp, xlo, xhi,
                    carry = 0,
                    i = x.length,
                    klo = k % SQRT_BASE,
                    khi = k / SQRT_BASE | 0;

                for ( x = x.slice(); i--; ) {
                    xlo = x[i] % SQRT_BASE;
                    xhi = x[i] / SQRT_BASE | 0;
                    m = khi * xlo + xhi * klo;
                    temp = klo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + carry;
                    carry = ( temp / base | 0 ) + ( m / SQRT_BASE | 0 ) + khi * xhi;
                    x[i] = temp % base;
                }

                if (carry) x.unshift(carry);

                return x;
            }

            function compare( a, b, aL, bL ) {
                var i, cmp;

                if ( aL != bL ) {
                    cmp = aL > bL ? 1 : -1;
                } else {

                    for ( i = cmp = 0; i < aL; i++ ) {

                        if ( a[i] != b[i] ) {
                            cmp = a[i] > b[i] ? 1 : -1;
                            break;
                        }
                    }
                }
                return cmp;
            }

            function subtract( a, b, aL, base ) {
                var i = 0;

                // Subtract b from a.
                for ( ; aL--; ) {
                    a[aL] -= i;
                    i = a[aL] < b[aL] ? 1 : 0;
                    a[aL] = i * base + a[aL] - b[aL];
                }

                // Remove leading zeros.
                for ( ; !a[0] && a.length > 1; a.shift() );
            }

            // x: dividend, y: divisor.
            return function ( x, y, dp, rm, base ) {
                var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                    yL, yz,
                    s = x.s == y.s ? 1 : -1,
                    xc = x.c,
                    yc = y.c;

                // Either NaN, Infinity or 0?
                if ( !xc || !xc[0] || !yc || !yc[0] ) {

                    return new BigNumber(

                      // Return NaN if either NaN, or both Infinity or 0.
                      !x.s || !y.s || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :

                        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                        xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                    );
                }

                q = new BigNumber(s);
                qc = q.c = [];
                e = x.e - y.e;
                s = dp + e + 1;

                if ( !base ) {
                    base = BASE;
                    e = bitFloor( x.e / LOG_BASE ) - bitFloor( y.e / LOG_BASE );
                    s = s / LOG_BASE | 0;
                }

                // Result exponent may be one less then the current value of e.
                // The coefficients of the BigNumbers from convertBase may have trailing zeros.
                for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );
                if ( yc[i] > ( xc[i] || 0 ) ) e--;

                if ( s < 0 ) {
                    qc.push(1);
                    more = true;
                } else {
                    xL = xc.length;
                    yL = yc.length;
                    i = 0;
                    s += 2;

                    // Normalise xc and yc so highest order digit of yc is >= base / 2.

                    n = mathfloor( base / ( yc[0] + 1 ) );

                    // Not necessary, but to handle odd bases where yc[0] == ( base / 2 ) - 1.
                    // if ( n > 1 || n++ == 1 && yc[0] < base / 2 ) {
                    if ( n > 1 ) {
                        yc = multiply( yc, n, base );
                        xc = multiply( xc, n, base );
                        yL = yc.length;
                        xL = xc.length;
                    }

                    xi = yL;
                    rem = xc.slice( 0, yL );
                    remL = rem.length;

                    // Add zeros to make remainder as long as divisor.
                    for ( ; remL < yL; rem[remL++] = 0 );
                    yz = yc.slice();
                    yz.unshift(0);
                    yc0 = yc[0];
                    if ( yc[1] >= base / 2 ) yc0++;
                    // Not necessary, but to prevent trial digit n > base, when using base 3.
                    // else if ( base == 3 && yc0 == 1 ) yc0 = 1 + 1e-15;

                    do {
                        n = 0;

                        // Compare divisor and remainder.
                        cmp = compare( yc, rem, yL, remL );

                        // If divisor < remainder.
                        if ( cmp < 0 ) {

                            // Calculate trial digit, n.

                            rem0 = rem[0];
                            if ( yL != remL ) rem0 = rem0 * base + ( rem[1] || 0 );

                            // n is how many times the divisor goes into the current remainder.
                            n = mathfloor( rem0 / yc0 );

                            //  Algorithm:
                            //  1. product = divisor * trial digit (n)
                            //  2. if product > remainder: product -= divisor, n--
                            //  3. remainder -= product
                            //  4. if product was < remainder at 2:
                            //    5. compare new remainder and divisor
                            //    6. If remainder > divisor: remainder -= divisor, n++

                            if ( n > 1 ) {

                                // n may be > base only when base is 3.
                                if (n >= base) n = base - 1;

                                // product = divisor * trial digit.
                                prod = multiply( yc, n, base );
                                prodL = prod.length;
                                remL = rem.length;

                                // Compare product and remainder.
                                // If product > remainder.
                                // Trial digit n too high.
                                // n is 1 too high about 5% of the time, and is not known to have
                                // ever been more than 1 too high.
                                while ( compare( prod, rem, prodL, remL ) == 1 ) {
                                    n--;

                                    // Subtract divisor from product.
                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
                                    prodL = prod.length;
                                    cmp = 1;
                                }
                            } else {

                                // n is 0 or 1, cmp is -1.
                                // If n is 0, there is no need to compare yc and rem again below,
                                // so change cmp to 1 to avoid it.
                                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                                if ( n == 0 ) {

                                    // divisor < remainder, so n must be at least 1.
                                    cmp = n = 1;
                                }

                                // product = divisor
                                prod = yc.slice();
                                prodL = prod.length;
                            }

                            if ( prodL < remL ) prod.unshift(0);

                            // Subtract product from remainder.
                            subtract( rem, prod, remL, base );
                            remL = rem.length;

                             // If product was < remainder.
                            if ( cmp == -1 ) {

                                // Compare divisor and new remainder.
                                // If divisor < new remainder, subtract divisor from remainder.
                                // Trial digit n too low.
                                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                                while ( compare( yc, rem, yL, remL ) < 1 ) {
                                    n++;

                                    // Subtract divisor from remainder.
                                    subtract( rem, yL < remL ? yz : yc, remL, base );
                                    remL = rem.length;
                                }
                            }
                        } else if ( cmp === 0 ) {
                            n++;
                            rem = [0];
                        } // else cmp === 1 and n will be 0

                        // Add the next digit, n, to the result array.
                        qc[i++] = n;

                        // Update the remainder.
                        if ( rem[0] ) {
                            rem[remL++] = xc[xi] || 0;
                        } else {
                            rem = [ xc[xi] ];
                            remL = 1;
                        }
                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );

                    more = rem[0] != null;

                    // Leading zero?
                    if ( !qc[0] ) qc.shift();
                }

                if ( base == BASE ) {

                    // To calculate q.e, first get the number of digits of qc[0].
                    for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
                    round( q, dp + ( q.e = i + e * LOG_BASE - 1 ) + 1, rm, more );

                // Caller is convertBase.
                } else {
                    q.e = e;
                    q.r = +more;
                }

                return q;
            };
        })();


        /*
         * Return a string representing the value of BigNumber n in fixed-point or exponential
         * notation rounded to the specified decimal places or significant digits.
         *
         * n is a BigNumber.
         * i is the index of the last digit required (i.e. the digit that may be rounded up).
         * rm is the rounding mode.
         * caller is caller id: toExponential 19, toFixed 20, toFormat 21, toPrecision 24.
         */
        function format( n, i, rm, caller ) {
            var c0, e, ne, len, str;

            rm = rm != null && isValidInt( rm, 0, 8, caller, roundingMode )
              ? rm | 0 : ROUNDING_MODE;

            if ( !n.c ) return n.toString();
            c0 = n.c[0];
            ne = n.e;

            if ( i == null ) {
                str = coeffToString( n.c );
                str = caller == 19 || caller == 24 && ne <= TO_EXP_NEG
                  ? toExponential( str, ne )
                  : toFixedPoint( str, ne );
            } else {
                n = round( new BigNumber(n), i, rm );

                // n.e may have changed if the value was rounded up.
                e = n.e;

                str = coeffToString( n.c );
                len = str.length;

                // toPrecision returns exponential notation if the number of significant digits
                // specified is less than the number of digits necessary to represent the integer
                // part of the value in fixed-point notation.

                // Exponential notation.
                if ( caller == 19 || caller == 24 && ( i <= e || e <= TO_EXP_NEG ) ) {

                    // Append zeros?
                    for ( ; len < i; str += '0', len++ );
                    str = toExponential( str, e );

                // Fixed-point notation.
                } else {
                    i -= ne;
                    str = toFixedPoint( str, e );

                    // Append zeros?
                    if ( e + 1 > len ) {
                        if ( --i > 0 ) for ( str += '.'; i--; str += '0' );
                    } else {
                        i += e - len;
                        if ( i > 0 ) {
                            if ( e + 1 == len ) str += '.';
                            for ( ; i--; str += '0' );
                        }
                    }
                }
            }

            return n.s < 0 && c0 ? '-' + str : str;
        }


        // Handle BigNumber.max and BigNumber.min.
        function maxOrMin( args, method ) {
            var m, n,
                i = 0;

            if ( isArray( args[0] ) ) args = args[0];
            m = new BigNumber( args[0] );

            for ( ; ++i < args.length; ) {
                n = new BigNumber( args[i] );

                // If any number is NaN, return NaN.
                if ( !n.s ) {
                    m = n;
                    break;
                } else if ( method.call( m, n ) ) {
                    m = n;
                }
            }

            return m;
        }


        /*
         * Return true if n is an integer in range, otherwise throw.
         * Use for argument validation when ERRORS is true.
         */
        function intValidatorWithErrors( n, min, max, caller, name ) {
            if ( n < min || n > max || n != truncate(n) ) {
                raise( caller, ( name || 'decimal places' ) +
                  ( n < min || n > max ? ' out of range' : ' not an integer' ), n );
            }

            return true;
        }


        /*
         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
         * Called by minus, plus and times.
         */
        function normalise( n, c, e ) {
            var i = 1,
                j = c.length;

             // Remove trailing zeros.
            for ( ; !c[--j]; c.pop() );

            // Calculate the base 10 exponent. First get the number of digits of c[0].
            for ( j = c[0]; j >= 10; j /= 10, i++ );

            // Overflow?
            if ( ( e = i + e * LOG_BASE - 1 ) > MAX_EXP ) {

                // Infinity.
                n.c = n.e = null;

            // Underflow?
            } else if ( e < MIN_EXP ) {

                // Zero.
                n.c = [ n.e = 0 ];
            } else {
                n.e = e;
                n.c = c;
            }

            return n;
        }


        // Handle values that fail the validity test in BigNumber.
        parseNumeric = (function () {
            var basePrefix = /^(-?)0([xbo])/i,
                dotAfter = /^([^.]+)\.$/,
                dotBefore = /^\.([^.]+)$/,
                isInfinityOrNaN = /^-?(Infinity|NaN)$/,
                whitespaceOrPlus = /^\s*\+|^\s+|\s+$/g;

            return function ( x, str, num, b ) {
                var base,
                    s = num ? str : str.replace( whitespaceOrPlus, '' );

                // No exception on ±Infinity or NaN.
                if ( isInfinityOrNaN.test(s) ) {
                    x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
                } else {
                    if ( !num ) {

                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                        s = s.replace( basePrefix, function ( m, p1, p2 ) {
                            base = ( p2 = p2.toLowerCase() ) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                            return !b || b == base ? p1 : m;
                        });

                        if (b) {
                            base = b;

                            // E.g. '1.' to '1', '.1' to '0.1'
                            s = s.replace( dotAfter, '$1' ).replace( dotBefore, '0.$1' );
                        }

                        if ( str != s ) return new BigNumber( s, base );
                    }

                    // 'new BigNumber() not a number: {n}'
                    // 'new BigNumber() not a base {b} number: {n}'
                    if (ERRORS) raise( id, 'not a' + ( b ? ' base ' + b : '' ) + ' number', str );
                    x.s = null;
                }

                x.c = x.e = null;
                id = 0;
            }
        })();


        // Throw a BigNumber Error.
        function raise( caller, msg, val ) {
            var error = new Error( [
                'new BigNumber',     // 0
                'cmp',               // 1
                'config',            // 2
                'div',               // 3
                'divToInt',          // 4
                'eq',                // 5
                'gt',                // 6
                'gte',               // 7
                'lt',                // 8
                'lte',               // 9
                'minus',             // 10
                'mod',               // 11
                'plus',              // 12
                'precision',         // 13
                'random',            // 14
                'round',             // 15
                'shift',             // 16
                'times',             // 17
                'toDigits',          // 18
                'toExponential',     // 19
                'toFixed',           // 20
                'toFormat',          // 21
                'toFraction',        // 22
                'pow',               // 23
                'toPrecision',       // 24
                'toString',          // 25
                'BigNumber'          // 26
            ][caller] + '() ' + msg + ': ' + val );

            error.name = 'BigNumber Error';
            id = 0;
            throw error;
        }


        /*
         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
         * If r is truthy, it is known that there are more digits after the rounding digit.
         */
        function round( x, sd, rm, r ) {
            var d, i, j, k, n, ni, rd,
                xc = x.c,
                pows10 = POWS_TEN;

            // if x is not Infinity or NaN...
            if (xc) {

                // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
                // n is a base 1e14 number, the value of the element of array x.c containing rd.
                // ni is the index of n within x.c.
                // d is the number of digits of n.
                // i is the index of rd within n including leading zeros.
                // j is the actual index of rd within n (if < 0, rd is a leading zero).
                out: {

                    // Get the number of digits of the first element of xc.
                    for ( d = 1, k = xc[0]; k >= 10; k /= 10, d++ );
                    i = sd - d;

                    // If the rounding digit is in the first element of xc...
                    if ( i < 0 ) {
                        i += LOG_BASE;
                        j = sd;
                        n = xc[ ni = 0 ];

                        // Get the rounding digit at index j of n.
                        rd = n / pows10[ d - j - 1 ] % 10 | 0;
                    } else {
                        ni = mathceil( ( i + 1 ) / LOG_BASE );

                        if ( ni >= xc.length ) {

                            if (r) {

                                // Needed by sqrt.
                                for ( ; xc.length <= ni; xc.push(0) );
                                n = rd = 0;
                                d = 1;
                                i %= LOG_BASE;
                                j = i - LOG_BASE + 1;
                            } else {
                                break out;
                            }
                        } else {
                            n = k = xc[ni];

                            // Get the number of digits of n.
                            for ( d = 1; k >= 10; k /= 10, d++ );

                            // Get the index of rd within n.
                            i %= LOG_BASE;

                            // Get the index of rd within n, adjusted for leading zeros.
                            // The number of leading zeros of n is given by LOG_BASE - d.
                            j = i - LOG_BASE + d;

                            // Get the rounding digit at index j of n.
                            rd = j < 0 ? 0 : n / pows10[ d - j - 1 ] % 10 | 0;
                        }
                    }

                    r = r || sd < 0 ||

                    // Are there any non-zero digits after the rounding digit?
                    // The expression  n % pows10[ d - j - 1 ]  returns all digits of n to the right
                    // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                      xc[ni + 1] != null || ( j < 0 ? n : n % pows10[ d - j - 1 ] );

                    r = rm < 4
                      ? ( rd || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                      : rd > 5 || rd == 5 && ( rm == 4 || r || rm == 6 &&

                        // Check whether the digit to the left of the rounding digit is odd.
                        ( ( i > 0 ? j > 0 ? n / pows10[ d - j ] : 0 : xc[ni - 1] ) % 10 ) & 1 ||
                          rm == ( x.s < 0 ? 8 : 7 ) );

                    if ( sd < 1 || !xc[0] ) {
                        xc.length = 0;

                        if (r) {

                            // Convert sd to decimal places.
                            sd -= x.e + 1;

                            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                            xc[0] = pows10[ sd % LOG_BASE ];
                            x.e = -sd || 0;
                        } else {

                            // Zero.
                            xc[0] = x.e = 0;
                        }

                        return x;
                    }

                    // Remove excess digits.
                    if ( i == 0 ) {
                        xc.length = ni;
                        k = 1;
                        ni--;
                    } else {
                        xc.length = ni + 1;
                        k = pows10[ LOG_BASE - i ];

                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                        // j > 0 means i > number of leading zeros of n.
                        xc[ni] = j > 0 ? mathfloor( n / pows10[ d - j ] % pows10[j] ) * k : 0;
                    }

                    // Round up?
                    if (r) {

                        for ( ; ; ) {

                            // If the digit to be rounded up is in the first element of xc...
                            if ( ni == 0 ) {

                                // i will be the length of xc[0] before k is added.
                                for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );
                                j = xc[0] += k;
                                for ( k = 1; j >= 10; j /= 10, k++ );

                                // if i != k the length has increased.
                                if ( i != k ) {
                                    x.e++;
                                    if ( xc[0] == BASE ) xc[0] = 1;
                                }

                                break;
                            } else {
                                xc[ni] += k;
                                if ( xc[ni] != BASE ) break;
                                xc[ni--] = 0;
                                k = 1;
                            }
                        }
                    }

                    // Remove trailing zeros.
                    for ( i = xc.length; xc[--i] === 0; xc.pop() );
                }

                // Overflow? Infinity.
                if ( x.e > MAX_EXP ) {
                    x.c = x.e = null;

                // Underflow? Zero.
                } else if ( x.e < MIN_EXP ) {
                    x.c = [ x.e = 0 ];
                }
            }

            return x;
        }


        // PROTOTYPE/INSTANCE METHODS


        /*
         * Return a new BigNumber whose value is the absolute value of this BigNumber.
         */
        P.absoluteValue = P.abs = function () {
            var x = new BigNumber(this);
            if ( x.s < 0 ) x.s = 1;
            return x;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of Infinity.
         */
        P.ceil = function () {
            return round( new BigNumber(this), this.e + 1, 2 );
        };


        /*
         * Return
         * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
         * 0 if they have the same value,
         * or null if the value of either is NaN.
         */
        P.comparedTo = P.cmp = function ( y, b ) {
            id = 1;
            return compare( this, new BigNumber( y, b ) );
        };


        /*
         * Return the number of decimal places of the value of this BigNumber, or null if the value
         * of this BigNumber is ±Infinity or NaN.
         */
        P.decimalPlaces = P.dp = function () {
            var n, v,
                c = this.c;

            if ( !c ) return null;
            n = ( ( v = c.length - 1 ) - bitFloor( this.e / LOG_BASE ) ) * LOG_BASE;

            // Subtract the number of trailing zeros of the last number.
            if ( v = c[v] ) for ( ; v % 10 == 0; v /= 10, n-- );
            if ( n < 0 ) n = 0;

            return n;
        };


        /*
         *  n / 0 = I
         *  n / N = N
         *  n / I = 0
         *  0 / n = 0
         *  0 / 0 = N
         *  0 / N = N
         *  0 / I = 0
         *  N / n = N
         *  N / 0 = N
         *  N / N = N
         *  N / I = N
         *  I / n = I
         *  I / 0 = I
         *  I / N = N
         *  I / I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.dividedBy = P.div = function ( y, b ) {
            id = 3;
            return div( this, new BigNumber( y, b ), DECIMAL_PLACES, ROUNDING_MODE );
        };


        /*
         * Return a new BigNumber whose value is the integer part of dividing the value of this
         * BigNumber by the value of BigNumber(y, b).
         */
        P.dividedToIntegerBy = P.divToInt = function ( y, b ) {
            id = 4;
            return div( this, new BigNumber( y, b ), 0, 1 );
        };


        /*
         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.equals = P.eq = function ( y, b ) {
            id = 5;
            return compare( this, new BigNumber( y, b ) ) === 0;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of -Infinity.
         */
        P.floor = function () {
            return round( new BigNumber(this), this.e + 1, 3 );
        };


        /*
         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.greaterThan = P.gt = function ( y, b ) {
            id = 6;
            return compare( this, new BigNumber( y, b ) ) > 0;
        };


        /*
         * Return true if the value of this BigNumber is greater than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.greaterThanOrEqualTo = P.gte = function ( y, b ) {
            id = 7;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === 1 || b === 0;

        };


        /*
         * Return true if the value of this BigNumber is a finite number, otherwise returns false.
         */
        P.isFinite = function () {
            return !!this.c;
        };


        /*
         * Return true if the value of this BigNumber is an integer, otherwise return false.
         */
        P.isInteger = P.isInt = function () {
            return !!this.c && bitFloor( this.e / LOG_BASE ) > this.c.length - 2;
        };


        /*
         * Return true if the value of this BigNumber is NaN, otherwise returns false.
         */
        P.isNaN = function () {
            return !this.s;
        };


        /*
         * Return true if the value of this BigNumber is negative, otherwise returns false.
         */
        P.isNegative = P.isNeg = function () {
            return this.s < 0;
        };


        /*
         * Return true if the value of this BigNumber is 0 or -0, otherwise returns false.
         */
        P.isZero = function () {
            return !!this.c && this.c[0] == 0;
        };


        /*
         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.lessThan = P.lt = function ( y, b ) {
            id = 8;
            return compare( this, new BigNumber( y, b ) ) < 0;
        };


        /*
         * Return true if the value of this BigNumber is less than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.lessThanOrEqualTo = P.lte = function ( y, b ) {
            id = 9;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === -1 || b === 0;
        };


        /*
         *  n - 0 = n
         *  n - N = N
         *  n - I = -I
         *  0 - n = -n
         *  0 - 0 = 0
         *  0 - N = N
         *  0 - I = -I
         *  N - n = N
         *  N - 0 = N
         *  N - N = N
         *  N - I = N
         *  I - n = I
         *  I - 0 = I
         *  I - N = N
         *  I - I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
         * BigNumber(y, b).
         */
        P.minus = P.sub = function ( y, b ) {
            var i, j, t, xLTy,
                x = this,
                a = x.s;

            id = 10;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
            if ( a != b ) {
                y.s = -b;
                return x.plus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Either Infinity?
                if ( !xc || !yc ) return xc ? ( y.s = -b, y ) : new BigNumber( yc ? x : NaN );

                // Either zero?
                if ( !xc[0] || !yc[0] ) {

                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                    return yc[0] ? ( y.s = -b, y ) : new BigNumber( xc[0] ? x :

                      // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                      ROUNDING_MODE == 3 ? -0 : 0 );
                }
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Determine which is the bigger number.
            if ( a = xe - ye ) {

                if ( xLTy = a < 0 ) {
                    a = -a;
                    t = xc;
                } else {
                    ye = xe;
                    t = yc;
                }

                t.reverse();

                // Prepend zeros to equalise exponents.
                for ( b = a; b--; t.push(0) );
                t.reverse();
            } else {

                // Exponents equal. Check digit by digit.
                j = ( xLTy = ( a = xc.length ) < ( b = yc.length ) ) ? a : b;

                for ( a = b = 0; b < j; b++ ) {

                    if ( xc[b] != yc[b] ) {
                        xLTy = xc[b] < yc[b];
                        break;
                    }
                }
            }

            // x < y? Point xc to the array of the bigger number.
            if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

            b = ( j = yc.length ) - ( i = xc.length );

            // Append zeros to xc if shorter.
            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
            if ( b > 0 ) for ( ; b--; xc[i++] = 0 );
            b = BASE - 1;

            // Subtract yc from xc.
            for ( ; j > a; ) {

                if ( xc[--j] < yc[j] ) {
                    for ( i = j; i && !xc[--i]; xc[i] = b );
                    --xc[i];
                    xc[j] += BASE;
                }

                xc[j] -= yc[j];
            }

            // Remove leading zeros and adjust exponent accordingly.
            for ( ; xc[0] == 0; xc.shift(), --ye );

            // Zero?
            if ( !xc[0] ) {

                // Following IEEE 754 (2008) 6.3,
                // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
                y.s = ROUNDING_MODE == 3 ? -1 : 1;
                y.c = [ y.e = 0 ];
                return y;
            }

            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
            // for finite x and y.
            return normalise( y, xc, ye );
        };


        /*
         *   n % 0 =  N
         *   n % N =  N
         *   n % I =  n
         *   0 % n =  0
         *  -0 % n = -0
         *   0 % 0 =  N
         *   0 % N =  N
         *   0 % I =  0
         *   N % n =  N
         *   N % 0 =  N
         *   N % N =  N
         *   N % I =  N
         *   I % n =  N
         *   I % 0 =  N
         *   I % N =  N
         *   I % I =  N
         *
         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
         */
        P.modulo = P.mod = function ( y, b ) {
            var q, s,
                x = this;

            id = 11;
            y = new BigNumber( y, b );

            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
            if ( !x.c || !y.s || y.c && !y.c[0] ) {
                return new BigNumber(NaN);

            // Return x if y is Infinity or x is zero.
            } else if ( !y.c || x.c && !x.c[0] ) {
                return new BigNumber(x);
            }

            if ( MODULO_MODE == 9 ) {

                // Euclidian division: q = sign(y) * floor(x / abs(y))
                // r = x - qy    where  0 <= r < abs(y)
                s = y.s;
                y.s = 1;
                q = div( x, y, 0, 3 );
                y.s = s;
                q.s *= s;
            } else {
                q = div( x, y, 0, MODULO_MODE );
            }

            return x.minus( q.times(y) );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber negated,
         * i.e. multiplied by -1.
         */
        P.negated = P.neg = function () {
            var x = new BigNumber(this);
            x.s = -x.s || null;
            return x;
        };


        /*
         *  n + 0 = n
         *  n + N = N
         *  n + I = I
         *  0 + n = n
         *  0 + 0 = 0
         *  0 + N = N
         *  0 + I = I
         *  N + n = N
         *  N + 0 = N
         *  N + N = N
         *  N + I = N
         *  I + n = I
         *  I + 0 = I
         *  I + N = N
         *  I + I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
         * BigNumber(y, b).
         */
        P.plus = P.add = function ( y, b ) {
            var t,
                x = this,
                a = x.s;

            id = 12;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
             if ( a != b ) {
                y.s = -b;
                return x.minus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Return ±Infinity if either ±Infinity.
                if ( !xc || !yc ) return new BigNumber( a / 0 );

                // Either zero?
                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                if ( !xc[0] || !yc[0] ) return yc[0] ? y : new BigNumber( xc[0] ? x : a * 0 );
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
            if ( a = xe - ye ) {
                if ( a > 0 ) {
                    ye = xe;
                    t = yc;
                } else {
                    a = -a;
                    t = xc;
                }

                t.reverse();
                for ( ; a--; t.push(0) );
                t.reverse();
            }

            a = xc.length;
            b = yc.length;

            // Point xc to the longer array, and b to the shorter length.
            if ( a - b < 0 ) t = yc, yc = xc, xc = t, b = a;

            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
            for ( a = 0; b; ) {
                a = ( xc[--b] = xc[b] + yc[b] + a ) / BASE | 0;
                xc[b] %= BASE;
            }

            if (a) {
                xc.unshift(a);
                ++ye;
            }

            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
            // ye = MAX_EXP + 1 possible
            return normalise( y, xc, ye );
        };


        /*
         * Return the number of significant digits of the value of this BigNumber.
         *
         * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
         */
        P.precision = P.sd = function (z) {
            var n, v,
                x = this,
                c = x.c;

            // 'precision() argument not a boolean or binary digit: {z}'
            if ( z != null && z !== !!z && z !== 1 && z !== 0 ) {
                if (ERRORS) raise( 13, 'argument' + notBool, z );
                if ( z != !!z ) z = null;
            }

            if ( !c ) return null;
            v = c.length - 1;
            n = v * LOG_BASE + 1;

            if ( v = c[v] ) {

                // Subtract the number of trailing zeros of the last element.
                for ( ; v % 10 == 0; v /= 10, n-- );

                // Add the number of digits of the first element.
                for ( v = c[0]; v >= 10; v /= 10, n++ );
            }

            if ( z && x.e + 1 > n ) n = x.e + 1;

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * dp decimal places using rounding mode rm, or to 0 and ROUNDING_MODE respectively if
         * omitted.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'round() decimal places out of range: {dp}'
         * 'round() decimal places not an integer: {dp}'
         * 'round() rounding mode not an integer: {rm}'
         * 'round() rounding mode out of range: {rm}'
         */
        P.round = function ( dp, rm ) {
            var n = new BigNumber(this);

            if ( dp == null || isValidInt( dp, 0, MAX, 15 ) ) {
                round( n, ~~dp + this.e + 1, rm == null ||
                  !isValidInt( rm, 0, 8, 15, roundingMode ) ? ROUNDING_MODE : rm | 0 );
            }

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
         *
         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         *
         * If k is out of range and ERRORS is false, the result will be ±0 if k < 0, or ±Infinity
         * otherwise.
         *
         * 'shift() argument not an integer: {k}'
         * 'shift() argument out of range: {k}'
         */
        P.shift = function (k) {
            var n = this;
            return isValidInt( k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 16, 'argument' )

              // k < 1e+21, or truncate(k) will produce exponential notation.
              ? n.times( '1e' + truncate(k) )
              : new BigNumber( n.c && n.c[0] && ( k < -MAX_SAFE_INTEGER || k > MAX_SAFE_INTEGER )
                ? n.s * ( k < 0 ? 0 : 1 / 0 )
                : n );
        };


        /*
         *  sqrt(-n) =  N
         *  sqrt( N) =  N
         *  sqrt(-I) =  N
         *  sqrt( I) =  I
         *  sqrt( 0) =  0
         *  sqrt(-0) = -0
         *
         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.squareRoot = P.sqrt = function () {
            var m, n, r, rep, t,
                x = this,
                c = x.c,
                s = x.s,
                e = x.e,
                dp = DECIMAL_PLACES + 4,
                half = new BigNumber('0.5');

            // Negative/NaN/Infinity/zero?
            if ( s !== 1 || !c || !c[0] ) {
                return new BigNumber( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
            }

            // Initial estimate.
            s = Math.sqrt( +x );

            // Math.sqrt underflow/overflow?
            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
            if ( s == 0 || s == 1 / 0 ) {
                n = coeffToString(c);
                if ( ( n.length + e ) % 2 == 0 ) n += '0';
                s = Math.sqrt(n);
                e = bitFloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );

                if ( s == 1 / 0 ) {
                    n = '1e' + e;
                } else {
                    n = s.toExponential();
                    n = n.slice( 0, n.indexOf('e') + 1 ) + e;
                }

                r = new BigNumber(n);
            } else {
                r = new BigNumber( s + '' );
            }

            // Check for zero.
            // r could be zero if MIN_EXP is changed after the this value was created.
            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
            // coeffToString to throw.
            if ( r.c[0] ) {
                e = r.e;
                s = e + dp;
                if ( s < 3 ) s = 0;

                // Newton-Raphson iteration.
                for ( ; ; ) {
                    t = r;
                    r = half.times( t.plus( div( x, t, dp, 1 ) ) );

                    if ( coeffToString( t.c   ).slice( 0, s ) === ( n =
                         coeffToString( r.c ) ).slice( 0, s ) ) {

                        // The exponent of r may here be one less than the final result exponent,
                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                        // are indexed correctly.
                        if ( r.e < e ) --s;
                        n = n.slice( s - 3, s + 1 );

                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                        // iteration.
                        if ( n == '9999' || !rep && n == '4999' ) {

                            // On the first iteration only, check to see if rounding up gives the
                            // exact result as the nines may infinitely repeat.
                            if ( !rep ) {
                                round( t, t.e + DECIMAL_PLACES + 2, 0 );

                                if ( t.times(t).eq(x) ) {
                                    r = t;
                                    break;
                                }
                            }

                            dp += 4;
                            s += 4;
                            rep = 1;
                        } else {

                            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                            // result. If not, then there are further digits and m will be truthy.
                            if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {

                                // Truncate to the first rounding digit.
                                round( r, r.e + DECIMAL_PLACES + 2, 1 );
                                m = !r.times(r).eq(x);
                            }

                            break;
                        }
                    }
                }
            }

            return round( r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m );
        };


        /*
         *  n * 0 = 0
         *  n * N = N
         *  n * I = I
         *  0 * n = 0
         *  0 * 0 = 0
         *  0 * N = N
         *  0 * I = N
         *  N * n = N
         *  N * 0 = N
         *  N * N = N
         *  N * I = N
         *  I * n = I
         *  I * 0 = N
         *  I * N = N
         *  I * I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber times the value of
         * BigNumber(y, b).
         */
        P.times = P.mul = function ( y, b ) {
            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
                base, sqrtBase,
                x = this,
                xc = x.c,
                yc = ( id = 17, y = new BigNumber( y, b ) ).c;

            // Either NaN, ±Infinity or ±0?
            if ( !xc || !yc || !xc[0] || !yc[0] ) {

                // Return NaN if either is NaN, or one is 0 and the other is Infinity.
                if ( !x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc ) {
                    y.c = y.e = y.s = null;
                } else {
                    y.s *= x.s;

                    // Return ±Infinity if either is ±Infinity.
                    if ( !xc || !yc ) {
                        y.c = y.e = null;

                    // Return ±0 if either is ±0.
                    } else {
                        y.c = [0];
                        y.e = 0;
                    }
                }

                return y;
            }

            e = bitFloor( x.e / LOG_BASE ) + bitFloor( y.e / LOG_BASE );
            y.s *= x.s;
            xcL = xc.length;
            ycL = yc.length;

            // Ensure xc points to longer array and xcL to its length.
            if ( xcL < ycL ) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

            // Initialise the result array with zeros.
            for ( i = xcL + ycL, zc = []; i--; zc.push(0) );

            base = BASE;
            sqrtBase = SQRT_BASE;

            for ( i = ycL; --i >= 0; ) {
                c = 0;
                ylo = yc[i] % sqrtBase;
                yhi = yc[i] / sqrtBase | 0;

                for ( k = xcL, j = i + k; j > i; ) {
                    xlo = xc[--k] % sqrtBase;
                    xhi = xc[k] / sqrtBase | 0;
                    m = yhi * xlo + xhi * ylo;
                    xlo = ylo * xlo + ( ( m % sqrtBase ) * sqrtBase ) + zc[j] + c;
                    c = ( xlo / base | 0 ) + ( m / sqrtBase | 0 ) + yhi * xhi;
                    zc[j--] = xlo % base;
                }

                zc[j] = c;
            }

            if (c) {
                ++e;
            } else {
                zc.shift();
            }

            return normalise( y, zc, e );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * sd significant digits using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toDigits() precision out of range: {sd}'
         * 'toDigits() precision not an integer: {sd}'
         * 'toDigits() rounding mode not an integer: {rm}'
         * 'toDigits() rounding mode out of range: {rm}'
         */
        P.toDigits = function ( sd, rm ) {
            var n = new BigNumber(this);
            sd = sd == null || !isValidInt( sd, 1, MAX, 18, 'precision' ) ? null : sd | 0;
            rm = rm == null || !isValidInt( rm, 0, 8, 18, roundingMode ) ? ROUNDING_MODE : rm | 0;
            return sd ? round( n, sd, rm ) : n;
        };


        /*
         * Return a string representing the value of this BigNumber in exponential notation and
         * rounded using ROUNDING_MODE to dp fixed decimal places.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toExponential() decimal places not an integer: {dp}'
         * 'toExponential() decimal places out of range: {dp}'
         * 'toExponential() rounding mode not an integer: {rm}'
         * 'toExponential() rounding mode out of range: {rm}'
         */
        P.toExponential = function ( dp, rm ) {
            return format( this,
              dp != null && isValidInt( dp, 0, MAX, 19 ) ? ~~dp + 1 : null, rm, 19 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounding
         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
         * but e.g. (-0.00001).toFixed(0) is '-0'.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFixed() decimal places not an integer: {dp}'
         * 'toFixed() decimal places out of range: {dp}'
         * 'toFixed() rounding mode not an integer: {rm}'
         * 'toFixed() rounding mode out of range: {rm}'
         */
        P.toFixed = function ( dp, rm ) {
            return format( this, dp != null && isValidInt( dp, 0, MAX, 20 )
              ? ~~dp + this.e + 1 : null, rm, 20 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounded
         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
         * of the FORMAT object (see BigNumber.config).
         *
         * FORMAT = {
         *      decimalSeparator : '.',
         *      groupSeparator : ',',
         *      groupSize : 3,
         *      secondaryGroupSize : 0,
         *      fractionGroupSeparator : '\xA0',    // non-breaking space
         *      fractionGroupSize : 0
         * };
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFormat() decimal places not an integer: {dp}'
         * 'toFormat() decimal places out of range: {dp}'
         * 'toFormat() rounding mode not an integer: {rm}'
         * 'toFormat() rounding mode out of range: {rm}'
         */
        P.toFormat = function ( dp, rm ) {
            var str = format( this, dp != null && isValidInt( dp, 0, MAX, 21 )
              ? ~~dp + this.e + 1 : null, rm, 21 );

            if ( this.c ) {
                var i,
                    arr = str.split('.'),
                    g1 = +FORMAT.groupSize,
                    g2 = +FORMAT.secondaryGroupSize,
                    groupSeparator = FORMAT.groupSeparator,
                    intPart = arr[0],
                    fractionPart = arr[1],
                    isNeg = this.s < 0,
                    intDigits = isNeg ? intPart.slice(1) : intPart,
                    len = intDigits.length;

                if (g2) i = g1, g1 = g2, g2 = i, len -= i;

                if ( g1 > 0 && len > 0 ) {
                    i = len % g1 || g1;
                    intPart = intDigits.substr( 0, i );

                    for ( ; i < len; i += g1 ) {
                        intPart += groupSeparator + intDigits.substr( i, g1 );
                    }

                    if ( g2 > 0 ) intPart += groupSeparator + intDigits.slice(i);
                    if (isNeg) intPart = '-' + intPart;
                }

                str = fractionPart
                  ? intPart + FORMAT.decimalSeparator + ( ( g2 = +FORMAT.fractionGroupSize )
                    ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
                      '$&' + FORMAT.fractionGroupSeparator )
                    : fractionPart )
                  : intPart;
            }

            return str;
        };


        /*
         * Return a string array representing the value of this BigNumber as a simple fraction with
         * an integer numerator and an integer denominator. The denominator will be a positive
         * non-zero value less than or equal to the specified maximum denominator. If a maximum
         * denominator is not specified, the denominator will be the lowest value necessary to
         * represent the number exactly.
         *
         * [md] {number|string|BigNumber} Integer >= 1 and < Infinity. The maximum denominator.
         *
         * 'toFraction() max denominator not an integer: {md}'
         * 'toFraction() max denominator out of range: {md}'
         */
        P.toFraction = function (md) {
            var arr, d0, d2, e, exp, n, n0, q, s,
                k = ERRORS,
                x = this,
                xc = x.c,
                d = new BigNumber(ONE),
                n1 = d0 = new BigNumber(ONE),
                d1 = n0 = new BigNumber(ONE);

            if ( md != null ) {
                ERRORS = false;
                n = new BigNumber(md);
                ERRORS = k;

                if ( !( k = n.isInt() ) || n.lt(ONE) ) {

                    if (ERRORS) {
                        raise( 22,
                          'max denominator ' + ( k ? 'out of range' : 'not an integer' ), md );
                    }

                    // ERRORS is false:
                    // If md is a finite non-integer >= 1, round it to an integer and use it.
                    md = !k && n.c && round( n, n.e + 1, 1 ).gte(ONE) ? n : null;
                }
            }

            if ( !xc ) return x.toString();
            s = coeffToString(xc);

            // Determine initial denominator.
            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
            e = d.e = s.length - x.e - 1;
            d.c[0] = POWS_TEN[ ( exp = e % LOG_BASE ) < 0 ? LOG_BASE + exp : exp ];
            md = !md || n.cmp(d) > 0 ? ( e > 0 ? d : n1 ) : n;

            exp = MAX_EXP;
            MAX_EXP = 1 / 0;
            n = new BigNumber(s);

            // n0 = d1 = 0
            n0.c[0] = 0;

            for ( ; ; )  {
                q = div( n, d, 0, 1 );
                d2 = d0.plus( q.times(d1) );
                if ( d2.cmp(md) == 1 ) break;
                d0 = d1;
                d1 = d2;
                n1 = n0.plus( q.times( d2 = n1 ) );
                n0 = d2;
                d = n.minus( q.times( d2 = d ) );
                n = d2;
            }

            d2 = div( md.minus(d0), d1, 0, 1 );
            n0 = n0.plus( d2.times(n1) );
            d0 = d0.plus( d2.times(d1) );
            n0.s = n1.s = x.s;
            e *= 2;

            // Determine which fraction is closer to x, n0/d0 or n1/d1
            arr = div( n1, d1, e, ROUNDING_MODE ).minus(x).abs().cmp(
                  div( n0, d0, e, ROUNDING_MODE ).minus(x).abs() ) < 1
                    ? [ n1.toString(), d1.toString() ]
                    : [ n0.toString(), d0.toString() ];

            MAX_EXP = exp;
            return arr;
        };


        /*
         * Return the value of this BigNumber converted to a number primitive.
         */
        P.toNumber = function () {
            var x = this;

            // Ensure zero has correct sign.
            return +x || ( x.s ? x.s * 0 : NaN );
        };


        /*
         * Return a BigNumber whose value is the value of this BigNumber raised to the power n.
         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
         * If POW_PRECISION is not 0, round to POW_PRECISION using ROUNDING_MODE.
         *
         * n {number} Integer, -9007199254740992 to 9007199254740992 inclusive.
         * (Performs 54 loop iterations for n of 9007199254740992.)
         *
         * 'pow() exponent not an integer: {n}'
         * 'pow() exponent out of range: {n}'
         */
        P.toPower = P.pow = function (n) {
            var k, y,
                i = mathfloor( n < 0 ? -n : +n ),
                x = this;

            // Pass ±Infinity to Math.pow if exponent is out of range.
            if ( !isValidInt( n, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 23, 'exponent' ) &&
              ( !isFinite(n) || i > MAX_SAFE_INTEGER && ( n /= 0 ) ||
                parseFloat(n) != n && !( n = NaN ) ) ) {
                return new BigNumber( Math.pow( +x, n ) );
            }

            // Truncating each coefficient array to a length of k after each multiplication equates
            // to truncating significant digits to POW_PRECISION + [28, 41], i.e. there will be a
            // minimum of 28 guard digits retained. (Using + 1.5 would give [9, 21] guard digits.)
            k = POW_PRECISION ? mathceil( POW_PRECISION / LOG_BASE + 2 ) : 0;
            y = new BigNumber(ONE);

            for ( ; ; ) {

                if ( i % 2 ) {
                    y = y.times(x);
                    if ( !y.c ) break;
                    if ( k && y.c.length > k ) y.c.length = k;
                }

                i = mathfloor( i / 2 );
                if ( !i ) break;

                x = x.times(x);
                if ( k && x.c && x.c.length > k ) x.c.length = k;
            }

            if ( n < 0 ) y = ONE.div(y);
            return k ? round( y, POW_PRECISION, ROUNDING_MODE ) : y;
        };


        /*
         * Return a string representing the value of this BigNumber rounded to sd significant digits
         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
         * necessary to represent the integer part of the value in fixed-point notation, then use
         * exponential notation.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toPrecision() precision not an integer: {sd}'
         * 'toPrecision() precision out of range: {sd}'
         * 'toPrecision() rounding mode not an integer: {rm}'
         * 'toPrecision() rounding mode out of range: {rm}'
         */
        P.toPrecision = function ( sd, rm ) {
            return format( this, sd != null && isValidInt( sd, 1, MAX, 24, 'precision' )
              ? sd | 0 : null, rm, 24 );
        };


        /*
         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
         * TO_EXP_NEG, return exponential notation.
         *
         * [b] {number} Integer, 2 to 64 inclusive.
         *
         * 'toString() base not an integer: {b}'
         * 'toString() base out of range: {b}'
         */
        P.toString = function (b) {
            var str,
                n = this,
                s = n.s,
                e = n.e;

            // Infinity or NaN?
            if ( e === null ) {

                if (s) {
                    str = 'Infinity';
                    if ( s < 0 ) str = '-' + str;
                } else {
                    str = 'NaN';
                }
            } else {
                str = coeffToString( n.c );

                if ( b == null || !isValidInt( b, 2, 64, 25, 'base' ) ) {
                    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                      ? toExponential( str, e )
                      : toFixedPoint( str, e );
                } else {
                    str = convertBase( toFixedPoint( str, e ), b | 0, 10, s );
                }

                if ( s < 0 && n.c[0] ) str = '-' + str;
            }

            return str;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber truncated to a whole
         * number.
         */
        P.truncated = P.trunc = function () {
            return round( new BigNumber(this), this.e + 1, 1 );
        };



        /*
         * Return as toString, but do not accept a base argument.
         */
        P.valueOf = P.toJSON = function () {
            return this.toString();
        };


        // Aliases for BigDecimal methods.
        //P.add = P.plus;         // P.add included above
        //P.subtract = P.minus;   // P.sub included above
        //P.multiply = P.times;   // P.mul included above
        //P.divide = P.div;
        //P.remainder = P.mod;
        //P.compareTo = P.cmp;
        //P.negate = P.neg;


        if ( configObj != null ) BigNumber.config(configObj);

        return BigNumber;
    }


    // PRIVATE HELPER FUNCTIONS


    function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
    }


    // Return a coefficient array as a string of base 10 digits.
    function coeffToString(a) {
        var s, z,
            i = 1,
            j = a.length,
            r = a[0] + '';

        for ( ; i < j; ) {
            s = a[i++] + '';
            z = LOG_BASE - s.length;
            for ( ; z--; s = '0' + s );
            r += s;
        }

        // Determine trailing zeros.
        for ( j = r.length; r.charCodeAt(--j) === 48; );
        return r.slice( 0, j + 1 || 1 );
    }


    // Compare the value of BigNumbers x and y.
    function compare( x, y ) {
        var a, b,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either NaN?
        if ( !i || !j ) return null;

        a = xc && !xc[0];
        b = yc && !yc[0];

        // Either zero?
        if ( a || b ) return a ? b ? 0 : -j : i;

        // Signs differ?
        if ( i != j ) return i;

        a = i < 0;
        b = k == l;

        // Either Infinity?
        if ( !xc || !yc ) return b ? 0 : !xc ^ a ? 1 : -1;

        // Compare exponents.
        if ( !b ) return k > l ^ a ? 1 : -1;

        j = ( k = xc.length ) < ( l = yc.length ) ? k : l;

        // Compare digit by digit.
        for ( i = 0; i < j; i++ ) if ( xc[i] != yc[i] ) return xc[i] > yc[i] ^ a ? 1 : -1;

        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    }


    /*
     * Return true if n is a valid number in range, otherwise false.
     * Use for argument validation when ERRORS is false.
     * Note: parseInt('1e+1') == 1 but parseFloat('1e+1') == 10.
     */
    function intValidatorNoErrors( n, min, max ) {
        return ( n = truncate(n) ) >= min && n <= max;
    }


    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }


    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. convertBase('255', 10, 16) returns [15, 15].
     * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut( str, baseIn, baseOut ) {
        var j,
            arr = [0],
            arrL,
            i = 0,
            len = str.length;

        for ( ; i < len; ) {
            for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
            arr[ j = 0 ] += ALPHABET.indexOf( str.charAt( i++ ) );

            for ( ; j < arr.length; j++ ) {

                if ( arr[j] > baseOut - 1 ) {
                    if ( arr[j + 1] == null ) arr[j + 1] = 0;
                    arr[j + 1] += arr[j] / baseOut | 0;
                    arr[j] %= baseOut;
                }
            }
        }

        return arr.reverse();
    }


    function toExponential( str, e ) {
        return ( str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str ) +
          ( e < 0 ? 'e' : 'e+' ) + e;
    }


    function toFixedPoint( str, e ) {
        var len, z;

        // Negative exponent?
        if ( e < 0 ) {

            // Prepend zeros.
            for ( z = '0.'; ++e; z += '0' );
            str = z + str;

        // Positive exponent
        } else {
            len = str.length;

            // Append zeros.
            if ( ++e > len ) {
                for ( z = '0', e -= len; --e; z += '0' );
                str += z;
            } else if ( e < len ) {
                str = str.slice( 0, e ) + '.' + str.slice(e);
            }
        }

        return str;
    }


    function truncate(n) {
        n = parseFloat(n);
        return n < 0 ? mathceil(n) : mathfloor(n);
    }


    // EXPORT


    BigNumber = another();

    // AMD.
    if ( typeof define == 'function' && define.amd ) {
        define( function () { return BigNumber; } );

    // Node and other environments that support module.exports.
    } else if ( typeof module != 'undefined' && module.exports ) {
        module.exports = BigNumber;
        if ( !crypto ) try { crypto = require('crypto'); } catch (e) {}

    // Browser.
    } else {
        global.BigNumber = BigNumber;
    }
})(this);

},{"crypto":31}],"web3":[function(require,module,exports){
var web3 = require('./lib/web3');
web3.providers.HttpProvider = require('./lib/web3/httpprovider');
web3.providers.QtSyncProvider = require('./lib/web3/qtsync');
web3.eth.contract = require('./lib/web3/contract');
web3.eth.namereg = require('./lib/web3/namereg');
web3.eth.sendIBANTransaction = require('./lib/web3/transfer');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3 === 'undefined') {
    window.web3 = web3;
}

module.exports = web3;


},{"./lib/web3":9,"./lib/web3/contract":11,"./lib/web3/httpprovider":19,"./lib/web3/namereg":23,"./lib/web3/qtsync":26,"./lib/web3/transfer":29}]},{},["web3"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvc29saWRpdHkvY29kZXIuanMiLCJsaWIvc29saWRpdHkvZm9ybWF0dGVycy5qcyIsImxpYi9zb2xpZGl0eS9wYXJhbS5qcyIsImxpYi91dGlscy9icm93c2VyLXhoci5qcyIsImxpYi91dGlscy9jb25maWcuanMiLCJsaWIvdXRpbHMvc2hhMy5qcyIsImxpYi91dGlscy91dGlscy5qcyIsImxpYi92ZXJzaW9uLmpzb24iLCJsaWIvd2ViMy5qcyIsImxpYi93ZWIzL2JhdGNoLmpzIiwibGliL3dlYjMvY29udHJhY3QuanMiLCJsaWIvd2ViMy9kYi5qcyIsImxpYi93ZWIzL2Vycm9ycy5qcyIsImxpYi93ZWIzL2V0aC5qcyIsImxpYi93ZWIzL2V2ZW50LmpzIiwibGliL3dlYjMvZmlsdGVyLmpzIiwibGliL3dlYjMvZm9ybWF0dGVycy5qcyIsImxpYi93ZWIzL2Z1bmN0aW9uLmpzIiwibGliL3dlYjMvaHR0cHByb3ZpZGVyLmpzIiwibGliL3dlYjMvaWNhcC5qcyIsImxpYi93ZWIzL2pzb25ycGMuanMiLCJsaWIvd2ViMy9tZXRob2QuanMiLCJsaWIvd2ViMy9uYW1lcmVnLmpzIiwibGliL3dlYjMvbmV0LmpzIiwibGliL3dlYjMvcHJvcGVydHkuanMiLCJsaWIvd2ViMy9xdHN5bmMuanMiLCJsaWIvd2ViMy9yZXF1ZXN0bWFuYWdlci5qcyIsImxpYi93ZWIzL3NoaC5qcyIsImxpYi93ZWIzL3RyYW5zZmVyLmpzIiwibGliL3dlYjMvd2F0Y2hlcy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiLCJub2RlX21vZHVsZXMvY3J5cHRvLWpzL2NvcmUuanMiLCJub2RlX21vZHVsZXMvY3J5cHRvLWpzL3NoYTMuanMiLCJub2RlX21vZHVsZXMvY3J5cHRvLWpzL3g2NC1jb3JlLmpzIiwiYmlnbnVtYmVyLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsZkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3J1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSBjb2Rlci5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG52YXIgQmlnTnVtYmVyID0gcmVxdWlyZSgnYmlnbnVtYmVyLmpzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy91dGlscycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Zvcm1hdHRlcnMnKTtcbnZhciBTb2xpZGl0eVBhcmFtID0gcmVxdWlyZSgnLi9wYXJhbScpO1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGNoZWNrIGlmIGEgdHlwZSBpcyBhbiBhcnJheSB0eXBlXG4gKlxuICogQG1ldGhvZCBpc0FycmF5VHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge0Jvb2x9IHRydWUgaXMgdGhlIHR5cGUgaXMgYW4gYXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG52YXIgaXNBcnJheVR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIHJldHVybiB0eXBlLnNsaWNlKC0yKSA9PT0gJ1tdJztcbn07XG5cbi8qKlxuICogU29saWRpdHlUeXBlIHByb3RvdHlwZSBpcyB1c2VkIHRvIGVuY29kZS9kZWNvZGUgc29saWRpdHkgcGFyYW1zIG9mIGNlcnRhaW4gdHlwZVxuICovXG52YXIgU29saWRpdHlUeXBlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIHRoaXMuX25hbWUgPSBjb25maWcubmFtZTtcbiAgICB0aGlzLl9tYXRjaCA9IGNvbmZpZy5tYXRjaDtcbiAgICB0aGlzLl9tb2RlID0gY29uZmlnLm1vZGU7XG4gICAgdGhpcy5faW5wdXRGb3JtYXR0ZXIgPSBjb25maWcuaW5wdXRGb3JtYXR0ZXI7XG4gICAgdGhpcy5fb3V0cHV0Rm9ybWF0dGVyID0gY29uZmlnLm91dHB1dEZvcm1hdHRlcjtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgU29saWRpdHlUeXBlIGRvIG1hdGNoIGdpdmVuIHR5cGVcbiAqXG4gKiBAbWV0aG9kIGlzVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2x9IHRydWUgaWYgdHlwZSBtYXRjaCB0aGlzIFNvbGlkaXR5VHlwZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblNvbGlkaXR5VHlwZS5wcm90b3R5cGUuaXNUeXBlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAodGhpcy5fbWF0Y2ggPT09ICdzdHJpY3QnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lID09PSBuYW1lIHx8IChuYW1lLmluZGV4T2YodGhpcy5fbmFtZSkgPT09IDAgJiYgbmFtZS5zbGljZSh0aGlzLl9uYW1lLmxlbmd0aCkgPT09ICdbXScpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbWF0Y2ggPT09ICdwcmVmaXgnKSB7XG4gICAgICAgIC8vIFRPRE8gYmV0dGVyIHR5cGUgZGV0ZWN0aW9uIVxuICAgICAgICByZXR1cm4gbmFtZS5pbmRleE9mKHRoaXMuX25hbWUpID09PSAwO1xuICAgIH1cbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gdHJhbnNmb3JtIHBsYWluIHBhcmFtIHRvIFNvbGlkaXR5UGFyYW0gb2JqZWN0XG4gKlxuICogQG1ldGhvZCBmb3JtYXRJbnB1dFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIC0gcGxhaW4gb2JqZWN0LCBvciBhbiBhcnJheSBvZiBvYmplY3RzXG4gKiBAcGFyYW0ge0Jvb2x9IGFycmF5VHlwZSAtIHRydWUgaWYgYSBwYXJhbSBzaG91bGQgYmUgZW5jb2RlZCBhcyBhbiBhcnJheVxuICogQHJldHVybiB7U29saWRpdHlQYXJhbX0gZW5jb2RlZCBwYXJhbSB3cmFwcGVkIGluIFNvbGlkaXR5UGFyYW0gb2JqZWN0IFxuICovXG5Tb2xpZGl0eVR5cGUucHJvdG90eXBlLmZvcm1hdElucHV0ID0gZnVuY3Rpb24gKHBhcmFtLCBhcnJheVR5cGUpIHtcbiAgICBpZiAodXRpbHMuaXNBcnJheShwYXJhbSkgJiYgYXJyYXlUeXBlKSB7IC8vIFRPRE86IHNob3VsZCBmYWlsIGlmIHRoaXMgdHdvIGFyZSBub3QgdGhlIHNhbWVcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gcGFyYW0ubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5faW5wdXRGb3JtYXR0ZXIocCk7XG4gICAgICAgIH0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXJyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gYWNjLmNvbWJpbmUoY3VycmVudCk7XG4gICAgICAgIH0sIGYuZm9ybWF0SW5wdXRJbnQocGFyYW0ubGVuZ3RoKSkud2l0aE9mZnNldCgzMik7XG4gICAgfSBcbiAgICByZXR1cm4gdGhpcy5faW5wdXRGb3JtYXR0ZXIocGFyYW0pO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byB0cmFuc29mb3JtIFNvbGlkaXR5UGFyYW0gdG8gcGxhaW4gcGFyYW1cbiAqXG4gKiBAbWV0aG9kIGZvcm1hdE91dHB1dFxuICogQHBhcmFtIHtTb2xpZGl0eVBhcmFtfSBieXRlQXJyYXlcbiAqIEBwYXJhbSB7Qm9vbH0gYXJyYXlUeXBlIC0gdHJ1ZSBpZiBhIHBhcmFtIHNob3VsZCBiZSBkZWNvZGVkIGFzIGFuIGFycmF5XG4gKiBAcmV0dXJuIHtPYmplY3R9IHBsYWluIGRlY29kZWQgcGFyYW1cbiAqL1xuU29saWRpdHlUeXBlLnByb3RvdHlwZS5mb3JtYXRPdXRwdXQgPSBmdW5jdGlvbiAocGFyYW0sIGFycmF5VHlwZSkge1xuICAgIGlmIChhcnJheVR5cGUpIHtcbiAgICAgICAgLy8gbGV0J3MgYXNzdW1lLCB0aGF0IHdlIHNvbGlkaXR5IHdpbGwgbmV2ZXIgcmV0dXJuIGxvbmcgYXJyYXlzIDpQIFxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBsZW5ndGggPSBuZXcgQmlnTnVtYmVyKHBhcmFtLmR5bmFtaWNQYXJ0KCkuc2xpY2UoMCwgNjQpLCAxNik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoICogNjQ7IGkgKz0gNjQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuX291dHB1dEZvcm1hdHRlcihuZXcgU29saWRpdHlQYXJhbShwYXJhbS5keW5hbWljUGFydCgpLnN1YnN0cihpICsgNjQsIDY0KSkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb3V0cHV0Rm9ybWF0dGVyKHBhcmFtKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gc2xpY2Ugc2luZ2xlIHBhcmFtIGZyb20gYnl0ZXNcbiAqXG4gKiBAbWV0aG9kIHNsaWNlUGFyYW1cbiAqIEBwYXJhbSB7U3RyaW5nfSBieXRlc1xuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IG9mIHBhcmFtIHRvIHNsaWNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19IHBhcmFtXG4gKi9cblNvbGlkaXR5VHlwZS5wcm90b3R5cGUuc2xpY2VQYXJhbSA9IGZ1bmN0aW9uIChieXRlcywgaW5kZXgsIHR5cGUpIHtcbiAgICBpZiAodGhpcy5fbW9kZSA9PT0gJ2J5dGVzJykge1xuICAgICAgICByZXR1cm4gU29saWRpdHlQYXJhbS5kZWNvZGVCeXRlcyhieXRlcywgaW5kZXgpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheVR5cGUodHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIFNvbGlkaXR5UGFyYW0uZGVjb2RlQXJyYXkoYnl0ZXMsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIFNvbGlkaXR5UGFyYW0uZGVjb2RlUGFyYW0oYnl0ZXMsIGluZGV4KTtcbn07XG5cbi8qKlxuICogU29saWRpdHlDb2RlciBwcm90b3R5cGUgc2hvdWxkIGJlIHVzZWQgdG8gZW5jb2RlL2RlY29kZSBzb2xpZGl0eSBwYXJhbXMgb2YgYW55IHR5cGVcbiAqL1xudmFyIFNvbGlkaXR5Q29kZXIgPSBmdW5jdGlvbiAodHlwZXMpIHtcbiAgICB0aGlzLl90eXBlcyA9IHR5cGVzO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgdXNlZCB0byB0cmFuc2Zvcm0gdHlwZSB0byBTb2xpZGl0eVR5cGVcbiAqXG4gKiBAbWV0aG9kIF9yZXF1aXJlVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm5zIHtTb2xpZGl0eVR5cGV9IFxuICogQHRocm93cyB7RXJyb3J9IHRocm93cyBpZiBubyBtYXRjaGluZyB0eXBlIGlzIGZvdW5kXG4gKi9cblNvbGlkaXR5Q29kZXIucHJvdG90eXBlLl9yZXF1aXJlVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdmFyIHNvbGlkaXR5VHlwZSA9IHRoaXMuX3R5cGVzLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5pc1R5cGUodHlwZSk7XG4gICAgfSlbMF07XG5cbiAgICBpZiAoIXNvbGlkaXR5VHlwZSkge1xuICAgICAgICB0aHJvdyBFcnJvcignaW52YWxpZCBzb2xpZGl0eSB0eXBlITogJyArIHR5cGUpO1xuICAgIH1cblxuICAgIHJldHVybiBzb2xpZGl0eVR5cGU7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIHRyYW5zZm9ybSBwbGFpbiBwYXJhbSBvZiBnaXZlbiB0eXBlIHRvIFNvbGlkaXR5UGFyYW1cbiAqXG4gKiBAbWV0aG9kIF9mb3JtYXRJbnB1dFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgb2YgcGFyYW1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwbGFpbiBwYXJhbVxuICogQHJldHVybiB7U29saWRpdHlQYXJhbX1cbiAqL1xuU29saWRpdHlDb2Rlci5wcm90b3R5cGUuX2Zvcm1hdElucHV0ID0gZnVuY3Rpb24gKHR5cGUsIHBhcmFtKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVUeXBlKHR5cGUpLmZvcm1hdElucHV0KHBhcmFtLCBpc0FycmF5VHlwZSh0eXBlKSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGVuY29kZSBwbGFpbiBwYXJhbVxuICpcbiAqIEBtZXRob2QgZW5jb2RlUGFyYW1cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge09iamVjdH0gcGxhaW4gcGFyYW1cbiAqIEByZXR1cm4ge1N0cmluZ30gZW5jb2RlZCBwbGFpbiBwYXJhbVxuICovXG5Tb2xpZGl0eUNvZGVyLnByb3RvdHlwZS5lbmNvZGVQYXJhbSA9IGZ1bmN0aW9uICh0eXBlLCBwYXJhbSkge1xuICAgIHJldHVybiB0aGlzLl9mb3JtYXRJbnB1dCh0eXBlLCBwYXJhbSkuZW5jb2RlKCk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGVuY29kZSBsaXN0IG9mIHBhcmFtc1xuICpcbiAqIEBtZXRob2QgZW5jb2RlUGFyYW1zXG4gKiBAcGFyYW0ge0FycmF5fSB0eXBlc1xuICogQHBhcmFtIHtBcnJheX0gcGFyYW1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGVuY29kZWQgbGlzdCBvZiBwYXJhbXNcbiAqL1xuU29saWRpdHlDb2Rlci5wcm90b3R5cGUuZW5jb2RlUGFyYW1zID0gZnVuY3Rpb24gKHR5cGVzLCBwYXJhbXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHNvbGlkaXR5UGFyYW1zID0gdHlwZXMubWFwKGZ1bmN0aW9uICh0eXBlLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fZm9ybWF0SW5wdXQodHlwZSwgcGFyYW1zW2luZGV4XSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gU29saWRpdHlQYXJhbS5lbmNvZGVMaXN0KHNvbGlkaXR5UGFyYW1zKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZGVjb2RlIGJ5dGVzIHRvIHBsYWluIHBhcmFtXG4gKlxuICogQG1ldGhvZCBkZWNvZGVQYXJhbVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBieXRlc1xuICogQHJldHVybiB7T2JqZWN0fSBwbGFpbiBwYXJhbVxuICovXG5Tb2xpZGl0eUNvZGVyLnByb3RvdHlwZS5kZWNvZGVQYXJhbSA9IGZ1bmN0aW9uICh0eXBlLCBieXRlcykge1xuICAgIHJldHVybiB0aGlzLmRlY29kZVBhcmFtcyhbdHlwZV0sIGJ5dGVzKVswXTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZGVjb2RlIGxpc3Qgb2YgcGFyYW1zXG4gKlxuICogQG1ldGhvZCBkZWNvZGVQYXJhbVxuICogQHBhcmFtIHtBcnJheX0gdHlwZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBieXRlc1xuICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIHBsYWluIHBhcmFtc1xuICovXG5Tb2xpZGl0eUNvZGVyLnByb3RvdHlwZS5kZWNvZGVQYXJhbXMgPSBmdW5jdGlvbiAodHlwZXMsIGJ5dGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiB0eXBlcy5tYXAoZnVuY3Rpb24gKHR5cGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBzb2xpZGl0eVR5cGUgPSBzZWxmLl9yZXF1aXJlVHlwZSh0eXBlKTtcbiAgICAgICAgdmFyIHAgPSBzb2xpZGl0eVR5cGUuc2xpY2VQYXJhbShieXRlcywgaW5kZXgsIHR5cGUpO1xuICAgICAgICByZXR1cm4gc29saWRpdHlUeXBlLmZvcm1hdE91dHB1dChwLCBpc0FycmF5VHlwZSh0eXBlKSk7XG4gICAgfSk7XG59O1xuXG52YXIgY29kZXIgPSBuZXcgU29saWRpdHlDb2RlcihbXG4gICAgbmV3IFNvbGlkaXR5VHlwZSh7XG4gICAgICAgIG5hbWU6ICdhZGRyZXNzJyxcbiAgICAgICAgbWF0Y2g6ICdzdHJpY3QnLFxuICAgICAgICBtb2RlOiAndmFsdWUnLFxuICAgICAgICBpbnB1dEZvcm1hdHRlcjogZi5mb3JtYXRJbnB1dEludCxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmLmZvcm1hdE91dHB1dEFkZHJlc3NcbiAgICB9KSxcbiAgICBuZXcgU29saWRpdHlUeXBlKHtcbiAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICBtYXRjaDogJ3N0cmljdCcsXG4gICAgICAgIG1vZGU6ICd2YWx1ZScsXG4gICAgICAgIGlucHV0Rm9ybWF0dGVyOiBmLmZvcm1hdElucHV0Qm9vbCxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmLmZvcm1hdE91dHB1dEJvb2xcbiAgICB9KSxcbiAgICBuZXcgU29saWRpdHlUeXBlKHtcbiAgICAgICAgbmFtZTogJ2ludCcsXG4gICAgICAgIG1hdGNoOiAncHJlZml4JyxcbiAgICAgICAgbW9kZTogJ3ZhbHVlJyxcbiAgICAgICAgaW5wdXRGb3JtYXR0ZXI6IGYuZm9ybWF0SW5wdXRJbnQsXG4gICAgICAgIG91dHB1dEZvcm1hdHRlcjogZi5mb3JtYXRPdXRwdXRJbnQsXG4gICAgfSksXG4gICAgbmV3IFNvbGlkaXR5VHlwZSh7XG4gICAgICAgIG5hbWU6ICd1aW50JyxcbiAgICAgICAgbWF0Y2g6ICdwcmVmaXgnLFxuICAgICAgICBtb2RlOiAndmFsdWUnLFxuICAgICAgICBpbnB1dEZvcm1hdHRlcjogZi5mb3JtYXRJbnB1dEludCxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmLmZvcm1hdE91dHB1dFVJbnRcbiAgICB9KSxcbiAgICBuZXcgU29saWRpdHlUeXBlKHtcbiAgICAgICAgbmFtZTogJ2J5dGVzJyxcbiAgICAgICAgbWF0Y2g6ICdzdHJpY3QnLFxuICAgICAgICBtb2RlOiAnYnl0ZXMnLFxuICAgICAgICBpbnB1dEZvcm1hdHRlcjogZi5mb3JtYXRJbnB1dER5bmFtaWNCeXRlcyxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmLmZvcm1hdE91dHB1dER5bmFtaWNCeXRlc1xuICAgIH0pLFxuICAgIG5ldyBTb2xpZGl0eVR5cGUoe1xuICAgICAgICBuYW1lOiAnYnl0ZXMnLFxuICAgICAgICBtYXRjaDogJ3ByZWZpeCcsXG4gICAgICAgIG1vZGU6ICd2YWx1ZScsXG4gICAgICAgIGlucHV0Rm9ybWF0dGVyOiBmLmZvcm1hdElucHV0Qnl0ZXMsXG4gICAgICAgIG91dHB1dEZvcm1hdHRlcjogZi5mb3JtYXRPdXRwdXRCeXRlc1xuICAgIH0pLFxuICAgIG5ldyBTb2xpZGl0eVR5cGUoe1xuICAgICAgICBuYW1lOiAncmVhbCcsXG4gICAgICAgIG1hdGNoOiAncHJlZml4JyxcbiAgICAgICAgbW9kZTogJ3ZhbHVlJyxcbiAgICAgICAgaW5wdXRGb3JtYXR0ZXI6IGYuZm9ybWF0SW5wdXRSZWFsLFxuICAgICAgICBvdXRwdXRGb3JtYXR0ZXI6IGYuZm9ybWF0T3V0cHV0UmVhbFxuICAgIH0pLFxuICAgIG5ldyBTb2xpZGl0eVR5cGUoe1xuICAgICAgICBuYW1lOiAndXJlYWwnLFxuICAgICAgICBtYXRjaDogJ3ByZWZpeCcsXG4gICAgICAgIG1vZGU6ICd2YWx1ZScsXG4gICAgICAgIGlucHV0Rm9ybWF0dGVyOiBmLmZvcm1hdElucHV0UmVhbCxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmLmZvcm1hdE91dHB1dFVSZWFsXG4gICAgfSlcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvZGVyO1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBcbiAqIEBmaWxlIGZvcm1hdHRlcnMuanNcbiAqIEBhdXRob3IgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIEJpZ051bWJlciA9IHJlcXVpcmUoJ2JpZ251bWJlci5qcycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbHMnKTtcbnZhciBjID0gcmVxdWlyZSgnLi4vdXRpbHMvY29uZmlnJyk7XG52YXIgU29saWRpdHlQYXJhbSA9IHJlcXVpcmUoJy4vcGFyYW0nKTtcblxuXG4vKipcbiAqIEZvcm1hdHMgaW5wdXQgdmFsdWUgdG8gYnl0ZSByZXByZXNlbnRhdGlvbiBvZiBpbnRcbiAqIElmIHZhbHVlIGlzIG5lZ2F0aXZlLCByZXR1cm4gaXQncyB0d28ncyBjb21wbGVtZW50XG4gKiBJZiB0aGUgdmFsdWUgaXMgZmxvYXRpbmcgcG9pbnQsIHJvdW5kIGl0IGRvd25cbiAqXG4gKiBAbWV0aG9kIGZvcm1hdElucHV0SW50XG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8QmlnTnVtYmVyfSB2YWx1ZSB0aGF0IG5lZWRzIHRvIGJlIGZvcm1hdHRlZFxuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19XG4gKi9cbnZhciBmb3JtYXRJbnB1dEludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBwYWRkaW5nID0gYy5FVEhfUEFERElORyAqIDI7XG4gICAgQmlnTnVtYmVyLmNvbmZpZyhjLkVUSF9CSUdOVU1CRVJfUk9VTkRJTkdfTU9ERSk7XG4gICAgdmFyIHJlc3VsdCA9IHV0aWxzLnBhZExlZnQodXRpbHMudG9Ud29zQ29tcGxlbWVudCh2YWx1ZSkucm91bmQoKS50b1N0cmluZygxNiksIHBhZGRpbmcpO1xuICAgIHJldHVybiBuZXcgU29saWRpdHlQYXJhbShyZXN1bHQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIGlucHV0IHZhbHVlIHRvIGJ5dGUgcmVwcmVzZW50YXRpb24gb2Ygc3RyaW5nXG4gKlxuICogQG1ldGhvZCBmb3JtYXRJbnB1dEJ5dGVzXG4gKiBAcGFyYW0ge1N0cmluZ31cbiAqIEByZXR1cm5zIHtTb2xpZGl0eVBhcmFtfVxuICovXG52YXIgZm9ybWF0SW5wdXRCeXRlcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSB1dGlscy5mcm9tQXNjaWkodmFsdWUsIGMuRVRIX1BBRERJTkcpLnN1YnN0cigyKTtcbiAgICByZXR1cm4gbmV3IFNvbGlkaXR5UGFyYW0ocmVzdWx0KTtcbn07XG5cbi8qKlxuICogRm9ybWF0cyBpbnB1dCB2YWx1ZSB0byBieXRlIHJlcHJlc2VudGF0aW9uIG9mIHN0cmluZ1xuICpcbiAqIEBtZXRob2QgZm9ybWF0SW5wdXREeW5hbWljQnl0ZXNcbiAqIEBwYXJhbSB7U3RyaW5nfVxuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19XG4gKi9cbnZhciBmb3JtYXRJbnB1dER5bmFtaWNCeXRlcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSB1dGlscy5mcm9tQXNjaWkodmFsdWUsIGMuRVRIX1BBRERJTkcpLnN1YnN0cigyKTtcbiAgICByZXR1cm4gbmV3IFNvbGlkaXR5UGFyYW0oZm9ybWF0SW5wdXRJbnQodmFsdWUubGVuZ3RoKS52YWx1ZSArIHJlc3VsdCwgMzIpO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIGlucHV0IHZhbHVlIHRvIGJ5dGUgcmVwcmVzZW50YXRpb24gb2YgYm9vbFxuICpcbiAqIEBtZXRob2QgZm9ybWF0SW5wdXRCb29sXG4gKiBAcGFyYW0ge0Jvb2xlYW59XG4gKiBAcmV0dXJucyB7U29saWRpdHlQYXJhbX1cbiAqL1xudmFyIGZvcm1hdElucHV0Qm9vbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyArICh2YWx1ZSA/ICAnMScgOiAnMCcpO1xuICAgIHJldHVybiBuZXcgU29saWRpdHlQYXJhbShyZXN1bHQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIGlucHV0IHZhbHVlIHRvIGJ5dGUgcmVwcmVzZW50YXRpb24gb2YgcmVhbFxuICogVmFsdWVzIGFyZSBtdWx0aXBsaWVkIGJ5IDJebSBhbmQgZW5jb2RlZCBhcyBpbnRlZ2Vyc1xuICpcbiAqIEBtZXRob2QgZm9ybWF0SW5wdXRSZWFsXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8QmlnTnVtYmVyfVxuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19XG4gKi9cbnZhciBmb3JtYXRJbnB1dFJlYWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZm9ybWF0SW5wdXRJbnQobmV3IEJpZ051bWJlcih2YWx1ZSkudGltZXMobmV3IEJpZ051bWJlcigyKS5wb3coMTI4KSkpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBpbnB1dCB2YWx1ZSBpcyBuZWdhdGl2ZVxuICpcbiAqIEBtZXRob2Qgc2lnbmVkSXNOZWdhdGl2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIGlzIGhleCBmb3JtYXRcbiAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGl0IGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xudmFyIHNpZ25lZElzTmVnYXRpdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gKG5ldyBCaWdOdW1iZXIodmFsdWUuc3Vic3RyKDAsIDEpLCAxNikudG9TdHJpbmcoMikuc3Vic3RyKDAsIDEpKSA9PT0gJzEnO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIHJpZ2h0LWFsaWduZWQgb3V0cHV0IGJ5dGVzIHRvIGludFxuICpcbiAqIEBtZXRob2QgZm9ybWF0T3V0cHV0SW50XG4gKiBAcGFyYW0ge1NvbGlkaXR5UGFyYW19IHBhcmFtXG4gKiBAcmV0dXJucyB7QmlnTnVtYmVyfSByaWdodC1hbGlnbmVkIG91dHB1dCBieXRlcyBmb3JtYXR0ZWQgdG8gYmlnIG51bWJlclxuICovXG52YXIgZm9ybWF0T3V0cHV0SW50ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgdmFyIHZhbHVlID0gcGFyYW0uc3RhdGljUGFydCgpIHx8IFwiMFwiO1xuXG4gICAgLy8gY2hlY2sgaWYgaXQncyBuZWdhdGl2ZSBudW1iZXJcbiAgICAvLyBpdCBpdCBpcywgcmV0dXJuIHR3bydzIGNvbXBsZW1lbnRcbiAgICBpZiAoc2lnbmVkSXNOZWdhdGl2ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIodmFsdWUsIDE2KS5taW51cyhuZXcgQmlnTnVtYmVyKCdmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmJywgMTYpKS5taW51cygxKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIodmFsdWUsIDE2KTtcbn07XG5cbi8qKlxuICogRm9ybWF0cyByaWdodC1hbGlnbmVkIG91dHB1dCBieXRlcyB0byB1aW50XG4gKlxuICogQG1ldGhvZCBmb3JtYXRPdXRwdXRVSW50XG4gKiBAcGFyYW0ge1NvbGlkaXR5UGFyYW19XG4gKiBAcmV0dXJucyB7QmlnTnVtZWJlcn0gcmlnaHQtYWxpZ25lZCBvdXRwdXQgYnl0ZXMgZm9ybWF0dGVkIHRvIHVpbnRcbiAqL1xudmFyIGZvcm1hdE91dHB1dFVJbnQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICB2YXIgdmFsdWUgPSBwYXJhbS5zdGF0aWNQYXJ0KCkgfHwgXCIwXCI7XG4gICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIodmFsdWUsIDE2KTtcbn07XG5cbi8qKlxuICogRm9ybWF0cyByaWdodC1hbGlnbmVkIG91dHB1dCBieXRlcyB0byByZWFsXG4gKlxuICogQG1ldGhvZCBmb3JtYXRPdXRwdXRSZWFsXG4gKiBAcGFyYW0ge1NvbGlkaXR5UGFyYW19XG4gKiBAcmV0dXJucyB7QmlnTnVtYmVyfSBpbnB1dCBieXRlcyBmb3JtYXR0ZWQgdG8gcmVhbFxuICovXG52YXIgZm9ybWF0T3V0cHV0UmVhbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIHJldHVybiBmb3JtYXRPdXRwdXRJbnQocGFyYW0pLmRpdmlkZWRCeShuZXcgQmlnTnVtYmVyKDIpLnBvdygxMjgpKTsgXG59O1xuXG4vKipcbiAqIEZvcm1hdHMgcmlnaHQtYWxpZ25lZCBvdXRwdXQgYnl0ZXMgdG8gdXJlYWxcbiAqXG4gKiBAbWV0aG9kIGZvcm1hdE91dHB1dFVSZWFsXG4gKiBAcGFyYW0ge1NvbGlkaXR5UGFyYW19XG4gKiBAcmV0dXJucyB7QmlnTnVtYmVyfSBpbnB1dCBieXRlcyBmb3JtYXR0ZWQgdG8gdXJlYWxcbiAqL1xudmFyIGZvcm1hdE91dHB1dFVSZWFsID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgcmV0dXJuIGZvcm1hdE91dHB1dFVJbnQocGFyYW0pLmRpdmlkZWRCeShuZXcgQmlnTnVtYmVyKDIpLnBvdygxMjgpKTsgXG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGZvcm1hdCBvdXRwdXQgYm9vbFxuICpcbiAqIEBtZXRob2QgZm9ybWF0T3V0cHV0Qm9vbFxuICogQHBhcmFtIHtTb2xpZGl0eVBhcmFtfVxuICogQHJldHVybnMge0Jvb2xlYW59IHJpZ2h0LWFsaWduZWQgaW5wdXQgYnl0ZXMgZm9ybWF0dGVkIHRvIGJvb2xcbiAqL1xudmFyIGZvcm1hdE91dHB1dEJvb2wgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICByZXR1cm4gcGFyYW0uc3RhdGljUGFydCgpID09PSAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMScgPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGZvcm1hdCBvdXRwdXQgc3RyaW5nXG4gKlxuICogQG1ldGhvZCBmb3JtYXRPdXRwdXRCeXRlc1xuICogQHBhcmFtIHtTb2xpZGl0eVBhcmFtfSBsZWZ0LWFsaWduZWQgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gYXNjaWkgc3RyaW5nXG4gKi9cbnZhciBmb3JtYXRPdXRwdXRCeXRlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIC8vIGxlbmd0aCBtaWdodCBhbHNvIGJlIGltcG9ydGFudCFcbiAgICByZXR1cm4gdXRpbHMudG9Bc2NpaShwYXJhbS5zdGF0aWNQYXJ0KCkpO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBmb3JtYXQgb3V0cHV0IHN0cmluZ1xuICpcbiAqIEBtZXRob2QgZm9ybWF0T3V0cHV0RHluYW1pY0J5dGVzXG4gKiBAcGFyYW0ge1NvbGlkaXR5UGFyYW19IGxlZnQtYWxpZ25lZCBoZXggcmVwcmVzZW50YXRpb24gb2Ygc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBhc2NpaSBzdHJpbmdcbiAqL1xudmFyIGZvcm1hdE91dHB1dER5bmFtaWNCeXRlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIC8vIGxlbmd0aCBtaWdodCBhbHNvIGJlIGltcG9ydGFudCFcbiAgICByZXR1cm4gdXRpbHMudG9Bc2NpaShwYXJhbS5keW5hbWljUGFydCgpLnNsaWNlKDY0KSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGZvcm1hdCBvdXRwdXQgYWRkcmVzc1xuICpcbiAqIEBtZXRob2QgZm9ybWF0T3V0cHV0QWRkcmVzc1xuICogQHBhcmFtIHtTb2xpZGl0eVBhcmFtfSByaWdodC1hbGlnbmVkIGlucHV0IGJ5dGVzXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBhZGRyZXNzXG4gKi9cbnZhciBmb3JtYXRPdXRwdXRBZGRyZXNzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgdmFyIHZhbHVlID0gcGFyYW0uc3RhdGljUGFydCgpO1xuICAgIHJldHVybiBcIjB4XCIgKyB2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSA0MCwgdmFsdWUubGVuZ3RoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZvcm1hdElucHV0SW50OiBmb3JtYXRJbnB1dEludCxcbiAgICBmb3JtYXRJbnB1dEJ5dGVzOiBmb3JtYXRJbnB1dEJ5dGVzLFxuICAgIGZvcm1hdElucHV0RHluYW1pY0J5dGVzOiBmb3JtYXRJbnB1dER5bmFtaWNCeXRlcyxcbiAgICBmb3JtYXRJbnB1dEJvb2w6IGZvcm1hdElucHV0Qm9vbCxcbiAgICBmb3JtYXRJbnB1dFJlYWw6IGZvcm1hdElucHV0UmVhbCxcbiAgICBmb3JtYXRPdXRwdXRJbnQ6IGZvcm1hdE91dHB1dEludCxcbiAgICBmb3JtYXRPdXRwdXRVSW50OiBmb3JtYXRPdXRwdXRVSW50LFxuICAgIGZvcm1hdE91dHB1dFJlYWw6IGZvcm1hdE91dHB1dFJlYWwsXG4gICAgZm9ybWF0T3V0cHV0VVJlYWw6IGZvcm1hdE91dHB1dFVSZWFsLFxuICAgIGZvcm1hdE91dHB1dEJvb2w6IGZvcm1hdE91dHB1dEJvb2wsXG4gICAgZm9ybWF0T3V0cHV0Qnl0ZXM6IGZvcm1hdE91dHB1dEJ5dGVzLFxuICAgIGZvcm1hdE91dHB1dER5bmFtaWNCeXRlczogZm9ybWF0T3V0cHV0RHluYW1pY0J5dGVzLFxuICAgIGZvcm1hdE91dHB1dEFkZHJlc3M6IGZvcm1hdE91dHB1dEFkZHJlc3Ncbn07XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIFxuICogQGZpbGUgcGFyYW0uanNcbiAqIEBhdXRob3IgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbHMnKTtcblxuLyoqXG4gKiBTb2xpZGl0eVBhcmFtIG9iamVjdCBwcm90b3R5cGUuXG4gKiBTaG91bGQgYmUgdXNlZCB3aGVuIGVuY29kaW5nLCBkZWNvZGluZyBzb2xpZGl0eSBieXRlc1xuICovXG52YXIgU29saWRpdHlQYXJhbSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0KSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0OyAvLyBvZmZzZXQgaW4gYnl0ZXNcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgdG8gZ2V0IGxlbmd0aCBvZiBwYXJhbXMncyBkeW5hbWljIHBhcnRcbiAqIFxuICogQG1ldGhvZCBkeW5hbWljUGFydExlbmd0aFxuICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGR5bmFtaWMgcGFydCAoaW4gYnl0ZXMpXG4gKi9cblNvbGlkaXR5UGFyYW0ucHJvdG90eXBlLmR5bmFtaWNQYXJ0TGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmR5bmFtaWNQYXJ0KCkubGVuZ3RoIC8gMjtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgdG8gY3JlYXRlIGNvcHkgb2Ygc29saWRpdHkgcGFyYW0gd2l0aCBkaWZmZXJlbnQgb2Zmc2V0XG4gKlxuICogQG1ldGhvZCB3aXRoT2Zmc2V0XG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IGxlbmd0aCBpbiBieXRlc1xuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19IG5ldyBzb2xpZGl0eSBwYXJhbSB3aXRoIGFwcGxpZWQgb2Zmc2V0XG4gKi9cblNvbGlkaXR5UGFyYW0ucHJvdG90eXBlLndpdGhPZmZzZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG5ldyBTb2xpZGl0eVBhcmFtKHRoaXMudmFsdWUsIG9mZnNldCk7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIGNvbWJpbmUgc29saWRpdHkgcGFyYW1zIHRvZ2V0aGVyXG4gKiBlZy4gd2hlbiBhcHBlbmRpbmcgYW4gYXJyYXlcbiAqXG4gKiBAbWV0aG9kIGNvbWJpbmVcbiAqIEBwYXJhbSB7U29saWRpdHlQYXJhbX0gcGFyYW0gd2l0aCB3aGljaCB3ZSBzaG91bGQgY29tYmluZVxuICogQHBhcmFtIHtTb2xpZGl0eVBhcmFtfSByZXN1bHQgb2YgY29tYmluYXRpb25cbiAqL1xuU29saWRpdHlQYXJhbS5wcm90b3R5cGUuY29tYmluZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIHJldHVybiBuZXcgU29saWRpdHlQYXJhbSh0aGlzLnZhbHVlICsgcGFyYW0udmFsdWUpOyBcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBjaGVjayBpZiBwYXJhbSBoYXMgZHluYW1pYyBzaXplLlxuICogSWYgaXQgaGFzLCBpdCByZXR1cm5zIHRydWUsIG90aGVyd2lzZSBmYWxzZVxuICpcbiAqIEBtZXRob2QgaXNEeW5hbWljXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuU29saWRpdHlQYXJhbS5wcm90b3R5cGUuaXNEeW5hbWljID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aCA+IDY0IHx8IHRoaXMub2Zmc2V0ICE9PSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgdG8gdHJhbnNmb3JtIG9mZnNldCB0byBieXRlc1xuICpcbiAqIEBtZXRob2Qgb2Zmc2V0QXNCeXRlc1xuICogQHJldHVybnMge1N0cmluZ30gYnl0ZXMgcmVwcmVzZW50YXRpb24gb2Ygb2Zmc2V0XG4gKi9cblNvbGlkaXR5UGFyYW0ucHJvdG90eXBlLm9mZnNldEFzQnl0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRHluYW1pYygpID8gJycgOiB1dGlscy5wYWRMZWZ0KHV0aWxzLnRvVHdvc0NvbXBsZW1lbnQodGhpcy5vZmZzZXQpLnRvU3RyaW5nKDE2KSwgNjQpO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIHRvIGdldCBzdGF0aWMgcGFydCBvZiBwYXJhbVxuICpcbiAqIEBtZXRob2Qgc3RhdGljUGFydFxuICogQHJldHVybnMge1N0cmluZ30gb2Zmc2V0IGlmIGl0IGlzIGEgZHluYW1pYyBwYXJhbSwgb3RoZXJ3aXNlIHZhbHVlXG4gKi9cblNvbGlkaXR5UGFyYW0ucHJvdG90eXBlLnN0YXRpY1BhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzRHluYW1pYygpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlOyBcbiAgICB9IFxuICAgIHJldHVybiB0aGlzLm9mZnNldEFzQnl0ZXMoKTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgZHluYW1pYyBwYXJ0IG9mIHBhcmFtXG4gKlxuICogQG1ldGhvZCBkeW5hbWljUGFydFxuICogQHJldHVybnMge1N0cmluZ30gcmV0dXJucyBhIHZhbHVlIGlmIGl0IGlzIGEgZHluYW1pYyBwYXJhbSwgb3RoZXJ3aXNlIGVtcHR5IHN0cmluZ1xuICovXG5Tb2xpZGl0eVBhcmFtLnByb3RvdHlwZS5keW5hbWljUGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0R5bmFtaWMoKSA/IHRoaXMudmFsdWUgOiAnJztcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBlbmNvZGUgcGFyYW1cbiAqXG4gKiBAbWV0aG9kIGVuY29kZVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuU29saWRpdHlQYXJhbS5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRpY1BhcnQoKSArIHRoaXMuZHluYW1pY1BhcnQoKTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBlbmNvZGUgYXJyYXkgb2YgcGFyYW1zXG4gKlxuICogQG1ldGhvZCBlbmNvZGVMaXN0XG4gKiBAcGFyYW0ge0FycmF5W1NvbGlkaXR5UGFyYW1dfSBwYXJhbXNcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblNvbGlkaXR5UGFyYW0uZW5jb2RlTGlzdCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICBcbiAgICAvLyB1cGRhdGluZyBvZmZzZXRzXG4gICAgdmFyIHRvdGFsT2Zmc2V0ID0gcGFyYW1zLmxlbmd0aCAqIDMyO1xuICAgIHZhciBvZmZzZXRQYXJhbXMgPSBwYXJhbXMubWFwKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICBpZiAoIXBhcmFtLmlzRHluYW1pYygpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9mZnNldCA9IHRvdGFsT2Zmc2V0O1xuICAgICAgICB0b3RhbE9mZnNldCArPSBwYXJhbS5keW5hbWljUGFydExlbmd0aCgpO1xuICAgICAgICByZXR1cm4gcGFyYW0ud2l0aE9mZnNldChvZmZzZXQpO1xuICAgIH0pO1xuXG4gICAgLy8gZW5jb2RlIGV2ZXJ5dGhpbmchXG4gICAgcmV0dXJuIG9mZnNldFBhcmFtcy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCArIHBhcmFtLmR5bmFtaWNQYXJ0KCk7XG4gICAgfSwgb2Zmc2V0UGFyYW1zLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCBwYXJhbSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0ICsgcGFyYW0uc3RhdGljUGFydCgpO1xuICAgIH0sICcnKSk7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIGRlY29kZSBwbGFpbiAoc3RhdGljKSBzb2xpZGl0eSBwYXJhbSBhdCBnaXZlbiBpbmRleFxuICpcbiAqIEBtZXRob2QgZGVjb2RlUGFyYW1cbiAqIEBwYXJhbSB7U3RyaW5nfSBieXRlc1xuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJucyB7U29saWRpdHlQYXJhbX1cbiAqL1xuU29saWRpdHlQYXJhbS5kZWNvZGVQYXJhbSA9IGZ1bmN0aW9uIChieXRlcywgaW5kZXgpIHtcbiAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgcmV0dXJuIG5ldyBTb2xpZGl0eVBhcmFtKGJ5dGVzLnN1YnN0cihpbmRleCAqIDY0LCA2NCkpOyBcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgb2Zmc2V0IHZhbHVlIGZyb20gYnl0ZXMgYXQgZ2l2ZW4gaW5kZXhcbiAqXG4gKiBAbWV0aG9kIGdldE9mZnNldFxuICogQHBhcmFtIHtTdHJpbmd9IGJ5dGVzXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IG9mZnNldCBhcyBudW1iZXJcbiAqL1xudmFyIGdldE9mZnNldCA9IGZ1bmN0aW9uIChieXRlcywgaW5kZXgpIHtcbiAgICAvLyB3ZSBjYW4gZG8gdGhpcyBjYXVzZSBvZmZzZXQgaXMgcmF0aGVyIHNtYWxsXG4gICAgcmV0dXJuIHBhcnNlSW50KCcweCcgKyBieXRlcy5zdWJzdHIoaW5kZXggKiA2NCwgNjQpKTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB0byBkZWNvZGUgc29saWRpdHkgYnl0ZXMgcGFyYW0gYXQgZ2l2ZW4gaW5kZXhcbiAqXG4gKiBAbWV0aG9kIGRlY29kZUJ5dGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gYnl0ZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHJldHVybnMge1NvbGlkaXR5UGFyYW19XG4gKi9cblNvbGlkaXR5UGFyYW0uZGVjb2RlQnl0ZXMgPSBmdW5jdGlvbiAoYnl0ZXMsIGluZGV4KSB7XG4gICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgIC8vVE9ETyBhZGQgc3VwcG9ydCBmb3Igc3RyaW5ncyBsb25nZXIgdGhhbiAzMiBieXRlc1xuICAgIC8vdmFyIGxlbmd0aCA9IHBhcnNlSW50KCcweCcgKyBieXRlcy5zdWJzdHIob2Zmc2V0ICogNjQsIDY0KSk7XG5cbiAgICB2YXIgb2Zmc2V0ID0gZ2V0T2Zmc2V0KGJ5dGVzLCBpbmRleCk7XG5cbiAgICAvLyAyICogLCBjYXVzZSB3ZSBhbHNvIHBhcnNlIGxlbmd0aFxuICAgIHJldHVybiBuZXcgU29saWRpdHlQYXJhbShieXRlcy5zdWJzdHIob2Zmc2V0ICogMiwgMiAqIDY0KSwgMCk7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIGRlY29kZSBzb2xpZGl0eSBhcnJheSBhdCBnaXZlbiBpbmRleFxuICpcbiAqIEBtZXRob2QgZGVjb2RlQXJyYXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBieXRlc1xuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJucyB7U29saWRpdHlQYXJhbX1cbiAqL1xuU29saWRpdHlQYXJhbS5kZWNvZGVBcnJheSA9IGZ1bmN0aW9uIChieXRlcywgaW5kZXgpIHtcbiAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgdmFyIG9mZnNldCA9IGdldE9mZnNldChieXRlcywgaW5kZXgpO1xuICAgIHZhciBsZW5ndGggPSBwYXJzZUludCgnMHgnICsgYnl0ZXMuc3Vic3RyKG9mZnNldCAqIDIsIDY0KSk7XG4gICAgcmV0dXJuIG5ldyBTb2xpZGl0eVBhcmFtKGJ5dGVzLnN1YnN0cihvZmZzZXQgKiAyLCAobGVuZ3RoICsgMSkgKiA2NCksIDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb2xpZGl0eVBhcmFtO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGdvIGVudiBkb2Vzbid0IGhhdmUgYW5kIG5lZWQgWE1MSHR0cFJlcXVlc3RcbmlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5YTUxIdHRwUmVxdWVzdCA9IHt9O1xufSBlbHNlIHtcbiAgICBleHBvcnRzLlhNTEh0dHBSZXF1ZXN0ID0gWE1MSHR0cFJlcXVlc3Q7IC8vIGpzaGludCBpZ25vcmU6bGluZVxufVxuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBAZmlsZSBjb25maWcuanNcbiAqIEBhdXRob3JzOlxuICogICBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG4vKipcbiAqIFV0aWxzXG4gKiBcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zXG4gKiBcbiAqIEBjbGFzcyBbdXRpbHNdIGNvbmZpZ1xuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuLy8vIHJlcXVpcmVkIHRvIGRlZmluZSBFVEhfQklHTlVNQkVSX1JPVU5ESU5HX01PREVcbnZhciBCaWdOdW1iZXIgPSByZXF1aXJlKCdiaWdudW1iZXIuanMnKTtcblxudmFyIEVUSF9VTklUUyA9IFtcbiAgICAnd2VpJyxcbiAgICAna3dlaScsXG4gICAgJ013ZWknLFxuICAgICdHd2VpJyxcbiAgICAnc3phYm8nLFxuICAgICdmaW5uZXknLFxuICAgICdmZW10b2V0aGVyJyxcbiAgICAncGljb2V0aGVyJyxcbiAgICAnbmFub2V0aGVyJyxcbiAgICAnbWljcm9ldGhlcicsXG4gICAgJ21pbGxpZXRoZXInLFxuICAgICduYW5vJyxcbiAgICAnbWljcm8nLFxuICAgICdtaWxsaScsXG4gICAgJ2V0aGVyJyxcbiAgICAnZ3JhbmQnLFxuICAgICdNZXRoZXInLFxuICAgICdHZXRoZXInLFxuICAgICdUZXRoZXInLFxuICAgICdQZXRoZXInLFxuICAgICdFZXRoZXInLFxuICAgICdaZXRoZXInLFxuICAgICdZZXRoZXInLFxuICAgICdOZXRoZXInLFxuICAgICdEZXRoZXInLFxuICAgICdWZXRoZXInLFxuICAgICdVZXRoZXInXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBFVEhfUEFERElORzogMzIsXG4gICAgRVRIX1NJR05BVFVSRV9MRU5HVEg6IDQsXG4gICAgRVRIX1VOSVRTOiBFVEhfVU5JVFMsXG4gICAgRVRIX0JJR05VTUJFUl9ST1VORElOR19NT0RFOiB7IFJPVU5ESU5HX01PREU6IEJpZ051bWJlci5ST1VORF9ET1dOIH0sXG4gICAgRVRIX1BPTExJTkdfVElNRU9VVDogMTAwMC8yLFxuICAgIGRlZmF1bHRCbG9jazogJ2xhdGVzdCcsXG4gICAgZGVmYXVsdEFjY291bnQ6IHVuZGVmaW5lZFxufTtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSBzaGEzLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBzaGEzID0gcmVxdWlyZSgnY3J5cHRvLWpzL3NoYTMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBpc05ldykge1xuICAgIGlmIChzdHIuc3Vic3RyKDAsIDIpID09PSAnMHgnICYmICFpc05ldykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3JlcXVpcmVtZW50IG9mIHVzaW5nIHdlYjMuZnJvbUFzY2lpIGJlZm9yZSBzaGEzIGlzIGRlcHJlY2F0ZWQnKTtcbiAgICAgICAgY29uc29sZS53YXJuKCduZXcgdXNhZ2U6IFxcJ3dlYjMuc2hhMyhcImhlbGxvXCIpXFwnJyk7XG4gICAgICAgIGNvbnNvbGUud2Fybignc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ldGhlcmV1bS93ZWIzLmpzL3B1bGwvMjA1Jyk7XG4gICAgICAgIGNvbnNvbGUud2FybignaWYgeW91IG5lZWQgdG8gaGFzaCBoZXggdmFsdWUsIHlvdSBjYW4gZG8gXFwnc2hhMyhcIjB4ZmZmXCIsIHRydWUpXFwnJyk7XG4gICAgICAgIHN0ciA9IHV0aWxzLnRvQXNjaWkoc3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhMyhzdHIsIHtcbiAgICAgICAgb3V0cHV0TGVuZ3RoOiAyNTZcbiAgICB9KS50b1N0cmluZygpO1xufTtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSB1dGlscy5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG4vKipcbiAqIFV0aWxzXG4gKiBcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zXG4gKiBcbiAqIEBjbGFzcyBbdXRpbHNdIHV0aWxzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG52YXIgQmlnTnVtYmVyID0gcmVxdWlyZSgnYmlnbnVtYmVyLmpzJyk7XG5cbnZhciB1bml0TWFwID0ge1xuICAgICd3ZWknOiAgICAgICAgICAnMScsXG4gICAgJ2t3ZWknOiAgICAgICAgICcxMDAwJyxcbiAgICAnYWRhJzogICAgICAgICAgJzEwMDAnLFxuICAgICdmZW10b2V0aGVyJzogICAnMTAwMCcsXG4gICAgJ213ZWknOiAgICAgICAgICcxMDAwMDAwJyxcbiAgICAnYmFiYmFnZSc6ICAgICAgJzEwMDAwMDAnLFxuICAgICdwaWNvZXRoZXInOiAgICAnMTAwMDAwMCcsXG4gICAgJ2d3ZWknOiAgICAgICAgICcxMDAwMDAwMDAwJyxcbiAgICAnc2hhbm5vbic6ICAgICAgJzEwMDAwMDAwMDAnLFxuICAgICduYW5vZXRoZXInOiAgICAnMTAwMDAwMDAwMCcsXG4gICAgJ25hbm8nOiAgICAgICAgICcxMDAwMDAwMDAwJyxcbiAgICAnc3phYm8nOiAgICAgICAgJzEwMDAwMDAwMDAwMDAnLFxuICAgICdtaWNyb2V0aGVyJzogICAnMTAwMDAwMDAwMDAwMCcsXG4gICAgJ21pY3JvJzogICAgICAgICcxMDAwMDAwMDAwMDAwJyxcbiAgICAnZmlubmV5JzogICAgICAgJzEwMDAwMDAwMDAwMDAwMDAnLFxuICAgICdtaWxsaWV0aGVyJzogICAgJzEwMDAwMDAwMDAwMDAwMDAnLFxuICAgICdtaWxsaSc6ICAgICAgICAgJzEwMDAwMDAwMDAwMDAwMDAnLFxuICAgICdldGhlcic6ICAgICAgICAnMTAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJ2tldGhlcic6ICAgICAgICcxMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyxcbiAgICAnZ3JhbmQnOiAgICAgICAgJzEwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAgICdlaW5zdGVpbic6ICAgICAnMTAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgJ21ldGhlcic6ICAgICAgICcxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJyxcbiAgICAnZ2V0aGVyJzogICAgICAgJzEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAgICd0ZXRoZXInOiAgICAgICAnMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCdcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwYWQgc3RyaW5nIHRvIGV4cGVjdGVkIGxlbmd0aFxuICpcbiAqIEBtZXRob2QgcGFkTGVmdFxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyB0byBiZSBwYWRkZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBjaGFyYWN0ZXJzIHRoYXQgcmVzdWx0IHN0cmluZyBzaG91bGQgaGF2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ24sIGJ5IGRlZmF1bHQgMFxuICogQHJldHVybnMge1N0cmluZ30gcmlnaHQgYWxpZ25lZCBzdHJpbmdcbiAqL1xudmFyIHBhZExlZnQgPSBmdW5jdGlvbiAoc3RyaW5nLCBjaGFycywgc2lnbikge1xuICAgIHJldHVybiBuZXcgQXJyYXkoY2hhcnMgLSBzdHJpbmcubGVuZ3RoICsgMSkuam9pbihzaWduID8gc2lnbiA6IFwiMFwiKSArIHN0cmluZztcbn07XG5cbi8qKiBcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IHN0aW5nIGZyb20gaXQncyBoZXggcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAbWV0aG9kIHRvQXNjaWlcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgaW4gaGV4XG4gKiBAcmV0dXJucyB7U3RyaW5nfSBhc2NpaSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgaGV4IHZhbHVlXG4gKi9cbnZhciB0b0FzY2lpID0gZnVuY3Rpb24oaGV4KSB7XG4vLyBGaW5kIHRlcm1pbmF0aW9uXG4gICAgdmFyIHN0ciA9IFwiXCI7XG4gICAgdmFyIGkgPSAwLCBsID0gaGV4Lmxlbmd0aDtcbiAgICBpZiAoaGV4LnN1YnN0cmluZygwLCAyKSA9PT0gJzB4Jykge1xuICAgICAgICBpID0gMjtcbiAgICB9XG4gICAgZm9yICg7IGkgPCBsOyBpKz0yKSB7XG4gICAgICAgIHZhciBjb2RlID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpLCAyKSwgMTYpO1xuICAgICAgICBpZiAoY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xufTtcbiAgICBcbi8qKlxuICogU2hvbGQgYmUgY2FsbGVkIHRvIGdldCBoZXggcmVwcmVzZW50YXRpb24gKHByZWZpeGVkIGJ5IDB4KSBvZiBhc2NpaSBzdHJpbmcgXG4gKlxuICogQG1ldGhvZCB0b0hleE5hdGl2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gaGV4IHJlcHJlc2VudGF0aW9uIG9mIGlucHV0IHN0cmluZ1xuICovXG52YXIgdG9IZXhOYXRpdmUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgaGV4ID0gXCJcIjtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpO1xuICAgICAgICBoZXggKz0gbi5sZW5ndGggPCAyID8gJzAnICsgbiA6IG47XG4gICAgfVxuXG4gICAgcmV0dXJuIGhleDtcbn07XG5cbi8qKlxuICogU2hvbGQgYmUgY2FsbGVkIHRvIGdldCBoZXggcmVwcmVzZW50YXRpb24gKHByZWZpeGVkIGJ5IDB4KSBvZiBhc2NpaSBzdHJpbmcgXG4gKlxuICogQG1ldGhvZCBmcm9tQXNjaWlcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25hbCBwYWRkaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBoZXggcmVwcmVzZW50YXRpb24gb2YgaW5wdXQgc3RyaW5nXG4gKi9cbnZhciBmcm9tQXNjaWkgPSBmdW5jdGlvbihzdHIsIHBhZCkge1xuICAgIHBhZCA9IHBhZCA9PT0gdW5kZWZpbmVkID8gMCA6IHBhZDtcbiAgICB2YXIgaGV4ID0gdG9IZXhOYXRpdmUoc3RyKTtcbiAgICB3aGlsZSAoaGV4Lmxlbmd0aCA8IHBhZCoyKVxuICAgICAgICBoZXggKz0gXCIwMFwiO1xuICAgIHJldHVybiBcIjB4XCIgKyBoZXg7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGNyZWF0ZSBmdWxsIGZ1bmN0aW9uL2V2ZW50IG5hbWUgZnJvbSBqc29uIGFiaVxuICpcbiAqIEBtZXRob2QgdHJhbnNmb3JtVG9GdWxsTmFtZVxuICogQHBhcmFtIHtPYmplY3R9IGpzb24tYWJpXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGZ1bGwgZm5jdGlvbi9ldmVudCBuYW1lXG4gKi9cbnZhciB0cmFuc2Zvcm1Ub0Z1bGxOYW1lID0gZnVuY3Rpb24gKGpzb24pIHtcbiAgICBpZiAoanNvbi5uYW1lLmluZGV4T2YoJygnKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGpzb24ubmFtZTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZU5hbWUgPSBqc29uLmlucHV0cy5tYXAoZnVuY3Rpb24oaSl7cmV0dXJuIGkudHlwZTsgfSkuam9pbigpO1xuICAgIHJldHVybiBqc29uLm5hbWUgKyAnKCcgKyB0eXBlTmFtZSArICcpJztcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgZGlzcGxheSBuYW1lIG9mIGNvbnRyYWN0IGZ1bmN0aW9uXG4gKiBcbiAqIEBtZXRob2QgZXh0cmFjdERpc3BsYXlOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBvZiBmdW5jdGlvbi9ldmVudFxuICogQHJldHVybnMge1N0cmluZ30gZGlzcGxheSBuYW1lIGZvciBmdW5jdGlvbi9ldmVudCBlZy4gbXVsdGlwbHkodWludDI1NikgLT4gbXVsdGlwbHlcbiAqL1xudmFyIGV4dHJhY3REaXNwbGF5TmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGxlbmd0aCA9IG5hbWUuaW5kZXhPZignKCcpOyBcbiAgICByZXR1cm4gbGVuZ3RoICE9PSAtMSA/IG5hbWUuc3Vic3RyKDAsIGxlbmd0aCkgOiBuYW1lO1xufTtcblxuLy8vIEByZXR1cm5zIG92ZXJsb2FkZWQgcGFydCBvZiBmdW5jdGlvbi9ldmVudCBuYW1lXG52YXIgZXh0cmFjdFR5cGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLy8gVE9ETzogbWFrZSBpdCBpbnZ1bG5lcmFibGVcbiAgICB2YXIgbGVuZ3RoID0gbmFtZS5pbmRleE9mKCcoJyk7XG4gICAgcmV0dXJuIGxlbmd0aCAhPT0gLTEgPyBuYW1lLnN1YnN0cihsZW5ndGggKyAxLCBuYW1lLmxlbmd0aCAtIDEgLSAobGVuZ3RoICsgMSkpLnJlcGxhY2UoJyAnLCAnJykgOiBcIlwiO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyB2YWx1ZSB0byBpdCdzIGRlY2ltYWwgcmVwcmVzZW50YXRpb24gaW4gc3RyaW5nXG4gKlxuICogQG1ldGhvZCB0b0RlY2ltYWxcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcnxCaWdOdW1iZXJ9XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbnZhciB0b0RlY2ltYWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdG9CaWdOdW1iZXIodmFsdWUpLnRvTnVtYmVyKCk7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uXG4gKlxuICogQG1ldGhvZCBmcm9tRGVjaW1hbFxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfEJpZ051bWJlcn1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xudmFyIGZyb21EZWNpbWFsID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIG51bWJlciA9IHRvQmlnTnVtYmVyKHZhbHVlKTtcbiAgICB2YXIgcmVzdWx0ID0gbnVtYmVyLnRvU3RyaW5nKDE2KTtcblxuICAgIHJldHVybiBudW1iZXIubGVzc1RoYW4oMCkgPyAnLTB4JyArIHJlc3VsdC5zdWJzdHIoMSkgOiAnMHgnICsgcmVzdWx0O1xufTtcblxuLyoqXG4gKiBBdXRvIGNvbnZlcnRzIGFueSBnaXZlbiB2YWx1ZSBpbnRvIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIEFuZCBldmVuIHN0cmluZ2lmeXMgb2JqZWN0cyBiZWZvcmUuXG4gKlxuICogQG1ldGhvZCB0b0hleFxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfEJpZ051bWJlcnxPYmplY3R9XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbnZhciB0b0hleCA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAvKmpzaGludCBtYXhjb21wbGV4aXR5OjcgKi9cblxuICAgIGlmIChpc0Jvb2xlYW4odmFsKSlcbiAgICAgICAgcmV0dXJuIGZyb21EZWNpbWFsKCt2YWwpO1xuXG4gICAgaWYgKGlzQmlnTnVtYmVyKHZhbCkpXG4gICAgICAgIHJldHVybiBmcm9tRGVjaW1hbCh2YWwpO1xuXG4gICAgaWYgKGlzT2JqZWN0KHZhbCkpXG4gICAgICAgIHJldHVybiBmcm9tQXNjaWkoSlNPTi5zdHJpbmdpZnkodmFsKSk7XG5cbiAgICAvLyBpZiBpdHMgYSBuZWdhdGl2ZSBudW1iZXIsIHBhc3MgaXQgdGhyb3VnaCBmcm9tRGVjaW1hbFxuICAgIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICAgIGlmICh2YWwuaW5kZXhPZignLTB4JykgPT09IDApXG4gICAgICAgICAgIHJldHVybiBmcm9tRGVjaW1hbCh2YWwpO1xuICAgICAgICBlbHNlIGlmICghaXNGaW5pdGUodmFsKSlcbiAgICAgICAgICAgIHJldHVybiBmcm9tQXNjaWkodmFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJvbURlY2ltYWwodmFsKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB2YWx1ZSBvZiB1bml0IGluIFdlaVxuICpcbiAqIEBtZXRob2QgZ2V0VmFsdWVPZlVuaXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB1bml0IHRoZSB1bml0IHRvIGNvbnZlcnQgdG8sIGRlZmF1bHQgZXRoZXJcbiAqIEByZXR1cm5zIHtCaWdOdW1iZXJ9IHZhbHVlIG9mIHRoZSB1bml0IChpbiBXZWkpXG4gKiBAdGhyb3dzIGVycm9yIGlmIHRoZSB1bml0IGlzIG5vdCBjb3JyZWN0OndcbiAqL1xudmFyIGdldFZhbHVlT2ZVbml0ID0gZnVuY3Rpb24gKHVuaXQpIHtcbiAgICB1bml0ID0gdW5pdCA/IHVuaXQudG9Mb3dlckNhc2UoKSA6ICdldGhlcic7XG4gICAgdmFyIHVuaXRWYWx1ZSA9IHVuaXRNYXBbdW5pdF07XG4gICAgaWYgKHVuaXRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyB1bml0IGRvZXNuXFwndCBleGlzdHMsIHBsZWFzZSB1c2UgdGhlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHVuaXRzJyArIEpTT04uc3RyaW5naWZ5KHVuaXRNYXAsIG51bGwsIDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIodW5pdFZhbHVlLCAxMCk7XG59O1xuXG4vKipcbiAqIFRha2VzIGEgbnVtYmVyIG9mIHdlaSBhbmQgY29udmVydHMgaXQgdG8gYW55IG90aGVyIGV0aGVyIHVuaXQuXG4gKlxuICogUG9zc2libGUgdW5pdHMgYXJlOlxuICogICBTSSBTaG9ydCAgIFNJIEZ1bGwgICAgICAgIEVmZmlneSAgICAgICBPdGhlclxuICogLSBrd2VpICAgICAgIGZlbXRvZXRoZXIgICAgIGFkYVxuICogLSBtd2VpICAgICAgIHBpY29ldGhlciAgICAgIGJhYmJhZ2VcbiAqIC0gZ3dlaSAgICAgICBuYW5vZXRoZXIgICAgICBzaGFubm9uICAgICAgbmFub1xuICogLSAtLSAgICAgICAgIG1pY3JvZXRoZXIgICAgIHN6YWJvICAgICAgICBtaWNyb1xuICogLSAtLSAgICAgICAgIG1pbGxpZXRoZXIgICAgIGZpbm5leSAgICAgICBtaWxsaVxuICogLSBldGhlciAgICAgIC0tICAgICAgICAgICAgIC0tXG4gKiAtIGtldGhlciAgICAgICAgICAgICAgICAgICAgZWluc3RlaW4gICAgIGdyYW5kIFxuICogLSBtZXRoZXJcbiAqIC0gZ2V0aGVyXG4gKiAtIHRldGhlclxuICpcbiAqIEBtZXRob2QgZnJvbVdlaVxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBudW1iZXIgY2FuIGJlIGEgbnVtYmVyLCBudW1iZXIgc3RyaW5nIG9yIGEgSEVYIG9mIGEgZGVjaW1hbFxuICogQHBhcmFtIHtTdHJpbmd9IHVuaXQgdGhlIHVuaXQgdG8gY29udmVydCB0bywgZGVmYXVsdCBldGhlclxuICogQHJldHVybiB7U3RyaW5nfE9iamVjdH0gV2hlbiBnaXZlbiBhIEJpZ051bWJlciBvYmplY3QgaXQgcmV0dXJucyBvbmUgYXMgd2VsbCwgb3RoZXJ3aXNlIGEgbnVtYmVyXG4qL1xudmFyIGZyb21XZWkgPSBmdW5jdGlvbihudW1iZXIsIHVuaXQpIHtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0b0JpZ051bWJlcihudW1iZXIpLmRpdmlkZWRCeShnZXRWYWx1ZU9mVW5pdCh1bml0KSk7XG5cbiAgICByZXR1cm4gaXNCaWdOdW1iZXIobnVtYmVyKSA/IHJldHVyblZhbHVlIDogcmV0dXJuVmFsdWUudG9TdHJpbmcoMTApOyBcbn07XG5cbi8qKlxuICogVGFrZXMgYSBudW1iZXIgb2YgYSB1bml0IGFuZCBjb252ZXJ0cyBpdCB0byB3ZWkuXG4gKlxuICogUG9zc2libGUgdW5pdHMgYXJlOlxuICogICBTSSBTaG9ydCAgIFNJIEZ1bGwgICAgICAgIEVmZmlneSAgICAgICBPdGhlclxuICogLSBrd2VpICAgICAgIGZlbXRvZXRoZXIgICAgIGFkYVxuICogLSBtd2VpICAgICAgIHBpY29ldGhlciAgICAgIGJhYmJhZ2UgICAgICAgXG4gKiAtIGd3ZWkgICAgICAgbmFub2V0aGVyICAgICAgc2hhbm5vbiAgICAgIG5hbm9cbiAqIC0gLS0gICAgICAgICBtaWNyb2V0aGVyICAgICBzemFibyAgICAgICAgbWljcm9cbiAqIC0gLS0gICAgICAgICBtaWxsaWV0aGVyICAgICBmaW5uZXkgICAgICAgbWlsbGlcbiAqIC0gZXRoZXIgICAgICAtLSAgICAgICAgICAgICAtLVxuICogLSBrZXRoZXIgICAgICAgICAgICAgICAgICAgIGVpbnN0ZWluICAgICBncmFuZCBcbiAqIC0gbWV0aGVyXG4gKiAtIGdldGhlclxuICogLSB0ZXRoZXJcbiAqXG4gKiBAbWV0aG9kIHRvV2VpXG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd8QmlnTnVtYmVyfSBudW1iZXIgY2FuIGJlIGEgbnVtYmVyLCBudW1iZXIgc3RyaW5nIG9yIGEgSEVYIG9mIGEgZGVjaW1hbFxuICogQHBhcmFtIHtTdHJpbmd9IHVuaXQgdGhlIHVuaXQgdG8gY29udmVydCBmcm9tLCBkZWZhdWx0IGV0aGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8T2JqZWN0fSBXaGVuIGdpdmVuIGEgQmlnTnVtYmVyIG9iamVjdCBpdCByZXR1cm5zIG9uZSBhcyB3ZWxsLCBvdGhlcndpc2UgYSBudW1iZXJcbiovXG52YXIgdG9XZWkgPSBmdW5jdGlvbihudW1iZXIsIHVuaXQpIHtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0b0JpZ051bWJlcihudW1iZXIpLnRpbWVzKGdldFZhbHVlT2ZVbml0KHVuaXQpKTtcblxuICAgIHJldHVybiBpc0JpZ051bWJlcihudW1iZXIpID8gcmV0dXJuVmFsdWUgOiByZXR1cm5WYWx1ZS50b1N0cmluZygxMCk7IFxufTtcblxuLyoqXG4gKiBUYWtlcyBhbiBpbnB1dCBhbmQgdHJhbnNmb3JtcyBpdCBpbnRvIGFuIGJpZ251bWJlclxuICpcbiAqIEBtZXRob2QgdG9CaWdOdW1iZXJcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ3xCaWdOdW1iZXJ9IGEgbnVtYmVyLCBzdHJpbmcsIEhFWCBzdHJpbmcgb3IgQmlnTnVtYmVyXG4gKiBAcmV0dXJuIHtCaWdOdW1iZXJ9IEJpZ051bWJlclxuKi9cbnZhciB0b0JpZ051bWJlciA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIC8qanNoaW50IG1heGNvbXBsZXhpdHk6NSAqL1xuICAgIG51bWJlciA9IG51bWJlciB8fCAwO1xuICAgIGlmIChpc0JpZ051bWJlcihudW1iZXIpKVxuICAgICAgICByZXR1cm4gbnVtYmVyO1xuXG4gICAgaWYgKGlzU3RyaW5nKG51bWJlcikgJiYgKG51bWJlci5pbmRleE9mKCcweCcpID09PSAwIHx8IG51bWJlci5pbmRleE9mKCctMHgnKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobnVtYmVyLnJlcGxhY2UoJzB4JywnJyksIDE2KTtcbiAgICB9XG4gICBcbiAgICByZXR1cm4gbmV3IEJpZ051bWJlcihudW1iZXIudG9TdHJpbmcoMTApLCAxMCk7XG59O1xuXG4vKipcbiAqIFRha2VzIGFuZCBpbnB1dCB0cmFuc2Zvcm1zIGl0IGludG8gYmlnbnVtYmVyIGFuZCBpZiBpdCBpcyBuZWdhdGl2ZSB2YWx1ZSwgaW50byB0d28ncyBjb21wbGVtZW50XG4gKlxuICogQG1ldGhvZCB0b1R3b3NDb21wbGVtZW50XG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd8QmlnTnVtYmVyfVxuICogQHJldHVybiB7QmlnTnVtYmVyfVxuICovXG52YXIgdG9Ud29zQ29tcGxlbWVudCA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICB2YXIgYmlnTnVtYmVyID0gdG9CaWdOdW1iZXIobnVtYmVyKTtcbiAgICBpZiAoYmlnTnVtYmVyLmxlc3NUaGFuKDApKSB7XG4gICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKFwiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZlwiLCAxNikucGx1cyhiaWdOdW1iZXIpLnBsdXMoMSk7XG4gICAgfVxuICAgIHJldHVybiBiaWdOdW1iZXI7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIHN0cmljdGx5IGFuIGFkZHJlc3NcbiAqXG4gKiBAbWV0aG9kIGlzU3RyaWN0QWRkcmVzc1xuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgdGhlIGdpdmVuIEhFWCBhZHJlc3NcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4qL1xudmFyIGlzU3RyaWN0QWRkcmVzcyA9IGZ1bmN0aW9uIChhZGRyZXNzKSB7XG4gICAgcmV0dXJuIC9eMHhbMC05YS1mXXs0MH0kLy50ZXN0KGFkZHJlc3MpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIHN0cmluZyBpcyBhbiBhZGRyZXNzXG4gKlxuICogQG1ldGhvZCBpc0FkZHJlc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIHRoZSBnaXZlbiBIRVggYWRyZXNzXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuKi9cbnZhciBpc0FkZHJlc3MgPSBmdW5jdGlvbiAoYWRkcmVzcykge1xuICAgIHJldHVybiAvXigweCk/WzAtOWEtZl17NDB9JC8udGVzdChhZGRyZXNzKTtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyBnaXZlbiBzdHJpbmcgdG8gdmFsaWQgMjAgYnl0ZXMtbGVuZ3RoIGFkZHJlcyB3aXRoIDB4IHByZWZpeFxuICpcbiAqIEBtZXRob2QgdG9BZGRyZXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzc1xuICogQHJldHVybiB7U3RyaW5nfSBmb3JtYXR0ZWQgYWRkcmVzc1xuICovXG52YXIgdG9BZGRyZXNzID0gZnVuY3Rpb24gKGFkZHJlc3MpIHtcbiAgICBpZiAoaXNTdHJpY3RBZGRyZXNzKGFkZHJlc3MpKSB7XG4gICAgICAgIHJldHVybiBhZGRyZXNzO1xuICAgIH1cbiAgICBcbiAgICBpZiAoL15bMC05YS1mXXs0MH0kLy50ZXN0KGFkZHJlc3MpKSB7XG4gICAgICAgIHJldHVybiAnMHgnICsgYWRkcmVzcztcbiAgICB9XG5cbiAgICByZXR1cm4gJzB4JyArIHBhZExlZnQodG9IZXgoYWRkcmVzcykuc3Vic3RyKDIpLCA0MCk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBCaWdOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICpcbiAqIEBtZXRob2QgaXNCaWdOdW1iZXJcbiAqIEBwYXJhbSB7T2JqZWN0fVxuICogQHJldHVybiB7Qm9vbGVhbn0gXG4gKi9cbnZhciBpc0JpZ051bWJlciA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgQmlnTnVtYmVyIHx8XG4gICAgICAgIChvYmplY3QgJiYgb2JqZWN0LmNvbnN0cnVjdG9yICYmIG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQmlnTnVtYmVyJyk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgc3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqIFxuICogQG1ldGhvZCBpc1N0cmluZ1xuICogQHBhcmFtIHtPYmplY3R9XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgIChvYmplY3QgJiYgb2JqZWN0LmNvbnN0cnVjdG9yICYmIG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU3RyaW5nJyk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICpcbiAqIEBtZXRob2QgaXNGdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3R9XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBPYmpldCwgb3RoZXJ3aXNlIGZhbHNlXG4gKlxuICogQG1ldGhvZCBpc09iamVjdFxuICogQHBhcmFtIHtPYmplY3R9XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG52YXIgaXNPYmplY3QgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGJvb2xlYW4sIG90aGVyd2lzZSBmYWxzZVxuICpcbiAqIEBtZXRob2QgaXNCb29sZWFuXG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbnZhciBpc0Jvb2xlYW4gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdib29sZWFuJztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBhcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKlxuICogQG1ldGhvZCBpc0FycmF5XG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbnZhciBpc0FycmF5ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBBcnJheTsgXG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBnaXZlbiBzdHJpbmcgaXMgdmFsaWQganNvbiBvYmplY3RcbiAqIFxuICogQG1ldGhvZCBpc0pzb25cbiAqIEBwYXJhbSB7U3RyaW5nfVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xudmFyIGlzSnNvbiA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gISFKU09OLnBhcnNlKHN0cik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIHRvIGNoZWNrIGlmIHN0cmluZyBpcyB2YWxpZCBldGhlcmV1bSBJQkFOIG51bWJlclxuICogU3VwcG9ydHMgZGlyZWN0IGFuZCBpbmRpcmVjdCBJQkFOc1xuICpcbiAqIEBtZXRob2QgaXNJQkFOXG4gKiBAcGFyYW0ge1N0cmluZ31cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbnZhciBpc0lCQU4gPSBmdW5jdGlvbiAoaWJhbikge1xuICAgIHJldHVybiAvXlhFWzAtOV17Mn0oRVRIWzAtOUEtWl17MTN9fFswLTlBLVpdezMwfSkkLy50ZXN0KGliYW4pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcGFkTGVmdDogcGFkTGVmdCxcbiAgICB0b0hleDogdG9IZXgsXG4gICAgdG9EZWNpbWFsOiB0b0RlY2ltYWwsXG4gICAgZnJvbURlY2ltYWw6IGZyb21EZWNpbWFsLFxuICAgIHRvQXNjaWk6IHRvQXNjaWksXG4gICAgZnJvbUFzY2lpOiBmcm9tQXNjaWksXG4gICAgdHJhbnNmb3JtVG9GdWxsTmFtZTogdHJhbnNmb3JtVG9GdWxsTmFtZSxcbiAgICBleHRyYWN0RGlzcGxheU5hbWU6IGV4dHJhY3REaXNwbGF5TmFtZSxcbiAgICBleHRyYWN0VHlwZU5hbWU6IGV4dHJhY3RUeXBlTmFtZSxcbiAgICB0b1dlaTogdG9XZWksXG4gICAgZnJvbVdlaTogZnJvbVdlaSxcbiAgICB0b0JpZ051bWJlcjogdG9CaWdOdW1iZXIsXG4gICAgdG9Ud29zQ29tcGxlbWVudDogdG9Ud29zQ29tcGxlbWVudCxcbiAgICB0b0FkZHJlc3M6IHRvQWRkcmVzcyxcbiAgICBpc0JpZ051bWJlcjogaXNCaWdOdW1iZXIsXG4gICAgaXNTdHJpY3RBZGRyZXNzOiBpc1N0cmljdEFkZHJlc3MsXG4gICAgaXNBZGRyZXNzOiBpc0FkZHJlc3MsXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIGlzQm9vbGVhbjogaXNCb29sZWFuLFxuICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgaXNKc29uOiBpc0pzb24sXG4gICAgaXNJQkFOOiBpc0lCQU5cbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcInZlcnNpb25cIjogXCIwLjUuMFwiXG59XG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBAZmlsZSB3ZWIzLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgSmVmZnJleSBXaWxja2UgPGplZmZAZXRoZGV2LmNvbT5cbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiAgIE1hcmlhbiBPYW5jZWEgPG1hcmlhbkBldGhkZXYuY29tPlxuICogICBGYWJpYW4gVm9nZWxzdGVsbGVyIDxmYWJpYW5AZXRoZGV2LmNvbT5cbiAqICAgR2F2IFdvb2QgPGdAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTRcbiAqL1xuXG52YXIgdmVyc2lvbiA9IHJlcXVpcmUoJy4vdmVyc2lvbi5qc29uJyk7XG52YXIgbmV0ID0gcmVxdWlyZSgnLi93ZWIzL25ldCcpO1xudmFyIGV0aCA9IHJlcXVpcmUoJy4vd2ViMy9ldGgnKTtcbnZhciBkYiA9IHJlcXVpcmUoJy4vd2ViMy9kYicpO1xudmFyIHNoaCA9IHJlcXVpcmUoJy4vd2ViMy9zaGgnKTtcbnZhciB3YXRjaGVzID0gcmVxdWlyZSgnLi93ZWIzL3dhdGNoZXMnKTtcbnZhciBGaWx0ZXIgPSByZXF1aXJlKCcuL3dlYjMvZmlsdGVyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL3V0aWxzJyk7XG52YXIgZm9ybWF0dGVycyA9IHJlcXVpcmUoJy4vd2ViMy9mb3JtYXR0ZXJzJyk7XG52YXIgUmVxdWVzdE1hbmFnZXIgPSByZXF1aXJlKCcuL3dlYjMvcmVxdWVzdG1hbmFnZXInKTtcbnZhciBjID0gcmVxdWlyZSgnLi91dGlscy9jb25maWcnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vd2ViMy9wcm9wZXJ0eScpO1xudmFyIEJhdGNoID0gcmVxdWlyZSgnLi93ZWIzL2JhdGNoJyk7XG52YXIgc2hhMyA9IHJlcXVpcmUoJy4vdXRpbHMvc2hhMycpO1xuXG52YXIgd2ViM1Byb3BlcnRpZXMgPSBbXG4gICAgbmV3IFByb3BlcnR5KHtcbiAgICAgICAgbmFtZTogJ3ZlcnNpb24uY2xpZW50JyxcbiAgICAgICAgZ2V0dGVyOiAnd2ViM19jbGllbnRWZXJzaW9uJ1xuICAgIH0pLFxuICAgIG5ldyBQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6ICd2ZXJzaW9uLm5ldHdvcmsnLFxuICAgICAgICBnZXR0ZXI6ICduZXRfdmVyc2lvbicsXG4gICAgICAgIGlucHV0Rm9ybWF0dGVyOiB1dGlscy50b0RlY2ltYWxcbiAgICB9KSxcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAndmVyc2lvbi5ldGhlcmV1bScsXG4gICAgICAgIGdldHRlcjogJ2V0aF9wcm90b2NvbFZlcnNpb24nLFxuICAgICAgICBpbnB1dEZvcm1hdHRlcjogdXRpbHMudG9EZWNpbWFsXG4gICAgfSksXG4gICAgbmV3IFByb3BlcnR5KHtcbiAgICAgICAgbmFtZTogJ3ZlcnNpb24ud2hpc3BlcicsXG4gICAgICAgIGdldHRlcjogJ3NoaF92ZXJzaW9uJyxcbiAgICAgICAgaW5wdXRGb3JtYXR0ZXI6IHV0aWxzLnRvRGVjaW1hbFxuICAgIH0pXG5dO1xuXG4vLy8gY3JlYXRlcyBtZXRob2RzIGluIGEgZ2l2ZW4gb2JqZWN0IGJhc2VkIG9uIG1ldGhvZCBkZXNjcmlwdGlvbiBvbiBpbnB1dFxuLy8vIHNldHVwcyBhcGkgY2FsbHMgZm9yIHRoZXNlIG1ldGhvZHNcbnZhciBzZXR1cE1ldGhvZHMgPSBmdW5jdGlvbiAob2JqLCBtZXRob2RzKSB7XG4gICAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgbWV0aG9kLmF0dGFjaFRvT2JqZWN0KG9iaik7XG4gICAgfSk7XG59O1xuXG4vLy8gY3JlYXRlcyBwcm9wZXJ0aWVzIGluIGEgZ2l2ZW4gb2JqZWN0IGJhc2VkIG9uIHByb3BlcnRpZXMgZGVzY3JpcHRpb24gb24gaW5wdXRcbi8vLyBzZXR1cHMgYXBpIGNhbGxzIGZvciB0aGVzZSBwcm9wZXJ0aWVzXG52YXIgc2V0dXBQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKG9iaiwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgcHJvcGVydHkuYXR0YWNoVG9PYmplY3Qob2JqKTtcbiAgICB9KTtcbn07XG5cbi8vLyBzZXR1cHMgd2ViMyBvYmplY3QsIGFuZCBpdCdzIGluLWJyb3dzZXIgZXhlY3V0ZWQgbWV0aG9kc1xudmFyIHdlYjMgPSB7fTtcbndlYjMucHJvdmlkZXJzID0ge307XG53ZWIzLnZlcnNpb24gPSB7fTtcbndlYjMudmVyc2lvbi5hcGkgPSB2ZXJzaW9uLnZlcnNpb247XG53ZWIzLmV0aCA9IHt9O1xuXG4vKmpzaGludCBtYXhwYXJhbXM6NCAqL1xud2ViMy5ldGguZmlsdGVyID0gZnVuY3Rpb24gKGZpbCwgZXZlbnRQYXJhbXMsIG9wdGlvbnMsIGZvcm1hdHRlcikge1xuXG4gICAgLy8gaWYgaXRzIGV2ZW50LCB0cmVhdCBpdCBkaWZmZXJlbnRseVxuICAgIC8vIFRPRE86IHNpbXBsaWZ5IGFuZCByZW1vdmVcbiAgICBpZiAoZmlsLl9pc0V2ZW50KSB7XG4gICAgICAgIHJldHVybiBmaWwoZXZlbnRQYXJhbXMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIG91dHB1dCBsb2dzIHdvcmtzIGZvciBibG9ja0ZpbHRlciBhbmQgcGVuZGluZ1RyYW5zYWN0aW9uIGZpbHRlcnM/XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXIoZmlsLCB3YXRjaGVzLmV0aCgpLCBmb3JtYXR0ZXIgfHwgZm9ybWF0dGVycy5vdXRwdXRMb2dGb3JtYXR0ZXIpO1xufTtcbi8qanNoaW50IG1heHBhcmFtczozICovXG5cbndlYjMuc2hoID0ge307XG53ZWIzLnNoaC5maWx0ZXIgPSBmdW5jdGlvbiAoZmlsKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXIoZmlsLCB3YXRjaGVzLnNoaCgpLCBmb3JtYXR0ZXJzLm91dHB1dFBvc3RGb3JtYXR0ZXIpO1xufTtcbndlYjMubmV0ID0ge307XG53ZWIzLmRiID0ge307XG53ZWIzLnNldFByb3ZpZGVyID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgUmVxdWVzdE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZXRQcm92aWRlcihwcm92aWRlcik7XG59O1xud2ViMy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBSZXF1ZXN0TWFuYWdlci5nZXRJbnN0YW5jZSgpLnJlc2V0KCk7XG4gICAgYy5kZWZhdWx0QmxvY2sgPSAnbGF0ZXN0JztcbiAgICBjLmRlZmF1bHRBY2NvdW50ID0gdW5kZWZpbmVkO1xufTtcbndlYjMudG9IZXggPSB1dGlscy50b0hleDtcbndlYjMudG9Bc2NpaSA9IHV0aWxzLnRvQXNjaWk7XG53ZWIzLmZyb21Bc2NpaSA9IHV0aWxzLmZyb21Bc2NpaTtcbndlYjMudG9EZWNpbWFsID0gdXRpbHMudG9EZWNpbWFsO1xud2ViMy5mcm9tRGVjaW1hbCA9IHV0aWxzLmZyb21EZWNpbWFsO1xud2ViMy50b0JpZ051bWJlciA9IHV0aWxzLnRvQmlnTnVtYmVyO1xud2ViMy50b1dlaSA9IHV0aWxzLnRvV2VpO1xud2ViMy5mcm9tV2VpID0gdXRpbHMuZnJvbVdlaTtcbndlYjMuaXNBZGRyZXNzID0gdXRpbHMuaXNBZGRyZXNzO1xud2ViMy5pc0lCQU4gPSB1dGlscy5pc0lCQU47XG53ZWIzLnNoYTMgPSBzaGEzO1xud2ViMy5jcmVhdGVCYXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEJhdGNoKCk7XG59O1xuXG4vLyBBREQgZGVmYXVsdGJsb2NrXG5PYmplY3QuZGVmaW5lUHJvcGVydHkod2ViMy5ldGgsICdkZWZhdWx0QmxvY2snLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjLmRlZmF1bHRCbG9jaztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICBjLmRlZmF1bHRCbG9jayA9IHZhbDtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHdlYjMuZXRoLCAnZGVmYXVsdEFjY291bnQnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjLmRlZmF1bHRBY2NvdW50O1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIGMuZGVmYXVsdEFjY291bnQgPSB2YWw7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxufSk7XG5cblxuLy8gRVhURU5EXG53ZWIzLl9leHRlbmQgPSBmdW5jdGlvbihleHRlbnNpb24pe1xuICAgIC8qanNoaW50IG1heGNvbXBsZXhpdHk6IDYgKi9cblxuICAgIGlmKGV4dGVuc2lvbi5wcm9wZXJ0eSAmJiAhd2ViM1tleHRlbnNpb24ucHJvcGVydHldKVxuICAgICAgICB3ZWIzW2V4dGVuc2lvbi5wcm9wZXJ0eV0gPSB7fTtcblxuICAgIHNldHVwTWV0aG9kcyh3ZWIzW2V4dGVuc2lvbi5wcm9wZXJ0eV0gfHwgd2ViMywgZXh0ZW5zaW9uLm1ldGhvZHMgfHwgW10pO1xuICAgIHNldHVwUHJvcGVydGllcyh3ZWIzW2V4dGVuc2lvbi5wcm9wZXJ0eV0gfHwgd2ViMywgZXh0ZW5zaW9uLnByb3BlcnRpZXMgfHwgW10pO1xufTtcbndlYjMuX2V4dGVuZC5mb3JtYXR0ZXJzID0gZm9ybWF0dGVycztcbndlYjMuX2V4dGVuZC51dGlscyA9IHV0aWxzO1xud2ViMy5fZXh0ZW5kLk1ldGhvZCA9IHJlcXVpcmUoJy4vd2ViMy9tZXRob2QnKTtcbndlYjMuX2V4dGVuZC5Qcm9wZXJ0eSA9IHJlcXVpcmUoJy4vd2ViMy9wcm9wZXJ0eScpO1xuXG5cbi8vLyBzZXR1cHMgYWxsIGFwaSBtZXRob2RzXG5zZXR1cFByb3BlcnRpZXMod2ViMywgd2ViM1Byb3BlcnRpZXMpO1xuc2V0dXBNZXRob2RzKHdlYjMubmV0LCBuZXQubWV0aG9kcyk7XG5zZXR1cFByb3BlcnRpZXMod2ViMy5uZXQsIG5ldC5wcm9wZXJ0aWVzKTtcbnNldHVwTWV0aG9kcyh3ZWIzLmV0aCwgZXRoLm1ldGhvZHMpO1xuc2V0dXBQcm9wZXJ0aWVzKHdlYjMuZXRoLCBldGgucHJvcGVydGllcyk7XG5zZXR1cE1ldGhvZHMod2ViMy5kYiwgZGIubWV0aG9kcyk7XG5zZXR1cE1ldGhvZHMod2ViMy5zaGgsIHNoaC5tZXRob2RzKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3ZWIzO1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBcbiAqIEBmaWxlIGJhdGNoLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciBSZXF1ZXN0TWFuYWdlciA9IHJlcXVpcmUoJy4vcmVxdWVzdG1hbmFnZXInKTtcblxudmFyIEJhdGNoID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVxdWVzdHMgPSBbXTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBhZGQgY3JlYXRlIG5ldyByZXF1ZXN0IHRvIGJhdGNoIHJlcXVlc3RcbiAqXG4gKiBAbWV0aG9kIGFkZFxuICogQHBhcmFtIHtPYmplY3R9IGpzb25ycGMgcmVxdWV0IG9iamVjdFxuICovXG5CYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICB0aGlzLnJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZXhlY3V0ZSBiYXRjaCByZXF1ZXN0XG4gKlxuICogQG1ldGhvZCBleGVjdXRlXG4gKi9cbkJhdGNoLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXF1ZXN0cyA9IHRoaXMucmVxdWVzdHM7XG4gICAgUmVxdWVzdE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZW5kQmF0Y2gocmVxdWVzdHMsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG4gICAgICAgIHJlcXVlc3RzLm1hcChmdW5jdGlvbiAocmVxdWVzdCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzW2luZGV4XSB8fCB7fTtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChyZXN1bHQsIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdHNbaW5kZXhdLmZvcm1hdCA/IHJlcXVlc3RzW2luZGV4XS5mb3JtYXQocmVzdWx0LnJlc3VsdCkgOiByZXN1bHQucmVzdWx0O1xuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAocmVxdWVzdHNbaW5kZXhdLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdHNbaW5kZXhdLmNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7IFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXRjaDtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSBjb250cmFjdC5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTRcbiAqL1xuXG52YXIgd2ViMyA9IHJlcXVpcmUoJy4uL3dlYjMnKTsgXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy91dGlscycpO1xudmFyIGNvZGVyID0gcmVxdWlyZSgnLi4vc29saWRpdHkvY29kZXInKTtcbnZhciBTb2xpZGl0eUV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudCcpO1xudmFyIFNvbGlkaXR5RnVuY3Rpb24gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBlbmNvZGUgY29uc3RydWN0b3IgcGFyYW1zXG4gKlxuICogQG1ldGhvZCBlbmNvZGVDb25zdHJ1Y3RvclBhcmFtc1xuICogQHBhcmFtIHtBcnJheX0gYWJpXG4gKiBAcGFyYW0ge0FycmF5fSBjb25zdHJ1Y3RvciBwYXJhbXNcbiAqL1xudmFyIGVuY29kZUNvbnN0cnVjdG9yUGFyYW1zID0gZnVuY3Rpb24gKGFiaSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGFiaS5maWx0ZXIoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgcmV0dXJuIGpzb24udHlwZSA9PT0gJ2NvbnN0cnVjdG9yJyAmJiBqc29uLmlucHV0cy5sZW5ndGggPT09IHBhcmFtcy5sZW5ndGg7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIHJldHVybiBqc29uLmlucHV0cy5tYXAoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudHlwZTtcbiAgICAgICAgfSk7XG4gICAgfSkubWFwKGZ1bmN0aW9uICh0eXBlcykge1xuICAgICAgICByZXR1cm4gY29kZXIuZW5jb2RlUGFyYW1zKHR5cGVzLCBwYXJhbXMpO1xuICAgIH0pWzBdIHx8ICcnO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGFkZCBmdW5jdGlvbnMgdG8gY29udHJhY3Qgb2JqZWN0XG4gKlxuICogQG1ldGhvZCBhZGRGdW5jdGlvbnNUb0NvbnRyYWN0XG4gKiBAcGFyYW0ge0NvbnRyYWN0fSBjb250cmFjdFxuICogQHBhcmFtIHtBcnJheX0gYWJpXG4gKi9cbnZhciBhZGRGdW5jdGlvbnNUb0NvbnRyYWN0ID0gZnVuY3Rpb24gKGNvbnRyYWN0LCBhYmkpIHtcbiAgICBhYmkuZmlsdGVyKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIHJldHVybiBqc29uLnR5cGUgPT09ICdmdW5jdGlvbic7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgIHJldHVybiBuZXcgU29saWRpdHlGdW5jdGlvbihqc29uLCBjb250cmFjdC5hZGRyZXNzKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIGYuYXR0YWNoVG9Db250cmFjdChjb250cmFjdCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gYWRkIGV2ZW50cyB0byBjb250cmFjdCBvYmplY3RcbiAqXG4gKiBAbWV0aG9kIGFkZEV2ZW50c1RvQ29udHJhY3RcbiAqIEBwYXJhbSB7Q29udHJhY3R9IGNvbnRyYWN0XG4gKiBAcGFyYW0ge0FycmF5fSBhYmlcbiAqL1xudmFyIGFkZEV2ZW50c1RvQ29udHJhY3QgPSBmdW5jdGlvbiAoY29udHJhY3QsIGFiaSkge1xuICAgIGFiaS5maWx0ZXIoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgcmV0dXJuIGpzb24udHlwZSA9PT0gJ2V2ZW50JztcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTb2xpZGl0eUV2ZW50KGpzb24sIGNvbnRyYWN0LmFkZHJlc3MpO1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5hdHRhY2hUb0NvbnRyYWN0KGNvbnRyYWN0KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBjcmVhdGUgbmV3IENvbnRyYWN0RmFjdG9yeVxuICpcbiAqIEBtZXRob2QgY29udHJhY3RcbiAqIEBwYXJhbSB7QXJyYXl9IGFiaVxuICogQHJldHVybnMge0NvbnRyYWN0RmFjdG9yeX0gbmV3IGNvbnRyYWN0IGZhY3RvcnlcbiAqL1xudmFyIGNvbnRyYWN0ID0gZnVuY3Rpb24gKGFiaSkge1xuICAgIHJldHVybiBuZXcgQ29udHJhY3RGYWN0b3J5KGFiaSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gY3JlYXRlIG5ldyBDb250cmFjdEZhY3RvcnkgaW5zdGFuY2VcbiAqXG4gKiBAbWV0aG9kIENvbnRyYWN0RmFjdG9yeVxuICogQHBhcmFtIHtBcnJheX0gYWJpXG4gKi9cbnZhciBDb250cmFjdEZhY3RvcnkgPSBmdW5jdGlvbiAoYWJpKSB7XG4gICAgdGhpcy5hYmkgPSBhYmk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gY3JlYXRlIG5ldyBjb250cmFjdCBvbiBhIGJsb2NrY2hhaW5cbiAqIFxuICogQG1ldGhvZCBuZXdcbiAqIEBwYXJhbSB7QW55fSBjb250cmFjdCBjb25zdHJ1Y3RvciBwYXJhbTEgKG9wdGlvbmFsKVxuICogQHBhcmFtIHtBbnl9IGNvbnRyYWN0IGNvbnN0cnVjdG9yIHBhcmFtMiAob3B0aW9uYWwpXG4gKiBAcGFyYW0ge09iamVjdH0gY29udHJhY3QgdHJhbnNhY3Rpb24gb2JqZWN0IChyZXF1aXJlZClcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7Q29udHJhY3R9IHJldHVybnMgY29udHJhY3QgaWYgbm8gY2FsbGJhY2sgd2FzIHBhc3NlZCxcbiAqIG90aGVyd2lzZSBjYWxscyBjYWxsYmFjayBmdW5jdGlvbiAoZXJyLCBjb250cmFjdClcbiAqL1xuQ29udHJhY3RGYWN0b3J5LnByb3RvdHlwZS5uZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gcGFyc2UgYXJndW1lbnRzXG4gICAgdmFyIG9wdGlvbnMgPSB7fTsgLy8gcmVxdWlyZWQhXG4gICAgdmFyIGNhbGxiYWNrO1xuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGFyZ3NbYXJncy5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgIH1cblxuICAgIHZhciBsYXN0ID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuICAgIGlmICh1dGlscy5pc09iamVjdChsYXN0KSAmJiAhdXRpbHMuaXNBcnJheShsYXN0KSkge1xuICAgICAgICBvcHRpb25zID0gYXJncy5wb3AoKTtcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBhbiBlcnJvciBpZiB0aGVyZSBhcmUgbm8gb3B0aW9uc1xuXG4gICAgdmFyIGJ5dGVzID0gZW5jb2RlQ29uc3RydWN0b3JQYXJhbXModGhpcy5hYmksIGFyZ3MpO1xuICAgIG9wdGlvbnMuZGF0YSArPSBieXRlcztcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGFkZHJlc3MgPSB3ZWIzLmV0aC5zZW5kVHJhbnNhY3Rpb24ob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLmF0KGFkZHJlc3MpO1xuICAgIH1cbiAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHdlYjMuZXRoLnNlbmRUcmFuc2FjdGlvbihvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBhZGRyZXNzKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5hdChhZGRyZXNzLCBjYWxsYmFjayk7IFxuICAgIH0pOyBcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgYWNjZXNzIHRvIGV4aXN0aW5nIGNvbnRyYWN0IG9uIGEgYmxvY2tjaGFpblxuICpcbiAqIEBtZXRob2QgYXRcbiAqIEBwYXJhbSB7QWRkcmVzc30gY29udHJhY3QgYWRkcmVzcyAocmVxdWlyZWQpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayB7b3B0aW9uYWwpXG4gKiBAcmV0dXJucyB7Q29udHJhY3R9IHJldHVybnMgY29udHJhY3QgaWYgbm8gY2FsbGJhY2sgd2FzIHBhc3NlZCxcbiAqIG90aGVyd2lzZSBjYWxscyBjYWxsYmFjayBmdW5jdGlvbiAoZXJyLCBjb250cmFjdClcbiAqL1xuQ29udHJhY3RGYWN0b3J5LnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIChhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIC8vIFRPRE86IGFkZHJlc3MgaXMgcmVxdWlyZWRcbiAgICBcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgbmV3IENvbnRyYWN0KHRoaXMuYWJpLCBhZGRyZXNzKSk7XG4gICAgfSBcbiAgICByZXR1cm4gbmV3IENvbnRyYWN0KHRoaXMuYWJpLCBhZGRyZXNzKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBjcmVhdGUgbmV3IGNvbnRyYWN0IGluc3RhbmNlXG4gKlxuICogQG1ldGhvZCBDb250cmFjdFxuICogQHBhcmFtIHtBcnJheX0gYWJpXG4gKiBAcGFyYW0ge0FkZHJlc3N9IGNvbnRyYWN0IGFkZHJlc3NcbiAqL1xudmFyIENvbnRyYWN0ID0gZnVuY3Rpb24gKGFiaSwgYWRkcmVzcykge1xuICAgIHRoaXMuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgYWRkRnVuY3Rpb25zVG9Db250cmFjdCh0aGlzLCBhYmkpO1xuICAgIGFkZEV2ZW50c1RvQ29udHJhY3QodGhpcywgYWJpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udHJhY3Q7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIEBmaWxlIGRiLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIE1ldGhvZCA9IHJlcXVpcmUoJy4vbWV0aG9kJyk7XG5cbnZhciBwdXRTdHJpbmcgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAncHV0U3RyaW5nJyxcbiAgICBjYWxsOiAnZGJfcHV0U3RyaW5nJyxcbiAgICBwYXJhbXM6IDNcbn0pO1xuXG5cbnZhciBnZXRTdHJpbmcgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnZ2V0U3RyaW5nJyxcbiAgICBjYWxsOiAnZGJfZ2V0U3RyaW5nJyxcbiAgICBwYXJhbXM6IDJcbn0pO1xuXG52YXIgcHV0SGV4ID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ3B1dEhleCcsXG4gICAgY2FsbDogJ2RiX3B1dEhleCcsXG4gICAgcGFyYW1zOiAzXG59KTtcblxudmFyIGdldEhleCA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRIZXgnLFxuICAgIGNhbGw6ICdkYl9nZXRIZXgnLFxuICAgIHBhcmFtczogMlxufSk7XG5cbnZhciBtZXRob2RzID0gW1xuICAgIHB1dFN0cmluZywgZ2V0U3RyaW5nLCBwdXRIZXgsIGdldEhleFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbWV0aG9kczogbWV0aG9kc1xufTtcbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIFxuICogQGZpbGUgZXJyb3JzLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEludmFsaWROdW1iZXJPZlBhcmFtczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkIG51bWJlciBvZiBpbnB1dCBwYXJhbWV0ZXJzJyk7XG4gICAgfSxcbiAgICBJbnZhbGlkQ29ubmVjdGlvbjogZnVuY3Rpb24gKGhvc3Qpe1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdDT05ORUNUSU9OIEVSUk9SOiBDb3VsZG5cXCd0IGNvbm5lY3QgdG8gbm9kZSAnKyBob3N0ICsnLCBpcyBpdCBydW5uaW5nPycpO1xuICAgIH0sXG4gICAgSW52YWxpZFByb3ZpZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1Byb3ZpZG9yIG5vdCBzZXQgb3IgaW52YWxpZCcpO1xuICAgIH0sXG4gICAgSW52YWxpZFJlc3BvbnNlOiBmdW5jdGlvbiAocmVzdWx0KXtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAhIXJlc3VsdCAmJiAhIXJlc3VsdC5lcnJvciAmJiAhIXJlc3VsdC5lcnJvci5tZXNzYWdlID8gcmVzdWx0LmVycm9yLm1lc3NhZ2UgOiAnSW52YWxpZCBKU09OIFJQQyByZXNwb25zZSc7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxufTtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKipcbiAqIEBmaWxlIGV0aC5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBhdXRob3IgRmFiaWFuIFZvZ2Vsc3RlbGxlciA8ZmFiaWFuQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxuLyoqXG4gKiBXZWIzXG4gKlxuICogQG1vZHVsZSB3ZWIzXG4gKi9cblxuLyoqXG4gKiBFdGggbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuICpcbiAqIEFuIGV4YW1wbGUgbWV0aG9kIG9iamVjdCBjYW4gbG9vayBhcyBmb2xsb3dzOlxuICpcbiAqICAgICAge1xuICogICAgICBuYW1lOiAnZ2V0QmxvY2snLFxuICogICAgICBjYWxsOiBibG9ja0NhbGwsXG4gKiAgICAgIHBhcmFtczogMixcbiAqICAgICAgb3V0cHV0Rm9ybWF0dGVyOiBmb3JtYXR0ZXJzLm91dHB1dEJsb2NrRm9ybWF0dGVyLFxuICogICAgICBpbnB1dEZvcm1hdHRlcjogWyAvLyBjYW4gYmUgYSBmb3JtYXR0ZXIgZnVuY2l0b24gb3IgYW4gYXJyYXkgb2YgZnVuY3Rpb25zLiBXaGVyZSBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IHdpbGwgYmUgdXNlZCBmb3Igb25lIHBhcmFtZXRlclxuICogICAgICAgICAgIHV0aWxzLnRvSGV4LCAvLyBmb3JtYXRzIHBhcmFtdGVyIDFcbiAqICAgICAgICAgICBmdW5jdGlvbihwYXJhbSl7IHJldHVybiAhIXBhcmFtOyB9IC8vIGZvcm1hdHMgcGFyYW10ZXIgMlxuICogICAgICAgICBdXG4gKiAgICAgICB9LFxuICpcbiAqIEBjbGFzcyBbd2ViM10gZXRoXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGZvcm1hdHRlcnMgPSByZXF1aXJlKCcuL2Zvcm1hdHRlcnMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyk7XG52YXIgTWV0aG9kID0gcmVxdWlyZSgnLi9tZXRob2QnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxudmFyIGJsb2NrQ2FsbCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgcmV0dXJuICh1dGlscy5pc1N0cmluZyhhcmdzWzBdKSAmJiBhcmdzWzBdLmluZGV4T2YoJzB4JykgPT09IDApID8gXCJldGhfZ2V0QmxvY2tCeUhhc2hcIiA6IFwiZXRoX2dldEJsb2NrQnlOdW1iZXJcIjtcbn07XG5cbnZhciB0cmFuc2FjdGlvbkZyb21CbG9ja0NhbGwgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIHJldHVybiAodXRpbHMuaXNTdHJpbmcoYXJnc1swXSkgJiYgYXJnc1swXS5pbmRleE9mKCcweCcpID09PSAwKSA/ICdldGhfZ2V0VHJhbnNhY3Rpb25CeUJsb2NrSGFzaEFuZEluZGV4JyA6ICdldGhfZ2V0VHJhbnNhY3Rpb25CeUJsb2NrTnVtYmVyQW5kSW5kZXgnO1xufTtcblxudmFyIHVuY2xlQ2FsbCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgcmV0dXJuICh1dGlscy5pc1N0cmluZyhhcmdzWzBdKSAmJiBhcmdzWzBdLmluZGV4T2YoJzB4JykgPT09IDApID8gJ2V0aF9nZXRVbmNsZUJ5QmxvY2tIYXNoQW5kSW5kZXgnIDogJ2V0aF9nZXRVbmNsZUJ5QmxvY2tOdW1iZXJBbmRJbmRleCc7XG59O1xuXG52YXIgZ2V0QmxvY2tUcmFuc2FjdGlvbkNvdW50Q2FsbCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgcmV0dXJuICh1dGlscy5pc1N0cmluZyhhcmdzWzBdKSAmJiBhcmdzWzBdLmluZGV4T2YoJzB4JykgPT09IDApID8gJ2V0aF9nZXRCbG9ja1RyYW5zYWN0aW9uQ291bnRCeUhhc2gnIDogJ2V0aF9nZXRCbG9ja1RyYW5zYWN0aW9uQ291bnRCeU51bWJlcic7XG59O1xuXG52YXIgdW5jbGVDb3VudENhbGwgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIHJldHVybiAodXRpbHMuaXNTdHJpbmcoYXJnc1swXSkgJiYgYXJnc1swXS5pbmRleE9mKCcweCcpID09PSAwKSA/ICdldGhfZ2V0VW5jbGVDb3VudEJ5QmxvY2tIYXNoJyA6ICdldGhfZ2V0VW5jbGVDb3VudEJ5QmxvY2tOdW1iZXInO1xufTtcblxuLy8vIEByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgZGVzY3JpYmluZyB3ZWIzLmV0aCBhcGkgbWV0aG9kc1xuXG52YXIgZ2V0QmFsYW5jZSA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRCYWxhbmNlJyxcbiAgICBjYWxsOiAnZXRoX2dldEJhbGFuY2UnLFxuICAgIHBhcmFtczogMixcbiAgICBpbnB1dEZvcm1hdHRlcjogW3V0aWxzLnRvQWRkcmVzcywgZm9ybWF0dGVycy5pbnB1dERlZmF1bHRCbG9ja051bWJlckZvcm1hdHRlcl0sXG4gICAgb3V0cHV0Rm9ybWF0dGVyOiBmb3JtYXR0ZXJzLm91dHB1dEJpZ051bWJlckZvcm1hdHRlclxufSk7XG5cbnZhciBnZXRTdG9yYWdlQXQgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnZ2V0U3RvcmFnZUF0JyxcbiAgICBjYWxsOiAnZXRoX2dldFN0b3JhZ2VBdCcsXG4gICAgcGFyYW1zOiAzLFxuICAgIGlucHV0Rm9ybWF0dGVyOiBbbnVsbCwgdXRpbHMudG9IZXgsIGZvcm1hdHRlcnMuaW5wdXREZWZhdWx0QmxvY2tOdW1iZXJGb3JtYXR0ZXJdXG59KTtcblxudmFyIGdldENvZGUgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnZ2V0Q29kZScsXG4gICAgY2FsbDogJ2V0aF9nZXRDb2RlJyxcbiAgICBwYXJhbXM6IDIsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFt1dGlscy50b0FkZHJlc3MsIGZvcm1hdHRlcnMuaW5wdXREZWZhdWx0QmxvY2tOdW1iZXJGb3JtYXR0ZXJdXG59KTtcblxudmFyIGdldEJsb2NrID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2dldEJsb2NrJyxcbiAgICBjYWxsOiBibG9ja0NhbGwsXG4gICAgcGFyYW1zOiAyLFxuICAgIGlucHV0Rm9ybWF0dGVyOiBbZm9ybWF0dGVycy5pbnB1dEJsb2NrTnVtYmVyRm9ybWF0dGVyLCBmdW5jdGlvbiAodmFsKSB7IHJldHVybiAhIXZhbDsgfV0sXG4gICAgb3V0cHV0Rm9ybWF0dGVyOiBmb3JtYXR0ZXJzLm91dHB1dEJsb2NrRm9ybWF0dGVyXG59KTtcblxudmFyIGdldFVuY2xlID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2dldFVuY2xlJyxcbiAgICBjYWxsOiB1bmNsZUNhbGwsXG4gICAgcGFyYW1zOiAyLFxuICAgIGlucHV0Rm9ybWF0dGVyOiBbZm9ybWF0dGVycy5pbnB1dEJsb2NrTnVtYmVyRm9ybWF0dGVyLCB1dGlscy50b0hleF0sXG4gICAgb3V0cHV0Rm9ybWF0dGVyOiBmb3JtYXR0ZXJzLm91dHB1dEJsb2NrRm9ybWF0dGVyLFxuXG59KTtcblxudmFyIGdldENvbXBpbGVycyA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRDb21waWxlcnMnLFxuICAgIGNhbGw6ICdldGhfZ2V0Q29tcGlsZXJzJyxcbiAgICBwYXJhbXM6IDBcbn0pO1xuXG52YXIgZ2V0QmxvY2tUcmFuc2FjdGlvbkNvdW50ID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2dldEJsb2NrVHJhbnNhY3Rpb25Db3VudCcsXG4gICAgY2FsbDogZ2V0QmxvY2tUcmFuc2FjdGlvbkNvdW50Q2FsbCxcbiAgICBwYXJhbXM6IDEsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFtmb3JtYXR0ZXJzLmlucHV0QmxvY2tOdW1iZXJGb3JtYXR0ZXJdLFxuICAgIG91dHB1dEZvcm1hdHRlcjogdXRpbHMudG9EZWNpbWFsXG59KTtcblxudmFyIGdldEJsb2NrVW5jbGVDb3VudCA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRCbG9ja1VuY2xlQ291bnQnLFxuICAgIGNhbGw6IHVuY2xlQ291bnRDYWxsLFxuICAgIHBhcmFtczogMSxcbiAgICBpbnB1dEZvcm1hdHRlcjogW2Zvcm1hdHRlcnMuaW5wdXRCbG9ja051bWJlckZvcm1hdHRlcl0sXG4gICAgb3V0cHV0Rm9ybWF0dGVyOiB1dGlscy50b0RlY2ltYWxcbn0pO1xuXG52YXIgZ2V0VHJhbnNhY3Rpb24gPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnZ2V0VHJhbnNhY3Rpb24nLFxuICAgIGNhbGw6ICdldGhfZ2V0VHJhbnNhY3Rpb25CeUhhc2gnLFxuICAgIHBhcmFtczogMSxcbiAgICBvdXRwdXRGb3JtYXR0ZXI6IGZvcm1hdHRlcnMub3V0cHV0VHJhbnNhY3Rpb25Gb3JtYXR0ZXJcbn0pO1xuXG52YXIgZ2V0VHJhbnNhY3Rpb25Gcm9tQmxvY2sgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnZ2V0VHJhbnNhY3Rpb25Gcm9tQmxvY2snLFxuICAgIGNhbGw6IHRyYW5zYWN0aW9uRnJvbUJsb2NrQ2FsbCxcbiAgICBwYXJhbXM6IDIsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFtmb3JtYXR0ZXJzLmlucHV0QmxvY2tOdW1iZXJGb3JtYXR0ZXIsIHV0aWxzLnRvSGV4XSxcbiAgICBvdXRwdXRGb3JtYXR0ZXI6IGZvcm1hdHRlcnMub3V0cHV0VHJhbnNhY3Rpb25Gb3JtYXR0ZXJcbn0pO1xuXG52YXIgZ2V0VHJhbnNhY3Rpb25Db3VudCA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRUcmFuc2FjdGlvbkNvdW50JyxcbiAgICBjYWxsOiAnZXRoX2dldFRyYW5zYWN0aW9uQ291bnQnLFxuICAgIHBhcmFtczogMixcbiAgICBpbnB1dEZvcm1hdHRlcjogW251bGwsIGZvcm1hdHRlcnMuaW5wdXREZWZhdWx0QmxvY2tOdW1iZXJGb3JtYXR0ZXJdLFxuICAgIG91dHB1dEZvcm1hdHRlcjogdXRpbHMudG9EZWNpbWFsXG59KTtcblxudmFyIHNlbmRUcmFuc2FjdGlvbiA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdzZW5kVHJhbnNhY3Rpb24nLFxuICAgIGNhbGw6ICdldGhfc2VuZFRyYW5zYWN0aW9uJyxcbiAgICBwYXJhbXM6IDEsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFtmb3JtYXR0ZXJzLmlucHV0VHJhbnNhY3Rpb25Gb3JtYXR0ZXJdXG59KTtcblxudmFyIGNhbGwgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnY2FsbCcsXG4gICAgY2FsbDogJ2V0aF9jYWxsJyxcbiAgICBwYXJhbXM6IDIsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFtmb3JtYXR0ZXJzLmlucHV0VHJhbnNhY3Rpb25Gb3JtYXR0ZXIsIGZvcm1hdHRlcnMuaW5wdXREZWZhdWx0QmxvY2tOdW1iZXJGb3JtYXR0ZXJdXG59KTtcblxudmFyIGVzdGltYXRlR2FzID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2VzdGltYXRlR2FzJyxcbiAgICBjYWxsOiAnZXRoX2VzdGltYXRlR2FzJyxcbiAgICBwYXJhbXM6IDEsXG4gICAgaW5wdXRGb3JtYXR0ZXI6IFtmb3JtYXR0ZXJzLmlucHV0VHJhbnNhY3Rpb25Gb3JtYXR0ZXJdLFxuICAgIG91dHB1dEZvcm1hdHRlcjogdXRpbHMudG9EZWNpbWFsXG59KTtcblxudmFyIGNvbXBpbGVTb2xpZGl0eSA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdjb21waWxlLnNvbGlkaXR5JyxcbiAgICBjYWxsOiAnZXRoX2NvbXBpbGVTb2xpZGl0eScsXG4gICAgcGFyYW1zOiAxXG59KTtcblxudmFyIGNvbXBpbGVMTEwgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnY29tcGlsZS5sbGwnLFxuICAgIGNhbGw6ICdldGhfY29tcGlsZUxMTCcsXG4gICAgcGFyYW1zOiAxXG59KTtcblxudmFyIGNvbXBpbGVTZXJwZW50ID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2NvbXBpbGUuc2VycGVudCcsXG4gICAgY2FsbDogJ2V0aF9jb21waWxlU2VycGVudCcsXG4gICAgcGFyYW1zOiAxXG59KTtcblxudmFyIHN1Ym1pdFdvcmsgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnc3VibWl0V29yaycsXG4gICAgY2FsbDogJ2V0aF9zdWJtaXRXb3JrJyxcbiAgICBwYXJhbXM6IDNcbn0pO1xuXG52YXIgZ2V0V29yayA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICdnZXRXb3JrJyxcbiAgICBjYWxsOiAnZXRoX2dldFdvcmsnLFxuICAgIHBhcmFtczogMFxufSk7XG5cbnZhciBtZXRob2RzID0gW1xuICAgIGdldEJhbGFuY2UsXG4gICAgZ2V0U3RvcmFnZUF0LFxuICAgIGdldENvZGUsXG4gICAgZ2V0QmxvY2ssXG4gICAgZ2V0VW5jbGUsXG4gICAgZ2V0Q29tcGlsZXJzLFxuICAgIGdldEJsb2NrVHJhbnNhY3Rpb25Db3VudCxcbiAgICBnZXRCbG9ja1VuY2xlQ291bnQsXG4gICAgZ2V0VHJhbnNhY3Rpb24sXG4gICAgZ2V0VHJhbnNhY3Rpb25Gcm9tQmxvY2ssXG4gICAgZ2V0VHJhbnNhY3Rpb25Db3VudCxcbiAgICBjYWxsLFxuICAgIGVzdGltYXRlR2FzLFxuICAgIHNlbmRUcmFuc2FjdGlvbixcbiAgICBjb21waWxlU29saWRpdHksXG4gICAgY29tcGlsZUxMTCxcbiAgICBjb21waWxlU2VycGVudCxcbiAgICBzdWJtaXRXb3JrLFxuICAgIGdldFdvcmtcbl07XG5cbi8vLyBAcmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIGRlc2NyaWJpbmcgd2ViMy5ldGggYXBpIHByb3BlcnRpZXNcblxuXG5cbnZhciBwcm9wZXJ0aWVzID0gW1xuICAgIG5ldyBQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6ICdjb2luYmFzZScsXG4gICAgICAgIGdldHRlcjogJ2V0aF9jb2luYmFzZSdcbiAgICB9KSxcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAnbWluaW5nJyxcbiAgICAgICAgZ2V0dGVyOiAnZXRoX21pbmluZydcbiAgICB9KSxcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAnaGFzaHJhdGUnLFxuICAgICAgICBnZXR0ZXI6ICdldGhfaGFzaHJhdGUnLFxuICAgICAgICBvdXRwdXRGb3JtYXR0ZXI6IHV0aWxzLnRvRGVjaW1hbFxuICAgIH0pLFxuICAgIG5ldyBQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6ICdnYXNQcmljZScsXG4gICAgICAgIGdldHRlcjogJ2V0aF9nYXNQcmljZScsXG4gICAgICAgIG91dHB1dEZvcm1hdHRlcjogZm9ybWF0dGVycy5vdXRwdXRCaWdOdW1iZXJGb3JtYXR0ZXJcbiAgICB9KSxcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAnYWNjb3VudHMnLFxuICAgICAgICBnZXR0ZXI6ICdldGhfYWNjb3VudHMnXG4gICAgfSksXG4gICAgbmV3IFByb3BlcnR5KHtcbiAgICAgICAgbmFtZTogJ2Jsb2NrTnVtYmVyJyxcbiAgICAgICAgZ2V0dGVyOiAnZXRoX2Jsb2NrTnVtYmVyJyxcbiAgICAgICAgb3V0cHV0Rm9ybWF0dGVyOiB1dGlscy50b0RlY2ltYWxcbiAgICB9KVxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbWV0aG9kczogbWV0aG9kcyxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG59O1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBcbiAqIEBmaWxlIGV2ZW50LmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNFxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyk7XG52YXIgY29kZXIgPSByZXF1aXJlKCcuLi9zb2xpZGl0eS9jb2RlcicpO1xudmFyIHdlYjMgPSByZXF1aXJlKCcuLi93ZWIzJyk7XG52YXIgZm9ybWF0dGVycyA9IHJlcXVpcmUoJy4vZm9ybWF0dGVycycpO1xudmFyIHNoYTMgPSByZXF1aXJlKCcuLi91dGlscy9zaGEzJyk7XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgc2hvdWxkIGJlIHVzZWQgdG8gY3JlYXRlIGV2ZW50IGZpbHRlcnNcbiAqL1xudmFyIFNvbGlkaXR5RXZlbnQgPSBmdW5jdGlvbiAoanNvbiwgYWRkcmVzcykge1xuICAgIHRoaXMuX3BhcmFtcyA9IGpzb24uaW5wdXRzO1xuICAgIHRoaXMuX25hbWUgPSB1dGlscy50cmFuc2Zvcm1Ub0Z1bGxOYW1lKGpzb24pO1xuICAgIHRoaXMuX2FkZHJlc3MgPSBhZGRyZXNzO1xuICAgIHRoaXMuX2Fub255bW91cyA9IGpzb24uYW5vbnltb3VzO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBnZXQgZmlsdGVyZWQgcGFyYW0gdHlwZXNcbiAqXG4gKiBAbWV0aG9kIHR5cGVzXG4gKiBAcGFyYW0ge0Jvb2x9IGRlY2lkZSBpZiByZXR1cm5lZCB0eXBlZCBzaG91bGQgYmUgaW5kZXhlZFxuICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIHR5cGVzXG4gKi9cblNvbGlkaXR5RXZlbnQucHJvdG90eXBlLnR5cGVzID0gZnVuY3Rpb24gKGluZGV4ZWQpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyYW1zLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gaS5pbmRleGVkID09PSBpbmRleGVkO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gaS50eXBlO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBnZXQgZXZlbnQgZGlzcGxheSBuYW1lXG4gKlxuICogQG1ldGhvZCBkaXNwbGF5TmFtZVxuICogQHJldHVybiB7U3RyaW5nfSBldmVudCBkaXNwbGF5IG5hbWVcbiAqL1xuU29saWRpdHlFdmVudC5wcm90b3R5cGUuZGlzcGxheU5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHV0aWxzLmV4dHJhY3REaXNwbGF5TmFtZSh0aGlzLl9uYW1lKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZ2V0IGV2ZW50IHR5cGUgbmFtZVxuICpcbiAqIEBtZXRob2QgdHlwZU5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ30gZXZlbnQgdHlwZSBuYW1lXG4gKi9cblNvbGlkaXR5RXZlbnQucHJvdG90eXBlLnR5cGVOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1dGlscy5leHRyYWN0VHlwZU5hbWUodGhpcy5fbmFtZSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGdldCBldmVudCBzaWduYXR1cmVcbiAqXG4gKiBAbWV0aG9kIHNpZ25hdHVyZVxuICogQHJldHVybiB7U3RyaW5nfSBldmVudCBzaWduYXR1cmVcbiAqL1xuU29saWRpdHlFdmVudC5wcm90b3R5cGUuc2lnbmF0dXJlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzaGEzKHRoaXMuX25hbWUpO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBlbmNvZGUgaW5kZXhlZCBwYXJhbXMgYW5kIG9wdGlvbnMgdG8gb25lIGZpbmFsIG9iamVjdFxuICogXG4gKiBAbWV0aG9kIGVuY29kZVxuICogQHBhcmFtIHtPYmplY3R9IGluZGV4ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9IGV2ZXJ5dGhpbmcgY29tYmluZWQgdG9nZXRoZXIgYW5kIGVuY29kZWRcbiAqL1xuU29saWRpdHlFdmVudC5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gKGluZGV4ZWQsIG9wdGlvbnMpIHtcbiAgICBpbmRleGVkID0gaW5kZXhlZCB8fCB7fTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICBbJ2Zyb21CbG9jaycsICd0b0Jsb2NrJ10uZmlsdGVyKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zW2ZdICE9PSB1bmRlZmluZWQ7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgICAgICByZXN1bHRbZl0gPSBmb3JtYXR0ZXJzLmlucHV0QmxvY2tOdW1iZXJGb3JtYXR0ZXIob3B0aW9uc1tmXSk7XG4gICAgfSk7XG5cbiAgICByZXN1bHQudG9waWNzID0gW107XG5cbiAgICBpZiAoIXRoaXMuX2Fub255bW91cykge1xuICAgICAgICByZXN1bHQuYWRkcmVzcyA9IHRoaXMuX2FkZHJlc3M7XG4gICAgICAgIHJlc3VsdC50b3BpY3MucHVzaCgnMHgnICsgdGhpcy5zaWduYXR1cmUoKSk7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ZWRUb3BpY3MgPSB0aGlzLl9wYXJhbXMuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBpLmluZGV4ZWQgPT09IHRydWU7XG4gICAgfSkubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGluZGV4ZWRbaS5uYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJzB4JyArIGNvZGVyLmVuY29kZVBhcmFtKGkudHlwZSwgdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJzB4JyArIGNvZGVyLmVuY29kZVBhcmFtKGkudHlwZSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmVzdWx0LnRvcGljcyA9IHJlc3VsdC50b3BpY3MuY29uY2F0KGluZGV4ZWRUb3BpY3MpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZGVjb2RlIGluZGV4ZWQgcGFyYW1zIGFuZCBvcHRpb25zXG4gKlxuICogQG1ldGhvZCBkZWNvZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtPYmplY3R9IHJlc3VsdCBvYmplY3Qgd2l0aCBkZWNvZGVkIGluZGV4ZWQgJiYgbm90IGluZGV4ZWQgcGFyYW1zXG4gKi9cblNvbGlkaXR5RXZlbnQucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gXG4gICAgZGF0YS5kYXRhID0gZGF0YS5kYXRhIHx8ICcnO1xuICAgIGRhdGEudG9waWNzID0gZGF0YS50b3BpY3MgfHwgW107XG5cbiAgICB2YXIgYXJnVG9waWNzID0gdGhpcy5fYW5vbnltb3VzID8gZGF0YS50b3BpY3MgOiBkYXRhLnRvcGljcy5zbGljZSgxKTtcbiAgICB2YXIgaW5kZXhlZERhdGEgPSBhcmdUb3BpY3MubWFwKGZ1bmN0aW9uICh0b3BpY3MpIHsgcmV0dXJuIHRvcGljcy5zbGljZSgyKTsgfSkuam9pbihcIlwiKTtcbiAgICB2YXIgaW5kZXhlZFBhcmFtcyA9IGNvZGVyLmRlY29kZVBhcmFtcyh0aGlzLnR5cGVzKHRydWUpLCBpbmRleGVkRGF0YSk7IFxuXG4gICAgdmFyIG5vdEluZGV4ZWREYXRhID0gZGF0YS5kYXRhLnNsaWNlKDIpO1xuICAgIHZhciBub3RJbmRleGVkUGFyYW1zID0gY29kZXIuZGVjb2RlUGFyYW1zKHRoaXMudHlwZXMoZmFsc2UpLCBub3RJbmRleGVkRGF0YSk7XG4gICAgXG4gICAgdmFyIHJlc3VsdCA9IGZvcm1hdHRlcnMub3V0cHV0TG9nRm9ybWF0dGVyKGRhdGEpO1xuICAgIHJlc3VsdC5ldmVudCA9IHRoaXMuZGlzcGxheU5hbWUoKTtcbiAgICByZXN1bHQuYWRkcmVzcyA9IGRhdGEuYWRkcmVzcztcblxuICAgIHJlc3VsdC5hcmdzID0gdGhpcy5fcGFyYW1zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXJyZW50KSB7XG4gICAgICAgIGFjY1tjdXJyZW50Lm5hbWVdID0gY3VycmVudC5pbmRleGVkID8gaW5kZXhlZFBhcmFtcy5zaGlmdCgpIDogbm90SW5kZXhlZFBhcmFtcy5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICAgIGRlbGV0ZSByZXN1bHQuZGF0YTtcbiAgICBkZWxldGUgcmVzdWx0LnRvcGljcztcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGNyZWF0ZSBuZXcgZmlsdGVyIG9iamVjdCBmcm9tIGV2ZW50XG4gKlxuICogQG1ldGhvZCBleGVjdXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaW5kZXhlZFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH0gZmlsdGVyIG9iamVjdFxuICovXG5Tb2xpZGl0eUV2ZW50LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKGluZGV4ZWQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbyA9IHRoaXMuZW5jb2RlKGluZGV4ZWQsIG9wdGlvbnMpO1xuICAgIHZhciBmb3JtYXR0ZXIgPSB0aGlzLmRlY29kZS5iaW5kKHRoaXMpO1xuICAgIHJldHVybiB3ZWIzLmV0aC5maWx0ZXIobywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZvcm1hdHRlcik7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGF0dGFjaCBldmVudCB0byBjb250cmFjdCBvYmplY3RcbiAqXG4gKiBAbWV0aG9kIGF0dGFjaFRvQ29udHJhY3RcbiAqIEBwYXJhbSB7Q29udHJhY3R9XG4gKi9cblNvbGlkaXR5RXZlbnQucHJvdG90eXBlLmF0dGFjaFRvQ29udHJhY3QgPSBmdW5jdGlvbiAoY29udHJhY3QpIHtcbiAgICB2YXIgZXhlY3V0ZSA9IHRoaXMuZXhlY3V0ZS5iaW5kKHRoaXMpO1xuICAgIHZhciBkaXNwbGF5TmFtZSA9IHRoaXMuZGlzcGxheU5hbWUoKTtcbiAgICBpZiAoIWNvbnRyYWN0W2Rpc3BsYXlOYW1lXSkge1xuICAgICAgICBjb250cmFjdFtkaXNwbGF5TmFtZV0gPSBleGVjdXRlO1xuICAgIH1cbiAgICBjb250cmFjdFtkaXNwbGF5TmFtZV1bdGhpcy50eXBlTmFtZSgpXSA9IHRoaXMuZXhlY3V0ZS5iaW5kKHRoaXMsIGNvbnRyYWN0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29saWRpdHlFdmVudDtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogQGZpbGUgZmlsdGVyLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgSmVmZnJleSBXaWxja2UgPGplZmZAZXRoZGV2LmNvbT5cbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiAgIE1hcmlhbiBPYW5jZWEgPG1hcmlhbkBldGhkZXYuY29tPlxuICogICBGYWJpYW4gVm9nZWxzdGVsbGVyIDxmYWJpYW5AZXRoZGV2LmNvbT5cbiAqICAgR2F2IFdvb2QgPGdAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTRcbiAqL1xuXG52YXIgUmVxdWVzdE1hbmFnZXIgPSByZXF1aXJlKCcuL3JlcXVlc3RtYW5hZ2VyJyk7XG52YXIgZm9ybWF0dGVycyA9IHJlcXVpcmUoJy4vZm9ybWF0dGVycycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbHMnKTtcblxuLyoqXG4qIENvbnZlcnRzIGEgZ2l2ZW4gdG9waWMgdG8gYSBoZXggc3RyaW5nLCBidXQgYWxzbyBhbGxvd3MgbnVsbCB2YWx1ZXMuXG4qXG4qIEBwYXJhbSB7TWl4ZWR9IHZhbHVlXG4qIEByZXR1cm4ge1N0cmluZ31cbiovXG52YXIgdG9Ub3BpYyA9IGZ1bmN0aW9uKHZhbHVlKXtcblxuICAgIGlmKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXG4gICAgaWYodmFsdWUuaW5kZXhPZignMHgnKSA9PT0gMClcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHV0aWxzLmZyb21Bc2NpaSh2YWx1ZSk7XG59O1xuXG4vLy8gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCBvbiBvcHRpb25zIG9iamVjdCwgdG8gdmVyaWZ5IGRlcHJlY2F0ZWQgcHJvcGVydGllcyAmJiBsYXp5IGxvYWQgZHluYW1pYyBvbmVzXG4vLy8gQHBhcmFtIHNob3VsZCBiZSBzdHJpbmcgb3Igb2JqZWN0XG4vLy8gQHJldHVybnMgb3B0aW9ucyBzdHJpbmcgb3Igb2JqZWN0XG52YXIgZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICBpZiAodXRpbHMuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSBcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gbWFrZSBzdXJlIHRvcGljcywgZ2V0IGNvbnZlcnRlZCB0byBoZXhcbiAgICBvcHRpb25zLnRvcGljcyA9IG9wdGlvbnMudG9waWNzIHx8IFtdO1xuICAgIG9wdGlvbnMudG9waWNzID0gb3B0aW9ucy50b3BpY3MubWFwKGZ1bmN0aW9uKHRvcGljKXtcbiAgICAgICAgcmV0dXJuICh1dGlscy5pc0FycmF5KHRvcGljKSkgPyB0b3BpYy5tYXAodG9Ub3BpYykgOiB0b1RvcGljKHRvcGljKTtcbiAgICB9KTtcblxuICAgIC8vIGxhenkgbG9hZFxuICAgIHJldHVybiB7XG4gICAgICAgIHRvcGljczogb3B0aW9ucy50b3BpY3MsXG4gICAgICAgIHRvOiBvcHRpb25zLnRvLFxuICAgICAgICBhZGRyZXNzOiBvcHRpb25zLmFkZHJlc3MsXG4gICAgICAgIGZyb21CbG9jazogZm9ybWF0dGVycy5pbnB1dEJsb2NrTnVtYmVyRm9ybWF0dGVyKG9wdGlvbnMuZnJvbUJsb2NrKSxcbiAgICAgICAgdG9CbG9jazogZm9ybWF0dGVycy5pbnB1dEJsb2NrTnVtYmVyRm9ybWF0dGVyKG9wdGlvbnMudG9CbG9jaykgXG4gICAgfTsgXG59O1xuXG4vKipcbkFkZHMgdGhlIGNhbGxiYWNrIGFuZCBzZXRzIHVwIHRoZSBtZXRob2RzLCB0byBpdGVyYXRlIG92ZXIgdGhlIHJlc3VsdHMuXG5cbkBtZXRob2QgZ2V0TG9nc0F0U3RhcnRcbkBwYXJhbSB7T2JqZWN0fSBzZWxmXG5AcGFyYW0ge2Z1bmNpdG9ufSBcbiovXG52YXIgZ2V0TG9nc0F0U3RhcnQgPSBmdW5jdGlvbihzZWxmLCBjYWxsYmFjayl7XG4gICAgLy8gY2FsbCBnZXRGaWx0ZXJMb2dzIGZvciB0aGUgZmlyc3Qgd2F0Y2ggY2FsbGJhY2sgc3RhcnRcbiAgICBpZiAoIXV0aWxzLmlzU3RyaW5nKHNlbGYub3B0aW9ucykpIHtcbiAgICAgICAgc2VsZi5nZXQoZnVuY3Rpb24gKGVyciwgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIC8vIGRvbid0IHNlbmQgYWxsIHRoZSByZXNwb25zZXMgdG8gYWxsIHRoZSB3YXRjaGVzIGFnYWluLi4uIGp1c3QgdG8gc2VsZiBvbmVcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG5BZGRzIHRoZSBjYWxsYmFjayBhbmQgc2V0cyB1cCB0aGUgbWV0aG9kcywgdG8gaXRlcmF0ZSBvdmVyIHRoZSByZXN1bHRzLlxuXG5AbWV0aG9kIHBvbGxGaWx0ZXJcbkBwYXJhbSB7T2JqZWN0fSBzZWxmXG4qL1xudmFyIHBvbGxGaWx0ZXIgPSBmdW5jdGlvbihzZWxmKSB7XG5cbiAgICB2YXIgb25NZXNzYWdlID0gZnVuY3Rpb24gKGVycm9yLCBtZXNzYWdlcykge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IHNlbGYuZm9ybWF0dGVyID8gc2VsZi5mb3JtYXR0ZXIobWVzc2FnZSkgOiBtZXNzYWdlO1xuICAgICAgICAgICAgc2VsZi5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUmVxdWVzdE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zdGFydFBvbGxpbmcoe1xuICAgICAgICBtZXRob2Q6IHNlbGYuaW1wbGVtZW50YXRpb24ucG9sbC5jYWxsLFxuICAgICAgICBwYXJhbXM6IFtzZWxmLmZpbHRlcklkXSxcbiAgICB9LCBzZWxmLmZpbHRlcklkLCBvbk1lc3NhZ2UsIHNlbGYuc3RvcFdhdGNoaW5nLmJpbmQoc2VsZikpO1xuXG59O1xuXG52YXIgRmlsdGVyID0gZnVuY3Rpb24gKG9wdGlvbnMsIG1ldGhvZHMsIGZvcm1hdHRlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgaW1wbGVtZW50YXRpb24gPSB7fTtcbiAgICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICBtZXRob2QuYXR0YWNoVG9PYmplY3QoaW1wbGVtZW50YXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMub3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5pbXBsZW1lbnRhdGlvbiA9IGltcGxlbWVudGF0aW9uO1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5wb2xsRmlsdGVycyA9IFtdO1xuICAgIHRoaXMuZm9ybWF0dGVyID0gZm9ybWF0dGVyO1xuICAgIHRoaXMuaW1wbGVtZW50YXRpb24ubmV3RmlsdGVyKHRoaXMub3B0aW9ucywgZnVuY3Rpb24oZXJyb3IsIGlkKXtcbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5maWx0ZXJJZCA9IGlkO1xuICAgICAgICAgICAgLy8gZ2V0IGZpbHRlciBsb2dzIGF0IHN0YXJ0XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgICAgICAgICBnZXRMb2dzQXRTdGFydChzZWxmLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBvbGxGaWx0ZXIoc2VsZik7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbkZpbHRlci5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblxuICAgIGlmKHRoaXMuZmlsdGVySWQpIHtcbiAgICAgICAgZ2V0TG9nc0F0U3RhcnQodGhpcywgY2FsbGJhY2spO1xuICAgICAgICBwb2xsRmlsdGVyKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRmlsdGVyLnByb3RvdHlwZS5zdG9wV2F0Y2hpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgUmVxdWVzdE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zdG9wUG9sbGluZyh0aGlzLmZpbHRlcklkKTtcbiAgICAvLyByZW1vdmUgZmlsdGVyIGFzeW5jXG4gICAgdGhpcy5pbXBsZW1lbnRhdGlvbi51bmluc3RhbGxGaWx0ZXIodGhpcy5maWx0ZXJJZCwgZnVuY3Rpb24oKXt9KTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xufTtcblxuRmlsdGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIHRoaXMuaW1wbGVtZW50YXRpb24uZ2V0TG9ncyh0aGlzLmZpbHRlcklkLCBmdW5jdGlvbihlcnIsIHJlcyl7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzLm1hcChmdW5jdGlvbiAobG9nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZvcm1hdHRlciA/IHNlbGYuZm9ybWF0dGVyKGxvZykgOiBsb2c7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbG9ncyA9IHRoaXMuaW1wbGVtZW50YXRpb24uZ2V0TG9ncyh0aGlzLmZpbHRlcklkKTtcbiAgICAgICAgcmV0dXJuIGxvZ3MubWFwKGZ1bmN0aW9uIChsb2cpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmZvcm1hdHRlciA/IHNlbGYuZm9ybWF0dGVyKGxvZykgOiBsb2c7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXI7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIFxuICogQGZpbGUgZm9ybWF0dGVycy5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBhdXRob3IgRmFiaWFuIFZvZ2Vsc3RlbGxlciA8ZmFiaWFuQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbHMnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi91dGlscy9jb25maWcnKTtcblxuLyoqXG4gKiBTaG91bGQgdGhlIGZvcm1hdCBvdXRwdXQgdG8gYSBiaWcgbnVtYmVyXG4gKlxuICogQG1ldGhvZCBvdXRwdXRCaWdOdW1iZXJGb3JtYXR0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcnxCaWdOdW1iZXJ9XG4gKiBAcmV0dXJucyB7QmlnTnVtYmVyfSBvYmplY3RcbiAqL1xudmFyIG91dHB1dEJpZ051bWJlckZvcm1hdHRlciA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICByZXR1cm4gdXRpbHMudG9CaWdOdW1iZXIobnVtYmVyKTtcbn07XG5cbnZhciBpc1ByZWRlZmluZWRCbG9ja051bWJlciA9IGZ1bmN0aW9uIChibG9ja051bWJlcikge1xuICAgIHJldHVybiBibG9ja051bWJlciA9PT0gJ2xhdGVzdCcgfHwgYmxvY2tOdW1iZXIgPT09ICdwZW5kaW5nJyB8fCBibG9ja051bWJlciA9PT0gJ2VhcmxpZXN0Jztcbn07XG5cbnZhciBpbnB1dERlZmF1bHRCbG9ja051bWJlckZvcm1hdHRlciA9IGZ1bmN0aW9uIChibG9ja051bWJlcikge1xuICAgIGlmIChibG9ja051bWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBjb25maWcuZGVmYXVsdEJsb2NrO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXRCbG9ja051bWJlckZvcm1hdHRlcihibG9ja051bWJlcik7XG59O1xuXG52YXIgaW5wdXRCbG9ja051bWJlckZvcm1hdHRlciA9IGZ1bmN0aW9uIChibG9ja051bWJlcikge1xuICAgIGlmIChibG9ja051bWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChpc1ByZWRlZmluZWRCbG9ja051bWJlcihibG9ja051bWJlcikpIHtcbiAgICAgICAgcmV0dXJuIGJsb2NrTnVtYmVyO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbHMudG9IZXgoYmxvY2tOdW1iZXIpO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIHRoZSBpbnB1dCBvZiBhIHRyYW5zYWN0aW9uIGFuZCBjb252ZXJ0cyBhbGwgdmFsdWVzIHRvIEhFWFxuICpcbiAqIEBtZXRob2QgaW5wdXRUcmFuc2FjdGlvbkZvcm1hdHRlclxuICogQHBhcmFtIHtPYmplY3R9IHRyYW5zYWN0aW9uIG9wdGlvbnNcbiAqIEByZXR1cm5zIG9iamVjdFxuKi9cbnZhciBpbnB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpe1xuXG4gICAgb3B0aW9ucy5mcm9tID0gb3B0aW9ucy5mcm9tIHx8IGNvbmZpZy5kZWZhdWx0QWNjb3VudDtcblxuICAgIC8vIG1ha2UgY29kZSAtPiBkYXRhXG4gICAgaWYgKG9wdGlvbnMuY29kZSkge1xuICAgICAgICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmNvZGU7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmNvZGU7XG4gICAgfVxuXG4gICAgWydnYXNQcmljZScsICdnYXMnLCAndmFsdWUnLCAnbm9uY2UnXS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uc1trZXldICE9PSB1bmRlZmluZWQ7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICBvcHRpb25zW2tleV0gPSB1dGlscy5mcm9tRGVjaW1hbChvcHRpb25zW2tleV0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9wdGlvbnM7IFxufTtcblxuLyoqXG4gKiBGb3JtYXRzIHRoZSBvdXRwdXQgb2YgYSB0cmFuc2FjdGlvbiB0byBpdHMgcHJvcGVyIHZhbHVlc1xuICogXG4gKiBAbWV0aG9kIG91dHB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNhY3Rpb25cbiAqIEByZXR1cm5zIHtPYmplY3R9IHRyYW5zYWN0aW9uXG4qL1xudmFyIG91dHB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyID0gZnVuY3Rpb24gKHR4KXtcbiAgICBpZih0eC5ibG9ja051bWJlciAhPT0gbnVsbClcbiAgICAgICAgdHguYmxvY2tOdW1iZXIgPSB1dGlscy50b0RlY2ltYWwodHguYmxvY2tOdW1iZXIpO1xuICAgIGlmKHR4LnRyYW5zYWN0aW9uSW5kZXggIT09IG51bGwpXG4gICAgICAgIHR4LnRyYW5zYWN0aW9uSW5kZXggPSB1dGlscy50b0RlY2ltYWwodHgudHJhbnNhY3Rpb25JbmRleCk7XG4gICAgdHgubm9uY2UgPSB1dGlscy50b0RlY2ltYWwodHgubm9uY2UpO1xuICAgIHR4LmdhcyA9IHV0aWxzLnRvRGVjaW1hbCh0eC5nYXMpO1xuICAgIHR4Lmdhc1ByaWNlID0gdXRpbHMudG9CaWdOdW1iZXIodHguZ2FzUHJpY2UpO1xuICAgIHR4LnZhbHVlID0gdXRpbHMudG9CaWdOdW1iZXIodHgudmFsdWUpO1xuICAgIHJldHVybiB0eDtcbn07XG5cbi8qKlxuICogRm9ybWF0cyB0aGUgb3V0cHV0IG9mIGEgYmxvY2sgdG8gaXRzIHByb3BlciB2YWx1ZXNcbiAqXG4gKiBAbWV0aG9kIG91dHB1dEJsb2NrRm9ybWF0dGVyXG4gKiBAcGFyYW0ge09iamVjdH0gYmxvY2sgb2JqZWN0IFxuICogQHJldHVybnMge09iamVjdH0gYmxvY2sgb2JqZWN0XG4qL1xudmFyIG91dHB1dEJsb2NrRm9ybWF0dGVyID0gZnVuY3Rpb24oYmxvY2spIHtcblxuICAgIC8vIHRyYW5zZm9ybSB0byBudW1iZXJcbiAgICBibG9jay5nYXNMaW1pdCA9IHV0aWxzLnRvRGVjaW1hbChibG9jay5nYXNMaW1pdCk7XG4gICAgYmxvY2suZ2FzVXNlZCA9IHV0aWxzLnRvRGVjaW1hbChibG9jay5nYXNVc2VkKTtcbiAgICBibG9jay5zaXplID0gdXRpbHMudG9EZWNpbWFsKGJsb2NrLnNpemUpO1xuICAgIGJsb2NrLnRpbWVzdGFtcCA9IHV0aWxzLnRvRGVjaW1hbChibG9jay50aW1lc3RhbXApO1xuICAgIGlmKGJsb2NrLm51bWJlciAhPT0gbnVsbClcbiAgICAgICAgYmxvY2subnVtYmVyID0gdXRpbHMudG9EZWNpbWFsKGJsb2NrLm51bWJlcik7XG5cbiAgICBibG9jay5kaWZmaWN1bHR5ID0gdXRpbHMudG9CaWdOdW1iZXIoYmxvY2suZGlmZmljdWx0eSk7XG4gICAgYmxvY2sudG90YWxEaWZmaWN1bHR5ID0gdXRpbHMudG9CaWdOdW1iZXIoYmxvY2sudG90YWxEaWZmaWN1bHR5KTtcblxuICAgIGlmICh1dGlscy5pc0FycmF5KGJsb2NrLnRyYW5zYWN0aW9ucykpIHtcbiAgICAgICAgYmxvY2sudHJhbnNhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBpZighdXRpbHMuaXNTdHJpbmcoaXRlbSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyKGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2s7XG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIG91dHB1dCBvZiBhIGxvZ1xuICogXG4gKiBAbWV0aG9kIG91dHB1dExvZ0Zvcm1hdHRlclxuICogQHBhcmFtIHtPYmplY3R9IGxvZyBvYmplY3RcbiAqIEByZXR1cm5zIHtPYmplY3R9IGxvZ1xuKi9cbnZhciBvdXRwdXRMb2dGb3JtYXR0ZXIgPSBmdW5jdGlvbihsb2cpIHtcbiAgICBpZiAobG9nID09PSBudWxsKSB7IC8vICdwZW5kaW5nJyAmJiAnbGF0ZXN0JyBmaWx0ZXJzIGFyZSBudWxsc1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZihsb2cuYmxvY2tOdW1iZXIgIT09IG51bGwpXG4gICAgICAgIGxvZy5ibG9ja051bWJlciA9IHV0aWxzLnRvRGVjaW1hbChsb2cuYmxvY2tOdW1iZXIpO1xuICAgIGlmKGxvZy50cmFuc2FjdGlvbkluZGV4ICE9PSBudWxsKVxuICAgICAgICBsb2cudHJhbnNhY3Rpb25JbmRleCA9IHV0aWxzLnRvRGVjaW1hbChsb2cudHJhbnNhY3Rpb25JbmRleCk7XG4gICAgaWYobG9nLmxvZ0luZGV4ICE9PSBudWxsKVxuICAgICAgICBsb2cubG9nSW5kZXggPSB1dGlscy50b0RlY2ltYWwobG9nLmxvZ0luZGV4KTtcblxuICAgIHJldHVybiBsb2c7XG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGlucHV0IG9mIGEgd2hpc3BlciBwb3N0IGFuZCBjb252ZXJ0cyBhbGwgdmFsdWVzIHRvIEhFWFxuICpcbiAqIEBtZXRob2QgaW5wdXRQb3N0Rm9ybWF0dGVyXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNhY3Rpb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuKi9cbnZhciBpbnB1dFBvc3RGb3JtYXR0ZXIgPSBmdW5jdGlvbihwb3N0KSB7XG5cbiAgICBwb3N0LnBheWxvYWQgPSB1dGlscy50b0hleChwb3N0LnBheWxvYWQpO1xuICAgIHBvc3QudHRsID0gdXRpbHMuZnJvbURlY2ltYWwocG9zdC50dGwpO1xuICAgIHBvc3Qud29ya1RvUHJvdmUgPSB1dGlscy5mcm9tRGVjaW1hbChwb3N0LndvcmtUb1Byb3ZlKTtcbiAgICBwb3N0LnByaW9yaXR5ID0gdXRpbHMuZnJvbURlY2ltYWwocG9zdC5wcmlvcml0eSk7XG5cbiAgICAvLyBmYWxsYmFja1xuICAgIGlmICghdXRpbHMuaXNBcnJheShwb3N0LnRvcGljcykpIHtcbiAgICAgICAgcG9zdC50b3BpY3MgPSBwb3N0LnRvcGljcyA/IFtwb3N0LnRvcGljc10gOiBbXTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgdGhlIGZvbGxvd2luZyBvcHRpb25zXG4gICAgcG9zdC50b3BpY3MgPSBwb3N0LnRvcGljcy5tYXAoZnVuY3Rpb24odG9waWMpe1xuICAgICAgICByZXR1cm4gdXRpbHMuZnJvbUFzY2lpKHRvcGljKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwb3N0OyBcbn07XG5cbi8qKlxuICogRm9ybWF0cyB0aGUgb3V0cHV0IG9mIGEgcmVjZWl2ZWQgcG9zdCBtZXNzYWdlXG4gKlxuICogQG1ldGhvZCBvdXRwdXRQb3N0Rm9ybWF0dGVyXG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbnZhciBvdXRwdXRQb3N0Rm9ybWF0dGVyID0gZnVuY3Rpb24ocG9zdCl7XG5cbiAgICBwb3N0LmV4cGlyeSA9IHV0aWxzLnRvRGVjaW1hbChwb3N0LmV4cGlyeSk7XG4gICAgcG9zdC5zZW50ID0gdXRpbHMudG9EZWNpbWFsKHBvc3Quc2VudCk7XG4gICAgcG9zdC50dGwgPSB1dGlscy50b0RlY2ltYWwocG9zdC50dGwpO1xuICAgIHBvc3Qud29ya1Byb3ZlZCA9IHV0aWxzLnRvRGVjaW1hbChwb3N0LndvcmtQcm92ZWQpO1xuICAgIHBvc3QucGF5bG9hZFJhdyA9IHBvc3QucGF5bG9hZDtcbiAgICBwb3N0LnBheWxvYWQgPSB1dGlscy50b0FzY2lpKHBvc3QucGF5bG9hZCk7XG5cbiAgICBpZiAodXRpbHMuaXNKc29uKHBvc3QucGF5bG9hZCkpIHtcbiAgICAgICAgcG9zdC5wYXlsb2FkID0gSlNPTi5wYXJzZShwb3N0LnBheWxvYWQpO1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCB0aGUgZm9sbG93aW5nIG9wdGlvbnNcbiAgICBpZiAoIXBvc3QudG9waWNzKSB7XG4gICAgICAgIHBvc3QudG9waWNzID0gW107XG4gICAgfVxuICAgIHBvc3QudG9waWNzID0gcG9zdC50b3BpY3MubWFwKGZ1bmN0aW9uKHRvcGljKXtcbiAgICAgICAgcmV0dXJuIHV0aWxzLnRvQXNjaWkodG9waWMpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBvc3Q7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbnB1dERlZmF1bHRCbG9ja051bWJlckZvcm1hdHRlcjogaW5wdXREZWZhdWx0QmxvY2tOdW1iZXJGb3JtYXR0ZXIsXG4gICAgaW5wdXRCbG9ja051bWJlckZvcm1hdHRlcjogaW5wdXRCbG9ja051bWJlckZvcm1hdHRlcixcbiAgICBpbnB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyOiBpbnB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyLFxuICAgIGlucHV0UG9zdEZvcm1hdHRlcjogaW5wdXRQb3N0Rm9ybWF0dGVyLFxuICAgIG91dHB1dEJpZ051bWJlckZvcm1hdHRlcjogb3V0cHV0QmlnTnVtYmVyRm9ybWF0dGVyLFxuICAgIG91dHB1dFRyYW5zYWN0aW9uRm9ybWF0dGVyOiBvdXRwdXRUcmFuc2FjdGlvbkZvcm1hdHRlcixcbiAgICBvdXRwdXRCbG9ja0Zvcm1hdHRlcjogb3V0cHV0QmxvY2tGb3JtYXR0ZXIsXG4gICAgb3V0cHV0TG9nRm9ybWF0dGVyOiBvdXRwdXRMb2dGb3JtYXR0ZXIsXG4gICAgb3V0cHV0UG9zdEZvcm1hdHRlcjogb3V0cHV0UG9zdEZvcm1hdHRlclxufTtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKipcbiAqIEBmaWxlIGZ1bmN0aW9uLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciB3ZWIzID0gcmVxdWlyZSgnLi4vd2ViMycpO1xudmFyIGNvZGVyID0gcmVxdWlyZSgnLi4vc29saWRpdHkvY29kZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyk7XG52YXIgZm9ybWF0dGVycyA9IHJlcXVpcmUoJy4vZm9ybWF0dGVycycpO1xudmFyIHNoYTMgPSByZXF1aXJlKCcuLi91dGlscy9zaGEzJyk7XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgc2hvdWxkIGJlIHVzZWQgdG8gY2FsbC9zZW5kVHJhbnNhY3Rpb24gdG8gc29saWRpdHkgZnVuY3Rpb25zXG4gKi9cbnZhciBTb2xpZGl0eUZ1bmN0aW9uID0gZnVuY3Rpb24gKGpzb24sIGFkZHJlc3MpIHtcbiAgICB0aGlzLl9pbnB1dFR5cGVzID0ganNvbi5pbnB1dHMubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBpLnR5cGU7XG4gICAgfSk7XG4gICAgdGhpcy5fb3V0cHV0VHlwZXMgPSBqc29uLm91dHB1dHMubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHJldHVybiBpLnR5cGU7XG4gICAgfSk7XG4gICAgdGhpcy5fY29uc3RhbnQgPSBqc29uLmNvbnN0YW50O1xuICAgIHRoaXMuX25hbWUgPSB1dGlscy50cmFuc2Zvcm1Ub0Z1bGxOYW1lKGpzb24pO1xuICAgIHRoaXMuX2FkZHJlc3MgPSBhZGRyZXNzO1xufTtcblxuU29saWRpdHlGdW5jdGlvbi5wcm90b3R5cGUuZXh0cmFjdENhbGxiYWNrID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pKSB7XG4gICAgICAgIHJldHVybiBhcmdzLnBvcCgpOyAvLyBtb2RpZnkgdGhlIGFyZ3MgYXJyYXkhXG4gICAgfVxufTtcblxuU29saWRpdHlGdW5jdGlvbi5wcm90b3R5cGUuZXh0cmFjdERlZmF1bHRCbG9jayA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gdGhpcy5faW5wdXRUeXBlcy5sZW5ndGggJiYgIXV0aWxzLmlzT2JqZWN0KGFyZ3NbYXJncy5sZW5ndGggLTFdKSkge1xuICAgICAgICByZXR1cm4gZm9ybWF0dGVycy5pbnB1dERlZmF1bHRCbG9ja051bWJlckZvcm1hdHRlcihhcmdzLnBvcCgpKTsgLy8gbW9kaWZ5IHRoZSBhcmdzIGFycmF5IVxuICAgIH1cbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gY3JlYXRlIHBheWxvYWQgZnJvbSBhcmd1bWVudHNcbiAqXG4gKiBAbWV0aG9kIHRvUGF5bG9hZFxuICogQHBhcmFtIHtBcnJheX0gc29saWRpdHkgZnVuY3Rpb24gcGFyYW1zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uYWwgcGF5bG9hZCBvcHRpb25zXG4gKi9cblNvbGlkaXR5RnVuY3Rpb24ucHJvdG90eXBlLnRvUGF5bG9hZCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBpZiAoYXJncy5sZW5ndGggPiB0aGlzLl9pbnB1dFR5cGVzLmxlbmd0aCAmJiB1dGlscy5pc09iamVjdChhcmdzW2FyZ3MubGVuZ3RoIC0xXSkpIHtcbiAgICAgICAgb3B0aW9ucyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgb3B0aW9ucy50byA9IHRoaXMuX2FkZHJlc3M7XG4gICAgb3B0aW9ucy5kYXRhID0gJzB4JyArIHRoaXMuc2lnbmF0dXJlKCkgKyBjb2Rlci5lbmNvZGVQYXJhbXModGhpcy5faW5wdXRUeXBlcywgYXJncyk7XG4gICAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGdldCBmdW5jdGlvbiBzaWduYXR1cmVcbiAqXG4gKiBAbWV0aG9kIHNpZ25hdHVyZVxuICogQHJldHVybiB7U3RyaW5nfSBmdW5jdGlvbiBzaWduYXR1cmVcbiAqL1xuU29saWRpdHlGdW5jdGlvbi5wcm90b3R5cGUuc2lnbmF0dXJlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBzaGEzKHRoaXMuX25hbWUpLnNsaWNlKDAsIDgpO1xufTtcblxuXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS51bnBhY2tPdXRwdXQgPSBmdW5jdGlvbiAob3V0cHV0KSB7XG4gICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG91dHB1dCA9IG91dHB1dC5sZW5ndGggPj0gMiA/IG91dHB1dC5zbGljZSgyKSA6IG91dHB1dDtcbiAgICB2YXIgcmVzdWx0ID0gY29kZXIuZGVjb2RlUGFyYW1zKHRoaXMuX291dHB1dFR5cGVzLCBvdXRwdXQpO1xuICAgIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAxID8gcmVzdWx0WzBdIDogcmVzdWx0O1xufTtcblxuLyoqXG4gKiBDYWxscyBhIGNvbnRyYWN0IGZ1bmN0aW9uLlxuICpcbiAqIEBtZXRob2QgY2FsbFxuICogQHBhcmFtIHsuLi5PYmplY3R9IENvbnRyYWN0IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICogQHBhcmFtIHtmdW5jdGlvbn0gSWYgdGhlIGxhc3QgYXJndW1lbnQgaXMgYSBmdW5jdGlvbiwgdGhlIGNvbnRyYWN0IGZ1bmN0aW9uXG4gKiAgIGNhbGwgd2lsbCBiZSBhc3luY2hyb25vdXMsIGFuZCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlXG4gKiAgIGVycm9yIGFuZCByZXN1bHQuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IG91dHB1dCBieXRlc1xuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5maWx0ZXIoZnVuY3Rpb24gKGEpIHtyZXR1cm4gYSAhPT0gdW5kZWZpbmVkOyB9KTtcbiAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmV4dHJhY3RDYWxsYmFjayhhcmdzKTtcbiAgICB2YXIgZGVmYXVsdEJsb2NrID0gdGhpcy5leHRyYWN0RGVmYXVsdEJsb2NrKGFyZ3MpO1xuICAgIHZhciBwYXlsb2FkID0gdGhpcy50b1BheWxvYWQoYXJncyk7XG5cblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHdlYjMuZXRoLmNhbGwocGF5bG9hZCwgZGVmYXVsdEJsb2NrKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5wYWNrT3V0cHV0KG91dHB1dCk7XG4gICAgfSBcbiAgICAgICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHdlYjMuZXRoLmNhbGwocGF5bG9hZCwgZGVmYXVsdEJsb2NrLCBmdW5jdGlvbiAoZXJyb3IsIG91dHB1dCkge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgc2VsZi51bnBhY2tPdXRwdXQob3V0cHV0KSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIHNlbmRUcmFuc2FjdGlvbiB0byBzb2xpZGl0eSBmdW5jdGlvblxuICpcbiAqIEBtZXRob2Qgc2VuZFRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5zZW5kVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLmZpbHRlcihmdW5jdGlvbiAoYSkge3JldHVybiBhICE9PSB1bmRlZmluZWQ7IH0pO1xuICAgIHZhciBjYWxsYmFjayA9IHRoaXMuZXh0cmFjdENhbGxiYWNrKGFyZ3MpO1xuICAgIHZhciBwYXlsb2FkID0gdGhpcy50b1BheWxvYWQoYXJncyk7XG5cbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB3ZWIzLmV0aC5zZW5kVHJhbnNhY3Rpb24ocGF5bG9hZCk7XG4gICAgfVxuXG4gICAgd2ViMy5ldGguc2VuZFRyYW5zYWN0aW9uKHBheWxvYWQsIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZXN0aW1hdGVHYXMgb2Ygc29saWRpdHkgZnVuY3Rpb25cbiAqXG4gKiBAbWV0aG9kIGVzdGltYXRlR2FzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5lc3RpbWF0ZUdhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy5leHRyYWN0Q2FsbGJhY2soYXJncyk7XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLnRvUGF5bG9hZChhcmdzKTtcblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHdlYjMuZXRoLmVzdGltYXRlR2FzKHBheWxvYWQpO1xuICAgIH1cblxuICAgIHdlYjMuZXRoLmVzdGltYXRlR2FzKHBheWxvYWQsIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZ2V0IGZ1bmN0aW9uIGRpc3BsYXkgbmFtZVxuICpcbiAqIEBtZXRob2QgZGlzcGxheU5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ30gZGlzcGxheSBuYW1lIG9mIHRoZSBmdW5jdGlvblxuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5kaXNwbGF5TmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdXRpbHMuZXh0cmFjdERpc3BsYXlOYW1lKHRoaXMuX25hbWUpO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBnZXQgZnVuY3Rpb24gdHlwZSBuYW1lXG4gKlxuICogQG1ldGhvZCB0eXBlTmFtZVxuICogQHJldHVybiB7U3RyaW5nfSB0eXBlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uXG4gKi9cblNvbGlkaXR5RnVuY3Rpb24ucHJvdG90eXBlLnR5cGVOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1dGlscy5leHRyYWN0VHlwZU5hbWUodGhpcy5fbmFtZSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IHJwYyByZXF1ZXN0cyBmcm9tIHNvbGlkaXR5IGZ1bmN0aW9uXG4gKlxuICogQG1ldGhvZCByZXF1ZXN0XG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmV4dHJhY3RDYWxsYmFjayhhcmdzKTtcbiAgICB2YXIgcGF5bG9hZCA9IHRoaXMudG9QYXlsb2FkKGFyZ3MpO1xuICAgIHZhciBmb3JtYXQgPSB0aGlzLnVucGFja091dHB1dC5iaW5kKHRoaXMpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCwgXG4gICAgICAgIGZvcm1hdDogZm9ybWF0XG4gICAgfTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBleGVjdXRlIGZ1bmN0aW9uXG4gKlxuICogQG1ldGhvZCBleGVjdXRlXG4gKi9cblNvbGlkaXR5RnVuY3Rpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyYW5zYWN0aW9uID0gIXRoaXMuX2NvbnN0YW50O1xuXG4gICAgLy8gc2VuZCB0cmFuc2FjdGlvblxuICAgIGlmICh0cmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5kVHJhbnNhY3Rpb24uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfVxuXG4gICAgLy8gY2FsbFxuICAgIHJldHVybiB0aGlzLmNhbGwuYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gYXR0YWNoIGZ1bmN0aW9uIHRvIGNvbnRyYWN0XG4gKlxuICogQG1ldGhvZCBhdHRhY2hUb0NvbnRyYWN0XG4gKiBAcGFyYW0ge0NvbnRyYWN0fVxuICovXG5Tb2xpZGl0eUZ1bmN0aW9uLnByb3RvdHlwZS5hdHRhY2hUb0NvbnRyYWN0ID0gZnVuY3Rpb24gKGNvbnRyYWN0KSB7XG4gICAgdmFyIGV4ZWN1dGUgPSB0aGlzLmV4ZWN1dGUuYmluZCh0aGlzKTtcbiAgICBleGVjdXRlLnJlcXVlc3QgPSB0aGlzLnJlcXVlc3QuYmluZCh0aGlzKTtcbiAgICBleGVjdXRlLmNhbGwgPSB0aGlzLmNhbGwuYmluZCh0aGlzKTtcbiAgICBleGVjdXRlLnNlbmRUcmFuc2FjdGlvbiA9IHRoaXMuc2VuZFRyYW5zYWN0aW9uLmJpbmQodGhpcyk7XG4gICAgZXhlY3V0ZS5lc3RpbWF0ZUdhcyA9IHRoaXMuZXN0aW1hdGVHYXMuYmluZCh0aGlzKTtcbiAgICB2YXIgZGlzcGxheU5hbWUgPSB0aGlzLmRpc3BsYXlOYW1lKCk7XG4gICAgaWYgKCFjb250cmFjdFtkaXNwbGF5TmFtZV0pIHtcbiAgICAgICAgY29udHJhY3RbZGlzcGxheU5hbWVdID0gZXhlY3V0ZTtcbiAgICB9XG4gICAgY29udHJhY3RbZGlzcGxheU5hbWVdW3RoaXMudHlwZU5hbWUoKV0gPSBleGVjdXRlOyAvLyBjaXJjdWxhciEhISFcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29saWRpdHlGdW5jdGlvbjtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogQGZpbGUgaHR0cHByb3ZpZGVyLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiAgIE1hcmlhbiBPYW5jZWEgPG1hcmlhbkBldGhkZXYuY29tPlxuICogICBGYWJpYW4gVm9nZWxzdGVsbGVyIDxmYWJpYW5AZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFhNTEh0dHBSZXF1ZXN0ID0gcmVxdWlyZSgneG1saHR0cHJlcXVlc3QnKS5YTUxIdHRwUmVxdWVzdDsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxudmFyIEh0dHBQcm92aWRlciA9IGZ1bmN0aW9uIChob3N0KSB7XG4gICAgdGhpcy5ob3N0ID0gaG9zdCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4NTQ1Jztcbn07XG5cbkh0dHBQcm92aWRlci5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIHRoaXMuaG9zdCwgZmFsc2UpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24vanNvbicpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShwYXlsb2FkKSk7XG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICB0aHJvdyBlcnJvcnMuSW52YWxpZENvbm5lY3Rpb24odGhpcy5ob3N0KTtcbiAgICB9XG5cblxuICAgIC8vIGNoZWNrIHJlcXVlc3Quc3RhdHVzXG4gICAgLy8gVE9ETzogdGhyb3cgYW4gZXJyb3IgaGVyZSEgaXQgY2Fubm90IHNpbGVudGx5IGZhaWwhISFcbiAgICAvL2lmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgIC8vcmV0dXJuO1xuICAgIC8vfVxuXG4gICAgdmFyIHJlc3VsdCA9IHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuSW52YWxpZFJlc3BvbnNlKHJlc3VsdCk7ICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5IdHRwUHJvdmlkZXIucHJvdG90eXBlLnNlbmRBc3luYyA9IGZ1bmN0aW9uIChwYXlsb2FkLCBjYWxsYmFjaykge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGVycm9ycy5JbnZhbGlkUmVzcG9uc2UocmVzdWx0KTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIHRoaXMuaG9zdCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9ycy5JbnZhbGlkQ29ubmVjdGlvbih0aGlzLmhvc3QpKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0dHBQcm92aWRlcjtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSBpY2FwLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyk7XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgc2hvdWxkIGJlIHVzZWQgdG8gZXh0cmFjdCBuZWNlc3NhcnkgaW5mb3JtYXRpb24gZnJvbSBpYmFuIGFkZHJlc3NcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaWJhblxuICovXG52YXIgSUNBUCA9IGZ1bmN0aW9uIChpYmFuKSB7XG4gICAgdGhpcy5faWJhbiA9IGliYW47XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gY2hlY2sgaWYgaWNhcCBpcyBjb3JyZWN0XG4gKlxuICogQG1ldGhvZCBpc1ZhbGlkXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBpdCBpcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbklDQVAucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHV0aWxzLmlzSUJBTih0aGlzLl9pYmFuKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBjaGVjayBpZiBpYmFuIG51bWJlciBpcyBkaXJlY3RcbiAqXG4gKiBAbWV0aG9kIGlzRGlyZWN0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBpdCBpcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbklDQVAucHJvdG90eXBlLmlzRGlyZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pYmFuLmxlbmd0aCA9PT0gMzQ7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gY2hlY2sgaWYgaWJhbiBudW1iZXIgaWYgaW5kaXJlY3RcbiAqXG4gKiBAbWV0aG9kIGlzSW5kaXJlY3RcbiAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGl0IGlzLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuSUNBUC5wcm90b3R5cGUuaXNJbmRpcmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faWJhbi5sZW5ndGggPT09IDIwO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBpYmFuIGNoZWNrc3VtXG4gKiBVc2VzIHRoZSBtb2QtOTctMTAgY2hlY2tzdW1taW5nIHByb3RvY29sIChJU08vSUVDIDcwNjQ6MjAwMylcbiAqXG4gKiBAbWV0aG9kIGNoZWNrc3VtXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBjaGVja3N1bVxuICovXG5JQ0FQLnByb3RvdHlwZS5jaGVja3N1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faWJhbi5zdWJzdHIoMiwgMik7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IGluc3RpdHV0aW9uIGlkZW50aWZpZXJcbiAqIGVnLiBYUkVHXG4gKlxuICogQG1ldGhvZCBpbnN0aXR1dGlvblxuICogQHJldHVybnMge1N0cmluZ30gaW5zdGl0dXRpb24gaWRlbnRpZmllclxuICovXG5JQ0FQLnByb3RvdHlwZS5pbnN0aXR1dGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0luZGlyZWN0KCkgPyB0aGlzLl9pYmFuLnN1YnN0cig3LCA0KSA6ICcnO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBjbGllbnQgaWRlbnRpZmllciB3aXRoaW4gaW5zdGl0dXRpb25cbiAqIGVnLiBHQVZPRllPUktcbiAqXG4gKiBAbWV0aG9kIGNsaWVudFxuICogQHJldHVybnMge1N0cmluZ30gY2xpZW50IGlkZW50aWZpZXJcbiAqL1xuSUNBUC5wcm90b3R5cGUuY2xpZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzSW5kaXJlY3QoKSA/IHRoaXMuX2liYW4uc3Vic3RyKDExKSA6ICcnO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBjbGllbnQgZGlyZWN0IGFkZHJlc3NcbiAqXG4gKiBAbWV0aG9kIGFkZHJlc3NcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGNsaWVudCBkaXJlY3QgYWRkcmVzc1xuICovXG5JQ0FQLnByb3RvdHlwZS5hZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzRGlyZWN0KCkgPyB0aGlzLl9pYmFuLnN1YnN0cig0KSA6ICcnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJQ0FQO1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBAZmlsZSBqc29ucnBjLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIEpzb25ycGMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gc2luZ2xldG9uIHBhdHRlcm5cbiAgICBpZiAoYXJndW1lbnRzLmNhbGxlZS5fc2luZ2xldG9uSW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5jYWxsZWUuX3NpbmdsZXRvbkluc3RhbmNlO1xuICAgIH1cbiAgICBhcmd1bWVudHMuY2FsbGVlLl9zaW5nbGV0b25JbnN0YW5jZSA9IHRoaXM7XG5cbiAgICB0aGlzLm1lc3NhZ2VJZCA9IDE7XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge0pzb25ycGN9IHNpbmdsZXRvblxuICovXG5Kc29ucnBjLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBKc29ucnBjKCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIHZhbGlkIGpzb24gY3JlYXRlIHBheWxvYWQgb2JqZWN0XG4gKlxuICogQG1ldGhvZCB0b1BheWxvYWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1ldGhvZCBvZiBqc29ucnBjIGNhbGwsIHJlcXVpcmVkXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMsIGFuIGFycmF5IG9mIG1ldGhvZCBwYXJhbXMsIG9wdGlvbmFsXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB2YWxpZCBqc29ucnBjIHBheWxvYWQgb2JqZWN0XG4gKi9cbkpzb25ycGMucHJvdG90eXBlLnRvUGF5bG9hZCA9IGZ1bmN0aW9uIChtZXRob2QsIHBhcmFtcykge1xuICAgIGlmICghbWV0aG9kKVxuICAgICAgICBjb25zb2xlLmVycm9yKCdqc29ucnBjIG1ldGhvZCBzaG91bGQgYmUgc3BlY2lmaWVkIScpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAganNvbnJwYzogJzIuMCcsXG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXSxcbiAgICAgICAgaWQ6IHRoaXMubWVzc2FnZUlkKytcbiAgICB9O1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGNoZWNrIGlmIGpzb25ycGMgcmVzcG9uc2UgaXMgdmFsaWRcbiAqXG4gKiBAbWV0aG9kIGlzVmFsaWRSZXNwb25zZVxuICogQHBhcmFtIHtPYmplY3R9XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiByZXNwb25zZSBpcyB2YWxpZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbkpzb25ycGMucHJvdG90eXBlLmlzVmFsaWRSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIHJldHVybiAhIXJlc3BvbnNlICYmXG4gICAgICAgICFyZXNwb25zZS5lcnJvciAmJlxuICAgICAgICByZXNwb25zZS5qc29ucnBjID09PSAnMi4wJyAmJlxuICAgICAgICB0eXBlb2YgcmVzcG9uc2UuaWQgPT09ICdudW1iZXInICYmXG4gICAgICAgIHJlc3BvbnNlLnJlc3VsdCAhPT0gdW5kZWZpbmVkOyAvLyBvbmx5IHVuZGVmaW5lZCBpcyBub3QgdmFsaWQganNvbiBvYmplY3Rcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBjcmVhdGUgYmF0Y2ggcGF5bG9hZCBvYmplY3RcbiAqXG4gKiBAbWV0aG9kIHRvQmF0Y2hQYXlsb2FkXG4gKiBAcGFyYW0ge0FycmF5fSBtZXNzYWdlcywgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIG1ldGhvZCAocmVxdWlyZWQpIGFuZCBwYXJhbXMgKG9wdGlvbmFsKSBmaWVsZHNcbiAqIEByZXR1cm5zIHtBcnJheX0gYmF0Y2ggcGF5bG9hZFxuICovXG5Kc29ucnBjLnByb3RvdHlwZS50b0JhdGNoUGF5bG9hZCA9IGZ1bmN0aW9uIChtZXNzYWdlcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbWVzc2FnZXMubWFwKGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnRvUGF5bG9hZChtZXNzYWdlLm1ldGhvZCwgbWVzc2FnZS5wYXJhbXMpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29ucnBjO1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKlxuICogQGZpbGUgbWV0aG9kLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciBSZXF1ZXN0TWFuYWdlciA9IHJlcXVpcmUoJy4vcmVxdWVzdG1hbmFnZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxudmFyIE1ldGhvZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMuY2FsbCA9IG9wdGlvbnMuY2FsbDtcbiAgICB0aGlzLnBhcmFtcyA9IG9wdGlvbnMucGFyYW1zIHx8IDA7XG4gICAgdGhpcy5pbnB1dEZvcm1hdHRlciA9IG9wdGlvbnMuaW5wdXRGb3JtYXR0ZXI7XG4gICAgdGhpcy5vdXRwdXRGb3JtYXR0ZXIgPSBvcHRpb25zLm91dHB1dEZvcm1hdHRlcjtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIG5hbWUgb2YgdGhlIGpzb25ycGMgbWV0aG9kIGJhc2VkIG9uIGFyZ3VtZW50c1xuICpcbiAqIEBtZXRob2QgZ2V0Q2FsbFxuICogQHBhcmFtIHtBcnJheX0gYXJndW1lbnRzXG4gKiBAcmV0dXJuIHtTdHJpbmd9IG5hbWUgb2YganNvbnJwYyBtZXRob2RcbiAqL1xuTWV0aG9kLnByb3RvdHlwZS5nZXRDYWxsID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICByZXR1cm4gdXRpbHMuaXNGdW5jdGlvbih0aGlzLmNhbGwpID8gdGhpcy5jYWxsKGFyZ3MpIDogdGhpcy5jYWxsO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBleHRyYWN0IGNhbGxiYWNrIGZyb20gYXJyYXkgb2YgYXJndW1lbnRzLiBNb2RpZmllcyBpbnB1dCBwYXJhbVxuICpcbiAqIEBtZXRob2QgZXh0cmFjdENhbGxiYWNrXG4gKiBAcGFyYW0ge0FycmF5fSBhcmd1bWVudHNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufE51bGx9IGNhbGxiYWNrLCBpZiBleGlzdHNcbiAqL1xuTWV0aG9kLnByb3RvdHlwZS5leHRyYWN0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGFyZ3NbYXJncy5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3MucG9wKCk7IC8vIG1vZGlmeSB0aGUgYXJncyBhcnJheSFcbiAgICB9XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gY2hlY2sgaWYgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgaXMgY29ycmVjdFxuICogXG4gKiBAbWV0aG9kIHZhbGlkYXRlQXJnc1xuICogQHBhcmFtIHtBcnJheX0gYXJndW1lbnRzXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgaXQgaXMgbm90XG4gKi9cbk1ldGhvZC5wcm90b3R5cGUudmFsaWRhdGVBcmdzID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggIT09IHRoaXMucGFyYW1zKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5JbnZhbGlkTnVtYmVyT2ZQYXJhbXMoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZm9ybWF0IGlucHV0IGFyZ3Mgb2YgbWV0aG9kXG4gKiBcbiAqIEBtZXRob2QgZm9ybWF0SW5wdXRcbiAqIEBwYXJhbSB7QXJyYXl9XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuTWV0aG9kLnByb3RvdHlwZS5mb3JtYXRJbnB1dCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKCF0aGlzLmlucHV0Rm9ybWF0dGVyKSB7XG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0dGVyLm1hcChmdW5jdGlvbiAoZm9ybWF0dGVyLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gZm9ybWF0dGVyID8gZm9ybWF0dGVyKGFyZ3NbaW5kZXhdKSA6IGFyZ3NbaW5kZXhdO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGZvcm1hdCBvdXRwdXQocmVzdWx0KSBvZiBtZXRob2RcbiAqXG4gKiBAbWV0aG9kIGZvcm1hdE91dHB1dFxuICogQHBhcmFtIHtPYmplY3R9XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbk1ldGhvZC5wcm90b3R5cGUuZm9ybWF0T3V0cHV0ID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLm91dHB1dEZvcm1hdHRlciAmJiByZXN1bHQgIT09IG51bGwgPyB0aGlzLm91dHB1dEZvcm1hdHRlcihyZXN1bHQpIDogcmVzdWx0O1xufTtcblxuLyoqXG4gKiBTaG91bGQgYXR0YWNoIGZ1bmN0aW9uIHRvIG1ldGhvZFxuICogXG4gKiBAbWV0aG9kIGF0dGFjaFRvT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKi9cbk1ldGhvZC5wcm90b3R5cGUuYXR0YWNoVG9PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIGZ1bmMgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICBmdW5jLnJlcXVlc3QgPSB0aGlzLnJlcXVlc3QuYmluZCh0aGlzKTtcbiAgICBmdW5jLmNhbGwgPSB0aGlzLmNhbGw7IC8vIHRoYXQncyB1Z2x5LiBmaWx0ZXIuanMgdXNlcyBpdFxuICAgIHZhciBuYW1lID0gdGhpcy5uYW1lLnNwbGl0KCcuJyk7XG4gICAgaWYgKG5hbWUubGVuZ3RoID4gMSkge1xuICAgICAgICBvYmpbbmFtZVswXV0gPSBvYmpbbmFtZVswXV0gfHwge307XG4gICAgICAgIG9ialtuYW1lWzBdXVtuYW1lWzFdXSA9IGZ1bmM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW25hbWVbMF1dID0gZnVuYzsgXG4gICAgfVxufTtcblxuLyoqXG4gKiBTaG91bGQgY3JlYXRlIHBheWxvYWQgZnJvbSBnaXZlbiBpbnB1dCBhcmdzXG4gKlxuICogQG1ldGhvZCB0b1BheWxvYWRcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuTWV0aG9kLnByb3RvdHlwZS50b1BheWxvYWQgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBjYWxsID0gdGhpcy5nZXRDYWxsKGFyZ3MpO1xuICAgIHZhciBjYWxsYmFjayA9IHRoaXMuZXh0cmFjdENhbGxiYWNrKGFyZ3MpO1xuICAgIHZhciBwYXJhbXMgPSB0aGlzLmZvcm1hdElucHV0KGFyZ3MpO1xuICAgIHRoaXMudmFsaWRhdGVBcmdzKHBhcmFtcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtZXRob2Q6IGNhbGwsXG4gICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGNyZWF0ZSBwdXJlIEpTT05SUEMgcmVxdWVzdCB3aGljaCBjYW4gYmUgdXNlZCBpbiBiYXRjaCByZXF1ZXN0XG4gKlxuICogQG1ldGhvZCByZXF1ZXN0XG4gKiBAcGFyYW0gey4uLn0gcGFyYW1zXG4gKiBAcmV0dXJuIHtPYmplY3R9IGpzb25ycGMgcmVxdWVzdFxuICovXG5NZXRob2QucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLnRvUGF5bG9hZChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICBwYXlsb2FkLmZvcm1hdCA9IHRoaXMuZm9ybWF0T3V0cHV0LmJpbmQodGhpcyk7XG4gICAgcmV0dXJuIHBheWxvYWQ7XG59O1xuXG4vKipcbiAqIFNob3VsZCBzZW5kIHJlcXVlc3QgdG8gdGhlIEFQSVxuICpcbiAqIEBtZXRob2Qgc2VuZFxuICogQHBhcmFtIGxpc3Qgb2YgcGFyYW1zXG4gKiBAcmV0dXJuIHJlc3VsdFxuICovXG5NZXRob2QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQgPSB0aGlzLnRvUGF5bG9hZChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICBpZiAocGF5bG9hZC5jYWxsYmFjaykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBSZXF1ZXN0TWFuYWdlci5nZXRJbnN0YW5jZSgpLnNlbmRBc3luYyhwYXlsb2FkLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIHBheWxvYWQuY2FsbGJhY2soZXJyLCBzZWxmLmZvcm1hdE91dHB1dChyZXN1bHQpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZvcm1hdE91dHB1dChSZXF1ZXN0TWFuYWdlci5nZXRJbnN0YW5jZSgpLnNlbmQocGF5bG9hZCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRob2Q7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIFxuICogQGZpbGUgbmFtZXJlZy5qc1xuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG52YXIgY29udHJhY3QgPSByZXF1aXJlKCcuL2NvbnRyYWN0Jyk7XG5cbnZhciBhZGRyZXNzID0gJzB4YzZkOWQyY2Q0NDlhNzU0YzQ5NDI2NGUxODA5YzUwZTM0ZDY0NTYyYic7XG5cbnZhciBhYmkgPSBbXG4gICAge1wiY29uc3RhbnRcIjp0cnVlLFwiaW5wdXRzXCI6W3tcIm5hbWVcIjpcIl9vd25lclwiLFwidHlwZVwiOlwiYWRkcmVzc1wifV0sXCJuYW1lXCI6XCJuYW1lXCIsXCJvdXRwdXRzXCI6W3tcIm5hbWVcIjpcIm9fbmFtZVwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifV0sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOnRydWUsXCJpbnB1dHNcIjpbe1wibmFtZVwiOlwiX25hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn1dLFwibmFtZVwiOlwib3duZXJcIixcIm91dHB1dHNcIjpbe1wibmFtZVwiOlwiXCIsXCJ0eXBlXCI6XCJhZGRyZXNzXCJ9XSxcInR5cGVcIjpcImZ1bmN0aW9uXCJ9LFxuICAgIHtcImNvbnN0YW50XCI6dHJ1ZSxcImlucHV0c1wiOlt7XCJuYW1lXCI6XCJfbmFtZVwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifV0sXCJuYW1lXCI6XCJjb250ZW50XCIsXCJvdXRwdXRzXCI6W3tcIm5hbWVcIjpcIlwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifV0sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOnRydWUsXCJpbnB1dHNcIjpbe1wibmFtZVwiOlwiX25hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn1dLFwibmFtZVwiOlwiYWRkclwiLFwib3V0cHV0c1wiOlt7XCJuYW1lXCI6XCJcIixcInR5cGVcIjpcImFkZHJlc3NcIn1dLFwidHlwZVwiOlwiZnVuY3Rpb25cIn0sXG4gICAge1wiY29uc3RhbnRcIjpmYWxzZSxcImlucHV0c1wiOlt7XCJuYW1lXCI6XCJfbmFtZVwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifV0sXCJuYW1lXCI6XCJyZXNlcnZlXCIsXCJvdXRwdXRzXCI6W10sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOnRydWUsXCJpbnB1dHNcIjpbe1wibmFtZVwiOlwiX25hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn1dLFwibmFtZVwiOlwic3ViUmVnaXN0cmFyXCIsXCJvdXRwdXRzXCI6W3tcIm5hbWVcIjpcIm9fc3ViUmVnaXN0cmFyXCIsXCJ0eXBlXCI6XCJhZGRyZXNzXCJ9XSxcInR5cGVcIjpcImZ1bmN0aW9uXCJ9LFxuICAgIHtcImNvbnN0YW50XCI6ZmFsc2UsXCJpbnB1dHNcIjpbe1wibmFtZVwiOlwiX25hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn0se1wibmFtZVwiOlwiX25ld093bmVyXCIsXCJ0eXBlXCI6XCJhZGRyZXNzXCJ9XSxcIm5hbWVcIjpcInRyYW5zZmVyXCIsXCJvdXRwdXRzXCI6W10sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOmZhbHNlLFwiaW5wdXRzXCI6W3tcIm5hbWVcIjpcIl9uYW1lXCIsXCJ0eXBlXCI6XCJieXRlczMyXCJ9LHtcIm5hbWVcIjpcIl9yZWdpc3RyYXJcIixcInR5cGVcIjpcImFkZHJlc3NcIn1dLFwibmFtZVwiOlwic2V0U3ViUmVnaXN0cmFyXCIsXCJvdXRwdXRzXCI6W10sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOmZhbHNlLFwiaW5wdXRzXCI6W10sXCJuYW1lXCI6XCJSZWdpc3RyYXJcIixcIm91dHB1dHNcIjpbXSxcInR5cGVcIjpcImZ1bmN0aW9uXCJ9LFxuICAgIHtcImNvbnN0YW50XCI6ZmFsc2UsXCJpbnB1dHNcIjpbe1wibmFtZVwiOlwiX25hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn0se1wibmFtZVwiOlwiX2FcIixcInR5cGVcIjpcImFkZHJlc3NcIn0se1wibmFtZVwiOlwiX3ByaW1hcnlcIixcInR5cGVcIjpcImJvb2xcIn1dLFwibmFtZVwiOlwic2V0QWRkcmVzc1wiLFwib3V0cHV0c1wiOltdLFwidHlwZVwiOlwiZnVuY3Rpb25cIn0sXG4gICAge1wiY29uc3RhbnRcIjpmYWxzZSxcImlucHV0c1wiOlt7XCJuYW1lXCI6XCJfbmFtZVwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifSx7XCJuYW1lXCI6XCJfY29udGVudFwiLFwidHlwZVwiOlwiYnl0ZXMzMlwifV0sXCJuYW1lXCI6XCJzZXRDb250ZW50XCIsXCJvdXRwdXRzXCI6W10sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJjb25zdGFudFwiOmZhbHNlLFwiaW5wdXRzXCI6W3tcIm5hbWVcIjpcIl9uYW1lXCIsXCJ0eXBlXCI6XCJieXRlczMyXCJ9XSxcIm5hbWVcIjpcImRpc293blwiLFwib3V0cHV0c1wiOltdLFwidHlwZVwiOlwiZnVuY3Rpb25cIn0sXG4gICAge1wiY29uc3RhbnRcIjp0cnVlLFwiaW5wdXRzXCI6W3tcIm5hbWVcIjpcIl9uYW1lXCIsXCJ0eXBlXCI6XCJieXRlczMyXCJ9XSxcIm5hbWVcIjpcInJlZ2lzdGVyXCIsXCJvdXRwdXRzXCI6W3tcIm5hbWVcIjpcIlwiLFwidHlwZVwiOlwiYWRkcmVzc1wifV0sXCJ0eXBlXCI6XCJmdW5jdGlvblwifSxcbiAgICB7XCJhbm9ueW1vdXNcIjpmYWxzZSxcImlucHV0c1wiOlt7XCJpbmRleGVkXCI6dHJ1ZSxcIm5hbWVcIjpcIm5hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn1dLFwibmFtZVwiOlwiQ2hhbmdlZFwiLFwidHlwZVwiOlwiZXZlbnRcIn0sXG4gICAge1wiYW5vbnltb3VzXCI6ZmFsc2UsXCJpbnB1dHNcIjpbe1wiaW5kZXhlZFwiOnRydWUsXCJuYW1lXCI6XCJuYW1lXCIsXCJ0eXBlXCI6XCJieXRlczMyXCJ9LHtcImluZGV4ZWRcIjp0cnVlLFwibmFtZVwiOlwiYWRkclwiLFwidHlwZVwiOlwiYWRkcmVzc1wifV0sXCJuYW1lXCI6XCJQcmltYXJ5Q2hhbmdlZFwiLFwidHlwZVwiOlwiZXZlbnRcIn1cbl07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udHJhY3QoYWJpKS5hdChhZGRyZXNzKTtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogQGZpbGUgZXRoLmpzXG4gKiBAYXV0aG9yczpcbiAqICAgTWFyZWsgS290ZXdpY3ogPG1hcmVrQGV0aGRldi5jb20+XG4gKiBAZGF0ZSAyMDE1XG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXRpbHMnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuLy8vIEByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgZGVzY3JpYmluZyB3ZWIzLmV0aCBhcGkgbWV0aG9kc1xudmFyIG1ldGhvZHMgPSBbXG5dO1xuXG4vLy8gQHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBkZXNjcmliaW5nIHdlYjMuZXRoIGFwaSBwcm9wZXJ0aWVzXG52YXIgcHJvcGVydGllcyA9IFtcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAnbGlzdGVuaW5nJyxcbiAgICAgICAgZ2V0dGVyOiAnbmV0X2xpc3RlbmluZydcbiAgICB9KSxcbiAgICBuZXcgUHJvcGVydHkoe1xuICAgICAgICBuYW1lOiAncGVlckNvdW50JyxcbiAgICAgICAgZ2V0dGVyOiAnbmV0X3BlZXJDb3VudCcsXG4gICAgICAgIG91dHB1dEZvcm1hdHRlcjogdXRpbHMudG9EZWNpbWFsXG4gICAgfSlcbl07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbWV0aG9kczogbWV0aG9kcyxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG59O1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKlxuICogQGZpbGUgcHJvcGVydHkuanNcbiAqIEBhdXRob3IgRmFiaWFuIFZvZ2Vsc3RlbGxlciA8ZmFiaWFuQGZyb3plbWFuLmRlPlxuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG52YXIgUmVxdWVzdE1hbmFnZXIgPSByZXF1aXJlKCcuL3JlcXVlc3RtYW5hZ2VyJyk7XG5cbnZhciBQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMuZ2V0dGVyID0gb3B0aW9ucy5nZXR0ZXI7XG4gICAgdGhpcy5zZXR0ZXIgPSBvcHRpb25zLnNldHRlcjtcbiAgICB0aGlzLm91dHB1dEZvcm1hdHRlciA9IG9wdGlvbnMub3V0cHV0Rm9ybWF0dGVyO1xuICAgIHRoaXMuaW5wdXRGb3JtYXR0ZXIgPSBvcHRpb25zLmlucHV0Rm9ybWF0dGVyO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGZvcm1hdCBpbnB1dCBhcmdzIG9mIG1ldGhvZFxuICogXG4gKiBAbWV0aG9kIGZvcm1hdElucHV0XG4gKiBAcGFyYW0ge0FycmF5fVxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblByb3BlcnR5LnByb3RvdHlwZS5mb3JtYXRJbnB1dCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1hdHRlciA/IHRoaXMuaW5wdXRGb3JtYXR0ZXIoYXJnKSA6IGFyZztcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBmb3JtYXQgb3V0cHV0KHJlc3VsdCkgb2YgbWV0aG9kXG4gKlxuICogQG1ldGhvZCBmb3JtYXRPdXRwdXRcbiAqIEBwYXJhbSB7T2JqZWN0fVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5Qcm9wZXJ0eS5wcm90b3R5cGUuZm9ybWF0T3V0cHV0ID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLm91dHB1dEZvcm1hdHRlciAmJiByZXN1bHQgIT09IG51bGwgPyB0aGlzLm91dHB1dEZvcm1hdHRlcihyZXN1bHQpIDogcmVzdWx0O1xufTtcblxuLyoqXG4gKiBTaG91bGQgYXR0YWNoIGZ1bmN0aW9uIHRvIG1ldGhvZFxuICogXG4gKiBAbWV0aG9kIGF0dGFjaFRvT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKi9cblByb3BlcnR5LnByb3RvdHlwZS5hdHRhY2hUb09iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICAgIGdldDogdGhpcy5nZXQuYmluZCh0aGlzKSxcbiAgICB9O1xuXG4gICAgdmFyIG5hbWVzID0gdGhpcy5uYW1lLnNwbGl0KCcuJyk7XG4gICAgdmFyIG5hbWUgPSBuYW1lc1swXTtcbiAgICBpZiAobmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBvYmpbbmFtZXNbMF1dID0gb2JqW25hbWVzWzBdXSB8fCB7fTtcbiAgICAgICAgb2JqID0gb2JqW25hbWVzWzBdXTtcbiAgICAgICAgbmFtZSA9IG5hbWVzWzFdO1xuICAgIH1cbiAgICBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCBwcm90byk7XG5cbiAgICB2YXIgdG9Bc3luY05hbWUgPSBmdW5jdGlvbiAocHJlZml4LCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbiAgICB9O1xuXG4gICAgb2JqW3RvQXN5bmNOYW1lKCdnZXQnLCBuYW1lKV0gPSB0aGlzLmdldEFzeW5jLmJpbmQodGhpcyk7XG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIGdldCB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqXG4gKiBAbWV0aG9kIGdldFxuICogQHJldHVybiB7T2JqZWN0fSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqL1xuUHJvcGVydHkucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRPdXRwdXQoUmVxdWVzdE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZW5kKHtcbiAgICAgICAgbWV0aG9kOiB0aGlzLmdldHRlclxuICAgIH0pKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gYXN5bmNocm91bm91c2x5IGdldCB2YWx1ZSBvZiBwcm9wZXJ0eVxuICpcbiAqIEBtZXRob2QgZ2V0QXN5bmNcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKi9cblByb3BlcnR5LnByb3RvdHlwZS5nZXRBc3luYyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBSZXF1ZXN0TWFuYWdlci5nZXRJbnN0YW5jZSgpLnNlbmRBc3luYyh7XG4gICAgICAgIG1ldGhvZDogdGhpcy5nZXR0ZXJcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soZXJyLCBzZWxmLmZvcm1hdE91dHB1dChyZXN1bHQpKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHk7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIEBmaWxlIHF0c3luYy5qc1xuICogQGF1dGhvcnM6XG4gKiAgIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogICBNYXJpYW4gT2FuY2VhIDxtYXJpYW5AZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTRcbiAqL1xuXG52YXIgUXRTeW5jUHJvdmlkZXIgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG5RdFN5bmNQcm92aWRlci5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5hdmlnYXRvci5xdC5jYWxsTWV0aG9kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdFN5bmNQcm92aWRlcjtcblxuIiwiLypcbiAgICBUaGlzIGZpbGUgaXMgcGFydCBvZiBldGhlcmV1bS5qcy5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICAgIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgICBldGhlcmV1bS5qcyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCBldGhlcmV1bS5qcy4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG4vKiogXG4gKiBAZmlsZSByZXF1ZXN0bWFuYWdlci5qc1xuICogQGF1dGhvciBKZWZmcmV5IFdpbGNrZSA8amVmZkBldGhkZXYuY29tPlxuICogQGF1dGhvciBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBhdXRob3IgTWFyaWFuIE9hbmNlYSA8bWFyaWFuQGV0aGRldi5jb20+XG4gKiBAYXV0aG9yIEZhYmlhbiBWb2dlbHN0ZWxsZXIgPGZhYmlhbkBldGhkZXYuY29tPlxuICogQGF1dGhvciBHYXYgV29vZCA8Z0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNFxuICovXG5cbnZhciBKc29ucnBjID0gcmVxdWlyZSgnLi9qc29ucnBjJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy91dGlscycpO1xudmFyIGMgPSByZXF1aXJlKCcuLi91dGlscy9jb25maWcnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG4vKipcbiAqIEl0J3MgcmVzcG9uc2libGUgZm9yIHBhc3NpbmcgbWVzc2FnZXMgdG8gcHJvdmlkZXJzXG4gKiBJdCdzIGFsc28gcmVzcG9uc2libGUgZm9yIHBvbGxpbmcgdGhlIGV0aGVyZXVtIG5vZGUgZm9yIGluY29taW5nIG1lc3NhZ2VzXG4gKiBEZWZhdWx0IHBvbGwgdGltZW91dCBpcyAxIHNlY29uZFxuICogU2luZ2xldG9uXG4gKi9cbnZhciBSZXF1ZXN0TWFuYWdlciA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgIC8vIHNpbmdsZXRvbiBwYXR0ZXJuXG4gICAgaWYgKGFyZ3VtZW50cy5jYWxsZWUuX3NpbmdsZXRvbkluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHMuY2FsbGVlLl9zaW5nbGV0b25JbnN0YW5jZTtcbiAgICB9XG4gICAgYXJndW1lbnRzLmNhbGxlZS5fc2luZ2xldG9uSW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgdGhpcy5wcm92aWRlciA9IHByb3ZpZGVyO1xuICAgIHRoaXMucG9sbHMgPSB7fTtcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMucG9sbCgpO1xufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0TWFuYWdlcn0gc2luZ2xldG9uXG4gKi9cblJlcXVlc3RNYW5hZ2VyLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBSZXF1ZXN0TWFuYWdlcigpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gc3luY2hyb25vdXNseSBzZW5kIHJlcXVlc3RcbiAqXG4gKiBAbWV0aG9kIHNlbmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblJlcXVlc3RNYW5hZ2VyLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoIXRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcnMuSW52YWxpZFByb3ZpZGVyKCkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGF5bG9hZCA9IEpzb25ycGMuZ2V0SW5zdGFuY2UoKS50b1BheWxvYWQoZGF0YS5tZXRob2QsIGRhdGEucGFyYW1zKTtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wcm92aWRlci5zZW5kKHBheWxvYWQpO1xuXG4gICAgaWYgKCFKc29ucnBjLmdldEluc3RhbmNlKCkuaXNWYWxpZFJlc3BvbnNlKHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLkludmFsaWRSZXNwb25zZShyZXN1bHQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQucmVzdWx0O1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBhc3luY2hyb25vdXNseSBzZW5kIHJlcXVlc3RcbiAqXG4gKiBAbWV0aG9kIHNlbmRBc3luY1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblJlcXVlc3RNYW5hZ2VyLnByb3RvdHlwZS5zZW5kQXN5bmMgPSBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9ycy5JbnZhbGlkUHJvdmlkZXIoKSk7XG4gICAgfVxuXG4gICAgdmFyIHBheWxvYWQgPSBKc29ucnBjLmdldEluc3RhbmNlKCkudG9QYXlsb2FkKGRhdGEubWV0aG9kLCBkYXRhLnBhcmFtcyk7XG4gICAgdGhpcy5wcm92aWRlci5zZW5kQXN5bmMocGF5bG9hZCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIUpzb25ycGMuZ2V0SW5zdGFuY2UoKS5pc1ZhbGlkUmVzcG9uc2UocmVzdWx0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9ycy5JbnZhbGlkUmVzcG9uc2UocmVzdWx0KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQucmVzdWx0KTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBhc3luY2hyb25vdXNseSBzZW5kIGJhdGNoIHJlcXVlc3RcbiAqXG4gKiBAbWV0aG9kIHNlbmRCYXRjaFxuICogQHBhcmFtIHtBcnJheX0gYmF0Y2ggZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuUmVxdWVzdE1hbmFnZXIucHJvdG90eXBlLnNlbmRCYXRjaCA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5wcm92aWRlcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3JzLkludmFsaWRQcm92aWRlcigpKTtcbiAgICB9XG5cbiAgICB2YXIgcGF5bG9hZCA9IEpzb25ycGMuZ2V0SW5zdGFuY2UoKS50b0JhdGNoUGF5bG9hZChkYXRhKTtcblxuICAgIHRoaXMucHJvdmlkZXIuc2VuZEFzeW5jKHBheWxvYWQsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXV0aWxzLmlzQXJyYXkocmVzdWx0cykpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcnMuSW52YWxpZFJlc3BvbnNlKHJlc3VsdHMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgfSk7IFxufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBzZXQgcHJvdmlkZXIgb2YgcmVxdWVzdCBtYW5hZ2VyXG4gKlxuICogQG1ldGhvZCBzZXRQcm92aWRlclxuICogQHBhcmFtIHtPYmplY3R9XG4gKi9cblJlcXVlc3RNYW5hZ2VyLnByb3RvdHlwZS5zZXRQcm92aWRlciA9IGZ1bmN0aW9uIChwKSB7XG4gICAgdGhpcy5wcm92aWRlciA9IHA7XG59O1xuXG4vKmpzaGludCBtYXhwYXJhbXM6NCAqL1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIHN0YXJ0IHBvbGxpbmdcbiAqXG4gKiBAbWV0aG9kIHN0YXJ0UG9sbGluZ1xuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAqIEBwYXJhbSB7TnVtYmVyfSBwb2xsSWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB1bmluc3RhbGxcbiAqXG4gKiBAdG9kbyBjbGVhbnVwIG51bWJlciBvZiBwYXJhbXNcbiAqL1xuUmVxdWVzdE1hbmFnZXIucHJvdG90eXBlLnN0YXJ0UG9sbGluZyA9IGZ1bmN0aW9uIChkYXRhLCBwb2xsSWQsIGNhbGxiYWNrLCB1bmluc3RhbGwpIHtcbiAgICB0aGlzLnBvbGxzWydwb2xsXycrIHBvbGxJZF0gPSB7ZGF0YTogZGF0YSwgaWQ6IHBvbGxJZCwgY2FsbGJhY2s6IGNhbGxiYWNrLCB1bmluc3RhbGw6IHVuaW5zdGFsbH07XG59O1xuLypqc2hpbnQgbWF4cGFyYW1zOjMgKi9cblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBzdG9wIHBvbGxpbmcgZm9yIGZpbHRlciB3aXRoIGdpdmVuIGlkXG4gKlxuICogQG1ldGhvZCBzdG9wUG9sbGluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IHBvbGxJZFxuICovXG5SZXF1ZXN0TWFuYWdlci5wcm90b3R5cGUuc3RvcFBvbGxpbmcgPSBmdW5jdGlvbiAocG9sbElkKSB7XG4gICAgZGVsZXRlIHRoaXMucG9sbHNbJ3BvbGxfJysgcG9sbElkXTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byByZXNldCB0aGUgcG9sbGluZyBtZWNoYW5pc20gb2YgdGhlIHJlcXVlc3QgbWFuYWdlclxuICpcbiAqIEBtZXRob2QgcmVzZXRcbiAqL1xuUmVxdWVzdE1hbmFnZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnBvbGxzKSB7XG4gICAgICAgIGlmICh0aGlzLnBvbGxzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMucG9sbHNba2V5XS51bmluc3RhbGwoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvbGxzID0ge307XG5cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnBvbGwoKTtcbn07XG5cbi8qKlxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwb2xsIGZvciBjaGFuZ2VzIG9uIGZpbHRlciB3aXRoIGdpdmVuIGlkXG4gKlxuICogQG1ldGhvZCBwb2xsXG4gKi9cblJlcXVlc3RNYW5hZ2VyLnByb3RvdHlwZS5wb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIC8qanNoaW50IG1heGNvbXBsZXhpdHk6IDYgKi9cbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMucG9sbC5iaW5kKHRoaXMpLCBjLkVUSF9QT0xMSU5HX1RJTUVPVVQpO1xuXG4gICAgaWYgKHRoaXMucG9sbHMgPT09IHt9KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcnMuSW52YWxpZFByb3ZpZGVyKCkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBvbGxzRGF0YSA9IFtdO1xuICAgIHZhciBwb2xsc0tleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wb2xscykge1xuICAgICAgICBpZiAodGhpcy5wb2xscy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBwb2xsc0RhdGEucHVzaCh0aGlzLnBvbGxzW2tleV0uZGF0YSk7XG4gICAgICAgICAgICBwb2xsc0tleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvbGxzRGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYXlsb2FkID0gSnNvbnJwYy5nZXRJbnN0YW5jZSgpLnRvQmF0Y2hQYXlsb2FkKHBvbGxzRGF0YSk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5wcm92aWRlci5zZW5kQXN5bmMocGF5bG9hZCwgZnVuY3Rpb24gKGVycm9yLCByZXN1bHRzKSB7XG4gICAgICAgIC8vIFRPRE86IGNvbnNvbGUgbG9nP1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdXRpbHMuaXNBcnJheShyZXN1bHRzKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLkludmFsaWRSZXNwb25zZShyZXN1bHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHMubWFwKGZ1bmN0aW9uIChyZXN1bHQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gcG9sbHNLZXlzW2luZGV4XTtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgZmlsdGVyIGlzIHN0aWxsIGluc3RhbGxlZCBhZnRlciBhcnJpdmFsIG9mIHRoZSByZXF1ZXN0XG4gICAgICAgICAgICBpZihzZWxmLnBvbGxzW2tleV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuY2FsbGJhY2sgPSBzZWxmLnBvbGxzW2tleV0uY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiAoIXJlc3VsdCkgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBKc29ucnBjLmdldEluc3RhbmNlKCkuaXNWYWxpZFJlc3BvbnNlKHJlc3VsdCk7XG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNhbGxiYWNrKGVycm9ycy5JbnZhbGlkUmVzcG9uc2UocmVzdWx0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuaXNBcnJheShyZXN1bHQucmVzdWx0KSAmJiByZXN1bHQucmVzdWx0Lmxlbmd0aCA+IDA7XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0LmNhbGxiYWNrKG51bGwsIHJlc3VsdC5yZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdE1hbmFnZXI7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIEBmaWxlIHNoaC5qc1xuICogQGF1dGhvcnM6XG4gKiAgIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciBNZXRob2QgPSByZXF1aXJlKCcuL21ldGhvZCcpO1xudmFyIGZvcm1hdHRlcnMgPSByZXF1aXJlKCcuL2Zvcm1hdHRlcnMnKTtcblxudmFyIHBvc3QgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAncG9zdCcsIFxuICAgIGNhbGw6ICdzaGhfcG9zdCcsIFxuICAgIHBhcmFtczogMSxcbiAgICBpbnB1dEZvcm1hdHRlcjogW2Zvcm1hdHRlcnMuaW5wdXRQb3N0Rm9ybWF0dGVyXVxufSk7XG5cbnZhciBuZXdJZGVudGl0eSA9IG5ldyBNZXRob2Qoe1xuICAgIG5hbWU6ICduZXdJZGVudGl0eScsXG4gICAgY2FsbDogJ3NoaF9uZXdJZGVudGl0eScsXG4gICAgcGFyYW1zOiAwXG59KTtcblxudmFyIGhhc0lkZW50aXR5ID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2hhc0lkZW50aXR5JyxcbiAgICBjYWxsOiAnc2hoX2hhc0lkZW50aXR5JyxcbiAgICBwYXJhbXM6IDFcbn0pO1xuXG52YXIgbmV3R3JvdXAgPSBuZXcgTWV0aG9kKHtcbiAgICBuYW1lOiAnbmV3R3JvdXAnLFxuICAgIGNhbGw6ICdzaGhfbmV3R3JvdXAnLFxuICAgIHBhcmFtczogMFxufSk7XG5cbnZhciBhZGRUb0dyb3VwID0gbmV3IE1ldGhvZCh7XG4gICAgbmFtZTogJ2FkZFRvR3JvdXAnLFxuICAgIGNhbGw6ICdzaGhfYWRkVG9Hcm91cCcsXG4gICAgcGFyYW1zOiAwXG59KTtcblxudmFyIG1ldGhvZHMgPSBbXG4gICAgcG9zdCxcbiAgICBuZXdJZGVudGl0eSxcbiAgICBoYXNJZGVudGl0eSxcbiAgICBuZXdHcm91cCxcbiAgICBhZGRUb0dyb3VwXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBtZXRob2RzOiBtZXRob2RzXG59O1xuXG4iLCIvKlxuICAgIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV0aGVyZXVtLmpzLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgIGV0aGVyZXVtLmpzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIGV0aGVyZXVtLmpzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi8qKiBcbiAqIEBmaWxlIHRyYW5zZmVyLmpzXG4gKiBAYXV0aG9yIE1hcmVrIEtvdGV3aWN6IDxtYXJla0BldGhkZXYuY29tPlxuICogQGRhdGUgMjAxNVxuICovXG5cbnZhciB3ZWIzID0gcmVxdWlyZSgnLi4vd2ViMycpO1xudmFyIElDQVAgPSByZXF1aXJlKCcuL2ljYXAnKTtcbnZhciBuYW1lcmVnID0gcmVxdWlyZSgnLi9uYW1lcmVnJyk7XG52YXIgY29udHJhY3QgPSByZXF1aXJlKCcuL2NvbnRyYWN0Jyk7XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgdG8gbWFrZSBJQ0FQIHRyYW5zZmVyXG4gKlxuICogQG1ldGhvZCB0cmFuc2ZlclxuICogQHBhcmFtIHtTdHJpbmd9IGliYW4gbnVtYmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAoYWRkcmVzcylcbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHRvIGJlIHRyYW5mZXJlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2ssIGNhbGxiYWNrXG4gKi9cbnZhciB0cmFuc2ZlciA9IGZ1bmN0aW9uIChmcm9tLCBpYmFuLCB2YWx1ZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgaWNhcCA9IG5ldyBJQ0FQKGliYW4pOyBcbiAgICBpZiAoIWljYXAuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBpYmFuIGFkZHJlc3MnKTtcbiAgICB9XG5cbiAgICBpZiAoaWNhcC5pc0RpcmVjdCgpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2ZlclRvQWRkcmVzcyhmcm9tLCBpY2FwLmFkZHJlc3MoKSwgdmFsdWUsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICB2YXIgYWRkcmVzcyA9IG5hbWVyZWcuYWRkcihpY2FwLmluc3RpdHV0aW9uKCkpO1xuICAgICAgICByZXR1cm4gZGVwb3NpdChmcm9tLCBhZGRyZXNzLCB2YWx1ZSwgaWNhcC5jbGllbnQoKSk7XG4gICAgfVxuXG4gICAgbmFtZXJlZy5hZGRyKGljYXAuaW5zaXR1dGlvbigpLCBmdW5jdGlvbiAoZXJyLCBhZGRyZXNzKSB7XG4gICAgICAgIHJldHVybiBkZXBvc2l0KGZyb20sIGFkZHJlc3MsIHZhbHVlLCBpY2FwLmNsaWVudCgpLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gICAgXG59O1xuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIHRvIHRyYW5zZmVyIGZ1bmRzIHRvIGNlcnRhaW4gYWRkcmVzc1xuICpcbiAqIEBtZXRob2QgdHJhbnNmZXJUb0FkZHJlc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAoYWRkcmVzcylcbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHRvIGJlIHRyYW5mZXJlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2ssIGNhbGxiYWNrXG4gKi9cbnZhciB0cmFuc2ZlclRvQWRkcmVzcyA9IGZ1bmN0aW9uIChmcm9tLCBhZGRyZXNzLCB2YWx1ZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gd2ViMy5ldGguc2VuZFRyYW5zYWN0aW9uKHtcbiAgICAgICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICAgICAgZnJvbTogZnJvbSxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBTaG91bGQgYmUgdXNlZCB0byBkZXBvc2l0IGZ1bmRzIHRvIGdlbmVyaWMgRXhjaGFuZ2UgY29udHJhY3QgKG11c3QgaW1wbGVtZW50IGRlcG9zaXQoYnl0ZXMzMikgbWV0aG9kISlcbiAqXG4gKiBAbWV0aG9kIGRlcG9zaXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAoYWRkcmVzcylcbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHRvIGJlIHRyYW5mZXJlZFxuICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudCB1bmlxdWUgaWRlbnRpZmllclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2ssIGNhbGxiYWNrXG4gKi9cbnZhciBkZXBvc2l0ID0gZnVuY3Rpb24gKGZyb20sIGFkZHJlc3MsIHZhbHVlLCBjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFiaSA9IFt7XCJjb25zdGFudFwiOmZhbHNlLFwiaW5wdXRzXCI6W3tcIm5hbWVcIjpcIm5hbWVcIixcInR5cGVcIjpcImJ5dGVzMzJcIn1dLFwibmFtZVwiOlwiZGVwb3NpdFwiLFwib3V0cHV0c1wiOltdLFwidHlwZVwiOlwiZnVuY3Rpb25cIn1dO1xuICAgIHJldHVybiBjb250cmFjdChhYmkpLmF0KGFkZHJlc3MpLmRlcG9zaXQoY2xpZW50LCB7XG4gICAgICAgIGZyb206IGZyb20sXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0sIGNhbGxiYWNrKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmZXI7XG5cbiIsIi8qXG4gICAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXRoZXJldW0uanMuXG5cbiAgICBldGhlcmV1bS5qcyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAgICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gICAgZXRoZXJldW0uanMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggZXRoZXJldW0uanMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuLyoqIEBmaWxlIHdhdGNoZXMuanNcbiAqIEBhdXRob3JzOlxuICogICBNYXJlayBLb3Rld2ljeiA8bWFyZWtAZXRoZGV2LmNvbT5cbiAqIEBkYXRlIDIwMTVcbiAqL1xuXG52YXIgTWV0aG9kID0gcmVxdWlyZSgnLi9tZXRob2QnKTtcblxuLy8vIEByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgZGVzY3JpYmluZyB3ZWIzLmV0aC5maWx0ZXIgYXBpIG1ldGhvZHNcbnZhciBldGggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5ld0ZpbHRlckNhbGwgPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICB2YXIgdHlwZSA9IGFyZ3NbMF07XG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xhdGVzdCc6XG4gICAgICAgICAgICAgICAgYXJncy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyYW1zID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2V0aF9uZXdCbG9ja0ZpbHRlcic7XG4gICAgICAgICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgICAgICAgICBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAnZXRoX25ld1BlbmRpbmdUcmFuc2FjdGlvbkZpbHRlcic7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAnZXRoX25ld0ZpbHRlcic7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIG5ld0ZpbHRlciA9IG5ldyBNZXRob2Qoe1xuICAgICAgICBuYW1lOiAnbmV3RmlsdGVyJyxcbiAgICAgICAgY2FsbDogbmV3RmlsdGVyQ2FsbCxcbiAgICAgICAgcGFyYW1zOiAxXG4gICAgfSk7XG5cbiAgICB2YXIgdW5pbnN0YWxsRmlsdGVyID0gbmV3IE1ldGhvZCh7XG4gICAgICAgIG5hbWU6ICd1bmluc3RhbGxGaWx0ZXInLFxuICAgICAgICBjYWxsOiAnZXRoX3VuaW5zdGFsbEZpbHRlcicsXG4gICAgICAgIHBhcmFtczogMVxuICAgIH0pO1xuXG4gICAgdmFyIGdldExvZ3MgPSBuZXcgTWV0aG9kKHtcbiAgICAgICAgbmFtZTogJ2dldExvZ3MnLFxuICAgICAgICBjYWxsOiAnZXRoX2dldEZpbHRlckxvZ3MnLFxuICAgICAgICBwYXJhbXM6IDFcbiAgICB9KTtcblxuICAgIHZhciBwb2xsID0gbmV3IE1ldGhvZCh7XG4gICAgICAgIG5hbWU6ICdwb2xsJyxcbiAgICAgICAgY2FsbDogJ2V0aF9nZXRGaWx0ZXJDaGFuZ2VzJyxcbiAgICAgICAgcGFyYW1zOiAxXG4gICAgfSk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgICBuZXdGaWx0ZXIsXG4gICAgICAgIHVuaW5zdGFsbEZpbHRlcixcbiAgICAgICAgZ2V0TG9ncyxcbiAgICAgICAgcG9sbFxuICAgIF07XG59O1xuXG4vLy8gQHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBkZXNjcmliaW5nIHdlYjMuc2hoLndhdGNoIGFwaSBtZXRob2RzXG52YXIgc2hoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXdGaWx0ZXIgPSBuZXcgTWV0aG9kKHtcbiAgICAgICAgbmFtZTogJ25ld0ZpbHRlcicsXG4gICAgICAgIGNhbGw6ICdzaGhfbmV3RmlsdGVyJyxcbiAgICAgICAgcGFyYW1zOiAxXG4gICAgfSk7XG5cbiAgICB2YXIgdW5pbnN0YWxsRmlsdGVyID0gbmV3IE1ldGhvZCh7XG4gICAgICAgIG5hbWU6ICd1bmluc3RhbGxGaWx0ZXInLFxuICAgICAgICBjYWxsOiAnc2hoX3VuaW5zdGFsbEZpbHRlcicsXG4gICAgICAgIHBhcmFtczogMVxuICAgIH0pO1xuXG4gICAgdmFyIGdldExvZ3MgPSBuZXcgTWV0aG9kKHtcbiAgICAgICAgbmFtZTogJ2dldExvZ3MnLFxuICAgICAgICBjYWxsOiAnc2hoX2dldE1lc3NhZ2VzJyxcbiAgICAgICAgcGFyYW1zOiAxXG4gICAgfSk7XG5cbiAgICB2YXIgcG9sbCA9IG5ldyBNZXRob2Qoe1xuICAgICAgICBuYW1lOiAncG9sbCcsXG4gICAgICAgIGNhbGw6ICdzaGhfZ2V0RmlsdGVyQ2hhbmdlcycsXG4gICAgICAgIHBhcmFtczogMVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgbmV3RmlsdGVyLFxuICAgICAgICB1bmluc3RhbGxGaWx0ZXIsXG4gICAgICAgIGdldExvZ3MsXG4gICAgICAgIHBvbGxcbiAgICBdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZXRoOiBldGgsXG4gICAgc2hoOiBzaGhcbn07XG5cbiIsbnVsbCwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdHJvb3QuQ3J5cHRvSlMgPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG5cdC8qKlxuXHQgKiBDcnlwdG9KUyBjb3JlIGNvbXBvbmVudHMuXG5cdCAqL1xuXHR2YXIgQ3J5cHRvSlMgPSBDcnlwdG9KUyB8fCAoZnVuY3Rpb24gKE1hdGgsIHVuZGVmaW5lZCkge1xuXHQgICAgLyoqXG5cdCAgICAgKiBDcnlwdG9KUyBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGlicmFyeSBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDX2xpYiA9IEMubGliID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogQmFzZSBvYmplY3QgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBCYXNlID0gQ19saWIuQmFzZSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZnVuY3Rpb24gRigpIHt9XG5cblx0ICAgICAgICByZXR1cm4ge1xuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3ZlcnJpZGVzIFByb3BlcnRpZXMgdG8gY29weSBpbnRvIHRoZSBuZXcgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBmaWVsZDogJ3ZhbHVlJyxcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgICAgICBtZXRob2Q6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICogICAgICAgICB9XG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGV4dGVuZDogZnVuY3Rpb24gKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgLy8gU3Bhd25cblx0ICAgICAgICAgICAgICAgIEYucHJvdG90eXBlID0gdGhpcztcblx0ICAgICAgICAgICAgICAgIHZhciBzdWJ0eXBlID0gbmV3IEYoKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQXVnbWVudFxuXHQgICAgICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcblx0ICAgICAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG5cdCAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuXHQgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogRXh0ZW5kcyB0aGlzIG9iamVjdCBhbmQgcnVucyB0aGUgaW5pdCBtZXRob2QuXG5cdCAgICAgICAgICAgICAqIEFyZ3VtZW50cyB0byBjcmVhdGUoKSB3aWxsIGJlIHBhc3NlZCB0byBpbml0KCkuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBpbnN0YW5jZSA9IE15VHlwZS5jcmVhdGUoKTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5leHRlbmQoKTtcblx0ICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cblx0ICAgICAgICAgICAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHNvbWUgbG9naWMgd2hlbiB5b3VyIG9iamVjdHMgYXJlIGNyZWF0ZWQuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgICAgIC8vIC4uLlxuXHQgICAgICAgICAgICAgKiAgICAgICAgIH1cblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDb3BpZXMgcHJvcGVydGllcyBpbnRvIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICBNeVR5cGUubWl4SW4oe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnXG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIG1peEluOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcblx0ICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdC5wcm90b3R5cGUuZXh0ZW5kKHRoaXMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgIH0oKSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdvcmRzIFRoZSBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgKi9cblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKCk7XG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10pO1xuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAod29yZHMsIHNpZ0J5dGVzKSB7XG5cdCAgICAgICAgICAgIHdvcmRzID0gdGhpcy53b3JkcyA9IHdvcmRzIHx8IFtdO1xuXG5cdCAgICAgICAgICAgIGlmIChzaWdCeXRlcyAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIHRoaXMgd29yZCBhcnJheSB0byBhIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0cmluZ2lmaWVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZygpO1xuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheTEuY29uY2F0KHdvcmRBcnJheTIpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG5cdCAgICAgICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXHQgICAgICAgICAgICAvLyBDb25jYXRcblx0ICAgICAgICAgICAgaWYgKHRoaXNTaWdCeXRlcyAlIDQpIHtcblx0ICAgICAgICAgICAgICAgIC8vIENvcHkgb25lIGJ5dGUgYXQgYSB0aW1lXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXRCeXRlID0gKHRoYXRXb3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gfD0gdGhhdEJ5dGUgPDwgKDI0IC0gKCh0aGlzU2lnQnl0ZXMgKyBpKSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBDb3B5IG9uZSB3b3JkIGF0IGEgdGltZVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkgKz0gNCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdID0gdGhhdFdvcmRzW2kgPj4+IDJdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVtb3ZlcyBpbnNpZ25pZmljYW50IGJpdHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheS5jbGFtcCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wXG5cdCAgICAgICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gd29yZEFycmF5LmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbkJ5dGVzIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcmFuZG9tIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LnJhbmRvbSgxNik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmFuZG9tOiBmdW5jdGlvbiAobkJ5dGVzKSB7XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXG5cdCAgICAgICAgICAgIHZhciByID0gKGZ1bmN0aW9uIChtX3cpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBtX3cgPSBtX3c7XG5cdCAgICAgICAgICAgICAgICB2YXIgbV96ID0gMHgzYWRlNjhiMTtcblx0ICAgICAgICAgICAgICAgIHZhciBtYXNrID0gMHhmZmZmZmZmZjtcblxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBtX3ogPSAoMHg5MDY5ICogKG1feiAmIDB4RkZGRikgKyAobV96ID4+IDB4MTApKSAmIG1hc2s7XG5cdCAgICAgICAgICAgICAgICAgICAgbV93ID0gKDB4NDY1MCAqIChtX3cgJiAweEZGRkYpICsgKG1fdyA+PiAweDEwKSkgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoKG1feiA8PCAweDEwKSArIG1fdykgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3VsdCAvPSAweDEwMDAwMDAwMDtcblx0ICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gMC41O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiAoTWF0aC5yYW5kb20oKSA+IC41ID8gMSA6IC0xKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHJjYWNoZTsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX3IgPSByKChyY2FjaGUgfHwgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCk7XG5cblx0ICAgICAgICAgICAgICAgIHJjYWNoZSA9IF9yKCkgKiAweDNhZGU2N2I3O1xuXHQgICAgICAgICAgICAgICAgd29yZHMucHVzaCgoX3IoKSAqIDB4MTAwMDAwMDAwKSB8IDApO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfZW5jID0gQy5lbmMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBIZXggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGV4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLkhleC5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIGhleENoYXJzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcblx0ICAgICAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgJiAweDBmKS50b1N0cmluZygxNikpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhleENoYXJzLmpvaW4oJycpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciBUaGUgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGhleFN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChoZXhTdHIpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhleFN0ckxlbmd0aCA9IGhleFN0ci5sZW5ndGg7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXhTdHJMZW5ndGg7IGkgKz0gMikge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaSA+Pj4gM10gfD0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cihpLCAyKSwgMTYpIDw8ICgyNCAtIChpICUgOCkgKiA0KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGhleFN0ckxlbmd0aCAvIDIpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGF0aW4xIGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgTGF0aW4xID0gQ19lbmMuTGF0aW4xID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciBsYXRpbjFDaGFycyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgIGxhdGluMUNoYXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiaXRlKSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbGF0aW4xQ2hhcnMuam9pbignJyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgTGF0aW4xIHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0aW4xU3RyIFRoZSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKGxhdGluMVN0cikge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgbGF0aW4xU3RyTGVuZ3RoID0gbGF0aW4xU3RyLmxlbmd0aDtcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluMVN0ckxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkc1tpID4+PiAyXSB8PSAobGF0aW4xU3RyLmNoYXJDb2RlQXQoaSkgJiAweGZmKSA8PCAoMjQgLSAoaSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBsYXRpbjFTdHJMZW5ndGgpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogVVRGLTggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmOCA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpKSk7XG5cdCAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIFVURi04IGRhdGEnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIFVURi04IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXRmOFN0ciBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodXRmOFN0cikge1xuXHQgICAgICAgICAgICByZXR1cm4gTGF0aW4xLnBhcnNlKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh1dGY4U3RyKSkpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgYnVmZmVyZWQgYmxvY2sgYWxnb3JpdGhtIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIFRoZSBwcm9wZXJ0eSBibG9ja1NpemUgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBhIGNvbmNyZXRlIHN1YnR5cGUuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuXHQgICAgICovXG5cdCAgICB2YXIgQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IENfbGliLkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVzZXRzIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgZGF0YSBidWZmZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7XG5cdCAgICAgICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgPSAwO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGFwcGVuZC4gU3RyaW5ncyBhcmUgY29udmVydGVkIHRvIGEgV29yZEFycmF5IHVzaW5nIFVURi04LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2FwcGVuZDogZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQXBwZW5kXG5cdCAgICAgICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuXHQgICAgICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFByb2Nlc3NlcyBhdmFpbGFibGUgZGF0YSBibG9ja3MuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9GbHVzaCBXaGV0aGVyIGFsbCBibG9ja3MgYW5kIHBhcnRpYWwgYmxvY2tzIHNob3VsZCBiZSBwcm9jZXNzZWQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBwcm9jZXNzZWQgZGF0YS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCk7XG5cdCAgICAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9wcm9jZXNzOiBmdW5jdGlvbiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIGRhdGFTaWdCeXRlcyA9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIHZhciBibG9ja1NpemUgPSB0aGlzLmJsb2NrU2l6ZTtcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZUJ5dGVzID0gYmxvY2tTaXplICogNDtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBibG9ja3MgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5CbG9ja3NSZWFkeSA9IGRhdGFTaWdCeXRlcyAvIGJsb2NrU2l6ZUJ5dGVzO1xuXHQgICAgICAgICAgICBpZiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAgICAgLy8gUm91bmQgdXAgdG8gaW5jbHVkZSBwYXJ0aWFsIGJsb2Nrc1xuXHQgICAgICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5jZWlsKG5CbG9ja3NSZWFkeSk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSb3VuZCBkb3duIHRvIGluY2x1ZGUgb25seSBmdWxsIGJsb2Nrcyxcblx0ICAgICAgICAgICAgICAgIC8vIGxlc3MgdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBtdXN0IHJlbWFpbiBpbiB0aGUgYnVmZmVyXG5cdCAgICAgICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLm1heCgobkJsb2Nrc1JlYWR5IHwgMCkgLSB0aGlzLl9taW5CdWZmZXJTaXplLCAwKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIENvdW50IHdvcmRzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuV29yZHNSZWFkeSA9IG5CbG9ja3NSZWFkeSAqIGJsb2NrU2l6ZTtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBieXRlcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbkJ5dGVzUmVhZHkgPSBNYXRoLm1pbihuV29yZHNSZWFkeSAqIDQsIGRhdGFTaWdCeXRlcyk7XG5cblx0ICAgICAgICAgICAgLy8gUHJvY2VzcyBibG9ja3Ncblx0ICAgICAgICAgICAgaWYgKG5Xb3Jkc1JlYWR5KSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBuV29yZHNSZWFkeTsgb2Zmc2V0ICs9IGJsb2NrU2l6ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtYWxnb3JpdGhtIGxvZ2ljXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fZG9Qcm9jZXNzQmxvY2soZGF0YVdvcmRzLCBvZmZzZXQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJvY2Vzc2VkV29yZHMgPSBkYXRhV29yZHMuc3BsaWNlKDAsIG5Xb3Jkc1JlYWR5KTtcblx0ICAgICAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgLT0gbkJ5dGVzUmVhZHk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQocHJvY2Vzc2VkV29yZHMsIG5CeXRlc1JlYWR5KTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2RhdGEgPSB0aGlzLl9kYXRhLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfbWluQnVmZmVyU2l6ZTogMFxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgaGFzaGVyIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibG9ja1NpemUgVGhlIG51bWJlciBvZiAzMi1iaXQgd29yZHMgdGhpcyBoYXNoZXIgb3BlcmF0ZXMgb24uIERlZmF1bHQ6IDE2ICg1MTIgYml0cylcblx0ICAgICAqL1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlciA9IEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2ZnOiBCYXNlLmV4dGVuZCgpLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgKE9wdGlvbmFsKSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHVzZSBmb3IgdGhpcyBoYXNoIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKGNmZykge1xuXHQgICAgICAgICAgICAvLyBBcHBseSBjb25maWcgZGVmYXVsdHNcblx0ICAgICAgICAgICAgdGhpcy5jZmcgPSB0aGlzLmNmZy5leHRlbmQoY2ZnKTtcblxuXHQgICAgICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcblx0ICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZXNldHMgdGhpcyBoYXNoZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFJlc2V0IGRhdGEgYnVmZmVyXG5cdCAgICAgICAgICAgIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQuY2FsbCh0aGlzKTtcblxuXHQgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuXHQgICAgICAgICAgICB0aGlzLl9kb1Jlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFVwZGF0ZXMgdGhpcyBoYXNoZXIgd2l0aCBhIG1lc3NhZ2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICBoYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBBcHBlbmRcblx0ICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2hhaW5hYmxlXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBGaW5hbGl6ZXMgdGhlIGhhc2ggY29tcHV0YXRpb24uXG5cdCAgICAgICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBGaW5hbCBtZXNzYWdlIHVwZGF0ZVxuXHQgICAgICAgICAgICBpZiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcblx0ICAgICAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9kb0ZpbmFsaXplKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGJsb2NrU2l6ZTogNTEyLzMyLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIGEgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIFNIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIHVzZSBpbiB0aGlzIEhNQUMgaGVscGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIEhtYWNTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfY3JlYXRlSG1hY0hlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGtleSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDX2FsZ28uSE1BQy5pbml0KGhhc2hlciwga2V5KS5maW5hbGl6ZShtZXNzYWdlKTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbGdvcml0aG0gbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19hbGdvID0gQy5hbGdvID0ge307XG5cblx0ICAgIHJldHVybiBDO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUztcblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnksIHVuZGVmKSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiLi9jb3JlXCIpLCByZXF1aXJlKFwiLi94NjQtY29yZVwiKSk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW1wiLi9jb3JlXCIsIFwiLi94NjQtY29yZVwiXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdGZhY3Rvcnkocm9vdC5DcnlwdG9KUyk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKENyeXB0b0pTKSB7XG5cblx0KGZ1bmN0aW9uIChNYXRoKSB7XG5cdCAgICAvLyBTaG9ydGN1dHNcblx0ICAgIHZhciBDID0gQ3J5cHRvSlM7XG5cdCAgICB2YXIgQ19saWIgPSBDLmxpYjtcblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXk7XG5cdCAgICB2YXIgSGFzaGVyID0gQ19saWIuSGFzaGVyO1xuXHQgICAgdmFyIENfeDY0ID0gQy54NjQ7XG5cdCAgICB2YXIgWDY0V29yZCA9IENfeDY0LldvcmQ7XG5cdCAgICB2YXIgQ19hbGdvID0gQy5hbGdvO1xuXG5cdCAgICAvLyBDb25zdGFudHMgdGFibGVzXG5cdCAgICB2YXIgUkhPX09GRlNFVFMgPSBbXTtcblx0ICAgIHZhciBQSV9JTkRFWEVTICA9IFtdO1xuXHQgICAgdmFyIFJPVU5EX0NPTlNUQU5UUyA9IFtdO1xuXG5cdCAgICAvLyBDb21wdXRlIENvbnN0YW50c1xuXHQgICAgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAvLyBDb21wdXRlIHJobyBvZmZzZXQgY29uc3RhbnRzXG5cdCAgICAgICAgdmFyIHggPSAxLCB5ID0gMDtcblx0ICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IDI0OyB0KyspIHtcblx0ICAgICAgICAgICAgUkhPX09GRlNFVFNbeCArIDUgKiB5XSA9ICgodCArIDEpICogKHQgKyAyKSAvIDIpICUgNjQ7XG5cblx0ICAgICAgICAgICAgdmFyIG5ld1ggPSB5ICUgNTtcblx0ICAgICAgICAgICAgdmFyIG5ld1kgPSAoMiAqIHggKyAzICogeSkgJSA1O1xuXHQgICAgICAgICAgICB4ID0gbmV3WDtcblx0ICAgICAgICAgICAgeSA9IG5ld1k7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gQ29tcHV0ZSBwaSBpbmRleCBjb25zdGFudHNcblx0ICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuXHQgICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IDU7IHkrKykge1xuXHQgICAgICAgICAgICAgICAgUElfSU5ERVhFU1t4ICsgNSAqIHldID0geSArICgoMiAqIHggKyAzICogeSkgJSA1KSAqIDU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBDb21wdXRlIHJvdW5kIGNvbnN0YW50c1xuXHQgICAgICAgIHZhciBMRlNSID0gMHgwMTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI0OyBpKyspIHtcblx0ICAgICAgICAgICAgdmFyIHJvdW5kQ29uc3RhbnRNc3cgPSAwO1xuXHQgICAgICAgICAgICB2YXIgcm91bmRDb25zdGFudExzdyA9IDA7XG5cblx0ICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA3OyBqKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmIChMRlNSICYgMHgwMSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBiaXRQb3NpdGlvbiA9ICgxIDw8IGopIC0gMTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoYml0UG9zaXRpb24gPCAzMikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByb3VuZENvbnN0YW50THN3IF49IDEgPDwgYml0UG9zaXRpb247XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIC8qIGlmIChiaXRQb3NpdGlvbiA+PSAzMikgKi8ge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByb3VuZENvbnN0YW50TXN3IF49IDEgPDwgKGJpdFBvc2l0aW9uIC0gMzIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gQ29tcHV0ZSBuZXh0IExGU1Jcblx0ICAgICAgICAgICAgICAgIGlmIChMRlNSICYgMHg4MCkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFByaW1pdGl2ZSBwb2x5bm9taWFsIG92ZXIgR0YoMik6IHheOCArIHheNiArIHheNSArIHheNCArIDFcblx0ICAgICAgICAgICAgICAgICAgICBMRlNSID0gKExGU1IgPDwgMSkgXiAweDcxO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBMRlNSIDw8PSAxO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgUk9VTkRfQ09OU1RBTlRTW2ldID0gWDY0V29yZC5jcmVhdGUocm91bmRDb25zdGFudE1zdywgcm91bmRDb25zdGFudExzdyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSgpKTtcblxuXHQgICAgLy8gUmV1c2FibGUgb2JqZWN0cyBmb3IgdGVtcG9yYXJ5IHZhbHVlc1xuXHQgICAgdmFyIFQgPSBbXTtcblx0ICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTsgaSsrKSB7XG5cdCAgICAgICAgICAgIFRbaV0gPSBYNjRXb3JkLmNyZWF0ZSgpO1xuXHQgICAgICAgIH1cblx0ICAgIH0oKSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogU0hBLTMgaGFzaCBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBTSEEzID0gQ19hbGdvLlNIQTMgPSBIYXNoZXIuZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gb3V0cHV0TGVuZ3RoXG5cdCAgICAgICAgICogICBUaGUgZGVzaXJlZCBudW1iZXIgb2YgYml0cyBpbiB0aGUgb3V0cHV0IGhhc2guXG5cdCAgICAgICAgICogICBPbmx5IHZhbHVlcyBwZXJtaXR0ZWQgYXJlOiAyMjQsIDI1NiwgMzg0LCA1MTIuXG5cdCAgICAgICAgICogICBEZWZhdWx0OiA1MTJcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjZmc6IEhhc2hlci5jZmcuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgb3V0cHV0TGVuZ3RoOiA1MTJcblx0ICAgICAgICB9KSxcblxuXHQgICAgICAgIF9kb1Jlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlID0gW11cblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICBzdGF0ZVtpXSA9IG5ldyBYNjRXb3JkLmluaXQoKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRoaXMuYmxvY2tTaXplID0gKDE2MDAgLSAyICogdGhpcy5jZmcub3V0cHV0TGVuZ3RoKSAvIDMyO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfZG9Qcm9jZXNzQmxvY2s6IGZ1bmN0aW9uIChNLCBvZmZzZXQpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuXHQgICAgICAgICAgICB2YXIgbkJsb2NrU2l6ZUxhbmVzID0gdGhpcy5ibG9ja1NpemUgLyAyO1xuXG5cdCAgICAgICAgICAgIC8vIEFic29yYlxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5CbG9ja1NpemVMYW5lczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgICAgIHZhciBNMmkgID0gTVtvZmZzZXQgKyAyICogaV07XG5cdCAgICAgICAgICAgICAgICB2YXIgTTJpMSA9IE1bb2Zmc2V0ICsgMiAqIGkgKyAxXTtcblxuXHQgICAgICAgICAgICAgICAgLy8gU3dhcCBlbmRpYW5cblx0ICAgICAgICAgICAgICAgIE0yaSA9IChcblx0ICAgICAgICAgICAgICAgICAgICAoKChNMmkgPDwgOCkgIHwgKE0yaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcblx0ICAgICAgICAgICAgICAgICAgICAoKChNMmkgPDwgMjQpIHwgKE0yaSA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG5cdCAgICAgICAgICAgICAgICApO1xuXHQgICAgICAgICAgICAgICAgTTJpMSA9IChcblx0ICAgICAgICAgICAgICAgICAgICAoKChNMmkxIDw8IDgpICB8IChNMmkxID4+PiAyNCkpICYgMHgwMGZmMDBmZikgfFxuXHQgICAgICAgICAgICAgICAgICAgICgoKE0yaTEgPDwgMjQpIHwgKE0yaTEgPj4+IDgpKSAgJiAweGZmMDBmZjAwKVxuXHQgICAgICAgICAgICAgICAgKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQWJzb3JiIG1lc3NhZ2UgaW50byBzdGF0ZVxuXHQgICAgICAgICAgICAgICAgdmFyIGxhbmUgPSBzdGF0ZVtpXTtcblx0ICAgICAgICAgICAgICAgIGxhbmUuaGlnaCBePSBNMmkxO1xuXHQgICAgICAgICAgICAgICAgbGFuZS5sb3cgIF49IE0yaTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIFJvdW5kc1xuXHQgICAgICAgICAgICBmb3IgKHZhciByb3VuZCA9IDA7IHJvdW5kIDwgMjQ7IHJvdW5kKyspIHtcblx0ICAgICAgICAgICAgICAgIC8vIFRoZXRhXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIE1peCBjb2x1bW4gbGFuZXNcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdE1zdyA9IDAsIHRMc3cgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgNTsgeSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYW5lID0gc3RhdGVbeCArIDUgKiB5XTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdE1zdyBePSBsYW5lLmhpZ2g7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRMc3cgXj0gbGFuZS5sb3c7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gVGVtcG9yYXJ5IHZhbHVlc1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBUeCA9IFRbeF07XG5cdCAgICAgICAgICAgICAgICAgICAgVHguaGlnaCA9IHRNc3c7XG5cdCAgICAgICAgICAgICAgICAgICAgVHgubG93ICA9IHRMc3c7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBUeDQgPSBUWyh4ICsgNCkgJSA1XTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgVHgxID0gVFsoeCArIDEpICUgNV07XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIFR4MU1zdyA9IFR4MS5oaWdoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBUeDFMc3cgPSBUeDEubG93O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gTWl4IHN1cnJvdW5kaW5nIGNvbHVtbnNcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdE1zdyA9IFR4NC5oaWdoIF4gKChUeDFNc3cgPDwgMSkgfCAoVHgxTHN3ID4+PiAzMSkpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0THN3ID0gVHg0LmxvdyAgXiAoKFR4MUxzdyA8PCAxKSB8IChUeDFNc3cgPj4+IDMxKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCA1OyB5KyspIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhbmUgPSBzdGF0ZVt4ICsgNSAqIHldO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsYW5lLmhpZ2ggXj0gdE1zdztcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGFuZS5sb3cgIF49IHRMc3c7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBSaG8gUGlcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGxhbmVJbmRleCA9IDE7IGxhbmVJbmRleCA8IDI1OyBsYW5lSW5kZXgrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBsYW5lID0gc3RhdGVbbGFuZUluZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgbGFuZU1zdyA9IGxhbmUuaGlnaDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgbGFuZUxzdyA9IGxhbmUubG93O1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByaG9PZmZzZXQgPSBSSE9fT0ZGU0VUU1tsYW5lSW5kZXhdO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gUm90YXRlIGxhbmVzXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHJob09mZnNldCA8IDMyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0TXN3ID0gKGxhbmVNc3cgPDwgcmhvT2Zmc2V0KSB8IChsYW5lTHN3ID4+PiAoMzIgLSByaG9PZmZzZXQpKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRMc3cgPSAobGFuZUxzdyA8PCByaG9PZmZzZXQpIHwgKGxhbmVNc3cgPj4+ICgzMiAtIHJob09mZnNldCkpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSAvKiBpZiAocmhvT2Zmc2V0ID49IDMyKSAqLyB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0TXN3ID0gKGxhbmVMc3cgPDwgKHJob09mZnNldCAtIDMyKSkgfCAobGFuZU1zdyA+Pj4gKDY0IC0gcmhvT2Zmc2V0KSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0THN3ID0gKGxhbmVNc3cgPDwgKHJob09mZnNldCAtIDMyKSkgfCAobGFuZUxzdyA+Pj4gKDY0IC0gcmhvT2Zmc2V0KSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNwb3NlIGxhbmVzXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIFRQaUxhbmUgPSBUW1BJX0lOREVYRVNbbGFuZUluZGV4XV07XG5cdCAgICAgICAgICAgICAgICAgICAgVFBpTGFuZS5oaWdoID0gdE1zdztcblx0ICAgICAgICAgICAgICAgICAgICBUUGlMYW5lLmxvdyAgPSB0THN3O1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBSaG8gcGkgYXQgeCA9IHkgPSAwXG5cdCAgICAgICAgICAgICAgICB2YXIgVDAgPSBUWzBdO1xuXHQgICAgICAgICAgICAgICAgdmFyIHN0YXRlMCA9IHN0YXRlWzBdO1xuXHQgICAgICAgICAgICAgICAgVDAuaGlnaCA9IHN0YXRlMC5oaWdoO1xuXHQgICAgICAgICAgICAgICAgVDAubG93ICA9IHN0YXRlMC5sb3c7XG5cblx0ICAgICAgICAgICAgICAgIC8vIENoaVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCA1OyB4KyspIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IDU7IHkrKykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhbmVJbmRleCA9IHggKyA1ICogeTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhbmUgPSBzdGF0ZVtsYW5lSW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgVExhbmUgPSBUW2xhbmVJbmRleF07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBUeDFMYW5lID0gVFsoKHggKyAxKSAlIDUpICsgNSAqIHldO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgVHgyTGFuZSA9IFRbKCh4ICsgMikgJSA1KSArIDUgKiB5XTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaXggcm93c1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsYW5lLmhpZ2ggPSBUTGFuZS5oaWdoIF4gKH5UeDFMYW5lLmhpZ2ggJiBUeDJMYW5lLmhpZ2gpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBsYW5lLmxvdyAgPSBUTGFuZS5sb3cgIF4gKH5UeDFMYW5lLmxvdyAgJiBUeDJMYW5lLmxvdyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBJb3RhXG5cdCAgICAgICAgICAgICAgICB2YXIgbGFuZSA9IHN0YXRlWzBdO1xuXHQgICAgICAgICAgICAgICAgdmFyIHJvdW5kQ29uc3RhbnQgPSBST1VORF9DT05TVEFOVFNbcm91bmRdO1xuXHQgICAgICAgICAgICAgICAgbGFuZS5oaWdoIF49IHJvdW5kQ29uc3RhbnQuaGlnaDtcblx0ICAgICAgICAgICAgICAgIGxhbmUubG93ICBePSByb3VuZENvbnN0YW50Lmxvdzs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvRmluYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblx0ICAgICAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBuQml0c1RvdGFsID0gdGhpcy5fbkRhdGFCeXRlcyAqIDg7XG5cdCAgICAgICAgICAgIHZhciBuQml0c0xlZnQgPSBkYXRhLnNpZ0J5dGVzICogODtcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZUJpdHMgPSB0aGlzLmJsb2NrU2l6ZSAqIDMyO1xuXG5cdCAgICAgICAgICAgIC8vIEFkZCBwYWRkaW5nXG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1tuQml0c0xlZnQgPj4+IDVdIHw9IDB4MSA8PCAoMjQgLSBuQml0c0xlZnQgJSAzMik7XG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1soKE1hdGguY2VpbCgobkJpdHNMZWZ0ICsgMSkgLyBibG9ja1NpemVCaXRzKSAqIGJsb2NrU2l6ZUJpdHMpID4+PiA1KSAtIDFdIHw9IDB4ODA7XG5cdCAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgPSBkYXRhV29yZHMubGVuZ3RoICogNDtcblxuXHQgICAgICAgICAgICAvLyBIYXNoIGZpbmFsIGJsb2Nrc1xuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuXHQgICAgICAgICAgICB2YXIgb3V0cHV0TGVuZ3RoQnl0ZXMgPSB0aGlzLmNmZy5vdXRwdXRMZW5ndGggLyA4O1xuXHQgICAgICAgICAgICB2YXIgb3V0cHV0TGVuZ3RoTGFuZXMgPSBvdXRwdXRMZW5ndGhCeXRlcyAvIDg7XG5cblx0ICAgICAgICAgICAgLy8gU3F1ZWV6ZVxuXHQgICAgICAgICAgICB2YXIgaGFzaFdvcmRzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3V0cHV0TGVuZ3RoTGFuZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgICAgICB2YXIgbGFuZSA9IHN0YXRlW2ldO1xuXHQgICAgICAgICAgICAgICAgdmFyIGxhbmVNc3cgPSBsYW5lLmhpZ2g7XG5cdCAgICAgICAgICAgICAgICB2YXIgbGFuZUxzdyA9IGxhbmUubG93O1xuXG5cdCAgICAgICAgICAgICAgICAvLyBTd2FwIGVuZGlhblxuXHQgICAgICAgICAgICAgICAgbGFuZU1zdyA9IChcblx0ICAgICAgICAgICAgICAgICAgICAoKChsYW5lTXN3IDw8IDgpICB8IChsYW5lTXN3ID4+PiAyNCkpICYgMHgwMGZmMDBmZikgfFxuXHQgICAgICAgICAgICAgICAgICAgICgoKGxhbmVNc3cgPDwgMjQpIHwgKGxhbmVNc3cgPj4+IDgpKSAgJiAweGZmMDBmZjAwKVxuXHQgICAgICAgICAgICAgICAgKTtcblx0ICAgICAgICAgICAgICAgIGxhbmVMc3cgPSAoXG5cdCAgICAgICAgICAgICAgICAgICAgKCgobGFuZUxzdyA8PCA4KSAgfCAobGFuZUxzdyA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcblx0ICAgICAgICAgICAgICAgICAgICAoKChsYW5lTHN3IDw8IDI0KSB8IChsYW5lTHN3ID4+PiA4KSkgICYgMHhmZjAwZmYwMClcblx0ICAgICAgICAgICAgICAgICk7XG5cblx0ICAgICAgICAgICAgICAgIC8vIFNxdWVlemUgc3RhdGUgdG8gcmV0cmlldmUgaGFzaFxuXHQgICAgICAgICAgICAgICAgaGFzaFdvcmRzLnB1c2gobGFuZUxzdyk7XG5cdCAgICAgICAgICAgICAgICBoYXNoV29yZHMucHVzaChsYW5lTXN3KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIFJldHVybiBmaW5hbCBjb21wdXRlZCBoYXNoXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQoaGFzaFdvcmRzLCBvdXRwdXRMZW5ndGhCeXRlcyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEhhc2hlci5jbG9uZS5jYWxsKHRoaXMpO1xuXG5cdCAgICAgICAgICAgIHZhciBzdGF0ZSA9IGNsb25lLl9zdGF0ZSA9IHRoaXMuX3N0YXRlLnNsaWNlKDApO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI1OyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHN0YXRlW2ldID0gc3RhdGVbaV0uY2xvbmUoKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBjbG9uZTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cblx0ICAgICAqXG5cdCAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICpcblx0ICAgICAqIEBzdGF0aWNcblx0ICAgICAqXG5cdCAgICAgKiBAZXhhbXBsZVxuXHQgICAgICpcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTMoJ21lc3NhZ2UnKTtcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTMod29yZEFycmF5KTtcblx0ICAgICAqL1xuXHQgICAgQy5TSEEzID0gSGFzaGVyLl9jcmVhdGVIZWxwZXIoU0hBMyk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuXHQgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG5cdCAgICAgKlxuXHQgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cblx0ICAgICAqXG5cdCAgICAgKiBAc3RhdGljXG5cdCAgICAgKlxuXHQgICAgICogQGV4YW1wbGVcblx0ICAgICAqXG5cdCAgICAgKiAgICAgdmFyIGhtYWMgPSBDcnlwdG9KUy5IbWFjU0hBMyhtZXNzYWdlLCBrZXkpO1xuXHQgICAgICovXG5cdCAgICBDLkhtYWNTSEEzID0gSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKFNIQTMpO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUy5TSEEzO1xuXG59KSk7IiwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIi4vY29yZVwiKSk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW1wiLi9jb3JlXCJdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0ZmFjdG9yeShyb290LkNyeXB0b0pTKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoQ3J5cHRvSlMpIHtcblxuXHQoZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgQmFzZSA9IENfbGliLkJhc2U7XG5cdCAgICB2YXIgWDMyV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xuXG5cdCAgICAvKipcblx0ICAgICAqIHg2NCBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDX3g2NCA9IEMueDY0ID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogQSA2NC1iaXQgd29yZC5cblx0ICAgICAqL1xuXHQgICAgdmFyIFg2NFdvcmQgPSBDX3g2NC5Xb3JkID0gQmFzZS5leHRlbmQoe1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCA2NC1iaXQgd29yZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoaWdoIFRoZSBoaWdoIDMyIGJpdHMuXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxvdyBUaGUgbG93IDMyIGJpdHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB4NjRXb3JkID0gQ3J5cHRvSlMueDY0LldvcmQuY3JlYXRlKDB4MDAwMTAyMDMsIDB4MDQwNTA2MDcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChoaWdoLCBsb3cpIHtcblx0ICAgICAgICAgICAgdGhpcy5oaWdoID0gaGlnaDtcblx0ICAgICAgICAgICAgdGhpcy5sb3cgPSBsb3c7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQml0d2lzZSBOT1RzIHRoaXMgd29yZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1g2NFdvcmR9IEEgbmV3IHg2NC1Xb3JkIG9iamVjdCBhZnRlciBuZWdhdGluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIG5lZ2F0ZWQgPSB4NjRXb3JkLm5vdCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIC8vIG5vdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyB2YXIgaGlnaCA9IH50aGlzLmhpZ2g7XG5cdCAgICAgICAgICAgIC8vIHZhciBsb3cgPSB+dGhpcy5sb3c7XG5cblx0ICAgICAgICAgICAgLy8gcmV0dXJuIFg2NFdvcmQuY3JlYXRlKGhpZ2gsIGxvdyk7XG5cdCAgICAgICAgLy8gfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEJpdHdpc2UgQU5EcyB0aGlzIHdvcmQgd2l0aCB0aGUgcGFzc2VkIHdvcmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1g2NFdvcmR9IHdvcmQgVGhlIHg2NC1Xb3JkIHRvIEFORCB3aXRoIHRoaXMgd29yZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1g2NFdvcmR9IEEgbmV3IHg2NC1Xb3JkIG9iamVjdCBhZnRlciBBTkRpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBhbmRlZCA9IHg2NFdvcmQuYW5kKGFub3RoZXJYNjRXb3JkKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICAvLyBhbmQ6IGZ1bmN0aW9uICh3b3JkKSB7XG5cdCAgICAgICAgICAgIC8vIHZhciBoaWdoID0gdGhpcy5oaWdoICYgd29yZC5oaWdoO1xuXHQgICAgICAgICAgICAvLyB2YXIgbG93ID0gdGhpcy5sb3cgJiB3b3JkLmxvdztcblxuXHQgICAgICAgICAgICAvLyByZXR1cm4gWDY0V29yZC5jcmVhdGUoaGlnaCwgbG93KTtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQml0d2lzZSBPUnMgdGhpcyB3b3JkIHdpdGggdGhlIHBhc3NlZCB3b3JkLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtYNjRXb3JkfSB3b3JkIFRoZSB4NjQtV29yZCB0byBPUiB3aXRoIHRoaXMgd29yZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1g2NFdvcmR9IEEgbmV3IHg2NC1Xb3JkIG9iamVjdCBhZnRlciBPUmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIG9yZWQgPSB4NjRXb3JkLm9yKGFub3RoZXJYNjRXb3JkKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICAvLyBvcjogZnVuY3Rpb24gKHdvcmQpIHtcblx0ICAgICAgICAgICAgLy8gdmFyIGhpZ2ggPSB0aGlzLmhpZ2ggfCB3b3JkLmhpZ2g7XG5cdCAgICAgICAgICAgIC8vIHZhciBsb3cgPSB0aGlzLmxvdyB8IHdvcmQubG93O1xuXG5cdCAgICAgICAgICAgIC8vIHJldHVybiBYNjRXb3JkLmNyZWF0ZShoaWdoLCBsb3cpO1xuXHQgICAgICAgIC8vIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBCaXR3aXNlIFhPUnMgdGhpcyB3b3JkIHdpdGggdGhlIHBhc3NlZCB3b3JkLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtYNjRXb3JkfSB3b3JkIFRoZSB4NjQtV29yZCB0byBYT1Igd2l0aCB0aGlzIHdvcmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtYNjRXb3JkfSBBIG5ldyB4NjQtV29yZCBvYmplY3QgYWZ0ZXIgWE9SaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgeG9yZWQgPSB4NjRXb3JkLnhvcihhbm90aGVyWDY0V29yZCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgLy8geG9yOiBmdW5jdGlvbiAod29yZCkge1xuXHQgICAgICAgICAgICAvLyB2YXIgaGlnaCA9IHRoaXMuaGlnaCBeIHdvcmQuaGlnaDtcblx0ICAgICAgICAgICAgLy8gdmFyIGxvdyA9IHRoaXMubG93IF4gd29yZC5sb3c7XG5cblx0ICAgICAgICAgICAgLy8gcmV0dXJuIFg2NFdvcmQuY3JlYXRlKGhpZ2gsIGxvdyk7XG5cdCAgICAgICAgLy8gfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFNoaWZ0cyB0aGlzIHdvcmQgbiBiaXRzIHRvIHRoZSBsZWZ0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBiaXRzIHRvIHNoaWZ0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7WDY0V29yZH0gQSBuZXcgeDY0LVdvcmQgb2JqZWN0IGFmdGVyIHNoaWZ0aW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgc2hpZnRlZCA9IHg2NFdvcmQuc2hpZnRMKDI1KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICAvLyBzaGlmdEw6IGZ1bmN0aW9uIChuKSB7XG5cdCAgICAgICAgICAgIC8vIGlmIChuIDwgMzIpIHtcblx0ICAgICAgICAgICAgICAgIC8vIHZhciBoaWdoID0gKHRoaXMuaGlnaCA8PCBuKSB8ICh0aGlzLmxvdyA+Pj4gKDMyIC0gbikpO1xuXHQgICAgICAgICAgICAgICAgLy8gdmFyIGxvdyA9IHRoaXMubG93IDw8IG47XG5cdCAgICAgICAgICAgIC8vIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyB2YXIgaGlnaCA9IHRoaXMubG93IDw8IChuIC0gMzIpO1xuXHQgICAgICAgICAgICAgICAgLy8gdmFyIGxvdyA9IDA7XG5cdCAgICAgICAgICAgIC8vIH1cblxuXHQgICAgICAgICAgICAvLyByZXR1cm4gWDY0V29yZC5jcmVhdGUoaGlnaCwgbG93KTtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogU2hpZnRzIHRoaXMgd29yZCBuIGJpdHMgdG8gdGhlIHJpZ2h0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBiaXRzIHRvIHNoaWZ0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7WDY0V29yZH0gQSBuZXcgeDY0LVdvcmQgb2JqZWN0IGFmdGVyIHNoaWZ0aW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgc2hpZnRlZCA9IHg2NFdvcmQuc2hpZnRSKDcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIC8vIHNoaWZ0UjogZnVuY3Rpb24gKG4pIHtcblx0ICAgICAgICAgICAgLy8gaWYgKG4gPCAzMikge1xuXHQgICAgICAgICAgICAgICAgLy8gdmFyIGxvdyA9ICh0aGlzLmxvdyA+Pj4gbikgfCAodGhpcy5oaWdoIDw8ICgzMiAtIG4pKTtcblx0ICAgICAgICAgICAgICAgIC8vIHZhciBoaWdoID0gdGhpcy5oaWdoID4+PiBuO1xuXHQgICAgICAgICAgICAvLyB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgLy8gdmFyIGxvdyA9IHRoaXMuaGlnaCA+Pj4gKG4gLSAzMik7XG5cdCAgICAgICAgICAgICAgICAvLyB2YXIgaGlnaCA9IDA7XG5cdCAgICAgICAgICAgIC8vIH1cblxuXHQgICAgICAgICAgICAvLyByZXR1cm4gWDY0V29yZC5jcmVhdGUoaGlnaCwgbG93KTtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUm90YXRlcyB0aGlzIHdvcmQgbiBiaXRzIHRvIHRoZSBsZWZ0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBiaXRzIHRvIHJvdGF0ZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1g2NFdvcmR9IEEgbmV3IHg2NC1Xb3JkIG9iamVjdCBhZnRlciByb3RhdGluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHJvdGF0ZWQgPSB4NjRXb3JkLnJvdEwoMjUpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIC8vIHJvdEw6IGZ1bmN0aW9uIChuKSB7XG5cdCAgICAgICAgICAgIC8vIHJldHVybiB0aGlzLnNoaWZ0TChuKS5vcih0aGlzLnNoaWZ0Uig2NCAtIG4pKTtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUm90YXRlcyB0aGlzIHdvcmQgbiBiaXRzIHRvIHRoZSByaWdodC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgYml0cyB0byByb3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtYNjRXb3JkfSBBIG5ldyB4NjQtV29yZCBvYmplY3QgYWZ0ZXIgcm90YXRpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciByb3RhdGVkID0geDY0V29yZC5yb3RSKDcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIC8vIHJvdFI6IGZ1bmN0aW9uIChuKSB7XG5cdCAgICAgICAgICAgIC8vIHJldHVybiB0aGlzLnNoaWZ0UihuKS5vcih0aGlzLnNoaWZ0TCg2NCAtIG4pKTtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQWRkcyB0aGlzIHdvcmQgd2l0aCB0aGUgcGFzc2VkIHdvcmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1g2NFdvcmR9IHdvcmQgVGhlIHg2NC1Xb3JkIHRvIGFkZCB3aXRoIHRoaXMgd29yZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1g2NFdvcmR9IEEgbmV3IHg2NC1Xb3JkIG9iamVjdCBhZnRlciBhZGRpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBhZGRlZCA9IHg2NFdvcmQuYWRkKGFub3RoZXJYNjRXb3JkKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICAvLyBhZGQ6IGZ1bmN0aW9uICh3b3JkKSB7XG5cdCAgICAgICAgICAgIC8vIHZhciBsb3cgPSAodGhpcy5sb3cgKyB3b3JkLmxvdykgfCAwO1xuXHQgICAgICAgICAgICAvLyB2YXIgY2FycnkgPSAobG93ID4+PiAwKSA8ICh0aGlzLmxvdyA+Pj4gMCkgPyAxIDogMDtcblx0ICAgICAgICAgICAgLy8gdmFyIGhpZ2ggPSAodGhpcy5oaWdoICsgd29yZC5oaWdoICsgY2FycnkpIHwgMDtcblxuXHQgICAgICAgICAgICAvLyByZXR1cm4gWDY0V29yZC5jcmVhdGUoaGlnaCwgbG93KTtcblx0ICAgICAgICAvLyB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbiBhcnJheSBvZiA2NC1iaXQgd29yZHMuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtBcnJheX0gd29yZHMgVGhlIGFycmF5IG9mIENyeXB0b0pTLng2NC5Xb3JkIG9iamVjdHMuXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgKi9cblx0ICAgIHZhciBYNjRXb3JkQXJyYXkgPSBDX3g2NC5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIENyeXB0b0pTLng2NC5Xb3JkIG9iamVjdHMuXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZ0J5dGVzIChPcHRpb25hbCkgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGUgd29yZHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy54NjQuV29yZEFycmF5LmNyZWF0ZSgpO1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy54NjQuV29yZEFycmF5LmNyZWF0ZShbXG5cdCAgICAgICAgICogICAgICAgICBDcnlwdG9KUy54NjQuV29yZC5jcmVhdGUoMHgwMDAxMDIwMywgMHgwNDA1MDYwNyksXG5cdCAgICAgICAgICogICAgICAgICBDcnlwdG9KUy54NjQuV29yZC5jcmVhdGUoMHgxODE5MWExYiwgMHgxYzFkMWUxZilcblx0ICAgICAgICAgKiAgICAgXSk7XG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLng2NC5Xb3JkQXJyYXkuY3JlYXRlKFtcblx0ICAgICAgICAgKiAgICAgICAgIENyeXB0b0pTLng2NC5Xb3JkLmNyZWF0ZSgweDAwMDEwMjAzLCAweDA0MDUwNjA3KSxcblx0ICAgICAgICAgKiAgICAgICAgIENyeXB0b0pTLng2NC5Xb3JkLmNyZWF0ZSgweDE4MTkxYTFiLCAweDFjMWQxZTFmKVxuXHQgICAgICAgICAqICAgICBdLCAxMCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKHdvcmRzLCBzaWdCeXRlcykge1xuXHQgICAgICAgICAgICB3b3JkcyA9IHRoaXMud29yZHMgPSB3b3JkcyB8fCBbXTtcblxuXHQgICAgICAgICAgICBpZiAoc2lnQnl0ZXMgIT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gd29yZHMubGVuZ3RoICogODtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyB0aGlzIDY0LWJpdCB3b3JkIGFycmF5IHRvIGEgMzItYml0IHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtDcnlwdG9KUy5saWIuV29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkncyBkYXRhIGFzIGEgMzItYml0IHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB4MzJXb3JkQXJyYXkgPSB4NjRXb3JkQXJyYXkudG9YMzIoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB0b1gzMjogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHg2NFdvcmRzID0gdGhpcy53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHg2NFdvcmRzTGVuZ3RoID0geDY0V29yZHMubGVuZ3RoO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIHgzMldvcmRzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeDY0V29yZHNMZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIHg2NFdvcmQgPSB4NjRXb3Jkc1tpXTtcblx0ICAgICAgICAgICAgICAgIHgzMldvcmRzLnB1c2goeDY0V29yZC5oaWdoKTtcblx0ICAgICAgICAgICAgICAgIHgzMldvcmRzLnB1c2goeDY0V29yZC5sb3cpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIFgzMldvcmRBcnJheS5jcmVhdGUoeDMyV29yZHMsIHRoaXMuc2lnQnl0ZXMpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtYNjRXb3JkQXJyYXl9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0geDY0V29yZEFycmF5LmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXG5cdCAgICAgICAgICAgIC8vIENsb25lIFwid29yZHNcIiBhcnJheVxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2xvbmUgZWFjaCBYNjRXb3JkIG9iamVjdFxuXHQgICAgICAgICAgICB2YXIgd29yZHNMZW5ndGggPSB3b3Jkcy5sZW5ndGg7XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHNMZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaV0gPSB3b3Jkc1tpXS5jbG9uZSgpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9KCkpO1xuXG5cblx0cmV0dXJuIENyeXB0b0pTO1xuXG59KSk7IiwiLyohIGJpZ251bWJlci5qcyB2Mi4wLjcgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvYmlnbnVtYmVyLmpzL0xJQ0VOQ0UgKi9cblxuOyhmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLypcbiAgICAgIGJpZ251bWJlci5qcyB2Mi4wLjdcbiAgICAgIEEgSmF2YVNjcmlwdCBsaWJyYXJ5IGZvciBhcmJpdHJhcnktcHJlY2lzaW9uIGFyaXRobWV0aWMuXG4gICAgICBodHRwczovL2dpdGh1Yi5jb20vTWlrZU1jbC9iaWdudW1iZXIuanNcbiAgICAgIENvcHlyaWdodCAoYykgMjAxNSBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxuICAgICAgTUlUIEV4cGF0IExpY2VuY2VcbiAgICAqL1xuXG5cbiAgICB2YXIgQmlnTnVtYmVyLCBjcnlwdG8sIHBhcnNlTnVtZXJpYyxcbiAgICAgICAgaXNOdW1lcmljID0gL14tPyhcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2ksXG4gICAgICAgIG1hdGhjZWlsID0gTWF0aC5jZWlsLFxuICAgICAgICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgICAgICBub3RCb29sID0gJyBub3QgYSBib29sZWFuIG9yIGJpbmFyeSBkaWdpdCcsXG4gICAgICAgIHJvdW5kaW5nTW9kZSA9ICdyb3VuZGluZyBtb2RlJyxcbiAgICAgICAgdG9vTWFueURpZ2l0cyA9ICdudW1iZXIgdHlwZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0cycsXG4gICAgICAgIEFMUEhBQkVUID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJF8nLFxuICAgICAgICBCQVNFID0gMWUxNCxcbiAgICAgICAgTE9HX0JBU0UgPSAxNCxcbiAgICAgICAgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmYsICAgICAgICAgLy8gMl41MyAtIDFcbiAgICAgICAgLy8gTUFYX0lOVDMyID0gMHg3ZmZmZmZmZiwgICAgICAgICAgICAgICAgICAgLy8gMl4zMSAtIDFcbiAgICAgICAgUE9XU19URU4gPSBbMSwgMTAsIDEwMCwgMWUzLCAxZTQsIDFlNSwgMWU2LCAxZTcsIDFlOCwgMWU5LCAxZTEwLCAxZTExLCAxZTEyLCAxZTEzXSxcbiAgICAgICAgU1FSVF9CQVNFID0gMWU3LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgREVDSU1BTF9QTEFDRVMsIFRPX0VYUF9ORUcsIFRPX0VYUF9QT1MsIE1JTl9FWFAsIE1BWF9FWFAsIGFuZFxuICAgICAgICAgKiB0aGUgYXJndW1lbnRzIHRvIHRvRXhwb25lbnRpYWwsIHRvRml4ZWQsIHRvRm9ybWF0LCBhbmQgdG9QcmVjaXNpb24sIGJleW9uZCB3aGljaCBhblxuICAgICAgICAgKiBleGNlcHRpb24gaXMgdGhyb3duIChpZiBFUlJPUlMgaXMgdHJ1ZSkuXG4gICAgICAgICAqL1xuICAgICAgICBNQVggPSAxRTk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWF9JTlQzMlxuXG5cbiAgICAvKlxuICAgICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgQmlnTnVtYmVyIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFub3RoZXIoY29uZmlnT2JqKSB7XG4gICAgICAgIHZhciBkaXYsXG5cbiAgICAgICAgICAgIC8vIGlkIHRyYWNrcyB0aGUgY2FsbGVyIGZ1bmN0aW9uLCBzbyBpdHMgbmFtZSBjYW4gYmUgaW5jbHVkZWQgaW4gZXJyb3IgbWVzc2FnZXMuXG4gICAgICAgICAgICBpZCA9IDAsXG4gICAgICAgICAgICBQID0gQmlnTnVtYmVyLnByb3RvdHlwZSxcbiAgICAgICAgICAgIE9ORSA9IG5ldyBCaWdOdW1iZXIoMSksXG5cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFRElUQUJMRSBERUZBVUxUUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZXMgYmVsb3cgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIGluY2x1c2l2ZSByYW5nZXMgc3RhdGVkLlxuICAgICAgICAgICAgICogVGhlIHZhbHVlcyBjYW4gYWxzbyBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIEJpZ051bWJlci5jb25maWcuXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIGZvciBvcGVyYXRpb25zIGludm9sdmluZyBkaXZpc2lvbi5cbiAgICAgICAgICAgIERFQ0lNQUxfUExBQ0VTID0gMjAsICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBNQVhcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRoZSByb3VuZGluZyBtb2RlIHVzZWQgd2hlbiByb3VuZGluZyB0byB0aGUgYWJvdmUgZGVjaW1hbCBwbGFjZXMsIGFuZCB3aGVuIHVzaW5nXG4gICAgICAgICAgICAgKiB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkLCB0b0Zvcm1hdCBhbmQgdG9QcmVjaXNpb24sIGFuZCByb3VuZCAoZGVmYXVsdCB2YWx1ZSkuXG4gICAgICAgICAgICAgKiBVUCAgICAgICAgIDAgQXdheSBmcm9tIHplcm8uXG4gICAgICAgICAgICAgKiBET1dOICAgICAgIDEgVG93YXJkcyB6ZXJvLlxuICAgICAgICAgICAgICogQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxuICAgICAgICAgICAgICogRkxPT1IgICAgICAzIFRvd2FyZHMgLUluZmluaXR5LlxuICAgICAgICAgICAgICogSEFMRl9VUCAgICA0IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB1cC5cbiAgICAgICAgICAgICAqIEhBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cbiAgICAgICAgICAgICAqIEhBTEZfRVZFTiAgNiBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyBldmVuIG5laWdoYm91ci5cbiAgICAgICAgICAgICAqIEhBTEZfQ0VJTCAgNyBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyArSW5maW5pdHkuXG4gICAgICAgICAgICAgKiBIQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBST1VORElOR19NT0RFID0gNCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOFxuXG4gICAgICAgICAgICAvLyBFWFBPTkVOVElBTF9BVCA6IFtUT19FWFBfTkVHICwgVE9fRVhQX1BPU11cblxuICAgICAgICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBiZW5lYXRoIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXG4gICAgICAgICAgICAvLyBOdW1iZXIgdHlwZTogLTdcbiAgICAgICAgICAgIFRPX0VYUF9ORUcgPSAtNywgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtTUFYXG5cbiAgICAgICAgICAgIC8vIFRoZSBleHBvbmVudCB2YWx1ZSBhdCBhbmQgYWJvdmUgd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cbiAgICAgICAgICAgIC8vIE51bWJlciB0eXBlOiAyMVxuICAgICAgICAgICAgVE9fRVhQX1BPUyA9IDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxuXG4gICAgICAgICAgICAvLyBSQU5HRSA6IFtNSU5fRVhQLCBNQVhfRVhQXVxuXG4gICAgICAgICAgICAvLyBUaGUgbWluaW11bSBleHBvbmVudCB2YWx1ZSwgYmVuZWF0aCB3aGljaCB1bmRlcmZsb3cgdG8gemVybyBvY2N1cnMuXG4gICAgICAgICAgICAvLyBOdW1iZXIgdHlwZTogLTMyNCAgKDVlLTMyNClcbiAgICAgICAgICAgIE1JTl9FWFAgPSAtMWU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLTEgdG8gLU1BWFxuXG4gICAgICAgICAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxuICAgICAgICAgICAgLy8gTnVtYmVyIHR5cGU6ICAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcbiAgICAgICAgICAgIC8vIEZvciBNQVhfRVhQID4gMWU3LCBlLmcuIG5ldyBCaWdOdW1iZXIoJzFlMTAwMDAwMDAwJykucGx1cygxKSBtYXkgYmUgc2xvdy5cbiAgICAgICAgICAgIE1BWF9FWFAgPSAxZTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhcblxuICAgICAgICAgICAgLy8gV2hldGhlciBCaWdOdW1iZXIgRXJyb3JzIGFyZSBldmVyIHRocm93bi5cbiAgICAgICAgICAgIEVSUk9SUyA9IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZSBvciBmYWxzZVxuXG4gICAgICAgICAgICAvLyBDaGFuZ2UgdG8gaW50VmFsaWRhdG9yTm9FcnJvcnMgaWYgRVJST1JTIGlzIGZhbHNlLlxuICAgICAgICAgICAgaXNWYWxpZEludCA9IGludFZhbGlkYXRvcldpdGhFcnJvcnMsICAgICAvLyBpbnRWYWxpZGF0b3JXaXRoRXJyb3JzL2ludFZhbGlkYXRvck5vRXJyb3JzXG5cbiAgICAgICAgICAgIC8vIFdoZXRoZXIgdG8gdXNlIGNyeXB0b2dyYXBoaWNhbGx5LXNlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24sIGlmIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIENSWVBUTyA9IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZSBvciBmYWxzZVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cbiAgICAgICAgICAgICAqIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxuICAgICAgICAgICAgICogVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBVUCAgICAgICAgMCBUaGUgcmVtYWluZGVyIGlzIHBvc2l0aXZlIGlmIHRoZSBkaXZpZGVuZCBpcyBuZWdhdGl2ZSwgZWxzZSBpcyBuZWdhdGl2ZS5cbiAgICAgICAgICAgICAqIERPV04gICAgICAxIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlkZW5kLlxuICAgICAgICAgICAgICogICAgICAgICAgICAgVGhpcyBtb2R1bG8gbW9kZSBpcyBjb21tb25seSBrbm93biBhcyAndHJ1bmNhdGVkIGRpdmlzaW9uJyBhbmQgaXNcbiAgICAgICAgICAgICAqICAgICAgICAgICAgIGVxdWl2YWxlbnQgdG8gKGEgJSBuKSBpbiBKYXZhU2NyaXB0LlxuICAgICAgICAgICAgICogRkxPT1IgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxuICAgICAgICAgICAgICogSEFMRl9FVkVOIDYgVGhpcyBtb2R1bG8gbW9kZSBpbXBsZW1lbnRzIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXG4gICAgICAgICAgICAgKiBFVUNMSUQgICAgOSBFdWNsaWRpYW4gZGl2aXNpb24uIHEgPSBzaWduKG4pICogZmxvb3IoYSAvIGFicyhuKSkuXG4gICAgICAgICAgICAgKiAgICAgICAgICAgICBUaGUgcmVtYWluZGVyIGlzIGFsd2F5cyBwb3NpdGl2ZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUaGUgdHJ1bmNhdGVkIGRpdmlzaW9uLCBmbG9vcmVkIGRpdmlzaW9uLCBFdWNsaWRpYW4gZGl2aXNpb24gYW5kIElFRUUgNzU0IHJlbWFpbmRlclxuICAgICAgICAgICAgICogbW9kZXMgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi5cbiAgICAgICAgICAgICAqIEFsdGhvdWdoIHRoZSBvdGhlciByb3VuZGluZyBtb2RlcyBjYW4gYWxzbyBiZSB1c2VkLCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgTU9EVUxPX01PREUgPSAxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcblxuICAgICAgICAgICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgcmVzdWx0IG9mIHRoZSB0b1Bvd2VyIG9wZXJhdGlvbi5cbiAgICAgICAgICAgIC8vIElmIFBPV19QUkVDSVNJT04gaXMgMCwgdGhlcmUgd2lsbCBiZSB1bmxpbWl0ZWQgc2lnbmlmaWNhbnQgZGlnaXRzLlxuICAgICAgICAgICAgUE9XX1BSRUNJU0lPTiA9IDEwMCwgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxuXG4gICAgICAgICAgICAvLyBUaGUgZm9ybWF0IHNwZWNpZmljYXRpb24gdXNlZCBieSB0aGUgQmlnTnVtYmVyLnByb3RvdHlwZS50b0Zvcm1hdCBtZXRob2QuXG4gICAgICAgICAgICBGT1JNQVQgPSB7XG4gICAgICAgICAgICAgICAgZGVjaW1hbFNlcGFyYXRvcjogJy4nLFxuICAgICAgICAgICAgICAgIGdyb3VwU2VwYXJhdG9yOiAnLCcsXG4gICAgICAgICAgICAgICAgZ3JvdXBTaXplOiAzLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeUdyb3VwU2l6ZTogMCxcbiAgICAgICAgICAgICAgICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yOiAnXFx4QTAnLCAgICAgIC8vIG5vbi1icmVha2luZyBzcGFjZVxuICAgICAgICAgICAgICAgIGZyYWN0aW9uR3JvdXBTaXplOiAwXG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgICAgIC8vIENPTlNUUlVDVE9SXG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUaGUgQmlnTnVtYmVyIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cbiAgICAgICAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgaW5zdGFuY2Ugb2YgYSBCaWdOdW1iZXIgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBuIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gQSBudW1lcmljIHZhbHVlLlxuICAgICAgICAgKiBbYl0ge251bWJlcn0gVGhlIGJhc2Ugb2Ygbi4gSW50ZWdlciwgMiB0byA2NCBpbmNsdXNpdmUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBCaWdOdW1iZXIoIG4sIGIgKSB7XG4gICAgICAgICAgICB2YXIgYywgZSwgaSwgbnVtLCBsZW4sIHN0cixcbiAgICAgICAgICAgICAgICB4ID0gdGhpcztcblxuICAgICAgICAgICAgLy8gRW5hYmxlIGNvbnN0cnVjdG9yIHVzYWdlIHdpdGhvdXQgbmV3LlxuICAgICAgICAgICAgaWYgKCAhKCB4IGluc3RhbmNlb2YgQmlnTnVtYmVyICkgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyAnQmlnTnVtYmVyKCkgY29uc3RydWN0b3IgY2FsbCB3aXRob3V0IG5ldzoge259J1xuICAgICAgICAgICAgICAgIGlmIChFUlJPUlMpIHJhaXNlKCAyNiwgJ2NvbnN0cnVjdG9yIGNhbGwgd2l0aG91dCBuZXcnLCBuICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIoIG4sIGIgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gJ25ldyBCaWdOdW1iZXIoKSBiYXNlIG5vdCBhbiBpbnRlZ2VyOiB7Yn0nXG4gICAgICAgICAgICAvLyAnbmV3IEJpZ051bWJlcigpIGJhc2Ugb3V0IG9mIHJhbmdlOiB7Yn0nXG4gICAgICAgICAgICBpZiAoIGIgPT0gbnVsbCB8fCAhaXNWYWxpZEludCggYiwgMiwgNjQsIGlkLCAnYmFzZScgKSApIHtcblxuICAgICAgICAgICAgICAgIC8vIER1cGxpY2F0ZS5cbiAgICAgICAgICAgICAgICBpZiAoIG4gaW5zdGFuY2VvZiBCaWdOdW1iZXIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHgucyA9IG4ucztcbiAgICAgICAgICAgICAgICAgICAgeC5lID0gbi5lO1xuICAgICAgICAgICAgICAgICAgICB4LmMgPSAoIG4gPSBuLmMgKSA/IG4uc2xpY2UoKSA6IG47XG4gICAgICAgICAgICAgICAgICAgIGlkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICggKCBudW0gPSB0eXBlb2YgbiA9PSAnbnVtYmVyJyApICYmIG4gKiAwID09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHgucyA9IDEgLyBuIDwgMCA/ICggbiA9IC1uLCAtMSApIDogMTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGYXN0IHBhdGggZm9yIGludGVnZXJzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIG4gPT09IH5+biApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIGUgPSAwLCBpID0gbjsgaSA+PSAxMDsgaSAvPSAxMCwgZSsrICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LmUgPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeC5jID0gW25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyID0gbiArICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWlzTnVtZXJpYy50ZXN0KCBzdHIgPSBuICsgJycgKSApIHJldHVybiBwYXJzZU51bWVyaWMoIHgsIHN0ciwgbnVtICk7XG4gICAgICAgICAgICAgICAgICAgIHgucyA9IHN0ci5jaGFyQ29kZUF0KDApID09PSA0NSA/ICggc3RyID0gc3RyLnNsaWNlKDEpLCAtMSApIDogMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGIgPSBiIHwgMDtcbiAgICAgICAgICAgICAgICBzdHIgPSBuICsgJyc7XG5cbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgcmV0dXJuIHZhbHVlIGlzIHJvdW5kZWQgdG8gREVDSU1BTF9QTEFDRVMgYXMgd2l0aCBvdGhlciBiYXNlcy5cbiAgICAgICAgICAgICAgICAvLyBBbGxvdyBleHBvbmVudGlhbCBub3RhdGlvbiB0byBiZSB1c2VkIHdpdGggYmFzZSAxMCBhcmd1bWVudC5cbiAgICAgICAgICAgICAgICBpZiAoIGIgPT0gMTAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSBuZXcgQmlnTnVtYmVyKCBuIGluc3RhbmNlb2YgQmlnTnVtYmVyID8gbiA6IHN0ciApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm91bmQoIHgsIERFQ0lNQUxfUExBQ0VTICsgeC5lICsgMSwgUk9VTkRJTkdfTU9ERSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEF2b2lkIHBvdGVudGlhbCBpbnRlcnByZXRhdGlvbiBvZiBJbmZpbml0eSBhbmQgTmFOIGFzIGJhc2UgNDQrIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAvLyBBbnkgbnVtYmVyIGluIGV4cG9uZW50aWFsIGZvcm0gd2lsbCBmYWlsIGR1ZSB0byB0aGUgW0VlXVsrLV0uXG4gICAgICAgICAgICAgICAgaWYgKCAoIG51bSA9IHR5cGVvZiBuID09ICdudW1iZXInICkgJiYgbiAqIDAgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgISggbmV3IFJlZ0V4cCggJ14tPycgKyAoIGMgPSAnWycgKyBBTFBIQUJFVC5zbGljZSggMCwgYiApICsgJ10rJyApICtcbiAgICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuJyArIGMgKyAnKT8kJyxiIDwgMzcgPyAnaScgOiAnJyApICkudGVzdChzdHIpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VOdW1lcmljKCB4LCBzdHIsIG51bSwgYiApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgeC5zID0gMSAvIG4gPCAwID8gKCBzdHIgPSBzdHIuc2xpY2UoMSksIC0xICkgOiAxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggRVJST1JTICYmIHN0ci5yZXBsYWNlKCAvXjBcXC4wKnxcXC4vLCAnJyApLmxlbmd0aCA+IDE1ICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAnbmV3IEJpZ051bWJlcigpIG51bWJlciB0eXBlIGhhcyBtb3JlIHRoYW4gMTUgc2lnbmlmaWNhbnQgZGlnaXRzOiB7bn0nXG4gICAgICAgICAgICAgICAgICAgICAgICByYWlzZSggaWQsIHRvb01hbnlEaWdpdHMsIG4gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgbGF0ZXIgY2hlY2sgZm9yIGxlbmd0aCBvbiBjb252ZXJ0ZWQgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAgICBudW0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB4LnMgPSBzdHIuY2hhckNvZGVBdCgwKSA9PT0gNDUgPyAoIHN0ciA9IHN0ci5zbGljZSgxKSwgLTEgKSA6IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RyID0gY29udmVydEJhc2UoIHN0ciwgMTAsIGIsIHgucyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWNpbWFsIHBvaW50P1xuICAgICAgICAgICAgaWYgKCAoIGUgPSBzdHIuaW5kZXhPZignLicpICkgPiAtMSApIHN0ciA9IHN0ci5yZXBsYWNlKCAnLicsICcnICk7XG5cbiAgICAgICAgICAgIC8vIEV4cG9uZW50aWFsIGZvcm0/XG4gICAgICAgICAgICBpZiAoICggaSA9IHN0ci5zZWFyY2goIC9lL2kgKSApID4gMCApIHtcblxuICAgICAgICAgICAgICAgIC8vIERldGVybWluZSBleHBvbmVudC5cbiAgICAgICAgICAgICAgICBpZiAoIGUgPCAwICkgZSA9IGk7XG4gICAgICAgICAgICAgICAgZSArPSArc3RyLnNsaWNlKCBpICsgMSApO1xuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIGkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGUgPCAwICkge1xuXG4gICAgICAgICAgICAgICAgLy8gSW50ZWdlci5cbiAgICAgICAgICAgICAgICBlID0gc3RyLmxlbmd0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKysgKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxuICAgICAgICAgICAgZm9yICggbGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQoLS1sZW4pID09PSA0ODsgKTtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSggaSwgbGVuICsgMSApO1xuXG4gICAgICAgICAgICBpZiAoc3RyKSB7XG4gICAgICAgICAgICAgICAgbGVuID0gc3RyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIC8vIERpc2FsbG93IG51bWJlcnMgd2l0aCBvdmVyIDE1IHNpZ25pZmljYW50IGRpZ2l0cyBpZiBudW1iZXIgdHlwZS5cbiAgICAgICAgICAgICAgICAvLyAnbmV3IEJpZ051bWJlcigpIG51bWJlciB0eXBlIGhhcyBtb3JlIHRoYW4gMTUgc2lnbmlmaWNhbnQgZGlnaXRzOiB7bn0nXG4gICAgICAgICAgICAgICAgaWYgKCBudW0gJiYgRVJST1JTICYmIGxlbiA+IDE1ICkgcmFpc2UoIGlkLCB0b29NYW55RGlnaXRzLCB4LnMgKiBuICk7XG5cbiAgICAgICAgICAgICAgICBlID0gZSAtIGkgLSAxO1xuXG4gICAgICAgICAgICAgICAgIC8vIE92ZXJmbG93P1xuICAgICAgICAgICAgICAgIGlmICggZSA+IE1BWF9FWFAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5maW5pdHkuXG4gICAgICAgICAgICAgICAgICAgIHguYyA9IHguZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyBVbmRlcmZsb3c/XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZSA8IE1JTl9FWFAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gWmVyby5cbiAgICAgICAgICAgICAgICAgICAgeC5jID0gWyB4LmUgPSAwIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeC5lID0gZTtcbiAgICAgICAgICAgICAgICAgICAgeC5jID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVHJhbnNmb3JtIGJhc2VcblxuICAgICAgICAgICAgICAgICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxuICAgICAgICAgICAgICAgICAgICAvLyBpIGlzIHdoZXJlIHRvIHNsaWNlIHN0ciB0byBnZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGNvZWZmaWNpZW50IGFycmF5LlxuICAgICAgICAgICAgICAgICAgICBpID0gKCBlICsgMSApICUgTE9HX0JBU0U7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZSA8IDAgKSBpICs9IExPR19CQVNFO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaSA8IGxlbiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpKSB4LmMucHVzaCggK3N0ci5zbGljZSggMCwgaSApICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIGxlbiAtPSBMT0dfQkFTRTsgaSA8IGxlbjsgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jLnB1c2goICtzdHIuc2xpY2UoIGksIGkgKz0gTE9HX0JBU0UgKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gTE9HX0JBU0UgLSBzdHIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSBsZW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKCA7IGktLTsgc3RyICs9ICcwJyApO1xuICAgICAgICAgICAgICAgICAgICB4LmMucHVzaCggK3N0ciApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBaZXJvLlxuICAgICAgICAgICAgICAgIHguYyA9IFsgeC5lID0gMCBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZCA9IDA7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIENPTlNUUlVDVE9SIFBST1BFUlRJRVNcblxuXG4gICAgICAgIEJpZ051bWJlci5hbm90aGVyID0gYW5vdGhlcjtcblxuICAgICAgICBCaWdOdW1iZXIuUk9VTkRfVVAgPSAwO1xuICAgICAgICBCaWdOdW1iZXIuUk9VTkRfRE9XTiA9IDE7XG4gICAgICAgIEJpZ051bWJlci5ST1VORF9DRUlMID0gMjtcbiAgICAgICAgQmlnTnVtYmVyLlJPVU5EX0ZMT09SID0gMztcbiAgICAgICAgQmlnTnVtYmVyLlJPVU5EX0hBTEZfVVAgPSA0O1xuICAgICAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9ET1dOID0gNTtcbiAgICAgICAgQmlnTnVtYmVyLlJPVU5EX0hBTEZfRVZFTiA9IDY7XG4gICAgICAgIEJpZ051bWJlci5ST1VORF9IQUxGX0NFSUwgPSA3O1xuICAgICAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XG4gICAgICAgIEJpZ051bWJlci5FVUNMSUQgPSA5O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogQ29uZmlndXJlIGluZnJlcXVlbnRseS1jaGFuZ2luZyBsaWJyYXJ5LXdpZGUgc2V0dGluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEFjY2VwdCBhbiBvYmplY3Qgb3IgYW4gYXJndW1lbnQgbGlzdCwgd2l0aCBvbmUgb3IgbWFueSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgb3JcbiAgICAgICAgICogcGFyYW1ldGVycyByZXNwZWN0aXZlbHk6XG4gICAgICAgICAqXG4gICAgICAgICAqICAgREVDSU1BTF9QTEFDRVMgIHtudW1iZXJ9ICBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmVcbiAgICAgICAgICogICBST1VORElOR19NT0RFICAge251bWJlcn0gIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmVcbiAgICAgICAgICogICBFWFBPTkVOVElBTF9BVCAge251bWJlcnxudW1iZXJbXX0gIEludGVnZXIsIC1NQVggdG8gTUFYIGluY2x1c2l2ZSBvclxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ludGVnZXIgLU1BWCB0byAwIGluY2wuLCAwIHRvIE1BWCBpbmNsLl1cbiAgICAgICAgICogICBSQU5HRSAgICAgICAgICAge251bWJlcnxudW1iZXJbXX0gIE5vbi16ZXJvIGludGVnZXIsIC1NQVggdG8gTUFYIGluY2x1c2l2ZSBvclxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ludGVnZXIgLU1BWCB0byAtMSBpbmNsLiwgaW50ZWdlciAxIHRvIE1BWCBpbmNsLl1cbiAgICAgICAgICogICBFUlJPUlMgICAgICAgICAge2Jvb2xlYW58bnVtYmVyfSAgIHRydWUsIGZhbHNlLCAxIG9yIDBcbiAgICAgICAgICogICBDUllQVE8gICAgICAgICAge2Jvb2xlYW58bnVtYmVyfSAgIHRydWUsIGZhbHNlLCAxIG9yIDBcbiAgICAgICAgICogICBNT0RVTE9fTU9ERSAgICAge251bWJlcn0gICAgICAgICAgIDAgdG8gOSBpbmNsdXNpdmVcbiAgICAgICAgICogICBQT1dfUFJFQ0lTSU9OICAge251bWJlcn0gICAgICAgICAgIDAgdG8gTUFYIGluY2x1c2l2ZVxuICAgICAgICAgKiAgIEZPUk1BVCAgICAgICAgICB7b2JqZWN0fSAgICAgICAgICAgU2VlIEJpZ051bWJlci5wcm90b3R5cGUudG9Gb3JtYXRcbiAgICAgICAgICogICAgICBkZWNpbWFsU2VwYXJhdG9yICAgICAgIHtzdHJpbmd9XG4gICAgICAgICAqICAgICAgZ3JvdXBTZXBhcmF0b3IgICAgICAgICB7c3RyaW5nfVxuICAgICAgICAgKiAgICAgIGdyb3VwU2l6ZSAgICAgICAgICAgICAge251bWJlcn1cbiAgICAgICAgICogICAgICBzZWNvbmRhcnlHcm91cFNpemUgICAgIHtudW1iZXJ9XG4gICAgICAgICAqICAgICAgZnJhY3Rpb25Hcm91cFNlcGFyYXRvciB7c3RyaW5nfVxuICAgICAgICAgKiAgICAgIGZyYWN0aW9uR3JvdXBTaXplICAgICAge251bWJlcn1cbiAgICAgICAgICpcbiAgICAgICAgICogKFRoZSB2YWx1ZXMgYXNzaWduZWQgdG8gdGhlIGFib3ZlIEZPUk1BVCBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90IGNoZWNrZWQgZm9yIHZhbGlkaXR5LilcbiAgICAgICAgICpcbiAgICAgICAgICogRS5nLlxuICAgICAgICAgKiBCaWdOdW1iZXIuY29uZmlnKDIwLCA0KSBpcyBlcXVpdmFsZW50IHRvXG4gICAgICAgICAqIEJpZ051bWJlci5jb25maWcoeyBERUNJTUFMX1BMQUNFUyA6IDIwLCBST1VORElOR19NT0RFIDogNCB9KVxuICAgICAgICAgKlxuICAgICAgICAgKiBJZ25vcmUgcHJvcGVydGllcy9wYXJhbWV0ZXJzIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZC5cbiAgICAgICAgICogUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIGN1cnJlbnQgdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgQmlnTnVtYmVyLmNvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2LCBwLFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIHIgPSB7fSxcbiAgICAgICAgICAgICAgICBhID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgIG8gPSBhWzBdLFxuICAgICAgICAgICAgICAgIGhhcyA9IG8gJiYgdHlwZW9mIG8gPT0gJ29iamVjdCdcbiAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKCkgeyBpZiAoIG8uaGFzT3duUHJvcGVydHkocCkgKSByZXR1cm4gKCB2ID0gb1twXSApICE9IG51bGw7IH1cbiAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKCkgeyBpZiAoIGEubGVuZ3RoID4gaSApIHJldHVybiAoIHYgPSBhW2krK10gKSAhPSBudWxsOyB9O1xuXG4gICAgICAgICAgICAvLyBERUNJTUFMX1BMQUNFUyB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgREVDSU1BTF9QTEFDRVMgbm90IGFuIGludGVnZXI6IHt2fSdcbiAgICAgICAgICAgIC8vICdjb25maWcoKSBERUNJTUFMX1BMQUNFUyBvdXQgb2YgcmFuZ2U6IHt2fSdcbiAgICAgICAgICAgIGlmICggaGFzKCBwID0gJ0RFQ0lNQUxfUExBQ0VTJyApICYmIGlzVmFsaWRJbnQoIHYsIDAsIE1BWCwgMiwgcCApICkge1xuICAgICAgICAgICAgICAgIERFQ0lNQUxfUExBQ0VTID0gdiB8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByW3BdID0gREVDSU1BTF9QTEFDRVM7XG5cbiAgICAgICAgICAgIC8vIFJPVU5ESU5HX01PREUge251bWJlcn0gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cbiAgICAgICAgICAgIC8vICdjb25maWcoKSBST1VORElOR19NT0RFIG5vdCBhbiBpbnRlZ2VyOiB7dn0nXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgUk9VTkRJTkdfTU9ERSBvdXQgb2YgcmFuZ2U6IHt2fSdcbiAgICAgICAgICAgIGlmICggaGFzKCBwID0gJ1JPVU5ESU5HX01PREUnICkgJiYgaXNWYWxpZEludCggdiwgMCwgOCwgMiwgcCApICkge1xuICAgICAgICAgICAgICAgIFJPVU5ESU5HX01PREUgPSB2IHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJbcF0gPSBST1VORElOR19NT0RFO1xuXG4gICAgICAgICAgICAvLyBFWFBPTkVOVElBTF9BVCB7bnVtYmVyfG51bWJlcltdfVxuICAgICAgICAgICAgLy8gSW50ZWdlciwgLU1BWCB0byBNQVggaW5jbHVzaXZlIG9yIFtpbnRlZ2VyIC1NQVggdG8gMCBpbmNsdXNpdmUsIDAgdG8gTUFYIGluY2x1c2l2ZV0uXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgRVhQT05FTlRJQUxfQVQgbm90IGFuIGludGVnZXI6IHt2fSdcbiAgICAgICAgICAgIC8vICdjb25maWcoKSBFWFBPTkVOVElBTF9BVCBvdXQgb2YgcmFuZ2U6IHt2fSdcbiAgICAgICAgICAgIGlmICggaGFzKCBwID0gJ0VYUE9ORU5USUFMX0FUJyApICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCBpc0FycmF5KHYpICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGlzVmFsaWRJbnQoIHZbMF0sIC1NQVgsIDAsIDIsIHAgKSAmJiBpc1ZhbGlkSW50KCB2WzFdLCAwLCBNQVgsIDIsIHAgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRPX0VYUF9ORUcgPSB2WzBdIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRPX0VYUF9QT1MgPSB2WzFdIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGlzVmFsaWRJbnQoIHYsIC1NQVgsIE1BWCwgMiwgcCApICkge1xuICAgICAgICAgICAgICAgICAgICBUT19FWFBfTkVHID0gLSggVE9fRVhQX1BPUyA9ICggdiA8IDAgPyAtdiA6IHYgKSB8IDAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByW3BdID0gWyBUT19FWFBfTkVHLCBUT19FWFBfUE9TIF07XG5cbiAgICAgICAgICAgIC8vIFJBTkdFIHtudW1iZXJ8bnVtYmVyW119IE5vbi16ZXJvIGludGVnZXIsIC1NQVggdG8gTUFYIGluY2x1c2l2ZSBvclxuICAgICAgICAgICAgLy8gW2ludGVnZXIgLU1BWCB0byAtMSBpbmNsdXNpdmUsIGludGVnZXIgMSB0byBNQVggaW5jbHVzaXZlXS5cbiAgICAgICAgICAgIC8vICdjb25maWcoKSBSQU5HRSBub3QgYW4gaW50ZWdlcjoge3Z9J1xuICAgICAgICAgICAgLy8gJ2NvbmZpZygpIFJBTkdFIGNhbm5vdCBiZSB6ZXJvOiB7dn0nXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgUkFOR0Ugb3V0IG9mIHJhbmdlOiB7dn0nXG4gICAgICAgICAgICBpZiAoIGhhcyggcCA9ICdSQU5HRScgKSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggaXNBcnJheSh2KSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpc1ZhbGlkSW50KCB2WzBdLCAtTUFYLCAtMSwgMiwgcCApICYmIGlzVmFsaWRJbnQoIHZbMV0sIDEsIE1BWCwgMiwgcCApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTUlOX0VYUCA9IHZbMF0gfCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgTUFYX0VYUCA9IHZbMV0gfCAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggaXNWYWxpZEludCggdiwgLU1BWCwgTUFYLCAyLCBwICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggdiB8IDAgKSBNSU5fRVhQID0gLSggTUFYX0VYUCA9ICggdiA8IDAgPyAtdiA6IHYgKSB8IDAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoRVJST1JTKSByYWlzZSggMiwgcCArICcgY2Fubm90IGJlIHplcm8nLCB2ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcltwXSA9IFsgTUlOX0VYUCwgTUFYX0VYUCBdO1xuXG4gICAgICAgICAgICAvLyBFUlJPUlMge2Jvb2xlYW58bnVtYmVyfSB0cnVlLCBmYWxzZSwgMSBvciAwLlxuICAgICAgICAgICAgLy8gJ2NvbmZpZygpIEVSUk9SUyBub3QgYSBib29sZWFuIG9yIGJpbmFyeSBkaWdpdDoge3Z9J1xuICAgICAgICAgICAgaWYgKCBoYXMoIHAgPSAnRVJST1JTJyApICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB2ID09PSAhIXYgfHwgdiA9PT0gMSB8fCB2ID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICBpZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRJbnQgPSAoIEVSUk9SUyA9ICEhdiApID8gaW50VmFsaWRhdG9yV2l0aEVycm9ycyA6IGludFZhbGlkYXRvck5vRXJyb3JzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoRVJST1JTKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhaXNlKCAyLCBwICsgbm90Qm9vbCwgdiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJbcF0gPSBFUlJPUlM7XG5cbiAgICAgICAgICAgIC8vIENSWVBUTyB7Ym9vbGVhbnxudW1iZXJ9IHRydWUsIGZhbHNlLCAxIG9yIDAuXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgQ1JZUFRPIG5vdCBhIGJvb2xlYW4gb3IgYmluYXJ5IGRpZ2l0OiB7dn0nXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgY3J5cHRvIHVuYXZhaWxhYmxlOiB7Y3J5cHRvfSdcbiAgICAgICAgICAgIGlmICggaGFzKCBwID0gJ0NSWVBUTycgKSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggdiA9PT0gISF2IHx8IHYgPT09IDEgfHwgdiA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgQ1JZUFRPID0gISEoIHYgJiYgY3J5cHRvICYmIHR5cGVvZiBjcnlwdG8gPT0gJ29iamVjdCcgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2ICYmICFDUllQVE8gJiYgRVJST1JTICkgcmFpc2UoIDIsICdjcnlwdG8gdW5hdmFpbGFibGUnLCBjcnlwdG8gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEVSUk9SUykge1xuICAgICAgICAgICAgICAgICAgICByYWlzZSggMiwgcCArIG5vdEJvb2wsIHYgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByW3BdID0gQ1JZUFRPO1xuXG4gICAgICAgICAgICAvLyBNT0RVTE9fTU9ERSB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIDkgaW5jbHVzaXZlLlxuICAgICAgICAgICAgLy8gJ2NvbmZpZygpIE1PRFVMT19NT0RFIG5vdCBhbiBpbnRlZ2VyOiB7dn0nXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgTU9EVUxPX01PREUgb3V0IG9mIHJhbmdlOiB7dn0nXG4gICAgICAgICAgICBpZiAoIGhhcyggcCA9ICdNT0RVTE9fTU9ERScgKSAmJiBpc1ZhbGlkSW50KCB2LCAwLCA5LCAyLCBwICkgKSB7XG4gICAgICAgICAgICAgICAgTU9EVUxPX01PREUgPSB2IHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJbcF0gPSBNT0RVTE9fTU9ERTtcblxuICAgICAgICAgICAgLy8gUE9XX1BSRUNJU0lPTiB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXG4gICAgICAgICAgICAvLyAnY29uZmlnKCkgUE9XX1BSRUNJU0lPTiBub3QgYW4gaW50ZWdlcjoge3Z9J1xuICAgICAgICAgICAgLy8gJ2NvbmZpZygpIFBPV19QUkVDSVNJT04gb3V0IG9mIHJhbmdlOiB7dn0nXG4gICAgICAgICAgICBpZiAoIGhhcyggcCA9ICdQT1dfUFJFQ0lTSU9OJyApICYmIGlzVmFsaWRJbnQoIHYsIDAsIE1BWCwgMiwgcCApICkge1xuICAgICAgICAgICAgICAgIFBPV19QUkVDSVNJT04gPSB2IHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJbcF0gPSBQT1dfUFJFQ0lTSU9OO1xuXG4gICAgICAgICAgICAvLyBGT1JNQVQge29iamVjdH1cbiAgICAgICAgICAgIC8vICdjb25maWcoKSBGT1JNQVQgbm90IGFuIG9iamVjdDoge3Z9J1xuICAgICAgICAgICAgaWYgKCBoYXMoIHAgPSAnRk9STUFUJyApICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdiA9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICAgICAgRk9STUFUID0gdjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEVSUk9SUykge1xuICAgICAgICAgICAgICAgICAgICByYWlzZSggMiwgcCArICcgbm90IGFuIG9iamVjdCcsIHYgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByW3BdID0gRk9STUFUO1xuXG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIEJpZ051bWJlci5tYXggPSBmdW5jdGlvbiAoKSB7IHJldHVybiBtYXhPck1pbiggYXJndW1lbnRzLCBQLmx0ICk7IH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBCaWdOdW1iZXIubWluID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWF4T3JNaW4oIGFyZ3VtZW50cywgUC5ndCApOyB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aXRoIGEgcmFuZG9tIHZhbHVlIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiAwIGFuZCBsZXNzIHRoYW4gMSxcbiAgICAgICAgICogYW5kIHdpdGggZHAsIG9yIERFQ0lNQUxfUExBQ0VTIGlmIGRwIGlzIG9taXR0ZWQsIGRlY2ltYWwgcGxhY2VzIChvciBsZXNzIGlmIHRyYWlsaW5nXG4gICAgICAgICAqIHplcm9zIGFyZSBwcm9kdWNlZCkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogJ3JhbmRvbSgpIGRlY2ltYWwgcGxhY2VzIG5vdCBhbiBpbnRlZ2VyOiB7ZHB9J1xuICAgICAgICAgKiAncmFuZG9tKCkgZGVjaW1hbCBwbGFjZXMgb3V0IG9mIHJhbmdlOiB7ZHB9J1xuICAgICAgICAgKiAncmFuZG9tKCkgY3J5cHRvIHVuYXZhaWxhYmxlOiB7Y3J5cHRvfSdcbiAgICAgICAgICovXG4gICAgICAgIEJpZ051bWJlci5yYW5kb20gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBvdzJfNTMgPSAweDIwMDAwMDAwMDAwMDAwO1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gYSA1MyBiaXQgaW50ZWdlciBuLCB3aGVyZSAwIDw9IG4gPCA5MDA3MTk5MjU0NzQwOTkyLlxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgTWF0aC5yYW5kb20oKSBwcm9kdWNlcyBtb3JlIHRoYW4gMzIgYml0cyBvZiByYW5kb21uZXNzLlxuICAgICAgICAgICAgLy8gSWYgaXQgZG9lcywgYXNzdW1lIGF0IGxlYXN0IDUzIGJpdHMgYXJlIHByb2R1Y2VkLCBvdGhlcndpc2UgYXNzdW1lIGF0IGxlYXN0IDMwIGJpdHMuXG4gICAgICAgICAgICAvLyAweDQwMDAwMDAwIGlzIDJeMzAsIDB4ODAwMDAwIGlzIDJeMjMsIDB4MWZmZmZmIGlzIDJeMjEgLSAxLlxuICAgICAgICAgICAgdmFyIHJhbmRvbTUzYml0SW50ID0gKE1hdGgucmFuZG9tKCkgKiBwb3cyXzUzKSAmIDB4MWZmZmZmXG4gICAgICAgICAgICAgID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWF0aGZsb29yKCBNYXRoLnJhbmRvbSgpICogcG93Ml81MyApOyB9XG4gICAgICAgICAgICAgIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKChNYXRoLnJhbmRvbSgpICogMHg0MDAwMDAwMCB8IDApICogMHg4MDAwMDApICtcbiAgICAgICAgICAgICAgICAgIChNYXRoLnJhbmRvbSgpICogMHg4MDAwMDAgfCAwKTsgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkcCkge1xuICAgICAgICAgICAgICAgIHZhciBhLCBiLCBlLCBrLCB2LFxuICAgICAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICAgICAgYyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICByYW5kID0gbmV3IEJpZ051bWJlcihPTkUpO1xuXG4gICAgICAgICAgICAgICAgZHAgPSBkcCA9PSBudWxsIHx8ICFpc1ZhbGlkSW50KCBkcCwgMCwgTUFYLCAxNCApID8gREVDSU1BTF9QTEFDRVMgOiBkcCB8IDA7XG4gICAgICAgICAgICAgICAgayA9IG1hdGhjZWlsKCBkcCAvIExPR19CQVNFICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQ1JZUFRPKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQnJvd3NlcnMgc3VwcG9ydGluZyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyggbmV3IFVpbnQzMkFycmF5KCBrICo9IDIgKSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCA7IGkgPCBrOyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUzIGJpdHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKChNYXRoLnBvdygyLCAzMikgLSAxKSAqIE1hdGgucG93KDIsIDIxKSkudG9TdHJpbmcoMilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMSAxMTEwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICgoTWF0aC5wb3coMiwgMzIpIC0gMSkgPj4+IDExKS50b1N0cmluZygyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDExMTExIDExMTExMTExIDExMTExMTExXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMHgyMDAwMCBpcyAyXjIxLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBhW2ldICogMHgyMDAwMCArIChhW2kgKyAxXSA+Pj4gMTEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVqZWN0aW9uIHNhbXBsaW5nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgPD0gdiA8IDkwMDcxOTkyNTQ3NDA5OTJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9iYWJpbGl0eSB0aGF0IHYgPj0gOWUxNSwgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA3MTk5MjU0NzQwOTkyIC8gOTAwNzE5OTI1NDc0MDk5MiB+PSAwLjAwMDgsIGkuZS4gMSBpbiAxMjUxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB2ID49IDllMTUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCBuZXcgVWludDMyQXJyYXkoMikgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVtpXSA9IGJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbaSArIDFdID0gYlsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgPD0gdiA8PSA4OTk5OTk5OTk5OTk5OTk5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgPD0gKHYgJSAxZTE0KSA8PSA5OTk5OTk5OTk5OTk5OVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLnB1c2goIHYgJSAxZTE0ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gayAvIDI7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggY3J5cHRvICYmIGNyeXB0by5yYW5kb21CeXRlcyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gY3J5cHRvLnJhbmRvbUJ5dGVzKCBrICo9IDcgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggOyBpIDwgazsgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAweDEwMDAwMDAwMDAwMDAgaXMgMl40OCwgMHgxMDAwMDAwMDAwMCBpcyAyXjQwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMHgxMDAwMDAwMDAgaXMgMl4zMiwgMHgxMDAwMDAwIGlzIDJeMjRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgPD0gdiA8IDkwMDcxOTkyNTQ3NDA5OTJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gKCAoIGFbaV0gJiAzMSApICogMHgxMDAwMDAwMDAwMDAwICkgKyAoIGFbaSArIDFdICogMHgxMDAwMDAwMDAwMCApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIGFbaSArIDJdICogMHgxMDAwMDAwMDAgKSArICggYVtpICsgM10gKiAweDEwMDAwMDAgKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCBhW2kgKyA0XSA8PCAxNiApICsgKCBhW2kgKyA1XSA8PCA4ICkgKyBhW2kgKyA2XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdiA+PSA5ZTE1ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNykuY29weSggYSwgaSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCA8PSAodiAlIDFlMTQpIDw9IDk5OTk5OTk5OTk5OTk5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMucHVzaCggdiAlIDFlMTQgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArPSA3O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBrIC8gNztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChFUlJPUlMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhaXNlKCAxNCwgJ2NyeXB0byB1bmF2YWlsYWJsZScsIGNyeXB0byApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVXNlIE1hdGgucmFuZG9tOiBDUllQVE8gaXMgZmFsc2Ugb3IgY3J5cHRvIGlzIHVuYXZhaWxhYmxlIGFuZCBFUlJPUlMgaXMgZmFsc2UuXG4gICAgICAgICAgICAgICAgaWYgKCFpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICggOyBpIDwgazsgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gcmFuZG9tNTNiaXRJbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdiA8IDllMTUgKSBjW2krK10gPSB2ICUgMWUxNDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGsgPSBjWy0taV07XG4gICAgICAgICAgICAgICAgZHAgJT0gTE9HX0JBU0U7XG5cbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gZHAuXG4gICAgICAgICAgICAgICAgaWYgKCBrICYmIGRwICkge1xuICAgICAgICAgICAgICAgICAgICB2ID0gUE9XU19URU5bTE9HX0JBU0UgLSBkcF07XG4gICAgICAgICAgICAgICAgICAgIGNbaV0gPSBtYXRoZmxvb3IoIGsgLyB2ICkgKiB2O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBlbGVtZW50cyB3aGljaCBhcmUgemVyby5cbiAgICAgICAgICAgICAgICBmb3IgKCA7IGNbaV0gPT09IDA7IGMucG9wKCksIGktLSApO1xuXG4gICAgICAgICAgICAgICAgLy8gWmVybz9cbiAgICAgICAgICAgICAgICBpZiAoIGkgPCAwICkge1xuICAgICAgICAgICAgICAgICAgICBjID0gWyBlID0gMCBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgZWxlbWVudHMgd2hpY2ggYXJlIHplcm8gYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cbiAgICAgICAgICAgICAgICAgICAgZm9yICggZSA9IC0xIDsgY1swXSA9PT0gMDsgYy5zaGlmdCgpLCBlIC09IExPR19CQVNFKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCB0aGUgZGlnaXRzIG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIGMgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MsIGFuZC4uLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKCBpID0gMSwgdiA9IGNbMF07IHYgPj0gMTA7IHYgLz0gMTAsIGkrKyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSBleHBvbmVudCBhY2NvcmRpbmdseS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBpIDwgTE9HX0JBU0UgKSBlIC09IExPR19CQVNFIC0gaTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByYW5kLmUgPSBlO1xuICAgICAgICAgICAgICAgIHJhbmQuYyA9IGM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSgpO1xuXG5cbiAgICAgICAgLy8gUFJJVkFURSBGVU5DVElPTlNcblxuXG4gICAgICAgIC8vIENvbnZlcnQgYSBudW1lcmljIHN0cmluZyBvZiBiYXNlSW4gdG8gYSBudW1lcmljIHN0cmluZyBvZiBiYXNlT3V0LlxuICAgICAgICBmdW5jdGlvbiBjb252ZXJ0QmFzZSggc3RyLCBiYXNlT3V0LCBiYXNlSW4sIHNpZ24gKSB7XG4gICAgICAgICAgICB2YXIgZCwgZSwgaywgciwgeCwgeGMsIHksXG4gICAgICAgICAgICAgICAgaSA9IHN0ci5pbmRleE9mKCAnLicgKSxcbiAgICAgICAgICAgICAgICBkcCA9IERFQ0lNQUxfUExBQ0VTLFxuICAgICAgICAgICAgICAgIHJtID0gUk9VTkRJTkdfTU9ERTtcblxuICAgICAgICAgICAgaWYgKCBiYXNlSW4gPCAzNyApIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAvLyBOb24taW50ZWdlci5cbiAgICAgICAgICAgIGlmICggaSA+PSAwICkge1xuICAgICAgICAgICAgICAgIGsgPSBQT1dfUFJFQ0lTSU9OO1xuXG4gICAgICAgICAgICAgICAgLy8gVW5saW1pdGVkIHByZWNpc2lvbi5cbiAgICAgICAgICAgICAgICBQT1dfUFJFQ0lTSU9OID0gMDtcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSggJy4nLCAnJyApO1xuICAgICAgICAgICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKGJhc2VJbik7XG4gICAgICAgICAgICAgICAgeCA9IHkucG93KCBzdHIubGVuZ3RoIC0gaSApO1xuICAgICAgICAgICAgICAgIFBPV19QUkVDSVNJT04gPSBrO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29udmVydCBzdHIgYXMgaWYgYW4gaW50ZWdlciwgdGhlbiByZXN0b3JlIHRoZSBmcmFjdGlvbiBwYXJ0IGJ5IGRpdmlkaW5nIHRoZVxuICAgICAgICAgICAgICAgIC8vIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlci5cbiAgICAgICAgICAgICAgICB5LmMgPSB0b0Jhc2VPdXQoIHRvRml4ZWRQb2ludCggY29lZmZUb1N0cmluZyggeC5jICksIHguZSApLCAxMCwgYmFzZU91dCApO1xuICAgICAgICAgICAgICAgIHkuZSA9IHkuYy5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIG51bWJlciBhcyBpbnRlZ2VyLlxuICAgICAgICAgICAgeGMgPSB0b0Jhc2VPdXQoIHN0ciwgYmFzZUluLCBiYXNlT3V0ICk7XG4gICAgICAgICAgICBlID0gayA9IHhjLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxuICAgICAgICAgICAgZm9yICggOyB4Y1stLWtdID09IDA7IHhjLnBvcCgpICk7XG4gICAgICAgICAgICBpZiAoICF4Y1swXSApIHJldHVybiAnMCc7XG5cbiAgICAgICAgICAgIGlmICggaSA8IDAgKSB7XG4gICAgICAgICAgICAgICAgLS1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4LmMgPSB4YztcbiAgICAgICAgICAgICAgICB4LmUgPSBlO1xuXG4gICAgICAgICAgICAgICAgLy8gc2lnbiBpcyBuZWVkZWQgZm9yIGNvcnJlY3Qgcm91bmRpbmcuXG4gICAgICAgICAgICAgICAgeC5zID0gc2lnbjtcbiAgICAgICAgICAgICAgICB4ID0gZGl2KCB4LCB5LCBkcCwgcm0sIGJhc2VPdXQgKTtcbiAgICAgICAgICAgICAgICB4YyA9IHguYztcbiAgICAgICAgICAgICAgICByID0geC5yO1xuICAgICAgICAgICAgICAgIGUgPSB4LmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQgPSBlICsgZHAgKyAxO1xuXG4gICAgICAgICAgICAvLyBUaGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IHRvIHRoZSByaWdodCBvZiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cbiAgICAgICAgICAgIGkgPSB4Y1tkXTtcbiAgICAgICAgICAgIGsgPSBiYXNlT3V0IC8gMjtcbiAgICAgICAgICAgIHIgPSByIHx8IGQgPCAwIHx8IHhjW2QgKyAxXSAhPSBudWxsO1xuXG4gICAgICAgICAgICByID0gcm0gPCA0ID8gKCBpICE9IG51bGwgfHwgciApICYmICggcm0gPT0gMCB8fCBybSA9PSAoIHgucyA8IDAgPyAzIDogMiApIClcbiAgICAgICAgICAgICAgICAgICAgICAgOiBpID4gayB8fCBpID09IGsgJiYoIHJtID09IDQgfHwgciB8fCBybSA9PSA2ICYmIHhjW2QgLSAxXSAmIDEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICBybSA9PSAoIHgucyA8IDAgPyA4IDogNyApICk7XG5cbiAgICAgICAgICAgIGlmICggZCA8IDEgfHwgIXhjWzBdICkge1xuXG4gICAgICAgICAgICAgICAgLy8gMV4tZHAgb3IgMC5cbiAgICAgICAgICAgICAgICBzdHIgPSByID8gdG9GaXhlZFBvaW50KCAnMScsIC1kcCApIDogJzAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4Yy5sZW5ndGggPSBkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSb3VuZGluZyB1cCBtYXkgbWVhbiB0aGUgcHJldmlvdXMgZGlnaXQgaGFzIHRvIGJlIHJvdW5kZWQgdXAgYW5kIHNvIG9uLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKCAtLWJhc2VPdXQ7ICsreGNbLS1kXSA+IGJhc2VPdXQ7ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGNbZF0gPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4Yy51bnNoaWZ0KDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxuICAgICAgICAgICAgICAgIGZvciAoIGsgPSB4Yy5sZW5ndGg7ICF4Y1stLWtdOyApO1xuXG4gICAgICAgICAgICAgICAgLy8gRS5nLiBbNCwgMTEsIDE1XSBiZWNvbWVzIDRiZi5cbiAgICAgICAgICAgICAgICBmb3IgKCBpID0gMCwgc3RyID0gJyc7IGkgPD0gazsgc3RyICs9IEFMUEhBQkVULmNoYXJBdCggeGNbaSsrXSApICk7XG4gICAgICAgICAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KCBzdHIsIGUgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGNhbGxlciB3aWxsIGFkZCB0aGUgc2lnbi5cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLiBDYWxsZWQgYnkgZGl2IGFuZCBjb252ZXJ0QmFzZS5cbiAgICAgICAgZGl2ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gQXNzdW1lIG5vbi16ZXJvIHggYW5kIGsuXG4gICAgICAgICAgICBmdW5jdGlvbiBtdWx0aXBseSggeCwgaywgYmFzZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgbSwgdGVtcCwgeGxvLCB4aGksXG4gICAgICAgICAgICAgICAgICAgIGNhcnJ5ID0gMCxcbiAgICAgICAgICAgICAgICAgICAgaSA9IHgubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBrbG8gPSBrICUgU1FSVF9CQVNFLFxuICAgICAgICAgICAgICAgICAgICBraGkgPSBrIC8gU1FSVF9CQVNFIHwgMDtcblxuICAgICAgICAgICAgICAgIGZvciAoIHggPSB4LnNsaWNlKCk7IGktLTsgKSB7XG4gICAgICAgICAgICAgICAgICAgIHhsbyA9IHhbaV0gJSBTUVJUX0JBU0U7XG4gICAgICAgICAgICAgICAgICAgIHhoaSA9IHhbaV0gLyBTUVJUX0JBU0UgfCAwO1xuICAgICAgICAgICAgICAgICAgICBtID0ga2hpICogeGxvICsgeGhpICoga2xvO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wID0ga2xvICogeGxvICsgKCAoIG0gJSBTUVJUX0JBU0UgKSAqIFNRUlRfQkFTRSApICsgY2Fycnk7XG4gICAgICAgICAgICAgICAgICAgIGNhcnJ5ID0gKCB0ZW1wIC8gYmFzZSB8IDAgKSArICggbSAvIFNRUlRfQkFTRSB8IDAgKSArIGtoaSAqIHhoaTtcbiAgICAgICAgICAgICAgICAgICAgeFtpXSA9IHRlbXAgJSBiYXNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjYXJyeSkgeC51bnNoaWZ0KGNhcnJ5KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjb21wYXJlKCBhLCBiLCBhTCwgYkwgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGksIGNtcDtcblxuICAgICAgICAgICAgICAgIGlmICggYUwgIT0gYkwgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNtcCA9IGFMID4gYkwgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKCBpID0gY21wID0gMDsgaSA8IGFMOyBpKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggYVtpXSAhPSBiW2ldICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtcCA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjbXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHN1YnRyYWN0KCBhLCBiLCBhTCwgYmFzZSApIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cbiAgICAgICAgICAgICAgICBmb3IgKCA7IGFMLS07ICkge1xuICAgICAgICAgICAgICAgICAgICBhW2FMXSAtPSBpO1xuICAgICAgICAgICAgICAgICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cbiAgICAgICAgICAgICAgICBmb3IgKCA7ICFhWzBdICYmIGEubGVuZ3RoID4gMTsgYS5zaGlmdCgpICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHg6IGRpdmlkZW5kLCB5OiBkaXZpc29yLlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggeCwgeSwgZHAsIHJtLCBiYXNlICkge1xuICAgICAgICAgICAgICAgIHZhciBjbXAsIGUsIGksIG1vcmUsIG4sIHByb2QsIHByb2RMLCBxLCBxYywgcmVtLCByZW1MLCByZW0wLCB4aSwgeEwsIHljMCxcbiAgICAgICAgICAgICAgICAgICAgeUwsIHl6LFxuICAgICAgICAgICAgICAgICAgICBzID0geC5zID09IHkucyA/IDEgOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgeGMgPSB4LmMsXG4gICAgICAgICAgICAgICAgICAgIHljID0geS5jO1xuXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cbiAgICAgICAgICAgICAgICBpZiAoICF4YyB8fCAheGNbMF0gfHwgIXljIHx8ICF5Y1swXSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIE5hTiwgb3IgYm90aCBJbmZpbml0eSBvciAwLlxuICAgICAgICAgICAgICAgICAgICAgICF4LnMgfHwgIXkucyB8fCAoIHhjID8geWMgJiYgeGNbMF0gPT0geWNbMF0gOiAheWMgKSA/IE5hTiA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiDCsTAgaWYgeCBpcyDCsTAgb3IgeSBpcyDCsUluZmluaXR5LCBvciByZXR1cm4gwrFJbmZpbml0eSBhcyB5IGlzIMKxMC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHhjICYmIHhjWzBdID09IDAgfHwgIXljID8gcyAqIDAgOiBzIC8gMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHEgPSBuZXcgQmlnTnVtYmVyKHMpO1xuICAgICAgICAgICAgICAgIHFjID0gcS5jID0gW107XG4gICAgICAgICAgICAgICAgZSA9IHguZSAtIHkuZTtcbiAgICAgICAgICAgICAgICBzID0gZHAgKyBlICsgMTtcblxuICAgICAgICAgICAgICAgIGlmICggIWJhc2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBCQVNFO1xuICAgICAgICAgICAgICAgICAgICBlID0gYml0Rmxvb3IoIHguZSAvIExPR19CQVNFICkgLSBiaXRGbG9vciggeS5lIC8gTE9HX0JBU0UgKTtcbiAgICAgICAgICAgICAgICAgICAgcyA9IHMgLyBMT0dfQkFTRSB8IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVzdWx0IGV4cG9uZW50IG1heSBiZSBvbmUgbGVzcyB0aGVuIHRoZSBjdXJyZW50IHZhbHVlIG9mIGUuXG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvZWZmaWNpZW50cyBvZiB0aGUgQmlnTnVtYmVycyBmcm9tIGNvbnZlcnRCYXNlIG1heSBoYXZlIHRyYWlsaW5nIHplcm9zLlxuICAgICAgICAgICAgICAgIGZvciAoIGkgPSAwOyB5Y1tpXSA9PSAoIHhjW2ldIHx8IDAgKTsgaSsrICk7XG4gICAgICAgICAgICAgICAgaWYgKCB5Y1tpXSA+ICggeGNbaV0gfHwgMCApICkgZS0tO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzIDwgMCApIHtcbiAgICAgICAgICAgICAgICAgICAgcWMucHVzaCgxKTtcbiAgICAgICAgICAgICAgICAgICAgbW9yZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeEwgPSB4Yy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHlMID0geWMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcyArPSAyO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vcm1hbGlzZSB4YyBhbmQgeWMgc28gaGlnaGVzdCBvcmRlciBkaWdpdCBvZiB5YyBpcyA+PSBiYXNlIC8gMi5cblxuICAgICAgICAgICAgICAgICAgICBuID0gbWF0aGZsb29yKCBiYXNlIC8gKCB5Y1swXSArIDEgKSApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCBuZWNlc3NhcnksIGJ1dCB0byBoYW5kbGUgb2RkIGJhc2VzIHdoZXJlIHljWzBdID09ICggYmFzZSAvIDIgKSAtIDEuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICggbiA+IDEgfHwgbisrID09IDEgJiYgeWNbMF0gPCBiYXNlIC8gMiApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBuID4gMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHljID0gbXVsdGlwbHkoIHljLCBuLCBiYXNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB4YyA9IG11bHRpcGx5KCB4YywgbiwgYmFzZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgeUwgPSB5Yy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB4TCA9IHhjLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHhpID0geUw7XG4gICAgICAgICAgICAgICAgICAgIHJlbSA9IHhjLnNsaWNlKCAwLCB5TCApO1xuICAgICAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgemVyb3MgdG8gbWFrZSByZW1haW5kZXIgYXMgbG9uZyBhcyBkaXZpc29yLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKCA7IHJlbUwgPCB5TDsgcmVtW3JlbUwrK10gPSAwICk7XG4gICAgICAgICAgICAgICAgICAgIHl6ID0geWMuc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgeXoudW5zaGlmdCgwKTtcbiAgICAgICAgICAgICAgICAgICAgeWMwID0geWNbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmICggeWNbMV0gPj0gYmFzZSAvIDIgKSB5YzArKztcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IG5lY2Vzc2FyeSwgYnV0IHRvIHByZXZlbnQgdHJpYWwgZGlnaXQgbiA+IGJhc2UsIHdoZW4gdXNpbmcgYmFzZSAzLlxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGlmICggYmFzZSA9PSAzICYmIHljMCA9PSAxICkgeWMwID0gMSArIDFlLTE1O1xuXG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoIHljLCByZW0sIHlMLCByZW1MICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGNtcCA8IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdHJpYWwgZGlnaXQsIG4uXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW0wID0gcmVtWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggeUwgIT0gcmVtTCApIHJlbTAgPSByZW0wICogYmFzZSArICggcmVtWzFdIHx8IDAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG4gaXMgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuID0gbWF0aGZsb29yKCByZW0wIC8geWMwICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgQWxnb3JpdGhtOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAxLiBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0IChuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAyLiBpZiBwcm9kdWN0ID4gcmVtYWluZGVyOiBwcm9kdWN0IC09IGRpdmlzb3IsIG4tLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAzLiByZW1haW5kZXIgLT0gcHJvZHVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICA0LiBpZiBwcm9kdWN0IHdhcyA8IHJlbWFpbmRlciBhdCAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIDUuIGNvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIDYuIElmIHJlbWFpbmRlciA+IGRpdmlzb3I6IHJlbWFpbmRlciAtPSBkaXZpc29yLCBuKytcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbiA+IDEgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbiBtYXkgYmUgPiBiYXNlIG9ubHkgd2hlbiBiYXNlIGlzIDMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuID49IGJhc2UpIG4gPSBiYXNlIC0gMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kID0gbXVsdGlwbHkoIHljLCBuLCBiYXNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXBhcmUgcHJvZHVjdCBhbmQgcmVtYWluZGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0ID4gcmVtYWluZGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmlhbCBkaWdpdCBuIHRvbyBoaWdoLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuIGlzIDEgdG9vIGhpZ2ggYWJvdXQgNSUgb2YgdGhlIHRpbWUsIGFuZCBpcyBub3Qga25vd24gdG8gaGF2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVyIGJlZW4gbW9yZSB0aGFuIDEgdG9vIGhpZ2guXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICggY29tcGFyZSggcHJvZCwgcmVtLCBwcm9kTCwgcmVtTCApID09IDEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuLS07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSBwcm9kdWN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHJhY3QoIHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHljLCBwcm9kTCwgYmFzZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtcCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG4gaXMgMCBvciAxLCBjbXAgaXMgLTEuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIG4gaXMgMCwgdGhlcmUgaXMgbm8gbmVlZCB0byBjb21wYXJlIHljIGFuZCByZW0gYWdhaW4gYmVsb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIGNoYW5nZSBjbXAgdG8gMSB0byBhdm9pZCBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgbiBpcyAxLCBsZWF2ZSBjbXAgYXMgLTEsIHNvIHljIGFuZCByZW0gYXJlIGNvbXBhcmVkIGFnYWluLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG4gPT0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGl2aXNvciA8IHJlbWFpbmRlciwgc28gbiBtdXN0IGJlIGF0IGxlYXN0IDEuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbXAgPSBuID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2QgPSB5Yy5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcHJvZEwgPCByZW1MICkgcHJvZC51bnNoaWZ0KDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgcHJvZHVjdCBmcm9tIHJlbWFpbmRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0cmFjdCggcmVtLCBwcm9kLCByZW1MLCBiYXNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgcHJvZHVjdCB3YXMgPCByZW1haW5kZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjbXAgPT0gLTEgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCBuZXcgcmVtYWluZGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJpYWwgZGlnaXQgbiB0b28gbG93LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuIGlzIDEgdG9vIGxvdyBhYm91dCA1JSBvZiB0aGUgdGltZSwgYW5kIHZlcnkgcmFyZWx5IDIgdG9vIGxvdy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCBjb21wYXJlKCB5YywgcmVtLCB5TCwgcmVtTCApIDwgMSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4rKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KCByZW0sIHlMIDwgcmVtTCA/IHl6IDogeWMsIHJlbUwsIGJhc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggY21wID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4rKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW0gPSBbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2UgY21wID09PSAxIGFuZCBuIHdpbGwgYmUgMFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIG5leHQgZGlnaXQsIG4sIHRvIHRoZSByZXN1bHQgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgICAgICBxY1tpKytdID0gbjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSByZW1haW5kZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlbVswXSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhjW3hpXSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW0gPSBbIHhjW3hpXSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbUwgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICggKCB4aSsrIDwgeEwgfHwgcmVtWzBdICE9IG51bGwgKSAmJiBzLS0gKTtcblxuICAgICAgICAgICAgICAgICAgICBtb3JlID0gcmVtWzBdICE9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTGVhZGluZyB6ZXJvP1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFxY1swXSApIHFjLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCBiYXNlID09IEJBU0UgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVG8gY2FsY3VsYXRlIHEuZSwgZmlyc3QgZ2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHFjWzBdLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKCBpID0gMSwgcyA9IHFjWzBdOyBzID49IDEwOyBzIC89IDEwLCBpKysgKTtcbiAgICAgICAgICAgICAgICAgICAgcm91bmQoIHEsIGRwICsgKCBxLmUgPSBpICsgZSAqIExPR19CQVNFIC0gMSApICsgMSwgcm0sIG1vcmUgKTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGxlciBpcyBjb252ZXJ0QmFzZS5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBxLmUgPSBlO1xuICAgICAgICAgICAgICAgICAgICBxLnIgPSArbW9yZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIgbiBpbiBmaXhlZC1wb2ludCBvciBleHBvbmVudGlhbFxuICAgICAgICAgKiBub3RhdGlvbiByb3VuZGVkIHRvIHRoZSBzcGVjaWZpZWQgZGVjaW1hbCBwbGFjZXMgb3Igc2lnbmlmaWNhbnQgZGlnaXRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBuIGlzIGEgQmlnTnVtYmVyLlxuICAgICAgICAgKiBpIGlzIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBkaWdpdCByZXF1aXJlZCAoaS5lLiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cCkuXG4gICAgICAgICAqIHJtIGlzIHRoZSByb3VuZGluZyBtb2RlLlxuICAgICAgICAgKiBjYWxsZXIgaXMgY2FsbGVyIGlkOiB0b0V4cG9uZW50aWFsIDE5LCB0b0ZpeGVkIDIwLCB0b0Zvcm1hdCAyMSwgdG9QcmVjaXNpb24gMjQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBmb3JtYXQoIG4sIGksIHJtLCBjYWxsZXIgKSB7XG4gICAgICAgICAgICB2YXIgYzAsIGUsIG5lLCBsZW4sIHN0cjtcblxuICAgICAgICAgICAgcm0gPSBybSAhPSBudWxsICYmIGlzVmFsaWRJbnQoIHJtLCAwLCA4LCBjYWxsZXIsIHJvdW5kaW5nTW9kZSApXG4gICAgICAgICAgICAgID8gcm0gfCAwIDogUk9VTkRJTkdfTU9ERTtcblxuICAgICAgICAgICAgaWYgKCAhbi5jICkgcmV0dXJuIG4udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGMwID0gbi5jWzBdO1xuICAgICAgICAgICAgbmUgPSBuLmU7XG5cbiAgICAgICAgICAgIGlmICggaSA9PSBudWxsICkge1xuICAgICAgICAgICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcoIG4uYyApO1xuICAgICAgICAgICAgICAgIHN0ciA9IGNhbGxlciA9PSAxOSB8fCBjYWxsZXIgPT0gMjQgJiYgbmUgPD0gVE9fRVhQX05FR1xuICAgICAgICAgICAgICAgICAgPyB0b0V4cG9uZW50aWFsKCBzdHIsIG5lIClcbiAgICAgICAgICAgICAgICAgIDogdG9GaXhlZFBvaW50KCBzdHIsIG5lICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4gPSByb3VuZCggbmV3IEJpZ051bWJlcihuKSwgaSwgcm0gKTtcblxuICAgICAgICAgICAgICAgIC8vIG4uZSBtYXkgaGF2ZSBjaGFuZ2VkIGlmIHRoZSB2YWx1ZSB3YXMgcm91bmRlZCB1cC5cbiAgICAgICAgICAgICAgICBlID0gbi5lO1xuXG4gICAgICAgICAgICAgICAgc3RyID0gY29lZmZUb1N0cmluZyggbi5jICk7XG4gICAgICAgICAgICAgICAgbGVuID0gc3RyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIC8vIHRvUHJlY2lzaW9uIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHNcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZpZWQgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIGludGVnZXJcbiAgICAgICAgICAgICAgICAvLyBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBmaXhlZC1wb2ludCBub3RhdGlvbi5cblxuICAgICAgICAgICAgICAgIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uLlxuICAgICAgICAgICAgICAgIGlmICggY2FsbGVyID09IDE5IHx8IGNhbGxlciA9PSAyNCAmJiAoIGkgPD0gZSB8fCBlIDw9IFRPX0VYUF9ORUcgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBlbmQgemVyb3M/XG4gICAgICAgICAgICAgICAgICAgIGZvciAoIDsgbGVuIDwgaTsgc3RyICs9ICcwJywgbGVuKysgKTtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gdG9FeHBvbmVudGlhbCggc3RyLCBlICk7XG5cbiAgICAgICAgICAgICAgICAvLyBGaXhlZC1wb2ludCBub3RhdGlvbi5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpIC09IG5lO1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSB0b0ZpeGVkUG9pbnQoIHN0ciwgZSApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB6ZXJvcz9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlICsgMSA+IGxlbiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggLS1pID4gMCApIGZvciAoIHN0ciArPSAnLic7IGktLTsgc3RyICs9ICcwJyApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBlIC0gbGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGUgKyAxID09IGxlbiApIHN0ciArPSAnLic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggOyBpLS07IHN0ciArPSAnMCcgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG4ucyA8IDAgJiYgYzAgPyAnLScgKyBzdHIgOiBzdHI7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIEhhbmRsZSBCaWdOdW1iZXIubWF4IGFuZCBCaWdOdW1iZXIubWluLlxuICAgICAgICBmdW5jdGlvbiBtYXhPck1pbiggYXJncywgbWV0aG9kICkge1xuICAgICAgICAgICAgdmFyIG0sIG4sXG4gICAgICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgICAgIGlmICggaXNBcnJheSggYXJnc1swXSApICkgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICBtID0gbmV3IEJpZ051bWJlciggYXJnc1swXSApO1xuXG4gICAgICAgICAgICBmb3IgKCA7ICsraSA8IGFyZ3MubGVuZ3RoOyApIHtcbiAgICAgICAgICAgICAgICBuID0gbmV3IEJpZ051bWJlciggYXJnc1tpXSApO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgYW55IG51bWJlciBpcyBOYU4sIHJldHVybiBOYU4uXG4gICAgICAgICAgICAgICAgaWYgKCAhbi5zICkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggbWV0aG9kLmNhbGwoIG0sIG4gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgbiBpcyBhbiBpbnRlZ2VyIGluIHJhbmdlLCBvdGhlcndpc2UgdGhyb3cuXG4gICAgICAgICAqIFVzZSBmb3IgYXJndW1lbnQgdmFsaWRhdGlvbiB3aGVuIEVSUk9SUyBpcyB0cnVlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW50VmFsaWRhdG9yV2l0aEVycm9ycyggbiwgbWluLCBtYXgsIGNhbGxlciwgbmFtZSApIHtcbiAgICAgICAgICAgIGlmICggbiA8IG1pbiB8fCBuID4gbWF4IHx8IG4gIT0gdHJ1bmNhdGUobikgKSB7XG4gICAgICAgICAgICAgICAgcmFpc2UoIGNhbGxlciwgKCBuYW1lIHx8ICdkZWNpbWFsIHBsYWNlcycgKSArXG4gICAgICAgICAgICAgICAgICAoIG4gPCBtaW4gfHwgbiA+IG1heCA/ICcgb3V0IG9mIHJhbmdlJyA6ICcgbm90IGFuIGludGVnZXInICksIG4gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFN0cmlwIHRyYWlsaW5nIHplcm9zLCBjYWxjdWxhdGUgYmFzZSAxMCBleHBvbmVudCBhbmQgY2hlY2sgYWdhaW5zdCBNSU5fRVhQIGFuZCBNQVhfRVhQLlxuICAgICAgICAgKiBDYWxsZWQgYnkgbWludXMsIHBsdXMgYW5kIHRpbWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbm9ybWFsaXNlKCBuLCBjLCBlICkge1xuICAgICAgICAgICAgdmFyIGkgPSAxLFxuICAgICAgICAgICAgICAgIGogPSBjLmxlbmd0aDtcblxuICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cbiAgICAgICAgICAgIGZvciAoIDsgIWNbLS1qXTsgYy5wb3AoKSApO1xuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGJhc2UgMTAgZXhwb25lbnQuIEZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBjWzBdLlxuICAgICAgICAgICAgZm9yICggaiA9IGNbMF07IGogPj0gMTA7IGogLz0gMTAsIGkrKyApO1xuXG4gICAgICAgICAgICAvLyBPdmVyZmxvdz9cbiAgICAgICAgICAgIGlmICggKCBlID0gaSArIGUgKiBMT0dfQkFTRSAtIDEgKSA+IE1BWF9FWFAgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBJbmZpbml0eS5cbiAgICAgICAgICAgICAgICBuLmMgPSBuLmUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBVbmRlcmZsb3c/XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBlIDwgTUlOX0VYUCApIHtcblxuICAgICAgICAgICAgICAgIC8vIFplcm8uXG4gICAgICAgICAgICAgICAgbi5jID0gWyBuLmUgPSAwIF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4uZSA9IGU7XG4gICAgICAgICAgICAgICAgbi5jID0gYztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIEhhbmRsZSB2YWx1ZXMgdGhhdCBmYWlsIHRoZSB2YWxpZGl0eSB0ZXN0IGluIEJpZ051bWJlci5cbiAgICAgICAgcGFyc2VOdW1lcmljID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBiYXNlUHJlZml4ID0gL14oLT8pMChbeGJvXSkvaSxcbiAgICAgICAgICAgICAgICBkb3RBZnRlciA9IC9eKFteLl0rKVxcLiQvLFxuICAgICAgICAgICAgICAgIGRvdEJlZm9yZSA9IC9eXFwuKFteLl0rKSQvLFxuICAgICAgICAgICAgICAgIGlzSW5maW5pdHlPck5hTiA9IC9eLT8oSW5maW5pdHl8TmFOKSQvLFxuICAgICAgICAgICAgICAgIHdoaXRlc3BhY2VPclBsdXMgPSAvXlxccypcXCt8Xlxccyt8XFxzKyQvZztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggeCwgc3RyLCBudW0sIGIgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2UsXG4gICAgICAgICAgICAgICAgICAgIHMgPSBudW0gPyBzdHIgOiBzdHIucmVwbGFjZSggd2hpdGVzcGFjZU9yUGx1cywgJycgKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vIGV4Y2VwdGlvbiBvbiDCsUluZmluaXR5IG9yIE5hTi5cbiAgICAgICAgICAgICAgICBpZiAoIGlzSW5maW5pdHlPck5hTi50ZXN0KHMpICkge1xuICAgICAgICAgICAgICAgICAgICB4LnMgPSBpc05hTihzKSA/IG51bGwgOiBzIDwgMCA/IC0xIDogMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFudW0gKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pXG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gcy5yZXBsYWNlKCBiYXNlUHJlZml4LCBmdW5jdGlvbiAoIG0sIHAxLCBwMiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gKCBwMiA9IHAyLnRvTG93ZXJDYXNlKCkgKSA9PSAneCcgPyAxNiA6IHAyID09ICdiJyA/IDIgOiA4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhYiB8fCBiID09IGJhc2UgPyBwMSA6IG07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gYjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEUuZy4gJzEuJyB0byAnMScsICcuMScgdG8gJzAuMSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzID0gcy5yZXBsYWNlKCBkb3RBZnRlciwgJyQxJyApLnJlcGxhY2UoIGRvdEJlZm9yZSwgJzAuJDEnICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc3RyICE9IHMgKSByZXR1cm4gbmV3IEJpZ051bWJlciggcywgYmFzZSApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gJ25ldyBCaWdOdW1iZXIoKSBub3QgYSBudW1iZXI6IHtufSdcbiAgICAgICAgICAgICAgICAgICAgLy8gJ25ldyBCaWdOdW1iZXIoKSBub3QgYSBiYXNlIHtifSBudW1iZXI6IHtufSdcbiAgICAgICAgICAgICAgICAgICAgaWYgKEVSUk9SUykgcmFpc2UoIGlkLCAnbm90IGEnICsgKCBiID8gJyBiYXNlICcgKyBiIDogJycgKSArICcgbnVtYmVyJywgc3RyICk7XG4gICAgICAgICAgICAgICAgICAgIHgucyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cblxuICAgICAgICAvLyBUaHJvdyBhIEJpZ051bWJlciBFcnJvci5cbiAgICAgICAgZnVuY3Rpb24gcmFpc2UoIGNhbGxlciwgbXNnLCB2YWwgKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoIFtcbiAgICAgICAgICAgICAgICAnbmV3IEJpZ051bWJlcicsICAgICAvLyAwXG4gICAgICAgICAgICAgICAgJ2NtcCcsICAgICAgICAgICAgICAgLy8gMVxuICAgICAgICAgICAgICAgICdjb25maWcnLCAgICAgICAgICAgIC8vIDJcbiAgICAgICAgICAgICAgICAnZGl2JywgICAgICAgICAgICAgICAvLyAzXG4gICAgICAgICAgICAgICAgJ2RpdlRvSW50JywgICAgICAgICAgLy8gNFxuICAgICAgICAgICAgICAgICdlcScsICAgICAgICAgICAgICAgIC8vIDVcbiAgICAgICAgICAgICAgICAnZ3QnLCAgICAgICAgICAgICAgICAvLyA2XG4gICAgICAgICAgICAgICAgJ2d0ZScsICAgICAgICAgICAgICAgLy8gN1xuICAgICAgICAgICAgICAgICdsdCcsICAgICAgICAgICAgICAgIC8vIDhcbiAgICAgICAgICAgICAgICAnbHRlJywgICAgICAgICAgICAgICAvLyA5XG4gICAgICAgICAgICAgICAgJ21pbnVzJywgICAgICAgICAgICAgLy8gMTBcbiAgICAgICAgICAgICAgICAnbW9kJywgICAgICAgICAgICAgICAvLyAxMVxuICAgICAgICAgICAgICAgICdwbHVzJywgICAgICAgICAgICAgIC8vIDEyXG4gICAgICAgICAgICAgICAgJ3ByZWNpc2lvbicsICAgICAgICAgLy8gMTNcbiAgICAgICAgICAgICAgICAncmFuZG9tJywgICAgICAgICAgICAvLyAxNFxuICAgICAgICAgICAgICAgICdyb3VuZCcsICAgICAgICAgICAgIC8vIDE1XG4gICAgICAgICAgICAgICAgJ3NoaWZ0JywgICAgICAgICAgICAgLy8gMTZcbiAgICAgICAgICAgICAgICAndGltZXMnLCAgICAgICAgICAgICAvLyAxN1xuICAgICAgICAgICAgICAgICd0b0RpZ2l0cycsICAgICAgICAgIC8vIDE4XG4gICAgICAgICAgICAgICAgJ3RvRXhwb25lbnRpYWwnLCAgICAgLy8gMTlcbiAgICAgICAgICAgICAgICAndG9GaXhlZCcsICAgICAgICAgICAvLyAyMFxuICAgICAgICAgICAgICAgICd0b0Zvcm1hdCcsICAgICAgICAgIC8vIDIxXG4gICAgICAgICAgICAgICAgJ3RvRnJhY3Rpb24nLCAgICAgICAgLy8gMjJcbiAgICAgICAgICAgICAgICAncG93JywgICAgICAgICAgICAgICAvLyAyM1xuICAgICAgICAgICAgICAgICd0b1ByZWNpc2lvbicsICAgICAgIC8vIDI0XG4gICAgICAgICAgICAgICAgJ3RvU3RyaW5nJywgICAgICAgICAgLy8gMjVcbiAgICAgICAgICAgICAgICAnQmlnTnVtYmVyJyAgICAgICAgICAvLyAyNlxuICAgICAgICAgICAgXVtjYWxsZXJdICsgJygpICcgKyBtc2cgKyAnOiAnICsgdmFsICk7XG5cbiAgICAgICAgICAgIGVycm9yLm5hbWUgPSAnQmlnTnVtYmVyIEVycm9yJztcbiAgICAgICAgICAgIGlkID0gMDtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSb3VuZCB4IHRvIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxuICAgICAgICAgKiBJZiByIGlzIHRydXRoeSwgaXQgaXMga25vd24gdGhhdCB0aGVyZSBhcmUgbW9yZSBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcm91bmQoIHgsIHNkLCBybSwgciApIHtcbiAgICAgICAgICAgIHZhciBkLCBpLCBqLCBrLCBuLCBuaSwgcmQsXG4gICAgICAgICAgICAgICAgeGMgPSB4LmMsXG4gICAgICAgICAgICAgICAgcG93czEwID0gUE9XU19URU47XG5cbiAgICAgICAgICAgIC8vIGlmIHggaXMgbm90IEluZmluaXR5IG9yIE5hTi4uLlxuICAgICAgICAgICAgaWYgKHhjKSB7XG5cbiAgICAgICAgICAgICAgICAvLyByZCBpcyB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxuICAgICAgICAgICAgICAgIC8vIG4gaXMgYSBiYXNlIDFlMTQgbnVtYmVyLCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgb2YgYXJyYXkgeC5jIGNvbnRhaW5pbmcgcmQuXG4gICAgICAgICAgICAgICAgLy8gbmkgaXMgdGhlIGluZGV4IG9mIG4gd2l0aGluIHguYy5cbiAgICAgICAgICAgICAgICAvLyBkIGlzIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIG4uXG4gICAgICAgICAgICAgICAgLy8gaSBpcyB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4gaW5jbHVkaW5nIGxlYWRpbmcgemVyb3MuXG4gICAgICAgICAgICAgICAgLy8gaiBpcyB0aGUgYWN0dWFsIGluZGV4IG9mIHJkIHdpdGhpbiBuIChpZiA8IDAsIHJkIGlzIGEgbGVhZGluZyB6ZXJvKS5cbiAgICAgICAgICAgICAgICBvdXQ6IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoIGQgPSAxLCBrID0geGNbMF07IGsgPj0gMTA7IGsgLz0gMTAsIGQrKyApO1xuICAgICAgICAgICAgICAgICAgICBpID0gc2QgLSBkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdCBpcyBpbiB0aGUgZmlyc3QgZWxlbWVudCBvZiB4Yy4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIGkgPCAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBMT0dfQkFTRTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSBzZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSB4Y1sgbmkgPSAwIF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiBuLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmQgPSBuIC8gcG93czEwWyBkIC0gaiAtIDEgXSAlIDEwIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5pID0gbWF0aGNlaWwoICggaSArIDEgKSAvIExPR19CQVNFICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggbmkgPj0geGMubGVuZ3RoICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZWVkZWQgYnkgc3FydC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggOyB4Yy5sZW5ndGggPD0gbmk7IHhjLnB1c2goMCkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbiA9IHJkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBrID0geGNbbmldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIG4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggZCA9IDE7IGsgPj0gMTA7IGsgLz0gMTAsIGQrKyApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpICU9IExPR19CQVNFO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gbiwgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4gaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIG4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmQgPSBqIDwgMCA/IDAgOiBuIC8gcG93czEwWyBkIC0gaiAtIDEgXSAlIDEwIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHIgPSByIHx8IHNkIDwgMCB8fFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFyZSB0aGVyZSBhbnkgbm9uLXplcm8gZGlnaXRzIGFmdGVyIHRoZSByb3VuZGluZyBkaWdpdD9cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGV4cHJlc3Npb24gIG4gJSBwb3dzMTBbIGQgLSBqIC0gMSBdICByZXR1cm5zIGFsbCBkaWdpdHMgb2YgbiB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICAgICAgLy8gb2YgdGhlIGRpZ2l0IGF0IGosIGUuZy4gaWYgbiBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb24gZ2l2ZXMgNzE0LlxuICAgICAgICAgICAgICAgICAgICAgIHhjW25pICsgMV0gIT0gbnVsbCB8fCAoIGogPCAwID8gbiA6IG4gJSBwb3dzMTBbIGQgLSBqIC0gMSBdICk7XG5cbiAgICAgICAgICAgICAgICAgICAgciA9IHJtIDwgNFxuICAgICAgICAgICAgICAgICAgICAgID8gKCByZCB8fCByICkgJiYgKCBybSA9PSAwIHx8IHJtID09ICggeC5zIDwgMCA/IDMgOiAyICkgKVxuICAgICAgICAgICAgICAgICAgICAgIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKCBybSA9PSA0IHx8IHIgfHwgcm0gPT0gNiAmJlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBkaWdpdCB0byB0aGUgbGVmdCBvZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgb2RkLlxuICAgICAgICAgICAgICAgICAgICAgICAgKCAoIGkgPiAwID8gaiA+IDAgPyBuIC8gcG93czEwWyBkIC0gaiBdIDogMCA6IHhjW25pIC0gMV0gKSAlIDEwICkgJiAxIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJtID09ICggeC5zIDwgMCA/IDggOiA3ICkgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHNkIDwgMSB8fCAheGNbMF0gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4Yy5sZW5ndGggPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBzZCB0byBkZWNpbWFsIHBsYWNlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4Y1swXSA9IHBvd3MxMFsgc2QgJSBMT0dfQkFTRSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguZSA9IC1zZCB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFplcm8uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGNbMF0gPSB4LmUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBleGNlc3MgZGlnaXRzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIGkgPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhjLmxlbmd0aCA9IG5pO1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBuaS0tO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgeGMubGVuZ3RoID0gbmkgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IHBvd3MxMFsgTE9HX0JBU0UgLSBpIF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEUuZy4gNTY3MDAgYmVjb21lcyA1NjAwMCBpZiA3IGlzIHRoZSByb3VuZGluZyBkaWdpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiBuLlxuICAgICAgICAgICAgICAgICAgICAgICAgeGNbbmldID0gaiA+IDAgPyBtYXRoZmxvb3IoIG4gLyBwb3dzMTBbIGQgLSBqIF0gJSBwb3dzMTBbal0gKSAqIGsgOiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUm91bmQgdXA/XG4gICAgICAgICAgICAgICAgICAgIGlmIChyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIDsgOyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBkaWdpdCB0byBiZSByb3VuZGVkIHVwIGlzIGluIHRoZSBmaXJzdCBlbGVtZW50IG9mIHhjLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBuaSA9PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgbGVuZ3RoIG9mIHhjWzBdIGJlZm9yZSBrIGlzIGFkZGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCBpID0gMSwgaiA9IHhjWzBdOyBqID49IDEwOyBqIC89IDEwLCBpKysgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IHhjWzBdICs9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoIGsgPSAxOyBqID49IDEwOyBqIC89IDEwLCBrKysgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBpICE9IGsgdGhlIGxlbmd0aCBoYXMgaW5jcmVhc2VkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGkgIT0gayApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguZSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB4Y1swXSA9PSBCQVNFICkgeGNbMF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGNbbmldICs9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggeGNbbmldICE9IEJBU0UgKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGNbbmktLV0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoIGkgPSB4Yy5sZW5ndGg7IHhjWy0taV0gPT09IDA7IHhjLnBvcCgpICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gT3ZlcmZsb3c/IEluZmluaXR5LlxuICAgICAgICAgICAgICAgIGlmICggeC5lID4gTUFYX0VYUCApIHtcbiAgICAgICAgICAgICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIC8vIFVuZGVyZmxvdz8gWmVyby5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB4LmUgPCBNSU5fRVhQICkge1xuICAgICAgICAgICAgICAgICAgICB4LmMgPSBbIHguZSA9IDAgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBQUk9UT1RZUEUvSU5TVEFOQ0UgTUVUSE9EU1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIuXG4gICAgICAgICAqL1xuICAgICAgICBQLmFic29sdXRlVmFsdWUgPSBQLmFicyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB4ID0gbmV3IEJpZ051bWJlcih0aGlzKTtcbiAgICAgICAgICAgIGlmICggeC5zIDwgMCApIHgucyA9IDE7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSB3aG9sZVxuICAgICAgICAgKiBudW1iZXIgaW4gdGhlIGRpcmVjdGlvbiBvZiBJbmZpbml0eS5cbiAgICAgICAgICovXG4gICAgICAgIFAuY2VpbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZCggbmV3IEJpZ051bWJlcih0aGlzKSwgdGhpcy5lICsgMSwgMiApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuXG4gICAgICAgICAqIDEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxuICAgICAgICAgKiAtMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXG4gICAgICAgICAqIDAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLFxuICAgICAgICAgKiBvciBudWxsIGlmIHRoZSB2YWx1ZSBvZiBlaXRoZXIgaXMgTmFOLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5jb21wYXJlZFRvID0gUC5jbXAgPSBmdW5jdGlvbiAoIHksIGIgKSB7XG4gICAgICAgICAgICBpZCA9IDE7XG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZSggdGhpcywgbmV3IEJpZ051bWJlciggeSwgYiApICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsIG9yIG51bGwgaWYgdGhlIHZhbHVlXG4gICAgICAgICAqIG9mIHRoaXMgQmlnTnVtYmVyIGlzIMKxSW5maW5pdHkgb3IgTmFOLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuLCB2LFxuICAgICAgICAgICAgICAgIGMgPSB0aGlzLmM7XG5cbiAgICAgICAgICAgIGlmICggIWMgKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIG4gPSAoICggdiA9IGMubGVuZ3RoIC0gMSApIC0gYml0Rmxvb3IoIHRoaXMuZSAvIExPR19CQVNFICkgKSAqIExPR19CQVNFO1xuXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IG51bWJlci5cbiAgICAgICAgICAgIGlmICggdiA9IGNbdl0gKSBmb3IgKCA7IHYgJSAxMCA9PSAwOyB2IC89IDEwLCBuLS0gKTtcbiAgICAgICAgICAgIGlmICggbiA8IDAgKSBuID0gMDtcblxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgbiAvIDAgPSBJXG4gICAgICAgICAqICBuIC8gTiA9IE5cbiAgICAgICAgICogIG4gLyBJID0gMFxuICAgICAgICAgKiAgMCAvIG4gPSAwXG4gICAgICAgICAqICAwIC8gMCA9IE5cbiAgICAgICAgICogIDAgLyBOID0gTlxuICAgICAgICAgKiAgMCAvIEkgPSAwXG4gICAgICAgICAqICBOIC8gbiA9IE5cbiAgICAgICAgICogIE4gLyAwID0gTlxuICAgICAgICAgKiAgTiAvIE4gPSBOXG4gICAgICAgICAqICBOIC8gSSA9IE5cbiAgICAgICAgICogIEkgLyBuID0gSVxuICAgICAgICAgKiAgSSAvIDAgPSBJXG4gICAgICAgICAqICBJIC8gTiA9IE5cbiAgICAgICAgICogIEkgLyBJID0gTlxuICAgICAgICAgKlxuICAgICAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBkaXZpZGVkIGJ5IHRoZSB2YWx1ZSBvZlxuICAgICAgICAgKiBCaWdOdW1iZXIoeSwgYiksIHJvdW5kZWQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZCBST1VORElOR19NT0RFLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICggeSwgYiApIHtcbiAgICAgICAgICAgIGlkID0gMztcbiAgICAgICAgICAgIHJldHVybiBkaXYoIHRoaXMsIG5ldyBCaWdOdW1iZXIoIHksIGIgKSwgREVDSU1BTF9QTEFDRVMsIFJPVU5ESU5HX01PREUgKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIGludGVnZXIgcGFydCBvZiBkaXZpZGluZyB0aGUgdmFsdWUgb2YgdGhpc1xuICAgICAgICAgKiBCaWdOdW1iZXIgYnkgdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKS5cbiAgICAgICAgICovXG4gICAgICAgIFAuZGl2aWRlZFRvSW50ZWdlckJ5ID0gUC5kaXZUb0ludCA9IGZ1bmN0aW9uICggeSwgYiApIHtcbiAgICAgICAgICAgIGlkID0gNDtcbiAgICAgICAgICAgIHJldHVybiBkaXYoIHRoaXMsIG5ldyBCaWdOdW1iZXIoIHksIGIgKSwgMCwgMSApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXG4gICAgICAgICAqIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5lcXVhbHMgPSBQLmVxID0gZnVuY3Rpb24gKCB5LCBiICkge1xuICAgICAgICAgICAgaWQgPSA1O1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmUoIHRoaXMsIG5ldyBCaWdOdW1iZXIoIHksIGIgKSApID09PSAwO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcm91bmRlZCB0byBhIHdob2xlXG4gICAgICAgICAqIG51bWJlciBpbiB0aGUgZGlyZWN0aW9uIG9mIC1JbmZpbml0eS5cbiAgICAgICAgICovXG4gICAgICAgIFAuZmxvb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcm91bmQoIG5ldyBCaWdOdW1iZXIodGhpcyksIHRoaXMuZSArIDEsIDMgKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKSxcbiAgICAgICAgICogb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBQLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICggeSwgYiApIHtcbiAgICAgICAgICAgIGlkID0gNjtcbiAgICAgICAgICAgIHJldHVybiBjb21wYXJlKCB0aGlzLCBuZXcgQmlnTnVtYmVyKCB5LCBiICkgKSA+IDA7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxuICAgICAgICAgKiBCaWdOdW1iZXIoeSwgYiksIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5ncmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKCB5LCBiICkge1xuICAgICAgICAgICAgaWQgPSA3O1xuICAgICAgICAgICAgcmV0dXJuICggYiA9IGNvbXBhcmUoIHRoaXMsIG5ldyBCaWdOdW1iZXIoIHksIGIgKSApICkgPT09IDEgfHwgYiA9PT0gMDtcblxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBQLmlzRmluaXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5jO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGFuIGludGVnZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBQLmlzSW50ZWdlciA9IFAuaXNJbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLmMgJiYgYml0Rmxvb3IoIHRoaXMuZSAvIExPR19CQVNFICkgPiB0aGlzLmMubGVuZ3RoIC0gMjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBOYU4sIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5pc05hTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAgICAgICAgICovXG4gICAgICAgIFAuaXNOZWdhdGl2ZSA9IFAuaXNOZWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zIDwgMDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAgICAgICAgICovXG4gICAgICAgIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5jICYmIHRoaXMuY1swXSA9PSAwO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxuICAgICAgICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cbiAgICAgICAgICovXG4gICAgICAgIFAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKCB5LCBiICkge1xuICAgICAgICAgICAgaWQgPSA4O1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmUoIHRoaXMsIG5ldyBCaWdOdW1iZXIoIHksIGIgKSApIDwgMDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mXG4gICAgICAgICAqIEJpZ051bWJlcih5LCBiKSwgb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBQLmxlc3NUaGFuT3JFcXVhbFRvID0gUC5sdGUgPSBmdW5jdGlvbiAoIHksIGIgKSB7XG4gICAgICAgICAgICBpZCA9IDk7XG4gICAgICAgICAgICByZXR1cm4gKCBiID0gY29tcGFyZSggdGhpcywgbmV3IEJpZ051bWJlciggeSwgYiApICkgKSA9PT0gLTEgfHwgYiA9PT0gMDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBuIC0gMCA9IG5cbiAgICAgICAgICogIG4gLSBOID0gTlxuICAgICAgICAgKiAgbiAtIEkgPSAtSVxuICAgICAgICAgKiAgMCAtIG4gPSAtblxuICAgICAgICAgKiAgMCAtIDAgPSAwXG4gICAgICAgICAqICAwIC0gTiA9IE5cbiAgICAgICAgICogIDAgLSBJID0gLUlcbiAgICAgICAgICogIE4gLSBuID0gTlxuICAgICAgICAgKiAgTiAtIDAgPSBOXG4gICAgICAgICAqICBOIC0gTiA9IE5cbiAgICAgICAgICogIE4gLSBJID0gTlxuICAgICAgICAgKiAgSSAtIG4gPSBJXG4gICAgICAgICAqICBJIC0gMCA9IElcbiAgICAgICAgICogIEkgLSBOID0gTlxuICAgICAgICAgKiAgSSAtIEkgPSBOXG4gICAgICAgICAqXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG1pbnVzIHRoZSB2YWx1ZSBvZlxuICAgICAgICAgKiBCaWdOdW1iZXIoeSwgYikuXG4gICAgICAgICAqL1xuICAgICAgICBQLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoIHksIGIgKSB7XG4gICAgICAgICAgICB2YXIgaSwgaiwgdCwgeExUeSxcbiAgICAgICAgICAgICAgICB4ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBhID0geC5zO1xuXG4gICAgICAgICAgICBpZCA9IDEwO1xuICAgICAgICAgICAgeSA9IG5ldyBCaWdOdW1iZXIoIHksIGIgKTtcbiAgICAgICAgICAgIGIgPSB5LnM7XG5cbiAgICAgICAgICAgIC8vIEVpdGhlciBOYU4/XG4gICAgICAgICAgICBpZiAoICFhIHx8ICFiICkgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcblxuICAgICAgICAgICAgLy8gU2lnbnMgZGlmZmVyP1xuICAgICAgICAgICAgaWYgKCBhICE9IGIgKSB7XG4gICAgICAgICAgICAgICAgeS5zID0gLWI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgucGx1cyh5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXG4gICAgICAgICAgICAgICAgeWUgPSB5LmUgLyBMT0dfQkFTRSxcbiAgICAgICAgICAgICAgICB4YyA9IHguYyxcbiAgICAgICAgICAgICAgICB5YyA9IHkuYztcblxuICAgICAgICAgICAgaWYgKCAheGUgfHwgIXllICkge1xuXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIEluZmluaXR5P1xuICAgICAgICAgICAgICAgIGlmICggIXhjIHx8ICF5YyApIHJldHVybiB4YyA/ICggeS5zID0gLWIsIHkgKSA6IG5ldyBCaWdOdW1iZXIoIHljID8geCA6IE5hTiApO1xuXG4gICAgICAgICAgICAgICAgLy8gRWl0aGVyIHplcm8/XG4gICAgICAgICAgICAgICAgaWYgKCAheGNbMF0gfHwgIXljWzBdICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiB5IGlmIHkgaXMgbm9uLXplcm8sIHggaWYgeCBpcyBub24temVybywgb3IgemVybyBpZiBib3RoIGFyZSB6ZXJvLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWNbMF0gPyAoIHkucyA9IC1iLCB5ICkgOiBuZXcgQmlnTnVtYmVyKCB4Y1swXSA/IHggOlxuXG4gICAgICAgICAgICAgICAgICAgICAgLy8gSUVFRSA3NTQgKDIwMDgpIDYuMzogbiAtIG4gPSAtMCB3aGVuIHJvdW5kaW5nIHRvIC1JbmZpbml0eVxuICAgICAgICAgICAgICAgICAgICAgIFJPVU5ESU5HX01PREUgPT0gMyA/IC0wIDogMCApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGUgPSBiaXRGbG9vcih4ZSk7XG4gICAgICAgICAgICB5ZSA9IGJpdEZsb29yKHllKTtcbiAgICAgICAgICAgIHhjID0geGMuc2xpY2UoKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxuICAgICAgICAgICAgaWYgKCBhID0geGUgLSB5ZSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggeExUeSA9IGEgPCAwICkge1xuICAgICAgICAgICAgICAgICAgICBhID0gLWE7XG4gICAgICAgICAgICAgICAgICAgIHQgPSB4YztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB5ZSA9IHhlO1xuICAgICAgICAgICAgICAgICAgICB0ID0geWM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdC5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cbiAgICAgICAgICAgICAgICBmb3IgKCBiID0gYTsgYi0tOyB0LnB1c2goMCkgKTtcbiAgICAgICAgICAgICAgICB0LnJldmVyc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBFeHBvbmVudHMgZXF1YWwuIENoZWNrIGRpZ2l0IGJ5IGRpZ2l0LlxuICAgICAgICAgICAgICAgIGogPSAoIHhMVHkgPSAoIGEgPSB4Yy5sZW5ndGggKSA8ICggYiA9IHljLmxlbmd0aCApICkgPyBhIDogYjtcblxuICAgICAgICAgICAgICAgIGZvciAoIGEgPSBiID0gMDsgYiA8IGo7IGIrKyApIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHhjW2JdICE9IHljW2JdICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8geCA8IHk/IFBvaW50IHhjIHRvIHRoZSBhcnJheSBvZiB0aGUgYmlnZ2VyIG51bWJlci5cbiAgICAgICAgICAgIGlmICh4TFR5KSB0ID0geGMsIHhjID0geWMsIHljID0gdCwgeS5zID0gLXkucztcblxuICAgICAgICAgICAgYiA9ICggaiA9IHljLmxlbmd0aCApIC0gKCBpID0geGMubGVuZ3RoICk7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCB6ZXJvcyB0byB4YyBpZiBzaG9ydGVyLlxuICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBhZGQgemVyb3MgdG8geWMgaWYgc2hvcnRlciBhcyBzdWJ0cmFjdCBvbmx5IG5lZWRzIHRvIHN0YXJ0IGF0IHljLmxlbmd0aC5cbiAgICAgICAgICAgIGlmICggYiA+IDAgKSBmb3IgKCA7IGItLTsgeGNbaSsrXSA9IDAgKTtcbiAgICAgICAgICAgIGIgPSBCQVNFIC0gMTtcblxuICAgICAgICAgICAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cbiAgICAgICAgICAgIGZvciAoIDsgaiA+IGE7ICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB4Y1stLWpdIDwgeWNbal0gKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoIGkgPSBqOyBpICYmICF4Y1stLWldOyB4Y1tpXSA9IGIgKTtcbiAgICAgICAgICAgICAgICAgICAgLS14Y1tpXTtcbiAgICAgICAgICAgICAgICAgICAgeGNbal0gKz0gQkFTRTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4Y1tqXSAtPSB5Y1tqXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cbiAgICAgICAgICAgIGZvciAoIDsgeGNbMF0gPT0gMDsgeGMuc2hpZnQoKSwgLS15ZSApO1xuXG4gICAgICAgICAgICAvLyBaZXJvP1xuICAgICAgICAgICAgaWYgKCAheGNbMF0gKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBGb2xsb3dpbmcgSUVFRSA3NTQgKDIwMDgpIDYuMyxcbiAgICAgICAgICAgICAgICAvLyBuIC0gbiA9ICswICBidXQgIG4gLSBuID0gLTAgIHdoZW4gcm91bmRpbmcgdG93YXJkcyAtSW5maW5pdHkuXG4gICAgICAgICAgICAgICAgeS5zID0gUk9VTkRJTkdfTU9ERSA9PSAzID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIHkuYyA9IFsgeS5lID0gMCBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciBJbmZpbml0eSBhcyAreCAtICt5ICE9IEluZmluaXR5ICYmIC14IC0gLXkgIT0gSW5maW5pdHlcbiAgICAgICAgICAgIC8vIGZvciBmaW5pdGUgeCBhbmQgeS5cbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpc2UoIHksIHhjLCB5ZSApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogICBuICUgMCA9ICBOXG4gICAgICAgICAqICAgbiAlIE4gPSAgTlxuICAgICAgICAgKiAgIG4gJSBJID0gIG5cbiAgICAgICAgICogICAwICUgbiA9ICAwXG4gICAgICAgICAqICAtMCAlIG4gPSAtMFxuICAgICAgICAgKiAgIDAgJSAwID0gIE5cbiAgICAgICAgICogICAwICUgTiA9ICBOXG4gICAgICAgICAqICAgMCAlIEkgPSAgMFxuICAgICAgICAgKiAgIE4gJSBuID0gIE5cbiAgICAgICAgICogICBOICUgMCA9ICBOXG4gICAgICAgICAqICAgTiAlIE4gPSAgTlxuICAgICAgICAgKiAgIE4gJSBJID0gIE5cbiAgICAgICAgICogICBJICUgbiA9ICBOXG4gICAgICAgICAqICAgSSAlIDAgPSAgTlxuICAgICAgICAgKiAgIEkgJSBOID0gIE5cbiAgICAgICAgICogICBJICUgSSA9ICBOXG4gICAgICAgICAqXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG1vZHVsbyB0aGUgdmFsdWUgb2ZcbiAgICAgICAgICogQmlnTnVtYmVyKHksIGIpLiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mIE1PRFVMT19NT0RFLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICggeSwgYiApIHtcbiAgICAgICAgICAgIHZhciBxLCBzLFxuICAgICAgICAgICAgICAgIHggPSB0aGlzO1xuXG4gICAgICAgICAgICBpZCA9IDExO1xuICAgICAgICAgICAgeSA9IG5ldyBCaWdOdW1iZXIoIHksIGIgKTtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIEluZmluaXR5IG9yIE5hTiwgb3IgeSBpcyBOYU4gb3IgemVyby5cbiAgICAgICAgICAgIGlmICggIXguYyB8fCAheS5zIHx8IHkuYyAmJiAheS5jWzBdICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKE5hTik7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiB4IGlmIHkgaXMgSW5maW5pdHkgb3IgeCBpcyB6ZXJvLlxuICAgICAgICAgICAgfSBlbHNlIGlmICggIXkuYyB8fCB4LmMgJiYgIXguY1swXSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcih4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBNT0RVTE9fTU9ERSA9PSA5ICkge1xuXG4gICAgICAgICAgICAgICAgLy8gRXVjbGlkaWFuIGRpdmlzaW9uOiBxID0gc2lnbih5KSAqIGZsb29yKHggLyBhYnMoeSkpXG4gICAgICAgICAgICAgICAgLy8gciA9IHggLSBxeSAgICB3aGVyZSAgMCA8PSByIDwgYWJzKHkpXG4gICAgICAgICAgICAgICAgcyA9IHkucztcbiAgICAgICAgICAgICAgICB5LnMgPSAxO1xuICAgICAgICAgICAgICAgIHEgPSBkaXYoIHgsIHksIDAsIDMgKTtcbiAgICAgICAgICAgICAgICB5LnMgPSBzO1xuICAgICAgICAgICAgICAgIHEucyAqPSBzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxID0gZGl2KCB4LCB5LCAwLCBNT0RVTE9fTU9ERSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geC5taW51cyggcS50aW1lcyh5KSApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbmVnYXRlZCxcbiAgICAgICAgICogaS5lLiBtdWx0aXBsaWVkIGJ5IC0xLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgeCA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XG4gICAgICAgICAgICB4LnMgPSAteC5zIHx8IG51bGw7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICBuICsgMCA9IG5cbiAgICAgICAgICogIG4gKyBOID0gTlxuICAgICAgICAgKiAgbiArIEkgPSBJXG4gICAgICAgICAqICAwICsgbiA9IG5cbiAgICAgICAgICogIDAgKyAwID0gMFxuICAgICAgICAgKiAgMCArIE4gPSBOXG4gICAgICAgICAqICAwICsgSSA9IElcbiAgICAgICAgICogIE4gKyBuID0gTlxuICAgICAgICAgKiAgTiArIDAgPSBOXG4gICAgICAgICAqICBOICsgTiA9IE5cbiAgICAgICAgICogIE4gKyBJID0gTlxuICAgICAgICAgKiAgSSArIG4gPSBJXG4gICAgICAgICAqICBJICsgMCA9IElcbiAgICAgICAgICogIEkgKyBOID0gTlxuICAgICAgICAgKiAgSSArIEkgPSBJXG4gICAgICAgICAqXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHBsdXMgdGhlIHZhbHVlIG9mXG4gICAgICAgICAqIEJpZ051bWJlcih5LCBiKS5cbiAgICAgICAgICovXG4gICAgICAgIFAucGx1cyA9IFAuYWRkID0gZnVuY3Rpb24gKCB5LCBiICkge1xuICAgICAgICAgICAgdmFyIHQsXG4gICAgICAgICAgICAgICAgeCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYSA9IHgucztcblxuICAgICAgICAgICAgaWQgPSAxMjtcbiAgICAgICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKCB5LCBiICk7XG4gICAgICAgICAgICBiID0geS5zO1xuXG4gICAgICAgICAgICAvLyBFaXRoZXIgTmFOP1xuICAgICAgICAgICAgaWYgKCAhYSB8fCAhYiApIHJldHVybiBuZXcgQmlnTnVtYmVyKE5hTik7XG5cbiAgICAgICAgICAgIC8vIFNpZ25zIGRpZmZlcj9cbiAgICAgICAgICAgICBpZiAoIGEgIT0gYiApIHtcbiAgICAgICAgICAgICAgICB5LnMgPSAtYjtcbiAgICAgICAgICAgICAgICByZXR1cm4geC5taW51cyh5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXG4gICAgICAgICAgICAgICAgeWUgPSB5LmUgLyBMT0dfQkFTRSxcbiAgICAgICAgICAgICAgICB4YyA9IHguYyxcbiAgICAgICAgICAgICAgICB5YyA9IHkuYztcblxuICAgICAgICAgICAgaWYgKCAheGUgfHwgIXllICkge1xuXG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIMKxSW5maW5pdHkuXG4gICAgICAgICAgICAgICAgaWYgKCAheGMgfHwgIXljICkgcmV0dXJuIG5ldyBCaWdOdW1iZXIoIGEgLyAwICk7XG5cbiAgICAgICAgICAgICAgICAvLyBFaXRoZXIgemVybz9cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cbiAgICAgICAgICAgICAgICBpZiAoICF4Y1swXSB8fCAheWNbMF0gKSByZXR1cm4geWNbMF0gPyB5IDogbmV3IEJpZ051bWJlciggeGNbMF0gPyB4IDogYSAqIDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGUgPSBiaXRGbG9vcih4ZSk7XG4gICAgICAgICAgICB5ZSA9IGJpdEZsb29yKHllKTtcbiAgICAgICAgICAgIHhjID0geGMuc2xpY2UoKTtcblxuICAgICAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuIEZhc3RlciB0byB1c2UgcmV2ZXJzZSB0aGVuIGRvIHVuc2hpZnRzLlxuICAgICAgICAgICAgaWYgKCBhID0geGUgLSB5ZSApIHtcbiAgICAgICAgICAgICAgICBpZiAoIGEgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICB5ZSA9IHhlO1xuICAgICAgICAgICAgICAgICAgICB0ID0geWM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICB0ID0geGM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdC5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgZm9yICggOyBhLS07IHQucHVzaCgwKSApO1xuICAgICAgICAgICAgICAgIHQucmV2ZXJzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhID0geGMubGVuZ3RoO1xuICAgICAgICAgICAgYiA9IHljLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gUG9pbnQgeGMgdG8gdGhlIGxvbmdlciBhcnJheSwgYW5kIGIgdG8gdGhlIHNob3J0ZXIgbGVuZ3RoLlxuICAgICAgICAgICAgaWYgKCBhIC0gYiA8IDAgKSB0ID0geWMsIHljID0geGMsIHhjID0gdCwgYiA9IGE7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHljLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhjIGNhbiBiZSBpZ25vcmVkLlxuICAgICAgICAgICAgZm9yICggYSA9IDA7IGI7ICkge1xuICAgICAgICAgICAgICAgIGEgPSAoIHhjWy0tYl0gPSB4Y1tiXSArIHljW2JdICsgYSApIC8gQkFTRSB8IDA7XG4gICAgICAgICAgICAgICAgeGNbYl0gJT0gQkFTRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgICAgICB4Yy51bnNoaWZ0KGEpO1xuICAgICAgICAgICAgICAgICsreWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHplcm8sIGFzICt4ICsgK3kgIT0gMCAmJiAteCArIC15ICE9IDBcbiAgICAgICAgICAgIC8vIHllID0gTUFYX0VYUCArIDEgcG9zc2libGVcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpc2UoIHksIHhjLCB5ZSApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlci5cbiAgICAgICAgICpcbiAgICAgICAgICogW3pdIHtib29sZWFufG51bWJlcn0gV2hldGhlciB0byBjb3VudCBpbnRlZ2VyLXBhcnQgdHJhaWxpbmcgemVyb3M6IHRydWUsIGZhbHNlLCAxIG9yIDAuXG4gICAgICAgICAqL1xuICAgICAgICBQLnByZWNpc2lvbiA9IFAuc2QgPSBmdW5jdGlvbiAoeikge1xuICAgICAgICAgICAgdmFyIG4sIHYsXG4gICAgICAgICAgICAgICAgeCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYyA9IHguYztcblxuICAgICAgICAgICAgLy8gJ3ByZWNpc2lvbigpIGFyZ3VtZW50IG5vdCBhIGJvb2xlYW4gb3IgYmluYXJ5IGRpZ2l0OiB7en0nXG4gICAgICAgICAgICBpZiAoIHogIT0gbnVsbCAmJiB6ICE9PSAhIXogJiYgeiAhPT0gMSAmJiB6ICE9PSAwICkge1xuICAgICAgICAgICAgICAgIGlmIChFUlJPUlMpIHJhaXNlKCAxMywgJ2FyZ3VtZW50JyArIG5vdEJvb2wsIHogKTtcbiAgICAgICAgICAgICAgICBpZiAoIHogIT0gISF6ICkgeiA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggIWMgKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHYgPSBjLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBuID0gdiAqIExPR19CQVNFICsgMTtcblxuICAgICAgICAgICAgaWYgKCB2ID0gY1t2XSApIHtcblxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3QgZWxlbWVudC5cbiAgICAgICAgICAgICAgICBmb3IgKCA7IHYgJSAxMCA9PSAwOyB2IC89IDEwLCBuLS0gKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICAgICAgICAgICAgICBmb3IgKCB2ID0gY1swXTsgdiA+PSAxMDsgdiAvPSAxMCwgbisrICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggeiAmJiB4LmUgKyAxID4gbiApIG4gPSB4LmUgKyAxO1xuXG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mXG4gICAgICAgICAqIGRwIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yIHRvIDAgYW5kIFJPVU5ESU5HX01PREUgcmVzcGVjdGl2ZWx5IGlmXG4gICAgICAgICAqIG9taXR0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cbiAgICAgICAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAncm91bmQoKSBkZWNpbWFsIHBsYWNlcyBvdXQgb2YgcmFuZ2U6IHtkcH0nXG4gICAgICAgICAqICdyb3VuZCgpIGRlY2ltYWwgcGxhY2VzIG5vdCBhbiBpbnRlZ2VyOiB7ZHB9J1xuICAgICAgICAgKiAncm91bmQoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xuICAgICAgICAgKiAncm91bmQoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcbiAgICAgICAgICovXG4gICAgICAgIFAucm91bmQgPSBmdW5jdGlvbiAoIGRwLCBybSApIHtcbiAgICAgICAgICAgIHZhciBuID0gbmV3IEJpZ051bWJlcih0aGlzKTtcblxuICAgICAgICAgICAgaWYgKCBkcCA9PSBudWxsIHx8IGlzVmFsaWRJbnQoIGRwLCAwLCBNQVgsIDE1ICkgKSB7XG4gICAgICAgICAgICAgICAgcm91bmQoIG4sIH5+ZHAgKyB0aGlzLmUgKyAxLCBybSA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAhaXNWYWxpZEludCggcm0sIDAsIDgsIDE1LCByb3VuZGluZ01vZGUgKSA/IFJPVU5ESU5HX01PREUgOiBybSB8IDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBzaGlmdGVkIGJ5IGsgcGxhY2VzXG4gICAgICAgICAqIChwb3dlcnMgb2YgMTApLiBTaGlmdCB0byB0aGUgcmlnaHQgaWYgbiA+IDAsIGFuZCB0byB0aGUgbGVmdCBpZiBuIDwgMC5cbiAgICAgICAgICpcbiAgICAgICAgICogayB7bnVtYmVyfSBJbnRlZ2VyLCAtTUFYX1NBRkVfSU5URUdFUiB0byBNQVhfU0FGRV9JTlRFR0VSIGluY2x1c2l2ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgayBpcyBvdXQgb2YgcmFuZ2UgYW5kIEVSUk9SUyBpcyBmYWxzZSwgdGhlIHJlc3VsdCB3aWxsIGJlIMKxMCBpZiBrIDwgMCwgb3IgwrFJbmZpbml0eVxuICAgICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqICdzaGlmdCgpIGFyZ3VtZW50IG5vdCBhbiBpbnRlZ2VyOiB7a30nXG4gICAgICAgICAqICdzaGlmdCgpIGFyZ3VtZW50IG91dCBvZiByYW5nZToge2t9J1xuICAgICAgICAgKi9cbiAgICAgICAgUC5zaGlmdCA9IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZEludCggaywgLU1BWF9TQUZFX0lOVEVHRVIsIE1BWF9TQUZFX0lOVEVHRVIsIDE2LCAnYXJndW1lbnQnIClcblxuICAgICAgICAgICAgICAvLyBrIDwgMWUrMjEsIG9yIHRydW5jYXRlKGspIHdpbGwgcHJvZHVjZSBleHBvbmVudGlhbCBub3RhdGlvbi5cbiAgICAgICAgICAgICAgPyBuLnRpbWVzKCAnMWUnICsgdHJ1bmNhdGUoaykgKVxuICAgICAgICAgICAgICA6IG5ldyBCaWdOdW1iZXIoIG4uYyAmJiBuLmNbMF0gJiYgKCBrIDwgLU1BWF9TQUZFX0lOVEVHRVIgfHwgayA+IE1BWF9TQUZFX0lOVEVHRVIgKVxuICAgICAgICAgICAgICAgID8gbi5zICogKCBrIDwgMCA/IDAgOiAxIC8gMCApXG4gICAgICAgICAgICAgICAgOiBuICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiAgc3FydCgtbikgPSAgTlxuICAgICAgICAgKiAgc3FydCggTikgPSAgTlxuICAgICAgICAgKiAgc3FydCgtSSkgPSAgTlxuICAgICAgICAgKiAgc3FydCggSSkgPSAgSVxuICAgICAgICAgKiAgc3FydCggMCkgPSAgMFxuICAgICAgICAgKiAgc3FydCgtMCkgPSAtMFxuICAgICAgICAgKlxuICAgICAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsXG4gICAgICAgICAqIHJvdW5kZWQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZCBST1VORElOR19NT0RFLlxuICAgICAgICAgKi9cbiAgICAgICAgUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG0sIG4sIHIsIHJlcCwgdCxcbiAgICAgICAgICAgICAgICB4ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBjID0geC5jLFxuICAgICAgICAgICAgICAgIHMgPSB4LnMsXG4gICAgICAgICAgICAgICAgZSA9IHguZSxcbiAgICAgICAgICAgICAgICBkcCA9IERFQ0lNQUxfUExBQ0VTICsgNCxcbiAgICAgICAgICAgICAgICBoYWxmID0gbmV3IEJpZ051bWJlcignMC41Jyk7XG5cbiAgICAgICAgICAgIC8vIE5lZ2F0aXZlL05hTi9JbmZpbml0eS96ZXJvP1xuICAgICAgICAgICAgaWYgKCBzICE9PSAxIHx8ICFjIHx8ICFjWzBdICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKCAhcyB8fCBzIDwgMCAmJiAoICFjIHx8IGNbMF0gKSA/IE5hTiA6IGMgPyB4IDogMSAvIDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cbiAgICAgICAgICAgIHMgPSBNYXRoLnNxcnQoICt4ICk7XG5cbiAgICAgICAgICAgIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XG4gICAgICAgICAgICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxuICAgICAgICAgICAgaWYgKCBzID09IDAgfHwgcyA9PSAxIC8gMCApIHtcbiAgICAgICAgICAgICAgICBuID0gY29lZmZUb1N0cmluZyhjKTtcbiAgICAgICAgICAgICAgICBpZiAoICggbi5sZW5ndGggKyBlICkgJSAyID09IDAgKSBuICs9ICcwJztcbiAgICAgICAgICAgICAgICBzID0gTWF0aC5zcXJ0KG4pO1xuICAgICAgICAgICAgICAgIGUgPSBiaXRGbG9vciggKCBlICsgMSApIC8gMiApIC0gKCBlIDwgMCB8fCBlICUgMiApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzID09IDEgLyAwICkge1xuICAgICAgICAgICAgICAgICAgICBuID0gJzFlJyArIGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xuICAgICAgICAgICAgICAgICAgICBuID0gbi5zbGljZSggMCwgbi5pbmRleE9mKCdlJykgKyAxICkgKyBlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHIgPSBuZXcgQmlnTnVtYmVyKG4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByID0gbmV3IEJpZ051bWJlciggcyArICcnICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZvciB6ZXJvLlxuICAgICAgICAgICAgLy8gciBjb3VsZCBiZSB6ZXJvIGlmIE1JTl9FWFAgaXMgY2hhbmdlZCBhZnRlciB0aGUgdGhpcyB2YWx1ZSB3YXMgY3JlYXRlZC5cbiAgICAgICAgICAgIC8vIFRoaXMgd291bGQgY2F1c2UgYSBkaXZpc2lvbiBieSB6ZXJvICh4L3QpIGFuZCBoZW5jZSBJbmZpbml0eSBiZWxvdywgd2hpY2ggd291bGQgY2F1c2VcbiAgICAgICAgICAgIC8vIGNvZWZmVG9TdHJpbmcgdG8gdGhyb3cuXG4gICAgICAgICAgICBpZiAoIHIuY1swXSApIHtcbiAgICAgICAgICAgICAgICBlID0gci5lO1xuICAgICAgICAgICAgICAgIHMgPSBlICsgZHA7XG4gICAgICAgICAgICAgICAgaWYgKCBzIDwgMyApIHMgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxuICAgICAgICAgICAgICAgIGZvciAoIDsgOyApIHtcbiAgICAgICAgICAgICAgICAgICAgdCA9IHI7XG4gICAgICAgICAgICAgICAgICAgIHIgPSBoYWxmLnRpbWVzKCB0LnBsdXMoIGRpdiggeCwgdCwgZHAsIDEgKSApICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjb2VmZlRvU3RyaW5nKCB0LmMgICApLnNsaWNlKCAwLCBzICkgPT09ICggbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgY29lZmZUb1N0cmluZyggci5jICkgKS5zbGljZSggMCwgcyApICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZXhwb25lbnQgb2YgciBtYXkgaGVyZSBiZSBvbmUgbGVzcyB0aGFuIHRoZSBmaW5hbCByZXN1bHQgZXhwb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcgMC4wMDA5OTk5IChlLTQpIC0tPiAwLjAwMSAoZS0zKSwgc28gYWRqdXN0IHMgc28gdGhlIHJvdW5kaW5nIGRpZ2l0c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJlIGluZGV4ZWQgY29ycmVjdGx5LlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByLmUgPCBlICkgLS1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IG4uc2xpY2UoIHMgLSAzLCBzICsgMSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZSA5OTk5IG9yIDQ5OTkgKGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSkgY29udGludWUgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBleGFjdCByZXN1bHQgYXMgdGhlIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFyZXAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kKCB0LCB0LmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHQudGltZXModCkuZXEoeCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHAgKz0gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzICs9IDQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgZXhhY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHQuIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1JyApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kKCByLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDEgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcm91bmQoIHIsIHIuZSArIERFQ0lNQUxfUExBQ0VTICsgMSwgUk9VTkRJTkdfTU9ERSwgbSApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIG4gKiAwID0gMFxuICAgICAgICAgKiAgbiAqIE4gPSBOXG4gICAgICAgICAqICBuICogSSA9IElcbiAgICAgICAgICogIDAgKiBuID0gMFxuICAgICAgICAgKiAgMCAqIDAgPSAwXG4gICAgICAgICAqICAwICogTiA9IE5cbiAgICAgICAgICogIDAgKiBJID0gTlxuICAgICAgICAgKiAgTiAqIG4gPSBOXG4gICAgICAgICAqICBOICogMCA9IE5cbiAgICAgICAgICogIE4gKiBOID0gTlxuICAgICAgICAgKiAgTiAqIEkgPSBOXG4gICAgICAgICAqICBJICogbiA9IElcbiAgICAgICAgICogIEkgKiAwID0gTlxuICAgICAgICAgKiAgSSAqIE4gPSBOXG4gICAgICAgICAqICBJICogSSA9IElcbiAgICAgICAgICpcbiAgICAgICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgdGltZXMgdGhlIHZhbHVlIG9mXG4gICAgICAgICAqIEJpZ051bWJlcih5LCBiKS5cbiAgICAgICAgICovXG4gICAgICAgIFAudGltZXMgPSBQLm11bCA9IGZ1bmN0aW9uICggeSwgYiApIHtcbiAgICAgICAgICAgIHZhciBjLCBlLCBpLCBqLCBrLCBtLCB4Y0wsIHhsbywgeGhpLCB5Y0wsIHlsbywgeWhpLCB6YyxcbiAgICAgICAgICAgICAgICBiYXNlLCBzcXJ0QmFzZSxcbiAgICAgICAgICAgICAgICB4ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB4YyA9IHguYyxcbiAgICAgICAgICAgICAgICB5YyA9ICggaWQgPSAxNywgeSA9IG5ldyBCaWdOdW1iZXIoIHksIGIgKSApLmM7XG5cbiAgICAgICAgICAgIC8vIEVpdGhlciBOYU4sIMKxSW5maW5pdHkgb3IgwrEwP1xuICAgICAgICAgICAgaWYgKCAheGMgfHwgIXljIHx8ICF4Y1swXSB8fCAheWNbMF0gKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4sIG9yIG9uZSBpcyAwIGFuZCB0aGUgb3RoZXIgaXMgSW5maW5pdHkuXG4gICAgICAgICAgICAgICAgaWYgKCAheC5zIHx8ICF5LnMgfHwgeGMgJiYgIXhjWzBdICYmICF5YyB8fCB5YyAmJiAheWNbMF0gJiYgIXhjICkge1xuICAgICAgICAgICAgICAgICAgICB5LmMgPSB5LmUgPSB5LnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHkucyAqPSB4LnM7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIGlzIMKxSW5maW5pdHkuXG4gICAgICAgICAgICAgICAgICAgIGlmICggIXhjIHx8ICF5YyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkuYyA9IHkuZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJuIMKxMCBpZiBlaXRoZXIgaXMgwrEwLlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgeS5jID0gWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeS5lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlID0gYml0Rmxvb3IoIHguZSAvIExPR19CQVNFICkgKyBiaXRGbG9vciggeS5lIC8gTE9HX0JBU0UgKTtcbiAgICAgICAgICAgIHkucyAqPSB4LnM7XG4gICAgICAgICAgICB4Y0wgPSB4Yy5sZW5ndGg7XG4gICAgICAgICAgICB5Y0wgPSB5Yy5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSB4YyBwb2ludHMgdG8gbG9uZ2VyIGFycmF5IGFuZCB4Y0wgdG8gaXRzIGxlbmd0aC5cbiAgICAgICAgICAgIGlmICggeGNMIDwgeWNMICkgemMgPSB4YywgeGMgPSB5YywgeWMgPSB6YywgaSA9IHhjTCwgeGNMID0geWNMLCB5Y0wgPSBpO1xuXG4gICAgICAgICAgICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cbiAgICAgICAgICAgIGZvciAoIGkgPSB4Y0wgKyB5Y0wsIHpjID0gW107IGktLTsgemMucHVzaCgwKSApO1xuXG4gICAgICAgICAgICBiYXNlID0gQkFTRTtcbiAgICAgICAgICAgIHNxcnRCYXNlID0gU1FSVF9CQVNFO1xuXG4gICAgICAgICAgICBmb3IgKCBpID0geWNMOyAtLWkgPj0gMDsgKSB7XG4gICAgICAgICAgICAgICAgYyA9IDA7XG4gICAgICAgICAgICAgICAgeWxvID0geWNbaV0gJSBzcXJ0QmFzZTtcbiAgICAgICAgICAgICAgICB5aGkgPSB5Y1tpXSAvIHNxcnRCYXNlIHwgMDtcblxuICAgICAgICAgICAgICAgIGZvciAoIGsgPSB4Y0wsIGogPSBpICsgazsgaiA+IGk7ICkge1xuICAgICAgICAgICAgICAgICAgICB4bG8gPSB4Y1stLWtdICUgc3FydEJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHhoaSA9IHhjW2tdIC8gc3FydEJhc2UgfCAwO1xuICAgICAgICAgICAgICAgICAgICBtID0geWhpICogeGxvICsgeGhpICogeWxvO1xuICAgICAgICAgICAgICAgICAgICB4bG8gPSB5bG8gKiB4bG8gKyAoICggbSAlIHNxcnRCYXNlICkgKiBzcXJ0QmFzZSApICsgemNbal0gKyBjO1xuICAgICAgICAgICAgICAgICAgICBjID0gKCB4bG8gLyBiYXNlIHwgMCApICsgKCBtIC8gc3FydEJhc2UgfCAwICkgKyB5aGkgKiB4aGk7XG4gICAgICAgICAgICAgICAgICAgIHpjW2otLV0gPSB4bG8gJSBiYXNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHpjW2pdID0gYztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICArK2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHpjLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpc2UoIHksIHpjLCBlICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciByb3VuZGVkIHRvIGEgbWF4aW11bSBvZlxuICAgICAgICAgKiBzZCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVggaW5jbHVzaXZlLlxuICAgICAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqICd0b0RpZ2l0cygpIHByZWNpc2lvbiBvdXQgb2YgcmFuZ2U6IHtzZH0nXG4gICAgICAgICAqICd0b0RpZ2l0cygpIHByZWNpc2lvbiBub3QgYW4gaW50ZWdlcjoge3NkfSdcbiAgICAgICAgICogJ3RvRGlnaXRzKCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcbiAgICAgICAgICogJ3RvRGlnaXRzKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXG4gICAgICAgICAqL1xuICAgICAgICBQLnRvRGlnaXRzID0gZnVuY3Rpb24gKCBzZCwgcm0gKSB7XG4gICAgICAgICAgICB2YXIgbiA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XG4gICAgICAgICAgICBzZCA9IHNkID09IG51bGwgfHwgIWlzVmFsaWRJbnQoIHNkLCAxLCBNQVgsIDE4LCAncHJlY2lzaW9uJyApID8gbnVsbCA6IHNkIHwgMDtcbiAgICAgICAgICAgIHJtID0gcm0gPT0gbnVsbCB8fCAhaXNWYWxpZEludCggcm0sIDAsIDgsIDE4LCByb3VuZGluZ01vZGUgKSA/IFJPVU5ESU5HX01PREUgOiBybSB8IDA7XG4gICAgICAgICAgICByZXR1cm4gc2QgPyByb3VuZCggbiwgc2QsIHJtICkgOiBuO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gYW5kXG4gICAgICAgICAqIHJvdW5kZWQgdXNpbmcgUk9VTkRJTkdfTU9ERSB0byBkcCBmaXhlZCBkZWNpbWFsIHBsYWNlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxuICAgICAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqICd0b0V4cG9uZW50aWFsKCkgZGVjaW1hbCBwbGFjZXMgbm90IGFuIGludGVnZXI6IHtkcH0nXG4gICAgICAgICAqICd0b0V4cG9uZW50aWFsKCkgZGVjaW1hbCBwbGFjZXMgb3V0IG9mIHJhbmdlOiB7ZHB9J1xuICAgICAgICAgKiAndG9FeHBvbmVudGlhbCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXG4gICAgICAgICAqICd0b0V4cG9uZW50aWFsKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXG4gICAgICAgICAqL1xuICAgICAgICBQLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbiAoIGRwLCBybSApIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQoIHRoaXMsXG4gICAgICAgICAgICAgIGRwICE9IG51bGwgJiYgaXNWYWxpZEludCggZHAsIDAsIE1BWCwgMTkgKSA/IH5+ZHAgKyAxIDogbnVsbCwgcm0sIDE5ICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpbiBmaXhlZC1wb2ludCBub3RhdGlvbiByb3VuZGluZ1xuICAgICAgICAgKiB0byBkcCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBST1VORElOR19NT0RFIGlmIHJtIGlzIG9taXR0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIE5vdGU6IGFzIHdpdGggSmF2YVNjcmlwdCdzIG51bWJlciB0eXBlLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLFxuICAgICAgICAgKiBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cbiAgICAgICAgICpcbiAgICAgICAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxuICAgICAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXG4gICAgICAgICAqXG4gICAgICAgICAqICd0b0ZpeGVkKCkgZGVjaW1hbCBwbGFjZXMgbm90IGFuIGludGVnZXI6IHtkcH0nXG4gICAgICAgICAqICd0b0ZpeGVkKCkgZGVjaW1hbCBwbGFjZXMgb3V0IG9mIHJhbmdlOiB7ZHB9J1xuICAgICAgICAgKiAndG9GaXhlZCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXG4gICAgICAgICAqICd0b0ZpeGVkKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXG4gICAgICAgICAqL1xuICAgICAgICBQLnRvRml4ZWQgPSBmdW5jdGlvbiAoIGRwLCBybSApIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQoIHRoaXMsIGRwICE9IG51bGwgJiYgaXNWYWxpZEludCggZHAsIDAsIE1BWCwgMjAgKVxuICAgICAgICAgICAgICA/IH5+ZHAgKyB0aGlzLmUgKyAxIDogbnVsbCwgcm0sIDIwICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpbiBmaXhlZC1wb2ludCBub3RhdGlvbiByb3VuZGVkXG4gICAgICAgICAqIHVzaW5nIHJtIG9yIFJPVU5ESU5HX01PREUgdG8gZHAgZGVjaW1hbCBwbGFjZXMsIGFuZCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIHRoZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIG9mIHRoZSBGT1JNQVQgb2JqZWN0IChzZWUgQmlnTnVtYmVyLmNvbmZpZykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEZPUk1BVCA9IHtcbiAgICAgICAgICogICAgICBkZWNpbWFsU2VwYXJhdG9yIDogJy4nLFxuICAgICAgICAgKiAgICAgIGdyb3VwU2VwYXJhdG9yIDogJywnLFxuICAgICAgICAgKiAgICAgIGdyb3VwU2l6ZSA6IDMsXG4gICAgICAgICAqICAgICAgc2Vjb25kYXJ5R3JvdXBTaXplIDogMCxcbiAgICAgICAgICogICAgICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yIDogJ1xceEEwJywgICAgLy8gbm9uLWJyZWFraW5nIHNwYWNlXG4gICAgICAgICAqICAgICAgZnJhY3Rpb25Hcm91cFNpemUgOiAwXG4gICAgICAgICAqIH07XG4gICAgICAgICAqXG4gICAgICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cbiAgICAgICAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAndG9Gb3JtYXQoKSBkZWNpbWFsIHBsYWNlcyBub3QgYW4gaW50ZWdlcjoge2RwfSdcbiAgICAgICAgICogJ3RvRm9ybWF0KCkgZGVjaW1hbCBwbGFjZXMgb3V0IG9mIHJhbmdlOiB7ZHB9J1xuICAgICAgICAgKiAndG9Gb3JtYXQoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xuICAgICAgICAgKiAndG9Gb3JtYXQoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcbiAgICAgICAgICovXG4gICAgICAgIFAudG9Gb3JtYXQgPSBmdW5jdGlvbiAoIGRwLCBybSApIHtcbiAgICAgICAgICAgIHZhciBzdHIgPSBmb3JtYXQoIHRoaXMsIGRwICE9IG51bGwgJiYgaXNWYWxpZEludCggZHAsIDAsIE1BWCwgMjEgKVxuICAgICAgICAgICAgICA/IH5+ZHAgKyB0aGlzLmUgKyAxIDogbnVsbCwgcm0sIDIxICk7XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5jICkge1xuICAgICAgICAgICAgICAgIHZhciBpLFxuICAgICAgICAgICAgICAgICAgICBhcnIgPSBzdHIuc3BsaXQoJy4nKSxcbiAgICAgICAgICAgICAgICAgICAgZzEgPSArRk9STUFULmdyb3VwU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZzIgPSArRk9STUFULnNlY29uZGFyeUdyb3VwU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBTZXBhcmF0b3IgPSBGT1JNQVQuZ3JvdXBTZXBhcmF0b3IsXG4gICAgICAgICAgICAgICAgICAgIGludFBhcnQgPSBhcnJbMF0sXG4gICAgICAgICAgICAgICAgICAgIGZyYWN0aW9uUGFydCA9IGFyclsxXSxcbiAgICAgICAgICAgICAgICAgICAgaXNOZWcgPSB0aGlzLnMgPCAwLFxuICAgICAgICAgICAgICAgICAgICBpbnREaWdpdHMgPSBpc05lZyA/IGludFBhcnQuc2xpY2UoMSkgOiBpbnRQYXJ0LFxuICAgICAgICAgICAgICAgICAgICBsZW4gPSBpbnREaWdpdHMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGcyKSBpID0gZzEsIGcxID0gZzIsIGcyID0gaSwgbGVuIC09IGk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGcxID4gMCAmJiBsZW4gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICBpID0gbGVuICUgZzEgfHwgZzE7XG4gICAgICAgICAgICAgICAgICAgIGludFBhcnQgPSBpbnREaWdpdHMuc3Vic3RyKCAwLCBpICk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICggOyBpIDwgbGVuOyBpICs9IGcxICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50UGFydCArPSBncm91cFNlcGFyYXRvciArIGludERpZ2l0cy5zdWJzdHIoIGksIGcxICk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIGcyID4gMCApIGludFBhcnQgKz0gZ3JvdXBTZXBhcmF0b3IgKyBpbnREaWdpdHMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05lZykgaW50UGFydCA9ICctJyArIGludFBhcnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RyID0gZnJhY3Rpb25QYXJ0XG4gICAgICAgICAgICAgICAgICA/IGludFBhcnQgKyBGT1JNQVQuZGVjaW1hbFNlcGFyYXRvciArICggKCBnMiA9ICtGT1JNQVQuZnJhY3Rpb25Hcm91cFNpemUgKVxuICAgICAgICAgICAgICAgICAgICA/IGZyYWN0aW9uUGFydC5yZXBsYWNlKCBuZXcgUmVnRXhwKCAnXFxcXGR7JyArIGcyICsgJ31cXFxcQicsICdnJyApLFxuICAgICAgICAgICAgICAgICAgICAgICckJicgKyBGT1JNQVQuZnJhY3Rpb25Hcm91cFNlcGFyYXRvciApXG4gICAgICAgICAgICAgICAgICAgIDogZnJhY3Rpb25QYXJ0IClcbiAgICAgICAgICAgICAgICAgIDogaW50UGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIHN0cmluZyBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGFzIGEgc2ltcGxlIGZyYWN0aW9uIHdpdGhcbiAgICAgICAgICogYW4gaW50ZWdlciBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuIFRoZSBkZW5vbWluYXRvciB3aWxsIGJlIGEgcG9zaXRpdmVcbiAgICAgICAgICogbm9uLXplcm8gdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgbWF4aW11bSBkZW5vbWluYXRvci4gSWYgYSBtYXhpbXVtXG4gICAgICAgICAqIGRlbm9taW5hdG9yIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBkZW5vbWluYXRvciB3aWxsIGJlIHRoZSBsb3dlc3QgdmFsdWUgbmVjZXNzYXJ5IHRvXG4gICAgICAgICAqIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFttZF0ge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfSBJbnRlZ2VyID49IDEgYW5kIDwgSW5maW5pdHkuIFRoZSBtYXhpbXVtIGRlbm9taW5hdG9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiAndG9GcmFjdGlvbigpIG1heCBkZW5vbWluYXRvciBub3QgYW4gaW50ZWdlcjoge21kfSdcbiAgICAgICAgICogJ3RvRnJhY3Rpb24oKSBtYXggZGVub21pbmF0b3Igb3V0IG9mIHJhbmdlOiB7bWR9J1xuICAgICAgICAgKi9cbiAgICAgICAgUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1kKSB7XG4gICAgICAgICAgICB2YXIgYXJyLCBkMCwgZDIsIGUsIGV4cCwgbiwgbjAsIHEsIHMsXG4gICAgICAgICAgICAgICAgayA9IEVSUk9SUyxcbiAgICAgICAgICAgICAgICB4ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB4YyA9IHguYyxcbiAgICAgICAgICAgICAgICBkID0gbmV3IEJpZ051bWJlcihPTkUpLFxuICAgICAgICAgICAgICAgIG4xID0gZDAgPSBuZXcgQmlnTnVtYmVyKE9ORSksXG4gICAgICAgICAgICAgICAgZDEgPSBuMCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcblxuICAgICAgICAgICAgaWYgKCBtZCAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgIEVSUk9SUyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG4gPSBuZXcgQmlnTnVtYmVyKG1kKTtcbiAgICAgICAgICAgICAgICBFUlJPUlMgPSBrO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhKCBrID0gbi5pc0ludCgpICkgfHwgbi5sdChPTkUpICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChFUlJPUlMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhaXNlKCAyMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ21heCBkZW5vbWluYXRvciAnICsgKCBrID8gJ291dCBvZiByYW5nZScgOiAnbm90IGFuIGludGVnZXInICksIG1kICk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBFUlJPUlMgaXMgZmFsc2U6XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG1kIGlzIGEgZmluaXRlIG5vbi1pbnRlZ2VyID49IDEsIHJvdW5kIGl0IHRvIGFuIGludGVnZXIgYW5kIHVzZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgbWQgPSAhayAmJiBuLmMgJiYgcm91bmQoIG4sIG4uZSArIDEsIDEgKS5ndGUoT05FKSA/IG4gOiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCAheGMgKSByZXR1cm4geC50b1N0cmluZygpO1xuICAgICAgICAgICAgcyA9IGNvZWZmVG9TdHJpbmcoeGMpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgaW5pdGlhbCBkZW5vbWluYXRvci5cbiAgICAgICAgICAgIC8vIGQgaXMgYSBwb3dlciBvZiAxMCBhbmQgdGhlIG1pbmltdW0gbWF4IGRlbm9taW5hdG9yIHRoYXQgc3BlY2lmaWVzIHRoZSB2YWx1ZSBleGFjdGx5LlxuICAgICAgICAgICAgZSA9IGQuZSA9IHMubGVuZ3RoIC0geC5lIC0gMTtcbiAgICAgICAgICAgIGQuY1swXSA9IFBPV1NfVEVOWyAoIGV4cCA9IGUgJSBMT0dfQkFTRSApIDwgMCA/IExPR19CQVNFICsgZXhwIDogZXhwIF07XG4gICAgICAgICAgICBtZCA9ICFtZCB8fCBuLmNtcChkKSA+IDAgPyAoIGUgPiAwID8gZCA6IG4xICkgOiBuO1xuXG4gICAgICAgICAgICBleHAgPSBNQVhfRVhQO1xuICAgICAgICAgICAgTUFYX0VYUCA9IDEgLyAwO1xuICAgICAgICAgICAgbiA9IG5ldyBCaWdOdW1iZXIocyk7XG5cbiAgICAgICAgICAgIC8vIG4wID0gZDEgPSAwXG4gICAgICAgICAgICBuMC5jWzBdID0gMDtcblxuICAgICAgICAgICAgZm9yICggOyA7ICkgIHtcbiAgICAgICAgICAgICAgICBxID0gZGl2KCBuLCBkLCAwLCAxICk7XG4gICAgICAgICAgICAgICAgZDIgPSBkMC5wbHVzKCBxLnRpbWVzKGQxKSApO1xuICAgICAgICAgICAgICAgIGlmICggZDIuY21wKG1kKSA9PSAxICkgYnJlYWs7XG4gICAgICAgICAgICAgICAgZDAgPSBkMTtcbiAgICAgICAgICAgICAgICBkMSA9IGQyO1xuICAgICAgICAgICAgICAgIG4xID0gbjAucGx1cyggcS50aW1lcyggZDIgPSBuMSApICk7XG4gICAgICAgICAgICAgICAgbjAgPSBkMjtcbiAgICAgICAgICAgICAgICBkID0gbi5taW51cyggcS50aW1lcyggZDIgPSBkICkgKTtcbiAgICAgICAgICAgICAgICBuID0gZDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQyID0gZGl2KCBtZC5taW51cyhkMCksIGQxLCAwLCAxICk7XG4gICAgICAgICAgICBuMCA9IG4wLnBsdXMoIGQyLnRpbWVzKG4xKSApO1xuICAgICAgICAgICAgZDAgPSBkMC5wbHVzKCBkMi50aW1lcyhkMSkgKTtcbiAgICAgICAgICAgIG4wLnMgPSBuMS5zID0geC5zO1xuICAgICAgICAgICAgZSAqPSAyO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggZnJhY3Rpb24gaXMgY2xvc2VyIHRvIHgsIG4wL2QwIG9yIG4xL2QxXG4gICAgICAgICAgICBhcnIgPSBkaXYoIG4xLCBkMSwgZSwgUk9VTkRJTkdfTU9ERSApLm1pbnVzKHgpLmFicygpLmNtcChcbiAgICAgICAgICAgICAgICAgIGRpdiggbjAsIGQwLCBlLCBST1VORElOR19NT0RFICkubWludXMoeCkuYWJzKCkgKSA8IDFcbiAgICAgICAgICAgICAgICAgICAgPyBbIG4xLnRvU3RyaW5nKCksIGQxLnRvU3RyaW5nKCkgXVxuICAgICAgICAgICAgICAgICAgICA6IFsgbjAudG9TdHJpbmcoKSwgZDAudG9TdHJpbmcoKSBdO1xuXG4gICAgICAgICAgICBNQVhfRVhQID0gZXhwO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgY29udmVydGVkIHRvIGEgbnVtYmVyIHByaW1pdGl2ZS5cbiAgICAgICAgICovXG4gICAgICAgIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXM7XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSB6ZXJvIGhhcyBjb3JyZWN0IHNpZ24uXG4gICAgICAgICAgICByZXR1cm4gK3ggfHwgKCB4LnMgPyB4LnMgKiAwIDogTmFOICk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJhaXNlZCB0byB0aGUgcG93ZXIgbi5cbiAgICAgICAgICogSWYgbiBpcyBuZWdhdGl2ZSByb3VuZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXG4gICAgICAgICAqIElmIFBPV19QUkVDSVNJT04gaXMgbm90IDAsIHJvdW5kIHRvIFBPV19QUkVDSVNJT04gdXNpbmcgUk9VTkRJTkdfTU9ERS5cbiAgICAgICAgICpcbiAgICAgICAgICogbiB7bnVtYmVyfSBJbnRlZ2VyLCAtOTAwNzE5OTI1NDc0MDk5MiB0byA5MDA3MTk5MjU0NzQwOTkyIGluY2x1c2l2ZS5cbiAgICAgICAgICogKFBlcmZvcm1zIDU0IGxvb3AgaXRlcmF0aW9ucyBmb3IgbiBvZiA5MDA3MTk5MjU0NzQwOTkyLilcbiAgICAgICAgICpcbiAgICAgICAgICogJ3BvdygpIGV4cG9uZW50IG5vdCBhbiBpbnRlZ2VyOiB7bn0nXG4gICAgICAgICAqICdwb3coKSBleHBvbmVudCBvdXQgb2YgcmFuZ2U6IHtufSdcbiAgICAgICAgICovXG4gICAgICAgIFAudG9Qb3dlciA9IFAucG93ID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHZhciBrLCB5LFxuICAgICAgICAgICAgICAgIGkgPSBtYXRoZmxvb3IoIG4gPCAwID8gLW4gOiArbiApLFxuICAgICAgICAgICAgICAgIHggPSB0aGlzO1xuXG4gICAgICAgICAgICAvLyBQYXNzIMKxSW5maW5pdHkgdG8gTWF0aC5wb3cgaWYgZXhwb25lbnQgaXMgb3V0IG9mIHJhbmdlLlxuICAgICAgICAgICAgaWYgKCAhaXNWYWxpZEludCggbiwgLU1BWF9TQUZFX0lOVEVHRVIsIE1BWF9TQUZFX0lOVEVHRVIsIDIzLCAnZXhwb25lbnQnICkgJiZcbiAgICAgICAgICAgICAgKCAhaXNGaW5pdGUobikgfHwgaSA+IE1BWF9TQUZFX0lOVEVHRVIgJiYgKCBuIC89IDAgKSB8fFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobikgIT0gbiAmJiAhKCBuID0gTmFOICkgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlciggTWF0aC5wb3coICt4LCBuICkgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJ1bmNhdGluZyBlYWNoIGNvZWZmaWNpZW50IGFycmF5IHRvIGEgbGVuZ3RoIG9mIGsgYWZ0ZXIgZWFjaCBtdWx0aXBsaWNhdGlvbiBlcXVhdGVzXG4gICAgICAgICAgICAvLyB0byB0cnVuY2F0aW5nIHNpZ25pZmljYW50IGRpZ2l0cyB0byBQT1dfUFJFQ0lTSU9OICsgWzI4LCA0MV0sIGkuZS4gdGhlcmUgd2lsbCBiZSBhXG4gICAgICAgICAgICAvLyBtaW5pbXVtIG9mIDI4IGd1YXJkIGRpZ2l0cyByZXRhaW5lZC4gKFVzaW5nICsgMS41IHdvdWxkIGdpdmUgWzksIDIxXSBndWFyZCBkaWdpdHMuKVxuICAgICAgICAgICAgayA9IFBPV19QUkVDSVNJT04gPyBtYXRoY2VpbCggUE9XX1BSRUNJU0lPTiAvIExPR19CQVNFICsgMiApIDogMDtcbiAgICAgICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XG5cbiAgICAgICAgICAgIGZvciAoIDsgOyApIHtcblxuICAgICAgICAgICAgICAgIGlmICggaSAlIDIgKSB7XG4gICAgICAgICAgICAgICAgICAgIHkgPSB5LnRpbWVzKHgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoICF5LmMgKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBrICYmIHkuYy5sZW5ndGggPiBrICkgeS5jLmxlbmd0aCA9IGs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaSA9IG1hdGhmbG9vciggaSAvIDIgKTtcbiAgICAgICAgICAgICAgICBpZiAoICFpICkgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB4ID0geC50aW1lcyh4KTtcbiAgICAgICAgICAgICAgICBpZiAoIGsgJiYgeC5jICYmIHguYy5sZW5ndGggPiBrICkgeC5jLmxlbmd0aCA9IGs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggbiA8IDAgKSB5ID0gT05FLmRpdih5KTtcbiAgICAgICAgICAgIHJldHVybiBrID8gcm91bmQoIHksIFBPV19QUkVDSVNJT04sIFJPVU5ESU5HX01PREUgKSA6IHk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciByb3VuZGVkIHRvIHNkIHNpZ25pZmljYW50IGRpZ2l0c1xuICAgICAgICAgKiB1c2luZyByb3VuZGluZyBtb2RlIHJtIG9yIFJPVU5ESU5HX01PREUuIElmIHNkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0c1xuICAgICAgICAgKiBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uLCB0aGVuIHVzZVxuICAgICAgICAgKiBleHBvbmVudGlhbCBub3RhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cbiAgICAgICAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAndG9QcmVjaXNpb24oKSBwcmVjaXNpb24gbm90IGFuIGludGVnZXI6IHtzZH0nXG4gICAgICAgICAqICd0b1ByZWNpc2lvbigpIHByZWNpc2lvbiBvdXQgb2YgcmFuZ2U6IHtzZH0nXG4gICAgICAgICAqICd0b1ByZWNpc2lvbigpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXG4gICAgICAgICAqICd0b1ByZWNpc2lvbigpIHJvdW5kaW5nIG1vZGUgb3V0IG9mIHJhbmdlOiB7cm19J1xuICAgICAgICAgKi9cbiAgICAgICAgUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uICggc2QsIHJtICkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdCggdGhpcywgc2QgIT0gbnVsbCAmJiBpc1ZhbGlkSW50KCBzZCwgMSwgTUFYLCAyNCwgJ3ByZWNpc2lvbicgKVxuICAgICAgICAgICAgICA/IHNkIHwgMCA6IG51bGwsIHJtLCAyNCApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gYmFzZSBiLCBvciBiYXNlIDEwIGlmIGIgaXNcbiAgICAgICAgICogb21pdHRlZC4gSWYgYSBiYXNlIGlzIHNwZWNpZmllZCwgaW5jbHVkaW5nIGJhc2UgMTAsIHJvdW5kIGFjY29yZGluZyB0byBERUNJTUFMX1BMQUNFUyBhbmRcbiAgICAgICAgICogUk9VTkRJTkdfTU9ERS4gSWYgYSBiYXNlIGlzIG5vdCBzcGVjaWZpZWQsIGFuZCB0aGlzIEJpZ051bWJlciBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudFxuICAgICAgICAgKiB0aGF0IGlzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBUT19FWFBfUE9TLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhblxuICAgICAgICAgKiBUT19FWFBfTkVHLCByZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFtiXSB7bnVtYmVyfSBJbnRlZ2VyLCAyIHRvIDY0IGluY2x1c2l2ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogJ3RvU3RyaW5nKCkgYmFzZSBub3QgYW4gaW50ZWdlcjoge2J9J1xuICAgICAgICAgKiAndG9TdHJpbmcoKSBiYXNlIG91dCBvZiByYW5nZToge2J9J1xuICAgICAgICAgKi9cbiAgICAgICAgUC50b1N0cmluZyA9IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICB2YXIgc3RyLFxuICAgICAgICAgICAgICAgIG4gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHMgPSBuLnMsXG4gICAgICAgICAgICAgICAgZSA9IG4uZTtcblxuICAgICAgICAgICAgLy8gSW5maW5pdHkgb3IgTmFOP1xuICAgICAgICAgICAgaWYgKCBlID09PSBudWxsICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gJ0luZmluaXR5JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzIDwgMCApIHN0ciA9ICctJyArIHN0cjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSAnTmFOJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcoIG4uYyApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBiID09IG51bGwgfHwgIWlzVmFsaWRJbnQoIGIsIDIsIDY0LCAyNSwgJ2Jhc2UnICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IGUgPD0gVE9fRVhQX05FRyB8fCBlID49IFRPX0VYUF9QT1NcbiAgICAgICAgICAgICAgICAgICAgICA/IHRvRXhwb25lbnRpYWwoIHN0ciwgZSApXG4gICAgICAgICAgICAgICAgICAgICAgOiB0b0ZpeGVkUG9pbnQoIHN0ciwgZSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IGNvbnZlcnRCYXNlKCB0b0ZpeGVkUG9pbnQoIHN0ciwgZSApLCBiIHwgMCwgMTAsIHMgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIHMgPCAwICYmIG4uY1swXSApIHN0ciA9ICctJyArIHN0cjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHRydW5jYXRlZCB0byBhIHdob2xlXG4gICAgICAgICAqIG51bWJlci5cbiAgICAgICAgICovXG4gICAgICAgIFAudHJ1bmNhdGVkID0gUC50cnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZCggbmV3IEJpZ051bWJlcih0aGlzKSwgdGhpcy5lICsgMSwgMSApO1xuICAgICAgICB9O1xuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm4gYXMgdG9TdHJpbmcsIGJ1dCBkbyBub3QgYWNjZXB0IGEgYmFzZSBhcmd1bWVudC5cbiAgICAgICAgICovXG4gICAgICAgIFAudmFsdWVPZiA9IFAudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIEFsaWFzZXMgZm9yIEJpZ0RlY2ltYWwgbWV0aG9kcy5cbiAgICAgICAgLy9QLmFkZCA9IFAucGx1czsgICAgICAgICAvLyBQLmFkZCBpbmNsdWRlZCBhYm92ZVxuICAgICAgICAvL1Auc3VidHJhY3QgPSBQLm1pbnVzOyAgIC8vIFAuc3ViIGluY2x1ZGVkIGFib3ZlXG4gICAgICAgIC8vUC5tdWx0aXBseSA9IFAudGltZXM7ICAgLy8gUC5tdWwgaW5jbHVkZWQgYWJvdmVcbiAgICAgICAgLy9QLmRpdmlkZSA9IFAuZGl2O1xuICAgICAgICAvL1AucmVtYWluZGVyID0gUC5tb2Q7XG4gICAgICAgIC8vUC5jb21wYXJlVG8gPSBQLmNtcDtcbiAgICAgICAgLy9QLm5lZ2F0ZSA9IFAubmVnO1xuXG5cbiAgICAgICAgaWYgKCBjb25maWdPYmogIT0gbnVsbCApIEJpZ051bWJlci5jb25maWcoY29uZmlnT2JqKTtcblxuICAgICAgICByZXR1cm4gQmlnTnVtYmVyO1xuICAgIH1cblxuXG4gICAgLy8gUFJJVkFURSBIRUxQRVIgRlVOQ1RJT05TXG5cblxuICAgIGZ1bmN0aW9uIGJpdEZsb29yKG4pIHtcbiAgICAgICAgdmFyIGkgPSBuIHwgMDtcbiAgICAgICAgcmV0dXJuIG4gPiAwIHx8IG4gPT09IGkgPyBpIDogaSAtIDE7XG4gICAgfVxuXG5cbiAgICAvLyBSZXR1cm4gYSBjb2VmZmljaWVudCBhcnJheSBhcyBhIHN0cmluZyBvZiBiYXNlIDEwIGRpZ2l0cy5cbiAgICBmdW5jdGlvbiBjb2VmZlRvU3RyaW5nKGEpIHtcbiAgICAgICAgdmFyIHMsIHosXG4gICAgICAgICAgICBpID0gMSxcbiAgICAgICAgICAgIGogPSBhLmxlbmd0aCxcbiAgICAgICAgICAgIHIgPSBhWzBdICsgJyc7XG5cbiAgICAgICAgZm9yICggOyBpIDwgajsgKSB7XG4gICAgICAgICAgICBzID0gYVtpKytdICsgJyc7XG4gICAgICAgICAgICB6ID0gTE9HX0JBU0UgLSBzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoIDsgei0tOyBzID0gJzAnICsgcyApO1xuICAgICAgICAgICAgciArPSBzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxuICAgICAgICBmb3IgKCBqID0gci5sZW5ndGg7IHIuY2hhckNvZGVBdCgtLWopID09PSA0ODsgKTtcbiAgICAgICAgcmV0dXJuIHIuc2xpY2UoIDAsIGogKyAxIHx8IDEgKTtcbiAgICB9XG5cblxuICAgIC8vIENvbXBhcmUgdGhlIHZhbHVlIG9mIEJpZ051bWJlcnMgeCBhbmQgeS5cbiAgICBmdW5jdGlvbiBjb21wYXJlKCB4LCB5ICkge1xuICAgICAgICB2YXIgYSwgYixcbiAgICAgICAgICAgIHhjID0geC5jLFxuICAgICAgICAgICAgeWMgPSB5LmMsXG4gICAgICAgICAgICBpID0geC5zLFxuICAgICAgICAgICAgaiA9IHkucyxcbiAgICAgICAgICAgIGsgPSB4LmUsXG4gICAgICAgICAgICBsID0geS5lO1xuXG4gICAgICAgIC8vIEVpdGhlciBOYU4/XG4gICAgICAgIGlmICggIWkgfHwgIWogKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBhID0geGMgJiYgIXhjWzBdO1xuICAgICAgICBiID0geWMgJiYgIXljWzBdO1xuXG4gICAgICAgIC8vIEVpdGhlciB6ZXJvP1xuICAgICAgICBpZiAoIGEgfHwgYiApIHJldHVybiBhID8gYiA/IDAgOiAtaiA6IGk7XG5cbiAgICAgICAgLy8gU2lnbnMgZGlmZmVyP1xuICAgICAgICBpZiAoIGkgIT0gaiApIHJldHVybiBpO1xuXG4gICAgICAgIGEgPSBpIDwgMDtcbiAgICAgICAgYiA9IGsgPT0gbDtcblxuICAgICAgICAvLyBFaXRoZXIgSW5maW5pdHk/XG4gICAgICAgIGlmICggIXhjIHx8ICF5YyApIHJldHVybiBiID8gMCA6ICF4YyBeIGEgPyAxIDogLTE7XG5cbiAgICAgICAgLy8gQ29tcGFyZSBleHBvbmVudHMuXG4gICAgICAgIGlmICggIWIgKSByZXR1cm4gayA+IGwgXiBhID8gMSA6IC0xO1xuXG4gICAgICAgIGogPSAoIGsgPSB4Yy5sZW5ndGggKSA8ICggbCA9IHljLmxlbmd0aCApID8gayA6IGw7XG5cbiAgICAgICAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCBqOyBpKysgKSBpZiAoIHhjW2ldICE9IHljW2ldICkgcmV0dXJuIHhjW2ldID4geWNbaV0gXiBhID8gMSA6IC0xO1xuXG4gICAgICAgIC8vIENvbXBhcmUgbGVuZ3Rocy5cbiAgICAgICAgcmV0dXJuIGsgPT0gbCA/IDAgOiBrID4gbCBeIGEgPyAxIDogLTE7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqIFJldHVybiB0cnVlIGlmIG4gaXMgYSB2YWxpZCBudW1iZXIgaW4gcmFuZ2UsIG90aGVyd2lzZSBmYWxzZS5cbiAgICAgKiBVc2UgZm9yIGFyZ3VtZW50IHZhbGlkYXRpb24gd2hlbiBFUlJPUlMgaXMgZmFsc2UuXG4gICAgICogTm90ZTogcGFyc2VJbnQoJzFlKzEnKSA9PSAxIGJ1dCBwYXJzZUZsb2F0KCcxZSsxJykgPT0gMTAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50VmFsaWRhdG9yTm9FcnJvcnMoIG4sIG1pbiwgbWF4ICkge1xuICAgICAgICByZXR1cm4gKCBuID0gdHJ1bmNhdGUobikgKSA+PSBtaW4gJiYgbiA8PSBtYXg7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICogQ29udmVydCBzdHJpbmcgb2YgYmFzZUluIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYmFzZU91dC5cbiAgICAgKiBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cbiAgICAgKiBFZy4gY29udmVydEJhc2UoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b0Jhc2VPdXQoIHN0ciwgYmFzZUluLCBiYXNlT3V0ICkge1xuICAgICAgICB2YXIgaixcbiAgICAgICAgICAgIGFyciA9IFswXSxcbiAgICAgICAgICAgIGFyckwsXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XG5cbiAgICAgICAgZm9yICggOyBpIDwgbGVuOyApIHtcbiAgICAgICAgICAgIGZvciAoIGFyckwgPSBhcnIubGVuZ3RoOyBhcnJMLS07IGFyclthcnJMXSAqPSBiYXNlSW4gKTtcbiAgICAgICAgICAgIGFyclsgaiA9IDAgXSArPSBBTFBIQUJFVC5pbmRleE9mKCBzdHIuY2hhckF0KCBpKysgKSApO1xuXG4gICAgICAgICAgICBmb3IgKCA7IGogPCBhcnIubGVuZ3RoOyBqKysgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGFycltqXSA+IGJhc2VPdXQgLSAxICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGFycltqICsgMV0gPT0gbnVsbCApIGFycltqICsgMV0gPSAwO1xuICAgICAgICAgICAgICAgICAgICBhcnJbaiArIDFdICs9IGFycltqXSAvIGJhc2VPdXQgfCAwO1xuICAgICAgICAgICAgICAgICAgICBhcnJbal0gJT0gYmFzZU91dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyLnJldmVyc2UoKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHRvRXhwb25lbnRpYWwoIHN0ciwgZSApIHtcbiAgICAgICAgcmV0dXJuICggc3RyLmxlbmd0aCA+IDEgPyBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpIDogc3RyICkgK1xuICAgICAgICAgICggZSA8IDAgPyAnZScgOiAnZSsnICkgKyBlO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gdG9GaXhlZFBvaW50KCBzdHIsIGUgKSB7XG4gICAgICAgIHZhciBsZW4sIHo7XG5cbiAgICAgICAgLy8gTmVnYXRpdmUgZXhwb25lbnQ/XG4gICAgICAgIGlmICggZSA8IDAgKSB7XG5cbiAgICAgICAgICAgIC8vIFByZXBlbmQgemVyb3MuXG4gICAgICAgICAgICBmb3IgKCB6ID0gJzAuJzsgKytlOyB6ICs9ICcwJyApO1xuICAgICAgICAgICAgc3RyID0geiArIHN0cjtcblxuICAgICAgICAvLyBQb3NpdGl2ZSBleHBvbmVudFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuID0gc3RyLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gQXBwZW5kIHplcm9zLlxuICAgICAgICAgICAgaWYgKCArK2UgPiBsZW4gKSB7XG4gICAgICAgICAgICAgICAgZm9yICggeiA9ICcwJywgZSAtPSBsZW47IC0tZTsgeiArPSAnMCcgKTtcbiAgICAgICAgICAgICAgICBzdHIgKz0gejtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGUgPCBsZW4gKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKCAwLCBlICkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gdHJ1bmNhdGUobikge1xuICAgICAgICBuID0gcGFyc2VGbG9hdChuKTtcbiAgICAgICAgcmV0dXJuIG4gPCAwID8gbWF0aGNlaWwobikgOiBtYXRoZmxvb3Iobik7XG4gICAgfVxuXG5cbiAgICAvLyBFWFBPUlRcblxuXG4gICAgQmlnTnVtYmVyID0gYW5vdGhlcigpO1xuXG4gICAgLy8gQU1ELlxuICAgIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgICAgIGRlZmluZSggZnVuY3Rpb24gKCkgeyByZXR1cm4gQmlnTnVtYmVyOyB9ICk7XG5cbiAgICAvLyBOb2RlIGFuZCBvdGhlciBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLlxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQmlnTnVtYmVyO1xuICAgICAgICBpZiAoICFjcnlwdG8gKSB0cnkgeyBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTsgfSBjYXRjaCAoZSkge31cblxuICAgIC8vIEJyb3dzZXIuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLkJpZ051bWJlciA9IEJpZ051bWJlcjtcbiAgICB9XG59KSh0aGlzKTtcbiIsInZhciB3ZWIzID0gcmVxdWlyZSgnLi9saWIvd2ViMycpO1xud2ViMy5wcm92aWRlcnMuSHR0cFByb3ZpZGVyID0gcmVxdWlyZSgnLi9saWIvd2ViMy9odHRwcHJvdmlkZXInKTtcbndlYjMucHJvdmlkZXJzLlF0U3luY1Byb3ZpZGVyID0gcmVxdWlyZSgnLi9saWIvd2ViMy9xdHN5bmMnKTtcbndlYjMuZXRoLmNvbnRyYWN0ID0gcmVxdWlyZSgnLi9saWIvd2ViMy9jb250cmFjdCcpO1xud2ViMy5ldGgubmFtZXJlZyA9IHJlcXVpcmUoJy4vbGliL3dlYjMvbmFtZXJlZycpO1xud2ViMy5ldGguc2VuZElCQU5UcmFuc2FjdGlvbiA9IHJlcXVpcmUoJy4vbGliL3dlYjMvdHJhbnNmZXInKTtcblxuLy8gZG9udCBvdmVycmlkZSBnbG9iYWwgdmFyaWFibGVcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LndlYjMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93LndlYjMgPSB3ZWIzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdlYjM7XG5cbiJdfQ==
