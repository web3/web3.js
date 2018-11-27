import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetPastLogsMethodModel from '../../../src/models/methods/GetPastLogsMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetPastLogsMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getLogs', () => {
        expect(model.rpcMethod).toBe('eth_getLogs');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).toBe(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
        model.parameters = [{}];

        formattersMock
            .expects('inputLogFormatter')
            .withArgs(model.parameters[0])
            .returns({empty: true})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).toHaveProperty('empty', true);

        formattersMock.verify();
    });

    it('afterExecution should just return the response', () => {
        formattersMock
            .expects('outputLogFormatter')
            .withArgs({})
            .returns({formatted: true})
            .once();

        expect(model.afterExecution([{}])[0]).toHaveProperty('formatted', true);

        formattersMock.verify();
    });
});
