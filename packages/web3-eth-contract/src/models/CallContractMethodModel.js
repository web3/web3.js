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
 * @file CallContractMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var CallMethodModel = require('web3-core-method').CallMethodModel;

/**
 * @param {Object} abiItem
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {MethodEncoder} methodEncoder
 * @param {MethodResponseDecoder} methodResponseDecoder
 *
 * @constructor
 */
function CallContractMethodModel(abiItem, utils, formatters, methodEncoder, methodResponseDecoder) {
    CallContractMethodModel.call(this, utils, formatters);
    this.contractMethodParameters = null;
    this.abiItem = abiItem;
    this.methodEncoder = methodEncoder;
    this.methodResponseDecoder = methodResponseDecoder;
    this.signature = '';
}

/**
 * This method will be executed before the RPC request.
 *
 * @method beforeExecution
 *
 * @param {Object} web3Package - The package where the method is called from for example Eth.
 */
CallContractMethodModel.prototype.beforeExecution = function (web3Package) {
    this.parameters[0]['data'] = self.methodEncoder.encode(
        this.contractMethodParameters,
        this.abiItem,
        this.signature,
        web3Package.contractOptions.data
    );

    this.parameters[0] = this.getOrSetDefaultOptions(this.parameters[0], web3Package);

    CallMethodModel.prototype.beforeExecution.call(this, web3Package);
};

/**
 * Use default values, if options are not available
 *
 * @method getOrSetDefaultOptions
 *
 * @param {Object} options the options gived by the user
 * @param {Object} web3Package - The package where the method is called from for example Eth.
 *
 * @returns {Object} the options with gaps filled by defaults
 */
CallContractMethodModel.prototype.getOrSetDefaultOptions = function getOrSetDefaultOptions(options, web3Package) {
    var from = null;
    var gasPrice = null;

    if (options.gasPrice) {
        gasPrice = String(options.gasPrice);
    }

    if (options.from) {
        from = this.utils.toChecksumAddress(formatters.inputAddressFormatter(options.from));
    }

    options.from = from || web3Package.contractOptions.from;
    options.gasPrice = gasPrice || web3Package.contractOptions.gasPrice;
    options.gas = options.gas || options.gasLimit || web3Package.contractOptions.gas;

    // TODO replace with only gasLimit?
    delete options.gasLimit;

    return options;
};

/**
 * This method will be executed after the RPC request.
 *
 * @method afterExecution
 *
 * @param {Object} response
 *
 * @returns {*}
 */
CallContractMethodModel.prototype.afterExecution = function (response) {
    return this.methodResponseDecoder.decode(this.abiItem, response);
};

CallContractMethodModel.prototype = Object.create(CallMethodModel.prototype);
CallContractMethodModel.prototype.constructor = CallContractMethodModel;

module.exports = CallContractMethodModel;
