var chai      = require('chai');
var expect    = chai.expect;
var BigNumber = require('bignumber.js');
var abi       = require('../../lib/solidity/abi.js');
var clone     = function(object) {
    return JSON.parse(JSON.stringify(object));
};

/* globals describe, it */

var description = [{
    "name": "test",
    "type": "function",
    "inputs": [{
        "name": "a",
        "type": "uint256"
    }],
    "outputs": [{
        "name": "d",
        "type": "uint256"
    }]
}];

describe('abi', function() {
    describe('inputParser', function() {
        it('should parse input uint', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "uint"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");


        });

        it('should parse input uint128', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "uint128"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");

        });

        it('should parse input uint256', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "uint256"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");

        });

        it('should parse input int', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(parser.test(-1)).equal("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            expect(parser.test(-2)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
            expect(parser.test(-16)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");
        });

        it('should parse input int128', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int128"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(parser.test(-1)).equal("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            expect(parser.test(-2)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
            expect(parser.test(-16)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");
        });

        it('should parse input int256', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int256"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(10)).equal("000000000000000000000000000000000000000000000000000000000000000a");
            expect(parser.test(-1)).equal("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            expect(parser.test(-2)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
            expect(parser.test(-16)).equal("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0");
            expect(
                parser.test("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );

            expect(
                parser.test(new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16))).equal(
                "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
            expect(parser.test(0.1)).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test(3.9)).equal("0000000000000000000000000000000000000000000000000000000000000003");
            expect(parser.test('0.1')).equal("0000000000000000000000000000000000000000000000000000000000000000");
            expect(parser.test('3.9')).equal("0000000000000000000000000000000000000000000000000000000000000003");
        });

        it('should parse input bool', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: 'bool'
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test(true)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.test(false)).equal("0000000000000000000000000000000000000000000000000000000000000000");
        });

        it('should parse input address', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "address"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test("0x407d73d8a49eeb85d32cf465507dd71d507100c1")).equal("000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c1");

        });

        it('should use proper method name', function() {

            // given
            var d = clone(description);
            d[0].name = 'helloworld(int)';
            d[0].inputs = [{
                type: "int"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.helloworld(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(parser.helloworld['int'](1)).equal("0000000000000000000000000000000000000000000000000000000000000001");

        });

        it('should parse multiple methods', function() {

            // given
            var d = [{
                name: "test",
                type: "function",
                inputs: [{
                    type: "int"
                }],
                outputs: [{
                    type: "int"
                }]
            }, {
                name: "test2",
                type: "function",
                inputs: [{
                    type: "bytes"
                }],
                outputs: [{
                    type: "bytes"
                }]
            }];

            // when
            var parser = abi.inputParser(d);

            //then
            expect(parser.test(1)).equal("0000000000000000000000000000000000000000000000000000000000000001");
            expect(
                parser.test2('hello')).equal(
                "000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
            );

        });

        it('should parse input array of ints', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int[]"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(
                parser.test([5, 6])).equal(
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000005" +
                "0000000000000000000000000000000000000000000000000000000000000006"
            );
        });

        it('should parse an array followed by an int', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int[]"
            }, {
                type: "int"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(
                parser.test([5, 6], 3)).equal(
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000003" +
                "0000000000000000000000000000000000000000000000000000000000000005" +
                "0000000000000000000000000000000000000000000000000000000000000006"
            );
        });

        it('should parse an int followed by an array', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int"
            }, {
                type: "int[]"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(
                parser.test(3, [5, 6])).equal(
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000003" +
                "0000000000000000000000000000000000000000000000000000000000000005" +
                "0000000000000000000000000000000000000000000000000000000000000006"
            );
        });

        it('should parse mixture of arrays and ints', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: "int"
            }, {
                type: "int[]"
            }, {
                type: "int"
            }, {
                type: "int[]"
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(
                parser.test(3, [5, 6, 1, 2], 7, [8, 9])).equal(
                "0000000000000000000000000000000000000000000000000000000000000004" +
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000003" +
                "0000000000000000000000000000000000000000000000000000000000000007" +
                "0000000000000000000000000000000000000000000000000000000000000005" +
                "0000000000000000000000000000000000000000000000000000000000000006" +
                "0000000000000000000000000000000000000000000000000000000000000001" +
                "0000000000000000000000000000000000000000000000000000000000000002" +
                "0000000000000000000000000000000000000000000000000000000000000008" +
                "0000000000000000000000000000000000000000000000000000000000000009"
            );
        });

        it('should parse input real', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: 'real'
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test([1]), "0000000000000000000000000000000100000000000000000000000000000000");
            expect(parser.test([2.125]), "0000000000000000000000000000000220000000000000000000000000000000");
            expect(parser.test([8.5]), "0000000000000000000000000000000880000000000000000000000000000000");
            expect(parser.test([-1]), "ffffffffffffffffffffffffffffffff00000000000000000000000000000000");
        });

        it('should parse input ureal', function() {

            // given
            var d = clone(description);

            d[0].inputs = [{
                type: 'ureal'
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(parser.test([1])).equal("0000000000000000000000000000000100000000000000000000000000000000");
            expect(parser.test([2.125])).equal("0000000000000000000000000000000220000000000000000000000000000000");
            expect(parser.test([8.5])).equal("0000000000000000000000000000000880000000000000000000000000000000");
        });

        it('should throw an incorrect type error', function() {

            // given
            var d = clone(description);
            d[0].inputs = [{
                type: 'uin'
            }];

            // when
            var parser = abi.inputParser(d);

            // then
            expect(function() {
                parser.test('0x')
            }).to.throw(/parser does not support type/);
        });
    });
});
