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

"use strict";

import {version} from '../package.json';
import ProvidersPackageFactory from './factories/ProvidersPackageFactory';
import SocketProviderAdapter from './adapters/SocketProviderAdapter';
import HttpProviderAdapter from './adapters/HttpProviderAdapter';
import HttpProvider from './providers/HttpProvider';
import IpcProvider from './providers/IpcProvider';
import WebsocketProvider from './providers/WebsocketProvider';
import JSONRpcMapper from './mappers/JSONRpcMapper';
import JSONRpcResponseValidator from './validators/JSONRpcResponseValidator';
import BatchRequest from './batch-request/BatchRequest';

export default {
    version,

    SocketProviderAdapter,
    HttpProviderAdapter,

    HttpProvider,
    IpcProvider,
    WebsocketProvider,

    JSONRpcMapper,
    JSONRpcResponseValidator,

    /**
     * Returns the Batch object
     *
     * @method BatchRequest
     *
     * @param {AbstractProviderAdapter|EthereumProvider} provider
     *
     * @returns {BatchRequest}
     */
    BatchRequest: (provider) => {
        return new BatchRequest(
            provider,
            JSONRpcMapper,
            new ProvidersPackageFactory().createJSONRpcResponseValidator()
        );
    },

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
    resolve: (provider, net) => {
        return new ProvidersPackageFactory().createProviderAdapterResolver().resolve(provider, net);
    },

    /**
     * Detects the given provider in the global scope
     *
     * @method detect
     *
     * @returns {Object}
     */
    detect: () => {
        return new ProvidersPackageFactory().createProviderDetector().detect();
    }
};
