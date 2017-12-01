import { assert } from 'chai';
import Jsonrpc from '../packages/web3-core-requestmanager/src/jsonrpc';

describe('lib/web3/jsonrpc', () => {
    describe('id', () => {
        it('should increment the id', () => {
            // given
            const method = 'm';

            // when
            const p1 = Jsonrpc.toPayload(method);
            const p2 = Jsonrpc.toPayload(method);

            // then
            assert.equal(p2.id, p1.id + 1);
        });
    });
});
