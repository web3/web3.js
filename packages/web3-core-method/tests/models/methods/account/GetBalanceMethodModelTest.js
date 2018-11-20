import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetBalanceMethodModel from '../../../../src/models/methods/account/GetBalanceMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetBalanceMethodModel test
 */
describe('GetBalanceMethodModelTest', () => {
    let model,
        formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetBalanceMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getBalance', () => {
        expect(model.rpcMethod).to.equal('eth_getBalance');
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

    it('afterExecution should call outputBigNumberFormatter on the response and return it', () => {
        const response = {};

        formattersMock
            .expects('outputBigNumberFormatter')
            .withArgs(response)
            .returns({bigNumber: true})
            .once();

        expect(model.afterExecution({})).to.have.property('bigNumber', true);

        formattersMock.verify();
    });
});
