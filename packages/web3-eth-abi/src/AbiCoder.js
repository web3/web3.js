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
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2018
 */

import {isArray, isObject} from 'underscore';
import {AbiCoder as EthersAbi} from 'ethers/utils/abi-coder';

const ethersAbiCoder = new EthersAbi((type, value) => {
    if (type.match(/^u?int/) && !isArray(value) && (!isObject(value) || value.constructor.name !== 'BN')) {
        return value.toString();
    }
    return value;
});

// result method
function Result() {}

export default class AbiCoder {
    /**
     * @param {Object} utils
     *
     * @constructor
     */
    constructor(utils) {
        this.utils = utils;
    }

    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
     *
     * @method encodeFunctionSignature
     *
     * @param {String|Object} functionName
     *
     * @returns {String} encoded function name
     */
    encodeFunctionSignature(functionName) {
        if (isObject(functionName)) {
            functionName = this.utils._jsonInterfaceMethodToString(functionName);
        }

        return this.utils.sha3(functionName).slice(0, 10);
    }

    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
     *
     * @method encodeEventSignature
     *
     * @param {String|Object} functionName
     *
     * @returns {String} encoded function name
     */
    encodeEventSignature(functionName) {
        if (isObject(functionName)) {
            functionName = this.utils._jsonInterfaceMethodToString(functionName);
        }

        return this.utils.sha3(functionName);
    }

    /**
     * Should be used to encode plain param
     *
     * @method encodeParameter
     *
     * @param {String} type
     * @param {Object} param
     *
     * @returns {String} encoded plain param
     */
    encodeParameter(type, param) {
        return this.encodeParameters([type], [param]);
    }

    /**
     * Should be used to encode list of params
     *
     * @method encodeParameters
     *
     * @param {Array} types
     * @param {Array} params
     *
     * @returns {String} encoded list of params
     */
    encodeParameters(types, params) {
        return ethersAbiCoder.encode(this.mapTypes(types), params);
    }

    /**
     * Map types if simplified format is used
     *
     * @method mapTypes
     *
     * @param {Array} types
     *
     * @returns {Array}
     */
    mapTypes(types) {
        const mappedTypes = [];
        types.forEach((type) => {
            if (this.isSimplifiedStructFormat(type)) {
                const structName = Object.keys(type)[0];
                mappedTypes.push(
                    Object.assign(this.mapStructNameAndType(structName), {
                        components: this.mapStructToCoderFormat(type[structName])
                    })
                );

                return;
            }

            mappedTypes.push(type);
        });

        return mappedTypes;
    }

    /**
     * Check if type is simplified struct format
     *
     * @method isSimplifiedStructFormat
     *
     * @param {String | Object} type
     *
     * @returns {Boolean}
     */
    isSimplifiedStructFormat(type) {
        return typeof type === 'object' && typeof type.components === 'undefined' && typeof type.name === 'undefined';
    }

    /**
     * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
     *
     * @method mapStructNameAndType
     *
     * @param {String} structName
     *
     * @returns {{type: string, name: *}}
     */
    mapStructNameAndType(structName) {
        let type = 'tuple';

        if (structName.indexOf('[]') > -1) {
            type = 'tuple[]';
            structName = structName.slice(0, -2);
        }

        return {type, name: structName};
    }

    /**
     * Maps the simplified format in to the expected format of the AbiCoder
     *
     * @method mapStructToCoderFormat
     *
     * @param {Object} struct
     *
     * @returns {Array}
     */
    mapStructToCoderFormat(struct) {
        const components = [];
        Object.keys(struct).forEach((key) => {
            if (typeof struct[key] === 'object') {
                components.push(
                    Object.assign(this.mapStructNameAndType(key), {
                        components: this.mapStructToCoderFormat(struct[key])
                    })
                );

                return;
            }

            components.push({
                name: key,
                type: struct[key]
            });
        });

        return components;
    }

    /**
     * Encodes a function call from its json interface and parameters.
     *
     * @method encodeFunctionCall
     *
     * @param {Array} jsonInterface
     * @param {Array} params
     *
     * @returns {String} The encoded ABI for this function call
     */
    encodeFunctionCall(jsonInterface, params) {
        return (
            this.encodeFunctionSignature(jsonInterface) +
            this.encodeParameters(jsonInterface.inputs, params).replace('0x', '')
        );
    }

    /**
     * Should be used to decode bytes to plain param
     *
     * @method decodeParameter
     *
     * @param {String} type
     * @param {String} bytes
     *
     * @returns {Object} plain param
     */
    decodeParameter(type, bytes) {
        return this.decodeParameters([type], bytes)[0];
    }

    /**
     * Should be used to decode list of params
     *
     * @method decodeParameter
     *
     * @param {Array} outputs
     * @param {String} bytes
     *
     * @returns {Array} array of plain params
     */
    decodeParameters(outputs, bytes) {
        if (!bytes || bytes === '0x' || bytes === '0X') {
            throw new Error("Returned values aren't valid, did it run Out of Gas?");
        }

        const res = ethersAbiCoder.decode(this.mapTypes(outputs), `0x${bytes.replace(/0x/i, '')}`);
        const returnValue = new Result();
        returnValue.__length__ = 0;

        outputs.forEach((output, i) => {
            let decodedValue = res[returnValue.__length__];
            decodedValue = decodedValue === '0x' ? null : decodedValue;

            returnValue[i] = decodedValue;

            if (isObject(output) && output.name) {
                returnValue[output.name] = decodedValue;
            }

            returnValue.__length__++;
        });

        return returnValue;
    }

    /**
     * Decodes events non- and indexed parameters.
     *
     * @method decodeLog
     *
     * @param {Object} inputs
     * @param {String} data
     * @param {Array} topics
     *
     * @returns {Array} array of plain params
     */
    decodeLog(inputs, data, topics) {
        const _this = this;
        topics = isArray(topics) ? topics : [topics];

        data = data || '';

        const notIndexedInputs = [];
        const indexedParams = [];
        let topicCount = 0;

        // TODO check for anonymous logs?

        inputs.forEach((input, i) => {
            if (input.indexed) {
                indexedParams[i] = ['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find((staticType) => {
                    return input.type.indexOf(staticType) !== -1;
                })
                    ? _this.decodeParameter(input.type, topics[topicCount])
                    : topics[topicCount];
                topicCount++;
            } else {
                notIndexedInputs[i] = input;
            }
        });

        const nonIndexedData = data;
        const notIndexedParams = nonIndexedData ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];

        const returnValue = new Result();
        returnValue.__length__ = 0;

        inputs.forEach((res, i) => {
            returnValue[i] = res.type === 'string' ? '' : null;

            if (typeof notIndexedParams[i] !== 'undefined') {
                returnValue[i] = notIndexedParams[i];
            }
            if (typeof indexedParams[i] !== 'undefined') {
                returnValue[i] = indexedParams[i];
            }

            if (res.name) {
                returnValue[res.name] = returnValue[i];
            }

            returnValue.__length__++;
        });

        return returnValue;
    }
}
