var assert = require('assert');
var web3 = require('../index.js');
var u = require('./test.utils.js');

describe('web3', function() {
    u.methodExists(web3, 'sha3');
    u.methodExists(web3, 'toAscii');
    u.methodExists(web3, 'fromAscii');
    u.methodExists(web3, 'toDecimal');
    u.methodExists(web3, 'fromDecimal');
    // u.methodExists(web3, 'toEth');
    u.methodExists(web3, 'fromWei');
    u.methodExists(web3, 'toWei');
    u.methodExists(web3, 'isAddress');
    u.methodExists(web3, 'setProvider');
    u.methodExists(web3, 'reset');

    u.propertyExists(web3, 'manager');
    u.propertyExists(web3, 'providers');
    u.propertyExists(web3, 'eth');
    u.propertyExists(web3, 'db');
    u.propertyExists(web3, 'shh');
});

describe('web3', function() {
    it('should convert fromDecimal(-1) into -0x1', function() {
        assert.equal(web3.fromDecimal(-1), '-0x1');
    });

    it('should convert fromDecimal(-0) into 0x0', function() {
        assert.equal(web3.fromDecimal(-0), '0x0');
    });

    it('should convert fromDecimal(16) into 0x0', function() {
        assert.equal(web3.fromDecimal(16), '0x10');
    });

    it('should convert fromDecimal(255) into 0xff', function() {
        assert.equal(web3.fromDecimal(255), '0xff');
    });
});
