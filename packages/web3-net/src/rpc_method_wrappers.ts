import { Web3Context } from 'web3-core';

import * as rpcMethods from './rpc_methods';
import { NetRPCApi } from './types';

export const getId = async (web3Context: Web3Context<NetRPCApi>) =>
	rpcMethods.getId(web3Context.requestManager);

export const isListening = async (web3Context: Web3Context<NetRPCApi>) =>
	rpcMethods.isListening(web3Context.requestManager);

export const getPeerCount = async (web3Context: Web3Context<NetRPCApi>) =>
	rpcMethods.getPeerCount(web3Context.requestManager);
