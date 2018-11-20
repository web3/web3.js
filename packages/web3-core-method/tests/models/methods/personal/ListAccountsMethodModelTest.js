import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import ListAccountsMethodModel from '../../../../src/models/methods/personal/ListAccountsMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * ListAccountsMethodModel test
 */
describe('ListAccountsMethodModelTest', () => {
    let model,
        utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new ListAccountsMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return personal_listAccounts', () => {
        expect(model.rpcMethod).to.equal('personal_listAccounts');
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

        expect(model.afterExecution(['0x0'])[0]).equal('0x0');

        utilsMock.verify();
    });
});
