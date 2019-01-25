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
 * Build an object of Hex from a string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromString = (value) => {
    if(!isString(value))
        throw "The given value is not string type.";
    const params = {
        hex: value
    };

    return Hex(params);
}

/**
 * Build an object of Hex from a base 10 number
 *
 * @param {Number} value
 *
 * @returns {Hex}
 *
 */
Hex.fromNumber = (value) => {
    if(!isNumber(value))
        throw "The given value is not number type.";

    const params = {
        hex: value.toString(16)
    };

    return Hex(params);
}

/**
 * Build an object of Hex from an ASCII string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromAscii = (value) => {
    if(!isString(value))
        throw "The given value is not string type.";

    const hex = value.split('').reduce((acc, char) => {
        const v = char.charCodeAt(0).toString(16);
        if(v.length > 2) throw "Non ASCII char in string";
        return acc + (v.length < 2 ? '0' + v : v);
    }, "0x");

    const params = {
        hex: hex
    };

    return Hex(params);
}

/**
 * Build an object of Hex from a UTF-8-encoded string
 *
 * @param {String} value
 *
 * @returns {Hex}
 *
 */
Hex.fromUtf8 = (value) => {
    let hex = "";
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
}

Hex.fromBytes = (value) => {
    // TODO
}

Hex.from = (value) => {
    // TODO
}
