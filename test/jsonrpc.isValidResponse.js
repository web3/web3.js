var assert = require('assert');
var Jsonrpc = require('../packages/web3-core-requestmanager').Jsonrpc;

describe('jsonrpc', function () {
    describe('isValidResponse', function () {
        it('should validate basic jsonrpc response', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: 1,
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate basic undefined response', function () {

            // given
            var response = undefined;

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response without jsonrpc field', function () {

            // given
            var response = {
                id: 1,
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with wrong jsonrpc version', function () {

            // given
            var response = {
                jsonrpc: '1.0',
                id: 1,
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response without id number', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with string id field', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: 'x',
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response with string id field but as number', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: '23',
                result: []
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response without result field', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: 1
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with result field === false', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: 1,
                result: false
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response with result field === 0', function () {

            // given
            var response = {
                jsonrpc: '2.0',
                id: 1,
                result: 0
            };

            // when
            var valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });
    });
});
