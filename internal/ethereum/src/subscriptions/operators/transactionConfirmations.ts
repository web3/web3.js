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
export const transactionConfirmations = (config: EthereumConfiguration, txHash: string) => (source: Observable<Block>) =>
    new Observable(observer => {
        return source.subscribe({
            async next(block: Block) {
                let blockNumbers: number[] = [];
                const getTransactionReceiptMethod = new GetTransactionReceiptMethod(config, [txHash]);
                const receipt: TransactionReceipt = await getTransactionReceiptMethod.execute();

                if (
                    receipt &&
                    (receipt.blockNumber === 0 || receipt.blockNumber) &&
                    !blockNumbers.includes(block.number as number)
                ) {
                    // TODO: Because accessors can't have a different parameter an return types is this required
                    blockNumbers.push(block.number as number);

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