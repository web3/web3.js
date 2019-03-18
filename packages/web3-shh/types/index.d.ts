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
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>, Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {AbstractWeb3Module, Web3ModuleOptions} from 'web3-core';
import {provider} from 'web3-providers';
import {Network} from 'web3-net';

export class Shh extends AbstractWeb3Module {
    constructor(
        provider: provider,
        options?: Web3ModuleOptions
    );

    net: Network;

    getVersion(callback?: (error: Error, version: string) => void): Promise<string>;

    getInfo(callback?: (error: Error, info: Info) => void): Promise<Info>;

    setMaxMessageSize(size: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    setMinPoW(pow: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    markTrustedPeer(enode: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

    newKeyPair(callback?: (error: Error, key: string) => void): Promise<string>;

    addPrivateKey(privateKey: string, callback?: (error: Error, privateKey: string) => void): Promise<string>;

    deleteKeyPair(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    hasKeyPair(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    getPublicKey(id: string, callback?: (error: Error, publicKey: string) => void): Promise<string>;

    getPrivateKey(id: string, callback?: (error: Error, privateKey: string) => void): Promise<string>;

    newSymKey(callback?: (error: Error, key: string) => void): Promise<string>;

    addSymKey(symKey: string, callback?: (error: Error, key: string) => void): Promise<string>;

    generateSymKeyFromPassword(password: string, callback?: (error: Error, key: string) => void): Promise<string>;

    hasSymKey(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    getSymKey(id: string, callback?: (error: Error, key: string) => void): Promise<string>;

    deleteSymKey(id: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>

    post(object: PostWithSymKey | PostWithPubKey, callback?: (error: Error, result: string) => void): Promise<string>;

    subscribe(string: 'messages', options: SubscriptionOptions, callback?: (error: Error, message: Notification, subscription: any) => void): Subscribe;

    newMessageFilter(options?: SubscriptionOptions): Promise<string>;

    deleteMessageFilter(id: string): Promise<boolean>;

    getFilterMessages(id: string): Promise<Notification[]>;
}

export interface Info {
    messages: number;
    maxMessageSize: number;
    memory: number;
    minPow: number;
}

export interface PostBase {
    sig?: string;
    ttl: number;
    topic: string;
    payload: string;
    padding?: number;
    powTime?: number;
    powTarget?: number;
    targetPeer?: number;
}

export interface PostWithSymKey extends PostBase {
    symKeyID: string;
}

export interface PostWithPubKey extends PostBase {
    pubKey: string;
}

export interface SubscriptionOptions {
    symKeyID?: string;
    privateKeyID?: string;
    sig?: string;
    topics?: string[];
    minPow?: number;
    allowP2P?: boolean;
    ttl?: number;
}

export interface Notification {
    hash: string;
    sig?: string;
    recipientPublicKey?: string;
    timestamp: string;
    ttl: number;
    topic: string;
    payload: string;
    padding: number;
    pow: number;
}

export interface Subscribe {
    on(type: 'data', handler: (data: Notification) => void): void;

    on(type: 'error', handler: (data: Error) => void): void;
}
