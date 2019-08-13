import Log from '../../../src/types/Log';
import Transaction from '../../../src/types/Transaction';

/**
 * Transaction test
 */
describe('TransactionTest', () => {
    let transactionMock = {
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
        status: '0x1',
        input: '0x0',
        nonce: '0x0',
        gasPrice: '0x0',
        value: '0x0',
        v: 'V',
        r: 'R',
        s: 'S'
    };

    it('calls the constructor and defines all properties correctly', () => {
        const transaction = new Transaction(transactionMock);

        expect(transaction.blockNumber).toEqual('0');

        expect(transaction.transactionIndex).toEqual('0');

        expect(transaction.gas).toEqual('0');

        expect(transaction.cumulativeGasUsed).toEqual('0');

        expect(transaction.gasUsed).toEqual('0');

        expect(transaction.to).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transaction.from).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transaction.logs).toEqual([
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

        expect(transaction.contractAddress).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transaction.status).toEqual(true);

        expect(transaction.input).toEqual('0x0');

        expect(transaction.nonce).toEqual('0');

        expect(transaction.gasPrice).toEqual('0');

        expect(transaction.value).toEqual('0');

        expect(transaction.v).toEqual('V');

        expect(transaction.r).toEqual('R');

        expect(transaction.s).toEqual('S');
    });
});
