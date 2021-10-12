import { OutgoingHttpHeaders } from 'http';
import { IClientConfig } from 'websocket';


export type ReconnectOptions = {
    auto: boolean;
    delay: number;
    maxAttempts: number;
    onTimeout: boolean;
};

export interface WebSocketOptions {
    protocol?: string;
    headers?: OutgoingHttpHeaders;
    requestOptions?: object;
    clientConfig?: IClientConfig;
    customTimeout: number;
    reconnectOptions?: ReconnectOptions;
    timeout?: number;
    reconnectDelay?: number;
    origin?: string;
}
