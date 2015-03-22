var chai = require('chai');
var assert = chai.assert;
var Method = require('../lib/web3/method');

describe('method', function () {
    describe('formatInput', function () {
        it('should format plain input', function () {
            
            // given
            var formatter = function (args) {
                return args.map(function (arg) {
                    return arg + '*';
                });
            };
            
            var method = new Method({
                inputFormatter: formatter
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
            var method = new Method({});
            var args = [1,2,3];

            // when
            var result = method.formatInput(args);
            
            // then
            assert.deepEqual(result, args);
        });
    });
});

