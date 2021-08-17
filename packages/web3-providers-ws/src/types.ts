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
    customTimeout?: number;
    reconnectOptions?: ReconnectOptions;
    timeout?: number;
    reconnectDelay?: number;
    origin?: string;
}

// TODO: Fancy errors
export enum WSErrors {
    ConnectionTimeout = 'Connection Timeout ',
    ConnectionNotOpenError = 'Connection Not Open Error ',
    PendingRequestsOnReconnectingError = 'Pending Requests On Reconnecting Error ',
    MaxAttemptsReachedOnReconnectingError = 'Max Attempts Reached On Reconnecting Error ',
    InvalidConnection = 'Invalid Connection ',
}

export enum WSStatus {
    Error = 'Error ',
    Reconnect = 'Reconnect ',
}

export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}
