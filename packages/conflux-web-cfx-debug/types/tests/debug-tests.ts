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
/**
 * @file debug-tests.ts
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import {Debug, Stats, TransactionTrace, WorldState, MemStats, BlockTraceResult} from 'conflux-web-eth-debug';

const debug = new Debug('http://localhost:8545');

// $ExpectType Promise<null>
debug.setBackTraceAt("server.go:443");

// $ExpectType Promise<null>
debug.setBackTraceAt("server.go:443", (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.blockProfile("", 600);

// $ExpectType Promise<null>
debug.blockProfile("", 600, (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.cpuProfile("", 600);

// $ExpectType Promise<null>
debug.cpuProfile("", 600, (error: Error, address: null) => {});

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

// $ExpectType Promise<null>
debug.goTrace("", 600);

// $ExpectType Promise<null>
debug.goTrace("", 600, (error: Error, result: null) => {});

// $ExpectType Promise<MemStats>
debug.getMemStats();

// $ExpectType Promise<MemStats>
debug.getMemStats((error: Error, result: MemStats) => {});

// $ExpectType Promise<string>
debug.getSeedHash(1);

// $ExpectType Promise<string>
debug.getSeedHash(1, (error: Error, result: string) => {});

// $ExpectType Promise<null>
debug.setHead(1);

// $ExpectType Promise<null>
debug.setHead(1, (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.startCPUProfile("prince");

// $ExpectType Promise<null>
debug.startCPUProfile("prince", (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.startGoTrace("prince");

// $ExpectType Promise<null>
debug.startGoTrace("prince", (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.stopCPUProfile();

// $ExpectType Promise<null>
debug.stopCPUProfile((error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.stopGoTrace();

// $ExpectType Promise<null>
debug.stopGoTrace((error: Error, result: null) => {});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTrace("");

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTrace("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTrace("", (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTrace("", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06");

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    {disableStack: true, disableMemory: true, disableStorage: true}
);

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByHash(
    "0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByNumber(10);

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByNumber(10, {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByNumber(10, (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceByNumber(
    10,
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceFromFile("");

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceFromFile("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceFromFile("", (error: Error, result: BlockTraceResult) => {});

// $ExpectType Promise<BlockTraceResult>
debug.getBlockTraceFromFile(
    "",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: BlockTraceResult) => {}
);

// $ExpectType Promise<TransactionTrace>
debug.getTransactionTrace("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f");

// $ExpectType Promise<TransactionTrace>
debug.getTransactionTrace(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    {disableStack: true, disableMemory: true, disableStorage: true}
);

// $ExpectType Promise<TransactionTrace>
debug.getTransactionTrace(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    (error: Error, result: TransactionTrace) => {}
);

// $ExpectType Promise<TransactionTrace>
debug.getTransactionTrace(
    "0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f",
    {disableStack: true, disableMemory: true, disableStorage: true},
    (error: Error, result: TransactionTrace) => {}
);

// $ExpectType Promise<null>
debug.setVerbosity(5);

// $ExpectType Promise<null>
debug.setVerbosity(5, (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.setVerbosityPattern("eth/*=6");

// $ExpectType Promise<null>
debug.setVerbosityPattern("eth/*=6", (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.writeBlockProfile("");

// $ExpectType Promise<null>
debug.writeBlockProfile("", (error: Error, result: null) => {});

// $ExpectType Promise<null>
debug.writeMemProfile("");

// $ExpectType Promise<null>
debug.writeMemProfile("", (error: Error, result: null) => {});
