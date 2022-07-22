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

import { JsonRpcId, JsonRpcIdentifier } from './json_rpc_types';

export type Web3APISpec = Record<string, (...params: any) => any>;
export type Web3APIMethod<T extends Web3APISpec> = string & keyof T;
export type Web3APIParams<API extends Web3APISpec, Method extends Web3APIMethod<API>> = Parameters<
	API[Method]
>;

export interface Web3APIRequest<API extends Web3APISpec, Method extends Web3APIMethod<API>> {
	method: Method;
	params: Web3APIParams<API, Method>;
}

export interface Web3APIPayload<API extends Web3APISpec, Method extends Web3APIMethod<API>>
	extends Web3APIRequest<API, Method> {
	readonly jsonrpc?: JsonRpcIdentifier;
	readonly id?: JsonRpcId;
}

export type Web3APIReturnType<
	API extends Web3APISpec,
	Method extends Web3APIMethod<API>,
> = ReturnType<API[Method]>;
