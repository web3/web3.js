import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import utils from 'web3-utils';
import GetTransactionFromBlockMethodModel from '../../../../src/models/methods/transaction/GetTransactionFromBlockMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetStorageAtMethodModel test
 */
describe('GetStorageAtMethodModelTest', () => {
    let model, formattersMock, utilsMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new GetTransactionFromBlockMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(model.rpcMethod).toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toBe(2);
    });

    it(
        'should call beforeExecution with block hash as parameter ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            model.parameters = ['0x0', 100];

            formattersMock
                .expects('inputBlockNumberFormatter')
                .withArgs(model.parameters[0])
                .returns('0x0')
                .once();

            utilsMock
                .expects('numberToHex')
                .withArgs(model.parameters[1])
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).toBe('0x0');
            expect(model.parameters[1]).toBe('0x0');

            formattersMock.verify();
            utilsMock.verify();

            expect(model.rpcMethod).toBe('eth_getTransactionByBlockHashAndIndex');
        }
    );

    it(
        'should call beforeExecution with block number as parameter  ' +
            'and should call formatters.inputBlockNumberFormatter and utils.numberToHex',
        () => {
            model.parameters = [100, 100];

            formattersMock
                .expects('inputBlockNumberFormatter')
                .withArgs(model.parameters[0])
                .returns('0x0')
                .once();

            utilsMock
                .expects('numberToHex')
                .withArgs(model.parameters[1])
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).toBe('0x0');
            expect(model.parameters[1]).toBe('0x0');

            formattersMock.verify();
            utilsMock.verify();

            expect(model.rpcMethod).toBe('eth_getTransactionByBlockNumberAndIndex');
        }
    );

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputTransactionFormatter')
            .withArgs({})
            .returns({empty: false})
            .once();

        expect(model.afterExecution({})).toHaveProperty('empty', false);

        formattersMock.verify();
    });
});
