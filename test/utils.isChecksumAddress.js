var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var tests = [
    { value: '0x52908400098527886E0F7030069857D2E4169EE7', is: true },
    { value: '0x8617E340B3D01FA5F11F306F4090FD50E238070D', is: true },
    { value: '0xde709f2102306220921060314715629080e2fb77', is: true },
    { value: '0x27b1fdb04752bbc536007a920d24acb045561c26', is: true },
    { value: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', is: true },
    { value: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', is: true },
    { value: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', is: true },
    { value: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', is: true },
    { value: '0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', is: false },
    { value: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', is: false }
];

describe('lib/utils/utils', function () {
    describe('checkAddressChecksum', function () {
        tests.forEach(function (test) {
            it('shoud test if address ' + test.value + ' passes checksum: ' + test.is, function () {
                assert.equal(utils.checkAddressChecksum(test.value), test.is);
            });
        });
    });
});

