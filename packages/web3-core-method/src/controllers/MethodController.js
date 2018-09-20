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
 * @file MethodController.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {CallMethodCommand} callMethodCommand
 * @param {SendMethodCommand} sendMethodCommand
 * @param {SignAndSendMethodCommand} signAndSendMethodCommand
 * @param {SignMessageCommand} signMessageCommand
 * @param {PromiEventPackage} promiEventPackage
 *
 * @constructor
 */
function MethodController(callMethodCommand, sendMethodCommand, signAndSendMethodCommand, signMessageCommand, promiEventPackage) {
    this.callMethodCommand = callMethodCommand;
    this.sendMethodCommand = sendMethodCommand;
    this.signAndSendMethodCommand = signAndSendMethodCommand;
    this.signMessageCommand = signMessageCommand;
    this.promiEventPackage = promiEventPackage;
}

/**
 * Determines which command should be executed
 *
 * @method execute
 *
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractProviderAdapter | EthereumProvider} provider
 * @param {Accounts} accounts
 * @param {AbstractWeb3Object} web3Package
 * @param {IArguments} methodArguments
 *
 * @returns {Promise | eventifiedPromise | String | boolean}
 */
MethodController.prototype.execute = function (methodModel, provider, accounts, web3Package, methodArguments) {
    var promiEvent = this.promiEventPackage.createPromiEvent(),
        mappedMethodArguments = this.mapFunctionArguments(methodArguments);

    if (this.hasWallets(accounts)) {
        if (methodModel.isSign()) {
            return this.signMessageCommand.execute(
                mappedMethodArguments.parameters[0],
                mappedMethodArguments.parameters[1],
                accounts,
                mappedMethodArguments.callback
            );
        }

        if (methodModel.isSendTransaction()) {
            return this.signAndSendMethodCommand.execute(
                methodModel,
                provider,
                promiEvent,
                mappedMethodArguments.callback
            );
        }
    }

    if (methodModel.isSendTransaction() || methodModel.isSendRawTransaction()) {
        return this.sendMethodCommand.execute(
            web3Package,
            methodModel,
            provider,
            promiEvent,
            mappedMethodArguments.callback
        );
    }

    return this.callMethodCommand.execute(
        web3Package,
        methodModel,
        provider,
        mappedMethodArguments.parameters,
        mappedMethodArguments.callback
    );
};

/**
 * Determines if accounts is defined and if wallet is not empty
 *
 * @method hasWallet
 *
 * @param accounts
 *
 * @returns {Boolean}
 */
MethodController.prototype.hasWallets = function (accounts) {
    return (accounts && accounts.wallet.length > 0);
};

/**
 * Returns the mapped function arguments
 *
 * @method mapFunctionArguments
 *
 * @param {IArguments} args
 *
 * @returns {Object}
 */
MethodController.prototype.mapFunctionArguments = function (args) {
    var parameters = args;
    var callback = null;

    if (arguments.length < this.parametersAmount) {
        throw new Error(
            'Arguments length is not correct: expected: ' + this.parametersAmount + ', given: ' + arguments.length
        );
    }

    if (arguments.length > this.parametersAmount) {
        callback = arguments.slice(-1);
        if(!_.isFunction(callback)) {
            throw new Error(
                'The latest parameter should be a function otherwise it can not be used as callback'
            );
        }
        parameters = arguments.slice(0, -1);
    }

    return {
        callback: callback,
        parameters: parameters
    }
};
