var chai = require('chai');
var assert = chai.assert;
var http = require('http');
var https = require('https');
var SandboxedModule = require('sandboxed-module');

SandboxedModule.registerBuiltInSourceTransformer('istanbul');

class Response {
  constructor(url, headers) {
    this.url = url;
    var header = new Map();
    headers.map(function(h) {
        header.set(`${h[0].toLowerCase()}`, `${h[1]}`);
    });
    this.headers = header;
    this.ok = true;
    this.status = 200;
    this.statusText = 'OK';
  }
};

function Mock(url, options) {
  const response = new Response(url, Object.entries(options.headers));
  return new Promise(function(resolve, reject) {
    resolve(response);
  });
};

var HttpProvider = SandboxedModule.require('../packages/web3-providers-http', {
    requires: {
        'cross-fetch': Mock
        // 'xhr2-cookies': require('./helpers/FakeXHR2'),
        // 'xmlhttprequest': require('./helpers/FakeXMLHttpRequest')
    },
    singleOnly: true
});

describe('web3-providers-http', function () {
    describe('prepareRequest', function () {
        it('should set request header', async function () {
            var options = {headers: [{name: 'Access-Control-Allow-Origin',  value: '*'}]}
            var provider = new HttpProvider('http://localhost:8545', options);

            var origin = 'Access-Control-Allow-Origin';
            assert.equal(provider.headers, options.headers);
        });

        it('should use the passed custom http agent', async function () {
            var agent = new http.Agent();
            var options = {agent: {http: agent}};
            var provider = new HttpProvider('http://localhost:8545', options);

            assert.equal(provider.agent.http, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });

        it('should use the passed custom https agent', async function () {
            var agent = new https.Agent();
            var options = {agent: {https: agent}};
            var provider = new HttpProvider('http://localhost:8545', options);

            assert.equal(provider.agent.https, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });

        /**
            Deprecated with xhr2-cookies since this is non-standard

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
        **/
    });

    describe('send', function () {
        it('should send basic async request', function (done) {
            var provider = new HttpProvider();

            provider.send({}, function (err, result) {
                assert.equal(typeof result, 'undefined');
                done();
            });
        });
    });
});
