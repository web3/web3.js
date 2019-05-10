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

import {AbiInput, AbiItem} from 'web3-utils';

export class AbiCoder {
    encodeFunctionSignature(functionName: string | AbiItem): string;

    encodeEventSignature(functionName: string | AbiItem): string;

    encodeParameter(type: string | any, parameter: any): string;

    encodeParameters(types: Array<string | any>, paramaters: any[]): string;

    encodeFunctionCall(abiItem: AbiItem, params: string[]): string;

    decodeParameter(type: string | any, hex: string): {[key: string]: any;};

    decodeParameters(types: Array<string | any>, hex: string): {[key: string]: any;};

    decodeLog(inputs: AbiInput[], hex: string, topics: string[]): {[key: string]: string;};
}
