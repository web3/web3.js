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
        BigInt |
        null | any
}
