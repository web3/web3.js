import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import GetBlockTransactionCountMethodModel from '../../../../src/models/methods/block/GetBlockTransactionCountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetBlockTransactionCountMethodModel test
 */
describe('GetBlockTransactionCountMethodModelTest', () => {
    let model, utilsMock, formattersMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        formattersMock = sinon.mock(formatters);
        model = new GetBlockTransactionCountMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionByBlockNumberAndIndex', () => {
        expect(model.rpcMethod).toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).toBe(1);
    });

    it('beforeExecution should call method with block hash as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).toBe('eth_getTransactionByBlockHashAndIndex');
    });

    it('beforeExecution should call method with block number as parameter and call inputBlockNumberFormatter', () => {
        model.parameters = [100];

        formattersMock
            .expects('inputBlockNumberFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).toBe('0x0');

        formattersMock.verify();

        expect(model.rpcMethod).toBe('eth_getTransactionByBlockNumberAndIndex');
    });

    it('afterExecution should map the hex string to a number', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).toBe(100);

        utilsMock.verify();
    });
});
