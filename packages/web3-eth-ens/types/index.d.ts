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
 * @date 2018
 */

import {MethodModuleFactory} from 'web3-core-method';
import {Accounts} from 'web3-eth-accounts';
import {AbiCoder} from 'web3-eth-abi';
import {Contract, ContractModuleFactory} from 'web3-eth-contract';
import {provider, ProvidersModuleFactory} from 'web3-providers';
import {AbstractWeb3Module, PromiEvent, Web3ModuleOptions} from 'web3-core';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import {Utils} from 'web3-utils';
import * as net from 'net';

export class Ens extends AbstractWeb3Module {
    constructor(
        provider: provider,
        net?: net.Socket,
        accounts?: Accounts,
        options?: Web3ModuleOptions
    );

    registry: Registry;

    resolver(name: string): Promise<Contract>;

    supportsInterface(name: string, interfaceId: string, callback?: () => {}): Promise<boolean>;

    getAddress(name: string, callback?: () => {}): Promise<string>;

    setAddress(name: string, address: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;

    getPubkey(name: string, callback?: () => {}): Promise<string>;

    setPubkey(name: string, x: string, y: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;

    setText(name: string, key: string, value: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;

    getText(name: string, key: string, callback?: () => {}): Promise<string>;

    getContent(name: string, callback?: () => {}): Promise<string>;

    setContent(name: string, hash: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;

    getMultihash(name: string, callback?: () => {}): Promise<string>;

    setMultihash(name: string, hash: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;

    getContenthash(name: string, callback?: () => {}): Promise<string>;

    setContenthash(name: string, hash: string, sendOptions: TxObject, callback?: () => {}): PromiEvent<any>;
}

export class Registry {
    constructor(
        provider: provider,
        providersModuleFactory: ProvidersModuleFactory,
        methodModuleFactory: MethodModuleFactory,
        contractModuleFactory: ContractModuleFactory,
        promiEvent: PromiEvent<any>,
        abiCoder: AbiCoder,
        utils: Utils,
        formatters: formatters,
        options: object,
        net: Network
    );

    owner(name: string, callback?: () => {}): Promise<string>;

    resolver(name: string): Promise<Contract>;

    checkNetwork(): Promise<string>;
}

export interface TxObject {
    from?: string | number;
    to?: string;
    gasPrice?: string;
    gas?: number | string;
    value?: number | string;
    chainId?: number;
    data?: string;
    nonce?: number;
}
