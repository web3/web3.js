import { JsonRpcResult, 
    Web3BaseProvider, 
    Web3BaseProviderStatus, 
     JsonRpcId, 
     RequestItem, JsonRpcPayload,
     JsonRpcResponseWithError, JsonRpcResponseWithResult, JsonRpcResponse
} from 'web3-common';
import { IMessageEvent, w3cwebsocket as W3WS } from 'websocket';
import { MethodNotImplementedError, InvalidConnectionError,  ConnectionTimeoutError, PendingRequestsOnReconnectingError, ConnectionNotOpenError, 
    InvalidClientError, ConnectionEvent } from 'web3-common/dist/errors';
import { WebSocketOptions } from './types';

export default class WebSocketProvider extends Web3BaseProvider {

    private readonly clientUrl: string;
    private readonly wsProviderOptions: WebSocketOptions;
   
    private webSocketConnection?: W3WS;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private readonly requestQueue: Map<JsonRpcId, RequestItem<any, any>>;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private readonly processedQueue: Map<JsonRpcId, RequestItem<any, any>>;

    private providerStatus: Web3BaseProviderStatus;

    private reconnectAttempts: number;

    private lastDataChunk: string;
    private lastChunkTimeout!: NodeJS.Timeout;

    public constructor(clientUrl: string, wsProviderOptions?: WebSocketOptions) {
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

        this.reconnectAttempts = 0;
        this.lastDataChunk = "";

        this.providerStatus = 'disconnected';

        this.init();
        this.connect();
    }

    private static validateProviderUrl(providerUrl: string): boolean {
        return typeof providerUrl === 'string' ? /^ws(s)?:\/\//i.test(providerUrl) : false;
    }

    public getStatus(): Web3BaseProviderStatus {
        return this.providerStatus;
    }

    /* eslint-disable class-methods-use-this */
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
            this.providerStatus = 'connecting';
            this.webSocketConnection = new W3WS(
                this.clientUrl,
                this.wsProviderOptions?.protocol,
                undefined,
                this.wsProviderOptions?.headers,
                this.wsProviderOptions?.requestOptions,
                this.wsProviderOptions?.clientConfig
            );

