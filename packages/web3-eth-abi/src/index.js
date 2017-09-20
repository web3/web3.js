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
 * @date 2017
 */

var _ = require('underscore');
var utils = require('web3-utils');

var f = require('./formatters');

var SolidityTypeAddress = require('./types/address');
var SolidityTypeBool = require('./types/bool');
var SolidityTypeInt = require('./types/int');
var SolidityTypeUInt = require('./types/uint');
var SolidityTypeDynamicBytes = require('./types/dynamicbytes');
var SolidityTypeString = require('./types/string');
var SolidityTypeBytes = require('./types/bytes');

var isDynamic = function (solidityType, type) {
    return solidityType.isDynamicType(type) ||
        solidityType.isDynamicArray(type);
};


// result method
function Result() {}


/**
 * ABICoder prototype should be used to encode/decode solidity params of any type
 */
var ABICoder = function (types) {
    this._types = types;
};

/**
 * This method should be used to transform type to SolidityType
 *
 * @method _requireType
 * @param {String} type
 * @returns {SolidityType}
 * @throws {Error} throws if no matching type is found
 */
ABICoder.prototype._requireType = function (type) {
    var solidityType = this._types.filter(function (t) {
        return t.isType(type);
    })[0];

    if (!solidityType) {
        throw Error('Invalid solidity type: ' + type);
    }

    return solidityType;
};



ABICoder.prototype._getOffsets = function (types, solidityTypes) {
    var lengths =  solidityTypes.map(function (solidityType, index) {
        return solidityType.staticPartLength(types[index]);
    });

    for (var i = 1; i < lengths.length; i++) {
        // sum with length of previous element
        lengths[i] += lengths[i - 1];
    }

    return lengths.map(function (length, index) {
        // remove the current length, so the length is sum of previous elements
        var staticPartLength = solidityTypes[index].staticPartLength(types[index]);
        return length - staticPartLength;
    });
};

ABICoder.prototype._getSolidityTypes = function (types) {
    var self = this;
    return types.map(function (type) {
        return self._requireType(type);
    });
};


ABICoder.prototype._encodeMultiWithOffset = function (types, solidityTypes, encodeds, dynamicOffset) {
    var result = "";
    var self = this;

    types.forEach(function (type, i) {
        if (isDynamic(solidityTypes[i], types[i])) {
            result += f.formatInputInt(dynamicOffset).encode();
            var e = self._encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
            dynamicOffset += e.length / 2;
        } else {
            // don't add length to dynamicOffset. it's already counted
            result += self._encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
        }

        // TODO: figure out nested arrays
    });

    types.forEach(function (type, i) {
        if (isDynamic(solidityTypes[i], types[i])) {
            var e = self._encodeWithOffset(types[i], solidityTypes[i], encodeds[i], dynamicOffset);
            dynamicOffset += e.length / 2;
            result += e;
        }
    });
    return result;
};

// TODO: refactor whole encoding!
ABICoder.prototype._encodeWithOffset = function (type, solidityType, encoded, offset) {
    var self = this;
    if (solidityType.isDynamicArray(type)) {
        return (function () {
            // offset was already set
            var nestedName = solidityType.nestedName(type);
            var nestedStaticPartLength = solidityType.staticPartLength(nestedName);
            var result = encoded[0];

            (function () {
                var previousLength = 2; // in int
                if (solidityType.isDynamicArray(nestedName)) {
                    for (var i = 1; i < encoded.length; i++) {
                        previousLength += +(encoded[i - 1])[0] || 0;
                        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode();
                    }
                }
            })();

            // first element is length, skip it
            (function () {
                for (var i = 0; i < encoded.length - 1; i++) {
                    var additionalOffset = result / 2;
                    result += self._encodeWithOffset(nestedName, solidityType, encoded[i + 1], offset +  additionalOffset);
                }
            })();

            return result;
        })();

    } else if (solidityType.isStaticArray(type)) {
        return (function () {
            var nestedName = solidityType.nestedName(type);
            var nestedStaticPartLength = solidityType.staticPartLength(nestedName);
            var result = "";


            if (solidityType.isDynamicArray(nestedName)) {
                (function () {
                    var previousLength = 0; // in int
                    for (var i = 0; i < encoded.length; i++) {
                        // calculate length of previous item
                        previousLength += +(encoded[i - 1] || [])[0] || 0;
                        result += f.formatInputInt(offset + i * nestedStaticPartLength + previousLength * 32).encode();
                    }
                })();
            }

            (function () {
                for (var i = 0; i < encoded.length; i++) {
                    var additionalOffset = result / 2;
                    result += self._encodeWithOffset(nestedName, solidityType, encoded[i], offset + additionalOffset);
                }
            })();

            return result;
        })();
    }

    return encoded;
};


