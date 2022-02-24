import { Client } from '@hashgraph/sdk';
import { assert } from 'chai';
import { toChecksumAddress } from '../packages/web3-utils'

const tests = [
    { address: '0.0.27516594', result: 'nmneb', client : 'mainnet'},
    { address: '0.0.27516594', result: 'jtlrp', client: 'testnet' },
    { address: '0.0.27516594', result: 'gakfd', client: 'previewnet' },
    { address: '0.0.12312412', result: 'ivggw', client: 'testnet' },
]
const clients = {
    mainnet: Client.forMainnet(),
    testnet: Client.forTestnet(),
    previewnet: Client.forPreviewnet()
}

describe('lib/utils/utils', function () {
    describe('toChecksumAddress', function () {
        tests.forEach(function (test) {
            it('should return the correct value', function () {
                const actual = toChecksumAddress(test.address, clients[test.client]);
                assert.equal(
                    actual,
                    test.result, 
                    'Error incorrect value'
                );
            });
        });

        it('should throw error, incorrect address', function () {
            assert.throws(function () { toChecksumAddress('', clients.testnet); }, Error);
            assert.throws(function () { toChecksumAddress('1.0.', clients.testnet); }, Error);
            assert.throws(function () { toChecksumAddress('1.0.1231233', clients.testnet); }, Error);
        });
    
    });
});
