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
 * @file CallMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @constructor
 */
function CallMethodCommand() { }

/**
 * Sends a JSON-RPC call request
 *
 * @method execute
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractProviderAdapter} provider
 *
 * @callback callback callback(error, result)
 * @returns {Promise<any>}
 */
CallMethodCommand.prototype.execute = function (web3Package, methodModel, provider) {

    methodModel.beforeExecution(web3Package);

    return provider.send(
        methodModel.rpcMethod,
        methodModel.parameters
    ).then(function (response) {
        var mappedResponse = methodModel.afterExecution(response);

        methodModel.callback(mappedResponse);
        return mappedResponse;
    });
};

module.exports = CallMethodCommand;
