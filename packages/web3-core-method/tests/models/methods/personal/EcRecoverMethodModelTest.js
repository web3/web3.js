import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import EcRecoverMethodModel from '../../../../src/models/methods/personal/EcRecoverMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * EcRecoverMethodModel test
 */
describe('EcRecoverMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new EcRecoverMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_ecRecover', () => {
        expect(model.rpcMethod).to.equal('personal_ecRecover');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [{}, '0x0'];

        formattersMock
            .expects('inputSignFormatter')
            .withArgs(model.parameters[0])
            .returns({sign: true})
            .once();

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs(model.parameters[1])
            .returns('0x0')
            .once();

        model.beforeExecution();

        expect(model.parameters[0]).to.be.property('sign', true);
        expect(model.parameters[1]).equal('0x0');

        formattersMock.verify();
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('submitWork')).equal('submitWork');
    });
});
