import BigNumber from 'bignumber.js';
import * as Types from '../..';
import Transaction from '../Transaction';

/**
 * Transaction test
 */
describe('TransactionTest', () => {
    let transaction, txParams;

    beforeEach(() => {
        txParams = {
            from: new Types.Address('0xE247A45c287191d435A8a5D72A7C8dc030451E9F'),
            to: new Types.Address('0xE247A45c287191d435A8a5D72A7C8dc030451E9F'),
            value: 1,
            gas: 21000,
            gasPrice: 0,
            data: new Types.Hex('empty'),
            nonce: 0,
            chainId: 2
        };
    });

    it('constructor check', () => {
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
    });

    it('accepts value types and parses to BigNumber', () => {
        const tests = [
            {value: 101, is: BigNumber(101)},
            {value: BigNumber(102), is: BigNumber(102)},
            {value: '103', is: BigNumber(103)}
        ];

        tests.forEach((test) => {
            txParams.value = test.value;

            transaction = new Transaction(txParams);

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.value).toEqual(test.is);
        });
    });

    it('accepts address string', () => {
        txParams.from = '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC';
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.from).toHaveProperty('isAddress');
    });

    it('accepts wallet index', () => {
        txParams.from = 0;
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.from).toBe(0);
    });

    it('accepts gas integer values', () => {
        const tests = [{value: 0}, {value: 10}];

        tests.forEach((test) => {
            txParams.gas = test.value;

            transaction = new Transaction(txParams);

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.gas).toEqual(test.value);
        });
    });

    it('keeps "to" for code deployment', () => {
        txParams.to = 'deploy';
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.to).not.toBeDefined();
    });

    it('sets 0 value for "none"', () => {
        txParams.value = 'none';
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.value).toMatchObject(BigNumber(0));
    });

    it('sets 0x data for "none"', () => {
        txParams.data = 'none';
        transaction = new Transaction(txParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.data).toHaveProperty('isHex');
    });

    it('gets properties', () => {
        transaction = new Transaction(txParams);

        Object.keys(txParams).forEach((param) => {
            console.log(param, transaction[param]);
            const getter = transaction[param].toString();
            expect(getter).toEqual(txParams[param].toString());
        });
    });
});
