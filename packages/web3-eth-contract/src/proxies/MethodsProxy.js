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
 * @param {RpcMethodOptionsValidator} rpcMethodOptionsValidator
 * @param {RpcMethodOptionsMapper} rpcMethodOptionsMapper
 * @param {PromiEventPackage} promiEventPackage
 *
 * @constructor
 */
function MethodsProxy(
    abiModel,
    rpcMethodFactory,
    methodController,
    methodEncoder,
    rpcMethodOptionsValidator,
    rpcMethodOptionsMapper,
    promiEventPackage
) {
    this.abiModel = abiModel;
    this.rpcMethodFactory = rpcMethodFactory;
    this.methodController = methodController;
    this.methodEncoder = methodEncoder;
    this.rpcMethodOptionsValidator = rpcMethodOptionsValidator;
    this.rpcMethodOptionsMapper = rpcMethodOptionsMapper;
    this.promiEventPackage = promiEventPackage;

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
    var self = this;
    var abiItemModel = this.abiModel.getMethod(name);

    if (abiItemModel) {
        var anonymousFunction = function () {
            abiItemModel.contractMethodParameters = arguments;
        };

        anonymousFunction[abiItemModel.requestType] = function () {
            var rpcMethod = this.rpcMethodFactory.createRpcMethod(abiItemModel);
            rpcMethod.methodArguments = arguments;

            var contractMethodParametersLengthIsValid = abiItemModel.givenParametersLengthIsValid();

            if (contractMethodParametersLengthIsValid !== true) {
                return this.handleValidationError(contractMethodParametersLengthIsValid, rpcMethod.callback);
            }

            var encodedContractMethod = self.methodEncoder.encode(abiItemModel, target.contract.options.data);
            if (encodedContractMethod instanceof Error) {
                return this.handleValidationError(encodedContractMethod, rpcMethod.callback);
            }

            rpcMethod.parameters[0]['data'] = encodedContractMethod;
            rpcMethod.parameters = self.rpcMethodOptionsMapper.map(target.contract, rpcMethod.parameters[0]);

            var rpcMethodOptionsValidationResult = self.rpcMethodOptionsValidator.validate(abiItemModel, rpcMethod);

            if (rpcMethodOptionsValidationResult !== true) {
                return self.handleValidationError(rpcMethodOptionsValidationResult, rpcMethod.callback);
            }

            return self.methodController.execute(
                rpcMethod,
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

        anonymousFunction.encodeAbi = this.methodEncoder.encode(abiItemModel, target.contract.options.data);
    }

    throw Error('Method with name "' + name + '" not found');
};

/**
 * Creates an promiEvent and rejects it with an error
 *
 * @method handleValidationError
 *
 * @param {Error} error
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
MethodsProxy.prototype.handleValidationError = function (error, callback) {
    var promiEvent = this.promiEventPackage.createPromiEvent();

    promiEvent.resolve(null);
    promiEvent.reject(error);
    promiEvent.eventEmitter.emit('error', error);

    if (_.isFunction(callback)) {
        callback(error, null);
    }

    return promiEvent;
};

module.exports = MethodsProxy;
