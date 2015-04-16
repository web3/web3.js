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
/** @file types.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var BigNumber = require('bignumber.js');
var utils = require('../utils/utils');
var f = require('./formatters');
var SolidityInputParam = f.SolidityInputParam;

/// @param expected type prefix (string)
/// @returns function which checks if type has matching prefix. if yes, returns true, otherwise false
var prefixedType = function (prefix) {
    return function (type) {
        return type.indexOf(prefix) === 0;
    };
};

/// @param expected type name (string)
/// @returns function which checks if type is matching expected one. if yes, returns true, otherwise false
var namedType = function (name) {
    return function (type) {
        return name === type;
    };
};

/// Setups output formaters for solidity types
/// @returns an array of output formatters
var outputTypes = function () {

    return [
        { type: prefixedType('uint'), format: f.formatOutputUInt },
        { type: prefixedType('int'), format: f.formatOutputInt },
        { type: prefixedType('bytes'), format: f.formatOutputString },
        { type: prefixedType('real'), format: f.formatOutputReal },
        { type: prefixedType('ureal'), format: f.formatOutputUReal },
        { type: namedType('address'), format: f.formatOutputAddress },
        { type: namedType('bool'), format: f.formatOutputBool }
    ];
};

var SolidityType = function (name, inputFormatter, outputFormatter) {
    this.name = name;
    this.inputFormatter = inputFormatter;
    this.outputFormatter = outputFormatter;
};

SolidityType.prototype.isType = function (name) {
    return this.name === name || (name.indexOf(this.name) === 0 && name.slice(this.name.length) === '[]');
};

SolidityType.prototype.formatInput = function (param) {
    if (utils.isArray(param)) {
        var self = this;
        return param.map(function (p) {
            return self.inputFormatter(p);
        }).reduce(function (acc, current) {
            acc.suffix += current.value;
            acc.prefix += current.prefix;
            // TODO: suffix not supported = it's required for nested arrays;
            return acc;
        }, new SolidityInputParam('', f.formatInputInt(param.length).value));
    } 
    return this.inputFormatter(param);
};

var SolidityPrefixedType = function () {
    SolidityType.apply(this, arguments);
};

SolidityPrefixedType.prototype = Object.create(SolidityType.prototype);

SolidityPrefixedType.prototype.isType = function (name) {
    // TODO better type detection!
    return name.indexOf(this.name) === 0;
};

var SolidityFormatter = function (types) {
    this.types = types;
};

SolidityFormatter.prototype.formatInput = function (type, param) {
    var solidityType = this.types.filter(function (t) {
        return t.isType(type);
    })[0];

    if (!solidityType) {
        throw Error('invalid solidity type!: ' + type);
    }

    return solidityType.formatInput(param);
};

var sf = new SolidityFormatter([
    new SolidityType('address', f.formatInputInt),
    new SolidityType('bool', f.formatInputBool),
    new SolidityPrefixedType('int', f.formatInputInt),
    new SolidityPrefixedType('uint', f.formatInputInt),
    new SolidityPrefixedType('bytes', f.formatInputString),
    new SolidityPrefixedType('real', f.formatInputReal),
    new SolidityPrefixedType('ureal', f.formatInputReal)
]);

module.exports = {
    sf: sf,
    prefixedType: prefixedType,
    namedType: namedType,
    //inputTypes: inputTypes,
    outputTypes: outputTypes
};

