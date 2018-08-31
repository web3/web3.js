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
 * @file ProviderDetector.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

var global = Function('return this')();

function ProviderDetector() { }

/**
 * Detects which provider is given with web3.currentProvider
 *
 * @method detect
 *
 * @returns {Object} provider
 */
ProviderDetector.prototype.detect = function () {
    if (typeof global.ethereumProvider !== 'undefined') {
        return global.ethereumProvider;
    }

    if (typeof global.web3 !== 'undefined' && global.web3.currentProvider) {

        if (this.isIpcProviderWrapper(global.web3.currentProvider)) {
            global.web3.currentProvider = this.addSubscriptionsToIpcProviderWrapper(global.web3.currentProvider);
        }

        return global.web3.currentProvider;
    }
};

/**
 * Checks if the given provider it is of type ipcProviderWrapper
 *
 * @method isIpcProviderWrapper
 *
 * @param {Object} currentProvider
 *
 * @returns {boolean}
 */
ProviderDetector.prototype.isIpcProviderWrapper = function (currentProvider) {
    return !currentProvider.on && currentProvider.connection && currentProvider.connection.constructor.name === 'ipcProviderWrapper';
};

/**
 * Adds the on method for the subscriptions to the ipcProviderWrapper
 *
 * @method addSubscriptionsToIpcProviderWrapper
 *
 * @param {Object} provider ipcProviderWrapper
 *
 * @returns {Object} ipcProviderWrapper
 */
ProviderDetector.prototype.addSubscriptionsToIpcProviderWrapper = function (provider) {
    provider.on = function (type, callback) {

        if (typeof callback !== 'function')
            throw new Error('The second parameter callback must be a function.');

        switch (type) {
            case 'data':
                this.connection.on('data', function (data) {
                    var result = '';

                    data = data.toString();

                    try {
                        result = JSON.parse(data);
                    } catch (e) {
                        return callback(new Error('Couldn\'t parse response data' + data));
                    }

                    // notification
                    if (!result.id && result.method.indexOf('_subscription') !== -1) {
                        callback(null, result);
                    }

                });
                break;

            default:
                this.connection.on(type, callback);
                break;
        }
    };

    return provider;
};
