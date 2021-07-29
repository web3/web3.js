import { w3cwebsocket } from 'websocket';
import {
    WebSocketOptions,
    WSErrors,
    WSStatus,
    ReconnectOptions,
} from './types';
import Web3ProviderBase from 'web3-providers-base';
import { EventEmitter } from 'events';

export default class Web3ProviderWS extends Web3ProviderBase {
    private webSocketConnection?: w3cwebsocket;
    private options: WebSocketOptions;

    private requestQueue: Map<any, any>;
    private responseQueue: Map<any, any>;
    private eventsManager: EventEmitter;
    private lastChunk: any;
    private lastChunkTimeout!: NodeJS.Timeout;

    private reconnecting: boolean;
    private reconnectAttempts: number;

    constructor(options: WebSocketOptions) {
        if (!Web3ProviderWS._validateProviderUrl(options.providerUrl))
            throw Error('Invalid WebSocket URL provided');

        super(options);
        this.options = options;
        this.webSocketConnection = undefined;
        this.requestQueue = new Map();
        this.responseQueue = new Map();
        this.reconnecting = false;
        this.reconnectAttempts = 0;

        this.eventsManager = new EventEmitter();

        if (!this.options.customTimeout) this.options.customTimeout = 1000 * 15;

        if (!this.options.reconnectOptions)
            this.options.reconnectOptions = {
                    auto: false,
                    delay: 5000,
                    maxAttempts: 5,
                    onTimeout: false,
                };
    }

    getEventEmitter() {
        return this.eventsManager;
    }

    private addSocketListeners() {
        if (!this.webSocketConnection)
            throw new Error(
                'Cannot addSocketListeners because of Invalid webSocketConnection'
            );

        (this.webSocketConnection as any).addEventListener(
            'message',
            this.onMessage.bind(this)
        );
        (this.webSocketConnection as any).addEventListener(
            'open',
            this.onConnect.bind(this)
        );
        (this.webSocketConnection as any).addEventListener(
            'close',
            this.onClose.bind(this)
        );
    }

    private removeSocketListeners() {
        if (!this.webSocketConnection)
            throw new Error(
                'Cannot removeSocketListeners because of Invalid webSocketConnection'
            );

        (this.webSocketConnection as any).removeEventListener(
            'message',
            this.onMessage
        );
        (this.webSocketConnection as any).removeEventListener(
            'open',
            this.onConnect
        );
        (this.webSocketConnection as any).removeEventListener(
            'close',
            this.onClose
        );
    }

