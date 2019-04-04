import Hex from '../Hex';

/**
 * Hex test
 */
describe('HexTest', () => {
    it('constructor check', () => {
        expect(() => new Hex({hex: '0x0'})).not.toThrow();
    });
    
    it('has type property', () => {
        expect(new Hex(0).isHex).toBeTruthy();
    });

    it('takes empty for empty hex', () => {
        expect(() => new Hex('empty')).not.toThrow();
    });

    it('takes string for constructor override', () => {
        expect(() => new Hex('0x12')).not.toThrow();
    });

    it('checks for strict hex', () => {
        const strict = Hex.isStrict('0x12');
        const notStrict = Hex.isStrict('12');

        expect(strict).toBeTruthy();
        expect(notStrict).toBeFalsy();
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
            expect(new Hex(test.value).toBytes().reduce((v, acc) => acc + v, 0)).toBe(test.expected);
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
            expect(new Hex(test.value).toUtf8()).toBe(test.expected);
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
            expect(new Hex(test.value).toAscii()).toEqual(test.expected);
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
            expect(new Hex(test.value).toString()).toEqual(test.expected);
        });
    });
    
    it('creates hex from a number', () => {
        const tests = [
            {value: 0, expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: 1, expected: '0x1'},
            {value: -1, expected: '-0x1'},
            {value: 15, expected: '0xf'},
            {value: -15, expected: '-0xf'}
        ];

        tests.forEach((test) => {
            expect(Hex.fromNumber(test.value).toString()).toBe(test.expected);
        });
    });

    it('creates hex from ascii', () => {
        const tests = [
            {value: 'myString', expected: '0x6d79537472696e67'},
            {value: 'myString\u0000', expected: '0x6d79537472696e6700'},
            {
                value:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'
            }
        ];

        tests.forEach((test) => {
            expect(Hex.fromAscii(test.value).toString()).toBe(test.expected);
        });
    });

    it('creates hex from utf8', () => {
        const tests = [
            {
                value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/',
                expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f'
            },
            {value: 'myString', expected: '0x6d79537472696e67'},
            {value: 'myString\u0000', expected: '0x6d79537472696e67'},
            {value: 'expected value\u0000\u0000\u0000', expected: '0x65787065637465642076616c7565'},
            {value: 'expect\u0000\u0000ed value\u0000\u0000\u0000', expected: '0x657870656374000065642076616c7565'},
            {
                value: '我能吞下玻璃而不伤身体。',
                expected: '0xe68891e883bde5909ee4b88be78ebbe79283e8808ce4b88de4bca4e8baabe4bd93e38082'
            },
            {
                value: '나는 유리를 먹을 수 있어요. 그래도 아프지 않아요',
                expected:
                    '0xeb8298eb8a9420ec9ca0eba6aceba5bc20eba8b9ec9d8420ec889820ec9e88ec96b4ec9a942e20eab7b8eb9e98eb8f8420ec9584ed9484eca78020ec958aec9584ec9a94'
            }
        ];

        tests.forEach((test) => {
            expect(Hex.fromUtf8(test.value).toString()).toBe(test.expected);
        });
    });

    it('creates hex from byte array', () => {
        const tests = [
            {value: new Uint8Array([0]), expected: '0x00'},
            {value: new Uint8Array([15]), expected: '0x0f'},
            {value: new Uint8Array([255]), expected: '0xff'},
            {value: new Uint8Array([15, 0]), expected: '0x0f00'},
            {value: new Uint8Array([255, 15]), expected: '0xff0f'},
            {value: new Uint8Array([255, 255]), expected: '0xffff'}
        ];

        tests.forEach((test) => {
            expect(Hex.fromBytes(test.value).toString()).toBe(test.expected);
        });
    });
    
    it('throws an error for prop name and value', () => {
        expect(() => new Hex("0x0")._throw('hex',null)).toThrow();
    });
});
