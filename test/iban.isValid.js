var chai = require('chai');
var Iban = require('../lib/web3/iban.js');
var assert = chai.assert;

var tests = [
    { obj: function () {}, is: false},
    { obj: new Function(), is: false},
    { obj: 'function', is: false},
    { obj: {}, is: false},
    { obj: '[]', is: false},
    { obj: '[1, 2]', is: false},
    { obj: '{}', is: false},
    { obj: '{"a": 123, "b" :3,}', is: false},
    { obj: '{"c" : 2}', is: false},
    { obj: 'XE81ETHXREGGAVOFYORK', is: true},
    { obj: 'XE82ETHXREGGAVOFYORK', is: false}, // control number is invalid
    { obj: 'XE81ETCXREGGAVOFYORK', is: false},
    { obj: 'XE81ETHXREGGAVOFYORKD', is: false},
    { obj: 'XE81ETHXREGGaVOFYORK', is: false},
    { obj: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: true},
    { obj: 'XE7438O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: false}, // control number is invalid
    { obj: 'XD7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', is: false},
    { obj: 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO', is: true}
];

describe('lib/web3/iban', function () {
    describe('isValid', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.obj + ' is iban: ' + test.is, function () {
                assert.equal(Iban.isValid(test.obj), test.is);
            });
        });   
    });
});

