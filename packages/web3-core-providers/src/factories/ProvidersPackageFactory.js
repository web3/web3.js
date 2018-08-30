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
 * @file ProviderPackageFactory.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

var ProviderAdapterResolver = require('../resolvers/ProviderAdapterResolver');
var SocketProviderAdapter = require('../adapters/SocketProviderAdapter');
var InpageProviderAdapter = require('../adapters/InpageProviderAdapter');
var HttpProviderAdapter = require('../adapters/HttpProviderAdapter');
var WebsocketProvider = require('../providers/WebsocketProvider');
var IpcProvider = require('../providers/IpcProvider');
var HttpProvider = require('../providers/HttpProvider');

function ProvidersPackageFactory() { }

/**
 * Return ProviderAdapterResolver object
 *
 * @returns {ProviderAdapterResolver}
 */
ProvidersPackageFactory.prototype.createProviderAdapterResolver = function () {
    return new ProviderAdapterResolver(this);
};

/**
 * Return ProviderDetector object
 *
 * @returns {ProviderDetector}
 */
ProvidersPackageFactory.prototype.createProviderDetector = function () {
    return new ProviderDetector();
};

/**
 * Return HttpProvider object
 *
 * @param {string} url
 *
 * @returns {HttpProvider}
 */
ProvidersPackageFactory.prototype.createHttpProvider = function (url) {
    return new HttpProvider(url);
};

/**
 * Return WebsocketProvider object
 *
 * @param {string} url
 *
 * @returns {WebsocketProvider}
 */
ProvidersPackageFactory.prototype.createWebsocketProvider = function (url) {
    return new WebsocketProvider(url);
};

/**
 * Return IpcProvider object
 *
 * @param {string} path
 * @param {Net} net
 *
 * @returns {IpcProvider}
 */
ProvidersPackageFactory.prototype.createIpcProvider = function (path, net) {
    return new IpcProvider(path, net);
};

/**
 * Returns HttpProviderAdapter object
 *
 * @param {HttpProvider} provider
 *
 * @returns {HttpProviderAdapter}
 */
ProvidersPackageFactory.prototype.createHttpProviderAdapter = function (provider) {
    return new HttpProviderAdapter(provider);
};

/**
 * Returns SocketProviderAdapter object
 *
 * @param {WebsocketProvider | IpcProvider} provider
 *
 * @returns {SocketProviderAdapter}
 */
ProvidersPackageFactory.prototype.createSocketProviderAdapter = function (provider) {
    return new SocketProviderAdapter(provider)
};

/**
 * Returns InpageProviderAdapter object
 *
 * @param {Object} provider
 *
 * @returns {InpageProviderAdapter}
 */
ProvidersPackageFactory.prototype.createInpageProviderAdapter = function (provider) {
    return new InpageProviderAdapter(provider)
};

module.exports = ProvidersPackageFactory;
