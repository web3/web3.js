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
var PastEventLogsMethodModel = require('../models/methods/PastEventLogsMethodModel');
var EstimateGasMethodModel = require('web3-core-method').EstimateGasMethodModel;

/**
 * @param {MethodResponseDecoder} methodResponseDecoder
 * @param {Accounts} accounts
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function RpcMethodModelFactory(methodResponseDecoder, accounts, utils, formatters) {
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
RpcMethodModelFactory.prototype.createRpcMethodByRequestType = function (abiItemModel) {
    var rpcMethod;

    switch (abiItemModel.requestType) {
        case 'call':
            rpcMethod = this.createCallContractMethodModel(abiItemModel);
            break;
        case 'send' :
            rpcMethod = this.createSendContractMethodModel(abiItemModel);
            break;
        case 'estimate':
            rpcMethod = this.createEstimateGasMethodModel();
            break;
    }

    if (typeof rpcMethod === 'undefined') {
        throw Error('Unknown RPC call with requestType "' + abiItemModel.requestType + '"');
    }

    return rpcMethod;
};

/**
 * Returns an object of type PastEventLogsMethodModel
 *
 * @method createPastEventLogsMethodModel
 *
 * @param {ABIItemModel} abiItemModel
 *
 * @returns {PastEventLogsMethodModel}
 */
RpcMethodModelFactory.prototype.createPastEventLogsMethodModel = function (abiItemModel) {
    return new PastEventLogsMethodModel(abiItemModel, this.utils, this.formatters);
};

/**
 * Returns an object of type CallContractMethodModel
 *
 * @method createCallContractMethodModel
 *
 * @param {ABIItemModel} abiItemModel
 *
 * @returns {CallContractMethodModel}
 */
RpcMethodModelFactory.prototype.createCallContractMethodModel = function (abiItemModel) {
    return new CallContractMethodModel(
        abiItemModel,
        this.methodResponseDecoder,
        this.utils,
        this.formatters
    );
};

/**
 * Returns an object of type SendContractMethodModel
 *
 * @method createSendContractMethodModel
 *
 * @param {ABIItemModel} abiItemModel
 *
 * @returns {SendContractMethodModel}
 */
RpcMethodModelFactory.prototype.createSendContractMethodModel = function (abiItemModel) {
    return new SendContractMethodModel(
        abiItemModel,
        this.methodResponseDecoder,
        this.utils,
        this.formatters,
        this.accounts
    );
};

/**
 * Returns an object of type EstimateGasMethodModel
 *
 * @method createEstimateGasMethodModel
 *
 * @returns {EstimateGasMethodModel}
 */
RpcMethodModelFactory.prototype.createEstimateGasMethodModel = function () {
    return new EstimateGasMethodModel(this.utils, this.formatters)
};

module.exports = RpcMethodModelFactory;
