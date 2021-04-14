import { AxiosInstance } from 'axios';

export interface BaseOpts {
    protectProvider?: boolean
}

export type BaseFunction<T = any> = (...args: any[]) => Promise<T>;

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

export declare class Base {
    private _httpClient;
    [key: string]: BaseFunction | any;
    name: string;
    provider: string | undefined;
    protectProvider: boolean;
    constructor(provider: string, schema: BaseAPISchema, opts?: BaseOpts);
    static createHttpClient(baseUrl: string): AxiosInstance;
    setProvider(provider: string): void;
    private routeBuilder;
    private buildAPIWrappersFromSchema;
}