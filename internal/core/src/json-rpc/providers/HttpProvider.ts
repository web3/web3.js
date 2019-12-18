/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file HttpProvider.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

// TODO: Remove XHR dependency
import {XMLHttpRequest as XHR} from 'xhr2-cookies';
import * as http from 'http';
import * as https from 'https';
import Method from '../methods/Method.js';
import ProviderError from "../../errors/json-rpc/ProviderError";
import AbstractProvider from "../../../lib/json-rpc/providers/AbstractProvider.js";
import JsonRpcResponse from "../../../lib/json-rpc/providers/interfaces/JsonRpcResponse";
import JsonRpcPayload from "../../../lib/json-rpc/providers/interfaces/JsonRpcPayload";
import {HttpHeader} from "../../../lib/json-rpc/providers/interfaces/HttpHeader";

export default class HttpProvider extends AbstractProvider {
    /**
     * @property headers
     */
    public headers: HttpHeader[];

    /**
     * @property withCredentials
     */
    public withCredentials: boolean = false;

    /**
     * @property connected
     */
    public connected: boolean = true;

    /**
     * @property httpsAgent
     */
    public httpsAgent: https.Agent | undefined = undefined;

    /**
     * @property httpAgent
     */
    public httpAgent: http.Agent | undefined = undefined;

    /**
     * @param {String} host
     * @param {Object} options
     *
     * @constructor
     */
    public constructor(public host = 'http://localhost:8545', options: any = {}) {
        super();

        this.timeout = options.timeout;
        this.headers = options.headers;
        this.withCredentials = options.withCredentials || false;
        this.connected = true;

        let keepAlive = false;
        if (options.keepAlive === true) {
            keepAlive = true;
        }

        if (host.substring(0, 5) === 'https') {
            this.httpsAgent = new https.Agent({keepAlive});
        } else {
            this.httpAgent = new http.Agent({keepAlive});
        }
    }

    /**
     * Method for checking subscriptions support of a internal provider
     *
     * @method supportsSubscriptions
     *
     * @returns {Boolean}
     */
    public supportsSubscriptions(): boolean {
        return false;
    }

    /**
     * This method has to exists to have the same interface as the socket providers.
     *
     * @method disconnect
     *
     * @returns {Boolean}
     */
    public disconnect(): boolean {
        return true;
    }

    /**
     * Creates the JSON-RPC payload and sends it to the node.
     *
     * @method send
     *
     * @param {String} method
     * @param {Array} parameters
     *
     * @returns {Promise<any>}
     */
    async send(method: string, parameters: any[]): Promise<any> {
        const response: JsonRpcResponse = <JsonRpcResponse> await this.sendPayload(this.toPayload(method, parameters));
        const validationResult = this.validate(response);

        if (validationResult instanceof Error) {
            throw validationResult;
        }

        return response.result;
    }

    /**
     * Creates the JSON-RPC batch payload and sends it to the node.
     *
     * @method sendBatch
     *
     * @param {Method[]} methods
     *
     * @returns Promise<JsonRpcResponse[]>
     */
    public sendBatch(methods: Method<any>[]): Promise<JsonRpcResponse[]> {
        let payload: JsonRpcPayload[] = [];

        methods.forEach((method) => {
            payload.push(this.toPayload(method.rpcMethod, method.parameters));
        });

        return <Promise<JsonRpcResponse[]>> this.sendPayload(payload);
    }

    /**
     * Sends the JSON-RPC payload to the node.
     *
     * @method sendPayload
     *
     * @param {JsonRpcPayload} payload
     *
     * @returns {Promise<JsonRpcResponse>}
     */
    public sendPayload(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcResponse | JsonRpcResponse[]> {
        return new Promise((resolve, reject) => {
            let request: XHR | XMLHttpRequest;

            // the current runtime is a browser
            if (typeof XMLHttpRequest !== 'undefined') {
                request = new XMLHttpRequest();
            } else {
                request = new XHR();
                request.nodejsSet({
                    httpsAgent: this.httpsAgent,
                    httpAgent: this.httpAgent
                });
            }

            request.open('POST', this.host, true);
            request.setRequestHeader('Content-Type','application/json');
            request.timeout = this.timeout;
            request.withCredentials = this.withCredentials;

            if(this.headers) {
                this.headers.forEach(function(header: HttpHeader) {
                    request.setRequestHeader(header.name, header.value);
                });
            }

            request.onreadystatechange = () => {
                if (request.readyState !== 0 && request.readyState !== 1) {
                    this.connected = true;
                }

                if (request.readyState === 4) {
                    if (request.status === 200) {
                        try {
                            return resolve(JSON.parse(request.responseText));
                        } catch (error) {
                            reject(new ProviderError(`Invalid JSON as response: ${request.responseText}`, this.host, payload, request.responseText));
                        }
                    }

                    if (this.isInvalidHttpEndpoint(request)) {
                        reject(new ProviderError(`Connection refused or URL couldn't be resolved: ${this.host}`, this.host, payload, request.responseText));
                    }

                    if (request.status >= 400 && request.status <= 499) {
                        reject(new ProviderError(`${request.responseText} (code: ${request.status})`, this.host, payload, request.responseText));
                    }
                }
            };

            request.addEventListener('timeout', () => {
                this.connected = false;

                reject(new ProviderError(`Timeout exceeded after ${this.timeout}ms`, this.host, payload, request.responseText));
            });

            request.addEventListener('error', (event: any) => {
                this.connected = false;

                reject(new ProviderError(event.message, this.host, payload));
            });

            try {
                request.send(JSON.stringify(payload));
            } catch (error) {
                this.connected = false;

                reject(error);
            }
        });
    }

    /**
     * Checks if the error `net::ERR_NAME_NOT_RESOLVED` or `net::ERR_CONNECTION_REFUSED` will appear.
     *
     * @method isInvalidHttpEndpoint
     *
     * @param {XHR | XMLHttpRequest} request
     *
     * @returns {Boolean}
     */
    public isInvalidHttpEndpoint(request: XHR | XMLHttpRequest): boolean {
        return request.response === null && request.status === 0;
    }
}
