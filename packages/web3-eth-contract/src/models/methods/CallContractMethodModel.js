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
 * @file CallContractMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var CallMethodModel = require('web3-core-method').CallMethodModel;

/**
 * @param {ABIItemModel} abiItemModel
 * @param {CallMethodResponseDecoder} callMethodResponseDecoder
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function CallContractMethodModel(abiItemModel, callMethodResponseDecoder, utils, formatters) {
    CallMethodModel.call(this, utils, formatters);

    this.callMethodResponseDecoder = callMethodResponseDecoder;
    this.abiItemModel = abiItemModel;
}

CallContractMethodModel.prototype = Object.create(CallMethodModel.prototype);
CallContractMethodModel.prototype.constructor = CallContractMethodModel;

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Array} response
 *
 * @returns {*}
 */
CallContractMethodModel.prototype.afterExecution = function (response) {
    return this.callMethodResponseDecoder.decode(this.abiItemModel, response);
};

module.exports = CallContractMethodModel;
