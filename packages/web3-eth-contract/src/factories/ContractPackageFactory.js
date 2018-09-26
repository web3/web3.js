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
 * @file ContractPackageFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var ABIModel = require('../models/abi/ABIModel');
var ABIItemModel = require('../models/abi/ABIItemModel');
var MethodEncoder = require('../encoders/MethodEncoder');
var MethodResponseDecoder = require('../decoders/MethodResponseDecoder');
var ABIMapper = require('../mappers/ABIMapper');
var RpcMethodOptionsMapper = require('../mappers/RpcMethodOptionsMapper');
var MethodsProxy = require('../proxies/MethodsProxy');
var RpcMethodOptionsValidator = require('../validators/RpcMethodOptionsValidator');
var RpcMethodFactory = require('../factories/RpcMethodFactory');

/**
 * @constructor
 */
function ContractPackageFactory() { }

/**
 * Returns an object of ABIModel
 *
 * @method createABIModel
 *
 * @param {Object} mappedAbi
 *
 * @returns {ABIModel}
 */
ContractPackageFactory.prototype.createABIModel = function (mappedAbi) {
    return new ABIModel(mappedAbi);
};

/**
 * Returns an object of ABIItemModel
 *
 * @method createABIItemModel
 *
 * @param {Object} abiItem
 *
 * @returns {ABIItemModel}
 */
ContractPackageFactory.prototype.createABIItemModel = function (abiItem) {
    return new ABIItemModel(abiItem);
};

/**
 * Returns an object of MethodEncoder
 *
 * @method createMethodEncoder
 *
 * @param {ABICoder} abiCoder
 *
 * @returns {MethodEncoder}
 */
ContractPackageFactory.prototype.createMethodEncoder = function (abiCoder) {
    return new MethodEncoder(abiCoder);
};

/**
 * Returns an object of ABIMapper
 *
 * @method createABIMapper
 *
 * @param {ABICoder} abiCoder
 * @param {Utils} utils
 *
 * @returns {ABIMapper}
 */
ContractPackageFactory.prototype.createABIMapper = function (abiCoder, utils) {
    return new ABIMapper(this, abiCoder, utils);
};

/**
 * Returns an object of MethodResponseDecoder
 *
 * @method createMethodResponseDecoder
 *
 * @param {ABICoder} abiCoder
 *
 * @returns {MethodResponseDecoder}
 */
ContractPackageFactory.prototype.createMethodResponseDecoder = function (abiCoder) {
    return new MethodResponseDecoder(abiCoder);
};

/**
 * Returns an object of RpcMethodOptionsValidator
 *
 * @method createRpcMethodOptionsValidator
 *
 * @param {Utils} utils
 *
 * @returns {RpcMethodOptionsValidator}
 */
ContractPackageFactory.prototype.createRpcMethodOptionsValidator = function (utils) {
    return new RpcMethodOptionsValidator(utils);
};

/**
 * Returns an object of RpcMethodOptionsMapper
 *
 * @method createRpcMethodOptionsMapper
 *
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @returns {RpcMethodOptionsMapper}
 */
ContractPackageFactory.prototype.createRpcMethodOptionsMapper = function (utils, formatters) {
    return new RpcMethodOptionsMapper(utils, formatters);
};

/**
 * Returns an object of RpcMethodFactory
 *
 * @method createRpcMethodFactory
 *
 * @param {ABICoder} abiCoder
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @returns {RpcMethodFactory}
 */
ContractPackageFactory.prototype.createRpcMethodFactory = function (abiCoder, utils, formatters, accounts) {
    return new RpcMethodFactory(
        this.createMethodResponseDecoder(abiCoder),
        accounts,
        utils,
        formatters
    );
};

/**
 * Returns an Object of MethodsProxy
 *
 * @method createMethodsProxy
 *
 * @param {Contract} contract
 * @param {ABIModel} abiModel
 * @param {MethodController} methodController
 * @param {ABICoder} abiCoder
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {Accounts} accounts
 *
 * @returns {MethodsProxy}
 */
ContractPackageFactory.prototype.createMethodsProxy = function (
    contract,
    abiModel,
    methodController,
    abiCoder,
    utils,
    formatters,
    accounts
) {
    return new MethodsProxy(
        contract,
        abiModel,
        this.createRpcMethodFactory(abiCoder, utils, formatters, accounts),
        methodController,
        this.createMethodEncoder(abiCoder)
    );
};

module.exports = ContractPackageFactory;
