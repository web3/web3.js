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

import BigNumber from "bn.js";

export type Unit =
    "noether"
    | "wei"
    | "kwei"
    | "Kwei"
    | "babbage"
    | "femtoether"
    | "mwei"
    | "Mwei"
    | "lovelace"
    | "picoether"
    | "gwei"
    | "Gwei"
    | "shannon"
    | "nanoether"
    | "nano"
    | "szabo"
    | "microether"
    | "micro"
    | "finney"
    | "milliether"
    | "milli"
    | "ether"
    | "kether"
    | "grand"
    | "mether"
    | "gether"
    | "tether";

export type Mixed =
    string
    | number
    | BN
    | {
        type: string;
        value: string;
    }
    | {
        t: string;
        v: string | BN | number;
    }
    | boolean;

export type Hex = string | number;

export class BN extends BigNumber {
    constructor(
        number: number | string | number[] | Buffer | BN,
        base?: number | 'hex',
        endian?: 'le' | 'be'
    )
    super(
        number: number | string | number[] | Buffer | BN,
        base?: number | 'hex',
        endian?: 'le' | 'be'
    ): BigNumber;
}

// utils types
export function isBN(value: string | number): boolean;
export function isBigNumber(value: BN): boolean;
export function toBN(value: number | string): BN;
export function toTwosComplement(value: number | string | BN): string;
export function isAddress(address: string): boolean;
export function isHex(hex: Hex): boolean;
export function isHexStrict(hex: Hex): boolean;
export function asciiToHex(string: string): string;
export function hexToAscii(string: string): string;
export function toAscii(string: string): string;
export function bytesToHex(bytes: number[]): string;
export function numberToHex(value: number | string | BN): string;
export function checkAddressChecksum(address: string): boolean;
export function fromAscii(string: string): string;
export function fromDecimal(value: string | number): string;
export function fromUtf8(string: string): string;
export function fromWei(value: BN, unit?: Unit): BN | string;
export function hexToBytes(hex: Hex): number[];
export function hexToNumber(hex: Hex): number;
export function hexToNumberString(hex: Hex): string;
export function hexToString(hex: Hex): string;
export function hexToUtf8(string: string): string;
export function keccak256(value: string | BN): string;
export function padLeft(value: string | number, characterAmount: number, sign?: string): string;
export function leftPad(string: string | number, characterAmount: number, sign?: string): string;
export function rightPad(string: string | number, characterAmount: number, sign?: string): string;
export function padRight(string: string | number, characterAmount: number, sign?: string): string;
export function sha3(value: string | BN): string;
export function randomHex(bytesSize: number): string;
export function utf8ToHex(string: string): string;
export function stringToHex(string: string): string;
export function toChecksumAddress(address: string): string;
export function toDecimal(hex: Hex): number;
export function toHex(value: number | string | BN): string;
export function toUtf8(string: string): string;
export function toWei(value: number | string | BN, unit?: Unit): string | BN;
export function isBloom(bloom: string): boolean;
export function isTopic(topic: string): boolean;
export function _fireError(error: fireError | string | Error, emitter: {}, reject: (error: Error) => void, callback: (error: Error) => void): {};
export function _jsonInterfaceMethodToString(json: {}): string;
export function _flattenTypes(includeTuple: boolean, puts: {}): string[];
export function soliditySha3(...val: Mixed[]): string;
export function getUnitValue(unit: Unit): string;
export function unitMap(): Units;

// bloom types
export function testAddress(bloom: string, address: string): boolean;
export function testTopic(bloom: string, topic: string): boolean;

// interfaces

export interface fireError {
    message: string;
    data: string | {} | any[];
}

export interface Units {
    noether: string;
    wei: string;
    kwei: string;
    Kwei: string;
    babbage: string;
    femtoether: string;
    mwei: string;
    Mwei: string;
    lovelace: string;
    picoether: string;
    gwei: string;
    Gwei: string;
    shannon: string;
    nanoether: string;
    nano: string;
    szabo: string;
    microether: string;
    micro: string;
    finney: string;
    milliether: string;
    milli: string;
    ether: string;
    kether: string;
    grand: string;
    mether: string;
    gether: string;
    tether: string;
}
