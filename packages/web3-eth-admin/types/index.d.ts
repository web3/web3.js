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
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import {Accounts} from 'web3-eth-accounts';
import {provider} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions, NodeInfo} from 'web3-core';
import * as net from 'net';

export class Admin extends AbstractWeb3Module {
    constructor(provider: provider, net?: net.Socket|null, options?: Web3ModuleOptions, accounts?: Accounts|null);

    addPeer(
        url: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    getDataDirectory(
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    getNodeInfo(
        callback?: (error: Error, result: NodeInfo) => void
    ): Promise<NodeInfo>;

    getPeers(
        callback?: (error: Error, result: any[]) => void
    ): Promise<[any[]]>;

    setSolc(
        path: string,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    startRPC(callback?: (error: Error, result: boolean) => void): Promise<boolean>
    startRPC(host: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(port: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, port: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(port: number, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(port: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(cors: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, port: number, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, port: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(port: number, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startRPC(host: string, port: number, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    startWS(callback?: (error: Error, result: boolean) => void): Promise<boolean>
    startWS(host: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(port: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, port: number, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(port: number, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(port: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(cors: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, port: number, cors: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, port: number, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(port: number, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;
    startWS(host: string, port: number, cors: string, apis: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>;

    stopRPC(
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    stopWS(
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;
}
