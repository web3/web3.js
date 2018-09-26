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
 * @file ABIItemModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');

/**
 * @param {Object} abiItem
 *
 * @constructor
 */
function ABIItemModel(abiItem) {
    this.abiItem = abiItem;
    this.signature = this.abiItem.signature;
    this.contractMethodParameters = [];
}

/**
 * Returns the input length of the abiItem
 *
 * @method getInputLength
 *
 * @returns {Number}
 */
ABIItemModel.prototype.getInputLength = function () {
    if (_.isArray(this.abiItem.inputs)) {
        return this.abiItem.inputs.length;
    }

    return 0;
};

/**
 * Checks if the given parameter array length matches the abiItem inputs length
 *
 * @method givenParametersLengthIsValid
 *
 * @returns {Error|Boolean}
 */
ABIItemModel.prototype.givenParametersLengthIsValid = function () {
    var inputLength = this.getInputLength();

    if (this.contractMethodParameters.length === inputLength) {
        return true;
    }

    return new Error(
        'The number of arguments is not matching the methods required number. You need to pass '
        + inputLength + ' arguments.'
    );
};

/**
 * Returns all inputs of the abi item
 *
 * @method getInputs
 *
 * @returns {Array}
 */
ABIItemModel.prototype.getInputs = function () {
    var inputs = [];

    if (_.isArray(this.abiItem.inputs)) {
        inputs = this.abiItem.inputs;
    }

    return inputs;
};

/**
 * Checks the type of this abiItem
 *
 * @method isOfType
 *
 * @returns {Boolean}
 */
ABIItemModel.prototype.isOfType = function (type) {
    return this.abiItem.type === type;
};

module.export = ABIItemModel;
