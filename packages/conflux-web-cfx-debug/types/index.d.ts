/*
    This file is part of conflux-web.js.
    conflux-web.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    conflux-web.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with conflux-web.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import {provider} from 'conflux-web-providers';
import {AbstractConfluxWebModule, ConfluxWebModuleOptions} from 'conflux-web-core';
import * as net from 'net';

export class Debug extends AbstractConfluxWebModule {
    constructor(provider: provider, net?: net.Socket | null, options?: ConfluxWebModuleOptions);

    setBackTraceAt(
        location: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    blockProfile(
        file: string,
        seconds: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    cpuProfile(
        file: string,
        seconds: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    dumpBlock(
        blockNumber: number | string,
        callback?: (error: Error, result: WorldState) => void
    ): Promise<WorldState>;

    getGCStats(
        callback?: (error: Error, result: Stats) => void
    ): Promise<Stats>;

    getBlockRlp(
        blockNumber: number | string,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    goTrace(
        file: string,
        seconds: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    getMemStats(callback?: (error: Error, result: MemStats) => void): Promise<MemStats>;

    getSeedHash(
        blockNumber: number | string,
        callback?: (error: Error, result: string) => void
    ): Promise<string>;

    setBlockProfileRate(
        rate: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    setHead(
        blockNumber: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    getStacks(callback?: (error: Error, result: string) => void): Promise<string>;

    startCPUProfile(
        file: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    startGoTrace(
        file: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    stopCPUProfile(callback?: (error: Error, result: null) => void): Promise<null>;

    stopGoTrace(callback?: (error: Error, result: null) => void): Promise<null>;

    getBlockTrace(
        blockRlp: string,
        options?: any,
        callback?: (error: Error, result: BlockTraceResult) => void
    ): Promise<BlockTraceResult>;

    getBlockTraceByNumber(
        blockNumber: number | string,
        options?: any,
        callback?: (error: Error, result: BlockTraceResult) => void
    ): Promise<BlockTraceResult>;

    getBlockTraceByHash(
        transactionHash: string,
        options?: any,
        callback?: (error: Error, result: BlockTraceResult) => void
    ): Promise<BlockTraceResult>;

    getBlockTraceFromFile(
        fileName: string,
        options?: any,
        callback?: (error: Error, result: BlockTraceResult) => void
    ): Promise<BlockTraceResult>;

    getTransactionTrace(
        transactionHash: string,
        options?: any,
        callback?: (error: Error, result: TransactionTrace) => void
    ): Promise<TransactionTrace>;

    setVerbosity(
        level: number | string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    setVerbosityPattern(
        input: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    writeBlockProfile(
        file: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;

    writeMemProfile(
        file: string,
        callback?: (error: Error, result: null) => void
    ): Promise<null>;
}

export interface Stats {
    LastGC: string;
    NumGC: number;
    Pause: number[];
    PauseEnd: string[];
    PauseQuantiles: string;
    PauseTotal: number;
}

export interface TransactionTrace {
    gas: number;
    returnValue: string;
    structLogs: StructuredLog[];
}

export interface StructuredLog {
    depth: number;
    error: string;
    gas: number;
    gasCost: number;
    memory: string[];
    op: string;
    pc: number;
    stack: string[];
    storage: {
        [account: string]: string
    }
}

export interface WorldState {
    root: string;
    accounts: {
        [address: string]: {
            balance: string;
            code: string;
            codeHash: string;
            nonce: number;
            root: string;
            storage: any;
        }
    };
}

export interface BlockTraceResult {
    number: number;
    hash: string;
    traces: TransactionTrace[]
}

export interface MemStats {
    Alloc: number;
    TotalAlloc: number;
    Sys: number;
    Loopups: number;
    Mallocs: number;
    Frees: number;
    HeapAlloc: number;
    HeapSys: number;
    HeapIdle: number;
    HeapInuse: number;
    HeapReleased: number;
    HeapObjects: number;
    StackInuse: number;
    StackSys: number;
    MSpanInuse: number;
    MSpanSys: number;
    MCacheInuse: number;
    MCacheSys: number;
    BuckHashSys: number;
    GcSys: number;
    OtherSys: number;
    NextGC: number;
    LastGC: number;
    PauseTotalNs: number;
    PauseNs: number;
    PauseEnd: number;
    NumGC: number;
    NumForcedGC: number;
    GcCPUFraction: number;
    EnableGC: boolean;
    DebugGC: boolean;
    BySize: {
        size: number;
        mallocs: number;
        frees: number;
    };
}
