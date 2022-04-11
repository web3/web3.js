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
        const to = '0xaabbccddeeaabbccddeeaabbccddeeaabbccddee';
        const callData = '0x00112233';

        it('should skip malformed url', async () => {
            const urls = ['malformedUrl', 'https://example.com/gateway/{sender}.json'];
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            assert.equal(result.method, 'post');
        });

        it('should handle 4xx error', async () => {
            const urls = ['https://example.com/4xx'];
            const allowList = null;

            try {
                await callGateways(urls, to, callData, allowList);
            } catch (e) {
                assert.equal(e.message.includes('error message'), true);
            }
        });

        it('should throw if all urls fail', async () => {
            const urls = ['https://example.com/5xx', 'https://anexample.com/5xx', 'https://anotherexample.com/5xx'];
            const allowList = null;

            try {
                await callGateways(urls, to, callData, allowList);
            } catch (e) {
                assert.equal(e.message.includes('All gateways failed'), true);
            }
        });

        it('should send GET request if {data} is in the url template, and substitute paramaters correctly', async () => {
            const urls = ['https://example.com/gateway/{sender}/{data}.json'];
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            console.log('result: ', result);
            assert.equal(result.method, 'get');
            assert.equal(result.queryUrl, `https://example.com/gateway/${to}/${callData}.json`);
        });

        it('should send POST request if {data} is not in the url and substitute the parameters correctly', async () => {
            const urls = ['https://example.com/gateway/{sender}.json'];
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            assert.equal(result.method, 'post');
            assert.equal(result.queryUrl, `https://example.com/gateway/${to}.json`);
        });

        //check for content-type
        it('should send a POST with a payload that follows the correct schema', async () => {
            const urls = ['https://example.com/gateway/{sender}.json'];
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            assert.equal(result.method, 'post');
            assert.equal(JSON.stringify(result.payload), JSON.stringify({ sender: to, data: callData}));
        });

        it('should skip gateway if it does not reply with content-type of application/json', async () => {
            const urls = [
                'https://example.com/contentType/{sender}/{data}.json',
                'https://example.com/gateway/{sender}/{data}.json'
            ];
            const allowList = null;

            const result = await callGateways(urls, to, callData, allowList);
            assert.equal(result.status, 200);
        });

        it('should lowercase calldata and sender', async () => {
            const urls = [
                'https://example.com/gateway/{sender}/{data}.json'
            ];
            const allowList = null;
            const upperTo = '0xAabbccddeeaabbccddeeaabbccddeeaabbccddee';
            const upperCallData = '0xA0112233';

            const result = await callGateways(urls, upperTo, upperCallData, allowList);
            assert.equal(result.queryUrl, `https://example.com/gateway/${upperTo.toLowerCase()}/${upperCallData.toLowerCase()}.json`);
        });

        it('should continue to next url if response body fails to parse', async () => {
            const urls = [
                'https://example.com/failedJsonParse/{sender}/{data}.json',
                'https://example.com/gateway/{sender}/{data}.json'
            ];
            const allowList = null;
            const upperTo = '0xAabbccddeeaabbccddeeaabbccddeeaabbccddee';
            const upperCallData = '0xA0112233';

            const result = await callGateways(urls, upperTo, upperCallData, allowList);
            assert.equal(result.status, 200);
        });

        describe('Allow list', () => {
            it('should allow call if no allow list is provided', async () => {
                const urls = ['https://example.com/gateway/{sender}.json'];
                const allowList = null;

                const result = await callGateways(urls, to, callData, allowList);
                assert.equal(result.method, 'post');
            });

            it('should allow call if allow list is provided and domain is on allow list', async () => {
                const urls = ['https://example.com/gateway/{sender}.json'];
                const allowList = ['example.com'];

                const result = await callGateways(urls, to, callData, allowList);
                assert.equal(result.method, 'post');
            });

            it('should NOT allow call if allow list is provided and domain is NOT on allow list', async () => {
                const urls = ['https://example.com/gateway/{sender}.json'];
                const allowList = ['foo.com'];

                try {
                    await callGateways(urls, to, callData, allowList);
                } catch (e) {
                    assert(e.message.includes('All gateways failed'));
                }
            });

            it('should NOT allow call if allow list is provided and domain is part another allowed domain', async () => {
                const urls = ['https://example.com/gateway/{sender}.json'];
                const allowList = ['test.example.com'];

                try {
                    await callGateways(urls, to, callData, allowList);
                } catch (e) {
                    assert(e.message.includes('All gateways failed'));
                    return;
                }
                assert.fail();
            });

            it('should NOT allow call if subdomain of allowed domain', async () => {
                const urls = ['https://test.example.com/gateway/{sender}.json'];
                const allowList = ['example.com'];

                try {
                    await callGateways(urls, to, callData, allowList);
                } catch (e) {
                    assert(e.message.includes('All gateways failed'));
                    return;
                }
                assert.fail();
            });

            it('should skip over disallowed urls and call allowed url if one is present', async () => {
                const urls = ['https://bar.com/{sender}.json', 'https://foo.com/{sender}.json', 'https://test.example.com/gateway/{sender}.json'];
                const allowList = ['bar.com', 'foo.com', 'test.example.com'];

                const result = await callGateways(urls, to, callData, allowList);
                assert.equal(result.status, 200);
            });
        });
    });

    describe('CCIPReadCall', () => {
        const to = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const callData = '0x00112233';
        const mockCCIPReadGatewayResult = '0x00000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000413a1dfb9df8c494060150692f3a0defb98676e4cfcd9c76e0ee810fd3225f58ad34b3ebcdf5f778b715b8f0045579fed56a216a46635e4d77e233814171d871101b00000000000000000000000000000000000000000000000000000000000000'

        const mockErrorObject = null;
        const mockResult = '0x556f18300000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002006bc97e3f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a313938392f000000000000000000000000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a383038302f000000000000000000000000000000000000000000000000000000000000000000000000000000000025687474703a2f2f6c6f63616c686f73743a383038302f7b73656e6465727d2f7b646174617d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ce938715000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266';
        const mockPayload =  {
            method: 'eth_call',
            params: [ { to }, 'latest' ],
            callback: undefined
        };
        const mockOptions = {
            ccipReadGatewayCallback: () => mockCCIPReadGatewayResult,
            ccipReadGatewayUrls: [ 'https://localhost:8080/{sender}/{data}.json' ],
            ccipReadGatewayAllowList: [],
            ccipReadMaxRedirectCount: 4
        };

        var MockMethod = function(options = {}) {
            this.options = options;
        };
        MockMethod.prototype.buildCall = function() {
            const thisRef = this;

            if(thisRef.options.recursiveSend) {
                let send = function () {
                    return ccipReadCall(
                        mockErrorObject,
                        thisRef.options.mockResult || mockResult,
                        mockPayload,
                        send,
                        Object.assign(mockOptions, {
                            ccipReadGatewayCallback: thisRef.options.ccipReadGatewayUrls || mockOptions.ccipReadGatewayUrls
                        }),
                    );
                };
                return send;
            }

            let send = function (mockFn = () => null) {
                return ccipReadCall(
                    thisRef.options.mockErrorObject || mockErrorObject,
                    thisRef.options.mockResult || mockResult,
                    mockPayload,
                    mockFn,
                    Object.assign(mockOptions, {
                        ccipReadGatewayCallback: thisRef.options.ccipReadGatewayCallback || mockOptions.ccipReadGatewayCallback,
                        ccipReadGatewayUrls: thisRef.options.ccipReadGatewayUrls || mockOptions.ccipReadGatewayUrls
                    }),
                );
            };
            return send;
        };

        it('should not exceed the maximum retry count', async () => {
            const methodInstance = new MockMethod({ recursiveSend: true });
            const call = methodInstance.buildCall();
            try {
                await call();
            } catch(e) {
                assert(call.ccipReadCalls === 5);
            }
        });

        it('should handle error in contract response data', async () => {
            const methodInstance = new MockMethod({ mockResult: 'sadfadsfasfdsafadsfs' });
            const call = methodInstance.buildCall();
            try {
                await call();
            } catch (e) {
                assert(e.message.includes('non-CCIP-read compliant error'))
            }
        });

        it('should check if sender matches contract address', async () => {
            const mockResultWithBadContractAddress = '0x556f18300000000000000000000000005fcdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000002006bc97e3f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a313938392f000000000000000000000000000000000000000000000000000000000000000000000000000000000016687474703a2f2f6c6f63616c686f73743a383038302f000000000000000000000000000000000000000000000000000000000000000000000000000000000025687474703a2f2f6c6f63616c686f73743a383038302f7b73656e6465727d2f7b646174617d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ce938715000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266';
            const methodInstance = new MockMethod({ mockResult: mockResultWithBadContractAddress });
            const call = methodInstance.buildCall();
            try {
                await call();
            } catch (e) {
                assert(e.message.includes('sender does not match contract address'));
            }
        });

        it('should handle contract error when on error object', async () => {
            const methodInstance = new MockMethod({
                mockResult: null,
                mockErrorObject: mockResult
            });
            let called = false;
            let mockFn = function() {
                called = true;
            };

            const call = methodInstance.buildCall();
            await call(mockFn);
            assert(called);
        });

        it('should call send with data from gateway', async () => {
            const expectedTo = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            const expectedData = '0x6bc97e3f0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000413a1dfb9df8c494060150692f3a0defb98676e4cfcd9c76e0ee810fd3225f58ad34b3ebcdf5f778b715b8f0045579fed56a216a46635e4d77e233814171d871101b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266';
            const methodInstance = new MockMethod();
            let calledWith;
            let mockFn = function(...args) {
                calledWith = args;
            };
            const call = methodInstance.buildCall();
            await call(mockFn);
            assert(calledWith[0].to === expectedTo);
            assert(calledWith[0].data === expectedData);
        });

        it('should error if no gateway urls have been provided', async () => {
            const mockResultNoUrls = '0x556f18300000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c05f52f06000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ce938715000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266';
            const methodInstance = new MockMethod({ ccipReadGatewayUrls: [], mockResult: mockResultNoUrls });
            const call = methodInstance.buildCall();
            try {
                await call();
            } catch(e) {
                assert(e.message.includes('No gateway urls provided'));
            }
        });
    });
});
