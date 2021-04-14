export interface RpcResponse {
    id: number,
    jsonrpc: string,
    result: BigInt
}

export interface Web3Eth {
    getBlocknumber(): Promise<RpcResponse>
  }