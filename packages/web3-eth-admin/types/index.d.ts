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
import {AbstractWeb3Module, Web3ModuleOptions} from 'web3-core';
import * as net from 'net';

export class Admin extends AbstractWeb3Module {
    constructor(provider: provider, net?: net.Socket|null, options?: Web3ModuleOptions, accounts?: Accounts|null);

    addPeer(
        url: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    getadminDataDirectory(
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    getNodeInfo(
        callback?: (error: Error, result: ArrayBuffer) => void
    ): Promise<any>;

    getPeers(
        callback?: (error: Error, result: ArrayBuffer) => void
    ): Promise<any>;

    setSolc(
        path: string,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    startRPC(
        host: string,
        port: number,
        cors?: string,
        apis?: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    startWS(
        host: string,
        port: number,
        cors?: string,
        apis?: string,
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    stopRPC(
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;

    stopWS(
        callback?: (error: Error, result: boolean) => void
    ): Promise<boolean>;
}
