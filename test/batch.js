var chai = require('chai');
var assert = chai.assert;
var web3 = require('../index');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

describe('lib/web3/batch', function () {
    describe('execute', function () {
        it('should execute batch request', function (done) {
            
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            web3.reset();

            var result = '0x126';
            var result2 = '0x127';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.equal(result, r);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.equal(result2, r);
                done();
            };

            var batch = web3.createBatch(); 
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });
    });
});

