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
 * @file WebsocketProvider.ts
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

// TODO: Add types to websocket dependency or define those types here in this repo
//@ts-ignore
import {w3cwebsocket as Ws} from '@web3-js/websocket';
import AbstractSocketProvider from "../../../lib/json-rpc/providers/AbstractSocketProvider";
import RequestItem from "../../../lib/json-rpc/providers/interfaces/RequestItem";
import JsonRpcPayload from "../../../lib/json-rpc/providers/interfaces/JsonRpcPayload";
import JsonRpcResponse from "../../../lib/json-rpc/providers/interfaces/JsonRpcResponse";
import WebsocketProviderOptions from "../../../lib/json-rpc/providers/interfaces/WebsocketProviderOptions";
import WebsocketHeaders from "../../../lib/json-rpc/providers/interfaces/WebsocketHeaders";
import ReconnectOptions from "../../../lib/json-rpc/providers/interfaces/ReconnectOptions";
import WebsocketClientConfig from "../../../lib/json-rpc/providers/interfaces/WebsocketClientConfig";
import WebsocketRequestOptions from "../../../lib/json-rpc/providers/interfaces/WebsocketRequestOptions";
import parseUrl from './helpers/parseUrl';
import _btoa from './helpers/btoa';

export default class WebsocketProvider extends AbstractSocketProvider {
    /**
     * @property connection
     */
    public connection: Ws | null = null;

    /**
     * @property headers
     */
    public headers: WebsocketHeaders;

    /**
     * @property protocol
     */
    public protocol: string | string[] | undefined;

    /**
     * @property reconnectOptions
     */
    public reconnectOptions: ReconnectOptions = {
        auto: false,
        delay: 5000,
        maxAttempts: false,
        onTimeout: false
    };

    /**
     * @property clientConfig
     */
    public clientConfig: WebsocketClientConfig | undefined;

    /**
     * @property requestOptions
     */
    public requestOptions: WebsocketRequestOptions | undefined;

    /**
     * @property reconnecting
     */
    public reconnecting: boolean = false;

    /**
     * @property reconnectAttempts
     */
    public reconnectAttempts: number = 0;

    /**
     * @property lastChunk
     */
    private lastChunk: string | null = null;

    /**
     * @property lastChunkTimeout
     */
    private lastChunkTimeout: any;

    /**
     * @param {String} url
     * @param {WebsocketProviderOptions} options
     *
     * @constructor
     */
    public constructor(public url: string, options: WebsocketProviderOptions = {}) {
        super();
        this.timeout = options.timeout ? options.timeout : this.timeout;
        this.headers = options.headers || {};
        this.protocol = options.protocol;
        this.reconnectOptions = Object.assign(this.reconnectOptions, options.reconnect);
        this.clientConfig = options.clientConfig; // Allow a custom client configuration
        this.requestOptions = options.requestOptions; // Allow a custom request options (https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#connectrequesturl-requestedprotocols-origin-headers-requestoptions)

        // The w3cwebsocket implementation does not support Basic Auth
        // username/password in the URL. So generate the basic auth header, and
        // pass through with any additional headers supplied in constructor
        const parsedURL = parseUrl(url);
        if (parsedURL.username && parsedURL.password) {
            this.headers.authorization = 'Basic ' + _btoa(parsedURL.username + ':' + parsedURL.password);
        }

        // When all node core implementations that do not have the
        // WHATWG compatible URL parser go out of service this line can be removed.
        if (parsedURL.auth) {
            this.headers.authorization = 'Basic ' + _btoa(parsedURL.auth);
        }

        this.connect();
    }

    /**
     * @property connected
     *
     * @returns {boolean}
     */
    public get connected(): boolean {
        return this.connection && this.connection.readyState === this.connection.OPEN;
    }

    /**
     * Connects to the configured node
     *
     * @method connect
     *
     * @returns {void}
     */
    public connect(): void {
        this.connection = new Ws(this.url, this.protocol, undefined, this.headers, this.requestOptions, this.clientConfig);
        this.addSocketListeners();
    }

