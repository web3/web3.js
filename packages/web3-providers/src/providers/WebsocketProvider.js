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

import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';
import isArray from 'lodash/isArray';

export default class WebsocketProvider extends AbstractSocketProvider {
    /**
     * @param {WebSocket} connection
     * @param {Number} timeout
     *
     * @constructor
     */
    constructor(connection, timeout) {
        super(connection, timeout);
        this.host = this.connection.url;
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {MessageEvent} messageEvent
     */
    onMessage(messageEvent) {
        super.onMessage(messageEvent.data);
    }

    /**
     * This is the listener for the 'error' event of the current socket connection.
     *
     * @method onError
     *
     * @param {Event} event
     */
    onError(event) {
        if (event.code === 'ECONNREFUSED') {
            this.reconnect();

            return;
        }

        super.onError(event);
    }

    /**
     * This ist the listener for the 'close' event of the current socket connection.
     *
     * @method onClose
     *
     * @param {CloseEvent} closeEvent
     */
    onClose(closeEvent) {
        if (closeEvent.code !== 1000 || closeEvent.wasClean === false) {
            this.reconnect();

            return;
        }

        super.onClose();
    }

    /**
     * Removes the listeners and reconnects to the socket.
     *
     * @method reconnect
     */
    reconnect() {
        setTimeout(() => {
            this.removeAllSocketListeners();

            let connection = [];

            if (this.connection.constructor.name === 'W3CWebsocket') {
                connection = new this.connection.constructor(
                    this.host,
                    this.connection._client.protocol,
                    null,
                    this.connection._client.headers,
                    this.connection._client.requestOptions,
                    this.connection._client.config
                );
            } else {
                connection = new this.connection.constructor(this.host, this.connection.protocol || undefined);
            }

            this.connection = connection;
            this.registerEventListeners();
        }, 5000);
    }

    /**
     * Will close the socket connection with a error code and reason.
     * Please have a look at https://developer.mozilla.org/de/docs/Web/API/WebSocket/close
     * for further information.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    disconnect(code = null, reason = null) {
        this.connection.close(code, reason);
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.addEventListener('message', this.onMessage.bind(this));
        this.connection.addEventListener('open', this.onReady.bind(this));
        this.connection.addEventListener('open', this.onConnect.bind(this));
        this.connection.addEventListener('close', this.onClose.bind(this));
        this.connection.addEventListener('error', this.onError.bind(this));
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
                this.connection.removeEventListener('message', this.onMessage);
                break;
            case this.SOCKET_READY:
                this.connection.removeEventListener('open', this.onReady);
                break;
            case this.SOCKET_CLOSE:
                this.connection.removeEventListener('close', this.onClose);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeEventListener('error', this.onError);
                break;
            case this.SOCKET_CONNECT:
                this.connection.removeEventListener('connect', this.onConnect);
                break;
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
        return this.connection.readyState === this.connection.OPEN;
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
            this.once('error', reject);

            if (!this.isConnecting()) {
                let timeout, id;

                if (this.connection.readyState !== this.connection.OPEN) {
                    this.removeListener('error', reject);

                    return reject(new Error('Connection error: Connection is not open on send()'));
                }

                try {
                    this.connection.send(JSON.stringify(payload));
                } catch (error) {
                    this.removeListener('error', reject);

                    reject(error);
                }

                if (this.timeout) {
                    timeout = setTimeout(() => {
                        reject(new Error('Connection error: Timeout exceeded'));
                    }, this.timeout);
                }

                if (isArray(payload)) {
                    id = payload[0].id;
                } else {
                    id = payload.id;
                }

                this.once(id, (response) => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }

                    this.removeListener('error', reject);

                    resolve(response);
                });

                return;
            }

            this.once('connect', () => {
                this.sendPayload(payload)
                    .then((response) => {
                        this.removeListener('error', reject);

                        resolve(response);
                    })
                    .catch((error) => {
                        this.removeListener('error', reject);

                        reject(error);
                    });
            });
        });
    }
}
