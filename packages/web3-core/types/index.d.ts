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

import {AbstractProviderAdapter, ProvidersModuleFactory, provider} from 'web3-providers';

export class AbstractWeb3Module {
    constructor(
        provider: AbstractProviderAdapter | provider | string,
        providersModuleFactory: ProvidersModuleFactory,
        // not sure what the below object structure is
        providers: {},
        // dont have type yet
        // as this is in web3-core-method
        // can be sorted later once dependencies
        // are cleaned up
        methodController: any,
        // dont have type yet
        // as this is in web3-core-method
        // can be sorted later once dependencies
        // are cleaned up
        AbstractMethodModelFactory?: any,
        options?: Web3ModuleOptions
    );
    readonly defaultGasPrice: string;
    readonly defaultGas: number;
    readonly transactionPollingTimeout: number;
    readonly transactionConfirmationBlocks: number;
    readonly transactionBlockTimeout: number;
    readonly defaultBlock: string | number;
    readonly defaultAccount: string | null;
    readonly currentProvider: AbstractProviderAdapter | provider;
    // if we can get a strongly typed object for `net` that would be great
    setProvider(provider: AbstractProviderAdapter | provider | string, net: any): boolean;
    isSameProvider(provider: AbstractProviderAdapter | provider | string): boolean;
    clearSubscriptions(): void;
}

export interface Web3ModuleOptions {
    defaultAccount?: string;
    defaultBlock?: string | number;
    transactionBlockTimeout?: number;
    transactionConfirmationBlocks?: number;
    transactionPollingTimeout?: number;
    defaultGasPrice?: string;
    defaultGas?: number;
}
