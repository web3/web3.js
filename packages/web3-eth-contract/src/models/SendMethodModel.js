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
 * @file SendMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var SendTransactionMethodModel = require('web3-core-method').SendTransactionMethodModel;

/**
 * @param {Object} abiItem
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {MethodEncoder} methodEncoder
 * @param {MethodResponseDecoder} methodResponseDecoder
 *
 * @constructor
 */
function SendMethodModel(abiItem, utils, formatters, methodEncoder, methodResponseDecoder) {
    SendTransactionMethodModel.call(this, utils, formatters);
    this.contractMethodParameters = null;
    this.abiItem = abiItem;
    this.methodEncoder = methodEncoder;
    this.methodResponseDecoder = methodResponseDecoder;
    this.signature = '';
}

/**
 * This method will be executed before the RPC request.
 *
 * @method beforeExecution
 *
 * @param {Object} web3Package - The package where the method is called from for example Eth.
 */
SendMethodModel.prototype.beforeExecution = function (web3Package) {
    this.parameters[0]['data'] = self.methodEncoder.encode(
        this.contractMethodParameters,
        this.abiItem,
        this.signature,
        web3Package.contractOptions.data
    );
    this.parameters[0]['to'] = web3Package.contractOptions.address;
    SendTransactionMethodModel.prototype.beforeExecution.call(this, web3Package);
};

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Object} response
 *
 * @returns {*}
 */
SendMethodModel.prototype.afterExecution = function (response) {
    return this.methodResponseDecoder.decode(this.abiItem, response);
};

SendMethodModel.prototype = Object.create(SendTransactionMethodModel.prototype);
SendMethodModel.prototype.constructor = SendMethodModel;

module.exports = SendMethodModel;
