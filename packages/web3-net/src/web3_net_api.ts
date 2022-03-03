import { HexString } from 'web3-utils';

export type Web3NetAPI = {
	net_version: () => string; // https://eth.wiki/json-rpc/API#net_version
	net_peerCount: () => HexString; // https://eth.wiki/json-rpc/API#net_peercount
	net_listening: () => boolean; // https://eth.wiki/json-rpc/API#net_listening
};
