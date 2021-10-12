import { w3cwebsocket } from 'websocket';
import { JsonRpcResult, 
    Web3BaseProvider, 
    Web3BaseProviderStatus, 
     JsonRpcId, 
     RequestItem, JsonRpcPayload,
     JsonRpcResponseWithError, JsonRpcResponseWithResult
} from 'web3-common';

import { WebSocketOptions } from './types';
import { MethodNotImplementedError, InvalidConnectionError,  ConnectionTimeoutError, PendingRequestsOnReconnectingError, ConnectionNotOpenError, InvalidClientError, ConnectionEvent } from 'web3-common/dist/errors';

export default class WebSocketProvider extends Web3BaseProvider {

    private readonly clientUrl: string;
    private readonly wsProviderOptions: WebSocketOptions;
   
    private webSocketConnection?: w3cwebsocket;
    private readonly requestQueue: Map<JsonRpcId, RequestItem<any, any>>;
    private readonly processedQueue: Map<JsonRpcId, RequestItem<any, any>>;

    constructor(clientUrl: string, wsProviderOptions?: WebSocketOptions) {
        super();
        if (!WebSocketProvider.validateProviderUrl(clientUrl))
            throw new InvalidClientError(clientUrl);

        this.clientUrl = clientUrl;
        if (wsProviderOptions !== undefined)
            this.wsProviderOptions = wsProviderOptions;
        else
            this.wsProviderOptions = {
                customTimeout : 1000 * 15
            };

        if (!this.wsProviderOptions.customTimeout)
            this.wsProviderOptions.customTimeout = 1000 * 15;

        if (!this.wsProviderOptions.reconnectOptions)
            this.wsProviderOptions.reconnectOptions = {
                auto: false,
                delay: 5000,
                maxAttempts: 5,
                onTimeout: false,
            };

        this.requestQueue = new Map<JsonRpcId, RequestItem>();
        this.processedQueue = new Map<JsonRpcId, RequestItem>();

        this.init();
        this.connect();
    }

    private init() {
        this.lastDataChunk = "";
        this.reconnecting = false;
        this.reconnectAttempts = 0;

        if (this.lastChunkTimeout) {
            clearTimeout(this.lastChunkTimeout);
        }
    }

    private static validateProviderUrl(providerUrl: string): boolean {
        return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
    }

    public getStatus(): Web3BaseProviderStatus {
        throw new MethodNotImplementedError(); // WIP
    }

    public supportsSubscriptions(): boolean {
        return true;
    }

    /* eslint-disable class-methods-use-this */
    public on(): void {
        throw new MethodNotImplementedError();
    }

    /* eslint-disable class-methods-use-this */
    public once() {
        throw new MethodNotImplementedError();
    }

    /* eslint-disable class-methods-use-this */
    public removeListener(): void {
        throw new MethodNotImplementedError();
    }

    public connect(): void {
        try {
            this.webSocketConnection = new w3cwebsocket(
                this.clientUrl,
                this.wsProviderOptions?.protocol,
                undefined,
                this.wsProviderOptions?.headers,
                this.wsProviderOptions?.requestOptions,
                this.wsProviderOptions?.clientConfig
            );

            this.addSocketListeners();

        } catch (e) {
            throw new InvalidConnectionError(this.clientUrl); //TODO error code error detail via e 
        }
    }

