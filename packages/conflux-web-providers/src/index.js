/*
    This file is part of confluxWeb.

    confluxWeb is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    confluxWeb is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with confluxWeb.  If not, see <http://www.gnu.org/licenses/>.
*/

import ProvidersModuleFactory from './factories/ProvidersModuleFactory';
export ProviderDetector from './detectors/ProviderDetector';

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
export function HttpProvider(url, options = {}) {
    return new ProvidersModuleFactory().createHttpProvider(url, options);
}

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
export function WebsocketProvider(url, options = {}) {
    return new ProvidersModuleFactory().createWebsocketProvider(url, options);
}

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
export function IpcProvider(path, net) {
    return new ProvidersModuleFactory().createIpcProvider(path, net);
}

/**
 * Creates the BatchRequest object
 *
 * @method BatchRequest
 *
 * @param {AbstractConfluxWebModule} moduleInstance
 *
 * @returns {BatchRequest}
 *
 * @constructor
 */
export function BatchRequest(moduleInstance) {
    return new ProvidersModuleFactory().createBatchRequest(moduleInstance);
}

/**
 * Creates the ProviderResolver object
 *
 * @method ProviderResolver
 *
 * @returns {ProviderResolver}
 *
 * @constructor
 */
export function ProviderResolver() {
    return new ProvidersModuleFactory().createProviderResolver();
}

// TODO: Do not expose the providers module factory this should only be used in this module
export ProvidersModuleFactory from './factories/ProvidersModuleFactory';
export ConfluxWebCfxProvider from './providers/ConfluxWebCfxProvider';
