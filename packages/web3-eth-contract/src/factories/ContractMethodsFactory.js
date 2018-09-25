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
 * @file ContractMethodsFactory.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Array} methodAbiItems
 * @param {ContractPackageFactory} contractPackageFactory
 *
 * @constructor
 */
function ContractMethodsFactory(methodAbiItems, contractPackageFactory) {
    this.eventAbiItems = eventAbiItems;
    this.contractPackageFactory = contractPackageFactory;
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
ContractMethodsFactory.prototype.hasMethod = function (name) {
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
ContractMethodsFactory.prototype.getMethodFromAbi = function (name) {
    return this.eventAbiItems.find(function (eventAbiItem) {
        // check for all three name types (funcName, name, signature)
    });
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
ContractMethodsFactory.prototype.createMethodModel = function (name) {
    var method = this.getMethodFromAbi(name);

    if (this.isSend(method)) {
        return this.contractPackageFactory.createSendMethodModel(
            this.getMethodFromAbi(name)
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
ContractMethodsFactory.prototype.isSend = function (abiItem) {
    // pseudo-code
    return abiItem.type === 'send';
};
