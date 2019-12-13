
export default interface TransactionReceiptProperties {
    blockNumber: string | null;
    transactionIndex: string;
    gasPrice: string;
    value: string;
    nonce: string;
    gas: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    to: string;
    from: string;
    logs: object[];
    contractAddress: string;
    status: string | null | undefined;
    transactionHash: string;
    logsBloom: string;
    root: string;
    blockHash: string;
}