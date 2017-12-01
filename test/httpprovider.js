import { assert } from 'chai';
import SandboxedModule from 'sandboxed-module';
import xhr2 from './helpers/FakeXHR2';

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
const HttpProvider = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        xhr2
    },
    singleOnly: true
});

describe('web3-providers-http', () => {
    describe('send', () => {
        it('should send basic async request', (done) => {
            const provider = new HttpProvider();

            provider.send({}, (_err, result) => {
                assert.equal(typeof result, 'object');
                done();
            });
        });
    });
});
