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
    constructor(provider: provider, net?: net.Socket | null, options?: Web3ModuleOptions);

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
    alloc: number;
    totalAlloc: number;
    sys: number;
    loopups: number;
    mallocs: number;
    frees: number;
    heapAlloc: number;
    heapSys: number;
    heapIdle: number;
    heapInUse: number;
    heapReleased: number;
    heapObjects: number;
    stackInUse: number;
    stackSys: number;
    mSpanInUse: number;
    mSpanSys: number;
    mCacheInUse: number;
    mCacheSys: number;
    buckHashSys: number;
    gcSys: number;
    otherSys: number;
    nextGC: number;
    lastGC: number;
    pauseTotalNs: number;
    pauseNs: number;
    pauseEnd: number;
    numGC: number;
    numForcedGC: number;
    gcCPUFraction: number;
    enableGC: boolean;
    debugGC: boolean;
    bySize: {
        size: number;
        mallocs: number;
        frees: number;
    };
}
