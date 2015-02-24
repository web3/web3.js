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

var c = require('./const');

if (process.env.NODE_ENV !== 'build') {
    var BigNumber = require('bignumber.js'); // jshint ignore:line
}

/// Finds first index of array element matching pattern
/// @param array
/// @param callback pattern
/// @returns index of element
var findIndex = function (array, callback) {
    var end = false;
    var i = 0;
    for (; i < array.length && !end; i++) {
        end = callback(array[i]);
    }
    return end ? i - 1 : -1;
};

/// @returns ascii string representation of hex value prefixed with 0x
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
    
var toHex = function(str) {
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var n = str.charCodeAt(i).toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return hex;
};

/// @returns hex representation (prefixed by 0x) of ascii string
var fromAscii = function(str, pad) {
    pad = pad === undefined ? 0 : pad;
    var hex = toHex(str);
    while (hex.length < pad*2)
        hex += "00";
    return "0x" + hex;
};

/// @returns display name for function/event eg. multiply(uint256) -> multiply
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

/// Filters all function from input abi
/// @returns abi array with filtered objects of type 'function'
var filterFunctions = function (json) {
    return json.filter(function (current) {
        return current.type === 'function'; 
    }); 
};

/// Filters all events form input abi
/// @returns abi array with filtered objects of type 'event'
var filterEvents = function (json) {
    return json.filter(function (current) {
        return current.type === 'event';
    });
};

/// used to transform value/string to eth string
/// TODO: use BigNumber.js to parse int
/// TODO: add tests for it!
var toEth = function (str) {

    console.warn('This method is deprecated please use eth.fromWei(number, unit) instead.');

    var val = typeof str === "string" ? str.indexOf('0x') === 0 ? parseInt(str.substr(2), 16) : parseInt(str) : str;
    var unit = 0;
    var units = c.ETH_UNITS;
    while (val > 3000 && unit < units.length - 1)
    {
        val /= 1000;
        unit++;
    }
    var s = val.toString().length < val.toFixed(2).length ? val.toString() : val.toFixed(2);
    var replaceFunction = function($0, $1, $2) {
        return $1 + ',' + $2;
    };

    while (true) {
        var o = s;
        s = s.replace(/(\d)(\d\d\d[\.\,])/, replaceFunction);
        if (o === s)
            break;
    }
    return s + ' ' + units[unit];
};


var toDecimal = function (val) {
    // remove 0x and place 0, if it's required
    val = val.length > 2 ? val.substring(2) : "0";
    return (new BigNumber(val, 16).toString(10));
};

var fromDecimal = function (val) {
    return "0x" + (new BigNumber(val).toString(16));
};


/**
Takes a number of wei and converts it to any other ether unit.

Possible units are:

    - kwei/ada
    - mwei/babbage
    - gwei/shannon
    - szabo
    - finney
    - ether
    - kether/grand/einstein
    - mether
    - gether
    - tether

@method fromWei
@param {Number|String} number can be a number, number string or a HEX of a decimal
@param {String} unit the unit to convert to
@return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
*/
var fromWei = function(number, unit) {
    var isBigNumber = true;

    if(!number)
        return number;

    if(typeof number === 'string' && number.indexOf('0x') === 0)
        number = toDecimal(number);
    
    if(!(number instanceof BigNumber)) {
        isBigNumber = false;
        number = new BigNumber(number.toString()); // toString to prevent errors, the user have to handle giving correct bignums themselves
    }


    unit = unit.toLowerCase();

    switch(unit) {
        case 'kwei':
        case 'ada':
            number = number.dividedBy(1000);
            break;
        case 'mwei':
        case 'babbage':
            number = number.dividedBy(1000000);
            break;
        case 'gwei':
        case 'schannon':
            number = number.dividedBy(1000000000);
            break;
        case 'szabo':
            number = number.dividedBy(1000000000000);
            break;
        case 'finney':
            number = number.dividedBy(1000000000000000);
            break;
        case 'ether':
            number = number.dividedBy(1000000000000000000);
            break;
        case 'kether':
        case 'grand':
        case 'einstein':
            number = number.dividedBy(1000000000000000000000);
            break;
        case 'mether':
            number = number.dividedBy(1000000000000000000000000);
            break;
        case 'gether':
            number = number.dividedBy(1000000000000000000000000000);
            break;
        case 'tether':
            number = number.dividedBy(1000000000000000000000000000000);
            break;
    }

    return (isBigNumber) ? number : number.toString(10);
};

/**
Takes a number of a unit and converts it to wei.

Possible units are:

    - kwei/ada
    - mwei/babbage
    - gwei/shannon
    - szabo
    - finney
    - ether
    - kether/grand/einstein
    - mether
    - gether
    - tether

@method toWei
@param {Number|String} number can be a number, number string or a HEX of a decimal
@param {String} unit the unit to convert to
@return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
*/
var toWei = function(number, unit) {
    var isBigNumber = true;

    if(!number)
        return number;

    if(typeof number === 'string' && number.indexOf('0x') === 0)
        number = toDecimal(number);

    if(!(number instanceof BigNumber)) {
        isBigNumber = false;
        number = new BigNumber(number.toString());// toString to prevent errors, the user have to handle giving correct bignums themselves
    }


    unit = unit.toLowerCase();

    switch(unit) {
        case 'kwei':
        case 'ada':
            number = number.times(1000);
            break;
        case 'mwei':
        case 'babbage':
            number = number.times(1000000);
            break;
        case 'gwei':
        case 'schannon':
            number = number.times(1000000000);
            break;
        case 'szabo':
            number = number.times(1000000000000);
            break;
        case 'finney':
            number = number.times(1000000000000000);
            break;
        case 'ether':
            number = number.times(1000000000000000000);
            break;
        case 'kether':
        case 'grand':
        case 'einstein':
            number = number.times(1000000000000000000000);
            break;
        case 'mether':
            number = number.times(1000000000000000000000000);
            break;
        case 'gether':
            number = number.times(1000000000000000000000000000);
            break;
        case 'tether':
            number = number.times(1000000000000000000000000000000);
            break;
    }

    return (isBigNumber) ? number : number.toString(10);
};


/**
Checks if the given string is a valid ethereum HEX address.

@method isAddress
@param {String} address the given HEX adress
@return {Boolean}
*/
var isAddress = function(address) {
    if(address.indexOf('0x') === 0 && address.length !== 42)
        return false;
    if(address.indexOf('0x') === -1 && address.length !== 40)
        return false;

    return /^\w+$/.test(address);
};


module.exports = {
    findIndex: findIndex,
    toDecimal: toDecimal,
    fromDecimal: fromDecimal,
    toAscii: toAscii,
    fromAscii: fromAscii,
    extractDisplayName: extractDisplayName,
    extractTypeName: extractTypeName,
    filterFunctions: filterFunctions,
    filterEvents: filterEvents,
    toEth: toEth,
    toWei: toWei,
    fromWei: fromWei,
    isAddress: isAddress
};

