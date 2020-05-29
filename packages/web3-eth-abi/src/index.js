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

var Buffer = require('buffer').Buffer;
var _ = require('underscore');
var utils = require('web3-utils');

var EthersAbiCoder = require('@ethersproject/abi').AbiCoder;
var ParamType = require('@ethersproject/abi').ParamType;
var ethersAbiCoder = new EthersAbiCoder(function (type, value) {
    if (type.match(/^u?int/) && !_.isArray(value) && (!_.isObject(value) || value.constructor.name !== 'BN')) {
        return value.toString();
    }
    return value;
});

// result method
function Result() {
}

/**
 * ABICoder prototype should be used to encode/decode solidity params of any type
 */
var ABICoder = function () {
};

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 *
 * @method encodeFunctionSignature
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.encodeFunctionSignature = function (functionName) {
    if (_.isObject(functionName)) {
        functionName = utils._jsonInterfaceMethodToString(functionName);
    }

    return utils.sha3(functionName).slice(0, 10);
};

/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 *
 * @method encodeEventSignature
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.encodeEventSignature = function (functionName) {
    if (_.isObject(functionName)) {
        functionName = utils._jsonInterfaceMethodToString(functionName);
    }

    return utils.sha3(functionName);
};

/**
 * Should be used to encode plain param
 *
 * @method encodeParameter
 *
 * @param {String|Object} type
 * @param {any} param
 *
 * @return {String} encoded plain param
 */
