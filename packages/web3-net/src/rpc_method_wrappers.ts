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
