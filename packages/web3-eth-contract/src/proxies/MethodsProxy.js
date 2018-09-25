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
 * @file MethodsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {AbiModel} abiModel
 * @param {RpcMethodFactory} rpcMethodFactory
 * @param {MethodController} methodController
 * @param {MethodEncoder} methodEncoder
 *
 * @constructor
 */
function MethodsProxy(abiModel, rpcMethodFactory, methodController, methodEncoder) {
    this.abiModel = abiModel;
    this.rpcMethodFactory = rpcMethodFactory;
    this.methodController = methodController;
    this.methodEncoder = methodEncoder;

    return new Proxy(this, {
        get: this.proxyHandler
    });
}

/**
 * Checks if a contract event exists by the given name and returns the subscription otherwise it throws an error
 *
 * @method proxyHandler
 *
 * @param {Object} target
 * @param {String} name
 *
 * @returns {Function|Error}
 */
MethodsProxy.prototype.proxyHandler = function (target, name) {
    var abiItemModel = this.abiModel.getMethod(name);

    if (abiItemModel) {
        var anonymousFunction = function () {
            abiItemModel.contractMethodParameters = arguments;
        };

        anonymousFunction[abiItemModel.requestType] = function () {
            var rpcMethod = this.rpcMethodFactory.createRpcMethod(abiItemModel);
            rpcMethod.methodArguments = arguments;

            var contractMethodArgumentsValidationResult = self.contractMethodArgumentsValidator.validate(abiItemModel);
            var rpcMethodOptionsValidationResult = self.rpcMethodOptionsValidator.validate(rpcMethod);

            if (contractMethodArgumentsValidationResult !== true && rpcMethodOptionsValidationResult !== true) {
                var promiEvent = new PromiEvent();
                var errorsObject = {
                    errors: [
                        contractMethodArgumentsValidationResult,
                        rpcMethodOptionsValidationResult
                    ]
                };

                promiEvent.resolve(null);
                promiEvent.reject(errorsObject);
                promiEvent.eventEmitter.emit('error', errorsObject);

                return promiEvent
            }

            return self.methodController.execute(
                rcpMethod,
                target.currentProvider,
                target.accounts,
                target
            );
        };

        anonymousFunction[abiItemModel.requestType].request = abiItemModel.request;

        anonymousFunction.estimateGas = function () {
            abiItemModel.requestType = 'estimate';

            var rpcMethod = this.rpcMethodFactory.createRpcMethod(abiItemModel);
            rpcMethod.methodArguments = arguments;

            return self.methodController.execute(
                rpcMethod,
                target.currentProvider,
                target.accounts,
                target
            );
        };

        anonymousFunction.encodeAbi = this.methodEncoder.encode(abiItemModel, target.contractOptions.data);
    }

    throw Error('Method with name "' + name + '" not found');
};

module.exports = MethodsProxy;
