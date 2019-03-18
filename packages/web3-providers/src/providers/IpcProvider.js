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
 * @file IpcProvider.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import isArray from 'lodash/isArray';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class IpcProvider extends AbstractSocketProvider {
    /**
     * TODO: Add timeout to constructor
     *
     * @param {Socket} connection
     * @param {String} path
     *
     * @constructor
     */
    constructor(connection, path) {
        super(connection, null);
        this.host = path;
        this.chunks = '';
    }

    /**
     * Will close the socket connection.
     *
     * @method disconnect
     */
    disconnect() {
        this.connection.destroy();
    }

    /**
     * Returns true if the socket connection state is OPEN
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    get connected() {
        return !this.connection.pending;
    }

    /**
     * Try to reconnect
     *
     * @method reconnect
     */
    reconnect() {
        this.connection.connect({path: this.path});
    }

    /**
     * @param {String|Buffer} message
     */
    onMessage(message) {
        const chunk = message.toString('utf8');

        if (chunk.indexOf('\n') < 0) {
            this.chunks += chunk;

            return;
        }

        super.onMessage(this.chunks + chunk.substring(0, chunk.indexOf('\n')));
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        this.connection.on('data', this.onMessage.bind(this));
        this.connection.on('connect', this.onConnect.bind(this));
        this.connection.on('error', this.onError.bind(this));
        this.connection.on('close', this.onClose.bind(this));
        this.connection.on('timeout', this.onClose.bind(this));
        this.connection.on('ready', this.onReady.bind(this));
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
            case this.SOCKET_READY:
                this.connection.removeListener('ready', this.onReady);
                break;
            case this.SOCKET_CLOSE:
                this.connection.removeListener('close', this.onClose);
                break;
            case this.SOCKET_ERROR:
                this.connection.removeListener('error', this.onError);
                break;
            case this.SOCKET_CONNECT:
                this.connection.removeListener('connect', this.onConnect);
                break;
        }

        super.removeAllListeners(event);
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method send
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            if (!this.connection.writable) {
                this.connection.connect({path: this.path});
            }

            if (this.connection.write(JSON.stringify(payload))) {
                let id;

                if (isArray(payload)) {
                    id = payload[0].id;
                } else {
                    id = payload.id;
                }

                this.once(id, resolve);

                return;
            }

            return reject(new Error("Connection error: Couldn't write on the socket with Socket.write(payload)"));
        });
    }
}
