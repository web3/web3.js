import { HttpRpcResponse } from "web3-providers-http/types";

export type blockIdentifier = number | 'latest' | 'earliest' | 'pending'

export interface Web3EthOptions {
    packageName?: string
    providerUrl: string
}

export interface EthAddressBlockParmeters {
    address: string
    block?: blockIdentifier
}

export interface EthGetStorageAtParameters extends EthAddressBlockParmeters {
    position: string
}

export interface BlockHashParameter {
    blockHash: string
}

export interface BlockIdentifierParameter {
    blockNumber: blockIdentifier
}

export interface EthSignParameters {
    address: string
    message: string
}

export interface EthTransaction {
    from: string
    to?: string
    gas?: BigInt
    gasPrice?: BigInt
    value?: BigInt
    data?: string
    nonce?: number
}

export interface EthCallTransaction extends EthTransaction {
    to: string
}

export interface EthStringResult extends HttpRpcResponse {
    result: string
}

export interface EthBooleanResult extends HttpRpcResponse {
    result: boolean
}

export interface EthSyncingResult extends HttpRpcResponse {
    result: {
        startingBlock: string,
        currentBlock: string,
        highestBlock: string
    } | false
}

export interface EthAccountsResult extends HttpRpcResponse {
    result: string[]
}
