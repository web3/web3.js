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

import {w3cwebsocket as W3CWebsocket} from 'websocket';
import {XMLHttpRequest as XHR} from 'xhr2-cookies';
import URL from 'url-parse';
import ProviderResolver from '../resolvers/ProviderResolver';
import WebsocketProvider from '../providers/WebsocketProvider';
import IpcProvider from '../providers/IpcProvider';
import HttpProvider from '../providers/HttpProvider';
import BatchRequest from '../batch-request/BatchRequest';
import Web3EthereumProvider from '../providers/Web3EthereumProvider';
import MetamaskProvider from '../providers/MetamaskProvider';
import MistEthereumProvider from '../providers/MistEthereumProvider';
import CustomProvider from '../providers/CustomProvider';

export default class ProvidersModuleFactory {
    /**
     * Returns an BatchRequest object
     *
     * @method createBatchRequest
     *
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {BatchRequest}
     */
    createBatchRequest(moduleInstance) {
        return new BatchRequest(moduleInstance);
    }

    /**
     * Returns an ProviderResolver object
     *
     * @method createProviderResolver
     *
     * @returns {ProviderResolver}
     */
    createProviderResolver() {
        return new ProviderResolver(this);
    }

    /**
     * Returns an HttpProvider object
     *
     * @method createHttpProvider
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {HttpProvider}
     */
    createHttpProvider(url, options = {}) {
        return new HttpProvider(url, options, this);
    }

    /**
     * Returns a XMLHttpRequest object
     *
     * @method createXMLHttpRequest
     *
     * @param {String} host
     * @param {Number} timeout
     * @param {Array} headers
     * @param {Object} agent
     * @param {Boolean} withCredentials
     *
     * @returns {XMLHttpRequest}
     */
    createXMLHttpRequest(host, timeout = 0, headers, agent, withCredentials) {
        let request;

        // runtime is of type node
        if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
            request = new XHR();
            request.nodejsSet(agent);
        } else {
            request = new XMLHttpRequest();
        }

        request.open('POST', host, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.timeout = timeout;
        request.withCredentials = withCredentials;

        if (headers) {
            headers.forEach((header) => {
                request.setRequestHeader(header.name, header.value);
            });
        }

        return request;
    }

    /**
     * Return an WebsocketProvider object
     *
     * @method createWebsocketProvider
     *
     * @param {String} url
     * @param {Object} options
     *
     * @returns {WebsocketProvider}
     */
    createWebsocketProvider(url, options = {}) {
        let connection = '';

        // runtime is of type node
        if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
            let authToken;

            let headers = options.headers || {};

            const urlObject = new URL(url);

            if (urlObject.username && urlObject.password) {
                authToken = Buffer.from(`${urlObject.username}:${urlObject.password}`).toString('base64');
                headers.authorization = `Basic ${authToken}`;
            }

            else if (urlObject.auth) {
                headers.authorization = Buffer.from(urlObject.auth, 'base64');
            }

            connection = new W3CWebsocket(url, options.protocol, null, headers, null, options.clientConfig);
        } else {
            connection = new window.WebSocket(url, options.protocol);
        }

        return new WebsocketProvider(connection, options.timeout);
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
        return new IpcProvider(net.connect({path: path}), path);
    }

    /**
     * Returns an Web3EthereumProvider object
     *
     * @method createWeb3EthereumProvider
     *
     * @param {EthereumProvider} connection
     *
     * @returns {Web3EthereumProvider}
     */
    createWeb3EthereumProvider(connection) {
        return new Web3EthereumProvider(connection);
    }

    /**
     * Returns an MetamaskProvider object
     *
     * @method createMetamaskInpageProvider
     *
     * @param {MetamaskInpageProvider} inpageProvider
     *
     * @returns {MetamaskProvider}
     */
    createMetamaskProvider(inpageProvider) {
        return new MetamaskProvider(inpageProvider);
    }

    /**
     * Returns an MistEthereumProvider object
     *
     * @method createMistEthereumProvider
     *
     * @param {MistEthereumProvider} mistEthereumProvider
     *
     * @returns {MistEthereumProvider}
     */
    createMistEthereumProvider(mistEthereumProvider) {
        return new MistEthereumProvider(mistEthereumProvider);
    }

    /**
     * Returns an CustomProvider object
     *
     * @method createCustomProvider
     *
     * @param {Object} connection
     *
     * @returns {CustomProvider}
     */
    createCustomProvider(connection) {
        return new CustomProvider(connection);
    }
}
