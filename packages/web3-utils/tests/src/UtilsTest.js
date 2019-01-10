import * as CryptoJS from 'crypto-js';
import cjsSha3 from 'crypto-js/sha3';
import BN from 'bn.js';
import {
    asciiToHex,
    checkAddressChecksum,
    fromWei,
    hexToNumberString,
    isAddress,
    isBN,
    numberToHex,
    sha3,
    toAscii,
    toBN,
    toHex,
    toTwosComplement,
    toUtf8,
    toWei,
    utf8ToHex,
    getSignatureParameters
} from '../../src';

/**
 * Utils test
 */
describe('UtilsTest', () => {
    it('calls asciiToHex and returns the expected results', () => {
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
            expect(asciiToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls numberToHex and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0x1'},
            {value: '21345678976543214567869765432145647586', expected: '0x100f073a3d694d13d1615dc9bc3097e2'},
            {value: '1', expected: '0x1'},
            {value: '0x1', expected: '0x1'},
            {value: '0x01', expected: '0x1'},
            {value: 15, expected: '0xf'},
            {value: '15', expected: '0xf'},
            {value: '0xf', expected: '0xf'},
            {value: '0x0f', expected: '0xf'},
            {value: -1, expected: '-0x1'},
            {value: '-1', expected: '-0x1'},
            {value: '-0x1', expected: '-0x1'},
            {value: '-0x01', expected: '-0x1'},
            {value: -15, expected: '-0xf'},
            {value: '-15', expected: '-0xf'},
            {value: '-0xf', expected: '-0xf'},
            {value: '-0x0f', expected: '-0xf'},
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
            {value: 0, expected: '0x0'},
            {value: '0', expected: '0x0'},
            {value: '0x0', expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: '-0', expected: '0x0'},
            {value: '-0x0', expected: '0x0'}
        ];

        tests.forEach((test) => {
            expect(numberToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls fromWei and returns the expected results', () => {
        expect(fromWei('1000000000000000000', 'wei')).toEqual('1000000000000000000');

        expect(fromWei('1000000000000000000', 'kwei')).toEqual('1000000000000000');

        expect(fromWei('1000000000000000000', 'mwei')).toEqual('1000000000000');

        expect(fromWei('1000000000000000000', 'gwei')).toEqual('1000000000');

        expect(fromWei('1000000000000000000', 'szabo')).toEqual('1000000');

        expect(fromWei('1000000000000000000', 'finney')).toEqual('1000');

        expect(fromWei('1000000000000000000', 'ether')).toEqual('1');

        expect(fromWei('1000000000000000000', 'kether')).toEqual('0.001');

        expect(fromWei('1000000000000000000', 'grand')).toEqual('0.001');

        expect(fromWei('1000000000000000000', 'mether')).toEqual('0.000001');

        expect(fromWei('1000000000000000000', 'gether')).toEqual('0.000000001');

        expect(fromWei('1000000000000000000', 'tether')).toEqual('0.000000000001');
    });

    it('calls isAddress and returns the expected results', () => {
        const tests = [
            {
                value: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {value: new Function(), is: false},
            /* eslint-enable */
            {value: 'function', is: false},
            {value: {}, is: false},
            {value: '0xc6d9d2cd449a754c494264e1809c50e34d64562b', is: true},
            {value: 'c6d9d2cd449a754c494264e1809c50e34d64562b', is: true},
            {value: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F', is: true},
            {value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false},
            {value: '0xe247a45c287191d435a8a5d72a7c8dc030451e9f', is: true},
            {value: '0xE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true},
            {value: '0XE247A45C287191D435A8A5D72A7C8DC030451E9F', is: true}
        ];

        tests.forEach((test) => {
            expect(isAddress(test.value)).toEqual(test.is);
        });
    });

    it('calls isBN and returns the expected results', () => {
        const tests = [
            {
                value: () => {},
                is: false
            },
            /* eslint-disable no-new-func */
            {value: new Function(), is: false},
            /* eslint-enable no-new-func */
            {value: 'function', is: false},
            {value: {}, is: false},
            {value: String('hello'), is: false},
            {value: new BN(0), is: true},
            {value: 132, is: false},
            {value: '0x12', is: false}
        ];

        tests.forEach((test) => {
            expect(isBN(test.value)).toEqual(test.is);
        });
    });

    it('calls checkAddressChecksum and returns the expected results', () => {
        const tests = [
            {value: '0x52908400098527886E0F7030069857D2E4169EE7', is: true},
            {value: '0x8617E340B3D01FA5F11F306F4090FD50E238070D', is: true},
            {value: '0xde709f2102306220921060314715629080e2fb77', is: true},
            {value: '0x27b1fdb04752bbc536007a920d24acb045561c26', is: true},
            {value: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', is: true},
            {value: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', is: true},
            {value: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', is: true},
            {value: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', is: true},
            {value: '0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', is: false},
            {value: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', is: false}
        ];

        tests.forEach((test) => {
            expect(checkAddressChecksum(test.value)).toEqual(test.is);
        });
    });

    /* eslint-disable jest/no-identical-title */
    describe('calls sha3', () => {
        it('should return sha3 with hex prefix', () => {
            expect(sha3('test123')).toEqual(
                '0x' +
                    cjsSha3('test123', {
                        outputLength: 256
                    }).toString()
            );

            expect(sha3('test(int)')).toEqual(
                '0x' +
                    cjsSha3('test(int)', {
                        outputLength: 256
                    }).toString()
            );
        });

        it('should return sha3 with hex prefix when hex input', () => {
            const sha3Hex = (value) => {
                if (value.length > 2 && value.substr(0, 2) === '0x') {
                    value = value.substr(2);
                }
                value = CryptoJS.enc.Hex.parse(value);

                return cjsSha3(value, {
                    outputLength: 256
                }).toString();
            };

            expect(sha3('0x80')).toEqual('0x' + sha3Hex('0x80'));

            expect(sha3('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')).toEqual(
                '0x' + sha3Hex('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
            );
        });

        it('should return sha3 with hex prefix', () => {
            const test = (v, e, o) => {
                expect(sha3(v, o)).toEqual(e);
            };

            test('test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad');
            test('test(int)', '0xf4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1');
            test('0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421');
            test(
                '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
                '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
            );
        });
    });
    /* eslint-enable jest/no-identical-title */

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
            expect(toAscii(test.value)).toEqual(test.expected);
        });
    });

    it('calls toBN and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '1'},
            {value: '1', expected: '1'},
            {value: '0x1', expected: '1'},
            {value: '0x01', expected: '1'},
            {value: 15, expected: '15'},
            {value: '15', expected: '15'},
            {value: '0xf', expected: '15'},
            {value: '0x0f', expected: '15'},
            {value: new BN('f', 16), expected: '15'},
            {value: -1, expected: '-1'},
            {value: '-1', expected: '-1'},
            {value: '-0x1', expected: '-1'},
            {value: '-0x01', expected: '-1'},
            {value: -15, expected: '-15'},
            {value: '-15', expected: '-15'},
            {value: '-0xf', expected: '-15'},
            {value: '-0x0f', expected: '-15'},
            {
                value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            },
            {
                value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '115792089237316195423570985008687907853269984665640564039457584007913129639933'
            },
            {
                value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639935'
            },
            {
                value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
                expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639933'
            },
            {value: 0, expected: '0'},
            {value: '0', expected: '0'},
            {value: '0x0', expected: '0'},
            {value: -0, expected: '0'},
            {value: '-0', expected: '0'},
            {value: '-0x0', expected: '0'},
            {value: new BN(0), expected: '0'}
        ];

        tests.forEach((test) => {
            expect(toBN(test.value).toString(10)).toEqual(test.expected);
        });
    });

    it('calls toHex and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0x1'},
            {value: '1', expected: '0x1'},
            {value: '0x1', expected: '0x1'},
            {value: '15', expected: '0xf'},
            {value: '0xf', expected: '0xf'},
            {value: -1, expected: '-0x1'},
            {value: '-1', expected: '-0x1'},
            {value: '-0x1', expected: '-0x1'},
            {value: '-15', expected: '-0xf'},
            {value: '-0xf', expected: '-0xf'},
            {value: '0x657468657265756d', expected: '0x657468657265756d'},
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
            {value: 0, expected: '0x0'},
            {value: '0', expected: '0x0'},
            {value: '0x0', expected: '0x0'},
            {value: -0, expected: '0x0'},
            {value: '-0', expected: '0x0'},
            {value: '-0x0', expected: '0x0'},
            {value: [1, 2, 3, {test: 'data'}], expected: '0x5b312c322c332c7b2274657374223a2264617461227d5d'},
            {value: {test: 'test'}, expected: '0x7b2274657374223a2274657374227d'},
            {value: '{"test": "test"}', expected: '0x7b2274657374223a202274657374227d'},
            {value: 'myString', expected: '0x6d79537472696e67'},
            {value: 'myString 34534!', expected: '0x6d79537472696e6720333435333421'},
            {value: new BN(15), expected: '0xf'},
            {
                value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/',
                expected: '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f'
            },
            {value: true, expected: '0x01'},
            {value: false, expected: '0x00'},
            {
                value:
                    'ff\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x66660300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'
            },
            {
                value:
                    '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
                expected:
                    '0x0300000035c3a8c386c3954c5d127cc29dc38ec2bec29e1a37c2abc29b05321128c390c297590a3c100000000000006521c39f642fc3b1c3b5c3ac0c3a7ac2a6c38ec2a6c2b1c3a7c2b7c3b7c38dc2a2c38bc39f07362ac28508c28ec297c3b1c29ec3b94331c38955c380c3a9321ac393c28642c28c'
            },
            {value: '내가 제일 잘 나가', expected: '0xeb82b4eab08020eca09cec9dbc20ec9e9820eb8298eab080'}
        ];

        tests.forEach((test) => {
            expect(toHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls hexToNumberString and returns the expected results', () => {
        expect(hexToNumberString('0x3e8')).toEqual('1000');

        expect(hexToNumberString('0x1f0fe294a36')).toEqual('2134567897654');

        // allow compatiblity
        expect(hexToNumberString(100000)).toEqual('100000');

        expect(hexToNumberString('100000')).toEqual('100000');
    });

    it('calls toTwosComplement and returns the expected results', () => {
        const tests = [
            {value: 1, expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '1', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '0x1', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: '0x01', expected: '0000000000000000000000000000000000000000000000000000000000000001'},
            {value: 15, expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '15', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '0xf', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: '0x0f', expected: '000000000000000000000000000000000000000000000000000000000000000f'},
            {value: new BN(0), expected: '0000000000000000000000000000000000000000000000000000000000000000'}
        ];

        tests.forEach((test) => {
            expect(toTwosComplement(test.value).replace('0x', '')).toEqual(test.expected);
        });
    });

    it('calls toUtf8 and returns the expected results', () => {
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
            expect(toUtf8(test.value)).toEqual(test.expected);
        });
    });

    it('calls toWei and returns the expected results', () => {
        expect(toWei('1', 'wei')).toEqual('1');

        expect(toWei('1', 'kwei')).toEqual('1000');

        expect(toWei('1', 'Kwei')).toEqual('1000');

        expect(toWei('1', 'babbage')).toEqual('1000');

        expect(toWei('1', 'mwei')).toEqual('1000000');

        expect(toWei('1', 'Mwei')).toEqual('1000000');

        expect(toWei('1', 'lovelace')).toEqual('1000000');

        expect(toWei('1', 'gwei')).toEqual('1000000000');

        expect(toWei('1', 'Gwei')).toEqual('1000000000');

        expect(toWei('1', 'shannon')).toEqual('1000000000');

        expect(toWei('1', 'szabo')).toEqual('1000000000000');

        expect(toWei('1', 'finney')).toEqual('1000000000000000');

        expect(toWei('1', 'ether')).toEqual('1000000000000000000');

        expect(toWei('1', 'kether')).toEqual('1000000000000000000000');

        expect(toWei('1', 'grand')).toEqual('1000000000000000000000');

        expect(toWei('1', 'mether')).toEqual('1000000000000000000000000');

        expect(toWei('1', 'gether')).toEqual('1000000000000000000000000000');

        expect(toWei('1', 'tether')).toEqual('1000000000000000000000000000000');

        expect(toWei('1', 'kwei')).toEqual(toWei('1', 'femtoether'));

        expect(toWei('1', 'szabo')).toEqual(toWei('1', 'microether'));

        expect(toWei('1', 'finney')).toEqual(toWei('1', 'milliether'));

        expect(toWei('1', 'milli')).toEqual(toWei('1', 'milliether'));

        expect(toWei('1', 'milli')).toEqual(toWei('1000', 'micro'));

        expect(() => {
            toWei(1, 'wei');
        }).toThrow('Please pass numbers as strings or BigNumber objects to avoid precision errors.');
    });

    it('calls utf8ToHex and returns the expected results', () => {
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
            expect(utf8ToHex(test.value)).toEqual(test.expected);
        });
    });

    it('calls getSignatureParameters and returns the expected results', () => {
        const tests = [
            {
                value: '0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf7922c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc1b',
                r: '0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf792',
                s: '0x2c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc',
                v: 27
            }
        ];

        tests.forEach((test) => {
            expect(getSignatureParameters(test.value).r).toEqual(test.r) &&
            expect(getSignatureParameters(test.value).s).toEqual(test.s) &&
            expect(getSignatureParameters(test.value).v).toEqual(test.v);

        });
    });
});