ABICoder.prototype.encodeParameter = function (type, param) {
    return this.encodeParameters([type], [param]);
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParameters
 *
 * @param {Array<String|Object>} types
 * @param {Array<any>} params
 *
 * @return {String} encoded list of params
 */
ABICoder.prototype.encodeParameters = function (types, params) {
    var self = this;
    types = self.mapTypes(types)

    params = params.map(function (param, index) {
        let type = types[index]
        if (typeof type === 'object' && type.type) {
            // We may get a named type of shape {name, type}
            type = type.type
        }

        // Format BN to string
        if (utils.isBN(param) || utils.isBigNumber(param)) {
            return param.toString(10);
        }

        param = self.formatParam(type, param)

        // Format params for tuples
        if (typeof type === 'string' && type.includes('tuple')) {
            const coder = ethersAbiCoder._getCoder(ParamType.from(type));
            const modifyParams = (coder, param) => {
                if (coder.name === 'array') {
                    return param.map(p =>
                        modifyParams(
                            ethersAbiCoder._getCoder(ParamType.from(coder.type.replace('[]', ''))),
                            p
                        )
                    )
                }
                coder.coders.forEach((c, i) => {
                    if (c.name === 'tuple') {
                        modifyParams(c, param[i])
                    } else {
                        param[i] = self.formatParam(c.name, param[i])
                    }
                })
            }
            modifyParams(coder, param)
        }

        return param;
    })

    return ethersAbiCoder.encode(types, params);
};

/**
 * Map types if simplified format is used
 *
 * @method mapTypes
 * @param {Array} types
 * @return {Array}
 */
ABICoder.prototype.mapTypes = function (types) {
    var self = this;
    var mappedTypes = [];
    types.forEach(function (type) {
        if (self.isSimplifiedStructFormat(type)) {
            var structName = Object.keys(type)[0];
            mappedTypes.push(
                Object.assign(
                    self.mapStructNameAndType(structName),
                    {
                        components: self.mapStructToCoderFormat(type[structName])
                    }
                )
            );

            return;
        }

        mappedTypes.push(type);
    });

    return mappedTypes;
};

/**
 * Check if type is simplified struct format
 *
 * @method isSimplifiedStructFormat
 * @param {string | Object} type
 * @returns {boolean}
 */
ABICoder.prototype.isSimplifiedStructFormat = function (type) {
    return typeof type === 'object' && typeof type.components === 'undefined' && typeof type.name === 'undefined';
};

/**
 * Maps the correct tuple type and name when the simplified format in encode/decodeParameter is used
 *
 * @method mapStructNameAndType
 * @param {string} structName
 * @return {{type: string, name: *}}
 */
ABICoder.prototype.mapStructNameAndType = function (structName) {
    var type = 'tuple';

    if (structName.indexOf('[]') > -1) {
        type = 'tuple[]';
        structName = structName.slice(0, -2);
    }

    return {type: type, name: structName};
};

/**
 * Maps the simplified format in to the expected format of the ABICoder
 *
 * @method mapStructToCoderFormat
 * @param {Object} struct
 * @return {Array}
 */
ABICoder.prototype.mapStructToCoderFormat = function (struct) {
    var self = this;
    var components = [];
    Object.keys(struct).forEach(function (key) {
        if (typeof struct[key] === 'object') {
            components.push(
                Object.assign(
                    self.mapStructNameAndType(key),
                    {
                        components: self.mapStructToCoderFormat(struct[key])
                    }
                )
            );

            return;
        }

        components.push({
            name: key,
            type: struct[key]
        });
    });

    return components;
};

/**
 * Handle some formatting of params for backwards compatability with Ethers V4
 *
 * @method formatParam
 * @param {String} - type
 * @param {any} - param
 * @return {any} - The formatted param
 */
ABICoder.prototype.formatParam = function (type, param) {
    const paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
    const paramTypeBytesArray = new RegExp(/^bytes([0-9]*)\[\]$/);
    const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
    const paramTypeNumberArray = new RegExp(/^(u?int)([0-9]*)\[\]$/);

    if (type.match(paramTypeBytesArray) || type.match(paramTypeNumberArray)) {
        return param.map(p => this.formatParam(type.replace('[]', ''), p))
    }

    // Format correct width for u?int[0-9]*
    let match = type.match(paramTypeNumber);
    if (match) {
        let size = parseInt(match[2] || "256");
        if (size / 8 < param.length) {
            // pad to correct bit width
            param = utils.leftPad(param, size);
        }
    }

    // Format correct length for bytes[0-9]+
    match = type.match(paramTypeBytes);
    if (match) {
        if (Buffer.isBuffer(param)) {
            param = utils.toHex(param);
        }

        // format to correct length
        let size = parseInt(match[1]);
        if (size) {
            let maxSize = size * 2;
            if (param.substring(0, 2) === '0x') {
                maxSize += 2;
            }
            if (param.length < maxSize) {
                // pad to correct length
                param = utils.rightPad(param, size * 2)
            }
        }
        
        // format odd-length bytes to even-length
        if (param.length % 2 === 1) { 
            param = '0x0' + param.substring(2)
        }
    }

    return param
};

/**
 * Encodes a function call from its json interface and parameters.
 *
 * @method encodeFunctionCall
 * @param {Array} jsonInterface
 * @param {Array} params
 * @return {String} The encoded ABI for this function call
 */
ABICoder.prototype.encodeFunctionCall = function (jsonInterface, params) {
    return this.encodeFunctionSignature(jsonInterface) + this.encodeParameters(jsonInterface.inputs, params).replace('0x', '');
};

/**
 * Should be used to decode bytes to plain param
 *
 * @method decodeParameter
 * @param {String} type
 * @param {String} bytes
 * @return {Object} plain param
 */
ABICoder.prototype.decodeParameter = function (type, bytes) {
    return this.decodeParameters([type], bytes)[0];
};

/**
 * Should be used to decode list of params
 *
 * @method decodeParameter
 * @param {Array} outputs
 * @param {String} bytes
 * @return {Array} array of plain params
 */
ABICoder.prototype.decodeParameters = function (outputs, bytes) {
    if (outputs.length > 0 && (!bytes || bytes === '0x' || bytes === '0X')) {
        throw new Error(
            'Returned values aren\'t valid, did it run Out of Gas? ' +
            'You might also see this error if you are not using the ' +
            'correct ABI for the contract you are retrieving data from, ' +
            'requesting data from a block number that does not exist, ' +
            'or querying a node which is not fully synced.'
        );
    }

    var res = ethersAbiCoder.decode(this.mapTypes(outputs), '0x' + bytes.replace(/0x/i, ''));
    var returnValue = new Result();
    returnValue.__length__ = 0;

    outputs.forEach(function (output, i) {
        var decodedValue = res[returnValue.__length__];
        decodedValue = (decodedValue === '0x') ? null : decodedValue;

        returnValue[i] = decodedValue;

        if (_.isObject(output) && output.name) {
            returnValue[output.name] = decodedValue;
        }

        returnValue.__length__++;
    });

    return returnValue;
};

/**
 * Decodes events non- and indexed parameters.
 *
 * @method decodeLog
 * @param {Object} inputs
 * @param {String} data
 * @param {Array} topics
 * @return {Array} array of plain params
 */
ABICoder.prototype.decodeLog = function (inputs, data, topics) {
    var _this = this;
    topics = _.isArray(topics) ? topics : [topics];

    data = data || '';

    var notIndexedInputs = [];
    var indexedParams = [];
    var topicCount = 0;

    // TODO check for anonymous logs?

    inputs.forEach(function (input, i) {
        if (input.indexed) {
            indexedParams[i] = (['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find(function (staticType) {
                return input.type.indexOf(staticType) !== -1;
            })) ? _this.decodeParameter(input.type, topics[topicCount]) : topics[topicCount];
            topicCount++;
        } else {
            notIndexedInputs[i] = input;
        }
    });


    var nonIndexedData = data;
    var notIndexedParams = (nonIndexedData) ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];

    var returnValue = new Result();
    returnValue.__length__ = 0;


    inputs.forEach(function (res, i) {
        returnValue[i] = (res.type === 'string') ? '' : null;

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
};

var coder = new ABICoder();

module.exports = coder;
