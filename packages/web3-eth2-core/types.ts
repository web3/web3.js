 import { AxiosInstance } from 'axios';

export interface ETH2BaseOpts {
    protectProvider?: boolean
}

export type ETH2Function<T = any> = (...args: any[]) => Promise<T>;

export interface BaseAPISchemaMethod {
    notImplemented?: true,
    name: string,
    route: string,
    restMethod: 'get' | 'post'
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}

export interface BaseAPISchema {
    packageName: string,
    routePrefix: string,
    methods: BaseAPISchemaMethod[]
}

export declare class ETH2Core {
    private _httpClient;
    [key: string]: ETH2Function | any;
    name: string;
    provider: string | undefined;
    protectProvider: boolean;
    constructor(provider: string, schema: BaseAPISchema, opts?: ETH2BaseOpts);
    static createHttpClient(baseUrl: string): AxiosInstance;
    setProvider(provider: string): void;
    private routeBuilder;
    private buildAPIWrappersFromSchema;
}
