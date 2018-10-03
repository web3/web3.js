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
 * @file ContractDeployMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";
var _ = require('underscore');
var SendTransactionMethodModel = require('web3-core-method').SendTransactionMethodModel;

/**
 * @param {Contract} contract
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @constructor
 */
function ContractDeployMethodModel(contract, utils, formatters, accounts) {
    SendTransactionMethodModel.call(this, utils, formatters, accounts);
    this.contract = contract;
}

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Object} response
 *
 * @returns {*}
 */
ContractDeployMethodModel.prototype.afterExecution = function (response) {
    var clonedContract = this.contract.clone();
    clonedContract.options.address = response.contractAddress;

    return clonedContract;
};

ContractDeployMethodModel.prototype = Object.create(SendTransactionMethodModel.prototype);
ContractDeployMethodModel.prototype.constructor = ContractDeployMethodModel;

module.exports = ContractDeployMethodModel;
