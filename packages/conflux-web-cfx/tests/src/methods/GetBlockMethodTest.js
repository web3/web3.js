import {formatters} from 'conflux-web-core-helpers';
import GetBlockMethod from '../../../src/methods/GetBlockMethod';

/**
 * GetBlockMethod test
 */
describe('GetBlockMethodTest', () => {
    let getBlockMethod;

    beforeEach(() => {
        getBlockMethod = new GetBlockMethod({}, formatters, {});
    });

    it('constructor check', () => {
        expect(getBlockMethod.rpcMethod).toEqual('cfx_getBlockByEpochNumber');
    });

    it('calls execute with hash', () => {
        getBlockMethod.parameters = ['0x0'];

        getBlockMethod.beforeExecution({});

        expect(getBlockMethod.rpcMethod).toEqual('cfx_getBlockByHash');
    });

    it('calls execute with number', () => {
        getBlockMethod.parameters = [100];

        getBlockMethod.beforeExecution({});

        expect(getBlockMethod.rpcMethod).toEqual('cfx_getBlockByEpochNumber');
    });
});
