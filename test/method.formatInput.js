var chai = require('chai');
var assert = chai.assert;
var Method = require('../packages/web3-core-method');

describe('lib/web3/method', function () {
    describe('formatInput', function () {
        it('should format plain input', function () {

            // given
            var star = function (arg) {
                return arg + '*';
            };

            var method = new Method({
                name: 'something', call: 'eth_something',
                inputFormatter: [star, star, star]
            });
            var args = ['1','2','3'];
            var expectedArgs = ['1*', '2*', '3*'];

            // when
            var result = method.formatInput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should do nothing if there is no formatter', function () {

            // given
            var method = new Method({name: 'something', call: 'eth_something'});
            var args = [1,2,3];

            // when
            var result = method.formatInput(args);

            // then
            assert.deepEqual(result, args);
        });
    });
});

