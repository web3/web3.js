import { w3cwebsocket } from 'websocket';
import { WebSocketOptions, WSErrors, WSStatus } from './types';
import Web3ProviderBase from 'web3-providers-base';
import { EventEmitter } from 'events'

export default class Web3ProviderWS extends Web3ProviderBase {
    private webSocketConnection?: w3cwebsocket;
    private options: WebSocketOptions;

    private requestQueue: Map<any, any>;
    private responseQueue: Map<any, any>;

    private reconnecting: boolean;

    constructor(options: WebSocketOptions) {
        if (!Web3ProviderWS._validateProviderUrl(options.providerUrl))
            throw Error('Invalid WebSocket URL provided');

        super(options);
        this.options = options;
        this.webSocketConnection = undefined;
        this.requestQueue = new Map();
        this.responseQueue = new Map();
        this.reconnecting = false;

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
        } catch (error) {
            throw Error(`Failed to create WebSocket client: ${error.message}`);
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

    supportsSubscriptions() {
        return true;
    }

    send(payload: any) {
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        var id = payload.id;
        var request = { payload: payload };

        if (Array.isArray(payload)) {
            id = payload[0].id;
        }

        if (this.webSocketConnection.readyState === this.webSocketConnection.CONNECTING || this.reconnecting) {
            this.requestQueue.set(id, request);

            return;
        }

        if (this.webSocketConnection.readyState !== this.webSocketConnection.OPEN) {
            this.requestQueue.delete(id);

            //this.emit(WSStatus.ERROR, WSErrors.ConnectionNotOpenError);
            return;
        }

        this.responseQueue.set(id, request);
        this.requestQueue.delete(id);

        try {
            this.webSocketConnection.send(JSON.stringify(request.payload));
        } catch (error) {
            //this.emit(WSStatus.ERROR, error.message);
            this.responseQueue.delete(id);
        }
    };

}
