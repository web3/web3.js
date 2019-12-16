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
 * @file AbstractSocketProvider
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import AbstractProvider from "./AbstractProvider";
import SubscriptionItem from "./interfaces/SubscriptionItem";
import JsonRpcResponse from "./interfaces/JsonRpcResponse";
import JsonRpcPayload from "./interfaces/JsonRpcPayload";
import RequestItem from "./interfaces/RequestItem";

export default abstract class AbstractSocketProvider extends AbstractProvider {
    /**
     * @property subscriptions
     */
    protected subscriptions: Map<number | string, SubscriptionItem> = new Map();

    /**
     * @property requestQueue
     */
    protected requestQueue: Map<number | string, RequestItem> = new Map();

    /**
     * @property responseQueue
     */
    protected responseQueue: Map<number | string, RequestItem> = new Map();

    /**
     * @property connection
     */
    public abstract connection: any = null;

    /**
     * @property timeout
     */
    public timeout: number = 1000 * 15;

    /**
     * @property DATA
     */
    protected readonly DATA: string = 'data';

    /**
     * @property CLOSE
     */
    protected readonly CLOSE: string = 'close';

    /**
     * @property ERROR
     */
    protected readonly ERROR: string = 'error';

    /**
     * @property CONNECT
     */
    protected readonly CONNECT: string = 'connect';

    /**
     * @property RECONNECT
     */
    protected readonly RECONNECT: string = 'reconnect';

    /**
     * @property NETWORK_CHANGED
     */
    protected readonly NETWORK_CHANGED: string = 'networkChanged';

    /**
     * @property CHAIN_CHANGED
     */
    protected readonly CHAIN_CHANGED: string = 'chainChanged';

    /**
     * @property ACCOUNTS_CHANGED
     */
    protected readonly ACCOUNTS_CHANGED: string = 'accountsChanged';

    /**
     * @constructor
     */
    protected constructor() {
        super();
    }

    /**
     * Establishes the IPC or WS socket connection.
     *
     * @method connect
     */
    public abstract connect(): void;

    /**
     * Will add the required socket listeners
     *
     * @method addSocketListeners
     *
     * @returns {void}
     */
    protected abstract addSocketListeners(): void;

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    protected abstract removeSocketListeners(): void;

    /**
     * Closes the socket connection.
     *
     * @method disconnect
     *
     * @param {Number} code
     * @param {String} reason
     */
    public abstract disconnect(code: number, reason: string): void;

    /**
     * Returns true if the socket is connected
     *
     * @property connected
     *
     * @returns {Boolean}
     */
    public abstract get connected(): boolean;

    /**
     * Sends the given JsonRpcPayload and returns the expected JsonRpcResponse.
     *
     * @method sendPayload
     *
     * @param payload
     */
    protected abstract sendPayload(payload: JsonRpcPayload): Promise<JsonRpcResponse>;

