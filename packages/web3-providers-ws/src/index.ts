import { w3cwebsocket } from 'websocket';
import { WebSocketOptions, WSErrors, WSStatus } from './types';
import { EventEmitter } from 'events';
import {
    IWeb3Provider,
    Eth1RequestArguments,
    Web3Client,
    Web3ProviderEvents,
} from 'web3-core-types/lib/types';

export default class Web3ProviderWS
    extends EventEmitter
    implements IWeb3Provider
{
    web3Client: string;

    private webSocketConnection?: w3cwebsocket;
    private options: WebSocketOptions;

    private requestQueue: Map<number, Eth1RequestArguments>;
    private responseQueue: Map<number, Eth1RequestArguments>;
    private lastChunk: any;
    private lastChunkTimeout!: NodeJS.Timeout;

    private reconnecting: boolean;
    private reconnectAttempts: number;

    constructor(web3Client: string, options?: WebSocketOptions) {
        super();
        if (!Web3ProviderWS.validateProviderUrl(web3Client))
            throw Error('Invalid WebSocket URL provided');

        this.web3Client = web3Client;

        this.webSocketConnection = undefined;
        this.requestQueue = new Map<number, Eth1RequestArguments>();
        this.responseQueue = new Map<number, Eth1RequestArguments>();
        this.reconnecting = false;
        this.reconnectAttempts = 0;

        if (options !== undefined) this.options = options;
        else this.options = {};

        this.setWeb3Client(web3Client);
    }

    /**
     * Validates and initializes provider using {web3Client}
     *
     * @param web3Client New client to set for provider instance
     */
    setWeb3Client(web3Client: Web3Client) {
        try {
            this.web3Client = web3Client as string;

            if (!this.options.customTimeout)
                this.options.customTimeout = 1000 * 15;

            if (!this.options.reconnectOptions)
                this.options.reconnectOptions = {
                    auto: false,
                    delay: 5000,
                    maxAttempts: 5,
                    onTimeout: false,
                };

            this.connect();
        } catch (error) {
            throw Error(`Failed to set web3 client: ${error.message}`);
        }
    }

    /**
     * This function adds the required socket listeners
     *
     * @method _addSocketListeners
     *
     * @returns {void}
     */
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

    /**
     * This function removes all socket listeners
     *
     * @method _removeSocketListeners
     *
     * @returns {void}
     */
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

    /**
     * This function will parse the response and make an array out of it.
     *
     * @method _parseResponse
     *
     * @param {String} data
     *
     * @returns {Array}
     */
    private parseResponse(inData: string): any {
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
                        WSStatus.Error, // TODO: Fancy errors
                        WSErrors.ConnectionTimeout + this.options.customTimeout
                    );

                    if (this.requestQueue.size > 0) {
                        this.requestQueue.forEach(
                            (request: Eth1RequestArguments, key: number) => {
                                this.emit(
                                    WSStatus.Error, // TODO: Fancy errors,
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

    /**
     * This function removes the listeners and reconnects to the socket.
     *
     * @method reconnect
     *
     * @returns {void}
     */
    private reconnect(): void {
        this.reconnecting = true;

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach(
                (request: Eth1RequestArguments, key: number) => {
                    this.emit(
                        WSStatus.Error, // TODO: Fancy errors,
                        new Error(WSErrors.PendingRequestsOnReconnectingError),
                        request
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
            setTimeout(() => {
                this.reconnectAttempts++;
                this.removeSocketListeners();
                this.emit(WSStatus.Reconnect, this.reconnectAttempts);
                this.connect();
            }, this.options.reconnectOptions.delay);

            return;
        }

        this.emit(
            WSStatus.Error, // TODO: Fancy errors,
            new Error(WSErrors.MaxAttemptsReachedOnReconnectingError)
        );
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: Eth1RequestArguments, key: number) => {
                    this.emit(
                        WSStatus.Error, // TODO: Fancy errors,
                        new Error(
                            WSErrors.MaxAttemptsReachedOnReconnectingError
                        ),
                        request
                    );
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    /**
     * This function is used to validate web socket provider URL.
     *
     * @method validateProviderUrl
     *
     * @param {String} providerUrl
     *
     * @returns {boolean}
     */
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

    /**
     * This is listener for the `data` event of the underlying WebSocket object
     *
     * @method onMessage
     *
     * @param {any} e
     *
     * @returns {void}
     */
    private onMessage(e: any): void {
        this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
            (result: any) => {
                if (
                    result.method &&
                    result.method.indexOf('_subscription') !== -1
                ) {
                    this.emit(Web3ProviderEvents.Message, result);
                    return;
                }

                let id = result.id;

                // get the id which matches the returned id
                if (Array.isArray(result)) {
                    id = result[0].id;
                }

                if (id && this.responseQueue.has(id)) {
                    let requestItem = this.responseQueue.get(id);

                    this.emit(Web3ProviderEvents.Message, result, requestItem);

                    this.responseQueue.delete(id);
                }
            }
        );
    }

    /**
     * This is listener for the `open` event of the underlying WebSocket object
     *
     * @method onConnect
     *
     * @returns {void}
     */
    private onConnect(): void {
        this.emit(Web3ProviderEvents.Connect);
        this.reconnectAttempts = 0;
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                async (request: Eth1RequestArguments, key: number) => {
                    await this.request(request);
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    /**
     * This is listener for the `close` event of the underlying WebSocket object
     *
     * @method onClose
     *
     * @param {any} event
     *
     * @returns {void}
     */
    private onClose(event: any): void {
        if (
            this.options.reconnectOptions &&
            this.options.reconnectOptions.auto &&
            (![1000, 1001].includes(event.code) || event.wasClean === false)
        ) {
            this.reconnect();
            return;
        }

        this.emit(Web3ProviderEvents.Disconnect, event);

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: Eth1RequestArguments, key: number) => {
                    this.emit(
                        WSStatus.Error, // TODO: Fancy errors,
                        new Error(WSErrors.ConnectionNotOpenError),
                        request
                    );
                    this.requestQueue.delete(key);
                }
            );
        }

        if (this.responseQueue.size > 0) {
            this.responseQueue.forEach(
                (request: Eth1RequestArguments, key: number) => {
                    this.emit(
                        WSStatus.Error, // TODO: Fancy errors,
                        new Error(WSErrors.InvalidConnection),
                        request
                    );
                    this.responseQueue.delete(key);
                }
            );
        }

        this.removeSocketListeners();
    }

    /**
     * This function returns the status of Subscriptions boolean.
     *
     * @method supportsSubscriptions
     *
     * @returns {boolean}
     */
    supportsSubscriptions(): boolean {
        return true;
    }

    /**
     * This function creates w3cwebsocket client and adds Listeners.
     *
     * @method connect
     *
     * @returns {void}
     */
    connect(): void {
        try {
            this.webSocketConnection = new w3cwebsocket(
                this.web3Client,
                this.options?.protocol,
                undefined,
                this.options?.headers,
                this.options?.requestOptions,
                this.options?.clientConfig
            );

            this.addSocketListeners();
        } catch (error) {
            throw Error(`Failed to create WebSocket client: ${error.message}`);
        }
    }

    /**
     *  This function closes the current connection with the given code and reason arguments
     *
     * @method disconnect
     *
     * @param {number} code
     * @param {string} reason
     *
     * @returns {void}
     */
    async disconnect(code?: number, reason?: string): Promise<void> {
        this.removeSocketListeners();

        if (!this.webSocketConnection)
            throw new Error(
                'Cannot disconnect because of Invalid webSocketConnection'
            );

        this.webSocketConnection.close(code || 1000, reason);
    }

    /**
     * This function is used to send request if provider is connected  else if the provider is connecting it will add request to the queue.
     *
     * @method request
     *
     * @param {Eth1RequestArguments} request
     *
     * @returns {RpcResponse} This function always returns undefined as result is emitted in events for web socket
     */
    //TODO: need to add ws support for Eth2 requests
    // @ts-ignore
    async request(request: Eth1RequestArguments): Promise<void> {
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        if (request.rpcOptions === undefined)
            throw new Error('RpcOptions not defined');

        let id = request.rpcOptions.id;

        if (Array.isArray(request)) {
            id = request[0].rpcOptions.id;
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

            this.emit(
                WSStatus.Error, // TODO: Fancy errors
                WSErrors.ConnectionNotOpenError,
                request
            );
            return;
        }

        this.responseQueue.set(id, request);
        this.requestQueue.delete(id);

        try {
            this.webSocketConnection.send(JSON.stringify(request));
        } catch (error) {
            this.emit(
                WSStatus.Error, // TODO: Fancy errors
                error,
                request
            );
            this.responseQueue.delete(id);
        }
    }

    /**
     * This function resets the requests queues and removed listeners
     *
     * @method reset
     *
     * @returns {void}
     */
    async reset(): Promise<void> {
        this.responseQueue.clear();
        this.requestQueue.clear();

        this.removeSocketListeners();
        this.addSocketListeners();
    }
}
