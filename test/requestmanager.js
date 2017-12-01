import { assert } from 'chai';
import FakeHttpProvider from './helpers/FakeIpcProvider';
import requestManager from '../packages/web3-core-requestmanager';

// TODO: handling errors!
// TODO: validation of params!

describe('lib/web3/requestmanager', () => {
    describe('send', () => {
        it('should return expected result asynchronously', (done) => {
            const provider = new FakeHttpProvider();
            const manager = new requestManager.Manager(provider);
            const expected = 'hello_world';
            provider.injectResult(expected);

            manager.send({
                method: 'test',
                params: [1, 2, 3]
            }, (error, result) => {
                assert.equal(error, null);
                assert.equal(expected, result);
                done();
            });
        });
    });
});
