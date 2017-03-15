var _ = require('underscore');
var BN = require('bn.js');
var BigNumber = require('bignumber.js');
var chai = require('chai');
var assert = chai.assert;
var utils = require('../packages/web3-utils');

// each "values" is one kind of parameter of the same type
var tests = [{
    values: [
        true,
        {value: true, type: 'bool'},
        {v: true, t: 'bool'},
        {v: true, type: 'bool'},
        {value: true, t: 'bool'}
    ],  expected: '0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2'
},{
    values: [
        false,
        {value: false, type: 'bool'},
        {v: false, t: 'bool'},
        {v: false, type: 'bool'},
        {value: false, t: 'bool'}
    ],  expected: '0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a'
},{
    values: [
        'Hello!%',
        {value: 'Hello!%', type: 'string'},
        {value: 'Hello!%', type: 'string'},
        {v: 'Hello!%', t: 'string'}
    ], expected: '0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc'
},{
    values: [
        2345676856,
        '2345676856',
        new BN('2345676856'),
        new BigNumber('2345676856', 10),
        {v: '2345676856', t: 'uint256'},
        {v: new BN('2345676856'), t: 'uint256'},
        {v: '2345676856', t: 'uint'}
    ], expected: '0xc0a8dac986ad882fff6b05a7792e1259f2fd8fa72d632fb48f54affea59af6fc'
},{
    values: [
        '2342342342342342342345676856',
        new BN('2342342342342342342345676856'),
        new BigNumber('2342342342342342342345676856', 10),
        {v: '2342342342342342342345676856', t: 'uint256'},
        {v: '2342342342342342342345676856', t: 'uint'}
    ], expected: '0x8ac2efaaee0058e1f1fbcb59643f6799c31c27096a347651e40f98daf1905094'
},{
    values: [
        {v: '56', t: 'uint8'}
    ], expected: '0xe4b1702d9298fee62dfeccc57d322a463ad55ca201256d01f62b45b2e1c21c10'
},{
    values: [
        {v: '256', t: 'uint16'}
    ], expected: '0x628bf3596747d233f1e6533345700066bf458fa48daedaf04a7be6c392902476'
},{
    values: [
        {v: '3256', t: 'uint32'}
    ], expected: '0x720e835027b41b4b3e057ee9e6d4351ffc726d767652cdb0fc874869df88001c'
},{
    values: [
        {v: '454256', t: 'uint64'}
    ], expected: '0x5ce6ff175acd532fb4dcef362c829e74a0ce1fde4a43885cca0d257b33d06d07'
},{
    values: [
        {v: '44454256', t: 'uint128'}
    ], expected: '0x372b694bc0f2dd9229f39b3892621a6ae3ffe111c5096a0a9253c34558a92ab8'
},{
    values: [
        {v: '3435454256', t: 'uint160'}
    ], expected: '0x89e0942df3602c010e0252becbbe1b4053bd4a871a021c02d8ab9878f1194b6b'
},{
    values: [
        '0x2345435675432144555ffffffffdd222222222222224444556553522',
        {v: '0x2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'},
        {v: '2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'}
    ], expected: '0xb7ecb0d74e96b792a62b4a9dad28f5b1795417a89679562178b1987e0767e009'
},{
    values: [
        {v: '0x22', t: 'bytes2'},
        {v: '22', t: 'bytes2'}
    ], expected: '0xb07fb0a3471486f9ccb02aab1d525df60d82925cb2d27860f923e655d76f35fc'
}];


describe('web3.soliditySha3', function () {
    tests.forEach(function (test) {
        test.values.forEach(function (value) {
            it('should hash "'+ value +'" into "'+ test.expected +'"', function() {

                if (!_.isArray(value)) {
                    value = [value];
                }

                assert.deepEqual(utils.soliditySha3.apply(null, value), test.expected);

            });
        });
    });

    it('should hash mixed boolean values in any order', function() {

        assert.deepEqual(utils.soliditySha3(
            tests[0].values[1], // true
            tests[1].values[0], // false
            tests[1].values[2], // false
            tests[0].values[3]  // true
        ), '0x4ba958c4829ba5d3f9eaa61058ef208aba8bc25c0b6e33044015e0af9fb1c35d');
    });

    it('should hash mixed string and number values in any order', function() {

        assert.deepEqual(utils.soliditySha3(
            tests[2].values[0], // 'Hello!%'
            tests[3].values[2], // 2345676856
            tests[4].values[2], // '2342342342342342342345676856'
            tests[2].values[3],  // 'Hello!%'
            tests[1].values[2] // false
        ), '0x7eb45eb9a0e1f6904514bc34c8b43e71c2e1f96f21b45ea284a0418cb351ec69');
    });

    it('should hash mixed number types in any order', function() {

        assert.deepEqual(utils.soliditySha3(
            tests[5].values[0], // v: '56', t: 'uint8'
            tests[6].values[0], // v: '256', t: 'uint16'
            tests[7].values[0], // v: '3256', t: 'uint32'
            tests[8].values[0],  // v: '454256', t: 'uint64'
            tests[9].values[0],  // v: '44454256', t: 'uint128'
            tests[10].values[0]  // v: '3435454256', t: 'uint160'
        ), '0x31d6c48574796dfb1a652f2e5c5a261db0677e39fff5c3032449c50eade4b6b6');
    });
});
