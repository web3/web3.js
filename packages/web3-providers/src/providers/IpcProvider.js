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
 * @file index.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import oboe from 'oboe';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';
import JsonRpcMapper from '../mappers/JsonRpcMapper';
import JsonRpcResponseValidator from '../validators/JsonRpcResponseValidator';

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
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        if (this.connection.constructor.name === 'Socket') {
            oboe(this.connection).done(this.onMessage);
        } else {
            this.connection.addListener('data', message => {
                this.onMessage(message.toString());
            });
        }

        this.connection.addListener('connect', this.onConnect);
        this.connection.addListener('error', this.onError);
        this.connection.addListener('close', this.onClose);
        this.connection.addListener('ready', this.onOpen);
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
                case 'socket_message':
                    this.connection.removeEventListener('data', this.onMessage);
                    break;
                case 'socket_ready':
                    this.connection.removeEventListener('ready', this.onReady);
                    break;
                case 'socket_close':
                    this.connection.removeEventListener('close', this.onClose);
                    break;
                case 'socket_error':
                    this.connection.removeEventListener('error', this.onError);
                    break;
                case 'socket_connect':
                    this.connection.removeEventListener('connect', this.onConnect);
                    break;
            }
        }

        super.removeAllListeners(event);
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
        return this.sendPayload(JsonRpcMapper.toPayload(method, parameters))
            .then(response => {
                const validationResult = JsonRpcResponseValidator.validate(response);

                if (validationResult instanceof Error) {
                    throw validationResult;
                }

                return response;
            });
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
     * @method send
     *
     * @param {Object} payload
     *
     * @returns {Promise<any>}
     */
    sendPayload(payload) {
        return new Promise((resolve, reject) => {
            if (this.connection.pending) {
                reject(new Error('Connection error: The socket is still trying to connect'));
            }

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

                this.on(id, response => {
                    resolve(response);

                    this.removeAllListeners(id);
                });

                return;
            }

            return reject(new Error('Connection error: Couldn\'t write on the socket with Socket.write(payload)'));
        });
    }
}
