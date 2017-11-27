import { assert } from 'chai';
import Method from '../packages/web3-core-method';

describe('lib/web3/method', () => {
    describe('formatInput', () => {
        it('should format plain input', () => {
            // given
            const star = arg => `${arg}*`;

            const method = new Method({
                name: 'something',
                call: 'eth_something',
                inputFormatter: [star, star, star]
            });
            const args = ['1', '2', '3'];
            const expectedArgs = ['1*', '2*', '3*'];

            // when
            const result = method.formatInput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should do nothing if there is no formatter', () => {
            // given
            const method = new Method({ name: 'something', call: 'eth_something' });
            const args = [1, 2, 3];

            // when
            const result = method.formatInput(args);

            // then
            assert.deepEqual(result, args);
        });
    });
});
