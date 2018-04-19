import {assert} from 'chai';
import SandboxedModule from 'sandboxed-module';
import xhr2 from './helpers/FakeXHR2';

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var HttpProvider = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        xhr2
        // 'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
});

describe('web3-providers-http', function () {
    describe('prepareRequest', function () {
        it('should set request header', function () {
            var provider = new HttpProvider('http://localhost:8545', 0 , [{name: 'Access-Control-Allow-Origin',  value: '*'}]);
            var result = provider._prepareRequest();

            assert.equal(typeof result, 'object');
            assert.equal(result.headers['Access-Control-Allow-Origin'], '*');
        });
    });

    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.send({}, function (err, result) {
                assert.equal(typeof result, 'object');
                done();
            });
        });
    });
});
