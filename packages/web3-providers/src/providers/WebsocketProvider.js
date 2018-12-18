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
 * @file WebsocketProvider.js
 * @authors: Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2018
 */

import JsonRpcMapper from '../mappers/JsonRpcMapper';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class WebsocketProvider extends AbstractSocketProvider {
    /**
     * @param {WsReconnector} connection
     * @param {Number} timeout
     *
     * @constructor
     */
    constructor(connection, timeout) {
        super(connection, timeout);
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.addEventListener('message', this.onMessage);
        this.connection.addEventListener('open', this.onOpen);
        this.connection.addEventListener('close', this.onClose);
        this.connection.addEventListener('error', this.onError);
        this.connection.addEventListener('connect', this.onConnect);
    }

    /**
     * Removes all listeners on the EventEmitter and the socket object.
     *
     * @method removeAllListeners
     *
     * @param {String} event
     */
    removeAllListeners(event) {
        if (event) {
            switch (event) {
                case 'message':
                    this.connection.removeEventListener('message', this.onMessage);
                    break;
                case 'close':
                    this.connection.removeEventListener('close', this.onClose);
                    break;
                case 'error':
                    this.connection.removeEventListener('error', this.onError);
                    break;
                case 'connect':
                    this.connection.removeEventListener('connect', this.onConnect);
                    break;
            }

            super.removeAllListeners(event);

            return;
        }

        this.connection.removeEventListener('open', this.onOpen);
        this.connection.removeEventListener('close', this.onClose);
        this.connection.removeEventListener('error', this.onError);
        this.connection.removeEventListener('connect', this.onConnect);
        super.removeAllListeners();
    }

    /**
     * Returns true if the socket connection state is OPEN
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() {
        return this.connection && this.connection.readyState === this.connection.OPEN;
    }

    /**
     * Returns if the socket connection is in the connecting state.
     *
     * @method isConnecting
     *
     * @returns {Boolean}
     */
    isConnecting() {
        return this.connection.readyState === this.connection.CONNECTING;
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
        return new Promise((resolve, reject) => {
            if (this.connection.readyState !== this.connection.OPEN) {
                reject('Connection error: Connection is not open on send()');
            }

            if (!this.isConnecting()) {
                const payload = JsonRpcMapper.toPayload(method, parameters);
                this.connection.send(JSON.stringify(payload));

                let timeout;
                if (this.timeout) {
                    timeout = setTimeout(() => {
                        reject(new Error('Connection error: Timeout exceeded'));
                    }, this.timeout);
                }

                this.on(payload.id, response => {
                    this.removeAllListeners(payload.id);

                    if (this.timeout) {
                        clearTimeout(timeout);
                    }

                    return resolve(response);
                });


                return;
            }

            setTimeout(() => {
                if (!this.isConnecting()) {
                    this.send(method, parameters)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });

                    return;
                }

                this.send(method, parameters);
            }, 500);
        });
    }
}
