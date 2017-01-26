var chai = require('chai');
var assert = chai.assert;
var Method = require('../packages/web3-core-method');
var errors = require('../packages/web3-core-helpers/src/errors');

describe('lib/web3/method', function () {
    describe('validateArgs', function () {
        it('should pass', function () {

            // given
            var method = new Method({
                name: 'something', call: 'eth_something',
                params: 1
            });

            var args = [1];
            var args2 = ['heloas'];

            // when
            var test = function () { method.validateArgs(args); };
            var test2 = function () { method.validateArgs(args2); };

            // then
            assert.doesNotThrow(test);
            assert.doesNotThrow(test2);
        });

        it('should return call based on args', function () {

            // given
            var method = new Method({
                name: 'something',
                call: 'eth_something',
                params: 2
            });

            var args = [1];
            var args2 = ['heloas', '12', 3];

            // when
            var test = function () { method.validateArgs(args); };
            var test2 = function () { method.validateArgs(args2); };

            // then
            assert.throws(test, errors.InvalidNumberOfParams(1, 2, 'something').message);
            assert.throws(test2, errors.InvalidNumberOfParams(3, 2, 'something').message);
        });
    });
});
