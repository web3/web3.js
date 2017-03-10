var testMethod = require('./helpers/test.method.js');

var method = 'newAccount';


var tests = [{
    args: ['P@ssw0rd!'],
    formattedArgs: ['P@ssw0rd!'],
    result: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    formattedResult: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855'], // checksum address
    call: 'personal_newAccount'
}];

testMethod.runTests(['eth','personal'], method, tests);

