import { Web3RequestManager } from 'web3-core';
import { Web3NetAPI } from './web3_net_api';

export async function getId(requestManager: Web3RequestManager<Web3NetAPI>) {
	return requestManager.send({
		method: 'net_version',
		params: [],
	});
}

export async function getPeerCount(requestManager: Web3RequestManager<Web3NetAPI>) {
	return requestManager.send({
		method: 'net_peerCount',
		params: [],
	});
}

export async function isListening(requestManager: Web3RequestManager<Web3NetAPI>) {
	return requestManager.send({
		method: 'net_listening',
		params: [],
	});
}
