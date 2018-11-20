const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const utils = require('web3-utils');

const GetAccountsMethodModel = require('../../../../src/models/methods/account/GetAccountsMethodModel');

/**
 * GetAccountsMethodModel test
 */
describe('GetAccountsMethodModelTest', () => {
    let model;
    let utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new GetAccountsMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_accounts', () => {
        expect(model.rpcMethod).to.equal('eth_accounts');
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
            .withArgs({})
            .returns('0x0')
            .once();

        expect(model.afterExecution([{}])[0]).equal('0x0');

        utilsMock.verify();
    });
});
