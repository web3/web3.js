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

import {provider} from 'web3-providers';
import {AbstractWeb3Module, Web3ModuleOptions} from 'web3-core';
import * as net from 'net';

export class Debug extends AbstractWeb3Module {
    constructor(provider: provider, net?: net.Socket|null, options?: Web3ModuleOptions);

    setBackTraceAt(
        location: string,
        callback?: (error: Error, result: any) => void
    ): Promise<any>;

    blockProfile(
        file: string,
        seconds: number,
        callback?: (error: Error, result: any) => void
    ): Promise<any>;

    cpuProfile(
        file: string,
        seconds: number,
        callback?: (error: Error, resukt: string) => void
    ): Promise<any>;

    dumpBlock(
        blockNumber: number,
        callback?: (error: Error, result: any) => void
    ): Promise<any>;

    getGCStats(
        callback?: (error: Error, result: Stats) => void
    ): Promise<Stats>;

    getBlockRlp(
        blockNumber: number,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    goTrace(
        file: string,
        seconds: number,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    getMemStats(callback?: (error: Error, result: any) => void): Promise<any>;

    getSeedHash(
        blockNumber: number,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    setBlockProfileRate(
        rate: number,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    setHead(
        blockNumber: number,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    getStacks(callback?: (error: Error, result: any) => void): Promise<string>;

    startCPUProfile(
        file: string,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    startGoTrace(
        file: string,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    stopCPUProfile(callback?: (error: Error, result: any) => void): Promise<boolean>;

    stopGoTrace(callback?: (error: Error, result: any) => void): Promise<boolean>;

    traceBlock(
        blockRlp: string,
        options?: any,
        callback?: (error: Error, result: any) => void
    ): Promise<BlockTraceResult>;

    traceBlockByNumber(
        blockNumber: number,
        options?: any,
        callback?: (error: Error, result: any) => void
    ): Promise<BlockTraceResult>;

    traceBlockByHash(
        transactionHash: string,
        options?: any,
        callback?: (error: Error, result: any) => void
    ): Promise<BlockTraceResult>;

    traceBlockFromFile(
        fileName: string,
        options?: any,
        callback?: (error: Error, result: any) => void
    ): Promise<BlockTraceResult>;

    traceTransaction(
        transactionHash: string,
        options?: any,
        callback?: (error: Error, result: ExecutionResurt) => void
    ): Promise<ExecutionResurt>;

    setVerbosity(
        level: number,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    setVerbosityPattern(
        input: string,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    writeBlockProfile(
        file: string,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;

    writeMemProfile(
        file: string,
        callback?: (error: Error, result: any) => void
    ): Promise<boolean>;
}

export interface Stats {
    LastGC: string;
    NumGC: number;
    Pause: number[];
    PauseEnd: string[];
    PauseQuantiles: string;
    PauseTotal: number;
}

export interface ExecutionResurt {
    failed: boolean;
    gas: number;
    returnValue: string;
    structLogs: any[];
}
