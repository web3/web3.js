import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import NewAccountMethodModel from '../../../../src/models/methods/personal/NewAccountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * NewAccountMethodModel test
 */
describe('NewAccountMethodModelTest', () => {
    let model, utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new NewAccountMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_newAccount', () => {
        expect(model.rpcMethod).toBe('personal_newAccount');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        utilsMock
            .expects('toChecksumAddress')
            .withArgs('0x0')
            .returns('0x0')
            .once();

        expect(model.afterExecution('0x0')).toBe('0x0');

        utilsMock.verify();
    });
});
