import { assert } from 'chai';
import Method from '../packages/web3-core-method';

describe('lib/web3/method', () => {
    describe('formatOutput', () => {
        it('should format plain output', () => {
            // given
            const formatter = arg => `${arg}*`;

            const method = new Method({
                name: 'something',
                call: 'eth_something',
                outputFormatter: formatter
            });
            const args = '1';
            const expectedArgs = '1*';

            // when
            const result = method.formatOutput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should format plain output if array', () => {
            // given
            const formatter = arg => `${arg}*`;

            const method = new Method({
                name: 'something',
                call: 'eth_something',
                outputFormatter: formatter
            });
            const args = '1';
            const expectedArgs = ['1*', '1*'];

            // when
            const result = method.formatOutput([args, args]);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should format output arrays with the same formatter', () => {
            // given
            const formatter = arg => `${arg}*`;

            const method = new Method({
                name: 'something',
                call: 'eth_something',
                outputFormatter: formatter
            });
            const args = ['1', '2', '3'];
            const expectedArgs = ['1*', '2*', '3*'];

            // when
            const result = method.formatOutput(args);

            // then
            assert.deepEqual(result, expectedArgs);
        });

        it('should do nothing if there is no formatter', () => {
            // given
            const method = new Method({ name: 'something', call: 'eth_something' });
            const args = [1, 2, 3];

            // when
            const result = method.formatOutput(args);

            // then
            assert.deepEqual(result, args);
        });
    });
});
