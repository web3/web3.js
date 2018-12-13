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

import ProviderAdapterResolver from '../resolvers/ProviderAdapterResolver';
import ProviderDetector from '../detectors/ProviderDetector';
import SocketProviderAdapter from '../adapters/SocketProviderAdapter';
import HttpProviderAdapter from '../adapters/HttpProviderAdapter';
import WebsocketProvider from '../providers/WebsocketProvider';
import IpcProvider from '../providers/IpcProvider';
import HttpProvider from '../providers/HttpProvider';
import BatchRequest from '../batch-request/BatchRequest';
import EthereumProviderAdapter from '../adapters/EthereumProviderAdapter';

export default class ProvidersModuleFactory {
    /**
     * Returns an BatchRequest object
     *
     * @method createBatchRequest
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractProviderAdapter} provider
     *
     * @returns {BatchRequest}
     */
    createBatchRequest(moduleInstance, provider) {
        return new BatchRequest(moduleInstance, provider);
    }

    /**
     * Returns an ProviderAdapterResolver object
     *
     * @method createProviderAdapterResolver
     *
     * @returns {ProviderAdapterResolver}
     */
    createProviderAdapterResolver() {
        return new ProviderAdapterResolver(this);
    }

    /**
     * Returns an ProviderDetector object
     *
     * @method createProviderDetector
     *
     * @returns {ProviderDetector}
     */
    createProviderDetector() {
        return new ProviderDetector();
    }

    /**
     * Returns an HttpProvider object
     *
     * @method createHttpProvider
     *
     * @param {String} url
     *
     * @returns {HttpProvider}
     */
    createHttpProvider(url) {
        return new HttpProvider(url);
    }

    /**
     * Return an WebsocketProvider object
     *
     * @method createWebsocketProvider
     *
     * @param {String} url
     *
     * @returns {WebsocketProvider}
     */
    createWebsocketProvider(url) {
        return new WebsocketProvider(url);
    }

    /**
     * Returns an IpcProvider object
     *
     * @method createIpcProvider
     *
     * @param {String} path
     * @param {Net} net
     *
     * @returns {IpcProvider}
     */
    createIpcProvider(path, net) {
        return new IpcProvider(path, net);
    }

    /**
     * Returns an HttpProviderAdapter object
     *
     * @method createHttpProviderAdapter
     *
     * @param {HttpProvider} provider
     *
     * @returns {HttpProviderAdapter}
     */
    createHttpProviderAdapter(provider) {
        return new HttpProviderAdapter(provider);
    }

    /**
     * Returns an SocketProviderAdapter object
     *
     * @method createSocketProviderAdapter
     *
     * @param {WebsocketProvider|IpcProvider} provider
     *
     * @returns {SocketProviderAdapter}
     */
    createSocketProviderAdapter(provider) {
        return new SocketProviderAdapter(provider);
    }

    /**
     * Returns an EthereumProviderAdapter object
     *
     * @method createEthereumProviderAdapter
     *
     * @param {EthereumProvider} provider
     *
     * @returns {EthereumProviderAdapter}
     */
    createEthereumProviderAdapter(provider) {
        return new EthereumProviderAdapter(provider);
    }
}
