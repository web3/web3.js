import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import LockAccountMethodModel from '../../../../src/models/methods/personal/LockAccountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * LockAccountMethodModel test
 */
describe('LockAccountMethodModelTest', () => {
    let model,
        formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new LockAccountMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_lockAccount', () => {
        expect(model.rpcMethod).to.equal('personal_lockAccount');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call inputAddressFormatter', () => {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x0')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('0x0');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('lockAccount')).equal('lockAccount');
    });
});
