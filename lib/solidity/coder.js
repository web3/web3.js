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
var SolidityParam = f.SolidityParam;

var isArrayType = function (type) {
    return type.slice(-2) === '[]';
};

var SolidityType = function (config) {
    this._name = config.name;
    this._match = config.match;
    this._mode = config.mode;
    this._inputFormatter = config.inputFormatter;
    this._outputFormatter = config.outputFormatter;
};

SolidityType.prototype.isType = function (name) {
    if (this._match === 'strict') {
        return this._name === name || (name.indexOf(this._name) === 0 && name.slice(this._name.length) === '[]');
    } else if (this._match === 'prefix') {
        // TODO better type detection!
        return name.indexOf(this._name) === 0;
    };
};

SolidityType.prototype.formatInput = function (param, arrayType) {
    if (utils.isArray(param) && arrayType) { // TODO: should fail if this two are not the same
        var self = this;
        return param.map(function (p) {
            return self._inputFormatter(p);
        }).reduce(function (acc, current) {
            acc.suffix += current.value;
            acc.prefix += current.prefix;
            // TODO: suffix not supported = it's required for nested arrays;
            return acc;
        }, new SolidityParam('', f.formatInputInt(param.length).value));
    } 
    return this._inputFormatter(param);
};

SolidityType.prototype.formatOutput = function (param, arrayType) {
    if (arrayType) {
        // let's assume, that we solidity will never return long arrays :P 
        var result = [];
        var length = new BigNumber(param.prefix, 16);
        for (var i = 0; i < length * 64; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(param.suffix.slice(i, i + 64))));
        };
        return result;
    }
    return this._outputFormatter(param);
};

SolidityType.prototype.isVariadicType = function (type) {
    return isArrayType(type) || this._mode === 'bytes';
};

SolidityType.prototype.shiftParam = function (type, param) {
    if (this._mode === 'bytes') {
        return param.shiftBytes();
    } else if (isArrayType(type)) {
        var length = new BigNumber(param.prefix.slice(0, 64), 16);
        return param.shiftArray(length);
    }
    return param.shiftValue();
};

var SolidityCoder = function (types) {
    this._types = types;
};

SolidityCoder.prototype._requireType = function (type) {
    var solidityType = this._types.filter(function (t) {
        return t.isType(type);
    })[0];

    if (!solidityType) {
        throw Error('invalid solidity type!: ' + type);
    }

    return solidityType;
};

SolidityCoder.prototype._bytesToParam = function (types, bytes) {
    var self = this;
    var prefixTypes = types.reduce(function (acc, type) {
        return self._requireType(type).isVariadicType(type) ? acc + 1 : acc;
    }, 0);
    var valueTypes = types.length - prefixTypes;

    var prefix = bytes.slice(0, prefixTypes * 64);
    bytes = bytes.slice(prefixTypes * 64);
    var value = bytes.slice(0, valueTypes * 64);
    var suffix = bytes.slice(valueTypes * 64);
    return new SolidityParam(value, prefix, suffix); 
};

SolidityCoder.prototype._formatInput = function (type, param) {
    return this._requireType(type).formatInput(param, isArrayType(type));
};

SolidityCoder.prototype.encodeParam = function (type, param) {
    return this._formatInput(type, param).encode();
};

SolidityCoder.prototype.encodeParams = function (types, params) {
    var self = this;
    return types.map(function (type, index) {
        return self._formatInput(type, params[index]);
    }).reduce(function (acc, solidityParam) {
        acc.append(solidityParam);
        return acc;
    }, new SolidityParam()).encode();
};

SolidityCoder.prototype._formatOutput = function (type, param) {
    return this._requireType(type).formatOutput(param, isArrayType(type));
};

SolidityCoder.prototype.decodeParam = function (type, bytes) {
    return this._formatOutput(type, this._bytesToParam([type], bytes));
};

SolidityCoder.prototype.decodeParams = function (types, bytes) {
    var self = this;
    var param = this._bytesToParam(types, bytes);
    return types.map(function (type) {
        var solidityType = self._requireType(type);
        var p = solidityType.shiftParam(type, param);
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
        match: 'prefix',
        mode: 'bytes',
        inputFormatter: f.formatInputString,
        outputFormatter: f.formatOutputString
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

