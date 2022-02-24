/* for some reason typescript is thrown error  src/types.ts(1,9): error TS2305: Module '"web3-utils"' has no exported member 'HexString'. */
// TODO: use HexString from "web3-utils" => import {HexString} from "web3-utils";
type HexString = string;

export type NetRPCApi = {
	net_version: () => string; // https://eth.wiki/json-rpc/API#net_version
	net_listening: () => boolean; // https://eth.wiki/json-rpc/API#net_listening
	net_peerCount: () => HexString; // https://eth.wiki/json-rpc/API#net_peercount
};
