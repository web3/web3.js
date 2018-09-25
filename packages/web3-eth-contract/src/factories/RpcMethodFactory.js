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

/**
 * @param {MethodPackage} methodPackage
 * @param {MethodOptionsMapper} methodOptionsMapper
 * @param {MethodEncoder} methodEncoder
 * @param {Utils} utils
 * @param {Object} formatters
 *
 * @constructor
 */
function RpcMethodFactory(methodPackage, methodOptionsMapper, methodEncoder, utils, formatters) {
    this.methodPackage = methodPackage;
    this.utils = utils;
    this.formatters = formatters;
    this.methodOptionsMapper = methodOptionsMapper;
    this.methodEncoder = methodEncoder;
}

/**
 * Returns the correct JSON-RPC MethodModel
 *
 * @method createRpcMethod
 *
 * @param {AbiItemModel} abiItemModel
 *
 * @returns {AbstractMethodModel}
 */
RpcMethodFactory.prototype.createRpcMethod = function (abiItemModel) {
    var rpcMethod;

    switch (abiItemModel.requestType) {
        case 'call':
            rpcMethod = new this.methodPackage.CallMethodModel(this.utils, this.formatters);

            break;
        case 'send' :
            rpcMethod = new this.methodPackage.SendTransactionMethodModel(this.utils, this.formatters);

            break;
        case 'estimate':
            rpcMethod = new this.methodPackage.EstimateGasMethodModel(this.utils, this.formatters);

            break;
    }

    if (typeof rpcMethod === 'undefined') {
        throw Error('Unknown call type with name "' + abiItemModel.requestType + '"');
    }

    rpcMethod.methodArguments = arguments;
    rpcMethod.parameters[0]['data'] = this.methodEncoder.encode(abiItemModel.contractMethodParameters);
    rpcMethod.parameters = this.methodOptionsMapper.map(rpcMethod.parameters);

    return rpcMethod;
};

module.exports = RpcMethodFactory;
