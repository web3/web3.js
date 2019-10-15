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

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import BN from 'bn.js';
import * as utils from './Utils.js';

const _elementaryName = (name) => {
    if (name.startsWith('int[')) {
        return `int256${name.slice(3)}`;
    }

    if (name === 'int') {
        return 'int256';
    }

    if (name.startsWith('uint[')) {
        return `uint256${name.slice(4)}`;
    }

    if (name === 'uint') {
        return 'uint256';
    }

    if (name.startsWith('fixed[')) {
        return `fixed128x128${name.slice(5)}`;
    }

    if (name === 'fixed') {
        return 'fixed128x128';
    }

    if (name.startsWith('ufixed[')) {
        return `ufixed128x128${name.slice(6)}`;
    }

    if (name === 'ufixed') {
        return 'ufixed128x128';
    }

    return name;
};

// Parse N from type<N>
const _parseTypeN = (type) => {
    const typesize = /^\D+(\d+).*$/.exec(type);
    return typesize ? parseInt(typesize[1], 10) : null;
};

// Parse N from type[<N>]
const _parseTypeNArray = (type) => {
    const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
    return arraySize ? parseInt(arraySize[1], 10) : null;
};

const _parseNumber = (argument) => {
    const type = typeof argument;
    if (type === 'string') {
        if (utils.isHexStrict(argument)) {
            return new BN(argument.replace(/0x/i, ''), 16);
        } else {
            return new BN(argument, 10);
        }
    } else if (type === 'number') {
        return new BN(argument);
    } else if (utils.isBigNumber(argument)) {
        return new BN(argument.toString(10));
    } else if (utils.isBN(argument)) {
        return argument;
    } else {
        throw new Error(`${argument} is not a number`);
    }
};

const _solidityPack = (type, value, arraySize) => {
    let size, number;
    type = _elementaryName(type);

    if (type === 'bytes') {
        if (value.replace(/^0x/i, '').length % 2 !== 0) {
            throw new Error(`Invalid bytes characters ${value.length}`);
        }

        return value;
    } else if (type === 'string') {
        return utils.utf8ToHex(value);
    } else if (type === 'bool') {
        return value ? '01' : '00';
    } else if (type.startsWith('address')) {
        if (arraySize) {
            size = 64;
        } else {
            size = 40;
        }

        if (!utils.isAddress(value)) {
            throw new Error(`${value} is not a valid address, or the checksum is invalid.`);
        }

        return utils.leftPad(value.toLowerCase(), size);
    }

    size = _parseTypeN(type);

    if (type.startsWith('bytes')) {
        if (!size) {
            throw new Error('bytes[] not yet supported in solidity');
        }

        // must be 32 byte slices when in an array
        if (arraySize) {
            size = 32;
        }

        if (size < 1 || size > 32 || size < value.replace(/^0x/i, '').length / 2) {
            throw new Error(`Invalid bytes${size} for ${value}`);
        }

        return utils.rightPad(value, size * 2);
    } else if (type.startsWith('uint')) {
        if (size % 8 || size < 8 || size > 256) {
            throw new Error(`Invalid uint${size} size`);
        }

        number = _parseNumber(value);
        if (number.bitLength() > size) {
            throw new Error(`Supplied uint exceeds width: ${size} vs ${number.bitLength()}`);
        }

        if (number.lt(new BN(0))) {
            throw new Error(`Supplied uint ${number.toString()} is negative`);
        }

        return size ? utils.leftPad(number.toString('hex'), (size / 8) * 2) : number;
    } else if (type.startsWith('int')) {
        if (size % 8 || size < 8 || size > 256) {
            throw new Error(`Invalid int${size} size`);
        }

        number = _parseNumber(value);
        if (number.bitLength() > size) {
            throw new Error(`Supplied int exceeds width: ${size} vs ${number.bitLength()}`);
        }

        if (number.lt(new BN(0))) {
            return number.toTwos(size).toString('hex');
        } else {
            return size ? utils.leftPad(number.toString('hex'), (size / 8) * 2) : number;
        }
    } else {
        // FIXME: support all other types
        throw new Error(`Unsupported or invalid type: ${type}`);
    }
};

const _processSoliditySha3Arguments = (argument) => {
    if (isArray(argument)) {
        throw new Error('Autodetection of array types is not supported.');
    }

    let type;

    let value = '';
    let hexArgument, arraySize;

    // if type is given
    if (
        isObject(argument) &&
        (argument.hasOwnProperty('v') ||
            argument.hasOwnProperty('t') ||
            argument.hasOwnProperty('value') ||
            argument.hasOwnProperty('type'))
    ) {
        type = argument.hasOwnProperty('t') ? argument.t : argument.type;
        value = argument.hasOwnProperty('v') ? argument.v : argument.value;

        // otherwise try to guess the type
    } else {
        type = utils.toHex(argument, true);
        value = utils.toHex(argument);

        if (!type.startsWith('int') && !type.startsWith('uint')) {
            type = 'bytes';
        }
    }

    if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
        value = new BN(value);
    }

    // get the array size
    if (isArray(value)) {
        arraySize = _parseTypeNArray(type);
        if (arraySize && value.length !== arraySize) {
            throw new Error(`${type} is not matching the given array ${JSON.stringify(value)}`);
        } else {
            arraySize = value.length;
        }
    }

    if (isArray(value)) {
        hexArgument = value.map((value_) => {
            return _solidityPack(type, value_, arraySize)
                .toString('hex')
                .replace('0x', '');
        });
        return hexArgument.join('');
    } else {
        hexArgument = _solidityPack(type, value, arraySize);
        return hexArgument.toString('hex').replace('0x', '');
    }
};

/**
 * Hashes solidity values to a sha3 hash using keccak 256
 *
 * @method soliditySha3
 * @return {Object} the sha3
 */
export const soliditySha3 = function() {
    const arguments_ = Array.prototype.slice.call(arguments);

    const hexArguments = map(arguments_, _processSoliditySha3Arguments);

    return utils.sha3(`0x${hexArguments.join('')}`);
};
