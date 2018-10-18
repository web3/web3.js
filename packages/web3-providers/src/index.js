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
 *
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import ProvidersPackageFactory from './factories/ProvidersPackageFactory';
import BatchRequestObject from './batch-request/BatchRequest';
import JSONRpcMapper from './validators/JSONRpcResponseValidator';

export SocketProviderAdapter from './adapters/SocketProviderAdapter';
export HttpProviderAdapter from './adapters/HttpProviderAdapter';
export HttpProvider from './providers/HttpProvider';
export IpcProvider from './providers/IpcProvider';
export WebsocketProvider from './providers/WebsocketProvider';
export JSONRpcMapper from './mappers/JSONRpcMapper';
export JSONRpcResponseValidator from './validators/JSONRpcResponseValidator';

/**
 * Returns the Batch object
 *
 * @method BatchRequest
 *
 * @param {AbstractProviderAdapter|EthereumProvider} provider
 *
 * @returns {BatchRequest}
 */
export const BatchRequest = (provider) => {
    return new BatchRequestObject(
        provider,
        JSONRpcMapper,
        new ProvidersPackageFactory().createJSONRpcResponseValidator()
    );
};

/**
 * Resolves the right provider adapter by the given parameters
 *
 * @method resolve
 *
 * @param {Object|String} provider
 * @param {Net} net
 *
 * @returns {AbstractProviderAdapter}
 */
export const resolve = (provider, net) => {
    return new ProvidersPackageFactory().createProviderAdapterResolver().resolve(provider, net);
};

/**
 * Detects the given provider in the global scope
 *
 * @method detect
 *
 * @returns {Object}
 */
export const detect = () => {
    return new ProvidersPackageFactory().createProviderDetector().detect();
};
