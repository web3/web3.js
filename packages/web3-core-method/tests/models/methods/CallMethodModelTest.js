import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import CallMethodModel from '../../../src/models/methods/CallMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * CallMethodModel test
 */
describe('CallMethodModelTest', () => {
    let model,
        formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new CallMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_call', () => {
        expect(model.rpcMethod).to.equal('eth_call');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        model.parameters = [{}, 100];

        formattersMock
            .expects('inputCallFormatter')
            .withArgs(model.parameters[0], {})
            .returns({empty: true})
            .once();

        formattersMock
            .expects('inputDefaultBlockNumberFormatter')
            .withArgs(model.parameters[1], {})
            .returns('0x0')
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.have.property('empty', true);
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
