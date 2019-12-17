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

    it('subscribes with a callback', function(){
        let subscription;

        return new Promise(async function (resolve) {
            subscription = web3.eth
                .subscribe('newBlockHeaders', function(err, result){
                    assert(result.parentHash);
                    subscription.unsubscribe(); // Stop listening..
                    resolve();
            });
         })
    });

    it('resubscribes', function(){
        let subscription;

        return new Promise(async function (resolve) {
            subscription = web3.eth.subscribe('newBlockHeaders');
            subscription.unsubscribe();
            subscription.resubscribe()

            subscription.on('data', function(result){
                console.log(result.parentHash)
                assert(result.parentHash);
                subscription.unsubscribe(); // Stop listening..
                resolve();
            })
         })
    });

    it('allows a subscription which does not exist', function(){
        web3.eth.subscribe('subscription-does-not-exists');
    });

    it('errors when zero params subscrip. is called with the wrong arguments', function(){
        try {
            web3.eth.subscribe('newBlockHeaders', 5);
            assert.fail();
        } catch (err) {
            assert(err.message.includes('Invalid number of parameters for "newHeads"'))
            assert(err.message.includes('Got 1 expected 0'));
        }
    });

    // Could not get the .on('error') version of this to work - maybe a race condition setting it up.
    it('errors when the provider is not set', function(){
        web3 = new Web3();

        return new Promise(async function (resolve) {
            web3.eth.subscribe('newBlockHeaders', function(err, result){
                assert(err.message.includes('No provider set'));
                resolve()
            })
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
            // Stage 0:
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

            // Stage 1: Close & re-open server
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
            // Stage 0:
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

            // Stage 1: Close & re-open server
            await pify(server.close)();
            server = ganache.server({port: port, blockTime: 1});
            await pify(server.listen)(port);
            stage = 1;
        });
    });
});
