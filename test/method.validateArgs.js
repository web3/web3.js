import { assert } from 'chai';
import Method from '../packages/web3-core-method';
import errors from '../packages/web3-core-helpers/src/errors';

describe('lib/web3/method', () => {
    describe('validateArgs', () => {
        it('should pass', () => {
            // given
            const method = new Method({
                name: 'something',
                call: 'eth_something',
                params: 1
            });

            const args = [1];
            const args2 = ['heloas'];

            // when
            const test = () => {
                method.validateArgs(args);
            };
            const test2 = () => {
                method.validateArgs(args2);
            };

            // then
            assert.doesNotThrow(test);
            assert.doesNotThrow(test2);
        });

        it('should return call based on args', () => {
            // given
            const method = new Method({
                name: 'something',
                call: 'eth_something',
                params: 2
            });

            const args = [1];
            const args2 = ['heloas', '12', 3];

            // when
            const test = () => {
                method.validateArgs(args);
            };
            const test2 = () => {
                method.validateArgs(args2);
            };

            // then
            assert.throws(test, errors.InvalidNumberOfParams(1, 2, 'something').message);
            assert.throws(test2, errors.InvalidNumberOfParams(3, 2, 'something').message);
        });
    });
});
