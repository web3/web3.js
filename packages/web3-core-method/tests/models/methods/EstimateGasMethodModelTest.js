import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import utils from 'web3-utils';
import EstimateGasMethodModel from '../../../src/models/methods/EstimateGasMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * EstimateGasMethodModel test
 */
describe('EstimateGasMethodModelTest', () => {
    let model, formattersMock, utilsMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new EstimateGasMethodModel(utils, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_estimateGas', () => {
        expect(model.rpcMethod).to.equal('eth_estimateGas');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call the inputCallFormatter', () => {
        model.parameters = [{}];

        formattersMock
            .expects('inputCallFormatter')
            .withArgs(model.parameters[0], {})
            .returns({empty: true})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.have.property('empty', true);

        formattersMock.verify();
    });

    it('afterExecution should call hexToNumber and return the response', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs({})
            .returns(100)
            .once();

        expect(model.afterExecution({})).equal(100);

        utilsMock.verify();
    });
});
