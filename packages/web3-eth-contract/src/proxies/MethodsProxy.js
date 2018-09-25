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
 * @param {MethodsFactory} methodsFactory
 * @param {MethodController} methodController
 * @param {MethodEncoder} methodEncoder
 *
 * @constructor
 */
function MethodsProxy(methodsFactory, methodController, methodEncoder) {
    this.methodsFactory = methodsFactory;
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
    if (this.methodsFactory.hasMethod(name)) {
        var methodModel = this.methodsFactory.createMethodModel(name);
        var requestType = this.getRequestType(methodModel);

        var anonymousFunction = function () {
            methodModel.contractMethodParameters = arguments;
        };

        anonymousFunction[requestType] = function () {
            methodModel.methodArguments = arguments;

            return self.methodController.execute(
                methodModel,
                target.currentProvider,
                target.accounts,
                target
            );
        };

        anonymousFunction[requestType].request = methodModel.request;

        anonymousFunction.estimateGas = function () {
            var estimateGasOfContractMethodModel = self.methodFactory.createEstimateGasOfContractMethodModel(methodModel);
            estimateGasOfContractMethodModel.methodArguments = arguments;

            return self.methodController.execute(
                estimateGasOfContractMethodModel,
                target.currentProvider,
                target.accounts,
                target
            );
        };

        anonymousFunction.encodeAbi = this.methodEncoder.encode(
            methodModel.contractMethodParameters,
            methodModel.abiItem,
            methodModel.signature,
            target.contractOptions.data
        );
    }

    throw Error('Method with name "' + name + '" not found');
};

/**
 * Determines which type of JSON-RPC request it is.
 *
 * @method getRequestType
 *
 * @param {AbstractMethodModel} methodModel
 *
 * @returns {string}
 */
MethodsProxy.prototype.getRequestType = function (methodModel) {
    if (methodModel.constructor.name === 'CallContractMethodModel') {
        return 'call';
    }

    return 'send';
};
