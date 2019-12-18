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
 * @date 2019
 */

import AbstractSocketProvider from "../../../lib/json-rpc/providers/AbstractSocketProvider";
import * as net from 'net';
import {isArray} from 'lodash';
import ProviderError from "../../errors/json-rpc/ProviderError";
import JsonRpcPayload from "../../../lib/json-rpc/providers/interfaces/JsonRpcPayload";
import JsonRpcResponse from "../../../lib/json-rpc/providers/interfaces/JsonRpcResponse";

export default class IpcProvider extends AbstractSocketProvider {
    /**
     * @property connection
     */
    public connection: net.Socket;

    /**
     * @property lastChunk
     */
    private lastChunk: string | null = '';

    /**
     * TODO: It should be possible to remove the net or at least to define it as optional constructor param
     *
     * @param {String} host
     * @param {net.Server} net
     *
     * @constructor
     */
    constructor(public host: string = '', net: any) {
        super();

        this.connect();
    }

    /**
     * Connects to the configured node
     *
     * @method connect
     *
     * @returns {void}
     */
    public connect(): void {
        this.connection = net.connect({path: this.host});
        this.addSocketListeners();
    }

    /**
     * Will close the socket connection.
     *
     * @method disconnect
     */
    public disconnect(): void {
        this.connection.destroy();
    }

    /**
     * Returns true if the socket connection state is OPEN
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    public get connected(): boolean {
        return !this.connection.connecting;
    }

    /**
     * Try to reconnect
     *
     * @method reconnect
     */
    public reconnect(): void {
        if (this.connection) {
            this.connection.connect({path: this.host});
        }
    }

    /**
     * @param {String|Buffer} message
     */
    protected onMessage(message: String | Buffer): void {
        let result = null;
        let returnValues: string[] = [];
        let dechunkedData = message
            .toString()
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data) => {
            result = null;
            if (this.lastChunk) {
                data = this.lastChunk + data;
            }

            try {
                result = JSON.parse(data);
            } catch (error) {
                this.lastChunk = data;

                return;
            }

            this.lastChunk = null;
            returnValues.push(result);
        });

        returnValues.forEach((chunk) => {
            super.onMessage(chunk);
        });
    }

    /**
     * Registers all the required listeners.
     *
     * @method addSocketListeners
     */
    protected addSocketListeners(): void {
        this.connection.on('data', this.onMessage.bind(this));
        this.connection.on('connect', this.onConnect.bind(this));
        this.connection.on('error', this.onError.bind(this));
        this.connection.on('close', this.onClose.bind(this));
        this.connection.on('timeout', this.onClose.bind(this));
    }

    /**
     * Removes all listeners on the EventEmitter and the socket object.
     *
     * @method removeAllListeners
     */
    protected removeSocketListeners(): void {
        this.connection.removeListener('data', this.onMessage);
        this.connection.removeListener('close', this.onClose);
        this.connection.removeListener('error', this.onError);
        this.connection.removeListener('connect', this.onConnect);
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method send
     *
     * @param {Object} payload
     *
     * @returns {Promise<JsonRpcResponse | JsonRpcResponse[]>}
     */
    protected sendPayload(payload: JsonRpcPayload): Promise<JsonRpcResponse | JsonRpcResponse[]> {
        return new Promise((resolve, reject) => {
            this.once('error', reject);

            if (!this.connection.writable) {
                this.connection.connect({path: this.host});
            }

            if (this.connection.write(JSON.stringify(payload))) {
                let id;

                if (isArray(payload)) {
                    id = payload[0].id;
                } else {
                    id = payload.id;
                }

                this.once(id, (response) => {
                    resolve(response);

                    this.removeListener('error', reject);
                });

                return;
            }

            this.removeListener('error', reject);

            return reject(new ProviderError('Couldn\'t write on the socket with Socket.write(payload)', this.host, payload));
        });
    }
}
