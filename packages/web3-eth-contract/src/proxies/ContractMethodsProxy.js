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
 * @file ContractMethodsProxy.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {ContractMethodsFactory} contractMethodsFactory
 * @param {MethodController} methodController
 *
 * @constructor
 */
function ContractMethodsProxy(contractMethodsFactory, methodController) {
    this.contractMethodsFactory = contractMethodsFactory;
    this.methodController = methodController;

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
ContractMethodsProxy.prototype.proxyHandler = function (target, name) {
    if (this.contractMethodsFactory.hasMethod(name)) {
        var methodModel = this.contractMethodsFactory.createMethodModel(name);
        var requestType = this.getRequestType(methodModel);

        var anonymousFunction = function () {
            methodModel.parameters = arguments;
        };

        anonymousFunction[requestType] = function (options, callback) {
            methodModel.requestOptions = options;
            methodModel.callback = callback;

            return self.methodController.execute(
                methodModel,
                target.currentProvider,
                target.accounts,
                target
            );
        };

        anonymousFunction[requestType].request = methodModel.request;

        anonymousFunction.estimateGas = function () {

        };

        anonymousFunction.encodeAbi = function () {

        };

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
ContractMethodsProxy.prototype.getRequestType = function (methodModel) {
    if (methodModel.constructor.name === 'ContractCallMethodModel') {
        return 'call';
    }

    return 'send';
};
