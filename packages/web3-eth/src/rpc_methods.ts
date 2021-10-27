import { InvalidResponseError, JsonRpcResponse, ResponseError } from 'web3-common';
import { Web3RequestManager } from 'web3-core';
import { DesiredReturnType, EthSyncingResponse, HexString, NumberString } from './types';

enum ReturnTypes {
	HexString = 'HexString',
	Number = 'Number',
	NumberString = 'NumberString',
	BigInt = 'BigInt',
}

interface Web3EthMethodOptions {
	returnType?: ReturnTypes;
}

/**
 * For all below methods, if (options.returnType === undefined)
 * then the return value is what's specified by JSON RPC spec:
 * https://eth.wiki/json-rpc/API
 */

export async function getProtocolVersion(
    requestManager: Web3RequestManager,
    options?: Web3EthMethodOptions
): Promise<DesiredReturnType> {
    const response = await requestManager.send<JsonRpcResponse<NumberString>, []>({
        method: 'eth_protocolVersion',
    });

    if (response instanceof ResponseError) throw response;
    if (response.result === undefined) throw new InvalidResponseError(response);

    if (options?.returnType !== undefined) {
        // convert result
    }

    return response.result as NumberString;
}

export async function getSyncing<ReturnType = HexString>(
    requestManager: Web3RequestManager,
    options?: Web3EthMethodOptions
): Promise<EthSyncingResponse<ReturnType>> {
    const response = await requestManager.send<JsonRpcResponse<EthSyncingResponse<ReturnType>>, []>({
        method: 'eth_syncing',
    });

    if (response instanceof ResponseError) throw response;
    if (response.result === undefined) throw new InvalidResponseError(response);

    if (options?.returnType !== undefined) {
        // convert result
    }

    return response.result;
}
