import { RpcResponse } from 'web3-internal-base/types'

export interface RpcResponseSyncing extends RpcResponse {
    result: {
        startingBlock: string,
        currentBlock: string,
        highestBlock: string
    }
}

export interface RpcResponseAccounts extends RpcResponse {
    result: string[]
}

export interface ProviderOptions {
    protectProvider?: boolean
    supportsSubscriptions?: boolean
}

export interface Web3EthOptions {
    packageName?: string
    providerString: string
    providerOptions?: ProviderOptions
}