            this.addSocketListeners();

        } catch (e) {
            this.providerStatus = 'disconnected';
            throw new InvalidConnectionError(this.clientUrl); // TODO error code error detail via e 
        }
    }

    public disconnect(code: number, reason: string): void {
        this.removeSocketListeners();
        this.webSocketConnection?.close(code || 1000, reason);
        this.providerStatus = 'disconnected';
    }

    public reset(): void {
        this.processedQueue.clear();
        this.requestQueue.clear();

        this.init(); // WIP
        this.removeSocketListeners(); 
        this.addSocketListeners();
    }

    public async request<T = JsonRpcResult, T2 = unknown[]>(request: RequestItem<T2, T>): Promise<void> {
        
        if (!this.webSocketConnection)
            throw new Error('WebSocket connection is undefined');

        if (request.payload.id === undefined)
            throw new Error('Request Id not defined')

        if (
            this.webSocketConnection.readyState ===
            this.webSocketConnection.CONNECTING ||
            this.providerStatus === 'connecting'
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
            this.providerStatus = 'disconnected';

            if(request.callback !== undefined)
                request.callback(new ConnectionNotOpenError());
            return;
        }

        this.processedQueue.set(request.payload.id, request);
        this.requestQueue.delete(request.payload.id);

        try {
            this.webSocketConnection.send(JSON.stringify(request.payload));
        } catch (error) {
            if(request.callback !== undefined) 
                request.callback(error as Error, undefined);
            this.processedQueue.delete(request.payload.id);
        }
    }

    public removeAllListeners(){
        throw new MethodNotImplementedError();
    }

    public async send<T = JsonRpcResult, T2 = unknown[]>(
		payloadParam: JsonRpcPayload<T2>,
		callbackParam: (
			error?: JsonRpcResponseWithError<T> | Error,
			result?: JsonRpcResponseWithResult<T>,
		) => void,
	): Promise<void> {

        await this.request<T, T2>({payload: payloadParam, callback: callbackParam});

    }

    private init() {
        this.lastDataChunk = "";
        this.reconnectAttempts = 0;

        if (this.lastChunkTimeout) {
            clearTimeout(this.lastChunkTimeout);
        }
    }

    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    private addSocketListeners(): void {
        // WIP any
        /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable  @typescript-eslint/no-unsafe-call */
        (this.webSocketConnection as any).addEventListener(
            'message',
            this.onMessage.bind(this)
        );

        /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable  @typescript-eslint/no-unsafe-call */
        (this.webSocketConnection as any).addEventListener(
            'open',
            this.onConnect.bind(this)
        );
        /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable  @typescript-eslint/no-unsafe-call */
        (this.webSocketConnection as any).addEventListener(
            'close',
            this.onClose.bind(this)
        );
    }

    private reconnect(): void {
        this.providerStatus = 'connecting';

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
                this.reconnectAttempts += 1;
                this.removeSocketListeners();
                // this.emit(this.RECONNECT, _this.reconnectAttempts); WIP
                this.connect();
            }, this.wsProviderOptions?.reconnectOptions?.delay);

            
        }
    }

    private onMessage(e: IMessageEvent): void {
        this.parseResponse(typeof e.data === 'string' ? e.data : '').forEach(
            (response: JsonRpcResponse) => { 
                if (
                    response.method &&
                    response.method.indexOf('_subscription') !== -1
                ) {
                    // this.emit(Web3ProviderEvents.Message, result); WIP
                    return;
                }

                let id = response.id;

                if (Array.isArray(response)) {
                    id = response[0].id;
                }

                if (id && this.processedQueue.has(id)) {
                    const requestItem = this.processedQueue.get(id);
                     if (requestItem?.callback !== undefined) {
                         requestItem?.callback(
                            (response.error? response : undefined) as JsonRpcResponseWithError, 
                            (response.result? response : undefined) as JsonRpcResponseWithResult);
                     }

                    this.processedQueue.delete(id);
                }
            }
        );
    }

    

    private onConnect(): void {
        this.providerStatus = 'connected';
        this.reconnectAttempts = 0;

        if (this.requestQueue.size > 0) {
            this.requestQueue.forEach(
                (request: RequestItem, key: JsonRpcId) => {
                    /* eslint-disable  @typescript-eslint/no-floating-promises */
                    this.request(request);
                    this.requestQueue.delete(key);
                }
            );
        }
    }

    private onClose(event: ConnectionEvent): void {
        this.providerStatus = 'disconnected';
        if (
            this.wsProviderOptions?.reconnectOptions?.auto &&
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

    private parseResponse(dataReceived: string): JsonRpcResponse[] { 
        let returnValues: JsonRpcResponse[] = [];

        // de chunk
        const dechunkedData = dataReceived
            .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
            .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
            .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
            .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
            .split('|--|');

        dechunkedData.forEach((data: string) => {
            let dataToParse: string = data;

            if (this.lastDataChunk !== "")
                dataToParse = this.lastDataChunk + dataToParse;

            let result: JsonRpcResponse;

            try {
                result = JSON.parse(dataToParse);
            } catch (error) {
                this.lastDataChunk = dataToParse;

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

    /* eslint-disable class-methods-use-this */
    private removeSocketListeners(): void {
        /* eslint-disable @typescript-eslint/unbound-method */
        (this.webSocketConnection as any).removeEventListener(
            'message',
            this.onMessage
        );
        /* eslint-disable @typescript-eslint/unbound-method */
        (this.webSocketConnection as any).removeEventListener(
            'open',
            this.onConnect
        );
        /* eslint-disable @typescript-eslint/unbound-method */
        (this.webSocketConnection as any).removeEventListener(
            'close',
            this.onClose
        );
    }



}
