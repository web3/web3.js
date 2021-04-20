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
