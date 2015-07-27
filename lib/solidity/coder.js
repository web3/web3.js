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
    throw "this method should be overrwritten!";
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
 * Should be used to decode params from bytes
 *
 * @method decode
 * @param {String} bytes
 * @param {Number} offset in bytes
 * @param {String} name type name
 * @returns {SolidityParam} param
 */
SolidityType.prototype.decode = function (bytes, offset, name) {
    if (this.isDynamicArray(name)) {
        var arrayOffset = parseInt('0x' + bytes.substr(offset * 2, 64)); // in bytes
        var length = parseInt('0x' + bytes.substr(arrayOffset * 2, 64)); // in int
        var arrayStart = arrayOffset + 32; // array starts after length; // in bytes

        var nestedName = this.nestedName(name);
        var nestedStaticPartLength = this.staticPartLength(nestedName);  // in bytes
        var result = [];

        for (var i = 0; i < length * nestedStaticPartLength; i += nestedStaticPartLength) {
            result.push(this.decode(bytes, arrayStart + i, nestedName));
        }

        return result;
    } else if (this.isStaticArray(name)) {
        var length = this.staticArrayLength(name);                      // in int
        var arrayStart = offset;                                        // in bytes

        var nestedName = this.nestedName(name);
        var nestedStaticPartLength = this.staticPartLength(nestedName); // in bytes
        var result = [];

        for (var i = 0; i < length * nestedStaticPartLength; i += nestedStaticPartLength) {
            result.push(this.decode(bytes, arrayStart + i, nestedName));
        }

        return result;
    }

    var length = this.staticPartLength(name);
    return this._outputFormatter(new SolidityParam(bytes.substr(offset * 2, length * 2)));
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

    var solidityTypes = types.map(function (type) {
        return self._requireType(type);
    });

    var offsets = solidityTypes.map(function (solidityType, index) {
        return solidityType.staticPartLength(types[index]); 
        // get length
    }).map(function (length, index, lengths) {
         // sum with length of previous element
        return length + (lengths[index - 1] || 0);
    }).map(function (length, index) { 
        // remove the current length, so the length is sum of previous elements
        return length - solidityTypes[index].staticPartLength(types[index]);
    });
        
    return solidityTypes.map(function (solidityType, index) {
        return solidityType.decode(bytes, offsets[index],  types[index], index);
    });
};

var SolidityTypeAddress = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputAddress;
};

SolidityTypeAddress.prototype = new SolidityType({});
SolidityTypeAddress.prototype.constructor = SolidityTypeAddress;

SolidityTypeAddress.prototype.isType = function (name) {
    return !!name.match(/address(\[([0-9]*)\])?/);
};

SolidityTypeAddress.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeAddress.prototype.isDynamicArray = function (name) {
    var matches = name.match(/address(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[1] && !matches[2];
};

SolidityTypeAddress.prototype.isStaticArray = function (name) {
    var matches = name.match(/address(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[1] && !!matches[2];
};

SolidityTypeAddress.prototype.staticArrayLength = function (name) {
    return name.match(/address(\[([0-9]*)\])?/)[2] || 1;
};



SolidityTypeAddress.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

SolidityTypeAddress.prototype.formatOutput = function (param, unused, name) {
    if (this.isStaticArray(name)) {
        var staticPart = param.staticPart();
        var result = [];
        for (var i = 0; i < staticPart.length; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(staticPart.substr(0, i + 64))));
        } 
        return result;
    } else if (this.isDynamicArray(name)) {
        var dynamicPart = param.dynamicPart();
        var result = [];
        // first position of dynamic part is the length of the array
        var length = new BigNumber(param.dynamicPart().slice(0, 64), 16);
        for (var i = 0; i < length * 64; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(dynamicPart.substr(i + 64, 64))));
        }
        return result;
    }
    
    return this._outputFormatter(param);
};

var SolidityTypeBool = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputBool;
    this._outputFormatter = f.formatOutputBool;
};

SolidityTypeBool.prototype = new SolidityType({});
SolidityTypeBool.prototype.constructor = SolidityTypeBool;

