import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import utils from 'web3-utils';
import GetTransactionCountMethodModel from '../../../../src/models/methods/account/GetTransactionCountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetTransactionCountMethodModel test
 */
describe('GetTransactionCountMethodModelTest', () => {
    let model,
        formattersMock,
        utilsMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new GetTransactionCountMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionCount', () => {
        expect(model.rpcMethod).to.equal('eth_getTransactionCount');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', () => {
        model.parameters = ['string', 100];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs(model.parameters[0])
            .returns('0x0')
            .once();

        formattersMock
            .expects('inputDefaultBlockNumberFormatter')
            .withArgs(model.parameters[1], {})
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).equal('0x0');
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();
    });

    it('afterExecution should call hexToNumber on the response and return it', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
