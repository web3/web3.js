import Hex from '../Hex';

/**
 * Hex test
 */
describe('HexTest', () => {
    let hex;
    const error = {
        hex: () => 'err msg'
    };
    const initParams = {
        hex: undefined
    };

    beforeEach(() => {});

    it('constructor check', () => {
        hex = new Hex({hex: '0x0'}, error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('takes empty for empty hex', () => {
        hex = new Hex('empty', error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('takes string for constructor override', () => {
        hex = new Hex('0x12', error, initParams);

        expect(hex).toHaveProperty('error');
        expect(hex).toHaveProperty('props');
    });

    it('checks for strict hex', () => {
        const strict = new Hex('0x12', error, initParams).isStrict();
        const notStrict = new Hex('12', error, initParams).isStrict();

        expect(strict).toBe(true);
        expect(notStrict).toBe(false);
    });

    it('converts toString from string hex', () => {
        const tests = [
            {value: '1', expected: '0x1'},
            {value: '0x1', expected: '0x1'},
            {value: '0x01', expected: '0x01'},
            {value: '-1', expected: '-0x1'},
            {value: '-0x1', expected: '-0x1'},
            {value: '-0x01', expected: '-0x01'},
            {
                value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            },
            {
                value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {
                value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            },
            {
                value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
            },
            {value: '0', expected: '0x0'},
            {value: '0x0', expected: '0x0'},
            {value: '-0', expected: '-0x0'},
            {value: '-0x0', expected: '-0x0'}
        ];

        tests.forEach((test) => {
            expect(new Hex(test.value, error, initParams).toString()).toEqual(test.expected);
        });
    });
});
