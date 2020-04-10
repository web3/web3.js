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
 * @file index.d.ts
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

// Minimum TypeScript Version: 3.7

export class Subscription<T> {
    constructor(options: SubscriptionOptions);

    id: string;
    options: SubscriptionOptions;
    callback: () => void;
    arguments: any;

    subscribe(callback?: (error: Error, result: T) => void): Subscription<T>;

    unsubscribe(
        callback?: (error: Error, result: boolean) => void
    ): Promise<undefined | boolean>;

    on(type: 'data', handler: (data: T) => void): Subscription<T>;

    on(type: 'changed', handler: (data: T) => void): Subscription<T>;

    on(type: 'connected', handler: (subscriptionId: string) => void): Subscription<T>;

    on(type: 'error', handler: (data: Error) => void): Subscription<T>;
}

export class Subscriptions {
    constructor(options: SubscriptionsOptions);

    name: string;
    type: string;
    subscriptions: SubscriptionsModel;
    readonly requestManager: any;

    attachToObject(obj: any): void;

    setRequestManager(requestManager: any): void;

    buildCall(): () => any;
}

export interface SubscriptionOptions {
    subscription: string;
    type: string;
    requestManager: any;
}

export interface SubscriptionsOptions {
    name: string;
    type: string;
    subscriptions: SubscriptionsModel;
}

export interface SubscriptionsModel {
    [name: string]: SubscriptionModel;
}

export interface SubscriptionModel {
    subscriptionName: string;
    params: number;
    outputFormatter: () => void;
    inputFormatter: Array<() => void>;
    subscriptionHandler: () => void;
}
