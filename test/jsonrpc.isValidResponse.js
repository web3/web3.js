import { assert } from 'chai';
import Jsonrpc from '../packages/web3-core-requestmanager/src/jsonrpc';

describe('jsonrpc', () => {
    describe('isValidResponse', () => {
        it('should validate basic jsonrpc response', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: 1,
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate basic undefined response', () => {
            // when
            const valid = Jsonrpc.isValidResponse(undefined);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response without jsonrpc field', () => {
            // given
            const response = {
                id: 1,
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with wrong jsonrpc version', () => {
            // given
            const response = {
                jsonrpc: '1.0',
                id: 1,
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response without id number', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with string id field', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: 'x',
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response with string id field but as number', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: '23',
                result: []
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response without result field', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: 1
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, false);
        });

        it('should validate jsonrpc response with result field === false', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: 1,
                result: false
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });

        it('should validate jsonrpc response with result field === 0', () => {
            // given
            const response = {
                jsonrpc: '2.0',
                id: 1,
                result: 0
            };

            // when
            const valid = Jsonrpc.isValidResponse(response);

            // then
            assert.equal(valid, true);
        });
    });
});
