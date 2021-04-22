export interface HttpRpcOptions {
    id?: number,
    jsonrpc: string,
    method: string,
    params: {[key: string]: string | number}
}

export interface HttpRpcResponse {
    id: number,
    jsonrpc: string,
    result: string |
        number |
        boolean |
        (string|number)[] |
        {[key: string]: string | number} |
        BigInt
}

export interface IWeb3Provider {
    providerString: string
    protectProvider: boolean
    connected: boolean
    supportsSubscriptions: boolean
    setProvider: (providerString: string) => void
    // TODO get rid of anys
    send: (options: any) => Promise<any>
    disconnect?: () => void
}
  
export interface ProviderOptions {
    providerString: string
    protectProvider: boolean
    supportsSubscriptions: boolean
}
