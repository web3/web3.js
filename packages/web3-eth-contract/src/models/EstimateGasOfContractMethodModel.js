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
 * @file EstimateGasOfContractMethodModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var EstimateGasMethodModel = require('web3-core-method').EstimateGasMethodModel;

/**
 * @param {AbstractMethodModel} contractMethodModel
 * @param {Utils} utils
 * @param {Object} formatters
 * @param {MethodEncoder} methodEncoder
 *
 * @constructor
 */
function EstimateGasOfContractMethodModel(contractMethodModel, utils, formatters, methodEncoder) {
    EstimateGasMethodModel.call(this, utils, formatters);
    this.contractMethodParameters = contractMethodModel.contractMethodParameters;
    this.abiItem = contractMethodModel.abiItem;
    this.signature = contractMethodModel.signature;
    this.methodEncoder = methodEncoder;
}

/**
 * This method will be executed before the RPC request.
 *
 * @method beforeExecution
 *
 * @param {Object} web3Package - The package where the method is called from for example Eth.
 */
EstimateGasOfContractMethodModel.prototype.beforeExecution = function (web3Package) {
    this.parameters[0]['data'] = self.methodEncoder.encode(
        this.contractMethodParameters,
        this.abiItem,
        this.signature,
        web3Package.contractOptions.data
    );

    EstimateGasMethodModel.prototype.beforeExecution.call(this, web3Package);
};

EstimateGasOfContractMethodModel.prototype = Object.create(EstimateGasMethodModel.prototype);
EstimateGasOfContractMethodModel.prototype.constructor = EstimateGasOfContractMethodModel;

module.exports = EstimateGasOfContractMethodModel;
