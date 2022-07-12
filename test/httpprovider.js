var chai = require('chai');
var assert = chai.assert;
var http = require('http');
var https = require('https');
var Web3 = require('../packages/web3');
var HttpProvider = require('../packages/web3-providers-http');
var fetchMock = require('fetch-mock');

function isObject(object) {
    return object != null && typeof object === 'object';
}

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}

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
    });

    describe('send', function () {
        it('should send basic async request', async function () {
            var provider = new HttpProvider('/fetchMock');

            var reqObject = {
                'jsonrpc': '2.0',
                'id': 0,
                'method': 'eth_chainId',
                'params': []
            };

            var resObject = {
                'jsonrpc': '2.0',
                'id': 0,
                'result': '0x1'
            };

            fetchMock.mock((url, opts) => {
                const reqCount = JSON.parse(opts.body).id;
                reqObject = JSON.stringify((() => {
                    const obj = reqObject;
                    obj.id = reqCount;
                    return obj;
                })());
                resObject = (() => {
                    const obj = resObject;
                    obj.id = reqCount;
                    return obj;
                })();
                const matcher = {
                    url: '/fetchMock',
                    method: 'POST',
                    credentials: 'omit',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: reqObject
                };
                return url === matcher.url
                    && opts.method === matcher.method
                    && opts.credentials === matcher.credentials
                    && deepEqual(opts.headers, matcher.headers)
                    && opts.body === matcher.body;
            }, resObject);

            var web3 = new Web3(provider);

            var chainId = await web3.eth.getChainId();
            assert.equal(chainId, 1);
            fetchMock.restore();
        });
    });
});
