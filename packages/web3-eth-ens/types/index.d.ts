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
 * @author Samuel Furter <samuel@ethereum.org>, Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import * as net from 'net';
import {
    AbstractWeb3Module,
    AccountsBase,
    NetworkBase,
    PromiEvent,
    provider,
    TransactionConfig,
    Web3ModuleOptions
} from 'web3-core';
import { formatters } from 'web3-core-helpers';
import { AbiCoder } from 'web3-eth-abi';
import { Contract, ContractModuleFactory } from 'web3-eth-contract';
import { Utils } from 'web3-utils';

export class Ens extends AbstractWeb3Module {
    constructor(
        provider: provider,
        net?: net.Socket | null,
        accounts?: AccountsBase | null,
        options?: Web3ModuleOptions
    );

    registry: Registry;

    resolver(name: string): Promise<Contract>;

    supportsInterface(
        name: string,
        interfaceId: string,
        callback?: (error: Error, supportsInterface: boolean) => void
    ): Promise<boolean>;

    getAddress(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    setAddress(
        name: string,
        address: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;

    getPubkey(
        name: string,
        callback?: (error: Error, result: { [x: string]: string }) => void
    ): Promise<{ [x: string]: string }>;

    setPubkey(
        name: string,
        x: string,
        y: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;

    getText(
        name: string,
        key: string,
        callback?: (error: Error, ensName: string) => void
    ): Promise<string>;

    setText(
        name: string,
        key: string,
        value: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;

    getContent(
        name: string,
        callback?: (error: Error, contentHash: string) => void
    ): Promise<string>;

    setContent(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;

    getMultihash(
        name: string,
        callback?: (error: Error, multihash: string) => void
    ): Promise<string>;

    setMultihash(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;

    getContenthash(
        name: string,
        callback?: (error: Error, contenthash: string) => void
    ): Promise<string>;

    setContenthash(
        name: string,
        hash: string,
        sendOptions: TransactionConfig,
        callback?: (error: Error, result: any) => void
    ): PromiEvent<any>;
}

export class Registry {
    constructor(
        provider: provider,
        contractModuleFactory: ContractModuleFactory,
        accounts: AccountsBase,
        abiCoder: AbiCoder,
        utils: Utils,
        formatters: formatters,
        options: Web3ModuleOptions,
        net: NetworkBase
    );

    ens: Ens;

    resolverContract: Contract | null;

    setProvider(provider: provider, net?: net.Socket): boolean;

    owner(
        name: string,
        callback?: (error: Error, address: string) => void
    ): Promise<string>;

    resolver(name: string): Promise<Contract>;

    checkNetwork(): Promise<string>;
}
