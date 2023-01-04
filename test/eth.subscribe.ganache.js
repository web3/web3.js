const assert = require('assert');
const ganache = require('ganache');
const { getWeb3, waitSeconds } = require('./helpers/test.utils');

describe('subscription connect/reconnect', function () {
    let server;
    let web3;
    let accounts;
    let subscription;
    const port = 8545;
    const Web3 = getWeb3();

    beforeEach(async function () {
        server = ganache.server({ miner: { blockTime: 1 }, server: { ws: true } });
        await server.listen(port,async err => {
            if (err) throw err;

        });

        web3 = new Web3('ws://localhost:' + port);
        accounts = await web3.eth.getAccounts();
    });

    afterEach(async function () {
        // Might already be closed..
        try {
            await server.close();
        } catch (err) {
        }
    });

    it('subscribes (baseline)', function (done) {
        web3.eth
            .subscribe('newBlockHeaders')
            .once('data', function (result) {
                assert(result.parentHash);
                done();
            });
    });

    it('subscribes with a callback', function (done) {
        subscription = web3.eth
            .subscribe('newBlockHeaders', function (err, result) {
                assert(result.parentHash);
                subscription.unsubscribe(); // Stop listening..
                done();
            });
    });

    it('subscription emits a connected event', function (done) {
        subscription = web3.eth
            .subscribe('newBlockHeaders')
            .on('connected', function (result) {
                assert(result);             // First subscription
                subscription.unsubscribe(); // Stop listening..
                done();
            });
    });

    it('unsubscribe should remove the subscription object from the subscriptions and send eth_unsubscribe to the node', function (done) {
        subscription = web3.eth
            .subscribe('newBlockHeaders')
            .on('connected', function () {
                const id = subscription.id;
                assert(subscription.options.requestManager.subscriptions.has(id));
                subscription.unsubscribe(); // Send eth_unsubscribe to the node
                assert(!subscription.options.requestManager.subscriptions.has(id));
                done();
            });
    });

    it('clearSubscriptions', async function() {
        web3.eth.subscribe('newBlockHeaders');
        await waitSeconds(1); // Sub need a little time to set up

        assert.equal(1, web3.eth._requestManager.subscriptions.size);
        assert.ok(web3.eth.clearSubscriptions())
        assert.equal(0, web3.eth._requestManager.subscriptions.size);
    });

    it('unsubscribes given an id', async function ( ) {
        subscription = web3.eth.subscribe('newBlockHeaders');
        await waitSeconds(1);

        assert.equal(1, web3.eth._requestManager.subscriptions.size);
        web3.eth.removeSubscriptionById(subscription.id)

        assert.equal(0, web3.eth._requestManager.subscriptions.size);
        
    })

    it('unsubscribes given an id with multiple subscriptions', async function () {

            subscription = web3.eth.subscribe('newBlockHeaders');
            subscription2 = web3.eth.subscribe("logs");
            await waitSeconds(1);
    
            assert.equal(2, web3.eth._requestManager.subscriptions.size);

            web3.eth.removeSubscriptionById(subscription.id);
            assert.equal(1, web3.eth._requestManager.subscriptions.size);

            web3.eth.removeSubscriptionById(subscription2.id);
            assert.equal(0, web3.eth._requestManager.subscriptions.size);

        })

    it('resubscribes to an existing subscription', function (done) {
        this.timeout(5000);

        let stage = 0;

        subscription = web3.eth.subscribe('newBlockHeaders');

        subscription.on('data', function (result) {
            if (stage === 0) {
                subscription.resubscribe();
                stage = 1;
                return;
            }

            assert(result.parentHash);
            subscription.unsubscribe(); // Stop listening..
            done();
        });
    });

    it('resubscribes after being unsubscribed', function (done) {
        this.timeout(5000);

        let stage = 0;

        subscription = web3.eth
            .subscribe('newBlockHeaders')
            .on('data', function (result) {
                assert(result.parentHash);
                subscription.unsubscribe();
                stage = 1;
            });

        // Resubscribe from outside
        let interval = setInterval(async function () {
            if (stage === 1) {
                clearInterval(interval);
                subscription.resubscribe();
                subscription.on('data', function (result) {
                    assert(result.parentHash);
                    subscription.unsubscribe(); // Stop listening..
                    done();
                });
            }
        }, 500);
    });

    // The ganache unit tests are erroring under similar conditions -
    it('does not error when client closes after disconnect', async function(){
        this.timeout(7000);

        return new Promise(async function(resolve, reject) {
            web3.eth
                .subscribe('newBlockHeaders')
                .once("error", function (err) {
                    reject(new Error('Should not hear an error '));
                });

            // Let a couple blocks mine..
            await waitSeconds(2)
            web3.currentProvider.disconnect();

            // This delay seems to be required (on Travis).
            await waitSeconds(1);

            await server.close();

            await waitSeconds(1)
            resolve();
        });
    });

    // Verify subscription cleanup on setProvider
    it('does not hear old subscriptions after setting a new provider', async function(){
        this.timeout(7000);
        let counter = 0;

        return new Promise(async function(resolve, reject) {
            web3.eth
                .subscribe('newBlockHeaders')
                .on("data", function (_) {
                    counter++;
                });

            // Let a couple blocks mine..
            await waitSeconds(2)
            assert(counter >= 1);

            // Connect to a different client;
            const newServer = ganache.server({ miner: { blockTime: 1 }});
            await newServer.listen(8777);

            const finalCount = counter;
            web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8777'));

            await waitSeconds(2);
            assert.equal(counter, finalCount);
            await newServer.close();
            resolve();
        });
    })

    it('allows a subscription which does not exist', function () {
        web3.eth.subscribe('subscription-does-not-exists');
    });

    it('errors when zero params subscrip. is called with the wrong arguments', function () {
        try {
            web3.eth.subscribe('newBlockHeaders', 5);
            assert.fail();
        } catch (err) {
            assert(err.message.includes('Invalid number of parameters for "newHeads"'));
            assert(err.message.includes('Got 1 expected 0'));
        }
    });

    it('errors when the provider is not set (callback)', function (done) {
        web3 = new Web3();

        web3.eth.subscribe('newBlockHeaders', function (err, result) {
            assert(err.message.includes('No provider set'));
            done();
        });
    });

    it('errors when the provider is not set (.on("error"))', function (done) {
        web3 = new Web3();

        web3.eth
            .subscribe('newBlockHeaders')
            .once("error", function (err) {
                assert(err.message.includes('No provider set'));
                done();
            });
    });

    it('errors when the provider does not support subscriptions (callback)', function (done) {
        web3 = new Web3('http://localhost:' + port);

        web3.eth.subscribe('newBlockHeaders', function (err, result) {
            assert(err.message.includes("provider doesn't support subscriptions: HttpProvider"));
            done();
        });
    });

    it('errors when the provider does not support subscriptions (.on("error"))', function (done) {
        web3 = new Web3('http://localhost:' + port);

        web3.eth
            .subscribe('newBlockHeaders')
            .once("error", function (err) {
                assert(err.message.includes("provider doesn't support subscriptions: HttpProvider"));
                done();
            });
    });

    it('errors when the `eth_subscribe` request got send, the reponse isnt returned from the node, and the connection does get closed in the mean time', async function () {
        await server.close();

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .once('error', function (err) {
                    assert(err.message.includes('connection not open on send()'));
                    resolve();
                });
        });
    });

    it('errors when the subscription got established (is running) and the connection does get closed', function () {
        this.timeout(5000);
        let counter = 0;

        return new Promise(async function (resolve) {
            web3.eth
                .subscribe('newBlockHeaders')
                .once('data', async function () {
                    await server.close();
                })

            web3.eth.currentProvider.on('close', function (err) {
                counter++;
                assert(err.reason.includes('Server closed by client'));
                assert(err.code === 1000);
            });

            // Make sure error handler doesn't fire twice
            await waitSeconds(2);
            assert.equal(counter, 1);
            web3.eth.currentProvider.removeAllListeners();
            resolve();
        });
    });

    it('auto reconnects and keeps the subscription running', function () {
        this.timeout(6000);

        web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:' + port, {reconnect: {auto: true}}));

        return new Promise(async function (resolve) {
            // Stage 0:
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('data', function (result) {
                    assert(result.parentHash);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();
                        this.removeAllListeners();
                        resolve();
                    }
                });

            // Stage 1: Close & re-open server
            await server.close();
            server = ganache.server({ miner: { blockTime: 1 }, server: { ws: true } });
           await server.listen(port);
            stage = 1;
        });
    });

    it('auto reconnects, keeps the subscription running and triggers the `connected` event listener twice', function () {
        this.timeout(6000);

        web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:' + port, {reconnect: {auto: true}}));

        return new Promise(async function (resolve) {
            // Stage 0:
            let stage = 0;

            web3.eth
                .subscribe('newBlockHeaders')
                .on('connected', function (result) {
                    assert(result);

                    // Exit point, flag set below
                    if (stage === 1) {
                        web3.currentProvider.disconnect();
                        this.removeAllListeners();
                        resolve();
                    }
                });

            // Stage 1: Close & re-open server
            await server.close();
            server = ganache.server({ miner: { blockTime: 1 }, server: { ws: true } });
           await server.listen(port);
            stage = 1;
        });
    });
});
