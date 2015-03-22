var chai   = require('chai');
var assert = chai.assert;
var utils = require('../../lib/utils/utils.js');

/* globals describe, it */

var tests = [
    { func: function () {}, is: true},
    { func: new Function(), is: true},
    { func: 'function', is: false},
    { func: {}, is: false}
];

describe('utils', function () {
    describe('isFunction', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.func + ' is function: ' + test.is, function () {
                assert.equal(utils.isFunction(test.func), test.is);
            });
        });   
    });
});

