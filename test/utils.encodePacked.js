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
    ],  expected: '0x01'
},{
    values: [
        false,
        {value: false, type: 'bool'},
        {v: false, t: 'bool'},
        {v: false, type: 'bool'},
        {value: false, t: 'bool'}
    ],  expected: '0x00'
},{
    values: [
        'Hello!%',
        {value: 'Hello!%', type: 'string'},
        {value: 'Hello!%', type: 'string'},
        {v: 'Hello!%', t: 'string'}
    ], expected: '0x48656c6c6f2125'
},{
    values: [
        2345676856,
        '2345676856',
        new BN('2345676856'),
        new BigNumber('2345676856', 10),
        {v: '2345676856', t: 'uint256'},
        {v: new BN('2345676856'), t: 'uint256'},
        {v: '2345676856', t: 'uint'}
    ], expected: '0x000000000000000000000000000000000000000000000000000000008bd03038'
},{
    values: [
        '2342342342342342342345676856',
        new BN('2342342342342342342345676856'),
        new BigNumber('2342342342342342342345676856', 10),
        {v: '2342342342342342342345676856', t: 'uint256'},
        {v: '2342342342342342342345676856', t: 'uint'}
    ], expected: '0x000000000000000000000000000000000000000007918a48d0493ed3da6ed838'
// 5
},{
    values: [
        {v: '56', t: 'uint8'}
    ], expected: '0x38'
},{
    values: [
        {v: '256', t: 'uint16'}
    ], expected: '0x0100'
},{
    values: [
        {v: '3256', t: 'uint32'}
    ], expected: '0x00000cb8'
},{
    values: [
        {v: '454256', t: 'uint64'}
    ], expected: '0x000000000006ee70'
},{
    values: [
        {v: '44454256', t: 'uint128'},
        {v: '44454256', t: 'int128'} // should be the same
    ], expected: '0x00000000000000000000000002a65170'
},{
    values: [
        {v: '3435454256', t: 'uint160'}
    ], expected: '0x00000000000000000000000000000000ccc4df30'
// 11
},{
    values: [
        '0x2345435675432144555ffffffffdd222222222222224444556553522',
        {v: '0x2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'},
        {v: '2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'},
        {error: true, v: '0x2345435675432144555ffffffffdd22222222222222444455655352', t: 'bytes'}
    ], expected: '0x2345435675432144555ffffffffdd222222222222224444556553522'
},{
    values: [
        -3435454256,
        new BN(-3435454256),
        new BN('-3435454256'),
        '-3435454256',
        {v: '-3435454256', t: 'int'},
        {v: '-3435454256', t: 'int256'}
    ], expected: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff333b20d0'
// 13
},{
    values: [
        {v: '-36', t: 'int8'}
    ], expected: '0xdc'
},{
    values: [
        {v: '0x22', t: 'bytes2'},
        {v: '22', t: 'bytes2'},
        {error: true, v: '0x222222', t: 'bytes2'}
    ], expected: '0x2200'
},{
    values: [
        {v: '0x44222266', t: 'bytes4'},
        {v: '44222266', t: 'bytes4'}
    ], expected: '0x44222266'
},{
    values: [
        {v: '0x44555ffffffffdd222222222222224444556553522', t: 'bytes32'},
        {v: '44555ffffffffdd222222222222224444556553522', t: 'bytes32'}
    ], expected: '0x44555ffffffffdd2222222222222244445565535220000000000000000000000'
},{
    values: [
        '0x407D73d8a49eeb85D32Cf465507dd71d507100c1',
        '0x407d73d8a49eeb85D32Cf465507dd71d507100c1', // invalid checksum, should work as it is interpreted as address
        {v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', t: 'address'},
        {error: true, v: '0x407d73d8a49eeb85D32Cf465507dd71d507100c1', t: 'address'},
        {v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', t: 'bytes'},
        {v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', t: 'bytes20'}
    ], expected: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
// 18
},{
    values: [
        {v: '36', t: 'int8'}
    ], expected: '0x24'
},{
    values: [
        {v: '36', t: 'int256'}
    ], expected: '0x0000000000000000000000000000000000000000000000000000000000000024'
},{
    values: [
        {v: [-12, 243], t: 'int[]'},
        {v: [-12, 243], t: 'int256[]'},
        {v: ['-12', '243'], t: 'int256[]'},
        {v: [new BN('-12'), new BN('243')], t: 'int256[]'},
        {v: ['-12', '243'], t: 'int256[2]'}
    ], expected: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff400000000000000000000000000000000000000000000000000000000000000f3'
},{
    values: [
        {v: [12, 243], t: 'uint[]'},
        {v: [12, 243], t: 'uint256[]'},
        {v: ['12', '243'], t: 'uint256[]'},
        {v: [new BN('12'), new BN('243')], t: 'uint256[]'},
        {v: ['12', '243'], t: 'uint256[2]'},
        {error: true, v: ['12', '243'], t: 'uint256[1]'}
    ], expected: '0x000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000f3'
},{
    values: [
        {v: ['0x234656', '0x23434234234ffff456'], t: 'bytes32[]'},
    ], expected: '0x234656000000000000000000000000000000000000000000000000000000000023434234234ffff4560000000000000000000000000000000000000000000000'
},{
    values: [
        {v: '0x234656', t: 'bytes16'},
        {v: '234656', t: 'bytes16'}
    ], expected: '0x23465600000000000000000000000000'
},{
    values: [
        {v: ['0x234656', '0x23434234234ffff456'], t: 'bytes16[]'},
        {v: ['234656', '23434234234ffff456'], t: 'bytes16[]'}
    ], expected: '0x234656000000000000000000000000000000000000000000000000000000000023434234234ffff4560000000000000000000000000000000000000000000000'
},{
    values: [
        {v: ['0x407D73d8a49eeb85D32Cf465507dd71d507100c1', '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'], t: 'address[]'},
        {v: ['0x407D73d8a49eeb85D32Cf465507dd71d507100c1', '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'], t: 'address[2]'},
        {error: true, v: ['0x407d73d8a49eeb85D32Cf465507dd71d507100c1', '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'], t: 'address[]'},
        {error: true, v: ['0x407D73d8a49eeb85D32Cf465507dd71d507100c1', '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d'], t: 'address[4]'}
    ], expected: '0x000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c100000000000000000000000085f43d8a49eeb85d32cf465507dd71d507100c1d'
},{
    values: [
        {v: 0, t: 'uint'}
    ], expected: '0x0000000000000000000000000000000000000000000000000000000000000000'
},{
    values: [
        ['someValue'] // should error
    ], expected: ''
}];


describe('web3.encodePacked', function () {
    tests.forEach(function (test) {
        test.values.forEach(function (value) {
            it('should hash "'+ JSON.stringify(value) +'" into "'+ test.expected +'"', function() {

                if(value.error || Array.isArray(value)) {
                    assert.throws(utils.encodePacked.bind(null, value));
                } else {
                    assert.deepEqual(utils.encodePacked(value), test.expected);
                }

            });
        });
    });

    it('should hash mixed boolean values in any order', function() {

        assert.deepEqual(utils.encodePacked(
            tests[0].values[1], // true
            tests[1].values[0], // false
            tests[1].values[2], // false
            tests[0].values[3]  // true
        ), '0x01000001');
    });

    it('should hash mixed string and number values in any order', function() {

        assert.deepEqual(utils.encodePacked(
            tests[2].values[0], // 'Hello!%'
            tests[3].values[2], // 2345676856
            tests[4].values[2], // '2342342342342342342345676856'
            tests[2].values[3],  // 'Hello!%'
            tests[1].values[2] // false
        ), '0x48656c6c6f2125000000000000000000000000000000000000000000000000000000008bd03038000000000000000000000000000000000000000007918a48d0493ed3da6ed83848656c6c6f212500');
    });

    it('should hash mixed number types in any order', function() {

        assert.deepEqual(utils.encodePacked(
            tests[5].values[0], // v: '56', t: 'uint8'
            tests[6].values[0], // v: '256', t: 'uint16'
            tests[7].values[0], // v: '3256', t: 'uint32'
            tests[8].values[0],  // v: '454256', t: 'uint64'
            tests[9].values[0],  // v: '44454256', t: 'uint128'
            tests[10].values[0]  // v: '3435454256', t: 'uint160'
        ), '0x38010000000cb8000000000006ee7000000000000000000000000002a6517000000000000000000000000000000000ccc4df30');
    });

    it('should hash mixed number types addresses and boolean in any order', function() {

        assert.deepEqual(utils.encodePacked(
            tests[5].values[0], // v: '56', t: 'uint8'
            tests[13].values[0], // v: '-36', t: 'int8'
            tests[15].values[0], // v: '0x44222266', t: 'bytes4'
            tests[0].values[0],  // true
            tests[17].values[1]  // v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1', t: 'address'
        ), '0x38dc4422226601407d73d8a49eeb85d32cf465507dd71d507100c1');
    });

    it('should hash mixed number arrays addresses and boolean in any order', function() {

        assert.deepEqual(utils.encodePacked(
            tests[15].values[1], // v: '0x44222266', t: 'bytes4'
            tests[25].values[0], // address array
            tests[0].values[0],  // true
            tests[13].values[0], // v: '-36', t: 'int8'
            tests[12].values[5],  // v: '-3435454256', t: 'int256'
            tests[17].values[0],  // 0x407D73d8a49eeb85D32Cf465507dd71d507100c1
            tests[17].values[1]  // v: 0x407D73d8a49eeb85D32Cf465507dd71d507100c1 t: address
        ), '0x44222266000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c100000000000000000000000085f43d8a49eeb85d32cf465507dd71d507100c1d01dcffffffffffffffffffffffffffffffffffffffffffffffffffffffff333b20d0407d73d8a49eeb85d32cf465507dd71d507100c1407d73d8a49eeb85d32cf465507dd71d507100c1');
    });
});
