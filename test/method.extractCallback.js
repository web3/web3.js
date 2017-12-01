import { assert } from 'chai';
import Method from '../packages/web3-core-method';

describe('lib/web3/method', () => {
    describe('extractCallback', () => {
        it('should extract callback', () => {
            // given
            const method = new Method({ name: 'something', call: 'eth_something' });
            const callback = () => { };
            const args = [1, callback];

            // when
            const result = method.extractCallback(args);

            // then
            assert.equal(args.length, 1);
            assert.equal(callback, result);
        });

        it('should extract callback created using newFunction', () => {
            // given
            const method = new Method({ name: 'something', call: 'eth_something' });
            const callback = new Function(); // eslint-disable-line no-new-func
            const args = [1, callback];

            // when
            const result = method.extractCallback(args);

            // then
            assert.equal(args.length, 1);
            assert.equal(callback, result);
        });

        it('should not extract the callback', () => {
            // given
            const method = new Method({ name: 'something', call: 'eth_something' });
            const args = [1, 2];

            // when
            const result = method.extractCallback(args);

            // then
            assert.equal(args.length, 2);
            assert.equal(result, null);
        });
    });
});
