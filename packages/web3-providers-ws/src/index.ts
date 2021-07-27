import { w3cwebsocket } from 'websocket';
import { WebSocketOptions } from './types';
import Web3ProviderBase from 'web3-providers-base';

export default class Web3ProviderWS extends Web3ProviderBase {

    private _webSocketConnection?: w3cwebsocket;
    private _options: WebSocketOptions;

    constructor(options: WebSocketOptions) {
        if (!Web3ProviderWS._validateProviderUrl(options.providerUrl))
            throw Error('Invalid WebSocket URL provided');

        super(options);
        this._options = options;
        this.connect();
    }

    connect() {
        try {
            this._webSocketConnection = new w3cwebsocket(this._options.providerUrl, this._options.protocol, undefined, this._options.headers, this._options.requestOptions, this._options.clientConfig);
        } catch (error) {
            throw Error(`Failed to create WebSocket client: ${error.message}`);
        }
    };

    private static _validateProviderUrl(providerUrl: string): boolean {
        try {
            return (
                typeof providerUrl !== 'string' ||
                /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|(?=[^\/]{1,254}(?![^\/]))(?:(?=[a-zA-Z0-9-]{1,63}\.)(?:xn--+)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,63}):([0-9]{1,5})$/i.test(providerUrl)
            );
        } catch (error) {
            throw Error(`Failed to validate WebSocket Provider string: ${error.message}`);
        }
    }
}