    /**
     * TODO: This was only required for IPC the native WebSocket should be able to handle those chunks on his own.
     *
     * Will parse the response and make an array out of it.
     *
     * @method parseResponse
     *
     * @param {String} data
     *
     * @returns {Array}
     */
    private parseResponse(data: string): any[] {
        let returnValues: any[] = [];

        // DE-CHUNKER
        const dechunkedData = data
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data: string) => {

            // prepend the last chunk
            if (this.lastChunk)
                data = this.lastChunk + data;

            let result = null;

            try {
                result = JSON.parse(data);

            } catch (e) {

                this.lastChunk = data;

                // start timeout to cancel all requests
                clearTimeout(this.lastChunkTimeout);
                this.lastChunkTimeout = setTimeout(() => {
                    if (this.reconnectOptions.auto && this.reconnectOptions.onTimeout) {
                        this.reconnect();

                        return;
                    }

                    const error = new Error('Connection error: Timeout exceeded');

                    this.emit(this.ERROR, error);

                    if (this.requestQueue.size > 0) {
                        this.requestQueue.forEach((request: RequestItem, key: number | string) => {
                            request.reject(error);
                            this.requestQueue.delete(key);
                        });
                    }
                }, this.timeout);

                return;
            }

            // cancel timeout and set chunk to null
            clearTimeout(this.lastChunkTimeout);
            this.lastChunk = null;

            if (result)
                returnValues.push(result);
        });

        return returnValues;
    }

    /**
     * Emits the connect event and checks if there are subscriptions defined that should be resubscribed.
     *
     * @method onConnect
     */
    protected onConnect(): void {
        this.emit(this.CONNECT);
        this.reconnectAttempts = 0;
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach((request: RequestItem, key: number | string) => {
                this.sendPayload(request.payload).then(request.resolve).catch(request.reject);
                this.requestQueue.delete(key);
            });
        }
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {MessageEvent} messageEvent
     */
    protected onMessage(messageEvent: any): void {
        this.parseResponse((typeof messageEvent.data === 'string') ? messageEvent.data : '')
            .forEach((response: JsonRpcResponse) => {
                this.emit(this.DATA, response);
                super.onMessage(response);
            });
    }

    /**
     * This is the listener for the 'error' event of the current socket connection.
     *
     * @method onError
     *
     * @param {Event} error
     */
    protected onError(error: any): void {
        if (!error.code && !this.reconnecting) {
            this.emit(this.ERROR, error);

            if (this.requestQueue.size > 0) {
                this.requestQueue.forEach((request, key) => {
                    request.reject(error);
                    this.requestQueue.delete(key);
                });
            }

            if (this.responseQueue.size > 0) {
                this.responseQueue.forEach((request, key) => {
                    request.reject(error);
                    this.responseQueue.delete(key);
                });
            }

            this.removeSocketListeners();
            this.removeAllListeners();
        }
    }

    /**
     * This is the listener for the 'close' event of the current socket connection.
     *
     * @method onClose
     *
     * @param {CloseEvent} event
     */
    protected onClose(event: any): void {
        if (this.reconnectOptions.auto && (![1000, 1001].includes(event.code) || !event.wasClean)) {
            this.reconnect();

            return;
        }

        this.emit(this.CLOSE, event);

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach((request, key) => {
                request.reject(new Error('CONNECTION ERROR: The connection got closed with close code `' + event.code + '` and the following reason string `' + event.reason + '`'));
                this.requestQueue.delete(key);
            });
        }

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach((request, key) => {
                request.reject(new Error('CONNECTION ERROR: The connection got closed with close code `' + event.code + '` and the following reason string `' + event.reason + '`'));
                this.responseQueue.delete(key);
            });
        }

        this.removeSocketListeners();
        this.removeAllListeners();
    }

    /**
     * Will add the required socket listeners
     *
     * @method addSocketListeners
     *
     * @returns {void}
     */
    protected addSocketListeners(): void {
        this.connection.addEventListener('message', this.onMessage.bind(this));
        this.connection.addEventListener('open', this.onConnect.bind(this));
        this.connection.addEventListener('close', this.onClose.bind(this));
        this.connection.addEventListener('error', this.onError.bind(this));
    }

    /**
     * Will remove all socket listeners
     *
     * @method removeSocketListeners
     *
     * @returns {void}
     */
    protected removeSocketListeners(): void {
        this.connection.removeEventListener('message', this.onMessage);
        this.connection.removeEventListener('open', this.onConnect);
        this.connection.removeEventListener('close', this.onClose);
        this.connection.removeEventListener('error', this.onError);
    }

    /**
     * Removes the listeners and reconnects to the socket.
     *
     * @method reconnect
     */
    public reconnect(): void {
        this.reconnecting = true;

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach((request, key) => {
                request.reject(new Error('CONNECTION ERROR: Provider started to reconnect before the response got received!'));
                this.responseQueue.delete(key);
            });
        }

        if (
            !this.reconnectOptions.maxAttempts ||
            this.reconnectAttempts < this.reconnectOptions.maxAttempts
        ) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.removeSocketListeners();
                this.emit(this.RECONNECT, this.reconnectAttempts);
                this.connect();
            }, <number>this.reconnectOptions.delay);

            return;
        }

        this.emit(this.ERROR, new Error('Maximum number of reconnect attempts reached!'));
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
    public disconnect(code: number = 1000, reason?: string): void {
        this.connection.close(code, reason);
        this.removeSocketListeners();
    }

    /**
     * Returns if the socket connection is in the connecting state.
     *
     * @method isConnecting
     *
     * @returns {Boolean}
     */
    public isConnecting(): boolean {
        return this.connection.readyState === this.connection.CONNECTING;
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method sendPayload
     *
     * @param {Object} payload
     *
     * @returns {Promise<JsonRpcResponse>}
     */
    protected sendPayload(payload: JsonRpcPayload): Promise<JsonRpcResponse> {
        return new Promise((resolve, reject) => {
            let id = payload.id;
            const request: RequestItem = {payload: payload, resolve, reject};

            if (Array.isArray(payload)) {
                id = payload[0].id;
            }

            if (this.connection.readyState === this.connection.CONNECTING || this.reconnecting) {
                this.requestQueue.set(<number | string>id, request);

                return;
            }

            if (this.connection.readyState !== this.connection.OPEN) {
                this.requestQueue.delete(<number | string>id);

                const error = new Error('connection not open on send()');

                this.emit(this.ERROR, error);
                reject(error);

                return;
            }

            this.responseQueue.set(<number | string>id, request);
            this.requestQueue.delete(<number | string>id);

            try {
                this.connection.send(JSON.stringify(request.payload));
            } catch (error) {
                reject(error);
                this.responseQueue.delete(<number | string>id);
            }
        });


    }
}
