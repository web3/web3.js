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

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

// TODO: Implement it by our self this can't be a dependency because of the importance of it.
export default class AbiCoder {
    /**
     * @param {Utils} utils
     * @param {EthersAbiCoder} ethersAbiCoder
     *
     * @constructor
     */
    constructor(utils, ethersAbiCoder) {
        this.utils = utils;
        this.ethersAbiCoder = ethersAbiCoder;
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
            functionName = this.utils.jsonInterfaceMethodToString(functionName);
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
            functionName = this.utils.jsonInterfaceMethodToString(functionName);
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
        return this.ethersAbiCoder.encode(this._mapTypes(types), params);
    }

    /**
     * Map types if simplified format is used
     *
     * @method _mapTypes
     *
     * @param {Array} types
     *
     * @returns {Array}
     */
    _mapTypes(types) {
        const mappedTypes = [];
        types.forEach((type) => {
            if (this._isSimplifiedStructFormat(type)) {
                const structName = Object.keys(type)[0];
                mappedTypes.push(
                    Object.assign(this._mapStructNameAndType(structName), {
                        components: this._mapStructToCoderFormat(type[structName])
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
     * @method _isSimplifiedStructFormat
     *
     * @param {String | Object} type
     *
     * @returns {Boolean}
     */
    _isSimplifiedStructFormat(type) {
        return typeof type === 'object' && typeof type.components === 'undefined' && typeof type.name === 'undefined';
    }

    /**
     * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
     *
     * @method _mapStructNameAndType
     *
     * @param {String} structName
     *
     * @returns {{type: string, name: *}}
     */
    _mapStructNameAndType(structName) {
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
     * @method _mapStructToCoderFormat
     *
     * @param {Object} struct
     *
     * @returns {Array}
     */
    _mapStructToCoderFormat(struct) {
        const components = [];
        Object.keys(struct).forEach((key) => {
            if (typeof struct[key] === 'object') {
                components.push(
                    Object.assign(this._mapStructNameAndType(key), {
                        components: this._mapStructToCoderFormat(struct[key])
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
     * @param {Object} jsonInterface
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
     * @returns {Object} Object with named and indexed properties of the returnValues
     */
    decodeParameters(outputs, bytes) {
        if (outputs.length > 0 && (!bytes || bytes === '0x' || bytes === '0X')) {
            throw new Error("Returned values aren't valid, did it run Out of Gas?");
        }

        const res = this.ethersAbiCoder.decode(this._mapTypes(outputs), `0x${bytes.replace(/0x/i, '')}`);

        const returnValues = {};
        returnValues.__length__ = 0;

        let decodedValue;
        outputs.forEach((output, i) => {
            decodedValue = res[i];
            decodedValue = decodedValue === '0x' ? null : decodedValue;

            returnValues[i] = decodedValue;

            if (isObject(output) && output.name) {
                returnValues[output.name] = decodedValue;
            }
            returnValues.__length__ ++;
        });

        return returnValues;
    }

    /**
     * Decodes events non- and indexed parameters.
     *
     * @method decodeLog
     *
     * @param {Array} inputs
     * @param {String} data
     * @param {Array} topics
     *
     * @returns {Object} Object with named and indexed properties of the returnValues
     */
    decodeLog(inputs, data = '', topics) {
        let topicCount = 0;

        if (!isArray(topics)) {
            topics = [topics];
        }

        // TODO: check for anonymous logs?
        // TODO: Refactor this to one loop
        const notIndexedInputs = [];

        const indexedParams = [];

        inputs.forEach((input, i) => {
            if (input.indexed) {
                indexedParams[i] = ['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find((staticType) => {
                    return input.type.indexOf(staticType) !== -1;
                })
                    ? this.decodeParameter(input.type, topics[topicCount])
                    : topics[topicCount];
                topicCount++;
            } else {
                notIndexedInputs[i] = input;
            }
        });

        const nonIndexedData = data;

        const notIndexedParams = nonIndexedData
            ? this.decodeParameters(notIndexedInputs.filter(Boolean), nonIndexedData)
            : [];

        let notIndexedOffset = 0;
        const returnValues = {};

        inputs.forEach((res, i) => {
            if (res.indexed) notIndexedOffset++;

            returnValues[i] = res.type === 'string' ? '' : null;

            if (!res.indexed && typeof notIndexedParams[i - notIndexedOffset] !== 'undefined') {
                returnValues[i] = notIndexedParams[i - notIndexedOffset];
            }
            if (typeof indexedParams[i] !== 'undefined') {
                returnValues[i] = indexedParams[i];
            }

            if (res.name) {
                returnValues[res.name] = returnValues[i];
            }
        });

        return returnValues;
    }
}
