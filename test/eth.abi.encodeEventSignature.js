var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [{
    params: [{
        name: 'myEvent',
        type: 'event',
        inputs: [{
            type: 'uint256',
            name: 'myNumber'
        },{
            type: 'bytes32',
            name: 'myBytes'
        }]
    }],
    result: '0xf2eeb729e636a8cb783be044acf6b7b1e2c5863735b60d6daae84c366ee87d97'
},{
    params: [{
        name: 'SomeEvent',
        type: 'event',
        inputs: [{
            type: 'bytes',
            name: 'somebytes'
        },{
            type: 'byte16',
            name: 'myBytes'
        }]
    }],
    result: '0xab132b6cdd50f8d4d2ea33c3f140a9b3cf40f451540c69765c4842508bb13838'
},{
    params: [{
        name: 'AnotherEvent',
        type: 'event',
        inputs: []
    }],
    result: '0x601d819e31a3cd164f83f7a7cf9cb5042ab1acff87b773c68f63d059c0af2dc0'
}];

describe('encodeEventSignature', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(web3.eth.abi.encodeEventSignature.apply(web3.eth.abi, test.params), test.result);
        });
    });
});
