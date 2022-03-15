/// <reference types="node" />
import { XMLHttpRequestEventTarget } from './xml-http-request-event-target';
import { ClientRequest } from 'http';
export declare class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
    private _contentType;
    private _body;
    constructor();
    _reset(): void;
    _setData(data?: string | Buffer | ArrayBuffer | ArrayBufferView): void;
    _finalizeHeaders(headers: object, loweredHeaders: object): void;
    _startUpload(request: ClientRequest): void;
}
