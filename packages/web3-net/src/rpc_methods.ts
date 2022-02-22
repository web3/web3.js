import { Web3RequestManager } from 'web3-core';

export async function getId(requestManager: Web3RequestManager) {
	return requestManager.send({
		method: 'net_version',
		params: [],
	});
}

export async function isListening(requestManager: Web3RequestManager) {
	return requestManager.send({
		method: 'net_listening',
		params: [],
	});
}

export async function getPeerCount(requestManager: Web3RequestManager) {
	return requestManager.send({
		method: 'net_peerCount',
		params: [],
	});
}
