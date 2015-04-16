/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file abi.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Gav Wood <g@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');
var c = require('../utils/config');
var coder = require('./coder');
var f = require('./formatters');
var solUtils = require('./utils');

/**
 * Formats input params to bytes
 *
 * @method formatInput
 * @param {Array} abi inputs of method
 * @param {Array} params that will be formatted to bytes
 * @returns bytes representation of input params
 */
var formatInput = function (inputs, params) {
    var i = inputs.map(function (input) {
        return input.type;
    });
    return coder.encodeParams(i, params);
};

/** 
 * Formats output bytes back to param list
 *
 * @method formatOutput
 * @param {Array} abi outputs of method
 * @param {String} bytes represention of output
 * @returns {Array} output params
 */
var formatOutput = function (outs, bytes) {
    var bytes = bytes.slice(2);

    var o = outs.map(function (out) {
        return out.type;
    });
    
    return coder.decodeParams(o, bytes); 
};

/**
 * Should be called to create input parser for contract with given abi
 *
 * @method inputParser
 * @param {Array} contract abi
 * @returns {Object} input parser object for given json abi
 * TODO: refactor creating the parser, do not double logic from contract
 */
var inputParser = function (json) {
    var parser = {};
    json.forEach(function (method) {
        var displayName = utils.extractDisplayName(method.name);
        var typeName = utils.extractTypeName(method.name);

        var impl = function () {
            var params = Array.prototype.slice.call(arguments);
            return formatInput(method.inputs, params);
        };

        if (parser[displayName] === undefined) {
            parser[displayName] = impl;
        }

        parser[displayName][typeName] = impl;
    });

    return parser;
};

/**
 * Should be called to create output parser for contract with given abi
 *
 * @method outputParser
 * @param {Array} contract abi
 * @returns {Object} output parser for given json abi
 */
var outputParser = function (json) {
    var parser = {};
    json.forEach(function (method) {

        var displayName = utils.extractDisplayName(method.name);
        var typeName = utils.extractTypeName(method.name);

        var impl = function (output) {
            return formatOutput(method.outputs, output);
        };

        if (parser[displayName] === undefined) {
            parser[displayName] = impl;
        }

        parser[displayName][typeName] = impl;
    });

    return parser;
};

var formatConstructorParams = function (abi, params) {
    var constructor = solUtils.getConstructor(abi, params.length);
    if (!constructor) {
        if (params.length > 0) {
            console.warn("didn't found matching constructor, using default one");
        }
        return '';
    }
    return formatInput(constructor.inputs, params);
};

module.exports = {
    inputParser: inputParser,
    outputParser: outputParser,
    formatInput: formatInput,
    formatOutput: formatOutput,
    formatConstructorParams: formatConstructorParams
};
