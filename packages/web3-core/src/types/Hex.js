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
 * @file Hex.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @author Marek Kotewicz <marek@parity.io>
 * @date 2019
 */

import utf8 from 'utf8';
import BN from 'bn.js';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import randombytes from 'randombytes';
import Address from './Address';
import {BigNumber} from '@ethersproject/bignumber';

export default class Hex {
    /**
     * @param {String} value
     *
     * @constructor
     */
    constructor(value) {
        if (!Hex.isValid(value)) {
            throw new Error('The given value must be a valid HEX string.');
        }

        this.sign = this.getSign(value);
        this.value = Hex.stripPrefix(value);
    }

    /**
     * Returns the sign from a hex string.
     *
     * @method getSign
     *
     * @param {String} value
     *
     * @returns {String}
     */
    getSign(value) {
        if (value.startsWith('-')) {
            return '-';
        }

        return '';
    }

    /**
     * Returns the hex string with the '0x' prefix added.
     *
     * @method toString
     *
     * @returns {String}
     */
    toString() {
        return this.sign + '0x' + this.value;
    }

    /**
     * Returns the given hex string as number.
     *
     * @method toNumber
     *
     * @returns {Number}
     */
    toNumber() {
        return this.toBigNumber().toNumber();
    }

    /**
     * Returns the given hex string as string number.
     *
     * @method toNumberString
     *
     * @returns {String}
     */
    toNumberString() {
        return this.toBigNumber().toString();
    }

    /**
     * Return the given hex string as BigNumber object
     *
     * @method toBigNumber
     *
     * @returns {BigNumber}
     */
    toBigNumber() {
        return BigNumber.from(this.toString());
    }

    /**
     * Takes and input transforms it into BN and if it is negative value, into two's complement
     *
     * @method toTwosComplement
     *
     * @returns {String}
     */
    toTwosComplement() {
        return Hex.leftPad(
            this.toBigNumber()
                .toTwos(256)
                .toHexString(),
            64
        );
    }

    /**
     * Returns the given hex string as bytes array
     *
     * @method toBytes
     *
     * @returns {Array}
     */
    toBytes() {
        let hex = this.value;

        if (hex % 2) {
            hex = '0' + this.value;
        }

        let bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }

