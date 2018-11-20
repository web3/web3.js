const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon').createSandbox();
const formatters = require('web3-core-helpers').formatters;

const PersonalSendTransactionMethodModel = require('../../../../src/models/methods/personal/PersonalSendTransactionMethodModel');

/**
 * PersonalSendTransactionMethodModel test
 */
describe('PersonalSendTransactionMethodModelTest', () => {
    let model;
    let formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new PersonalSendTransactionMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_sendTransaction', () => {
        expect(model.rpcMethod).to.equal('personal_sendTransaction');
    });

    it('parametersAmount should return 2', () => {
        expect(model.parametersAmount).to.equal(2);
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

        expect(model.parameters[0]).to.be.property('send', true);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('personalSend')).equal('personalSend');
    });
});
