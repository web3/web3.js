import TransactionOptions from '../../../src/types/TransactionOptions';

/**
 * TransactionOptions test
 */
describe('TransactionOptionsTest', () => {
    let transactionOptionsMock = {
        from: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        to: '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B',
        data: '0x0',
        gas: 0,
        gasPrice: 0,
        value: 0,
        nonce: 0
    };

    it('calls the constructor and defines all properties correctly', () => {
        const transactionOptions = new TransactionOptions(transactionOptionsMock);

        expect(transactionOptions.from).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(transactionOptions.to).toEqual('0x6d6dc708643a2782be27191e2abcae7e1b0ca38b');

        expect(transactionOptions.data).toEqual('0x0');

        expect(transactionOptions.gas).toEqual('0x00');

        expect(transactionOptions.gasPrice).toEqual('0x00');

        expect(transactionOptions.value).toEqual('0x00');

        expect(transactionOptions.nonce).toEqual('0x00');
    });
});
