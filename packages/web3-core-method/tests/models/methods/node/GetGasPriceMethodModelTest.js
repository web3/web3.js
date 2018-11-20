import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetGasPriceMethodModel from '../../../../src/models/methods/node/GetGasPriceMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetGasPriceMethodModel test
 */
describe('GetGasPriceMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetGasPriceMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_gasPrice', () => {
        expect(model.rpcMethod).to.equal('eth_gasPrice');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputBigNumberFormatter')
            .withArgs('1000')
            .returns({bigNumber: true})
            .once();

        expect(model.afterExecution('1000')).to.be.property('bigNumber', true);

        formattersMock.verify();
    });
});
