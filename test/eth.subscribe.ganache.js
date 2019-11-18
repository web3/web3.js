const assert = require('assert');
const ganache = require('ganache-cli');
const pify = require('pify');
const Web3 = require('./helpers/test.utils').getWeb3();

describe('subscription connect/reconnect', function() {
    let server;
    let web3;
    let accounts;
    const port = 8545;

    beforeEach(async function() {
        server = ganache.server({port: port, blockTime: 1});
        await pify(server.listen)(port);
        web3 = new Web3('ws://localhost:' + port);
        accounts = await web3.eth.getAccounts();
    });

    afterEach(async function() {
        // Might already be closed..
        try {
            await pify(server.close)();
        } catch (err) {
        }
    });

    it('subscribes (baseline)', function() {
        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', function(result) {
                    assert(result.parentHash);
                    resolve();
                });
        });
    });

    it('errors when the `eth_subscribe` request got send, the reponse isnt returned from the node, and the connection does get closed in the mean time', async function() {
        await pify(server.close)();

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('error', function(err) {
                    assert(err.message.includes('CONNECTION ERROR'));
                    resolve();
                });
        });
    });

    it('errors when the subscription got established (is running) and the connection does get closed', function() {
        let stage = 0; // Required to not trigger server.close a second time

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', async function() {
                    if (stage === 0) {
                        stage = 1;
                        await pify(server.close)();
                    }
                })
                .on('error', function(err) {
                    assert(err.message.includes('CONNECTION ERROR'));
                    resolve();
                });
        });
    });

    it('auto reconnects and keeps the subscription running', function() {
        this.timeout(6000);

        web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:' + port, {reconnect: {auto: true}}));

        return new Promise(async function (resolve) {
            // Stage 0: trigger a new Block
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', function(result) {
                    assert(result.parentHash);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();

                        resolve();
                    }
                });

            // Stage 1: Close & re-open server, trigger a new block
            await pify(server.close)();
            server = ganache.server({port: port, blockTime: 1});
            await pify(server.listen)(port);
            stage = 1;
        });
    });

    it('auto reconnects, keeps the subscription running and triggers the `connected` event listener twice', function() {
        this.timeout(6000);

        web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:' + port, {reconnect: {auto: true}}));

        return new Promise(async function (resolve) {
            // Stage 0: trigger a new Block
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('connected', function(result) {
                    assert(result);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();

                        resolve();
                    }
                });

            // Stage 1: Close & re-open server, trigger a new block
            await pify(server.close)();
            server = ganache.server({port: port, blockTime: 1});
            await pify(server.listen)(port);
            stage = 1;
        });
    });
});
