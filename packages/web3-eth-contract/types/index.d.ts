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
import {Common, PromiEvent, provider, hardfork, chain, BlockNumber, PastLogsOptions, LogsOptions} from 'web3-core';
import {AbiItem} from 'web3-utils';

export class Contract {
    constructor(
        provider: provider,
        abi: AbiItem[],
        address?: string,
        options?: ContractOptions
    );

    private _address: string;
    private _jsonInterface: AbiItem[];
    defaultAccount: string | null;
    defaultBlock: string | number;
    defaultCommon: Common;
    defaultHardfork: hardfork;
    defaultChain: chain;
    transactionPollingTimeout: number;
    transactionConfirmationBlocks: number;
    transactionBlockTimeout: number;

    options: Options;

    clone(): Contract;

    deploy(options: DeployOptions): ContractSendMethod;

    methods: any;

    once(
        event: string,
        callback: (error: Error, event: EventData) => void
    ): void;
    once(
        event: string,
        options: EventOptions,
        callback: (error: Error, event: EventData) => void
    ): void;

    events: any;

    getPastEvents(event: string): Promise<EventData[]>;
    getPastEvents(
        event: string,
        options: PastEventOptions,
        callback: (error: Error, event: EventData) => void
    ): Promise<EventData[]>;
    getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
    getPastEvents(
        event: string,
        callback: (error: Error, event: EventData) => void
    ): Promise<EventData[]>;
}

export interface Options extends ContractOptions {
    address: string;
    jsonInterface: AbiItem[];
}

export interface DeployOptions {
    data: string;
    arguments?: any[];
}

export interface ContractSendMethod {
    send(
        options: SendOptions,
        callback?: (err: Error, transactionHash: string) => void
    ): PromiEvent<Contract>;

    estimateGas(
        options: EstimateGasOptions,
        callback?: (err: Error, gas: number) => void
    ): Promise<number>;

    estimateGas(callback: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(
        options: EstimateGasOptions,
        callback: (err: Error, gas: number) => void
    ): Promise<number>;

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

export interface ContractOptions {
    // Sender to use for contract calls
    from?: string;
    // Gas price to use for contract calls
    gasPrice?: string;
    // Gas to use for contract calls
    gas?: number;
    // Contract code
    data?: string;
}

export interface PastEventOptions extends PastLogsOptions {
    filter?: Filter;
}

export interface EventOptions extends LogsOptions {
    filter?: Filter;
}

export interface Filter {
    [key: string]: number | string | string[] | number[];
}

export interface EventData {
    returnValues: {
        [key: string]: any;
    };
    raw: {
        data: string;
        topics: string[];
    };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}