SolidityTypeBool.prototype.isType = function (name) {
    return name === 'bool';
};

SolidityTypeBool.prototype.staticPartLength = function (name) {
    return 32;
};

SolidityTypeBool.prototype.decode = function (bytes, offset, type) {
    return new SolidityParam(bytes.substr(offset * 2, 64));
};

var SolidityTypeInt = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputInt;
};

SolidityTypeInt.prototype = new SolidityType({});
SolidityTypeInt.prototype.constructor = SolidityTypeInt;

SolidityTypeInt.prototype.isType = function (name) {
    return !!name.match(/^int([0-9]{1,3})?/);
};

SolidityTypeInt.prototype.staticPartLength = function (name) {
    return 32;
};

var SolidityTypeUInt = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputUInt;
};

SolidityTypeUInt.prototype = new SolidityType({});
SolidityTypeUInt.prototype.constructor = SolidityTypeUInt;

SolidityTypeUInt.prototype.isType = function (name) {
    return !!name.match(/^uint([0-9]{1,3})?/);
};

SolidityTypeUInt.prototype.staticPartLength = function (name) {
    return 32;
};

var SolidityTypeDynamicBytes = function () {
    this._mode = 'bytes';
    this._inputFormatter = f.formatInputDynamicBytes;
    this._outputFormatter = f.formatOutputDynamicBytes;
};

SolidityTypeDynamicBytes.prototype = new SolidityType({});
SolidityTypeDynamicBytes.prototype.constructor = SolidityTypeDynamicBytes;

SolidityTypeDynamicBytes.prototype.staticPartLength = function (name) {
    return 32;
};

SolidityTypeDynamicBytes.prototype.isType = function (name) {
    return name === 'bytes';
};

var SolidityTypeBytes = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputBytes;
    this._outputFormatter = f.formatOutputBytes;
};

SolidityTypeBytes.prototype = new SolidityType({});
SolidityTypeBytes.prototype.constructor = SolidityTypeBytes;

SolidityTypeBytes.prototype.isType = function (name) {
    return !!name.match(/^bytes([0-9]{1,3})/);
};

SolidityTypeBytes.prototype.staticPartLength = function (name) {
    return parseInt(name.match(/^bytes([0-9]{1,3})/)[1]);
};

var SolidityTypeString = function () {
    this._mode = 'bytes';
    this._inputFormatter = f.formatInputString;
    this._outputFormatter = f.formatOutputString;
};

SolidityTypeString.prototype = new SolidityType({});
SolidityTypeString.prototype.constructor = SolidityTypeString;

SolidityTypeString.prototype.isType = function (name) {
    return name === 'string';
};

SolidityTypeString.prototype.staticPartLength = function (name) {
    return 32;
};

var SolidityTypeReal = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputReal;
    this._outputFormatter = f.formatOutputReal;
};

SolidityTypeReal.prototype = new SolidityType({});
SolidityTypeReal.prototype.constructor = SolidityTypeReal;

SolidityTypeReal.prototype.isType = function (name) {
    return !!name.match(/^real([0-9]{1,3})?/);
};

SolidityTypeReal.prototype.staticPartLength = function (name) {
    return 32;
};

var SolidityTypeUReal = function () {
    this._mode = 'value';
    this._inputFormatter = f.formatInputReal;
    this._outputFormatter = f.formatOutputUReal;
};

SolidityTypeUReal.prototype = new SolidityType({});
SolidityTypeUReal.prototype.constructor = SolidityTypeUReal;

SolidityTypeUReal.prototype.isType = function (name) {
    return !!name.match(/^ureal([0-9]{1,3})?/);
};

SolidityTypeUReal.prototype.staticPartLength = function (name) {
    return 32;
};

var coder = new SolidityCoder([
    new SolidityTypeAddress(),
    new SolidityTypeBool(),
    new SolidityTypeInt(),
    new SolidityTypeUInt(),
    new SolidityTypeDynamicBytes(),
    new SolidityTypeBytes(),
    new SolidityTypeString(),
    new SolidityTypeReal(),
    new SolidityTypeUReal()
]);

module.exports = coder;

