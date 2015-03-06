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

var c = require('./config');

if (process.env.NODE_ENV !== 'build') {
    var BigNumber = require('bignumber.js'); // jshint ignore:line
}

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
    
var toHexNative = function(str) {
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
    var hex = toHexNative(str);
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
// DEPRECATED
var toEth = function (str) {
     /*jshint maxcomplexity:7 */
    var val = typeof str === "string" ? str.indexOf('0x') === 0 ? parseInt(str.substr(2), 16) : parseInt(str.replace(/,/g,'').replace(/ /g,'')) : str;
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

    // pass it through is its already a number
    if(typeof val === 'number' || (typeof val === 'string' && val.indexOf('0x') === -1))
        return val;

    // remove 0x and place 0, if it's required
    val = val.length > 2 ? val.substring(2) : "0";
    return new BigNumber(val, 16).toNumber(); //.toString(10));
};

var fromDecimal = function (val) {
    return "0x" + (new BigNumber(val).toString(16));
};


var toHex = function (val) {
    /*jshint maxcomplexity:5 */

    // pass it through is its already a number
    if(typeof val === 'object')
        return fromAscii(JSON.stringify(val));

    // pass it through is its already a number
    if(typeof val === 'string' && val.indexOf('0x') === 0)
        return val;

    if(typeof val === 'string' && !isFinite(val))
        return fromAscii(val);

    if(isFinite(val))
        return fromDecimal(val);

    return val;
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
    /*jshint maxcomplexity: 6 */
    unit = unit.toLowerCase();

    var isBigNumber = true;

    if(!unitMap[unit]) {
        console.warn('This unit doesn\'t exists, please use the one of the following units' , unitMap);
        return number;
    }

    if(!number)
        return number;

    if(typeof number === 'string' && number.indexOf('0x') === 0) {
        isBigNumber = false;
        number = new BigNumber(number, 16);
    }
    
    if(!(number instanceof BigNumber)) {
        isBigNumber = false;
        number = new BigNumber(number.toString(10), 10); // toString to prevent errors, the user have to handle giving correct bignums themselves
    }

    number = number.dividedBy(new BigNumber(unitMap[unit], 10));

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
@param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
@param {String} unit the unit to convert to
@return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
*/
var toWei = function(number, unit) {
    /*jshint maxcomplexity: 6 */
    unit = unit.toLowerCase();

    var isBigNumber = true;

    if(!unitMap[unit]) {
        console.warn('This unit doesn\'t exists, please use the one of the following units' , unitMap);
        return number;
    }

    if(!number)
        return number;

    if(typeof number === 'string' && number.indexOf('0x') === 0) {
        isBigNumber = false;
        number = new BigNumber(number, 16);
    }

    if(!(number instanceof BigNumber)) {
        isBigNumber = false;
        number = new BigNumber(number.toString(10), 10);// toString to prevent errors, the user have to handle giving correct bignums themselves
    }


    number = number.times(new BigNumber(unitMap[unit], 10));

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


/**
Takes an input and transforms it into an bignumber

@method toBigNumber
@param {Number|String|BigNumber} a number, string, HEX string or BigNumber
@return {Object} BigNumber
*/
var toBigNumber = function(number) {
    if(number instanceof BigNumber)
        return number;

    if(number) {
        if(typeof number === 'string' && number.indexOf('0x') === 0)
            number = new BigNumber(number, 16);
        else
            number = new BigNumber(number.toString(10), 10);
    }

    return number;
};


module.exports = {
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
    toEth: toEth,
    toWei: toWei,
    fromWei: fromWei,
    toBigNumber: toBigNumber,
    isAddress: isAddress
};

