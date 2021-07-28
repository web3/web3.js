import { OutgoingHttpHeaders } from 'http';
import { IClientConfig } from 'websocket';
import { ProviderOptions } from '../../web3-providers-base/lib/types';

export type WebSocketOptions = ProviderOptions & {
    protocol?: string;
    headers?: OutgoingHttpHeaders;
    requestOptions?: object;
    clientConfig?: IClientConfig;
};

export enum WSStatus {
    DATA = 'data',
    CLOSE = 'close',
    ERROR = 'error',
    CONNECT = 'connect',
    RECONNECT = 'reconnect',
}

export enum WSErrors {
    ConnectionNotOpenError = 'ConnectionNotOpenError',
}
