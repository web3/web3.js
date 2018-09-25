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
 * @file MethodsFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Array} methodAbiItems
 * @param {ContractPackageFactory} contractPackageFactory
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {MethodEncoder} methodEncoder
 * @param {MethodResponseDecoder} methodResponseDecoder
 *
 * @constructor
 */
function MethodsFactory(
    methodAbiItems,
    contractPackageFactory,
    utils,
    formatters,
    methodEncoder,
    methodResponseDecoder
) {
    this.methodAbiItems = methodAbiItems;
    this.contractPackageFactory = contractPackageFactory;
    this.utils = utils;
    this.formatters = formatters;
    this.methodEncoder = methodEncoder;
    this.methodResponseDecoder = methodResponseDecoder;
}

/**
 * Checks if an method exists on the contract by the given name
 *
 * @method hasMethod
 *
 * @param {String} name
 *
 * @returns {Boolean}
 */
MethodsFactory.prototype.hasMethod = function (name) {
    return this.getMethodFromAbi(name) !== undefined;
};

/**
 * Returns an method from the contract if it exists otherwise it returns undefined
 *
 * @method getEventFromAbi
 *
 * @param {String} name
 *
 * @returns {Object|undefined}
 */
MethodsFactory.prototype.getMethodFromAbi = function (name) {
    return this.methodAbiItems.find(function (methodAbiItem) {
        // check for all three name types (funcName, name, signature)
    });
};

/**
 * Return the EstimateGasOfContractMethodModel object
 *
 * @method createEstimateGasOfContractMethodModel
 *
 * @param {AbstractMethodModel} methodModel
 *
 * @returns {*}
 */
MethodsFactory.prototype.createEstimateGasOfContractMethodModel = function (methodModel) {
    return this.contractPackageFactory.createEstimateGasOfContractMethodModel(
        methodModel,
        this.utils,
        this.formatters,
        this.methodEncoder,
        this.methodResponseDecoder
    );
};

/**
 * Creates an method model by his name
 *
 * @method createEventSubscriptionModel
 *
 * @param {String} name
 *
 * @returns {AbstractMethodModel}
 */
MethodsFactory.prototype.createMethodModel = function (name) {
    var method = this.getMethodFromAbi(name);

    if (this.isSend(method)) {
        return this.contractPackageFactory.createSendMethodModel(
            this.getMethodFromAbi(name),
            this.utils,
            this.formatters,
            this.methodEncoder,
            this.methodResponseDecoder
        );
    }

    return this.contractPackageFactory.createCallMethodModel(
        this.getMethodFromAbi(name)
    );
};

/**
 * Checks if the ABI item is an sendTransaction method
 *
 * @method isSend
 *
 * @param {Object} abiItem
 *
 * @returns {Boolean}
 */
MethodsFactory.prototype.isSend = function (abiItem) {
    // pseudo-code
    return abiItem.type === 'send';
};
