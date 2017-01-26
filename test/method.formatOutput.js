var chai = require('chai');
var assert = chai.assert;
var Method = require('../packages/web3-core-method');

describe('lib/web3/method', function () {
    describe('formatOutput', function () {
        it('should format plain output', function () {

            // given
            var formatter = function (arg) {
                return arg + '*';
            };

            var method = new Method({
                name: 'something', call: 'eth_something',
                outputFormatter: formatter
            });
            var args = '1';
            var expectedArgs = '1*';

            // when
            var result = method.formatOutput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should format plain output if array', function () {

            // given
            var formatter = function (arg) {
                return arg + '*';
            };

            var method = new Method({
                name: 'something', call: 'eth_something',
                outputFormatter: formatter
            });
            var args = '1';
            var expectedArgs = ['1*', '1*'];

            // when
            var result = method.formatOutput([args, args]);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should format output arrays with the same formatter', function () {

            // given
            var formatter = function (arg) {
                return arg + '*';
            };

            var method = new Method({
                name: 'something', call: 'eth_something',
                outputFormatter: formatter
            });
            var args = ['1','2','3'];
            var expectedArgs = ['1*', '2*', '3*'];

            // when
            var result = method.formatOutput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should do nothing if there is no formatter', function () {

            // given
            var method = new Method({name: 'something', call: 'eth_something'});
            var args = [1,2,3];

            // when
            var result = method.formatOutput(args);

            // then
            assert.deepEqual(result, args);
        });
    });
});

