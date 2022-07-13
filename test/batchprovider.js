var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var assert = chai.assert;
var expect = chai.expect;
var http = require('http');
var https = require('https');
var Web3 = require('../packages/web3');
var BatchProvider = require('../packages/web3-providers-batch');
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

describe('web3-providers-batch', function () {
    describe('prepareRequest', function () {
        it('should set request header', async function () {
            var options = {headers: [{name: 'Access-Control-Allow-Origin',  value: '*'}]}
            var provider = new BatchProvider('http://localhost:8545', options);

            var origin = 'Access-Control-Allow-Origin';
            assert.equal(provider.headers, options.headers);
        });

        it('should use the passed custom http agent', async function () {
            var agent = new http.Agent();
            var options = {agent: {http: agent}};
            var provider = new BatchProvider('http://localhost:8545', options);

            assert.equal(provider.agent.http, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });

        it('should use the passed custom https agent', async function () {
            var agent = new https.Agent();
            var options = {agent: {https: agent}};
            var provider = new BatchProvider('http://localhost:8545', options);

            assert.equal(provider.agent.https, agent);
            assert.equal(provider.httpAgent, undefined);
            assert.equal(provider.httpsAgent, undefined);
            assert.equal(provider.agent, options.agent);
        });
    });

    describe('send', function () {
        it('should fail with invalid remote node connection', async function () {
            var provider = new BatchProvider('http://localhost:8545');
            var web3 = new Web3(provider);

            await expect(web3.eth.getChainId()).to.be.rejectedWith(Error, "CONNECTION ERROR: Couldn't connect to node http://localhost:8545.");
        });

        it('should fail for non-json format response', async function () {
            var provider = new BatchProvider('/fetchMock');
            var web3 = new Web3(provider);

            fetchMock.mock('/fetchMock', 'Testing non-json format response');

            await expect(web3.eth.getChainId()).to.be.rejectedWith(Error, /Invalid JSON RPC response/);
            fetchMock.restore();
        });

        it('should timeout by delayed response', async function () {
            var provider = new BatchProvider('/fetchMock', { timeout: 500 });
            var web3 = new Web3(provider);

            fetchMock.mock('/fetchMock', 'Testing non-json format response', { delay: 1000 });

            await expect(web3.eth.getChainId()).to.be.rejectedWith(Error, 'CONNECTION TIMEOUT: timeout of 500 ms achived');
            fetchMock.restore();
        });

        it('should send basic async request', async function () {
            var provider = new BatchProvider('/fetchMock');

            var reqObject = [{
                'jsonrpc': '2.0',
                'id': 0,
                'method': 'eth_chainId',
                'params': []
            }];

            var resObject = [{
                'jsonrpc': '2.0',
                'id': 0,
                'result': '0x1'
            }];

            fetchMock.mock((url, opts) => {
                const reqCount = JSON.parse(opts.body)[0].id;
                reqObject = JSON.stringify(reqObject.map((obj, index) => {
                  obj.id = reqCount + index;
                  return obj;
                }));
                resObject = resObject.map((obj, index) => {
                  obj.id = reqCount + index;
                  return obj;
                });
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

        it('should aggregate async requests', async function () {
            var provider = new BatchProvider('/fetchMock');

            var reqObject = [{
                'jsonrpc': '2.0',
                'id': 0,
                'method': 'eth_chainId',
                'params': []
            }, {
                'jsonrpc': '2.0',
                'id': 1,
                'method': 'eth_blockNumber',
                'params': []
            }, {
                'jsonrpc': '2.0',
                'id': 2,
                'method': 'eth_getBlockByNumber',
                'params': ["latest", false]
            }];

            var resObject = [{
                'jsonrpc': '2.0',
                'id': 0,
                'result': '0x1'
            }, {
                'jsonrpc': '2.0',
                'id': 1,
                'result': '0x1'
            }, {
                'jsonrpc': '2.0',
                'id': 2,
                'result': {
                    'difficulty': '0x2',
                    'extraData': '0xd883010002846765746888676f312e31332e34856c696e757800000000000000924cd67a1565fdd24dd59327a298f1d702d6b7a721440c063713cecb7229f4e162ae38be78f6f71aa5badeaaef35cea25061ee2100622a4a1631a07e862b517401',
                    'gasLimit': '0x25ff7a7',
                    'gasUsed': '0x300b37',
                    'hash': '0x04055304e432294a65ff31069c4d3092ff8b58f009cdb50eba5351e0332ad0f6',
                    'logsBloom': '0x08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000',
                    'miner': '0x2a7cdd959bfe8d9487b2a43b33565295a698f7e2',
                    'mixHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
                    'nonce': '0x0000000000000000',
                    'number': '0x1',
                    'parentHash': '0x0d21840abff46b96c84b2ac9e10e4f5cdaeb5693cb665db62a2f3b02d2d57b5b',
                    'receiptsRoot': '0xfc7c0fda97e67ed8ae06e7a160218b3df995560dfcb209a3b0dddde969ec6b00',
                    'sha3Uncles': '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                    'size': '0x558',
                    'stateRoot': '0x1db428ea79cb2e8cc233ae7f4db7c3567adfcb699af668a9f583fdae98e95588',
                    'timestamp': '0x5f49ca59',
                    'totalDifficulty': '0x3',
                    'transactions': [
                        '0xbaf8ffa0b475a67cfeac3992d24422804452f0982e4e21a8816db2e0c9e5f224',
                        '0x8ea486df4eafaf713fbbe3b4b0b4196e50fbd1ea93daf66675accf3bf3f59d00',
                        '0x9ebc5237eabb339a103a34daf280db3d9498142b49fa47f1af71f64a605acffa',
                        '0xc043c5d33f8c3a6d6c0853ff8cbe88ebdf746f8092cb763b18de65db45246a6e',
                        '0x2f64d7e926e6fb62f906e18258097af179c213f0c87a717476cce1b334049797',
                        '0x463f0a179a89f47b055df14897dd7c55a2d819351568045dcb0496f2875c71ee',
                        '0xc02fd5fc71fe8bdc4fec3f97a019a4dc9961eb95e5251c55fcb3da76f5cb5bca'
                    ],
                    'transactionsRoot': '0x53a8743b873570daa630948b1858eaf5dc9bb0bca2093a197e507b2466c110a0',
                    'uncles': []
                }
            }];

            fetchMock.mock((url, opts) => {
                const reqCount = JSON.parse(opts.body)[0].id;
                reqObject = JSON.stringify(reqObject.map((obj, index) => {
                  obj.id = reqCount + index;
                  return obj;
                }));
                resObject = resObject.map((obj, index) => {
                  obj.id = reqCount + index;
                  return obj;
                });
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

            var result = await Promise.all([
                web3.eth.getChainId(),
                web3.eth.getBlockNumber(),
                web3.eth.getBlock('latest')
            ]);
            assert.deepEqual(result, [
                1,
                1,
                {
                    difficulty: '2',
                    extraData: '0xd883010002846765746888676f312e31332e34856c696e757800000000000000924cd67a1565fdd24dd59327a298f1d702d6b7a721440c063713cecb7229f4e162ae38be78f6f71aa5badeaaef35cea25061ee2100622a4a1631a07e862b517401',
                    gasLimit: 39843751,
                    gasUsed: 3148599,
                    hash: '0x04055304e432294a65ff31069c4d3092ff8b58f009cdb50eba5351e0332ad0f6',
                    logsBloom: '0x08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000',
                    miner: '0x2a7cdd959bFe8D9487B2a43B33565295a698F7e2',
                    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    nonce: '0x0000000000000000',
                    number: 1,
                    parentHash: '0x0d21840abff46b96c84b2ac9e10e4f5cdaeb5693cb665db62a2f3b02d2d57b5b',
                    receiptsRoot: '0xfc7c0fda97e67ed8ae06e7a160218b3df995560dfcb209a3b0dddde969ec6b00',
                    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
                    size: 1368,
                    stateRoot: '0x1db428ea79cb2e8cc233ae7f4db7c3567adfcb699af668a9f583fdae98e95588',
                    timestamp: 1598671449,
                    totalDifficulty: '3',
                    transactions: [
                        '0xbaf8ffa0b475a67cfeac3992d24422804452f0982e4e21a8816db2e0c9e5f224',
                        '0x8ea486df4eafaf713fbbe3b4b0b4196e50fbd1ea93daf66675accf3bf3f59d00',
                        '0x9ebc5237eabb339a103a34daf280db3d9498142b49fa47f1af71f64a605acffa',
                        '0xc043c5d33f8c3a6d6c0853ff8cbe88ebdf746f8092cb763b18de65db45246a6e',
                        '0x2f64d7e926e6fb62f906e18258097af179c213f0c87a717476cce1b334049797',
                        '0x463f0a179a89f47b055df14897dd7c55a2d819351568045dcb0496f2875c71ee',
                        '0xc02fd5fc71fe8bdc4fec3f97a019a4dc9961eb95e5251c55fcb3da76f5cb5bca'
                    ],
                    transactionsRoot: '0x53a8743b873570daa630948b1858eaf5dc9bb0bca2093a197e507b2466c110a0',
                    uncles: []
                }
            ]);
            fetchMock.restore();
        });
    });
})
