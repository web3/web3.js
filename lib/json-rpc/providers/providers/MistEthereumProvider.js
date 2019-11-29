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
 * @file MistEthereumProvider.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

// TODO: 2.0 will only support EIP-1193 compatible providers
export default class MistEthereumProvider extends AbstractSocketProvider {
    /**
     * @param {Web3EthereumProvider} connection
     *
     * @constructor
     */
    constructor(connection) {
        super(connection, null);
        this.host = 'mist';
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.on('data', this.onMessage.bind(this));
        this.connection.on('error', this.onError.bind(this));
        this.connection.on('connect', this.onConnect.bind(this));
        this.connection.on('connect', this.onReady.bind(this));
        this.connection.on('end', this.onClose.bind(this));
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
            case this.SOCKET_MESSAGE:
                this.connection.removeListener('data', this.onMessage);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeListener('error', this.onError);
                break;
            case this.SOCKET_CONNECT:
                this.connection.removeListener('connect', this.onConnect);
                break;
            case this.SOCKET_READY:
                this.connection.removeListener('connect', this.onConnect);
                break;
            case this.SOCKET_CLOSE:
                this.connection.removeListener('end', this.onClose);
                break;
        }

        super.removeAllListeners(event);
    }

    /**
     * This method has to exists to have the same interface as the socket providers.
     *
     * @method disconnect
     *
     * @returns {Boolean}
     */
    disconnect() {
        return true;
    }

    /**
     * Returns true if the socket is connected
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() {
        return this.connection.isConnected();
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method sendPayload
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            this.connection.send(payload, (error, response) => {
                if (!error) {
                    return resolve(response);
                }

                reject(error);
            });
        });
    }
}
