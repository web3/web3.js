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
 * @file ContractMethodEncoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ABICoder} abiCoder
 *
 * @constructor
 */
function MethodEncoder(abiCoder) {
    this.abiCoder = abiCoder;
}

/**
 * Encodes the method with the given parameters
 *
 * @method encode
 *
 * @param {Array} contractMethodParameters
 * @param {Object} abiItem
 * @param {String} signature
 * @param {String} deployData
 *
 * @returns {string}
 */
MethodEncoder.prototype.encode = function (contractMethodParameters, abiItem, signature, deployData) {
    var encodedParameters = this.abiCoder.encodeParameters(
        this.getMethodParameterTypes(abiItem),
        contractMethodParameters
    ).replace('0x', '');

    if (signature === 'constructor') {
        if (!deployData) {
            throw new Error(
                'The contract has no contract data option set. This is necessary to append the constructor parameters.'
            );
        }

        return deployData + encodedParameters;
    }

    if (abiItem.type === 'function') {
        return signature + encodedParameters;
    }

    return encodedParameters;
};

/**
 * Returns the method parameter types from the abi
 *
 * @method getMethodParameterTypes
 *
 * @param {Object} abiItem
 *
 * @returns {Array}
 */
MethodEncoder.prototype.getMethodParameterTypes = function (abiItem) {
    var methodParameterTypes = [];

    if (_.isArray(abiItem.inputs)) {
        methodParameterTypes = abiItem.inputs;
    }

    return methodParameterTypes;
};

module.exports = MethodEncoder;