    private addSocketListeners(): void {
        // WIP any
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

    disconnect(code: number, reason: string): void {
        this.removeSocketListeners();
        this.webSocketConnection?.close(code || 1000, reason);
    }

    reset(): void {
        this.processedQueue.clear();
        this.requestQueue.clear();

        this.init(); // WIP
        this.removeSocketListeners(); 
        this.addSocketListeners();
    }

    private reconnect(): void {
        this.reconnecting = true;

        if (this.processedQueue.size > 0) {
            this.processedQueue.forEach((request: RequestItem, key: JsonRpcId) => {
                if(request.callback !== undefined)
                    request.callback(new PendingRequestsOnReconnectingError(), undefined);
                this.processedQueue.delete(key);
            });
        }

        if (
            !this.wsProviderOptions?.reconnectOptions?.maxAttempts ||
            this.reconnectAttempts < this.wsProviderOptions.reconnectOptions.maxAttempts
        ) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.removeSocketListeners();
                // this.emit(this.RECONNECT, _this.reconnectAttempts); WIP
                this.connect();
            }, this.wsProviderOptions?.reconnectOptions?.delay);

            
        }
    }

    private onMessage(e: any): void { // TODO add type instead of any
        this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
            (result: any) => { // TODO add type instead of any
                if (
                    result.method &&
                    result.method.indexOf('_subscription') !== -1
                ) {
                    // this.emit(Web3ProviderEvents.Message, result); WIP
                    return;
                }

                let {id} = result;

                if (Array.isArray(result)) {
                    id = result[0].id;
                }

                if (id && this.processedQueue.has(id)) {
                    let requestItem = this.processedQueue.get(id);
                    if (requestItem?.callback !== undefined) {
                        requestItem?.callback(undefined, result);
                    }

                    this.processedQueue.delete(id);
                }
            }
        );
    }

    private reconnecting = false;
    private reconnectAttempts = 0;

    private onConnect(): void {
        this.reconnectAttempts = 0;
        this.reconnecting = false;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                async (request: RequestItem, key: JsonRpcId) => {
                    await this.request(request);
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    private onClose(event: ConnectionEvent): void {
        if (
            this.wsProviderOptions.reconnectOptions &&
            this.wsProviderOptions.reconnectOptions.auto &&
            (![1000, 1001].includes(event.code) || event.wasClean === false)
        ) {
            this.reconnect();
            return;
        }

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: RequestItem, key: JsonRpcId) => {
                    if(request?.callback !== undefined){
                        request?.callback(new ConnectionNotOpenError(event), undefined);}
                    this.requestQueue.delete(key);
                }
            );
        }

        if (this.processedQueue.size > 0) {
            this.processedQueue.forEach(
                (request: RequestItem, key: JsonRpcId) => {
                    if(request?.callback !== undefined){
                    request?.callback(new ConnectionNotOpenError(event), undefined);}
                    this.processedQueue.delete(key);
                }
            );
        }

        this.removeSocketListeners();
    }

    private lastDataChunk = "";
    private lastChunkTimeout!: NodeJS.Timeout;

    private parseResponse(data: string): any { 
        const returnValues: any = [];

        // de chunk
        const dechunkedData = data
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data: string) => {
            if (this.lastDataChunk !== "")
                data = this.lastDataChunk + data;

            let result: any = null;

            try {
                result = JSON.parse(data);
            } catch (error) {
                this.lastDataChunk = data;

                if (this.lastChunkTimeout)
                    clearTimeout(this.lastChunkTimeout);

                this.lastChunkTimeout = setTimeout(() => {
                    if (
                        this.wsProviderOptions.reconnectOptions?.auto &&
                        this.wsProviderOptions.reconnectOptions?.onTimeout
                    ) {
                        this.reconnect();
                        return;
                    }

                    // this.emit( WSStatus.Error, WSErrors.ConnectionTimeout + this.wsProviderOptions.customTimeout ); //TODO

                    if (this.requestQueue.size > 0) {
                        this.requestQueue.forEach(
                            (request: RequestItem, key: JsonRpcId) => {
                                if(request?.callback !== undefined){
                                    request?.callback( new ConnectionTimeoutError(this.wsProviderOptions.customTimeout), undefined);}
                                this.requestQueue.delete(key);
                            }
                        );
                    }
                }, this.wsProviderOptions.customTimeout);

                return;
            }

            clearTimeout(this.lastChunkTimeout);
            this.lastDataChunk = "";

            if (result)
                returnValues.push(result);
        });

        return returnValues;
    }
    
    async request<T = JsonRpcResult, T2 = unknown[]>(request: RequestItem<T2, T>): Promise<void> {
        
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        if (request.payload.id === undefined)
            throw new Error('Request Id not defined')

        if (
            this.webSocketConnection.readyState ===
            this.webSocketConnection.CONNECTING ||
            this.reconnecting
        ) {
            this.requestQueue.set(request.payload.id, request);
            return;
        }

        if (
            this.webSocketConnection.readyState !==
            this.webSocketConnection.OPEN
        ) {
            this.requestQueue.delete(request.payload.id);

            // TODO this.emit( WSStatus.Error,WSErrors.ConnectionNotOpenError, request );

            if(request.callback !== undefined)
                request.callback(new ConnectionNotOpenError());
            return;
        }

        this.processedQueue.set(request.payload.id, request);
        this.requestQueue.delete(request.payload.id);

        try {
            this.webSocketConnection.send(JSON.stringify(request));
        } catch (error) {
            if(request.callback !== undefined) 
                request.callback(error as Error, undefined);
            this.processedQueue.delete(request.payload.id);
        }
    }

    removeSocketListeners(): void {
        // WIP any
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

    removeAllListeners(){
        throw new MethodNotImplementedError();
    }

    send<T = JsonRpcResult, T2 = unknown[]>(
		payloadParam: JsonRpcPayload<T2>,
		callbackParam: (
			error?: JsonRpcResponseWithError<T> | Error,
			result?: JsonRpcResponseWithResult<T>,
		) => void,
	): void {

        this.request<T, T2>({payload: payloadParam, callback: callbackParam});

    }

}
