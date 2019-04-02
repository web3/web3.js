import BigNumber from 'bignumber.js';
import {cloneDeep} from 'lodash';
import * as Types from '../..';
import Transaction from '../Transaction';

/**
 * Transaction test
 */
describe('TransactionTest', () => {
    let transaction;
    let txParamsTest;

    const txParams = {
        from: Types.Address('0xE247A45c287191d435A8a5D72A7C8dc030451E9F'),
        to: Types.Address('0xE247A45c287191d435A8a5D72A7C8dc030451E9F'),
        value: 1,
        gas: 21000,
        gasPrice: 0,
        data: new Types.Hex('empty'),
        nonce: 0,
        chainId: 2
    };

    const error = {
        from: () => 'err msg',
        to: () => 'err msg',
        value: () => 'err msg',
        gas: () => 'err msg',
        gasPrice: () => 'err msg',
        data: () => 'err msg',
        nonce: () => 'err msg',
        chainId: () => 'err msg'
    };

    const initParams = {
        from: undefined,
        to: undefined,
        value: undefined,
        gas: undefined,
        gasPrice: undefined,
        data: undefined,
        nonce: undefined,
        chainId: undefined
    };

    beforeEach(() => {
        txParamsTest = cloneDeep(txParams);
    });

    it('constructor check', () => {
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('error');
        expect(transaction).toHaveProperty('props');
    });

    it('accepts value types and parses to BigNumber', () => {
        const tests = [
            {value: 101, is: BigNumber(101)},
            {value: BigNumber(102), is: BigNumber(102)},
            {value: '103', is: BigNumber(103)}
        ];

        tests.forEach((test) => {
            txParamsTest.value = test.value;

            transaction = new Transaction(txParamsTest, error, initParams);

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.value).toEqual(test.is);
        });
    });

    it('accepts address string', () => {
        txParamsTest.from = '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC';
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.from).toHaveProperty('isAddress');
    });

    it('accepts wallet index', () => {
        txParamsTest.from = 0;
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.from).toBe(0);
    });

    it('accepts gas integer values', () => {
        const tests = [{value: 0}, {value: 10}];

        tests.forEach((test) => {
            txParamsTest.gas = test.value;

            transaction = new Transaction(txParamsTest, error, initParams);

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.gas).toEqual(test.value);
        });
    });

    it('removes "to" for code deployment', () => {
        txParamsTest.to = 'deploy';
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props).not.toHaveProperty('to');
    });

    it('sets 0 value for "none"', () => {
        txParamsTest.value = 'none';
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.value).toMatchObject(BigNumber(0));
    });

    it('sets 0x data for "none"', () => {
        txParamsTest.data = 'none';
        transaction = new Transaction(txParamsTest, error, initParams);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.data).toHaveProperty('isHex');
    });

    it('gets properties', () => {
        transaction = new Transaction(txParamsTest, error, initParams);

        Object.keys(txParamsTest).forEach((param) => {
            const getter = transaction[param].toString();
            expect(getter).toEqual(txParamsTest[param].toString());
        });
    });
});
