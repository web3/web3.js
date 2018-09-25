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

function ContractMethodEncoder(abiCoder) {
    this.abiCoder = abiCoder;
}

/**
 * Encodes the method with the given parameters
 *
 * @method encode
 *
 * @param {AbstractMethodModel} methodModel
 *
 * @returns {string}
 */
ContractMethodEncoder.prototype.encode = function (methodModel) {
    var inputLength = 0;
    var methodParameterTypes = [];

    if (_.isArray(this.methodModel.abiItem.inputs)) {
        inputLength = this.methodModel.abiItem.inputs.length;
    }

    if (inputLength !== this.methodModel.parameters.length) {
        throw new Error(
            'The number of arguments is not matching the methods required number. You need to pass '
            + inputLength +
            ' arguments.'
        );
    }

    if (_.isArray(json.inputs)) {
        methodParameterTypes = this.methodModel.abiItem.inputs;
    }

    var encodedParameters = this.abiCoder.encodeParameters(
        methodParameterTypes,
        this.methodModel.parameters
    ).replace('0x','');

    if(this.methodModel.signature === 'constructor') {
        if(!this.methodModel.deployData) {
            throw new Error(
                'The contract has no contract data option set. This is necessary to append the constructor parameters.'
            );
        }

        return this.methodModel.deployData + encodedParameters;
    }

    if (this.methodModel.abiItem.type === 'function') {
        return this.methodModel.signature + encodedParameters;
    }

    return encodedParameters;
};
