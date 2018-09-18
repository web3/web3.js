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
 * @file GetUncleMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractMethodModel = require('web3-core-method').AbstractMethodModel;

/**
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @constructor
 */
function GetUncleMethodModel(utils, formatters, accounts) {
    AbstractMethodModel.call(
        this,
        'eth_getUncleByBlockNumberAndIndex',
        2,
        [
            formatters.inputBlockNumberFormatter,
            utils.numberToHex
        ],
        formatters.outputBlockFormatter,
        accounts
    )
}

GetUncleMethodModel.prototype.beforeExecute = function (parameters) {
    if (this.isHash(parameters[0])) {
        this.rpcMethod = 'eth_getUncleByBlockHashAndIndex';
    }
};

GetUncleMethodModel.prototype = Object.create(AbstractMethodModel.prototype);

module.exports = GetUncleMethodModel;
