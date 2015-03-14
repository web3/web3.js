var chai = require('chai');
var expect = chai.expect;
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
            expect(h.name).equal('HTTP');
            expect(h.host).equal('http://localhost:8080');
            expect(h).has.property('handlers');
            expect(h.handlers).is.an('Array');
        });
    });
});
