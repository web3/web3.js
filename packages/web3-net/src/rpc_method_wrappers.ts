import { Web3Context } from 'web3-core';
import { EthExecutionAPI } from 'web3-common';

import * as rpcMethods from './rpc_methods';

export const getId = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getId(web3Context.requestManager);

export const isListening = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.isListening(web3Context.requestManager);

export const getPeerCount = async (web3Context: Web3Context<EthExecutionAPI>) =>
	rpcMethods.getPeerCount(web3Context.requestManager);
