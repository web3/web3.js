// import * as CryptoJS from 'crypto-js';
// import cjsSha3 from 'crypto-js/sha3';
// import BN from 'bn.js';
// import {isBN, keccak256, toBN, getSignatureParameters} from '../../src';
//
// /**
//  * Utils test
//  */
// describe('UtilsTest', () => {
//     it('calls isBN and returns the expected results', () => {
//         const tests = [
//             {
//                 value: () => {},
//                 is: false
//             },
//             /* eslint-disable no-new-func */
//             {value: new Function(), is: false},
//             /* eslint-enable no-new-func */
//             {value: 'function', is: false},
//             {value: {}, is: false},
//             {value: String('hello'), is: false},
//             {value: new BN(0), is: true},
//             {value: 132, is: false},
//             {value: '0x12', is: false}
//         ];
//
//         tests.forEach((test) => {
//             expect(isBN(test.value)).toEqual(test.is);
//         });
//     });
//
//     describe('calls keccak256', () => {
//         it('should return keccak256 with hex prefix', () => {
//             expect(keccak256('test123')).toEqual(
//                 '0x' +
//                     cjsSha3('test123', {
//                         outputLength: 256
//                     }).toString()
//             );
//
//             expect(keccak256('test(int)')).toEqual(
//                 '0x' +
//                     cjsSha3('test(int)', {
//                         outputLength: 256
//                     }).toString()
//             );
//         });
//
//         it('should return keccak256 with hex prefix when hex input', () => {
//             const keccak256Hex = (value) => {
//                 if (value.length > 2 && value.substr(0, 2) === '0x') {
//                     value = value.substr(2);
//                 }
//                 value = CryptoJS.enc.Hex.parse(value);
//
//                 return cjsSha3(value, {
//                     outputLength: 256
//                 }).toString();
//             };
//
//             expect(keccak256('0x80')).toEqual('0x' + keccak256Hex('0x80'));
//
//             expect(keccak256('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')).toEqual(
//                 '0x' + keccak256Hex('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
//             );
//         });
//
//         it('should return keccak256 with hex prefix', () => {
//             const test = (value, expected) => {
//                 expect(keccak256(value)).toEqual(expected);
//             };
//
//             test('test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad');
//             test('test(int)', '0xf4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1');
//             test('0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421');
//             test(
//                 '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
//                 '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28'
//             );
//         });
//     });
//
//     it('calls toBN and returns the expected results', () => {
//         const tests = [
//             {value: 1, expected: '1'},
//             {value: '1', expected: '1'},
//             {value: '0x1', expected: '1'},
//             {value: '0x01', expected: '1'},
//             {value: 15, expected: '15'},
//             {value: '15', expected: '15'},
//             {value: '0xf', expected: '15'},
//             {value: '0x0f', expected: '15'},
//             {value: new BN('f', 16), expected: '15'},
//             {value: -1, expected: '-1'},
//             {value: '-1', expected: '-1'},
//             {value: '-0x1', expected: '-1'},
//             {value: '-0x01', expected: '-1'},
//             {value: -15, expected: '-15'},
//             {value: '-15', expected: '-15'},
//             {value: '-0xf', expected: '-15'},
//             {value: '-0x0f', expected: '-15'},
//             {
//                 value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
//                 expected: '115792089237316195423570985008687907853269984665640564039457584007913129639935'
//             },
//             {
//                 value: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
//                 expected: '115792089237316195423570985008687907853269984665640564039457584007913129639933'
//             },
//             {
//                 value: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
//                 expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639935'
//             },
//             {
//                 value: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
//                 expected: '-115792089237316195423570985008687907853269984665640564039457584007913129639933'
//             },
//             {value: 0, expected: '0'},
//             {value: '0', expected: '0'},
//             {value: '0x0', expected: '0'},
//             {value: -0, expected: '0'},
//             {value: '-0', expected: '0'},
//             {value: '-0x0', expected: '0'},
//             {value: new BN(0), expected: '0'}
//         ];
//
//         tests.forEach((test) => {
//             expect(toBN(test.value).toString(10)).toEqual(test.expected);
//         });
//     });
//
//     it('calls getSignatureParameters and returns the expected results', () => {
//         const tests = [
//             {
//                 value:
//                     '0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf7922c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc1b',
//                 r: '0x5763ab346198e3e6cc4d53996ccdeca0c941cb6cb70d671d97711c421d3bf792',
//                 s: '0x2c77ef244ad40e5262d1721bf9638fb06bab8ed3c43bfaa80d6da0be9bbd33dc',
//                 v: 27
//             }
//         ];
//
//         tests.forEach((test) => {
//             expect(getSignatureParameters(test.value).r).toEqual(test.r) &&
//                 expect(getSignatureParameters(test.value).s).toEqual(test.s) &&
//                 expect(getSignatureParameters(test.value).v).toEqual(test.v);
//         });
//     });
// });
