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

/**
 * SolidityParam object prototype.
 * Should be used when encoding, decoding solidity bytes
 */
var SolidityParam = function (value, prefix, suffix) {
    this.prefix = prefix || '';
    this.value = value || '';
    this.suffix = suffix || '';
};

/**
 * This method should be used to encode two params one after another
 *
 * @method append
 * @param {SolidityParam} param that it appended after this
 */
SolidityParam.prototype.append = function (param) {
    this.prefix += param.prefix;
    this.value += param.value;
    this.suffix += param.suffix;
};

/**
 * This method should be used to encode next param in an array
 *
 * @method appendArrayElement
 * @param {SolidityParam} param that is appended to an array
 */
SolidityParam.prototype.appendArrayElement = function (param) {
    this.suffix += param.value;
    this.prefix += param.prefix;
    // TODO: suffix not supported = it's required for nested arrays;
};

/**
 * This method should be used to create bytearrays from param
 *
 * @method encode
 * @return {String} encoded param(s)
 */
SolidityParam.prototype.encode = function () {
    return this.prefix + this.value + this.suffix;
};

/**
 * This method should be used to shift first param from group of params
 *
 * @method shiftValue
 * @return {SolidityParam} first value param
 */
SolidityParam.prototype.shiftValue = function () {
    var value = this.value.slice(0, 64);
    this.value = this.value.slice(64);
    return new SolidityParam(value);
};

/**
 * This method should be used to first bytes param from group of params
 *
 * @method shiftBytes
 * @return {SolidityParam} first bytes param
 */
SolidityParam.prototype.shiftBytes = function () {
    return this.shiftArray(1);   
};

/**
 * This method should be used to shift an array from group of params 
 * 
 * @method shiftArray
 * @param {Number} size of an array to shift
 * @return {SolidityParam} first array param
 */
SolidityParam.prototype.shiftArray = function (length) {
    var prefix = this.prefix.slice(0, 64);
    this.prefix = this.value.slice(64);
    var suffix = this.suffix.slice(0, 64 * length);
    this.suffix = this.suffix.slice(64 * length);
    return new SolidityParam('', prefix, suffix);
};

/**
 * This method should be used to check if param is empty
 *
 * @method empty
 * @return {Bool} true if is empty, otherwise false
 */
SolidityParam.prototype.empty = function () {
    return !this.value.length && !this.prefix.length && !this.suffix.length;
};

module.exports = SolidityParam;

