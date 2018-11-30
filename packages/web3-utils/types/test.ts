/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file test.ts - please do not worry about the red underlines, we need to test for bad types
 * so we are passing in bad types on purpose
 * @author Josh Stevens <joshstevens19@hotmail.co.uk>
 * @date 2018
 */

import {
isBN,
BN,
isBigNumber,
toBN,
toTwosComplement,
isAddress,
isHex,
isHexStrict,
asciiToHex,
hexToAscii,
toAscii,
bytesToHex,
numberToHex,
checkAddressChecksum,
fromAscii,
fromDecimal,
fromUtf8,
fromWei,
hexToBytes,
hexToNumber,
hexToNumberString,
hexToString,
hexToUtf8,
keccak256,
padLeft,
leftPad,
rightPad,
padRight,
sha3,
randomHex,
utf8ToHex,
stringToHex,
toChecksumAddress,
toDecimal,
toHex,
toUtf8,
toWei,
isBloom,
isTopic,
_fireError,
_jsonInterfaceMethodToString,
_flattenTypes,
soliditySha3,
getUnitValue,
unitMap,
testAddress,
testTopic
} from 'utils';

const bigNumber = new BN(3);

// isBN Tests

isBN(7); // $ExpectType boolean
isBN('4325'); // $ExpectType boolean
// $ExpectError
isBN({});
// $ExpectError
isBN(true);
// $ExpectError
isBN(bigNumber);
// $ExpectError
isBN(['string']);
// $ExpectError
isBN([4]);
// $ExpectError
isBN(null);
// $ExpectError
isBN(undefined);

// isBigNumber Tests

isBigNumber(bigNumber); // $ExpectType boolean

// $ExpectError
isBigNumber(7);
// $ExpectError
isBigNumber('4325');
// $ExpectError
isBigNumber({});
// $ExpectError
isBigNumber(true);
// $ExpectError
isBigNumber(['string']);
// $ExpectError
isBigNumber([4]);
// $ExpectError
isBigNumber(null);
// $ExpectError
isBigNumber(undefined);

// toBN Tests

toBN(4); // $ExpectType BN
toBN('443'); // $ExpectType BN

// $ExpectError
toBN({});
// $ExpectError
toBN(true);
// $ExpectError
toBN(['string']);
// $ExpectError
toBN([4]);
// $ExpectError
toBN(null);
// $ExpectError
toBN(undefined);

// toTwosComplement Tests

toTwosComplement(4); // $ExpectType string
toTwosComplement('443'); // $ExpectType string
toTwosComplement(bigNumber); // $ExpectType string

// $ExpectError
toTwosComplement({});
// $ExpectError
toTwosComplement(true);
// $ExpectError
toTwosComplement(['string']);
// $ExpectError
toTwosComplement([4]);
// $ExpectError
toTwosComplement(null);
// $ExpectError
toTwosComplement(undefined);

// isAddress Tests

