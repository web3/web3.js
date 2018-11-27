import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import PersonalSendTransactionMethodModel from '../../../../src/models/methods/personal/PersonalSendTransactionMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * PersonalSendTransactionMethodModel test
 */
describe('PersonalSendTransactionMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new PersonalSendTransactionMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_sendTransaction', () => {
        expect(model.rpcMethod).toBe('personal_sendTransaction');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).toBe(2);
    });

    it('beforeExecution should call inputTransactionFormatter', () => {
        model.parameters = [{}];

        formattersMock
            .expects('inputTransactionFormatter')
            .withArgs({}, {})
            .returns({send: true})
            .once();

        model.beforeExecution({});

        formattersMock.verify();

        expect(model.parameters[0]).toHaveProperty('send', true);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('personalSend')).toBe('personalSend');
    });
});
