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
 * @file debug-tests.ts
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import {Debug, Stats, TransactionTrace, WorldState, MemStats, BlockTraceResult} from 'web3-eth-debug';

const debug = new Debug('http://localhost:8545');

// $ExpectType Promise<boolean>
debug.setBackTraceAt("server.go:443");

// $ExpectType Promise<boolean>
debug.setBackTraceAt("server.go:443", (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.blockProfile("", 600);

// $ExpectType Promise<boolean>
debug.blockProfile("", 600, (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.cpuProfile("", 600);

// $ExpectType Promise<boolean>
debug.cpuProfile("", 600, (error: Error, address: boolean) => {});

// $ExpectType Promise<WorldState>
debug.dumpBlock(10);

// $ExpectType Promise<WorldState>
debug.dumpBlock(10, (error: Error, result: WorldState) => {});

// $ExpectType Promise<Stats>
debug.getGCStats();

// $ExpectType Promise<Stats>
debug.getGCStats((error: Error, result: Stats) => {});

// $ExpectType Promise<string>
debug.getBlockRlp(10);

// $ExpectType Promise<string>
debug.getBlockRlp(10, (error: Error, result: string) => {});

// $ExpectType Promise<boolean>
debug.goTrace("", 600);

// $ExpectType Promise<boolean>
debug.goTrace("", 600, (error: Error, result: boolean) => {});

// $ExpectType Promise<MemStats>
debug.getMemStats();

// $ExpectType Promise<MemStats>
debug.getMemStats((error: Error, result: MemStats) => {});

// $ExpectType Promise<string>
debug.getSeedHash(1);

// $ExpectType Promise<string>
debug.getSeedHash(1, (error: Error, result: string) => {});

// $ExpectType Promise<boolean>
debug.setHead(1);

// $ExpectType Promise<boolean>
debug.setHead(1, (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.startCPUProfile("prince");

// $ExpectType Promise<boolean>
debug.startCPUProfile("prince", (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.startGoTrace("prince");

// $ExpectType Promise<boolean>
debug.startGoTrace("prince", (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.stopCPUProfile();

// $ExpectType Promise<boolean>
debug.stopCPUProfile((error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.stopGoTrace();

// $ExpectType Promise<boolean>
debug.stopGoTrace((error: Error, result: boolean) => {});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlock("");

// $ExpectType Promise<BlockTraceResult>
debug.traceBlock("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlock("", (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlock("", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06");

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    {disableStack: true, disableMemory: true, disableStorage: true}
);

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByNumber(10);

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByNumber(10, {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByNumber(10, (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockByNumber(
    10,
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockFromFile("");

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockFromFile("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockFromFile("", (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.traceBlockFromFile(
    "",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<TransactionTrace>
debug.traceTransaction("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f");

// $ExpectType Promise<TransactionTrace>
debug.traceTransaction(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    {disableStack: true, disableMemory: true, disableStorage: true}
);

// $ExpectType Promise<TransactionTrace>
debug.traceTransaction(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    (error: Error, result: TransactionTrace) => {}
);

// $ExpectType Promise<TransactionTrace>
debug.traceTransaction(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: TransactionTrace) => {}
);

// $ExpectType Promise<boolean>
debug.setVerbosity(5);

// $ExpectType Promise<boolean>
debug.setVerbosity(5, (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.setVerbosityPattern("eth/*=6");

// $ExpectType Promise<boolean>
debug.setVerbosityPattern("eth/*=6", (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.writeBlockProfile("");

// $ExpectType Promise<boolean>
debug.writeBlockProfile("", (error: Error, result: boolean) => {});

// $ExpectType Promise<boolean>
debug.writeMemProfile("");

// $ExpectType Promise<boolean>
debug.writeMemProfile("", (error: Error, result: boolean) => {});
