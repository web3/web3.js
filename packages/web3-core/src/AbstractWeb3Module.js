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

import {isArray, isObject} from 'underscore';

export default class AbstractWeb3Module {

    /**
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     * @param {ProviderDetector} providerDetector
     * @param {ProviderAdapterResolver} providerAdapterResolver
     * @param {ProvidersModuleFactory} providersModuleFactory
     * @param {Object} providers
     * @param {MethodController} methodController
     * @param {AbstractMethodModelFactory} methodModelFactory
     *
     * @constructor
     */
    constructor(
        provider = this.throwIfMissing('provider'),
        providerDetector = this.throwIfMissing('providerDetector'),
        providerAdapterResolver = this.throwIfMissing('providerAdapterResolver'),
        providersModuleFactory = this.throwIfMissing('providersModuleFactory'),
        providers = this.throwIfMissing('providers'),
        methodController = this.throwIfMissing('methodController'),
        methodModelFactory = null
    ) {
        this.methodController = methodController;
        this.extendedPackages = [];
        this.providerDetector = providerDetector;
        this.providerAdapterResolver = providerAdapterResolver;
        this.providersModuleFactory = providersModuleFactory;
        this.givenProvider = this.providerDetector.detect();
        this._currentProvider = provider;
        this.providers = providers;
        this.BatchRequest = () => {
            return this.providersModuleFactory.createBatchRequest(this.currentProvider);
        };

        if (methodModelFactory !== null && typeof methodModelFactory !== 'undefined') {
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
     * Returns the currentProvider
     *
     * @property currentProvider
     *
     * @returns {AbstractProviderAdapter|EthereumProvider}
     */
    get currentProvider() {
        return this._currentProvider;
    }

    /**
     * Throws an error because currentProvider is read-only
     *
     * @property currentProvider
     */
    set currentProvider(value) {
        throw Error('The property currentProvider read-only!');
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
    setProvider(provider, net) {
        if (!this.isSameProvider(provider)) {
            this.clearSubscriptions();
            this._currentProvider = this.providerAdapterResolver.resolve(provider, net);

            if (this.extendedPackages.length > 0) {
                var setExtendedPackagesProvider = this.extendedPackages.every(extendedPackage => {
                    return !!extendedPackage.setProvider(provider, net);
                });
            }

            return !!(setExtendedPackagesProvider && this._currentProvider);
        }

        return false;
    }

    /**
     * Checks if the given provider is the same as the currentProvider
     *
     * @method isSameProvider
     *
     * @param {Object|String} provider
     *
     * @returns {Boolean}
     */
    isSameProvider(provider) {
        if (isObject(provider)) {
            if (this.currentProvider.provider.constructor.name === provider.constructor.name) {
                return this.currentProvider.host === provider.host;
            }

            return false;
        }

        return this.currentProvider.host === provider;
    }

    /**
     * Clears all subscriptions and listeners of the provider if it has any subscriptions
     *
     * @method clearSubscriptions
     */
    clearSubscriptions() {
        if (typeof this.currentProvider.clearSubscriptions !== 'undefined' &&
            this.currentProvider.subscriptions.length > 0
        ) {
            this.currentProvider.clearSubscriptions();
        }
    }

    /**
     * Extends the current object with JSON-RPC methods
     *
     * @method extend
     *
     * @param {Object} extension
     */
    extend(extension) {
        const namespace = extension.property || false;
        let object;

        if (namespace) {
            object = this[namespace] = new this.constructor(
                this.currentProvider,
                this.providersPackage,
                this.methodController,
                new this.methodModelFactory.constructor(
                    {},
                    this.methodModelFactory.utils,
                    this.methodModelFactory.formatters
                )
            );

            this.extendedPackages.push(object);
        } else {
            object = this;
        }

        if (extension.methods) {
            extension.methods.forEach(method => {
                class ExtensionMethodModel extends AbstractMethodModel {
                    constructor(utils, formatters) {
                        super(method.call, method.params, utils, formatters);
                    }

                    beforeExecution(parameters, moduleInstance) {
                        method.inputFormatters.forEach((formatter, key) => {
                            if (formatter) {
                                parameters[key] = formatter(parameters[key], moduleInstance);
                            }
                        });
                    }

                    afterExecution(response) {
                        if (isArray(response)) {
                            response = response.map(responseItem => {
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
                    }
                }

                object.methodModelFactory.methodModels[method.name] = ExtensionMethodModel;
            });
        }
    }

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
    proxyHandler(target, name) {
        if (target.methodModelFactory.hasMethodModel(name)) {
            if (typeof target[name] !== 'undefined') {
                throw new Error(`Duplicated method ${name}. This method is defined as RPC call and as Object method.`);
            }

            const methodModel = target.methodModelFactory.createMethodModel(name);

            const anonymousFunction = () => {
                methodModel.methodArguments = arguments;

                if (methodModel.parameters.length !== methodModel.parametersAmount) {
                    throw Error(
                        `Invalid parameters length the expected length would be ${methodModel.parametersAmount} and not ${methodModel.parameters.length}`
                    );
                }

                return target.methodController.execute(methodModel, target.accounts, target);
            };

            anonymousFunction.methodModel = methodModel;
            anonymousFunction.request = methodModel.request;

            return anonymousFunction;
        }

        return target[name];
    }

    /**
     * Throws an error if the parameter is missing
     *
     * @param {String} name
     */
    throwIfMissing(name) {
        throw Error('Parameter with name ${name} is missing');
    }
}
