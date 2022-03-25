import { DataFormat, format } from 'web3-common';
import { Web3Context } from 'web3-core';
import * as rpcMethods from './rpc_methods';
import { Web3NetAPI } from './web3_net_api';

export async function getId<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3NetAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getId(web3Context.requestManager);

	return format({ eth: 'uint' }, response as unknown as number, returnFormat);
}

export async function getPeerCount<ReturnFormat extends DataFormat>(
	web3Context: Web3Context<Web3NetAPI>,
	returnFormat: ReturnFormat,
) {
	const response = await rpcMethods.getPeerCount(web3Context.requestManager);

	// Data returned is number in hex format
	return format({ eth: 'uint' }, response as unknown as number, returnFormat);
}

export const isListening = async (web3Context: Web3Context<Web3NetAPI>) =>
	rpcMethods.isListening(web3Context.requestManager);
