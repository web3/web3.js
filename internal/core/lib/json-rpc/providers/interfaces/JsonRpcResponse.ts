
export default interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string | Error;
    params?: any;
}
