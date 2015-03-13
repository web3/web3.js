var chai = require('chai');
var assert = chai.assert;
//var expect = chai.expect;
var httpProvider = require('../../lib/web3/httpprovider');
var u = require('../test.utils.js');

/* globals it, describe, before */

describe('httpprovider', function () {
    describe('methods', function () {
        var h = new httpProvider(null);
        u.methodExists(h, 'send');
    });

    describe('methods', function () {
        var h;
        before(function () {
            h = new httpProvider(null);
        });

        it('constructs properly', function () {
            assert.equal(h.name, 'HTTP');
            assert.equal(h.host, 'http://localhost:8080');
            assert.property(h, 'handlers');
            assert.isArray(h.handlers);
        });
    });
});
