export class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(methods: any, moduleInstance: any): Promise<any[]>;

    disconnect(): boolean;
}

export interface HttpProviderOptions {
    host?: string;
    timeout?: number;
    headers?: HttpHeader[];
    withCredentials?: boolean;
}

export interface HttpHeader {
    name: string;
    value: string;
}
