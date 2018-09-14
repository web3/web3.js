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
 * @file AbstractWeb3Object.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

/**
 * @param {Object} provider
 * @param {ProvidersPackage} providersPackage
 * @param {MethodPackage} methodPackage
 * @param {SubscriptionPackage} subscriptionPackage
 * @param {BatchRequest} batchRequest
 *
 * @constructor
 */
function AbstractWeb3Object(provider, providersPackage, methodPackage, subscriptionPackage, batchRequest) {
    this.providersPackage = providersPackage;
    this._provider = this.providersPackage.resolve(provider);
    this.givenProvider = this.providersPackage.detect();

    this.providers = {
        HttpProvider: this.providersPackage.HttpProvider,
        IpcProvider: this.providersPackage.IpcProvider,
        WebsocketProvider: this.providersPackage.WebsocketProvider,
    };

    this.BatchRequest = batchRequest;
    this.methodPackage = methodPackage;
    this.subscriptionPackage = subscriptionPackage;

    Object.defineProperty(this, 'currentProvider', {
        set: function (provider) {
            if (typeof this._provider.clearSubscriptions !== 'undefined' && this._provider.subscriptions.length > 0) {
                this._provider.clearSubscriptions();
            }

            this._provider = this.providersPackage.resolve(provider);
        },
        enumerable: true
    });

}

/**
 * Sets the currentProvider and provider property
 *
 * @method setProvider
 *
 * @param {any} provider
 */
AbstractWeb3Object.prototype.setProvider = function (provider) {
    this.currentProvider = provider;
};

/**
 * Extends the current object with JSON-RPC methods
 *
 * @method extend
 *
 * @param {Object} extension
 */
AbstractWeb3Object.prototype.extend = function (extension) {
    var namespace = extension.property || null,
        extendedObject,
        self = this;

    if (namespace) {
        extendedObject = this[namespace] = {};
    } else {
        extendedObject = this;
    }

    if (extension.methods.length > 0) {
        extension.methods.forEach(function(method) {
           extendedObject[method.name] = function () {
               var parameters = null;
               var callback = arguments[0];

               if (method.params && method.params > 0) {
                   parameters = arguments.slice(0, (method.params - 1 ));
                   callback = arguments.slice(-1);
               }

               return this.methodPackage.create(
                   self.currentProvider,
                   method.call,
                   parameters,
                   method.inputFormatter,
                   method.outputFormatter
               ).send(callback);
           };
        });
    }
};

module.exports = AbstractWeb3Object;