/**
 * Encodes the function name to its ABI representation, which are the first 4 bytes of the sha3 of the function name including  types.
 *
 * @method encodeFunctionSignature
 * @param {String|Object} functionName
 * @return {String} encoded function name
 */
ABICoder.prototype.encodeFunctionSignature = function (functionName) {
    if(_.isObject(functionName)) {
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
    if(_.isObject(functionName)) {
        functionName = utils._jsonInterfaceMethodToString(functionName);
    }

    return utils.sha3(functionName);
};


/**
 * Should be used to encode plain param
 *
 * @method encodeParameter
 * @param {String} type
 * @param {Object} param
 * @return {String} encoded plain param
 */
ABICoder.prototype.encodeParameter = function (type, param) {
    return this.encodeParameters([type], [param]);
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParameters
 * @param {Array} types
 * @param {Array} params
 * @return {String} encoded list of params
 */
ABICoder.prototype.encodeParameters = function (types, params) {
    // given a json interface
    if(_.isObject(types) && types.inputs) {
        types = _.map(types.inputs, function (input) {
            return input.type;
        });
    }

    var solidityTypes = this._getSolidityTypes(types);

    var encodeds = solidityTypes.map(function (solidityType, index) {
        return solidityType.encode(params[index], types[index]);
    });

    var dynamicOffset = solidityTypes.reduce(function (acc, solidityType, index) {
        var staticPartLength = solidityType.staticPartLength(types[index]);
        var roundedStaticPartLength = Math.floor((staticPartLength + 31) / 32) * 32;

        return acc + (isDynamic(solidityTypes[index], types[index]) ?
                32 :
                roundedStaticPartLength);
    }, 0);

    return '0x'+ this._encodeMultiWithOffset(types, solidityTypes, encodeds, dynamicOffset);
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
    return this.encodeFunctionSignature(jsonInterface) + this.encodeParameters(jsonInterface, params).replace('0x','');
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

    if (!_.isString(type)) {
        throw new Error('Given parameter type is not a string: '+ type);
    }

    return this.decodeParameters([{type: type}], bytes)[0];
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
    var isTypeArray = _.isArray(outputs) && _.isString(outputs[0]);
    var types = (isTypeArray) ? outputs : [];

    if(!isTypeArray) {
        outputs.forEach(function (output) {
            types.push(output.type);
        });
    }

    var solidityTypes = this._getSolidityTypes(types);
    var offsets = this._getOffsets(types, solidityTypes);

    var returnValue = new Result();
    returnValue.__length__ = 0;
    var count = 0;

    outputs.forEach(function (output, i) {
        var decodedValue = solidityTypes[count].decode(bytes.replace(/^0x/i,''), offsets[count],  types[count], count);
        decodedValue = (decodedValue === '0x') ? null : decodedValue;

        returnValue[i] = decodedValue;

        if (_.isObject(output) && output.name) {
            returnValue[output.name] = decodedValue;
        }

        returnValue.__length__++;
        count++;
    });

    return returnValue;
};

/**
 * Decodes events non- and indexed parameters.
 *
 * @method decodeLog
 * @param {Object} inputs
 * @param {String} data
 * * @param {Array} topics
 * @return {Array} array of plain params
 */
ABICoder.prototype.decodeLog = function (inputs, data, topics) {

    var notIndexedInputs = [];
    var indexedInputs = [];

    inputs.forEach(function (input, i) {
        if (input.indexed) {
            indexedInputs[i] = input;
        } else {
            notIndexedInputs[i] = input;
        }
    });

    var nonIndexedData = data.slice(2);
    var indexedData = _.isArray(topics) ? topics.map(function (topic) { return topic.slice(2); }).join('') : topics;

    var notIndexedParams = this.decodeParameters(notIndexedInputs, nonIndexedData);
    var indexedParams = this.decodeParameters(indexedInputs, indexedData);


    var returnValue = new Result();
    returnValue.__length__ = 0;

    inputs.forEach(function (res, i) {
        returnValue[i] = (res.type === 'string') ? '' : null;

        if (notIndexedParams[i]) {
            returnValue[i] = notIndexedParams[i];
        }
        if (indexedParams[i]) {
            returnValue[i] = indexedParams[i];
        }

        if(res.name) {
            returnValue[res.name] = returnValue[i];
        }

        returnValue.__length__++;
    });

    return returnValue;
};


var coder = new ABICoder([
    new SolidityTypeAddress(),
    new SolidityTypeBool(),
    new SolidityTypeInt(),
    new SolidityTypeUInt(),
    new SolidityTypeDynamicBytes(),
    new SolidityTypeBytes(),
    new SolidityTypeString()
]);

module.exports = coder;
