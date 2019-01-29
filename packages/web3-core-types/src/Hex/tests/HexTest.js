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

    it('convert to bytes', () => {
        const tests = [
            {value: '1', expected: 1},
            {value: '0x1', expected: 1},
            {value: '0x01', expected: 1},
            {value: '0xf', expected: 15},
            {value: '-1', expected: 1},
            {value: '0xff', expected: 255},
            {value: '0x0ff', expected: 255}
        ];

        tests.forEach((test) => {
            const bytes = new Hex(test.value, error, initParams).toBytes();

            expect(bytes.reduce((v, acc) => acc + v, 0)).toBe(test.expected);
        });
    });

    it('convert to utf8', () => {
        const tests = [
            {
                value: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f',
                expected: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'
            },
            {value: '0x6d79537472696e67', expected: 'myString'},
            {value: '0x6d79537472696e6700', expected: 'myString'},
            {value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value'},
            {
                value: '0x000000000000000000000000000000000000657870656374000065642076616c7565',
                expected: 'expect\u0000\u0000ed value'
            }
        ];

        tests.forEach((test) => {
            const utf8 = new Hex(test.value, error, initParams).toUtf8();

            expect(utf8).toBe(test.expected);
        });
    });

    it('convert to ascii', () => {
        const tests = [
            {expected: 'myString', value: '0x6d79537472696e67'},
            {expected: 'myString\u0000', value: '0x6d79537472696e6700'},
            {
                expected:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                value:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'
            }
        ];

        tests.forEach((test) => {
            const ascii = new Hex(test.value, error, initParams).toAscii();

            expect(ascii).toBe(test.expected);
        });
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
