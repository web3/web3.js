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

import { Web3Context } from 'web3-core';

import { convertToValidType, ValidReturnTypes, ValidTypes } from 'web3-utils';
import * as rpcMethods from './rpc_methods';
import { Web3NetAPI } from './web3_net_api';

export async function getId<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<Web3NetAPI>,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getId(web3Context.requestManager);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export async function getPeerCount<ReturnType extends ValidTypes = ValidTypes.HexString>(
	web3Context: Web3Context<Web3NetAPI>,
	returnType?: ReturnType,
) {
	const response = await rpcMethods.getPeerCount(web3Context.requestManager);

	return convertToValidType(
		response,
		returnType ?? web3Context.defaultReturnType,
	) as ValidReturnTypes[ReturnType];
}

export const isListening = async (web3Context: Web3Context<Web3NetAPI>) =>
	rpcMethods.isListening(web3Context.requestManager);
