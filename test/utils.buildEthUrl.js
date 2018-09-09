import {assert} from 'chai';
import utils from '../packages/web3-utils';

describe('lib/utils/utils', () => {
    describe('buildEthUrl', () => {
        it('should build correct url for the simple payment', () => {
            const url = utils.buildEthUrl('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', '2.014e18');
            const expected = 'ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359?value=2.014e18';
            assert.equal(url, expected);
        });

        it('should build correct url for the smart contract method call', () => {
            const expected = 'ethereum:0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=1';
            const methodCallDescription = {
                methodName: 'transfer',
                args: [
                    'address', '0x8e23ee67d1332ad560396262c48ffbb01f93d052',
                    'uint256', '1'
                ]
            };
            const url = utils.buildEthUrl('0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7', methodCallDescription);

            assert.equal(url, expected);
        });
    });
});
