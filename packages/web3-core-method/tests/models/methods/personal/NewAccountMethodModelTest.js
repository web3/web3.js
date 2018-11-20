const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon').createSandbox();
const utils = require('web3-utils');

const NewAccountMethodModel = require('../../../../src/models/methods/personal/NewAccountMethodModel');

/**
 * NewAccountMethodModel test
 */
describe('NewAccountMethodModelTest', () => {
    let model;
    let utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new NewAccountMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_newAccount', () => {
        expect(model.rpcMethod).to.equal('personal_newAccount');
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
        utilsMock
            .expects('toChecksumAddress')
            .withArgs('0x0')
            .returns('0x0')
            .once();

        expect(model.afterExecution('0x0')).equal('0x0');

        utilsMock.verify();
    });
});
