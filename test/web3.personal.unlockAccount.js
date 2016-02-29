var chai = require('chai');
var web3 = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'unlockAccount';

var tests = [{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'P@ssw0rd!'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'P@ssw0rd!'],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
}];

testMethod.runTests('personal', method, tests);
