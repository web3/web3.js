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
 * @file RpcMethodOptionsValidator.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Object} utils
 *
 * @constructor
 */
function RpcMethodOptionsValidator(utils) {
    this.utils = utils;
}

/**
 * Validates the options object for the RPC-Method call
 *
 * @method validate
 *
 * @param {ABIItemModel} abiItemModel
 * @param {AbstractMethodModel} rpcMethodModel
 *
 * @returns {Error|Boolean}
 */
RpcMethodOptionsValidator.prototype.validate = function (abiItemModel, rpcMethodModel) {
    if (this.isToSet(abiItemModel, rpcMethodModel)) {
        return new Error('This contract object doesn\'t have address set yet, please set an address first.');
    }

    if (this.isFromSet(rpcMethodModel)) {
        return new Error('No "from" address specified in neither the given options, nor the default options.');
    }

    if (this.isValueValid(abiItemModel, rpcMethodModel)) {
        return new Error('Can not send value to non-payable contract method or constructor')
    }

    return true;
};

/**
 * Checks if the property to is set in the options object
 *
 * @method isToSet
 *
 * @param {ABIItemModel} abiItemModel
 * @param {AbstractMethodModel} rpcMethodModel
 *
 * @returns {Boolean}
 */
RpcMethodOptionsValidator.prototype.isToSet = function (abiItemModel, rpcMethodModel) {
    if (abiItemModel.signature === 'constructor') {
        return true;
    }

    return !!rpcMethodModel.parameters[0].to;
};

/**
 * Checks if the property from of the options object is set and a valid address
 *
 * @method isFromSet
 *
 * @param {AbstractMethodModel} rpcMethodModel
 *
 * @returns {Boolean}
 */
RpcMethodOptionsValidator.prototype.isFromSet = function (rpcMethodModel) {
    return this.utils.isAddress(rpcMethodModel.parameters[0].from);
};

/**
 * Checks if no value is set for an non-payable method
 *
 * @method isValueValid
 *
 * @param {ABIItemModel} abiItemModel
 * @param {AbstractMethodModel} rpcMethodModel
 *
 * @returns {Boolean}
 */
RpcMethodOptionsValidator.prototype.isValueValid = function (abiItemModel, rpcMethodModel) {
    return !(!abiItemModel.payable && rpcMethodModel.parameters[0].value && rpcMethodModel.parameters[0].value > 0);
};

module.exports = RpcMethodOptionsValidator;
