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
import SocketProviderAdapter from './SocketProviderAdapter';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

/**
 * @file EthereumProviderAdapter
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class EthereumProviderAdapter extends SocketProviderAdapter {
    /**
     * @param {EthereumProvider} provider
     *
     * @constructor
     */
    constructor(provider) {
        super(provider);
    }

    /**
     * Sends the JSON-RPC request
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    send(method, parameters) {
        return this.provider.send(method, parameters).then(response => {
            const validationResult = JsonRpcResponseValidator.validate(response);
            if (validationResult) {
                return response;
            }

            throw validationResult;
        });
    }

    /**
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns {Promise<Array|Error>}
     */
    sendBatch(methods, moduleInstance) {
        let methodCalls = [];

        method.forEach(method => {
            method.beforeExecution(moduleInstance);

            methodCalls.push(this.provider.send(method.rpcMethod, method.parameters));
        });

        return Promise.all(methodCalls);
    }

    /**
     * Emits an event with the subscription id
     *
     * @method registerSubscriptionListener
     */
    registerSubscriptionListener() {
        this.provider.on('notification', response => {
            this.emit(response.params.subscription, response.params.result);
        });
    }
}
