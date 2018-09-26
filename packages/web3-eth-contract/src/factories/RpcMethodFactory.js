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
 * @file RpcMethodFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var SendContractMethodModel = require('../models/methods/SendContractMethodModel');
var CallContractMethodModel = require('../models/methods/CallContractMethodModel');
var EstimateGasMethodModel = require('web3-core-method').EstimateGasMethodModel;

/**
 * @param {MethodResponseDecoder} methodResponseDecoder
 * @param {Accounts} accounts
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function RpcMethodFactory(methodResponseDecoder, accounts, utils, formatters) {
    this.utils = utils;
    this.formatters = formatters;
    this.methodResponseDecoder = methodResponseDecoder;
    this.accounts = accounts;
}

/**
 * Returns the correct JSON-RPC MethodModel
 *
 * @method createRpcMethod
 *
 * @param {ABIItemModel} abiItemModel
 *
 * @returns {AbstractMethodModel}
 */
RpcMethodFactory.prototype.createRpcMethod = function (abiItemModel) {
    var rpcMethod;

    switch (abiItemModel.requestType) {
        case 'call':
            rpcMethod = new CallContractMethodModel(
                abiItemModel,
                this.methodResponseDecoder,
                this.utils,
                this.formatters
            );
            break;
        case 'send' :
            rpcMethod = new SendContractMethodModel(
                abiItemModel,
                this.methodResponseDecoder,
                this.utils,
                this.formatters,
                this.accounts
            );
            break;
        case 'estimate':
            rpcMethod = new EstimateGasMethodModel(this.utils, this.formatters);
            break;
    }

    if (typeof rpcMethod === 'undefined') {
        throw Error('Unknown RPC call with name "' + abiItemModel.requestType + '"');
    }

    return rpcMethod;
};

module.exports = RpcMethodFactory;
