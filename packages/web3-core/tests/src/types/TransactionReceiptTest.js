import Log from '../../../src/types/Log';
import TransactionReceipt from '../../../src/types/TransactionReceipt';

/**
 * TransactionReceipt test
 */
describe('TransactionReceiptTest', () => {
    let transactionReceiptMock = {
        blockNumber: '0x0',
        transactionIndex: '0x0',
        gas: '0x0',
        cumulativeGasUsed: '0x0',
        gasUsed: '0x0',
        to: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        from: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        logs: [
            {
                address: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
                blockHash: '0x0',
                blockNumber: '0x0',
                data: '0x0',
                logIndex: '0x0',
                topics: ['0x0'],
                transactionHash: '0x0',
                transactionIndex: '0x0',
                removed: false
            }
        ],
        contractAddress: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        status: '0x1'
    };

    it('calls the constructor and defines all properties correctly', () => {
        const transactionReceipt = new TransactionReceipt(transactionReceiptMock);

        expect(transactionReceipt.blockNumber).toEqual('0');

        expect(transactionReceipt.transactionIndex).toEqual('0');

        expect(transactionReceipt.gas).toEqual('0');

        expect(transactionReceipt.cumulativeGasUsed).toEqual('0');

        expect(transactionReceipt.gasUsed).toEqual('0');

        expect(transactionReceipt.to).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transactionReceipt.from).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transactionReceipt.logs).toEqual([
            new Log({
                address: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
                blockHash: '0x0',
                blockNumber: '0x0',
                data: '0x0',
                logIndex: '0x0',
                topics: ['0x0'],
                transactionHash: '0x0',
                transactionIndex: '0x0',
                removed: false
            })
        ]);

        expect(transactionReceipt.contractAddress).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transactionReceipt.status).toEqual(true);
    });
});
