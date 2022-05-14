var chai = require('chai');
var assert = chai.assert;
var http = require('http');
var https = require('https');
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
var HttpProvider = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        'xhr2-cookies': require('./helpers/FakeXHR2'),
        // 'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
});

let Http = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        'xhr2-cookies': require('./helpers/FakeXHR2Http'),
    },
    singleOnly: true
});
var RawHttp = require('../packages/web3-providers-http');

describe('web3-providers-http', function () {
    describe('prepareRequest', function () {
        let provider;
        let result;
        let options;
        let agent;

        it('should set request header', function () {
            provider = new HttpProvider('http://localhost:8545', {headers: [{name: 'Access-Control-Allow-Origin',  value: '*'}]});
            result = provider._prepareRequest();

            assert.equal(typeof result, 'object');
            assert.equal(result.headers['Access-Control-Allow-Origin'], '*');
        });

        it('should use the passed custom http agent', function () {
            agent = new http.Agent();
            options = {agent: {http: agent}};
            provider = new HttpProvider('http://localhost:8545', options);
            result = provider._prepareRequest();

            assert.equal(typeof result, 'object');
            assert.equal(result.agents.httpAgent, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });

        it('should use the passed custom https agent', function () {
            agent = new https.Agent();
            options = {agent: {https: agent}};
            provider = new HttpProvider('http://localhost:8545', options);
            result = provider._prepareRequest();

            assert.equal(typeof result, 'object');
            assert.equal(result.agents.httpsAgent, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });

        it('should use the passed baseUrl', function () {
            agent = new https.Agent();
            options = {agent: {https: agent, baseUrl: 'base'}};
            provider = new HttpProvider('http://localhost:8545', options);
            result = provider._prepareRequest();

            assert.equal(typeof result, 'object');
            assert.equal(result.agents.httpsAgent, agent);
            assert.equal(result.agents.baseUrl, 'base');
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });
    });

    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.send({}, function (err, result) {
                assert.equal(typeof result, 'object');
                done();
            });
        });
    });

    describe('_prepareGeneralRequest', () => {
        it('should create correct request object when in the browser', async () => {
            const http = new RawHttp();
            let called = false;

            global.XMLHttpRequest = function() {
                called = true;
            };
            http._prepareGeneralRequest();
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
            const http = new Http(null, { headers: [{ name: 'name', value: 'value'}]});
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
