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
 * @file EthereumProvider
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class EthereumProvider extends AbstractSocketProvider {
    /**
     * @param {EthereumProvider} connection
     *
     * @constructor
     */
    constructor(connection) {
        super(connection, null);
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.on('notification', this.onMessage);
        this.connection.on('connect', this.onConnect);
        this.connection.on('close', this.onClose);
        this.connection.on('networkChanged', this.onNetworkChanged);
        this.connection.on('accountsChanged', this.onAccountsChanged);
    }

    /**
     * Removes all listeners on the EventEmitter and the socket object.
     *
     * @method removeAllListeners
     *
     * @param {String} event
     */
    removeAllListeners(event) {
        switch (event) {
            case 'socket_networkChanged':
                this.connection.removeListener('networkChanged', this.onNetworkChanged);
                break;
            case 'socket_accountsChanged':
                this.connection.removeListener('accountsChanged', this.onAccountsChanged);
                break;
            case 'socket_message':
                this.connection.removeListener('notification', this.onMessage);
                break;
            case 'socket_ready':
                this.connection.removeListener('connect', this.onReady);
                break;
            case 'socket_close':
                this.connection.removeListener('close', this.onClose);
                break;
            case 'socket_error':
                this.connection.removeListener('close', this.onError);
                break;
            case 'socket_connect':
                this.connection.removeListener('connect', this.onConnect);
                break;
        }

        super.removeAllListeners(event);
    }

    /**
     * This is the listener for the 'networkChanged' event of the EthereumProvider.
     *
     * @param {Number} networkId
     */
    onNetworkChanged(networkId) {
        this.emit('networkChanged', networkId);
    }

    /**
     * This is the listener for the 'accountsChanged' event of the EthereumProvider.
     *
     * @param {Array} accounts
     */
    onAccountsChanged(accounts) {
        this.emit('accountsChanged', accounts);
    }

    /**
     * This is the listener for the 'message' events of the current EthereumProvider connection.
     *
     * @method onMessage
     *
     * @param {Object} response
     */
    onMessage(response) {
        this.emit(this.getSubscriptionEvent(response.subscription), response);
    }

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    send(method, parameters) {
        return this.connection.send(method, parameters)
            .then(response => {
                const validationResult = JsonRpcResponseValidator.validate(response);

                if (validationResult instanceof Error) {
                    throw validationResult;
                }

                return response;
            });
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
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
            methodCalls.push(this.connection.send(method.rpcMethod, method.parameters));
        });

        return Promise.all(methodCalls);
    }
}
