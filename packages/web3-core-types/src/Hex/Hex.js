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
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import {isNumber, isString, isObject, isNil, assign} from 'lodash';
import utf8 from 'utf8';

export default class Hex {
    /**
     * @dev Wrap as object
     * @param {String} hex
     *
     * @constructor
     */
    constructor(params) {
        if (!isObject(params)) {
            params = {
                hex: params
            };
        }

        assign(this, params);
    }

    /**
     * Gets the hex property
     *
     * @property hex
     *
     * @returns {String} hex
     */
    get hex() {
        if (!isNil(this._hex)) {
            return this._hex.toString();
        }
    }

    /**
     * Set the hex property
     *
     * @property hex
     */
    set hex(value) {
        if (Hex.isValid(value)) {
            this._hex = value.toString();
            return;
        }

        if (value === 'empty') {
            this._hex = '0x';
            return;
        }

        throw new Error(
            `The given "hex" parameter "${value}" needs to be a string composed of numbers, and characters between 'a' and 'f'.\n` +
                "Use 'empty' to set a web3 empty hex object."
        );
    }

    /**
     * Check if the supplied string is a valid hex value
     *
     * @method isValid
     *
     * @param {string} hex
     *
     * @return {boolean}
     */
    static isValid(hex) {
        return /^(-)?(0x)?[0-9a-fA-F]*$/.test(hex);
    }

    /**
     * Check if the supplied string is hex with 0x prefix
     *
     * @method isStrict
     *
     * @param {string} hex
     *
     * @return {boolean}
     */
    static isStrict(hex) {
        return /^(-0x|0x)[0-9a-fA-F]*$/.test(hex);
    }

    /**
     * Build an object of Hex from a string
     *
     * @method fromString
     *
     * @param {String} value
     *
     * @returns {Hex}
     */
    static fromString(value) {
        if (!isString(value)) {
            throw new Error(`The given value ${value} is not string type.`);
        }

        return new Hex(value.replace(/(-)?(0x)?([0-9a-f]*)/i, '$10x$3'));
    }

    /**
     * Build an object of Hex from a base 10 number
     *
     * @method fromNumber
     *
     * @param {Number} value
     *
     * @returns {Hex}
     */
    static fromNumber(value) {
        if (!isNumber(value)) {
            throw new Error(`The given value ${value} is not number type.`);
        }

        return new Hex(value.toString(16));
    }

    /**
     * Build an object of Hex from an ASCII string
     *
     * @method fromAscii
     *
     * @param {String} value
     *
     * @returns {Hex}
     */
    static fromAscii(value) {
        if (!isString(value)) {
            throw new Error(`The given value ${value} is not string type.`);
        }

        const hex = value.split('').reduce((acc, char) => {
            const v = char.charCodeAt(0).toString(16);

            if (v.length > 2) {
                throw new Error(`Non ASCII char ${char} in string ${value}.`);
            }

            return acc + (v.length < 2 ? '0' + v : v);
        }, '0x');

        return new Hex(hex);
    }

    /**
     * Build an object of Hex from a UTF-8-encoded string
     *
     * @method fromUtf8
     *
     * @param {String} value
     *
     * @returns {Hex}
     */
    static fromUtf8(value) {
        if (!isString(value)) {
            throw new Error(`The given value ${value} is not string type.`);
        }

        let hex = '';
        value = utf8.encode(value);

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
            const n = code.toString(16);
            hex += n.length < 2 ? `0${n}` : n;
        }

        hex = `0x${hex}`;

        return new Hex(hex);
    }

    /**
     * Build an object of Hex from a byte array
     *
     * @method fromBytes
     *
     * @param {String} value
     *
     * @returns {Hex}
     */
    static fromBytes(value) {
        let hex = '';

        value.forEach((v) => {
            const s = v.toString(16);
            hex += s.length < 2 ? `0${s}` : s;
        });

        hex = `0x${hex}`;

        return new Hex(hex);
    }

    /**
     * Fallback for number or string parsing.
     * Number parameters call fromNumber
     * String parameters call fromString
     *
     * @method from
     *
     * @param {String|Number} value
     *
     * @returns {Hex}
     */
    static from(value) {
        if (isNumber(value)) {
            return Hex.fromNumber(value);
        }

        if (isString(value)) {
            return Hex.fromString(value);
        }

        throw new Error(`The given value ${value} needs to be a hex-encoded string or a base 10 number.`);
    }

    /**
     * Override toString to print the hex prop
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return this._hex.replace(/(-)?(0x)?([0-9a-fA-F]*)/, '$10x$3');
    }

    /**
     * Interpret the hex data as an integer
     *
     * @method toNumber
     *
     * @return {Number}
     */
    toNumber() {
        return parseInt(this._hex, 16);
    }

    /**
     * Interpret the hex data as ASCII chars
     *
     * @method toAscii
     *
     * @return {String}
     */
    toAscii() {
        let ascii = '';
        for (let i = Hex.isStrict(this.toString()) ? 2 : 0; i < this._hex.length; i += 2) {
            ascii += String.fromCharCode(parseInt(this._hex.substr(i, 2), 16));
        }

        return ascii;
    }

    /**
     * Interpret the hex data as UTF-8 chars
     *
     * @method toUtf8
     *
     * @return {String}
     */
    toUtf8() {
        let string = '';
        let code = 0;
        let hex = this._hex.replace(/^0x/i, '');

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
            string += String.fromCharCode(code);
        }

        return utf8.decode(string);
    }

    /**
     * Interpret the hex data as an int
     *  and parse to bytes array
     *
     * @method toBytes
     *
     * @return {Uint8Array}
     */
    toBytes() {
        const hex = this._hex.replace(/^(-|-0x|0x)/i, '');
        const pad = hex.length % 2 === 0 ? hex : `0${hex}`;
        const bytes = new Uint8Array(pad.length / 2);

        for (let i = 0; i < pad.length; i += 2) {
            bytes[i / 2] = parseInt(pad.substr(i, 2), 16);
        }

        return bytes;
    }

    /**
     * Declare the type of the object
     *
     * @method isHex
     *
     * @return {boolean}
     */
    isHex() {
        return true;
    }
}
