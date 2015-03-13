var chai    = require('chai');
var expect  = chai.expect;
var jsonrpc = require('../../lib/web3/jsonrpc');

/* globals describe, it */

describe('jsonrpc', function () {
    describe('toPayload', function () {
        it('should create basic payload', function () {

            // given 
            var method = 'helloworld';

            // when
            var payload = jsonrpc.toPayload(method);

            // then
            expect(payload.jsonrpc).to.equal('2.0');
            expect(payload.method).to.equal(method);
            expect(payload.params instanceof Array).to.equal(true);
            expect(payload.params.length).to.equal(0);
            expect(typeof payload.id).to.equal('number');
        });

        it('should create payload with params', function () {

            // given 
            var method = 'helloworld1';
            var params = [123, 'test'];

            // when
            var payload = jsonrpc.toPayload(method, params);

            // then
            expect(payload.jsonrpc).to.equal('2.0');
            expect(payload.method).to.equal(method);
            expect(payload.params.length).to.equal(2);
            expect(payload.params[0]).to.equal(params[0]);
            expect(payload.params[1]).to.equal(params[1]);
            expect(typeof payload.id).to.equal('number');
        });
    });
});
