import { assert } from 'chai';
import Method from '../packages/web3-core-method';

describe('lib/web3/method', () => {
    describe('getCall', () => {
        it('should return call name', () => {
            // given
            const call = 'hello_call_world';
            const method = new Method({
                name: 'something',
                call
            });

            // when
            const result = method.getCall();

            // then
            assert.equal(call, result);
        });

        it('should return call based on args', () => {
            // given
            const call = args => (args ? args.length.toString() : '0');

            const method = new Method({
                name: 'something',
                call
            });

            // when
            const r0 = method.getCall();
            const r1 = method.getCall([1]);
            const r2 = method.getCall([1, 2]);

            // then
            assert.equal(r0, '0');
            assert.equal(r1, '1');
            assert.equal(r2, '2');
        });
    });
});
