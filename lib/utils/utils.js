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
/** @file utils.js
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
 * @class [utils] utils
 * @constructor
 */

var BigNumber = require('bignumber.js');

var unitMap = {
    'wei':      '1',
    'kwei':     '1000',
    'ada':      '1000',
    'mwei':     '1000000',
    'babbage':  '1000000',
    'gwei':     '1000000000',
    'shannon':  '1000000000',
    'szabo':    '1000000000000',
    'finney':   '1000000000000000',
    'ether':    '1000000000000000000',
    'kether':   '1000000000000000000000',
    'grand':    '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether':   '1000000000000000000000000',
    'gether':   '1000000000000000000000000000',
    'tether':   '1000000000000000000000000000000'
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

/** Finds first index of array element matching pattern
 *
 * @method findIndex
 * @param {Array}
 * @param {Function} pattern
 * @returns {Number} index of element
 */
var findIndex = function (array, callback) {
    var end = false;
    var i = 0;
    for (; i < array.length && !end; i++) {
        end = callback(array[i]);
    }
    return end ? i - 1 : -1;
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
 * @method fromAscii
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
 * Filters all functions from input abi
 *
 * @method filterFunctions
 * @param {Array} abi
 * @returns {Array} abi array with filtered objects of type 'function'
 */
var filterFunctions = function (json) {
    return json.filter(function (current) {
        return current.type === 'function'; 
    }); 
};

/**
 * Filters all events from input abi
 *
 * @method filterEvents
 * @param {Array} abi
 * @returns {Array} abi array with filtered objects of type 'event'
 */
var filterEvents = function (json) {
    return json.filter(function (current) {
        return current.type === 'event';
    });
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
 * - kwei/ada
 * - mwei/babbage
 * - gwei/shannon
 * - szabo
 * - finney
 * - ether
 * - kether/grand/einstein
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
 * - kwei/ada
 * - mwei/babbage
 * - gwei/shannon
 * - szabo
 * - finney
 * - ether
 * - kether/grand/einstein
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
 * Checks if the given string has proper length
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    return /^0x[0-9a-f]{40}$/.test(address);
};

/**
 * Transforms given string to valid 20 bytes-length addres with 0x prefix
 *
 * @method toAddress
 * @param {String} address
 * @return {String} formatted address
 */
var toAddress = function (address) {
    if (isAddress(address)) {
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

module.exports = {
    padLeft: padLeft,
    findIndex: findIndex,
    toHex: toHex,
    toDecimal: toDecimal,
    fromDecimal: fromDecimal,
    toAscii: toAscii,
    fromAscii: fromAscii,
    extractDisplayName: extractDisplayName,
    extractTypeName: extractTypeName,
    filterFunctions: filterFunctions,
    filterEvents: filterEvents,
    toWei: toWei,
    fromWei: fromWei,
    toBigNumber: toBigNumber,
    toTwosComplement: toTwosComplement,
    toAddress: toAddress,
    isBigNumber: isBigNumber,
    isAddress: isAddress,
    isFunction: isFunction,
    isString: isString,
    isObject: isObject,
    isBoolean: isBoolean,
    isArray: isArray,
    isJson: isJson
};

