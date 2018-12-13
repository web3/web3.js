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
import HttpProvider from './providers/HttpProvider';
import IpcProvider from './providers/IpcProvider';
import WebsocketProvider from './providers/WebsocketProvider';

export SocketProviderAdapter from './adapters/SocketProviderAdapter';
export HttpProviderAdapter from './adapters/HttpProviderAdapter';
export HttpProvider from './providers/HttpProvider';
export IpcProvider from './providers/IpcProvider';
export WebsocketProvider from './providers/WebsocketProvider';
export ProvidersModuleFactory from './factories/ProvidersModuleFactory';

export const providers = {
    HttpProvider,
    WebsocketProvider,
    IpcProvider
};

/**
 * Creates the BatchRequest object
 *
 * @method BatchRequest
 *
 * @param {AbstractWeb3Module} moduleInstance
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 *
 * @returns {BatchRequest}
 */
export const BatchRequest = (moduleInstance, provider) => {
    return new ProvidersModuleFactory().createBatchRequest(moduleInstance, provider);
};

/**
 * Creates the ProviderAdapterResolver object
 *
 * @method ProviderAdapterResolver
 *
 * @returns {ProviderAdapterResolver}
 */
export const ProviderAdapterResolver = () => {
    return new ProvidersModuleFactory().createProviderAdapterResolver();
};

/**
 * Creates the ProviderDetector object
 *
 * @method detect
 *
 * @returns {Object}
 */
export const ProviderDetector = () => {
    return new ProvidersModuleFactory().createProviderDetector();
};
