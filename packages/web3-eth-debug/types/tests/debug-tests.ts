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

import {Debug, Stats} from 'web3-eth-debug';

const debug = new Debug('http://localhost:8545');

// $ExpectType Promise<any>
debug.backTraceAt("server.go:443");

// $ExpectType Promise<any>
debug.backTraceAt("server.go:443", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.blockProfile("", 600);

// $ExpectType Promise<any>
debug.blockProfile("", 600, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.cpuProfile("", 600);

// $ExpectType Promise<any>
debug.cpuProfile("", 600, (error: Error, address: any) => {});

// $ExpectType Promise<any>
debug.dumpBlock(10);

// $ExpectType Promise<any>
debug.dumpBlock(10, (error: Error, result: string) => {});

// $ExpectType Promise<Stats>
debug.gcStats();

// $ExpectType Promise<Stats>
debug.gcStats((error: Error, result: Stats) => {});

// $ExpectType Promise<string>
debug.getBlockRlp(10);

// $ExpectType Promise<string>
debug.getBlockRlp(10, (error: Error, result: string) => {});

// $ExpectType Promise<any>
debug.goTrace("", 600);

// $ExpectType Promise<any>
debug.goTrace("", 600, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.memStats();

// $ExpectType Promise<any>
debug.memStats((error: Error, result: any) => {});

// $ExpectType Promise<string>
debug.seedHash(1);

// $ExpectType Promise<string>
debug.seedHash(1, (error: Error, result: string) => {});

// $ExpectType Promise<any>
debug.setHead(1);

// $ExpectType Promise<any>
debug.setHead(1, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.startCPUProfile("prince");

// $ExpectType Promise<any>
debug.startCPUProfile("prince", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.startGoTrace("prince");

// $ExpectType Promise<any>
debug.startGoTrace("prince", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.stopCPUProfile();

// $ExpectType Promise<any>
debug.stopCPUProfile((error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.stopGoTrace();

// $ExpectType Promise<any>
debug.stopGoTrace((error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlock("");

// $ExpectType Promise<any>
debug.traceBlock("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<any>
debug.traceBlock("", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlock("", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06");

// $ExpectType Promise<any>
debug.traceBlockByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<any>
debug.traceBlockByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockByHash("0x07801257594649d586712d84357b6626d81f33465519ba7994de585f3adf7f06", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockByNumber(10);

// $ExpectType Promise<any>
debug.traceBlockByNumber(10, {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<any>
debug.traceBlockByNumber(10, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockByNumber(10, {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockFromFile("");

// $ExpectType Promise<any>
debug.traceBlockFromFile("", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<any>
debug.traceBlockFromFile("", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceBlockFromFile("", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceTransaction("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f");

// $ExpectType Promise<any>
debug.traceTransaction("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f", {disableStack: true, disableMemory: true, disableStorage: true});

// $ExpectType Promise<any>
debug.traceTransaction("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.traceTransaction("0xfc9359e49278b7ba99f59edac0e3de49956e46e530a53c15aa71226b7aa92c6f", {disableStack: true, disableMemory: true, disableStorage: true}, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.verbosity(5);

// $ExpectType Promise<any>
debug.verbosity(5, (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.vmodule("eth/*=6");

// $ExpectType Promise<any>
debug.vmodule("eth/*=6", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.writeBlockProfile("");

// $ExpectType Promise<any>
debug.writeBlockProfile("", (error: Error, result: any) => {});

// $ExpectType Promise<any>
debug.writeMemProfile("");

// $ExpectType Promise<any>
debug.writeMemProfile("", (error: Error, result: any) => {});
