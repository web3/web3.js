var testMethod = require('./helpers/test.method.js');

var method = 'lockAccount';


var tests = [{
    args: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855'], // checksum address
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
},{
    args: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    formattedArgs: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
}];

testMethod.runTests(['eth','personal'], method, tests);
