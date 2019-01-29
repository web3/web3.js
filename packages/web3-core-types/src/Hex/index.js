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
 * @file index.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import HexFactory from './factories/HexFactory';
import HexClass from './Hex';
import {isNumber, isString} from 'lodash';
import utf8 from 'utf8';

/**
 * Returns an object of Hex
 *
 * @returns {Hex}
 *
 * @constructor
 */
export const Hex = (params) => {
    return new HexFactory().createHex(params);
};

/**
 * Copy isValid class method and expose
 *
 * @param {String} value
 *
 * @returns {boolean}
 *
 */
Hex.isValid = HexClass.isValid;

/**
 * Copy isStrict class method and expose
 *
 * @param {String} value
 *
 * @returns {boolean}
 *
 */
Hex.isStrict = HexClass.isStrict;

/**
 * Build an object of Hex from a string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromString = (value) => {
    if (!isString(value)) throw new Error(`The given value ${value} is not string type.`);

    value = value.replace(/(-)?(0x)?([0-9a-f]*)/i, '$10x$3');

    const params = {
        hex: value
    };

    return Hex(params);
};

/**
 * Build an object of Hex from a base 10 number
 *
 * @param {Number} value
 *
 * @returns {Hex}
 *
 */
Hex.fromNumber = (value) => {
    if (!isNumber(value)) throw new Error(`The given value ${value} is not number type.`);

    const params = {
        hex: value.toString(16)
    };

    return Hex(params);
};

/**
 * Build an object of Hex from an ASCII string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromAscii = (value) => {
    if (!isString(value)) throw new Error(`The given value ${value} is not string type.`);

    const hex = value.split('').reduce((acc, char) => {
        const v = char.charCodeAt(0).toString(16);
        if (v.length > 2) throw new Error(`Non ASCII char ${char} in string ${value}.`);
        return acc + (v.length < 2 ? '0' + v : v);
    }, '0x');

    const params = {
        hex: hex
    };

    return Hex(params);
};

/**
 * Build an object of Hex from a UTF-8-encoded string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromUtf8 = (value) => {
    if (!isString(value)) throw new Error(`The given value ${value} is not string type.`);

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

    const params = {
        hex: hex
    };

    return Hex(params);
};

Hex.fromBytes = (value) => {
    let hex = '';

    value.forEach((v) => {
        const s = v.toString(16);
        hex += s.length < 2 ? `0${s}` : s;
    });

    hex = `0x${hex}`;

    const params = {
        hex: hex
    };

    return Hex(params);
};

/**
 * Fallback for number or string parsing.
 * Number parameters call fromNumber
 * String parameters call fromString
 *
 * @param {String|Number} value
 *
 * @returns {Hex}
 *
 */
Hex.from = (value) => {
    if (isNumber(value)) {
        return Hex.fromNumber(value);
    } else if (isString(value)) {
        return Hex.fromString(value);
    } else {
        throw new Error(`The given value ${value} needs to be a hex-encoded string or a base 10 number.`);
    }
};