        return bytes;
    }

    /**
     * Returns the hex string as ASCII string
     *
     * @method toAscii
     *
     * @returns {String}
     */
    toAscii() {
        let value = '';
        const l = this.value.length;

        for (let i = 0; i < l; i += 2) {
            const code = parseInt(this.value.substr(i, 2), 16);
            value += String.fromCharCode(code);
        }

        return value;
    }

    /**
     * Return the hex string as UTF8
     *
     * @method toUTF8
     *
     * @returns {String}
     */
    toUTF8() {
        let string = '';
        let code = 0;
        let hex = this.value;

        // remove 00 padding from either side
        hex = hex.replace(/^(?:00)*/, '');
        hex = hex
            .split('')
            .reverse()
            .join('');
        hex = hex.replace(/^(?:00)*/, '');
        hex = hex
            .split('')
            .reverse()
            .join('');

        const l = hex.length;

        for (let i = 0; i < l; i += 2) {
            code = parseInt(hex.substr(i, 2), 16);
            // if (code !== 0) {
            string += String.fromCharCode(code);
            // }
        }

        return utf8.decode(string);
    }

    /**
     * Static constructor function for UTF8 values.
     *
     * @method fromUTF8
     *
     * @param {String} value
     *
     * @returns {Hex}
     */
    static fromUTF8(value) {
        value = utf8.encode(value);
        let hex = '';

        /* eslint-disable no-control-regex */
        // remove \u0000 padding from either side
        value = value.replace(/^(?:\u0000)*/, '');
        value = value
            .split('')
            .reverse()
            .join('');
        value = value.replace(/^(?:\u0000)*/, '');
        value = value
            .split('')
            .reverse()
            .join('');
        /* eslint-enable no-control-regex */

        for (let i = 0; i < value.length; i++) {
            const code = value.charCodeAt(i);
            // if (code !== 0) {
            const n = code.toString(16);
            hex += n.length < 2 ? `0${n}` : n;
            // }
        }

        return new Hex('0x' + hex);
    }

    /**
     * Static constructor function for ASCII values.
     *
     * @method fromASCII
     *
     * @param {String} value
     * @param {Number} length
     *
     * @returns {Hex}
     */
    static fromAscii(value, length = 32) {
        let hex = '';

        for (let i = 0; i < value.length; i++) {
            const code = value.charCodeAt(i);
            const n = code.toString(16);
            hex += n.length < 2 ? `0${n}` : n;
        }

        return new Hex(Hex.rightPad(hex, length * 2));
    }

    /**
     * Static method to right pad the given string to the expected length.
     *
     * @method rightPad
     *
     * @param {String} string
     * @param {Number} chars
     * @param {String} sign
     *
     * @returns {String}
     */
    static rightPad(string, chars, sign) {
        string = Hex.stripPrefix(string.toString(16));

        const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

        return '0x' + string + new Array(padding).join(sign || '0');
    }

    /**
     * Static method to left pad the given string to the expected length.
     *
     * @method leftPad
     *
     * @param {String} string
     * @param {Number} chars
     * @param {String} sign
     *
     * @returns {Hex}
     */
    static leftPad(string, chars, sign) {
        string = Hex.stripPrefix(string.toString(16));

        const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

        return '0x' + new Array(padding).join(sign || '0') + string;
    }

    /**
     * Static constructor function for numbers.
     *
     * @method fromNumber
     *
     * @param {Number} value
     *
     * @returns {Hex}
     */
    static fromNumber(value) {
        const number = BigNumber.from(value);
        const result = number.toHexString();

        if (number.lt(BigNumber.from(0))) {
            return new Hex(`-${result.substr(1)}`);
        }

        return new Hex(`${result}`);
    }

    /**
     * Static constructor function for bytes.
     *
     * @method fromBytes
     *
     * @param {Array<String>} bytes
     *
     * @returns {Hex}
     */
    static fromBytes(bytes) {
        let hex = [];

        for (let i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xf).toString(16));
        }

        return new Hex(`0x${hex.join('').replace(/^0+/, '')}`);
    }

    /**
     * Auto converts any given value into it's hex representation.
     * And even stringifys objects before.
     *
     * @method toHex
     *
     * @param {String|Number|BN|Object} value
     *
     * @returns {Hex}
     */
    static from(value) {
        if (Address.isValid(value)) {
            throw new Error('Please use the Address type object to interact with a Ethereum Address.');
        }

        if (isBoolean(value)) {
            if (value === true) {
                return new Hex('0x01');
            }

            return new Hex('0x00');
        }

        if (isObject(value) && !BigNumber.isBigNumber(value) && !BN.isBN(value)) {
            return Hex.fromUTF8(JSON.stringify(value));
        }

        if (isString(value)) {
            if (
                value.startsWith('-0x') ||
                value.startsWith('-0X') ||
                value.startsWith('0x') ||
                value.startsWith('0X')
            ) {
                return new Hex(value);
            }

            if (!isFinite(value)) {
                return Hex.fromUTF8(value);
            }
        }

        if (BigNumber.isBigNumber(value)) {
            let hex = value.toString(16);

            if (value.toHexString) {
                hex = value.toHexString();
            }

            if (hex.startsWith('-')) {
                return new Hex('-0x' + hex.slice(1));
            }

            return new Hex('0x' + value.toString(16));
        }

        if (BN.isBN(value)) {
            const hex = value.toString(16);

            if (hex.startsWith('-')) {
                return new Hex('-0x' + hex.slice(1));
            }

            return new Hex('0x' + value.toString(16));
        }

        return Hex.fromNumber(value);
    }

    /**
     * Validates the given hex.
     *
     * @param {String} hex
     *
     * @returns {Boolean}
     */
    static isValid(hex) {
        return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
    }

    /**
     * Removes the hex prefix '0x' from the given string
     *
     * @method stripPrefix
     *
     * @param {String} value
     *
     * @returns {String}
     */
    static stripPrefix(value) {
        if (value.startsWith('0x') || value.startsWith('0X')) {
            value = value.slice(2);
        }

        if (value.startsWith('-0x') || value.startsWith('-0X')) {
            value = value.slice(3);
        }

        return value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
    }

    /**
     * Checks if the given value is a valid ethereum block header bloom.
     *
     * @param {String} bloom
     *
     * @returns {Boolean}
     */
    static isBloom(bloom) {
        if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
            return false;
        }

        return /^(0x)?[0-9a-f]{512}$/.test(bloom) || /^(0x)?[0-9A-F]{512}$/.test(bloom);
    }

    /**
     * Checks if the given value is a valid topic hex string.
     *
     * @param {String} topic
     *
     * @returns {Boolean}
     */
    static isTopic(topic) {
        if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
            return false;
        }

        return /^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic);
    }

    /**
     * Returns a random hex string with the defined size.
     *
     * @method random
     *
     * @param {Number} size
     *
     * @returns {String}
     */
    static random(size) {
        return '0x' + randombytes(size).toString('hex');
    }
}
