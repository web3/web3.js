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

export class AbiCoder {
    encodeFunctionSignature(functionName: string | ABIItem): string;
    encodeEventSignature(functionName: string | ABIItem): string;
    encodeParameter(type: string | {}, parameter: any): string;
    encodeParameters(types: Array<string | {}>, paramaters: any[]): string;
    encodeFunctionCall(abiItem: ABIItem, params: string[]): string;
    decodeParameter(type: string | {}, hex: string): { [key: string] : any; };
    decodeParameters(types: Array<string | {}>, hex: string): EthAbiDecodeParametersResultArray;
    decodeLog(inputs: ABIInput[], hex: string, topics: string[]): { [key: string] : string; };
}

export interface EthAbiDecodeParametersResultArray {
    [index: number]: any;
}

export type EthAbiDecodeParametersResultObject = EthAbiDecodeParametersResultArray & {
    [key: string]: any;
};

/******** These types need moving into a generic codebase to be shared to avoid repeating ***************/
export type ABIType = "function" | "constructor" | "event" | "fallback";

export interface ABIItem {
    constant?: boolean;
    inputs?: ABIInput[];
    name?: string;
    outputs?: ABIOuput[];
    payable?: boolean;
    stateMutability?: string; // could be a enum once we move this to generic place
    type: ABIType;
}
export interface ABIInput {
    name: string;
    type: string;
    indexed?: boolean;
}
export interface ABIOuput {
    name: string;
    type: string;
}
