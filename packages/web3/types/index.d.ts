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
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import {AbstractWeb3Module, Web3ModuleOptions, Providers} from 'web3-core';
import {Utils} from 'web3-utils';
import * as net from 'net';
import {provider, AbstractProviderAdapter, BatchRequest} from 'web3-providers';
import {Eth} from "web3-eth";
import {Network} from "web3-net";

export class Web3 extends AbstractWeb3Module {
    constructor(
        provider: AbstractProviderAdapter | provider,
        net?: net.Server,
        options?: Web3ModuleOptions
    );
    static utils: Utils;
    utils: Utils;
    static version: string;
    version: string;
    static givenProvider: provider;
    static providers: Providers;
    static modules: Modules;
    setProvider(provider: provider, net?: net.Server): boolean;
    BatchRequest: new () => BatchRequest;
    eth: Eth;
    shh: any; // coming when shh types are written;
    bzz: any; // coming when bzz types are written;
}

export interface Modules {
    Eth: Eth;
    Net: Network;
    Personal: any; // coming when personal types are written
    Shh: any; // coming when shh types are written;
    Bzz: any; // coming when bzz types are written;
}
