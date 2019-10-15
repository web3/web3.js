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

import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class Web3EthereumProvider extends AbstractSocketProvider {
    /**
     * @param {EthereumProvider} connection
     *
     * @constructor
     */
    constructor(connection) {
        super(connection, null);
        this.host = 'Web3EthereumProvider';
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.on('notification', this.onMessage.bind(this));
        this.connection.on('connect', this.onConnect.bind(this));
        this.connection.on('connect', this.onReady.bind(this));
        this.connection.on('close', this.onClose.bind(this));
        this.connection.on('networkChanged', this.onNetworkChanged.bind(this));
        this.connection.on('accountsChanged', this.onAccountsChanged.bind(this));
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
            case this.SOCKET_NETWORK_CHANGED:
                this.connection.removeListener('networkChanged', this.onNetworkChanged);
                break;
            case this.SOCKET_ACCOUNTS_CHANGED:
                this.connection.removeListener('accountsChanged', this.onAccountsChanged);
                break;
            case this.SOCKET_MESSAGE:
                this.connection.removeListener('notification', this.onMessage);
                break;
            case this.SOCKET_READY:
                this.connection.removeListener('connect', this.onReady);
                break;
            case this.SOCKET_CLOSE:
                this.connection.removeListener('close', this.onClose);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeListener('close', this.onError);
                break;
            case this.SOCKET_CONNECT:
                this.connection.removeListener('connect', this.onConnect);
                break;
        }

        super.removeAllListeners(event);
    }

    /**
     * Removes all socket listeners
     *
     * @method removeAllSocketListeners
     */
    removeAllSocketListeners() {
        this.connection.removeAllListeners();
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
     * @returns {Promise<Object>}
     */
    async send(method, parameters) {
        const response = this.connection.send(method, parameters);
        const validationResult = JsonRpcResponseValidator.validate(response);

        if (validationResult instanceof Error) {
            throw validationResult;
        }

        return response;
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractConfluxWebModule} moduleInstance
     *
     * @returns {Promise<Array|Error>}
     */
    sendBatch(methods, moduleInstance) {
        let methodCalls = [];

        methods.forEach((method) => {
            method.beforeExecution(moduleInstance);
            methodCalls.push(this.connection.send(method.rpcMethod, method.parameters));
        });

        return Promise.all(methodCalls);
    }
}
