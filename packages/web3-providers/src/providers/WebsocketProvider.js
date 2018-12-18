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
 * @authors: Samuel Furter <samuel@ethereum.org>
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
        this.host = this.connection.url;
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
                case 'ws_message':
                    this.connection.removeEventListener('message', this.onMessage);
                    break;
                case 'ws_open':
                    this.connection.removeEventListener('open', this.onOpen);
                    break;
                case 'ws_close':
                    this.connection.removeEventListener('close', this.onClose);
                    break;
                case 'ws_error':
                    this.connection.removeEventListener('error', this.onError);
                    break;
                case 'ws_connect':
                    this.connection.removeEventListener('connect', this.onConnect);
                    break;
            }
        }

        super.removeAllListeners(event);
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
        return this.sendPayload(JsonRpcMapper.toPayload(method, parameters));
    }

    /**
     * Sends batch payload
     *
     * @method sendBatch
     *
     * @param {AbstractMethod[]} methods
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @returns Promise<Object|Error>
     */
    sendBatch(methods, moduleInstance) {
        let payload = [];

        methods.forEach(method => {
            method.beforeExecution(moduleInstance);
            payload.push(JsonRpcMapper.toPayload(method.rpcMethod, method.parameters));
        });

        return this.sendPayload(payload);
    }

    /**
     * Sends the JSON-RPC request
     *
     * @method sendPayload
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            if (this.connection.readyState !== this.connection.OPEN) {
                reject('Connection error: Connection is not open on send()');
            }

            if (!this.isConnecting()) {
                this.connection.send(JSON.stringify(payload));

                let timeout;
                if (this.timeout) {
                    timeout = setTimeout(() => {
                        reject(new Error('Connection error: Timeout exceeded'));
                    }, this.timeout);
                }

                this.on(payload.id, response => {
                    this.removeAllListeners(payload.id);

                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    return resolve(response);
                });


                return;
            }

            this.on('open', () => {
                this.sendPayload(payload)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });

                this.removeAllListeners('open');
            });
        });
    }
}
