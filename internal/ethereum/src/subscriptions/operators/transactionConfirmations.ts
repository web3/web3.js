import {Observable, Observer} from 'rxjs';
import EthereumConfiguration from "../../config/EthereumConfiguration";
import GetTransactionReceiptMethod from "../../methods/eth/transaction/GetTransactionReceiptMethod";
import TransactionReceipt from "../../../lib/types/output/TransactionReceipt";
import Block from "../../../lib/types/output/Block";
import GetBlockByNumberMethod from "../../methods/eth/block/GetBlockByNumberMethod";

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
            async next(newHead: Block | number) {
                const getTransactionReceiptMethod = new GetTransactionReceiptMethod(config, [txHash]);
                const receipt: TransactionReceipt = await getTransactionReceiptMethod.execute();

                if (typeof newHead === 'number') {
                    let lastBlock: Block;

                    pollingConfirmation(config, receipt, lastBlock, observer);
                } else {
                    let blockNumbers: number[] = [];

                    newHeadsSubscriptionConfirmation(receipt, newHead, observer, blockNumbers);
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

/**
 * Counts confirmation over a socket connection
 *
 * @method newHeadsSubscriptionConfirmation
 *
 * @param {TransactionReceipt} receipt
 * @param {Block} newHead
 * @param {Observer} observer
 * @param {number[]} blockNumbers
 *
 * @returns {void}
 */
async function newHeadsSubscriptionConfirmation(receipt: TransactionReceipt, newHead: Block, observer: Observer<any>, blockNumbers: number[]): Promise<void> {
    if (
        receipt &&
        (receipt.blockNumber === 0 || receipt.blockNumber) &&
        !blockNumbers.includes(newHead.number)
    ) {
        blockNumbers.push(newHead.number);

        observer.next(receipt);
    }
}

/**
 * Counts confirmation over HTTP
 *
 * @method pollingConfirmation
 *
 * @param {EthereumConfiguration} config
 * @param {TransactionReceipt} receipt
 * @param {Block} lastBlock
 * @param {Observer} observer
 *
 * @returns {void}
 */
async function pollingConfirmation(config: EthereumConfiguration, receipt: TransactionReceipt, lastBlock: Block, observer: Observer<any>): Promise<void> {
    let getBlockByNumber = new GetBlockByNumberMethod(config, []);

    if (receipt && (receipt.blockNumber === 0 || receipt.blockNumber)) {
        if (lastBlock) {
            getBlockByNumber.parameters = [lastBlock.number + 1];
            const block = await getBlockByNumber.execute();

            if (block) {
                lastBlock = block;

                observer.next(receipt);
            }
        } else {
            getBlockByNumber.parameters = [receipt.blockNumber];
            lastBlock = await getBlockByNumber.execute();

            observer.next(receipt);
        }
    }
}