    private parseResponse(inData: any) {
        let returnValues: any = [];

        // DE-CHUNKER
        let dechunkedData = inData
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data: any) => {
            // prepend the last chunk
            if (this.lastChunk) data = this.lastChunk + data;

            let result: any = null;

            try {
                result = JSON.parse(data);
            } catch (error) {
                this.lastChunk = data;

                if (this.lastChunkTimeout)
                    // start timeout to cancel all requests
                    clearTimeout(this.lastChunkTimeout);

                this.lastChunkTimeout = setTimeout(() => {
                    if (this.options.reconnectOptions &&
                        this.options.reconnectOptions.auto &&
                        this.options.reconnectOptions.onTimeout
                    ) {
                        this.reconnect();

                        return;
                    }

                    this.eventsManager.emit(
                        WSStatus.ERROR,
                        WSErrors.ConnectionTimeout + this.options.customTimeout
                    );

                    if (this.requestQueue.size > 0) {
                        this.requestQueue.forEach((request: any, key: any) => {
                            //request.callback(errors.ConnectionTimeout(this.options.customTimeout));
                            this.requestQueue.delete(key);
                        });
                    }
                }, this.options.customTimeout);

                return;
            }

            // cancel timeout and set chunk to null
            clearTimeout(this.lastChunkTimeout);
            this.lastChunk = null;

            if (result) returnValues.push(result);
        });

        return returnValues;
    }

    private reconnect() {
        this.reconnecting = true;

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach((request: any, key: any) => {
                request.callback(WSErrors.PendingRequestsOnReconnectingError);
                this.responseQueue.delete(key);
            });
        }

        if (this.options.reconnectOptions && (
            !this.options.reconnectOptions.maxAttempts ||
            this.reconnectAttempts < this.options.reconnectOptions.maxAttempts
        )) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.removeSocketListeners();
                this.eventsManager.emit(
                    WSStatus.RECONNECT,
                    this.reconnectAttempts
                );
                this.connect();
            }, this.options.reconnectOptions.delay);

            return;
        }

        this.eventsManager.emit(
            WSStatus.ERROR,
            WSErrors.MaxAttemptsReachedOnReconnectingError
        );
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach((request, key) => {
                request.callback(
                    WSErrors.MaxAttemptsReachedOnReconnectingError
                );
                this.requestQueue.delete(key);
            });
        }
    }

    private static _validateProviderUrl(providerUrl: string): boolean {
        try {
            return (
                typeof providerUrl !== 'string' ||
                /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|(?=[^\/]{1,254}(?![^\/]))(?:(?=[a-zA-Z0-9-]{1,63}\.)(?:xn--+)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}):([0-9]{1,5})$/i.test(
                    providerUrl
                )
            );
        } catch (error) {
            throw Error(
                `Failed to validate WebSocket Provider string: ${error.message}`
            );
        }
    }

    private onMessage(e: any) {
        this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
            (result: any) => {
                if (
                    result.method &&
                    result.method.indexOf('_subscription') !== -1
                ) {
                    this.eventsManager.emit(WSStatus.DATA, result);
                    return;
                }

                var id = result.id;

                // get the id which matches the returned id
                if (Array.isArray(result)) {
                    id = result[0].id;
                }

                if (this.responseQueue.has(id)) {
                    if (this.responseQueue.get(id).callback !== undefined) {
                        this.responseQueue.get(id).callback(false, result);
                    }
                    this.responseQueue.delete(id);
                }
            }
        );
    }

    private onConnect() {
        this.eventsManager.emit(WSStatus.CONNECT);
        this.reconnectAttempts = 0;
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            var _this = this;

            this.requestQueue.forEach((request: any, key: any) => {
                this.send(request.payload);
                this.requestQueue.delete(key);
            });
        }
    }

    private onClose(event: any) {
        if (this.options.reconnectOptions &&
            this.options.reconnectOptions.auto &&
            (![1000, 1001].includes(event.code) || event.wasClean === false)
        ) {
            this.reconnect();
            return;
        }

        this.eventsManager.emit(WSStatus.CLOSE, event);

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach((request: any, key: any) => {
                this.eventsManager.emit(
                    WSStatus.ERROR,
                    WSErrors.ConnectionNotOpenError
                );
                this.requestQueue.delete(key);
            });
        }

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach((request: any, key: any) => {
                this.eventsManager.emit(
                    WSStatus.ERROR,
                    WSErrors.InvalidConnection
                );
                this.responseQueue.delete(key);
            });
        }

        this.removeSocketListeners();
        //this.removeAllListeners();
    }

    supportsSubscriptions() {
        return true;
    }

    connect() {
        try {
            this.webSocketConnection = new w3cwebsocket(
                this.options.providerUrl,
                this.options.protocol,
                undefined,
                this.options.headers,
                this.options.requestOptions,
                this.options.clientConfig
            );

            this.addSocketListeners();
        } catch (error) {
            throw Error(`Failed to create WebSocket client: ${error.message}`);
        }
    }

    disconnect(code: number, reason: string) {
        this.removeSocketListeners();

        if (!this.webSocketConnection)
            throw new Error(
                'Cannot disconnect because of Invalid webSocketConnection'
            );

        this.webSocketConnection.close(code || 1000, reason);
    }

    send(payload: any) {
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        var id = payload.id;
        var request = { payload: payload };

        if (Array.isArray(payload)) {
            id = payload[0].id;
        }

        if (
            this.webSocketConnection.readyState ===
                this.webSocketConnection.CONNECTING ||
            this.reconnecting
        ) {
            this.requestQueue.set(id, request);

            return;
        }

        if (
            this.webSocketConnection.readyState !==
            this.webSocketConnection.OPEN
        ) {
            this.requestQueue.delete(id);

            this.eventsManager.emit(
                WSStatus.ERROR,
                WSErrors.ConnectionNotOpenError
            );
            return;
        }

        this.responseQueue.set(id, request);
        this.requestQueue.delete(id);

        try {
            this.webSocketConnection.send(JSON.stringify(request.payload));
        } catch (error) {
            this.eventsManager.emit(WSStatus.ERROR, error.message);
            this.responseQueue.delete(id);
        }
    }

    reset() {
        this.responseQueue.clear();
        this.requestQueue.clear();

        this.removeSocketListeners();
        this.addSocketListeners();
    }
}
