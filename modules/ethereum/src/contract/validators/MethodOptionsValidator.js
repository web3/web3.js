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
 * @file MethodOptionsValidator.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import SendContractMethod from '../methods/SendContractMethod';

export default class MethodOptionsValidator {
    /**
     * @param {Utils} utils
     *
     * @constructor
     */
    constructor(utils) {
        this.utils = utils;
    }

    /**
     * Validates the options object for the RPC-Method call
     *
     * @method validate
     *
     * @param {AbiItemModel} abiItemModel
     * @param {Method} method
     *
     * @returns {Error|Boolean}
     */
    validate(abiItemModel, method) {
        if (!this.isToSet(abiItemModel, method)) {
            throw new Error("This contract object doesn't have address set yet, please set an address first.");
        }

        if (!this.isFromSet(method) && method instanceof SendContractMethod) {
            throw new Error('No valid "from" address specified in neither the given options, nor the default options.');
        }

        if (!this.isValueValid(abiItemModel, method)) {
            throw new Error('Can not send value to non-payable contract method or constructor');
        }

        return true;
    }

    /**
     * Checks if the property to is set in the options object
     *
     * @method isToSet
     *
     * @param {AbiItemModel} abiItemModel
     * @param {Method} method
     *
     * @returns {Boolean}
     */
    isToSet(abiItemModel, method) {
        if (abiItemModel.isOfType('constructor')) {
            return true;
        }

        return this.utils.isAddress(method.parameters[0].to);
    }

    /**
     * Checks if the property from of the options object is set and a valid address
     *
     * @method isFromSet
     *
     * @param {Method} method
     *
     * @returns {Boolean}
     */
    isFromSet(method) {
        return this.utils.isAddress(method.parameters[0].from);
    }

    /**
     * Checks the value and payable property are having valid values.
     *
     * @method isValueValid
     *
     * @param {AbiItemModel} abiItemModel
     * @param {Method} method
     *
     * @returns {Boolean}
     */
    isValueValid(abiItemModel, method) {
        return abiItemModel.payable || (!abiItemModel.payable && !method.parameters[0].value);
    }
}
