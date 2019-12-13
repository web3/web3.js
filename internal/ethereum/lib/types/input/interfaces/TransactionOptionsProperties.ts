
export default interface TransactionOptionsProperties {
    from: string;
    to: string;
    data: string;
    gas: number;
    gasPrice: number;
    value: number;
    nonce: number;
}