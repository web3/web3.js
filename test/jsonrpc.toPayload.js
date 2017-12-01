import { assert } from 'chai';
import Jsonrpc from '../packages/web3-core-requestmanager/src/jsonrpc';

describe('jsonrpc', () => {
    describe('toPayload', () => {
        it('should create basic payload', () => {
            // given
            const method = 'helloworld';

            // when
            const payload = Jsonrpc.toPayload(method);

            // then
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, method);
            assert.equal(Array.isArray(payload.params), true);
            assert.equal(payload.params.length, 0);
            assert.equal(typeof payload.id, 'number');
        });

        it('should create payload with params', () => {
            // given
            const method = 'helloworld1';
            const params = [123, 'test'];

            // when
            const payload = Jsonrpc.toPayload(method, params);

            // then
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, method);
            assert.equal(payload.params.length, 2);
            assert.equal(payload.params[0], params[0]);
            assert.equal(payload.params[1], params[1]);
            assert.equal(typeof payload.id, 'number');
        });
    });
});
