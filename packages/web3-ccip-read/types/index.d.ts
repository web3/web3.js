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
 * @author Leon Talbert <leon@ens.domains>
 * @date 2022
 */

interface ErrorObject { }

interface ResultObject { }

interface PayloadObject { }

interface XMLHttpRequest { }

interface Options {
    ccipReadGatewayCallback: () => null,
    ccipReadGatewayUrls: [string],
    ccipReadGatewayAllowList: [string],
    ccipReadMaxRedirectCount: number
}

export function ccipReadCall(
    errorObject: ErrorObject,
    result: ResultObject,
    payload: PayloadObject,
    send: () => null,
    options: Options
): any;

export function isOffChainLookup(err: ErrorObject, result: ResultObject): boolean

export function callGateways(
    urls: [string],
    to: string,
    callData: string,
    allowList: [string]
): XMLHttpRequest
