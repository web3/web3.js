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
 * @file GetBlockMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractMethodModel = require('../../../../lib/models/AbstractMethodModel');

/**
 * @param {Object} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function GetBlockMethodModel(utils, formatters) {
    AbstractMethodModel.call(this, 'eth_getBlockByNumber', 2, utils, formatters);
}

GetBlockMethodModel.prototype = Object.create(AbstractMethodModel.prototype);
GetBlockMethodModel.prototype.constructor = GetBlockMethodModel;

/**
 * This method will be executed before the RPC request.
 *
 * @method beforeExecution
 *
 * @param {Object} web3Package - The package where the method is called from for example Eth.
 */
GetBlockMethodModel.prototype.beforeExecution = function (web3Package) {
    if (this.isHash(this.parameters[0])) {
        this.rpcMethod = 'eth_getBlockByHash';
    }

    this.parameters[0] = this.formatters.inputBlockNumberFormatter(this.parameters[0]);
    this.parameters[1] = !!this.parameters[1];
};

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Object} response
 *
 * @returns {Object}
 */
GetBlockMethodModel.prototype.afterExecution = function(response) {
    return this.formatters.outputBlockFormatter(response);
};

module.exports = GetBlockMethodModel;
