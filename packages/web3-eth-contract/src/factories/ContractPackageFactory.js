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

var AbiModel = require('../models/AbiModel');
var AbiItemModel = require('../models/AbiItemModel');
var MethodEncoder = require('../encoders/MethodEncoder');
var MethodResponseDecoder = require('../decoders/MethodResponseDecoder');
var AbiMapper = require('../mappers/AbiMapper');
var MethodOptionsMapper = require('../mappers/MethodOptionsMapper');
var MethodsProxy = require('../proxies/MethodsProxy');
var MethodValidator = require('../validators/MethodValidator');
var RpcMethodFactory = require('../factories/RpcMethodFactory');

/**
 * @constructor
 */
function ContractPackageFactory() {
}

/**
 * Returns an object of AbiModel
 *
 * @method createAbiModel
 *
 * @param {Object} mappedAbi
 *
 * @returns {AbiModel}
 */
ContractPackageFactory.prototype.createAbiModel = function (mappedAbi) {
    return new AbiModel(mappedAbi);
};

/**
 * Returns an object of AbiItemModel
 *
 * @methode createAbiItemModel
 *
 * @param {Object} abiItem
 *
 * @returns {AbiItemModel}
 */
ContractPackageFactory.prototype.createAbiItemModel = function (abiItem) {
    return new AbiItemModel(abiItem);
};

/**
 * Returns an object of MethodEncoder
 *
 * @method createMethodEncoder
 *
 * @param {AbiCoder} abiCoder
 *
 * @returns {MethodEncoder}
 */
ContractPackageFactory.prototype.createMethodEncoder = function (abiCoder) {
    return new MethodEncoder(abiCoder);
};

/**
 * Returns an object of AbiMapper
 *
 * @method createAbiMapper
 *
 * @param {AbiCoder} abiCoder
 * @param {Utils} utils
 *
 * @returns {AbiMapper}
 */
ContractPackageFactory.prototype.createAbiMapper = function (abiCoder, utils) {
    return new AbiMapper(this, abiCoder, utils);
};

/**
 * Returns an object of MethodResponseDecoder
 *
 * @method createMethodResponseDecoder
 *
 * @param {AbiCoder} abiCoder
 *
 * @returns {MethodResponseDecoder}
 */
ContractPackageFactory.prototype.createMethodResponseDecoder = function (abiCoder) {
    return new MethodResponseDecoder(abiCoder);
};

/**
 * Returns an object of MethodValidator
 *
 * @method createMethodValidator
 *
 * @param {Utils} utils
 *
 * @returns {MethodValidator}
 */
ContractPackageFactory.prototype.createMethodValidator = function (utils) {
    return new MethodValidator(utils);
};

/**
 * Returns an object of MethodOptionsMapper
 *
 * @returns MethodOptionsMapper
 */
ContractPackageFactory.prototype.createMethodOptionsMapper = function () {
    return new MethodOptionsMapper();
};

/**
 * Returns an object of RpcMethodFactory
 *
 * @method createRpcMethodFactory
 *
 * @param {AbiCoder} abiCoder
 * @param {MethodPackage} methodPackage
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @returns {RpcMethodFactory}
 */
ContractPackageFactory.prototype.createRpcMethodFactory = function (abiCoder, methodPackage, utils, formatters) {
    return new RpcMethodFactory(
        methodPackage,
        this.createMethodOptionsMapper(),
        this.createMethodEncoder(abiCoder),
        utils,
        formatters
    );
};

/**
 * Returns an Object of MethodsProxy
 *
 * @method createMethodsProxy
 *
 * @param {AbiModel} abiModel
 * @param methodPackage
 * @param {MethodController} methodController
 * @param {AbiCoder} abiCoder
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @returns {MethodsProxy}
 */
ContractPackageFactory.prototype.createMethodsProxy = function (
    abiModel,
    methodPackage,
    methodController,
    abiCoder,
    utils,
    formatters
) {
    return new MethodsProxy(
        abiModel,
        this.createRpcMethodFactory(abiCoder, methodPackage, utils, formatters),
        methodController,
        this.createMethodEncoder(abiCoder)
    );
};

module.exports = ContractPackageFactory;
