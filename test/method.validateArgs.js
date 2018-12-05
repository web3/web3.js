var chai = require('chai');
var assert = chai.assert;
var Method = require('../lib/web3/method');
var errors = require('../lib/web3/errors');

describe('lib/web3/method', function () {
    describe('validateArgs', function () {
        it('should pass', function () {
            
            // given
            var method = new Method({
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
            var methodName = 'testMethod';
            var method = new Method({
                name: methodName,
                params: 2
            });

            var args = [1];
            var args2 = ['heloas', '12', 3];

            // when
            var test = function () { method.validateArgs(args); };
            var test2 = function () { method.validateArgs(args2); };
            
            // then
            assert.throws(test, errors.InvalidNumberOfRPCParams(methodName).message);
            assert.throws(test2, errors.InvalidNumberOfRPCParams(methodName).message);
        });
    });
});