isAddress('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType boolean

// $ExpectError
isAddress(4);
// $ExpectError
isAddress(bigNumber);
// $ExpectError
isAddress({});
// $ExpectError
isAddress(true);
// $ExpectError
isAddress(['string']);
// $ExpectError
isAddress([4]);
// $ExpectError
isAddress(null);
// $ExpectError
isAddress(undefined);

// isHex Tests

isHex('0xc1912'); // $ExpectType boolean
isHex(345) // $ExpectType boolean

// $ExpectError
isHex(bigNumber);
// $ExpectError
isHex({});
// $ExpectError
isHex(true);
// $ExpectError
isHex(['string']);
// $ExpectError
isHex([4]);
// $ExpectError
isHex(null);
// $ExpectError
isHex(undefined);

// isHexStrict Tests

isHexStrict('0xc1912'); // $ExpectType boolean
isHexStrict(345) // $ExpectType boolean

// $ExpectError
isHexStrict(bigNumber);
// $ExpectError
isHexStrict({});
// $ExpectError
isHexStrict(true);
// $ExpectError
isHexStrict(['string']);
// $ExpectError
isHexStrict([4]);
// $ExpectError
isHexStrict(null);
// $ExpectError
isHexStrict(undefined);

// asciiToHex Tests

asciiToHex('I have 100!'); // $ExpectType string

// $ExpectError
asciiToHex(345);
// $ExpectError
asciiToHex(bigNumber);
// $ExpectError
asciiToHex({});
// $ExpectError
asciiToHex(true);
// $ExpectError
asciiToHex(['string']);
// $ExpectError
asciiToHex([4]);
// $ExpectError
asciiToHex(null);
// $ExpectError
asciiToHex(undefined);

// hexToAscii Tests

hexToAscii('0x4920686176652031303021'); // $ExpectType string

// $ExpectError
hexToAscii(345);
// $ExpectError
hexToAscii(bigNumber);
// $ExpectError
hexToAscii({});
// $ExpectError
hexToAscii(true);
// $ExpectError
hexToAscii(['string']);
// $ExpectError
hexToAscii([4]);
// $ExpectError
hexToAscii(null);
// $ExpectError
hexToAscii(undefined);

// toAscii Tests

toAscii('0x4920686176652031303021'); // $ExpectType string

// $ExpectError
toAscii(345);
// $ExpectError
toAscii(bigNumber);
// $ExpectError
toAscii({});
// $ExpectError
toAscii(true);
// $ExpectError
toAscii(['string']);
// $ExpectError
toAscii([4]);
// $ExpectError
toAscii(null);
// $ExpectError
toAscii(undefined);

// bytesToHex Tests

bytesToHex([ 72, 101, 108, 108, 111, 33, 36 ]); // $ExpectType string

// $ExpectError
bytesToHex([ '72', 101, 108, 108, 111, 33, 36 ]);
// $ExpectError
bytesToHex(345);
// $ExpectError
bytesToHex(bigNumber);
// $ExpectError
bytesToHex({});
// $ExpectError
bytesToHex(true);
// $ExpectError
bytesToHex(['string']);
// $ExpectError
bytesToHex(null);
// $ExpectError
bytesToHex(undefined);

// numberToHex Tests

numberToHex('232'); // $ExpectType string
numberToHex(232); // $ExpectType string
numberToHex(bigNumber); // $ExpectType string

// $ExpectError
numberToHex(['72']);
// $ExpectError
numberToHex([4]);
// $ExpectError
numberToHex([ 36 ]);
// $ExpectError
numberToHex({});
// $ExpectError
numberToHex(true);
// $ExpectError
numberToHex(null);
// $ExpectError
numberToHex(undefined);

// checkAddressChecksum Tests

checkAddressChecksum('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType boolean

// $ExpectError
checkAddressChecksum([4]);
// $ExpectError
checkAddressChecksum([ 36 ]);
// $ExpectError
checkAddressChecksum(345);
// $ExpectError
checkAddressChecksum(bigNumber);
// $ExpectError
checkAddressChecksum({});
// $ExpectError
checkAddressChecksum(true);
// $ExpectError
checkAddressChecksum(null);
// $ExpectError
checkAddressChecksum(undefined);

// fromAscii Tests

fromAscii('I have 100!'); // $ExpectType string

// $ExpectError
fromAscii(345);
// $ExpectError
fromAscii(bigNumber);
// $ExpectError
fromAscii({});
// $ExpectError
fromAscii(true);
// $ExpectError
fromAscii(['string']);
// $ExpectError
fromAscii([4]);
// $ExpectError
fromAscii(null);
// $ExpectError
fromAscii(undefined);

// fromDecimal Tests

fromDecimal('232'); // $ExpectType string
fromDecimal(232); // $ExpectType string

// $ExpectError
fromDecimal(bigNumber);
// $ExpectError
fromDecimal(['string']);
// $ExpectError
fromDecimal([4]);
// $ExpectError
fromDecimal({});
// $ExpectError
fromDecimal(true);
// $ExpectError
fromDecimal(null);
// $ExpectError
fromDecimal(undefined);

// fromUtf8 Tests

fromUtf8('I have 100£'); // $ExpectType string

// $ExpectError
fromUtf8(232);
// $ExpectError
fromUtf8(bigNumber);
// $ExpectError
fromUtf8(['string']);
// $ExpectError
fromUtf8([4]);
// $ExpectError
fromUtf8({});
// $ExpectError
fromUtf8(true);
// $ExpectError
fromUtf8(null);
// $ExpectError
fromUtf8(undefined);

// fromWei Tests

fromWei(bigNumber); // $ExpectType string | BN
fromWei(bigNumber, 'ether'); // $ExpectType string | BN

// $ExpectError
fromWei(232);
// $ExpectError
fromWei(['string']);
// $ExpectError
fromWei([4]);
// $ExpectError
fromWei({});
// $ExpectError
fromWei(true);
// $ExpectError
fromWei(null);
// $ExpectError
fromWei(undefined);
// $ExpectError
fromWei(bigNumber, 'blah');

// hexToBytes Tests

hexToBytes('0x000000ea'); // $ExpectType number[]
hexToBytes(0x000000ea); // $ExpectType number[]

// $ExpectError
hexToBytes([4]);
// $ExpectError
hexToBytes(['string']);
// $ExpectError
hexToBytes(bigNumber);
// $ExpectError
hexToBytes({});
// $ExpectError
hexToBytes(true);
// $ExpectError
hexToBytes(null);
// $ExpectError
hexToBytes(undefined);

// hexToNumber Tests

hexToNumber('232'); // $ExpectType number
hexToNumber(232); // $ExpectType number

// $ExpectError
hexToNumber(bigNumber);
// $ExpectError
hexToNumber(['string']);
// $ExpectError
hexToNumber([4]);
// $ExpectError
hexToNumber({});
// $ExpectError
hexToNumber(true);
// $ExpectError
hexToNumber(null);
// $ExpectError
hexToNumber(undefined);

// hexToNumberString Tests

hexToNumberString('0xea'); // $ExpectType string
hexToNumberString(0xea); // $ExpectType string

// $ExpectError
hexToNumberString(bigNumber);
// $ExpectError
hexToNumberString(['string']);
// $ExpectError
hexToNumberString([4]);
// $ExpectError
hexToNumberString({});
// $ExpectError
hexToNumberString(true);
// $ExpectError
hexToNumberString(null);
// $ExpectError
hexToNumberString(undefined);

// hexToString Tests

hexToString('0x49206861766520313030e282ac'); // $ExpectType string
hexToString(0x49206861766520313030e282ac); // $ExpectType string

// $ExpectError
hexToString(bigNumber);
// $ExpectError
hexToString(['string']);
// $ExpectError
hexToString([4]);
// $ExpectError
hexToString({});
// $ExpectError
hexToString(true);
// $ExpectError
hexToString(null);
// $ExpectError
hexToString(undefined);

// hexToUtf8 Tests

hexToUtf8('0x49206861766520313030e282ac'); // $ExpectType string

// $ExpectError
hexToUtf8(656);
// $ExpectError
hexToUtf8(bigNumber);
// $ExpectError
hexToUtf8(['string']);
// $ExpectError
hexToUtf8([4]);
// $ExpectError
hexToUtf8({});
// $ExpectError
hexToUtf8(true);
// $ExpectError
hexToUtf8(null);
// $ExpectError
hexToUtf8(undefined);

// keccak256 Tests

keccak256('234'); // $ExpectType string
keccak256(bigNumber); // $ExpectType string

// $ExpectError
keccak256(['string']);
// $ExpectError
keccak256(234);
// $ExpectError
keccak256([4]);
// $ExpectError
keccak256({});
// $ExpectError
keccak256(true);
// $ExpectError
keccak256(null);
// $ExpectError
keccak256(undefined);

// padLeft Tests

padLeft('0x3456ff', 20); // $ExpectType string
padLeft(0x3456ff, 20); // $ExpectType string
padLeft('Hello', 20, 'x'); // $ExpectType string

// $ExpectError
padLeft(bigNumber, 20);
// $ExpectError
padLeft(['string'], 20);
// $ExpectError
padLeft([4], 20);
// $ExpectError
padLeft({}, 20);
// $ExpectError
padLeft(true, 20);
// $ExpectError
padLeft(null, 20);
// $ExpectError
padLeft(undefined, 20);
// $ExpectError
padLeft('0x3456ff', bigNumber);
// $ExpectError
padLeft('0x3456ff', ['string']);
// $ExpectError
padLeft('0x3456ff', [4]);
// $ExpectError
padLeft('0x3456ff', {});
// $ExpectError
padLeft('0x3456ff', true);
// $ExpectError
padLeft('0x3456ff', null);
// $ExpectError
padLeft('0x3456ff', undefined);
// $ExpectError
padLeft('Hello', 20, bigNumber);
// $ExpectError
padLeft('Hello', 20, ['string']);
// $ExpectError
padLeft('Hello', 20, [4]);
// $ExpectError
padLeft('Hello', 20, {});
// $ExpectError
padLeft('Hello', 20, true);
// $ExpectError
padLeft('Hello', 20, null);

// leftPad Tests

leftPad('0x3456ff', 20); // $ExpectType string
leftPad(0x3456ff, 20); // $ExpectType string
leftPad('Hello', 20, 'x'); // $ExpectType string

// $ExpectError
leftPad(bigNumber, 20);
// $ExpectError
leftPad(['string'], 20);
// $ExpectError
leftPad([4], 20);
// $ExpectError
leftPad({}, 20);
// $ExpectError
leftPad(true, 20);
// $ExpectError
leftPad(null, 20);
// $ExpectError
leftPad(undefined, 20);
// $ExpectError
leftPad('0x3456ff', bigNumber);
// $ExpectError
leftPad('0x3456ff', ['string']);
// $ExpectError
leftPad('0x3456ff', [4]);
// $ExpectError
leftPad('0x3456ff', {});
// $ExpectError
leftPad('0x3456ff', true);
// $ExpectError
leftPad('0x3456ff', null);
// $ExpectError
leftPad('0x3456ff', undefined);
// $ExpectError
leftPad('Hello', 20, bigNumber);
// $ExpectError
leftPad('Hello', 20, ['string']);
// $ExpectError
leftPad('Hello', 20, [4]);
// $ExpectError
leftPad('Hello', 20, {});
// $ExpectError
leftPad('Hello', 20, true);
// $ExpectError
leftPad('Hello', 20, null);

// rightPad Tests

rightPad('0x3456ff', 20); // $ExpectType string
rightPad(0x3456ff, 20); // $ExpectType string
rightPad('Hello', 20, 'x'); // $ExpectType string

// $ExpectError
rightPad(bigNumber, 20);
// $ExpectError
rightPad(['string'], 20);
// $ExpectError
rightPad([4], 20);
// $ExpectError
rightPad({}, 20);
// $ExpectError
rightPad(true, 20);
// $ExpectError
rightPad(null, 20);
// $ExpectError
rightPad(undefined, 20);
// $ExpectError
rightPad('0x3456ff', bigNumber);
// $ExpectError
rightPad('0x3456ff', ['string']);
// $ExpectError
rightPad('0x3456ff', [4]);
// $ExpectError
rightPad('0x3456ff', {});
// $ExpectError
rightPad('0x3456ff', true);
// $ExpectError
rightPad('0x3456ff', null);
// $ExpectError
rightPad('0x3456ff', undefined);
// $ExpectError
rightPad('Hello', 20, bigNumber);
// $ExpectError
rightPad('Hello', 20, ['string']);
// $ExpectError
rightPad('Hello', 20, [4]);
// $ExpectError
rightPad('Hello', 20, {});
// $ExpectError
rightPad('Hello', 20, true);
// $ExpectError
rightPad('Hello', 20, null);

// padRight Tests

padRight('0x3456ff', 20); // $ExpectType string
padRight(0x3456ff, 20); // $ExpectType string
padRight('Hello', 20, 'x'); // $ExpectType string

// $ExpectError
padRight(bigNumber, 20);
// $ExpectError
padRight(['string'], 20);
// $ExpectError
padRight([4], 20);
// $ExpectError
padRight({}, 20);
// $ExpectError
padRight(true, 20);
// $ExpectError
padRight(null, 20);
// $ExpectError
padRight(undefined, 20);
// $ExpectError
padRight('0x3456ff', bigNumber);
// $ExpectError
padRight('0x3456ff', ['string']);
// $ExpectError
padRight('0x3456ff', [4]);
// $ExpectError
padRight('0x3456ff', {});
// $ExpectError
padRight('0x3456ff', true);
// $ExpectError
padRight('0x3456ff', null);
// $ExpectError
padRight('0x3456ff', undefined);
// $ExpectError
padRight('Hello', 20, bigNumber);
// $ExpectError
padRight('Hello', 20, ['string']);
// $ExpectError
padRight('Hello', 20, [4]);
// $ExpectError
padRight('Hello', 20, {});
// $ExpectError
padRight('Hello', 20, true);
// $ExpectError
padRight('Hello', 20, null);

// sha3 Tests

sha3('234'); // $ExpectType string
sha3(bigNumber); // $ExpectType string

// $ExpectError
sha3(['string']);
// $ExpectError
sha3(234);
// $ExpectError
sha3([4]);
// $ExpectError
sha3({});
// $ExpectError
sha3(true);
// $ExpectError
sha3(null);
// $ExpectError
sha3(undefined);

// randomHex Tests

randomHex(32); // $ExpectType string

// $ExpectError
randomHex('234');
// $ExpectError
randomHex(bigNumber);
// $ExpectError
randomHex(['string']);
// $ExpectError
randomHex([4]);
// $ExpectError
randomHex({});
// $ExpectError
randomHex(true);
// $ExpectError
randomHex(null);
// $ExpectError
randomHex(undefined);

// utf8ToHex Tests

utf8ToHex('I have 100£'); // $ExpectType string

// $ExpectError
utf8ToHex(232);
// $ExpectError
utf8ToHex(bigNumber);
// $ExpectError
utf8ToHex(['string']);
// $ExpectError
utf8ToHex([4]);
// $ExpectError
utf8ToHex({});
// $ExpectError
utf8ToHex(true);
// $ExpectError
utf8ToHex(null);
// $ExpectError
utf8ToHex(undefined);

// stringToHex Tests

stringToHex('I have 100£'); // $ExpectType string

// $ExpectError
stringToHex(232);
// $ExpectError
stringToHex(bigNumber);
// $ExpectError
stringToHex(['string']);
// $ExpectError
stringToHex([4]);
// $ExpectError
stringToHex({});
// $ExpectError
stringToHex(true);
// $ExpectError
stringToHex(null);
// $ExpectError
stringToHex(undefined);

// toChecksumAddress Tests

toChecksumAddress('0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType string

// $ExpectError
toChecksumAddress([4]);
// $ExpectError
toChecksumAddress(['string']);
// $ExpectError
toChecksumAddress(345);
// $ExpectError
toChecksumAddress(bigNumber);
// $ExpectError
toChecksumAddress({});
// $ExpectError
toChecksumAddress(true);
// $ExpectError
toChecksumAddress(null);
// $ExpectError
toChecksumAddress(undefined);

// toDecimal Tests

toDecimal('232'); // $ExpectType number
toDecimal(232); // $ExpectType number

// $ExpectError
toDecimal(bigNumber);
// $ExpectError
toDecimal(['string']);
// $ExpectError
toDecimal([4]);
// $ExpectError
toDecimal({});
// $ExpectError
toDecimal(true);
// $ExpectError
toDecimal(null);
// $ExpectError
toDecimal(undefined);

// toHex Tests

toHex('234'); // $ExpectType string
toHex(234); // $ExpectType string
toHex(bigNumber); // $ExpectType string

// $ExpectError
toHex(['string']);
// $ExpectError
toHex(true);
// $ExpectError
toHex([4]);
// $ExpectError
toHex({});
// $ExpectError
toHex(null);
// $ExpectError
toHex(undefined);

// toUtf8 Tests

toUtf8('0x49206861766520313030e282ac'); // $ExpectType string

// $ExpectError
toUtf8(656);
// $ExpectError
toUtf8(bigNumber);
// $ExpectError
toUtf8(['string']);
// $ExpectError
toUtf8([4]);
// $ExpectError
toUtf8({});
// $ExpectError
toUtf8(true);
// $ExpectError
toUtf8(null);
// $ExpectError
toUtf8(undefined);

// toWei Tests

toWei('1'); // $ExpectType string | BN
toWei(1); // $ExpectType string | BN
toWei(bigNumber); // $ExpectType string | BN
toWei('1', 'finney'); // $ExpectType string | BN
toWei(1, 'finney'); // $ExpectType string | BN
toWei(bigNumber, 'finney'); // $ExpectType string | BN

// $ExpectError
toWei(['string']);
// $ExpectError
toWei([4]);
// $ExpectError
toWei({});
// $ExpectError
toWei(true);
// $ExpectError
toWei(null);
// $ExpectError
toWei(undefined);
// $ExpectError
toWei(1 , 'blah');

// isBloom Tests

isBloom('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'); // $ExpectType boolean

// $ExpectError
isBloom(656);
// $ExpectError
isBloom(bigNumber);
// $ExpectError
isBloom(['string']);
// $ExpectError
isBloom([4]);
// $ExpectError
isBloom({});
// $ExpectError
isBloom(true);
// $ExpectError
isBloom(null);
// $ExpectError
isBloom(undefined);

// isTopic Tests

isTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'); // $ExpectType boolean

// $ExpectError
isTopic(656);
// $ExpectError
isTopic(bigNumber);
// $ExpectError
isTopic(['string']);
// $ExpectError
isTopic([4]);
// $ExpectError
isTopic({});
// $ExpectError
isTopic(true);
// $ExpectError
isTopic(null);
// $ExpectError
isTopic(undefined);

// _fireError Tests

_fireError(new Error('error'), {}, (error) => { console.log(error); }, (error) => { console.log(error); }); // $ExpectType {}
_fireError('error', {}, (error) => { console.log(error); }, (error) => { console.log(error); }); // $ExpectType {}
_fireError({ message: 'hey', data: 'test' }, {}, (error) => { console.log(error); }, (error) => { console.log(error); }); // $ExpectType {}
_fireError({ message: 'hey', data: {} }, {}, (error) => { console.log(error); }, (error) => { console.log(error); }); // $ExpectType {}
_fireError({ message: 'hey', data: ['test'] }, {}, (error) => { console.log(error); }, (error) => { console.log(error); }); // $ExpectType {}

// _jsonInterfaceMethodToString Tests

_jsonInterfaceMethodToString({}); // $ExpectType string

// _flattenTypes Tests

_flattenTypes(true, {}); // $ExpectType string[]
_flattenTypes(false, {}); // $ExpectType string[]

// $ExpectError
_flattenTypes(true, null);
// $ExpectError
_flattenTypes(true, undefined);
// $ExpectError
_flattenTypes(656, {});
// $ExpectError
_flattenTypes(bigNumber, {});
// $ExpectError
_flattenTypes(['string'], {});
// $ExpectError
_flattenTypes([4], {});
// $ExpectError
_flattenTypes('string', {});
// $ExpectError
_flattenTypes(null, {});
// $ExpectError
_flattenTypes(undefined, {});

// soliditySha3 Tests

soliditySha3('234564535', '0xfff23243', true, -10); // $ExpectType string
soliditySha3('Hello!%'); // $ExpectType string
soliditySha3('234'); // $ExpectType string
soliditySha3(0xea); // $ExpectType string
soliditySha3(bigNumber); // $ExpectType string
soliditySha3({type: 'uint256', value: '234'}); // $ExpectType string
soliditySha3({t: 'uint', v: new BN('234')}); // $ExpectType string
soliditySha3({t: 'string', v: 'Hello!%'}, {t: 'int8', v: -23}, {t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'}); // $ExpectType string
soliditySha3('0x407D73d8a49eeb85D32Cf465507dd71d507100c1'); // $ExpectType string

// $ExpectError
soliditySha3(['hey']);
// $ExpectError
soliditySha3([34]);
// $ExpectError
soliditySha3(null);
// $ExpectError
soliditySha3(undefined);

// getUnitValue Tests

getUnitValue('ether'); // $ExpectType string

// $ExpectError
getUnitValue('fake');
// $ExpectError
getUnitValue(656);
// $ExpectError
getUnitValue(bigNumber);
// $ExpectError
getUnitValue(['string']);
// $ExpectError
getUnitValue([4]);
// $ExpectError
getUnitValue({});
// $ExpectError
getUnitValue(true);
// $ExpectError
getUnitValue(null);
// $ExpectError
getUnitValue(undefined);

// unitMap Tests

unitMap(); // $ExpectType Units

// testAddress Tests

testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType boolean

// $ExpectError
testAddress(656, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress(bigNumber, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress(['string'], '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress([4], '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress({}, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress(true, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress(null, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress(undefined, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', 656);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', bigNumber);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', ['string']);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', [4]);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {});
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', true);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null);
// $ExpectError
testAddress('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', undefined);

// testTopic Tests

testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51'); // $ExpectType boolean

// $ExpectError
testTopic(656, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic(bigNumber, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic(['string'], '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic([4], '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic({}, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic(true, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic(null, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic(undefined, '0x8ee7f17bb3f88b01247c21ab6603880b64ae53e811f5e01138822e558cf1ab51');
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', 656);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', bigNumber);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', ['string']);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', [4]);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', {});
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', true);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null);
// $ExpectError
testTopic('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', undefined);
