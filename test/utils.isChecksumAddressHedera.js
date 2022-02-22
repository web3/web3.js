import { Client } from '@hashgraph/sdk';
import { assert } from 'chai';
import { checkAddressChecksumHedera, toChecksumAddressHedera } from '../packages/web3-utils';

const tests = [
    { address: '0.0.27516594', checksum: 'nmneb', client: 'mainnet', is: true},
    { address: '0.0.27516594', checksum: 'jtlrp', client: 'testnet', is: true},
    { address: '0.0.27516594', checksum: 'gakfd', client: 'previewnet', is: true},
    { address: '0.0.12312412', checksum: 'ivggw', client: 'testnet', is: true},
];

const clients = {
    mainnet: Client.forMainnet(),
    testnet: Client.forTestnet(),
    previewnet: Client.forPreviewnet()
};

describe('lib/utils/utils', function () {
    describe('checkAddressChecksumHedera', function () {
        tests.forEach(function (test) {
            it('shoud test if address ' + test.address + ' passes checksum: ' + test.checksum + ' result: ' + test.is, function () {
                assert.equal(
                    checkAddressChecksumHedera(test.checksum, test.address, clients[test.client]),
                    test.is
                );
            });
        });
        it('should throw error, incorrect address', function () {
            assert.throws(function () { checkAddressChecksumHedera('', '', clients.testnet); }, Error);
            assert.throws(function () { checkAddressChecksumHedera('', '1.0.', clients.testnet); }, Error);
            assert.throws(function () { checkAddressChecksumHedera('', '1.0.1231233', clients.testnet); }, Error);
        });

        it('should throw error, incorrect client', function () {
            assert.throws(function () { checkAddressChecksumHedera('', '0.0.12312412', {}); }, Error);
            assert.throws(function () { checkAddressChecksumHedera('', '0.0.12312412', { _network: { ledgerId: {} } }); }, Error);
            assert.throws(function () { checkAddressChecksumHedera('', '0.0.12312412', { _network: { ledgerId: { _ledgerId: 0 } } }); }, Error);
        });
    });
});

