import { request, w3cwebsocket } from 'websocket';
import {
    WebSocketOptions,
    WSErrors,
    WSStatus,
    ReconnectOptions,
    JsonRpcPayload,
    JsonRpcResponse,
} from './types';
import events, { EventEmitter } from 'events';

export default class Web3ProviderWS extends events.EventEmitter {
    private webSocketConnection?: w3cwebsocket;
    private options: WebSocketOptions;

    private requestQueue: Map<string, JsonRpcPayload>;
    private responseQueue: Map<string, JsonRpcPayload>;
    private lastChunk: any;
    private lastChunkTimeout!: NodeJS.Timeout;

    private reconnecting: boolean;
    private reconnectAttempts: number;

    constructor(options: WebSocketOptions) {
        super();
        if (!Web3ProviderWS.validateProviderUrl(options.providerUrl))
            throw Error('Invalid WebSocket URL provided');

        this.options = options;
        this.webSocketConnection = undefined;
        this.requestQueue = new Map<string, JsonRpcPayload>();
        this.responseQueue = new Map<string, JsonRpcPayload>();
        this.reconnecting = false;
        this.reconnectAttempts = 0;

        if (!this.options.customTimeout) this.options.customTimeout = 1000 * 15;

        if (!this.options.reconnectOptions)
            this.options.reconnectOptions = {
                auto: false,
                delay: 5000,
                maxAttempts: 5,
                onTimeout: false,
            };
    }

    private addSocketListeners(): void {
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

    private removeSocketListeners(): void {
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

    private parseResponse(inData: any): any {
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
                    if (
                        this.options.reconnectOptions &&
                        this.options.reconnectOptions.auto &&
                        this.options.reconnectOptions.onTimeout
                    ) {
                        this.reconnect();

                        return;
                    }

                    this.emit(
                        WSStatus.ERROR,
                        WSErrors.ConnectionTimeout + this.options.customTimeout
                    );

                    if (this.requestQueue.size > 0) {
                        this.requestQueue.forEach(
                            (request: JsonRpcPayload, key: string) => {
                                this.emit(
                                    WSStatus.ERROR,
                                    new Error(
                                        WSErrors.ConnectionTimeout +
                                            this.options.customTimeout
                                    )
                                );
                                this.requestQueue.delete(key);
                            }
                        );
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

    private reconnect(): void {
        this.reconnecting = true;

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach(
                (request: JsonRpcPayload, key: string) => {
                    this.emit(
                        WSStatus.ERROR,
                        new Error(WSErrors.PendingRequestsOnReconnectingError)
                    );
                    this.responseQueue.delete(key);
                }
            );
        }

        if (
            this.options.reconnectOptions &&
            (!this.options.reconnectOptions.maxAttempts ||
                this.reconnectAttempts <
                    this.options.reconnectOptions.maxAttempts)
        ) {
            setTimeout(async () => {
                this.reconnectAttempts++;
                this.removeSocketListeners();
                this.emit(WSStatus.RECONNECT, this.reconnectAttempts);
                await this.connect();
            }, this.options.reconnectOptions.delay);

            return;
        }

        this.emit(
            WSStatus.ERROR,
            new Error(WSErrors.MaxAttemptsReachedOnReconnectingError)
        );
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: JsonRpcPayload, key: string) => {
                    this.emit(
                        WSStatus.ERROR,
                        new Error(
                            WSErrors.MaxAttemptsReachedOnReconnectingError
                        )
                    );
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    private static validateProviderUrl(providerUrl: string): boolean {
        try {
            return (
                typeof providerUrl !== 'string' ||
                /^ws(s)?:\/\//i.test(providerUrl)
            );
        } catch (error) {
            throw Error(
                `Failed to validate WebSocket Provider string: ${error.message}`
            );
        }
    }

    private onMessage(e: any): void {
        this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
            (result: any) => {
                if (
                    result.method &&
                    result.method.indexOf('_subscription') !== -1
                ) {
                    this.emit(WSStatus.DATA, result);
                    return;
                }

                let id = result.id;

                // get the id which matches the returned id
                if (Array.isArray(result)) {
                    id = result[0].id;
                }

                if (id && this.responseQueue.has(id)) {
                    let requestItem = this.responseQueue.get(id);

                    this.emit(WSStatus.DATA, result);

                    this.responseQueue.delete(id);
                }
            }
        );
    }

    private onConnect(): void {
        this.emit(WSStatus.CONNECT);
        this.reconnectAttempts = 0;
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                async (request: JsonRpcPayload, key: string) => {
                    await this.request(request);
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    private onClose(event: any): void {
        if (
            this.options.reconnectOptions &&
            this.options.reconnectOptions.auto &&
            (![1000, 1001].includes(event.code) || event.wasClean === false)
        ) {
            this.reconnect();
            return;
        }

        this.emit(WSStatus.CLOSE, event);

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: JsonRpcPayload, key: string) => {
                    this.emit(
                        WSStatus.ERROR,
                        new Error(WSErrors.ConnectionNotOpenError)
                    );
                    this.requestQueue.delete(key);
                }
            );
        }

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach(
                (request: JsonRpcPayload, key: string) => {
                    this.emit(
                        WSStatus.ERROR,
                        new Error(WSErrors.InvalidConnection)
                    );
                    this.responseQueue.delete(key);
                }
            );
        }

        this.removeSocketListeners();
        //this.removeAllListeners();
    }

    supportsSubscriptions(): boolean {
        return true;
    }

    async connect(): Promise<void> {
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

    async disconnect(code: number, reason: string): Promise<void> {
        this.removeSocketListeners();

        if (!this.webSocketConnection)
            throw new Error(
                'Cannot disconnect because of Invalid webSocketConnection'
            );

        this.webSocketConnection.close(code || 1000, reason);
    }

    async request(request: JsonRpcPayload): Promise<void> {
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        let id = request.id;

        if (Array.isArray(request)) {
            id = request[0].id;
        }

        if (
            this.webSocketConnection.readyState ===
                this.webSocketConnection.CONNECTING ||
            this.reconnecting
        ) {
            this.requestQueue.set(id as string, request);
            return;
        }

        if (
            this.webSocketConnection.readyState !==
            this.webSocketConnection.OPEN
        ) {
            this.requestQueue.delete(id as string);

            this.emit(WSStatus.ERROR, WSErrors.ConnectionNotOpenError);
            this.emit(
                WSStatus.ERROR,
                new Error(WSErrors.ConnectionNotOpenError)
            );
            return;
        }

        this.responseQueue.set(id as string, request);
        this.requestQueue.delete(id as string);

        try {
            this.webSocketConnection.send(JSON.stringify(request));
        } catch (error) {
            this.emit(WSStatus.ERROR, error);
            this.responseQueue.delete(id as string);
        }
    }

    async reset(): Promise<void> {
        this.responseQueue.clear();
        this.requestQueue.clear();

        this.removeSocketListeners();
        this.addSocketListeners();
    }
}
