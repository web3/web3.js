var testMethod = require('./helpers/test.method.js');

var method = 'getAccounts';
var call = 'eth_accounts';

var tests = [{
    result: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855', '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae'],
    formattedResult: ['0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    call: call
},
{
    result: ['0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    formattedResult: ['0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'],
    call: call
}];


testMethod.runTests('eth', method, tests);

