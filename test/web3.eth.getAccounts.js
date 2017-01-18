var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'getAccounts';
var call = 'eth_accounts';

var tests = [{
    result: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae'],
    formattedResult: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    call: call
},
{
    result: ['0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    formattedResult: ['0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    call: call
}];

describe('web3.eth', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('property test: ' + index, function (done) {

                // given
                var provider = new FakeHttpProvider();
                eth.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, []);
                });

                // when
                var result = eth[method](function(err, result){

                    // then
                    assert.deepEqual(test.formattedResult, result);

                    done();
                });

            });
        });
    });
});

