import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import IsSyncingMethodModel from '../../../../src/models/methods/node/IsSyncingMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * IsSyncingMethodModel test
 */
describe('IsSyncingMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new IsSyncingMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_syncing', () => {
        expect(model.rpcMethod).to.equal('eth_syncing');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputSyncingFormatter')
            .withArgs({})
            .returns({isSyncing: true})
            .once();

        expect(model.afterExecution({})).to.be.property('isSyncing', true);

        formattersMock.verify();
    });
});
