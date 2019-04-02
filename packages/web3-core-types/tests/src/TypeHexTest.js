import * as Types from '../../src';

/**
 * Type Module Hex test
 */
describe('TypeModuleHexTest', () => {
    let obj;

    beforeEach(() => {});

    it('Interface - Hex', () => {
        const tests = [
            {value: '12', method: Types.Hex.fromString},
            {value: 12, method: Types.Hex.fromNumber},
            {value: 'test', method: Types.Hex.fromAscii},
            {value: 'tæst', method: Types.Hex.fromUtf8}
        ];

        tests.forEach((test) => {
            obj = new test.method(test.value); // eslint-disable-line new-cap
        });
    });

    it('Interface - Hex fromNumber', () => {
        const tests = [
            {value: 0, expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: 1, expected: '0x1'},
            {value: -1, expected: '-0x1'},
            {value: 15, expected: '0xf'},
            {value: -15, expected: '-0xf'}
        ];

        tests.forEach((test) => {
            obj = new Types.Hex.fromNumber(test.value); // eslint-disable-line new-cap

            expect(obj.toString()).toBe(test.expected);
        });
    });

    it('Interface - Hex fromAscii', () => {
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
            obj = new Types.Hex.fromAscii(test.value); // eslint-disable-line new-cap

            expect(obj.toString()).toBe(test.expected);
        });
    });

    it('Interface - Hex fromUtf8', () => {
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
            obj = new Types.Hex.fromUtf8(test.value); // eslint-disable-line new-cap

            expect(obj.toString()).toBe(test.expected);
        });
    });

    it('Interface - Hex fromBytes', () => {
        const tests = [
            {value: new Uint8Array([0]), expected: '0x00'},
            {value: new Uint8Array([15]), expected: '0x0f'},
            {value: new Uint8Array([255]), expected: '0xff'},
            {value: new Uint8Array([15, 0]), expected: '0x0f00'},
            {value: new Uint8Array([255, 15]), expected: '0xff0f'},
            {value: new Uint8Array([255, 255]), expected: '0xffff'}
        ];

        tests.forEach((test) => {
            obj = new Types.Hex.fromBytes(test.value); // eslint-disable-line new-cap

            expect(obj.toString()).toBe(test.expected);
        });
    });

    it('Mixin - Hex', () => {
        const tests = [
            {value: '0x12', is: [true, true]},
            {value: '0X', is: [false, false]},
            {value: '-0x1', is: [true, true]},
            {value: '12', is: [true, false]},
            {value: '-1', is: [true, false]},
            {value: '1.2', is: [false, false]}
        ];

        tests.forEach((test) => {
            expect(Types.Hex.isValid(test.value)).toBe(test.is[0]);
            expect(Types.Hex.isStrict(test.value)).toBe(test.is[1]);
        });
    });
});
