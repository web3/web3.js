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

SolidityParam.prototype.dynamicPartLength = function () {
    return this.dynamicPart().length / 2;
};

SolidityParam.prototype.withOffset = function (offset) {
    return new SolidityParam(this.value, offset);
};

SolidityParam.prototype.combine = function (param) {
    return new SolidityParam(this.value + param.value); 
};

SolidityParam.prototype.isDynamic = function () {
    return this.value.length > 64;
};

SolidityParam.prototype.offsetAsBytes = function () {
    if (!this.isDynamic()) {
        return '';
    }
    return utils.padLeft(utils.toTwosComplement(this.offset).toString(16), 64);
};

SolidityParam.prototype.staticPart = function () {
    if (!this.isDynamic()) {
        return this.value; 
    } 
    return this.offsetAsBytes();
};

SolidityParam.prototype.dynamicPart = function () {
    return this.isDynamic() ? this.value : '';
};

SolidityParam.prototype.encode = function () {
    return this.staticPart() + this.dynamicPart();
};

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

SolidityParam.decodeParam = function (bytes, index) {
    index = index || 0;
    return new SolidityParam(bytes.substr(index * 64, 64)); 
};

var getOffset = function (bytes, index) {
    // we can do this cause offset is rather small
    return parseInt('0x' + bytes.substr(index * 64, 64));
};

SolidityParam.decodeBytes = function (bytes, index) {
    index = index || 0;
    //TODO add support for strings longer than 32 bytes
    //var length = parseInt('0x' + bytes.substr(offset * 64, 64));

    var offset = getOffset(bytes, index);

    // 2 * , cause we also parse length
    return new SolidityParam(bytes.substr(offset * 2, 2 * 64));
};

SolidityParam.decodeArray = function (bytes, index) {
    index = index || 0;
    var offset = getOffset(bytes, index);
    var length = parseInt('0x' + bytes.substr(offset * 2, 64));
    return new SolidityParam(bytes.substr(offset * 2, (length + 1) * 64));
};

/**
 * This method should be used to encode two params one after another
 *
 * @method append
 * @param {SolidityParam} param that it appended after this
 */
//SolidityParam.prototype.append = function (param) {
    //this.prefix += param.prefix;
    //this.suffix += param.suffix;
//};

/**
 * This method should be used to encode next param in an array
 *
 * @method appendArrayElement
 * @param {SolidityParam} param that is appended to an array
 */
//SolidityParam.prototype.appendArrayElement = function (param) {
    //this.value += param.value;
//};

/**
 * This method should be used to create bytearrays from param
 *
 * @method encode
 * @return {String} encoded param(s)
 */
//SolidityParam.prototype.encode = function () {
    //return this.offset + this.value;
//};

/**
 * This method should be used to shift first param from group of params
 *
 * @method shiftValue
 * @return {SolidityParam} first prefix param
 */
//SolidityParam.prototype.shiftValue = function () {
    //var suffix = this.suffix.slice(0, 64);
    //this.suffix = this.suffix.slice(64);
    //return new SolidityParam('', suffix);
//};

/**
 * This method should be used to first bytes param from group of params
 *
 * @method shiftBytes
 * @return {SolidityParam} first bytes param
 */
//SolidityParam.prototype.shiftBytes = function () {
    //return this.shiftArray(1);   
//};

/**
 * This method should be used to shift an array from group of params 
 * 
 * @method shiftArray
 * @param {Number} size of an array to shift
 * @return {SolidityParam} first array param
 */
//SolidityParam.prototype.shiftArray = function (length) {
    //var prefix = this.prefix.slice(0, 64);
    //this.prefix = this.prefix.slice(64);
    //var suffix = this.suffix.slice(0, 64 * length);
    //this.suffix = this.suffix.slice(64 * length);
    //return new SolidityParam(prefix, suffix);
//};

/**
 * This method should be used to create new parram by swapping it's prefix and suffix
 *
 * @method swap
 * @return {SolidityParam} param with swaped bytes
 */
//SolidityParam.prototype.swap = function () {
    //return new SolidityParam(this.suffix, this.prefix);
//};

module.exports = SolidityParam;

