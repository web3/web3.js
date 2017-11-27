import { assert } from 'chai';
import Web3 from '../packages/web3';
import FakeIpcProvider from './helpers/FakeIpcProvider';

const web3 = new Web3();

// use sendTransaction as dummy
const method = 'call';

const tests = [{
    input: {
        from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
        to: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'
    },
    formattedInput: [{
        from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
        to: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8'
    }, 'latest'],
    result: '0xb',
    formattedResult: '0xb',
    call: `eth_${method}`
}];

describe('async', () => {
    tests.forEach((test, index) => {
        it(`test callback: ${index}`, (done) => {
            // given
            const provider = new FakeIpcProvider();
            web3.setProvider(provider);
            provider.injectResult(test.result);
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input, (error, result) => {
                assert.isNull(error);
                assert.strictEqual(test.formattedResult, result);

                done();
            });
        });

        it(`test promise: ${index}`, async () => {
            // given
            const provider = new FakeIpcProvider();
            web3.setProvider(provider);
            provider.injectResult(test.result);
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            const result = await web3.eth[method](test.input);
            assert.strictEqual(test.formattedResult, result);
        });

        it(`error test callback: ${index}`, (done) => {
            // given
            const provider = new FakeIpcProvider();
            web3.setProvider(provider);
            provider.injectError({
                message: test.result,
                code: -32603
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input, (error, result) => {
                assert.isUndefined(result);
                assert.strictEqual(test.formattedResult, error.message);

                done();
            });
        });

        it(`error test promise: ${index}`, async () => {
            // given
            const provider = new FakeIpcProvider();
            web3.setProvider(provider);
            provider.injectError({
                message: test.result,
                code: -32603
            });
            provider.injectValidation((payload) => {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            try {
                await web3.eth[method](test.input);
                assert.fail('Should have thrown');
            } catch (error) {
                assert.strictEqual(test.formattedResult, error.message);
            }
        });
    });
});
