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
 * @file AbstractWeb3Module.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var _ = require('underscore');

/**
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodController} methodController
 * @param {AbstractMethodModelFactory} methodModelFactory
 *
 * @constructor
 */
function AbstractWeb3Module(
    provider,
    providersPackage,
    methodController,
    methodModelFactory
) {
    if (!this.isDependencyGiven(provider)) {
        throw Error('No provider given as constructor parameter!');
    }

    if (!this.isDependencyGiven(providersPackage)) {
        throw Error('ProviderPackage not found!');
    }

    this.methodController = methodController;
    this.extendedPackages = [];
    this.providersPackage = providersPackage;
    this.givenProvider = this.providersPackage.detect();

    this.providers = {
        HttpProvider: this.providersPackage.HttpProvider,
        IpcProvider: this.providersPackage.IpcProvider,
        WebsocketProvider: this.providersPackage.WebsocketProvider,
    };

    var self = this,
        currentProvider = provider;

    Object.defineProperty(this, 'currentProvider', {
        get: function () {
            return currentProvider;
        },
        set: function () {
           throw Error('The property currentProvider is an read-only property!');
        }
    });

    this.BatchRequest = function BatchRequest() {
        return self.providersPackage.createBatchRequest(self.currentProvider);
    };

    if (this.isDependencyGiven(methodModelFactory)) {
        this.methodModelFactory = methodModelFactory;
        this.extend.formatters = this.methodModelFactory.formatters;

        return new Proxy(this,
            {
                get: this.proxyHandler
            }
        )
    }
}

/**
 * Sets the currentProvider and provider property
 *
 * @method setProvider
 *
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @returns {Boolean}
 */
AbstractWeb3Module.prototype.setProvider = function (provider, net) {
    if (!this.isSameProvider(provider)) {
        this.clearSubscriptions();
        this.currentProvider = this.providersPackage.resolve(provider, net);

        if (this.extendedPackages.length > 0) {
            var setExtendedPackagesProvider = this.extendedPackages.every(function (extendedPackage) {
                return !!extendedPackage.setProvider(provider, net);
            });
        }

        return !!(setExtendedPackagesProvider && this.currentProvider);
    }

    return false;
};

/**
 * Checks if the given provider is the same as the currentProvider
 *
 * @method isSameProvider
 *
 * @param {Object|String} provider
 *
 * @returns {Boolean}
 */
AbstractWeb3Module.prototype.isSameProvider = function (provider) {
    if (_.isObject(provider)) {
        if (this.currentProvider.provider.constructor.name === provider.constructor.name) {
            return this.currentProvider.host === provider.host;
        }

        return false;
    }

    return this.currentProvider.host === provider;
};

/**
 * Clears all subscriptions and listeners of the provider if it has any subscriptions
 *
 * @method clearSubscriptions
 */
AbstractWeb3Module.prototype.clearSubscriptions = function () {
    if (typeof this.currentProvider.clearSubscriptions !== 'undefined' &&
        this.currentProvider.subscriptions.length > 0
    ) {
        this.currentProvider.clearSubscriptions();
    }
};

/**
 * Extends the current object with JSON-RPC methods
 *
 * @method extend
 *
 * @param {Object} extension
 */
AbstractWeb3Module.prototype.extend = function (extension) {
    var namespace = extension.property || false,
        object;

    if (namespace) {
        object = this[namespace] = new this.constructor(
            this.provider,
            this.providersPackage,
            this.methodController,
            new this.methodModelFactory.constructor(this.methodModelFactory.utils, this.methodModelFactory.formatters)
        );

        this.extendedPackages.push(object);
    } else {
        object = this;
    }

    if (extension.methods) {
        extension.methods.forEach(function (method) {
            function ExtensionMethodModel(utils, formatters) {
                AbstractMethodModel.call(this, method.call, method.params, utils, formatters);
            }

            ExtensionMethodModel.prototype.beforeExecution = function (parameters, moduleInstance) {
                method.inputFormatters.forEach(function (formatter, key) {
                    if (formatter) {
                        parameters[key] = formatter(parameters[key], moduleInstance);
                    }
                });
            };

            ExtensionMethodModel.prototype.afterExecution = function (response) {
                if (_.isArray(response)) {
                    response = response.map(function (responseItem) {
                        if (method.outputFormatter && responseItem) {
                            return method.outputFormatter(responseItem);
                        }

                        return responseItem;
                    });

                    return response;
                }

                if (method.outputFormatter && result) {
                    response = method.outputFormatter(response);
                }

                return response;
            };

            ExtensionMethodModel.prototype = Object.create(AbstractMethodModel.prototype);

            object.methodModelFactory.methodModels[method.name] = ExtensionMethodModel;
        });
    }
};

/**
 * Handles method execution
 *
 * @method proxyHandler
 *
 * @param {Object} target
 * @param {String} name
 *
 * @returns {*}
 */
AbstractWeb3Module.prototype.proxyHandler = function (target, name) {
    if (target.methodModelFactory.hasMethodModel(name)) {
        if (typeof target[name] !== 'undefined') {
            throw new Error('Duplicated method ' + name + '. This method is defined as RPC call and as Object method.');
        }

        var methodModel = target.methodModelFactory.createMethodModel(name);

        var anonymousFunction = function () {
            methodModel.methodArguments = arguments;

            if (methodModel.parameters.length !== methodModel.parametersAmount) {
                throw Error(
                    'Invalid parameters length the expected length would be'
                    + methodModel.parametersAmount +
                    'and not'
                    + methodModel.parameters.length
                );
            }

            return target.methodController.execute(methodModel, target.accounts, target);
        };

        anonymousFunction.methodModel = methodModel;
        anonymousFunction.request = methodModel.request;

        return anonymousFunction;
    }

    return target[name];
};

/**
 * Checks if the given value is defined
 *
 * @param {*} object
 *
 * @returns {Boolean}
 */
AbstractWeb3Module.prototype.isDependencyGiven = function (object) {
    return object !== null && typeof object !== 'undefined'
};

module.exports = AbstractWeb3Module;
