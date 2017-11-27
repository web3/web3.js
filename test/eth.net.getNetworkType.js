import { assert } from 'chai';
import FakeIpcProvider from './helpers/FakeIpcProvider';
import Web3 from '../packages/web3';

const tests = [{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
}, {
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
}, {
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'main'
}, {
    hash: '0xffe56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 42,
    result: 'private'
}, {
    hash: '0xffe56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'private'
}, {
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 42,
    result: 'private'
}];

describe('getNetworkType', () => {
    tests.forEach((test) => {
        it(`should detect the ${test.result} net`, async () => {
            const provider = new FakeIpcProvider();
            const web3 = new Web3(provider);

            provider.injectResult(test.id);
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'net_version');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult({
                hash: test.hash,
                blockNumber: '0x0'
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'eth_getBlockByNumber');
                assert.deepEqual(payload.params, ['0x0', false]);
            });

            const res = await web3.eth.net.getNetworkType();
            assert.equal(res, test.result);
        });
    });
});
