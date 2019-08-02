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
 * @file MetamaskProvider.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class MetamaskProvider extends AbstractSocketProvider {
    /**
     * @param {MetamaskInpageProvider} inpageProvider
     *
     * @constructor
     */
    constructor(inpageProvider) {
        super(inpageProvider, null);
        this.host = 'metamask';
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.on('accountsChanged', this.onAccountsChanged.bind(this));
        this.connection.on('networkChanged', this.onReady.bind(this));
        this.connection.on('networkChanged', this.onNetworkChanged.bind(this));
        this.connection.on('data', this.onMessage.bind(this));
        this.connection.on('error', this.onError.bind(this));
    }

    /**
     * @param metamaskParam
     * @param payload
     */
    onMessage(metamaskParam, payload) {
        super.onMessage(payload);
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
                this.connection.removeListener('data', this.onMessage);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeListener('error', this.onError);
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
        this.removeAllListeners(this.SOCKET_ACCOUNTS_CHANGED);
        this.removeAllListeners(this.SOCKET_NETWORK_CHANGED);

        super.removeAllSocketListeners();
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
                this.removeAllListeners(payload.id);

                if (!error) {
                    return resolve(response);
                }

                reject(error);
            });
        });
    }
}
