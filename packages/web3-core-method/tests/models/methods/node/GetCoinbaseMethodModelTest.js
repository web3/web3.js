import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import GetCoinbaseMethodModel from '../../../../src/models/methods/node/GetCoinbaseMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetCoinbaseMethodModel test
 */
describe('GetCoinbaseMethodModelTest', () => {
    let model,
        utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new GetCoinbaseMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_coinbase', () => {
        expect(model.rpcMethod).to.equal('eth_coinbase');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('coinbase')).equal('coinbase');
    });
});
