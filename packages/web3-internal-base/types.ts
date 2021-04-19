/**
 * @module types
 */

import { AxiosInstance } from 'axios';

export type BaseFunction<T = any> = (...args: any[]) => Promise<T>;

export interface BaseOpts {
    protectProvider?: boolean
}

export type BaseAPISchemaParams = (string | number)[]

export interface BaseAPISchemaMethod {
    notImplemented?: true,
    name: string,
    method: string,
    restMethod: 'get' | 'post'
    inputFormatter: any,
    outputFormatter: any,
    errors: any
    errorPrefix: string
}

export interface BaseAPISchema {
    packageName: string,
    methodPrefix: string,
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

export interface RpcParamsBase {
    id?: number,
    jsonrpc?: string
}

export interface RpcParams extends RpcParamsBase {
    method: string,
    params: (string|number)[]
}

export interface RpcResponse {
    id: number,
    jsonrpc: string,
    result: string | number | boolean | (string|number)[] | {[key: string]: string | number}
}

export interface FormattedRpcResponse {
    id: number,
    jsonrpc: string,
    result: BigInt
}
