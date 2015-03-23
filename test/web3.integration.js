var chai = require('chai');
var assert = chai.assert;
var web3 = require('../index');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

describe('web3', function () {
    describe('sha3', function () {
        it('should get simple sha3 payload synchronously', function () {
            
            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            var input = '0x12d';
            var expected = '0x31981';
            provider.injectResult(expected);
            var validation = function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'web3_sha3');
                assert.deepEqual(payload.params, [input]);
            };
            provider.injectValidation(validation);

            // when 
            var result = web3.sha3(input);
            
            // then 
            assert.equal(expected, result);
        });
    });
});

