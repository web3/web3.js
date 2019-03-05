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
 * @file index.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ProvidersModuleFactory from './factories/ProvidersModuleFactory';

/**
 * Creates the HttpProvider object.
 *
 * @param {String} url
 * @param {Object} options
 *
 * @returns {HttpProvider}
 *
 * @constructor
 */
export const HttpProvider = (url, options) => {
    return new ProvidersModuleFactory().createHttpProvider(url, options);
};

/**
 * Creates the WebsocketProvider object
 *
 * @param {String} url
 * @param {Object} options
 *
 * @returns {WebsocketProvider}
 *
 * @constructor
 */
export const WebsocketProvider = (url, options) => {
    return new ProvidersModuleFactory().createWebsocketProvider(url, options);
};

/**
 * Creates the IpcProvider object
 *
 * @param {string} path
 * @param {Net} net
 *
 * @returns {IpcProvider}
 *
 * @constructor
 */
export const IpcProvider = (path, net) => {
    return new ProvidersModuleFactory().createIpcProvider(path, net);
};

/**
 * Creates the BatchRequest object
 *
 * @method BatchRequest
 *
 * @param {AbstractWeb3Module} moduleInstance
 *
 * @returns {BatchRequest}
 *
 * @constructor
 */
export const BatchRequest = (moduleInstance) => {
    return new ProvidersModuleFactory().createBatchRequest(moduleInstance);
};

/**
 * Creates the ProviderResolver object
 *
 * @method ProviderResolver
 *
 * @returns {ProviderResolver}
 *
 * @constructor
 */
export const ProviderResolver = () => {
    return new ProvidersModuleFactory().createProviderResolver();
};

/**
 * Creates the ProviderDetector object
 *
 * @method detect
 *
 * @returns {ProviderDetector}
 *
 * @constructor
 */
export const ProviderDetector = () => {
    return new ProvidersModuleFactory().createProviderDetector();
};

// TODO: Do not expose the providers module factory this should only be used in this module
export ProvidersModuleFactory from './factories/ProvidersModuleFactory';
export Web3EthereumProvider from './providers/Web3EthereumProvider';
