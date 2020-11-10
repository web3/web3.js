var chai = require("chai");
var utils = require("../packages/web3-utils");

var assert = chai.assert;

var tests = [
    { value: "0x12345", expected: "12345" },
    { value: "0x123453456767890", expected: "123453456767890" },
    { value: "0xH", expected: "H" },
    { value: "H0x", expected: "H0x" },
    { value: "random", expected: "random" },
];

describe("lib/utils/utils", function () {
    describe("stripHexPrefix", function () {
        tests.forEach(function (test) {
            it(
                "should return " + test.expected + " for input " + test.value,
                function () {
                    assert.strictEqual(
                        utils.stripHexPrefix(test.value),
                        test.expected
                    );
                }
            );
        });

        it("should verify arg is string", function () {
            try {
                utils.stripHexPrefix(0x100000000000);
                assert.fail();
            } catch (error) {
                assert(
                    error.message.includes(
                        "function expects only string as an argument"
                    )
                );
            }
        });
    });
});
