import * as Utils from 'web3-utils';
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
        data: Types.Hex('empty'),
        nonce: 0,
        chainId: 2
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
        nonce: "The 'nonce' parameter needs to be an integer.\n" + "Use 'auto' to set the RPC-calculated nonce.",
        chainId: "The 'chainId' parameter needs to be an integer.\n" + "Use 'main' to set the mainnet chain ID."
    };

    const params = {
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
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('error');
        expect(transaction).toHaveProperty('props');
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

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.value).toEqual(test.is);
        });
    });

    it('accepts gas integer values', () => {
        const tests = [{value: 0}, {value: 10}];

        tests.forEach((test) => {
            txParamsTest.gas = test.value;

            transaction = new Transaction(txParamsTest, error, params);

            expect(transaction).toHaveProperty('props');
            expect(transaction.props.gas).toEqual(test.value);
        });
    });

    it('removes "to" for code deployment', () => {
        txParamsTest.to = 'deploy';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props).not.toHaveProperty('to');
    });

    it('sets 0 value for "none"', () => {
        txParamsTest.value = 'none';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.value).toMatchObject(Utils.toBN(0));
    });

    it('sets 0x data for "none"', () => {
        txParamsTest.data = 'none';
        transaction = new Transaction(txParamsTest, error, params);

        expect(transaction).toHaveProperty('props');
        expect(transaction.props.data).toHaveProperty('isHex');
    });

    it('gets properties', () => {
        transaction = new Transaction(txParamsTest, error, params);

        Object.keys(txParamsTest).forEach((param) => {
            const getter = transaction[param].toString();
            expect(getter).toEqual(txParamsTest[param].toString());
        });
    });
});
