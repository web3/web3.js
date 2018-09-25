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
 * @file ContractCallMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var SendTransactionMethodModel = require('web3-core-method').SendTransactionMethodModel;

function ContractSendMethodModel(abiItem, utils, formatters) {
    SendTransactionMethodModel.call(this, utils, formatters);
    this.contractMethodName = '';
    this.funcName = '';
    this.signature = '';
    this.requestOptions = null;
    this.parameters = null;
}

ContractSendMethodModel.prototype.beforeExecution = function (web3Package) {
    // extend SendTransactionMethodModel beforeExecution (encoding and creation of tx object)
};

ContractSendMethodModel.prototype.afterExecution = function (web3Package) {
    // extend SendTransactionMethodModel afterExecution (decoding)
};

ContractSendMethodModel.prototype = Object.create(SendTransactionMethodModel.prototype);
ContractSendMethodModel.prototype.constructor = ContractSendMethodModel;
