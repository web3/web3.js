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
import { Common, PromiEvent, hardfork, chain, BlockNumber, PastLogsOptions, LogsOptions } from 'web3-core';
import { AbiItem } from 'web3-utils';

export namespace ContractMethod {
    interface CallOptions {
        /** (optional): The address the call “transaction” should be made from. */
        from: string
        /** (optional): The gas price in wei to use for this call “transaction”. */
        gasPrice: string
        /** (optional): The maximum gas provided for this call “transaction” (gas limit). */
        gas: number
    }

    interface SendOptions extends CallOptions {
        /** (optional): The value transferred for the call “transaction” in wei. */
        value: any
    }

    interface GasOptions {
        /** (optional): The address the call “transaction” should be made from. */
        from: string
        /** (optional): The maximum gas provided for this call “transaction” (gas limit). */
        gas: number
        /** (optional): The value transferred for the call “transaction” in wei. */
        value: any
    }
}

export interface ContractMethod<T> {
    /**
     * Call a “constant” method and execute its smart contract method in the EVM without sending any transaction. Note calling cannot alter the smart contract state.
     *
     * @param options Provide options used for calling.
     * @param defaultBlock (optional): If you pass this parameter it will not use the default block set with contract.defaultBlock.
     * @param callback (optional): This callback will be fired with the result of the smart contract method execution as the second argument, or with an error object as the first argument.
     */
    call(options: Partial<ContractMethod.CallOptions>, defaultBlock: number | string | "earliest" | "latest" | "pending", callback: (error: Error, txnHash: string) => void): void

    /**
     * Call a “constant” method and execute its smart contract method in the EVM without sending any transaction. Note calling cannot alter the smart contract state.
     *
     * @param options Provide options used for calling.
     * @param defaultBlock (optional): If you pass this parameter it will not use the default block set with contract.defaultBlock.
     * @returns A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent). Resolves when the transaction receipt is available,
     * @
     */
    call(options: Partial<ContractMethod.CallOptions>, defaultBlock: number | string | "earliest" | "latest" | "pending"): PromiEvent<T>

    /**
     * Call a “constant” method and execute its smart contract method in the EVM without sending any transaction. Note calling cannot alter the smart contract state.
     *
     * @param options Provide options used for calling.
     * @returns A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent). Resolves when the transaction receipt is available,
     */
    call(options: Partial<ContractMethod.CallOptions>): PromiEvent<T>

    /**
     * Send a transaction to the smart contract and execute its method. Note this can alter the smart contract state.
     *
     * @param options Provide options for sending transaction
     * @param callback (optional): This callback will be fired first with the “transactionHash”, or with an error object as the first argument.
     */
    send(options: Partial<ContractMethod.SendOptions>, callback: (error: Error, txnHash: string) => void): void

    /**
     * Send a transaction to the smart contract and execute its method. Note this can alter the smart contract state.
     *
     * @param options Provide options for sending transaction
     * @returns A [promise combined event emitter](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent). Resolves when the transaction receipt is available,
     */
    send(options: Partial<ContractMethod.SendOptions>): PromiEvent<T>

    /**
     * Encodes the ABI for this method. The resulting hex string is 32-bit function signature hash plus the passed parameters in Solidity tightly packed format.
     * @returns The encoded ABI byte code to send via a transaction or call.
     */
    encodeABI(): string

    /**
     * Will call to estimate the gas a method execution will take when executed in the EVM
     *
     * @param options Provide the options for the call.
     * @param callback (optional) This callback will be fired with the result of the gas estimation as the second argument, or with an error object as the first argument.
     */
    estimateGas(options: Partial<ContractMethod.GasOptions>, callback: (error: Error, gasAmount: number) => void): void

    /**
     * Will call to estimate the gas a method execution will take when executed in the EVM
     *
     * @param options (optional) Provide the options for the call.
     * @returns The gas amount estimated.
     */
    estimatedGas(options?: Partial<ContractMethod.GasOptions>): Promise<number>
}

// TODO: Add generic type!
export class Contract {
    constructor(
        jsonInterface: AbiItem[],
        address?: string,
        options?: ContractOptions
    );

    private _address: string;
    private _jsonInterface: AbiItem[];
    defaultAccount: string | null;
    defaultBlock: BlockNumber;
    defaultCommon: Common;
    defaultHardfork: hardfork;
    defaultChain: chain;
    transactionPollingTimeout: number;
    transactionConfirmationBlocks: number;
    transactionBlockTimeout: number;
    handleRevert: boolean;

    options: Options;

    clone(): Contract;

    deploy(options: DeployOptions): ContractSendMethod;

    methods: {
        // tslint:disable-next-line:no-unnecessary-generics
        [key in string]: <T>(...args: string[]) => ContractMethod<T>
    };

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

    call(
        options?: CallOptions,
        callback?: (err: Error, result: any) => void
    ): Promise<any>;

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

export interface CallOptions {
    from?: string;
    gasPrice?: string;
    gas?: number;
}

export interface SendOptions {
    from: string;
    gasPrice?: string;
    gas?: number;
    value?: number | string | BN;
    nonce?: number;
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
