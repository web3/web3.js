var chai    = require('chai');
var expect  = chai.expect;
var jsonrpc = require('../../lib/web3/jsonrpc');

/* globals describe, it */

describe('jsonrpc', function () {
    describe('toBatchPayload', function () {
        it('should create basic batch payload', function () {
            
            // given 
            var messages = [{
                method: 'helloworld'
            }, {
                method: 'test2',
                params: [1]
            }];

            // when
            var payload = jsonrpc.toBatchPayload(messages);

            // then
            expect(payload).is.an('Array');
            expect(payload.length).equal(2);
            expect(payload[0].jsonrpc).equal('2.0');
            expect(payload[1].jsonrpc).equal('2.0');
            expect(payload[0].method).equal('helloworld');
            expect(payload[1].method).equal('test2');
            expect(payload[0].params).is.an('Array');
            expect(payload[1].params).length(1);
            expect(payload[1].params[0]).equal(1);
            expect(payload[0].id).is.a('number');
            expect(payload[1].id).is.a('number');
            expect(payload[0].id + 1).equal(payload[1].id);
        });
        
        it('should create batch payload for empty input array', function () {
            
            // given 
            var messages = [];

            // when
            var payload = jsonrpc.toBatchPayload(messages);

            // then
            expect(payload).is.an('Array');
            expect(payload).length(0);
        });
    });
});
