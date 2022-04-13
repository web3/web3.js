var chai = require('chai');
var assert = chai.assert;

var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
let { Http } = SandboxedModule.require('../packages/web3-http', {
    requires: {
        'xhr2-cookies': require('./helpers/FakeXHR2Http'),
    },
    singleOnly: true
});

var { Http: RawHttp } = require('../packages/web3-http');

describe.skip('web3-http', () => {
    describe('_prepareRequest', () => {
        it('should create correct request object when in the browser', async () => {
            const http = new RawHttp();
            let called = false;

            global.XMLHttpRequest = function() {
                called = true;
            };
            http._prepareRequest();
            delete global.XMLHttpRequest;

            assert(called);
        });
        it('should create correct request object when NOT in the browser', async () => {
            const http = new Http();
            const request = http._prepareRequest();
            assert(request.constructor.name === 'FakeXHR2');
        });
    });
    describe('_sendRequest', () => {
        it('should set headers from options if they exist', async () => {
            const http = new Http({ headers: [{ name: 'name', value: 'value'}]});
            const result = await http._sendRequest('url', 'GET', {});
            assert(result.headers.name === 'value');
        });
        it('should parse response body if response is application/json', async () => {
            const http = new Http();
            global.getResponseHeader = () => 'application/json';
            const result = await http._sendRequest('url', 'POST', { foo: 'bar' });
            assert(result.responseBody.foo === 'bar');
            delete global.getResponseHeader;
        });
        it('should reject promise if request status is >= 400', async () => {
            global.status = 400;
            global.getResponseHeader = () => 'application/json';

            const http = new Http();
            try {
                await http._sendRequest('url', 'POST', { foo: 'bar' });
            } catch (e) {
                assert(e.status === 400);
            }

            delete global.getResponseHeader;
            delete global.staus;
        });
        it('should reject if request times out', async () => {
            global.timeout = true;

            const http = new Http();
            try{
                await http._sendRequest('url', 'GET', {});
            } catch(e) {
                assert(e.message.includes('CONNECTION TIMEOUT'));
            }

            delete global.timeout;
        });
    });
    describe('get', () => {
        it('should send GET request', async () => {
            const http = new Http();
            const result = await http.get('url');
            assert(result.status === 200);
        });
    });
    describe('post', () => {
        it('should send POST request', async () => {
            const http = new Http();
            const result = await http.post('url');
            assert(result.status === 200);
        });
    });
});
