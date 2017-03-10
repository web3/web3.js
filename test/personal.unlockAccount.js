var testMethod = require('./helpers/test.method.js');

var method = 'unlockAccount';


var tests = [{
    args: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855', 'P@ssw0rd!'], // checksum address
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'P@ssw0rd!', null],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
},{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'P@ssw0rd!', 10],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', 'P@ssw0rd!', 10],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
}];

testMethod.runTests(['eth','personal'], method, tests);
