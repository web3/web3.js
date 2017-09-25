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
 * @file soliditySha3.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

import _ from 'lodash';
import BN from 'bn.js';

import {
    isHex,
    isBigNumber,
    isBN,
    isAddress,
    utf8ToHex,
    leftPad,
    rightPad,
    toHex,
    sha3,
} from './utils.js';

const elementaryName = (name) => {
    if (name.startsWith('int[')) {
        return `int256${name.slice(3)}`;
    } else if (name === 'int') {
        return 'int256';
    } else if (name.startsWith('uint[')) {
        return `uint256${name.slice(4)}`;
    } else if (name === 'uint') {
        return 'uint256';
    } else if (name.startsWith('fixed[')) {
        return `fixed128x128${name.slice(5)}`;
    } else if (name === 'fixed') {
        return 'fixed128x128';
    } else if (name.startsWith('ufixed[')) {
        return `ufixed128x128${name.slice(6)}`;
    } else if (name === 'ufixed') {
        return 'ufixed128x128';
    }
    return name;
};

// Parse N from type<N>
const parseTypeN = (type) => {
    const typesize = /^\D+(\d+).*$/.exec(type);
    return typesize ? parseInt(typesize[1], 10) : null;
};

// Parse N from type[<N>]
const parseTypeNArray = (type) => {
    const arraySize = /^\D+\d*\[(\d+)\]$/.exec(type);
    return arraySize ? parseInt(arraySize[1], 10) : null;
};

const parseNumber = (arg) => {
    const type = typeof arg;
    if (type === 'string') {
        if (isHex(arg)) {
            return new BN(arg.replace(/0x/i, ''), 16);
        }
        return new BN(arg, 10);
    } else if (type === 'number') {
        return new BN(arg);
    } else if (isBigNumber(arg)) {
        return new BN(arg.toString(10));
    } else if (isBN(arg)) {
        return arg;
    }
    throw new Error(`${arg} is not a number`);
};

const solidityPack = (tp, value, arraySize) => {
    let size;
    let num;
    const type = elementaryName(tp);

    if (type === 'bytes') {
        if (value.replace(/^0x/i, '').length % 2 !== 0) {
            throw new Error(`Invalid bytes characters ${value.length}`);
        }

        return value;
    } else if (type === 'string') {
        return utf8ToHex(value);
    } else if (type === 'bool') {
        return value ? '01' : '00';
    } else if (type.startsWith('address')) {
        if (arraySize) {
            size = 64;
        } else {
            size = 40;
        }

        if (!isAddress(value)) {
            throw new Error(`${value} is not a valid address, or the checksum is invalid.`);
        }

        return leftPad(value.toLowerCase(), size);
    }

    size = parseTypeN(type);

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

        return rightPad(value, size * 2);
    } else if (type.startsWith('uint')) {
        if ((size % 8) || (size < 8) || (size > 256)) {
            throw new Error(`Invalid uint${size} size`);
        }

        num = parseNumber(value);
        if (num.bitLength() > size) {
            throw new Error(`Supplied uint exceeds width: ${size} vs ${num.bitLength()}`);
        }

        if (num.lt(new BN(0))) {
            throw new Error(`Supplied uint ${num.toString()} is negative`);
        }

        return size ? leftPad(num.toString('hex'), (size / 8) * 2) : num;
    } else if (type.startsWith('int')) {
        if ((size % 8) || (size < 8) || (size > 256)) {
            throw new Error(`Invalid int${size} size`);
        }

        num = parseNumber(value);
        if (num.bitLength() > size) {
            throw new Error(`Supplied int exceeds width: ${size} vs ${num.bitLength()}`);
        }

        if (num.lt(new BN(0))) {
            return num.toTwos(size).toString('hex');
        }
        return size ? leftPad(num.toString('hex'), (size / 8) * 2) : num;
    }
    // FIXME: support all other types
    throw new Error(`Unsupported or invalid type: ${type}`);
};

const processSoliditySha3Args = (arg) => {
    if (_.isArray(arg)) {
        throw new Error('Autodetection of array types is not supported.');
    }

    let type;
    let value = '';
    let hexArg;
    let arraySize;

    // if type is given
    const hop = Object.prototype.hasOwnProperty;
    if (_.isObject(arg) && (
        hop.call(arg, 'v') ||
    hop.call(arg, 't') ||
    hop.call(arg, 'value') ||
    hop.call(arg, 'type'))) {
        type = arg.t || arg.type;
        value = arg.v || arg.value;
    } else {
    // otherwise try to guess the type
        type = toHex(arg, true);
        value = toHex(arg);

        if (!type.startsWith('int') && !type.startsWith('uint')) {
            type = 'bytes';
        }
    }

    if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
        value = new BN(value);
    }

    // get the array size
    if (_.isArray(value)) {
        arraySize = parseTypeNArray(type);
        if (arraySize && value.length !== arraySize) {
            throw new Error(`${type} is not matching the given array ${JSON.stringify(value)}`);
        } else {
            arraySize = value.length;
        }
    }


    if (_.isArray(value)) {
        hexArg = value.map(val => solidityPack(type, val, arraySize).toString('hex').replace('0x', ''));
        return hexArg.join('');
    }
    hexArg = solidityPack(type, value, arraySize);
    return hexArg.toString('hex').replace('0x', '');
};

/**
 * Hashes solidity values to a sha3 hash using keccak 256
 *
 * @method soliditySha3
 * @return {Object} the sha3
 */
export default function (...args) {
    const hexArgs = args.map(processSoliditySha3Args);
    return sha3(`0x${hexArgs.join('')}`);
}
