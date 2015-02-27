var assert = require('assert');
var formatters = require('../lib/formatters.js');

describe('formatters', function () {
    describe('outputLogFormatter', function () {
        it('should return the correct value', function () {
            
            assert.deepEqual(formatters.outputLogFormatter({
                number: '0x3e8',
                data: '0x7b2274657374223a2274657374227d',
                topic: ['0x68656c6c6f','0x6d79746f70696373']                
            }), {
                number: 1000,
                data: '0x7b2274657374223a2274657374227d',
                topic: ['0x68656c6c6f','0x6d79746f70696373']
            });
        });
    });
});