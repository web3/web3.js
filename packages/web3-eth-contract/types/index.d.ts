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

import BN = require('bn.js');
import {provider} from 'web3-providers';
import {AbiInput, AbiOutput, AbiItem} from 'web3-utils';
import {PromiEvent, Web3ModuleOptions} from 'web3-core';

export class Contract {
    constructor(
        provider: provider,
        abi: AbiItem[],
        address?: string,
        options?: ContractOptions
    )

    address: string;
    jsonInterface: AbiModel;

    options: Options;

    clone(): Contract;

    deploy(options: DeployOptions): ContractSendMethod;

    methods: any;

    once(event: string, callback: (error: Error, event: EventData) => void): void;
    once(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): void;

    events: any;

    getPastEvents(event: string): Promise<EventData[]>;
    getPastEvents(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): Promise<EventData[]>;
    getPastEvents(event: string, options: EventOptions): Promise<EventData[]>;
    getPastEvents(event: string, callback: (error: Error, event: EventData) => void): Promise<EventData[]>;
}

export class ContractModuleFactory {
} // TODO: Define methods

export interface Options {
    address: string;
    data: string;
}

export interface DeployOptions {
    data: string;
    arguments?: any[];
}

export interface ContractSendMethod {
    send(options: SendOptions, callback?: (err: Error, transactionHash: string) => void): PromiEvent<Contract>;

    estimateGas(options: EstimateGasOptions, callback?: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(callback: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(options: EstimateGasOptions, callback: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(options: EstimateGasOptions): Promise<number>;

    estimateGas(): Promise<number>;

    encodeABI(): string;
}

export interface SendOptions {
    from: string;
    gasPrice?: string;
    gas?: number;
    value?: number | string | BN;
}

export interface EstimateGasOptions {
    from?: string;
    gas?: number;
    value?: number | string | BN;
}

export interface ContractOptions extends Web3ModuleOptions {
    // Sender to use for contract calls
    from?: string;
    // Gas price to use for contract calls
    gasPrice?: string;
    // Gas to use for contract calls
    gas?: number;
    // Contract code
    data?: string;
}

export interface EventOptions {
    filter?: {};
    fromBlock?: number;
    toBlock?: string | number;
    topics?: any[];
}

export interface EventData {
    returnValues: {
        [key: string]: any;
    },
    raw: {
        data: string;
        topics: string[];
    },
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}

export interface AbiModel {
    getMethod(name: string): AbiItemModel | false;

    getMethods(): AbiItemModel[];

    hasMethod(name: string): boolean;

    getEvent(name: string): AbiItemModel | false;

    getEvents(): AbiItemModel[];

    getEventBySignature(signature: string): AbiItemModel;

    hasEvent(name: string): boolean;
}

export interface AbiItemModel {
    signature: string;
    name: string;
    payable: boolean;
    anonymous: boolean;

    getInputLength(): number;

    getInputs(): AbiInput[];

    getIndexedInputs(): AbiInput[];

    getOutputs(): AbiOutput[];

    isOfType(): boolean;
}
