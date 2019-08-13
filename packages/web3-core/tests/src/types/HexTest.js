import Hex from '../../../src/types/Hex';

// Mocks
jest.mock('');

/**
 * Hex test
 */
describe('HexTest', () => {
    it('calls the constructor and the string is prefixed with "0x"', () => {
        expect(new Hex('0x00').value).toEqual('00');
    });

    it('calls the constructor and the string is prefixed with "0X"', () => {
        expect(new Hex('0x00').value).toEqual('00');
    });

    it('calls the constructor with a invalid hex string', () => {
        try {
            new Hex('0xZ0');
        } catch (error) {
            expect(error).toEqual(new Error('The given value must be a valid HEX string.'));
        }
    });

    it('calls the toString method and adds the "0x" prefix', () => {
        expect(new Hex('0x00').toString()).toEqual('0x00');
    });

    it('calls the toNumber method and it returns the expected number', () => {
        expect(new Hex('0x1').toNumber()).toEqual(1);
    });

    it('calls the toNumberString method and it returns the expected string', () => {
        expect(new Hex('0x1').toNumberString()).toEqual('1');
    });

    it('calls the toBytes method and it returns the expected string', () => {
        expect(new Hex('0x48656c6c6f2124').toBytes()).toEqual([72, 101, 108, 108, 111, 33, 36]);
    });

    it('calls toAscii and returns the expected results', () => {
        const tests = [
            {value: '0x6d79537472696e67', expected: 'myString'},
            {value: '0x6d79537472696e6700', expected: 'myString\u0000'},
            {
                value:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c',
                expected:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB'
            }
        ];

        tests.forEach((test) => {
            expect(new Hex(test.value).toAscii()).toEqual(test.expected);
        });
    });

    it('calls toUTF8 and returns the expected results', () => {
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
            expect(new Hex(test.value).toUTF8()).toEqual(test.expected);
        });
    });

    it('calls fromUTF8 and returns the expected results', () => {
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
            expect(Hex.fromUTF8(test.value).toString()).toEqual(test.expected);
        });
    });

    it('calls fromAscii and returns the expected results', () => {
        const tests = [
            {value: 'myString', expected: '0x6d79537472696e67000000000000000000000000000000000000000000000000'},
            {value: 'myString\u0000', expected: '0x6d79537472696e67000000000000000000000000000000000000000000000000'},
            {
                value:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c'
            }
        ];

        tests.forEach((test) => {
            expect(Hex.fromAscii(test.value).toString()).toEqual(test.expected);
        });
    });

    it('calls rightPad and returns the expected value', () => {
        expect(Hex.rightPad('0x1', 32).toString()).toEqual('0x10000000000000000000000000000000');
    });

    it('calls leftPad and returns the expected value', () => {
        expect(Hex.leftPad('0x1', 32).toString()).toEqual('0x00000000000000000000000000000001');
    });

    it('calls fromNumber and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0x01'},
            {value: '21345678976543214567869765432145647586', expected: '0x100f073a3d694d13d1615dc9bc3097e2'},
            {value: '1', expected: '0x01'},
            {value: '0x1', expected: '0x01'},
            {value: '0x01', expected: '0x01'},
            {value: 15, expected: '0x0f'},
            {value: '15', expected: '0x0f'},
            {value: '0xf', expected: '0x0f'},
            {value: '0x0f', expected: '0x0f'},
            {value: -1, expected: '-0x01'},
            {value: '-1', expected: '-0x01'},
            {value: '-0x1', expected: '-0x01'},
            {value: '-0x01', expected: '-0x01'},
            {value: -15, expected: '-0x0f'},
            {value: '-15', expected: '-0x0f'},
            {value: '-0xf', expected: '-0x0f'},
            {value: '-0x0f', expected: '-0x0f'},
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
            {value: 0, expected: '0x00'},
            {value: '0', expected: '0x00'},
            {value: '0x0', expected: '0x00'},
            {value: -0, expected: '0x00'},
            {value: '-0', expected: '0x00'},
            {value: '-0x0', expected: '0x00'}
        ];

        tests.forEach((test) => {
            expect(Hex.fromNumber(test.value).toString()).toEqual(test.expected);
        });
    });

    it('calls fromBytes and returns the expected result', () => {
        expect(Hex.fromBytes([72, 101, 108, 108, 111, 33, 36]).toString()).toEqual('0x48656c6c6f2124');
    });

    it('calls isTopic and returns true', () => {
        expect(Hex.isTopic('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).toEqual(true);
    });

    it('calls isTopic and returns false', () => {
        expect(Hex.isTopic('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).toEqual(false);
    });

    it('calls isBloom and returns true', () => {
        expect(
            Hex.isBloom(
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
        ).toEqual(true);
    });

    it('calls isBloom and returns false', () => {
        expect(Hex.isBloom('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).toEqual(false);
    });
});