    /**
     * TODO: Add the correct method to determine the capabilities of a provider as soon as EIP-1193 is finalized.
     *
     * Method for checking subscriptions support of a internal provider
     *
     * @method supportsSubscriptions
     *
     * @returns {Boolean}
     */
    public supportsSubscriptions() {
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
    public async send(method: string, parameters: any[]): Promise<any> {
        const response = await this.sendPayload(this.toPayload(method, parameters));
        const validationResult = this.validate(response);

        if (validationResult instanceof Error) {
            throw validationResult;
        }

        return response.result;
    }

    /**
     * Emits the error event and removes all listeners.
     *
     * @method onError
     *
     * @param {Event} error
     */
    protected onError(error: any) {
        this.emit(this.ERROR, error);
        this.removeSocketListeners();
    }

    /**
     * Emits the close event and removes all listeners.
     *
     * @method onClose
     *
     * @param {CloseEvent} error
     */
    protected onClose(error: any): void {
        this.emit(this.CLOSE, error);
        this.removeSocketListeners();
        this.removeAllListeners();
    }

    /**
     * Emits the connect event and checks if there are subscriptions defined that should be resubscribed.
     *
     * @method onConnect
     */
    protected onConnect() {
        this.emit(this.CONNECT);
    }

    /**
     * This is the listener for the 'message' events of the current socket connection.
     *
     * @method onMessage
     *
     * @param {String} response
     */
    protected onMessage(response: string | object): void {
        if (Object.prototype.toString.call(response) !== '[object Object]') {
            response = JSON.parse(<string>response);
        }

        this.emitMessage(<JsonRpcResponse>response)
    }

    /**
     * Determines the correct id and emits the correct event with his related response
     *
     * @method emitMessage
     *
     * @param {Object} response
     */
    protected emitMessage(response: JsonRpcResponse) {
        let item: RequestItem | undefined;
        let id: string | number | undefined = this.getPayloadId(response);

        if (typeof id !== 'undefined') {
            item = this.responseQueue.get(id);

            if (item) {
                item.resolve(response);
                this.responseQueue.delete(id);
            }

            return;
        }

        this.emit(<string>this.getSubscriptionEvent(response.params.subscription), response.params);
    }

    /**
     * Returns the JSON-RPC id as specified in the spec on normal requests and the id of the first item for batch requests
     *
     * @param {JsonRpcResponse | JsonRpcResponse[]} response
     *
     * @returns {Number|undefined}
     */
    protected getPayloadId(response: JsonRpcResponse | JsonRpcResponse[]): number | undefined {
        if (Array.isArray(response)) {
            return response[0].id;
        }

        return response.id;

    }

    /**
     * Resets the providers, clears all callbacks
     *
     * @method reset
     */
    public reset(): void {
        this.removeAllListeners();
        this.removeSocketListeners();
        this.addSocketListeners();
    }

    /**
     * Subscribes to a given subscriptionType
     *
     * @method subscribe
     *
     * @param {String} subscribeMethod
     * @param {String} subscriptionMethod
     * @param {Array} parameters
     *
     * @returns {Promise<String|Error>}
     */
    public subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string> {
        parameters.unshift(subscriptionMethod);

        return this.send(subscribeMethod, parameters)
            .then((subscriptionId: string) => {
                this.subscriptions.set(subscriptionId, {
                    id: subscriptionId,
                    method: subscribeMethod,
                    parameters: parameters
                });

                return subscriptionId;
            })
            .catch((error: Error) => {
                throw new Error(`Provider error: ${error}`);
            });
    }

    /**
     * Unsubscribes the subscription by his id
     *
     * @method unsubscribe
     *
     * @param {String} subscriptionId
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    public unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean> {
        if (this.hasSubscription(subscriptionId)) {
            return this.send(unsubscribeMethod, [subscriptionId]).then((response: boolean) => {
                if (response) {
                    this.removeAllListeners(this.getSubscriptionEvent(subscriptionId));

                    this.subscriptions.delete(subscriptionId);
                }

                return response;
            });
        }

        return Promise.reject(new Error(`Provider error: Subscription with ID ${subscriptionId} does not exist.`));
    }

    /**
     * Clears all subscriptions and listeners
     *
     * @method clearSubscriptions
     *
     * @param {String} unsubscribeMethod
     *
     * @returns {Promise<Boolean|Error>}
     */
    public clearSubscriptions(unsubscribeMethod: string = '') {
        if (this.subscriptions.size > 0) {
            let unsubscribePromises: Promise<boolean>[] = [];
            const type = unsubscribeMethod.slice(0, 3);

            this.subscriptions.forEach((value: SubscriptionItem) => {
                if (type === '') {
                    unsubscribePromises.push(
                        this.unsubscribe(value.id, `${value.method.slice(0, 3)}_unsubscribe`)
                    );
                } else if (type === value.method.slice(0, 3)) {
                    unsubscribePromises.push(this.unsubscribe(value.id, unsubscribeMethod));
                }
            });

            return Promise.all(unsubscribePromises).then((results: boolean[]) => {
                if (results.includes(false)) {
                    throw new Error(`Could not cleanly unsubscribe all subscriptions: ${JSON.stringify(results)}`);
                }

                return true;
            });
        }

        return Promise.resolve(true);
    }

    /**
     * Checks if the given subscription id exists
     *
     * @method hasSubscription
     *
     * @param {String} subscriptionId
     *
     * @returns {Boolean}
     */
    public hasSubscription(subscriptionId: string): boolean {
        return typeof this.getSubscriptionEvent(subscriptionId) !== 'undefined';
    }

    /**
     * Returns the event the subscription is listening for.
     *
     * @method getSubscriptionEvent
     *
     * @param {String} subscriptionId
     *
     * @returns {String | undefined}
     */
    public getSubscriptionEvent(subscriptionId: string): string | undefined {
        if (this.subscriptions.get(subscriptionId)) {
            return subscriptionId;
        }

        let event: string | number | undefined = undefined;
        this.subscriptions.forEach((value: SubscriptionItem, key: string | number) => {
            if (value.id === subscriptionId) {
                event = key;
            }
        });

        return event;
    }
}
