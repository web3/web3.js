import * as Utils from 'web3-utils';
import {cloneDeep} from 'lodash';
import Transaction from '../src/Transaction';

/**
 * Transaction test
 */
describe('TransactionTest', () => {
    let transaction;
    let txParamsTest;

    const txParams = {
        from: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F',
        to: '0x4F38f4229924bfa28D58eeda496Cc85e8016bCCC',
        value: Utils.toWei((1).toString(), 'ether'),
        gas: 21000,
        gasPrice: Utils.toWei((1).toString(), 'gwei'),
        data: '0x0',
        nonce: 0
    };

    const error = {
        from: "The 'from' parameter needs to be an address or a wallet index number.",
        to: "The 'to' parameter needs to be an address or 'deploy' when deploying code.",
        value:
            "The 'value' parameter needs to be zero or positive, and in number, BN, BigNumber or string format.\n" +
            "Use 'none' for 0 ether.",
        gas: '',
        gasPrice: '',
        data: "The 'data' parameter needs to be hex encoded.\n" + "Use 'none' for no payload.",
        nonce: "The 'nonce' parameter needs to be an integer.\n" + "Use 'auto' to set the RPC-calculated nonce."
    };

    const params = {
        from: undefined,
        to: undefined,
        value: undefined,
        gas: undefined,
        gasPrice: undefined,
        data: undefined,
        nonce: undefined
    };

    beforeEach(() => {
        txParamsTest = cloneDeep(txParams);
    });

    it('constructor check', () => {
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('error');
        expect(transaction).toHaveProperty('params');
    });

    it('accepts value types and parses to BN', () => {
        const tests = [
            {value: 101, is: Utils.toBN(101)},
            {value: Utils.toBN(102), is: Utils.toBN(102)},
            {value: '103', is: Utils.toBN(103)}
        ];

        tests.forEach((test) => {
            txParamsTest.value = test.value;

            transaction = new Transaction(txParamsTest, error, params);

            expect(transaction).toHaveProperty('params');
            expect(transaction.params.value).toEqual(test.is);
        });
    });

    it('accepts gas integer values', () => {
        const tests = [{value: 0}, {value: 10}];

        tests.forEach((test) => {
            txParamsTest.gas = test.value;

            transaction = new Transaction(txParamsTest, error, params);

            expect(transaction).toHaveProperty('params');
            expect(transaction.params.gas).toEqual(test.value);
        });
    });

    it('removes "to" for code deployment', () => {
        txParamsTest.to = 'deploy';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('params');
        expect(transaction.params).not.toHaveProperty('to');
    });

    it('sets 0 value for "none"', () => {
        txParamsTest.value = 'none';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('params');
        expect(transaction.params.value).toMatchObject(Utils.toBN(0));
    });

    it('sets 0x data for "none"', () => {
        txParamsTest.data = 'none';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('params');
        expect(transaction.params.data).toEqual('0x');
    });
});
