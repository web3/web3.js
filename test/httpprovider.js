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

    describe('supportsSubscriptions', function () {
        it('should turn false by default', function () {
            var provider = new HttpProvider();

            assert.isFalse(provider.supportsSubscriptions());
        });
    });
});
