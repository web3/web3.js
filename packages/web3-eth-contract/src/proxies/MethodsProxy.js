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
 * @param {MethodsProxy} target
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
            return self.executeMethod(abiItemModel, target, arguments);
        };

        anonymousFunction[abiItemModel.requestType].request = abiItemModel.request;

        anonymousFunction.estimateGas = function () {
            abiItemModel.requestType = 'estimate';

            return self.executeMethod(abiItemModel, target, arguments);
        };

        anonymousFunction.encodeAbi = this.methodEncoder.encode(abiItemModel, target.contract.options.data);
    }

    throw Error('Method with name "' + name + '" not found');
};

/**
 * Executes the RPC method with the methodController
 *
 * @param {AbiItemModel} abiItemModel
 * @param {MethodsProxy} target
 * @param {IArguments} methodArguments
 *
 * @returns {Promise|PromiEvent|String|Boolean}
 */
MethodsProxy.prototype.executeMethod = function (abiItemModel, target, methodArguments) {
    var rpcMethod = self.createRpcMethod(abiItemModel, target, methodArguments);

    if (typeof rpcMethod.error !== 'undefined') {
        return self.handleValidationError(rpcMethod.error, rpcMethod.callback);
    }

    return self.methodController.execute(
        rpcMethod,
        target.currentProvider,
        target.accounts,
        target
    );
};

/**
 * Creates the rpc method, encodes the contract method and validate the objects.
 *
 * @param {AbiItemModel} abiItemModel
 * @param {MethodsProxy} target
 * @param {IArguments} methodArguments
 *
 * @returns {AbstractMethodModel}
 */
MethodsProxy.prototype.createRpcMethod = function (abiItemModel, target, methodArguments) {
    // Get correct rpc method model
    var rpcMethod = this.rpcMethodFactory.createRpcMethod(abiItemModel);
    rpcMethod.methodArguments = methodArguments;

    // Validate contract method parameters length
    var contractMethodParametersLengthIsValid = abiItemModel.givenParametersLengthIsValid();
    if (contractMethodParametersLengthIsValid !== true) {
        return {
            error: contractMethodParametersLengthIsValid,
            callback: rpcMethod.callback
        };
    }

    // Encode contract method and check if there was an error
    var encodedContractMethod = self.methodEncoder.encode(abiItemModel, target.contract.options.data);
    if (encodedContractMethod instanceof Error) {
        return {
            error: encodedContractMethod,
            callback: rpcMethod.callback
        };
    }

    // Set encoded contractMethod as data property of the transaction or call
    rpcMethod.parameters[0]['data'] = encodedContractMethod;

    // Set default options in the TxObject if needed
    rpcMethod.parameters = self.rpcMethodOptionsMapper.map(target.contract, rpcMethod.parameters[0]);

    // Validate TxObject options
    var rpcMethodOptionsValidationResult = self.rpcMethodOptionsValidator.validate(abiItemModel, rpcMethod);
    if (rpcMethodOptionsValidationResult !== true) {
        return {
            error: rpcMethodOptionsValidationResult,
            callback: rpcMethod.callback
        };
    }

    return rpcMethod;
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
