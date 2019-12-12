import {Observable} from 'rxjs';
import EthereumConfiguration from "../../config/EthereumConfiguration";
import GetTransactionReceiptMethod from "../../methods/eth/transaction/GetTransactionReceiptMethod";
import TransactionReceipt from "../../../lib/types/output/TransactionReceipt";
import Block from "../../../lib/types/output/Block";

/**
 * Filter for transaction confirmations
 *
 * @method transactionConfirmations
 *
 * @param {EthereumConfiguration} config
 * @param {String} txHash
 */
export const transactionConfirmations = (config: EthereumConfiguration, txHash: string) => (source: Observable<any>) =>
    new Observable(observer => {
        return source.subscribe({
            async next(newHead: Block) {
                let blockNumbers: number[] = [];
                const getTransactionReceiptMethod = new GetTransactionReceiptMethod(config, [txHash]);
                const receipt: TransactionReceipt = await getTransactionReceiptMethod.execute();

                if (
                    receipt &&
                    (receipt.blockNumber === 0 || receipt.blockNumber) &&
                    !blockNumbers.includes(newHead.number)
                ) {
                    blockNumbers.push(newHead.number);

                    observer.next(receipt);
                }
            },
            error(err) {
                observer.error(err);
            },
            complete() {
                observer.complete();
            }
        });
    });