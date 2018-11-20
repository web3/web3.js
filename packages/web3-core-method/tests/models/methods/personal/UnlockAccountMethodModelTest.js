import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import UnlockAccountMethodModel from '../../../../src/models/methods/personal/UnlockAccountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * UnlockAccountMethodModel test
 */
describe('UnlockAccountMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new UnlockAccountMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_unlockAccount', () => {
        expect(model.rpcMethod).to.equal('personal_unlockAccount');
    });

    it('parametersAmount should return 3', () => {
        expect(model.parametersAmount).to.equal(3);
    });

    it('beforeExecution should call inputSignFormatter and inputAddressFormatter', () => {
        model.parameters = ['0x0'];

        formattersMock
            .expects('inputAddressFormatter')
            .withArgs('0x0')
            .returns('0x00')
            .once();

        model.beforeExecution();

        formattersMock.verify();

        expect(model.parameters[0]).equal('0x00');
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('unlockAccount')).equal('unlockAccount');
    });
});
