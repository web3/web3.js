var chai = require('chai');
var assert = chai.assert;
var Method = require('../packages/web3-core-method');

describe('lib/web3/method', function () {
    describe('extractCallback', function () {
        it('should extract callback', function () {

            // given
            var method = new Method({name: 'something', call: 'eth_something'});
            var callback = function () { };
            var args = [1, callback]

            // when
            var result = method.extractCallback(args);

            // then
            assert.equal(args.length, 1);
            assert.equal(callback, result);
        });

        it('should extract callback created using newFunction', function () {

            // given
            var method = new Method({name: 'something', call: 'eth_something'});
            var callback = new Function ();
            var args = [1, callback]

            // when
            var result = method.extractCallback(args);

            // then
            assert.equal(args.length, 1);
            assert.equal(callback, result);
        });

        it('should not extract the callback', function () {

            // given
            var method = new Method({name: 'something', call: 'eth_something'});
            var args = [1, 2]

            // when
            var result = method.extractCallback(args);

            // then
            assert.equal(args.length, 2);
            assert.equal(result, null);
        });
    });
});

