var chai = require('chai');
var assert = chai.assert;
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var { isOffChainLookup, ccipReadCall, callGateways } = SandboxedModule.require('../packages/web3-ccip-read', {
    requires: {
        'web3-http': require('./helpers/FakeHttp'),
    },
    globals: {
        URL: global.URL
    },
    singleOnly: true
});

// var { isOffChainLookup, ccipReadCall, callGateways } = require('../packages/web3-ccip-read');


const OFFCHAIN_LOOKUP_ERROR = '0x556f18300000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002005f52f0600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a313938392f000000000000000000000000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a383038302f000000000000000000000000000000000000000000000000000000000000000000000000000000000025687474703a2f2f6c6f63616c686f73743a383038302f7b73656e6465727d2f7b646174617d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ce938715000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266';

describe('CCIP read', () => {
    describe('isOffChainLookup', () => {
        it('should return true if error is passed in as an error and is a string', () => {
            assert.equal(isOffChainLookup(OFFCHAIN_LOOKUP_ERROR), true);
        });
        it('should return true if error is passed in as a result and is a string', () => {
            assert.equal(isOffChainLookup(null, OFFCHAIN_LOOKUP_ERROR), true);
        });
        it('should return true if error is passed in as an error and is an object', () => {
            assert.equal(isOffChainLookup({data: OFFCHAIN_LOOKUP_ERROR}), true);
        });

        it('should return false if is NOT an off-chain lookup', () => {
            assert.equal(isOffChainLookup('notoffchainlookup'), false);
            assert.equal(isOffChainLookup(null, 'notoffchainlookup'), false);
        });

        it('should return false if no error or result is passed in', () => {
            assert.equal(isOffChainLookup(), false);
        });
    });

    describe('callGateways', () => {
        it.only('should skip malformed url', async () => {
            const urls = ['malformedUrl', 'https://example.com'];
            const to = 'to';
            const callData = 'callData';
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            debugger;
            console.log('result: ', result);
        });

        it.skip('should handle 4xx error');
        it.skip('should throw if all urls fail');
        it.skip('should send GET request if {data} is in the url template');
        it.skip('should send POST request if {data} is not in the url');
        it.skip('should substitute {sender} if in url');

        it.skip('should allow call if allow list and block list are NOT provided');

        describe('Allow list', () => {
            it.skip('should allow call if no allow list is provided');
            it.skip('should allow call if allow list is provided and domain is on allow list');
            it.skip('should NOT allow call if allow list is provided and domain is NOT on allow list');
        });
    });

    describe('CCIPReadCall', () => {
        it.skip('should not exceed the maximum retry count');

        it.skip('should handle mainnet error correctly');

        it.skip('should handle error in response data');

        it.skip('should handle error when on error object');

        it.skip('should handle network errors');

        it.skip('should handle failing urls in the url list');

        it.skip('should respond to GET/POST templates correctly')
    });
});
