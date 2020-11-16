const assert = require('assert');
const ganache = require('ganache-cli');
const pify = require('pify');
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();

describe('WebsocketProvider (ganache)', function () {
    let web3;
    let server;
    const host = 'ws://localhost:';
    const port = 8545;

    afterEach(async function () {
        // Might already be closed..
        try {
            await pify(server.close)();
        } catch (err) {
        }
    });

    // This test's error is fired by the request queue checker in the onClose handler
    it('errors when there is no connection', async function () {
        web3 = new Web3(host + 8777);

        try {
            await web3.eth.getBlockNumber();
            assert.fail();
        } catch (err) {
            assert(err.code, 1006);
            assert(err.reason, 'connection failed');
            assert(err.message.includes('connection not open on send'));
        }
    });

    it('"error" handler fires if the client closes unilaterally', async function(){
        this.timeout(5000);

        server = ganache.server({port: port});
        await pify(server.listen)(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert(err.reason.includes('Connection dropped by remote peer.'));
                assert(err.code === 1006);
                resolve();
            });

            await pify(server.close)();
        })
    })

    it('"error" handler fires if Web3 disconnects with error code', async function(){
        this.timeout(5000);

        server = ganache.server({port: port});
        await pify(server.listen)(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert(err.reason.includes('restart'));
                assert(err.code === 1012);
                resolve();
            });

            web3.currentProvider.disconnect(1012, 'restart');
        })
    })

    it('"error" handler *DOES NOT* fire if disconnection is clean', async function(){
        this.timeout(5000);

        server = ganache.server({port: port});
        await pify(server.listen)(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve, reject){
            web3.currentProvider.once('error', function(err){
                reject('Should not fire error handler')
            });

            web3.currentProvider.disconnect(1000);
            await utils.waitSeconds(2)
            resolve();
        })
    })

    it('"end" handler fires with close event object if client disconnect', async function(){
        this.timeout(5000);

        server = ganache.server({port: port});
        await pify(server.listen)(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert.equal(err.type, 'close');
                assert.equal(err.wasClean, false);
                resolve();
            });

            await pify(server.close)();
        })
    })

    it('"end" handler fires with close event object if Web3 disconnects', async function(){
        this.timeout(5000);

        server = ganache.server({port: port});
        await pify(server.listen)(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert.equal(err.type, 'close');
                assert.equal(err.wasClean, true);
                resolve();
            });

            web3.currentProvider.disconnect(1000);
        })
    });

    // Here, the first error (try/caught) is fired by the request queue checker in
    // the onClose handler. The second error is fired by the readyState check in .send
    it('errors when requests continue after socket closed', async function () {
        web3 = new Web3(host + 8777);

        try { await web3.eth.getBlockNumber(); } catch (err) {
            assert(err.message.includes('connection not open on send'));
            assert(err.code, 1006);
            assert(err.reason, 'connection failed');

            try {
                await web3.eth.getBlockNumber();
                assert.fail();
            } catch (err){
                assert(err.message.includes('connection not open on send'));
                assert(typeof err.code === 'undefined');
                assert(typeof err.reason === 'undefined');
            }
        }
    });

    it('errors after client has disconnected', async function () {
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

        // Verify connection and disconnect
        await web3.eth.getBlockNumber();
        web3.currentProvider.disconnect();

        try {
            await web3.eth.getBlockNumber();
            assert.fail();
        } catch(err){
            assert(err.message.includes('connection not open on send'));
            assert(typeof err.code === 'undefined');
            assert(typeof err.reason === 'undefined');
        }
    });

    it('can connect after being disconnected', async function () {
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

        // Verify connection and disconnect
        await web3.eth.getBlockNumber();
        web3.currentProvider.disconnect();

        try { await web3.eth.getBlockNumber() } catch(e){}

        web3.currentProvider.connect();

        // This test fails unless there's a brief delay after
        // connecting again...
        await new Promise(resolve => {
            setTimeout(async function(){
                const blockNumber = await web3.eth.getBlockNumber();
                assert(blockNumber === 0);
                resolve();
            },100)
        });
    });

    it('supports subscriptions', async function () {
        assert(web3.eth.currentProvider.supportsSubscriptions());
    });

    it('times out when connection is lost mid-chunk', async function () {
        this.timeout(5000);
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {timeout: 1000}
                )
            );

        await new Promise(resolve => {
            web3.currentProvider.once('error', function(err){
                assert(err.message.includes('CONNECTION TIMEOUT: timeout of 1000 ms achived'));
                resolve();
            });

            web3.currentProvider._parseResponse('abc|--|dedf');
        });
    });

    it('manually reconnecting', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            let stage = 0;
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await pify(server.close)();
                    this.removeAllListeners();
                    resolve();
                }
            });
        });
    });

    it('calling of reconnect with auto-reconnecting activated', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            let stage = 0;
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(new Web3.providers.WebsocketProvider(
                host + port, {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await pify(server.close)();
                    this.removeAllListeners();
                    resolve();
                }
            });
        });
    });

    it('automatically connects as soon as the WS socket of the node is running', function () {
        return new Promise(async function (resolve) {
            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await pify(server.close)();
                resolve();
            });

            server = ganache.server({port: port});
            await pify(server.listen)(port);
        });
    });

    it('reached the max. configured attempts and throws the expected error', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await pify(server.close)();
            });

            web3.currentProvider.once('error', function (error) {
                assert(error.message.includes('Maximum number of reconnect attempts reached!'));
                resolve();
            });
        });
    });

    it('errors when call is made after max. configured attempts has elapsed', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1, delay: 1000,}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await pify(server.close)();
                await utils.waitSeconds(2);

                try {
                    await web3.eth.getBlockNumber();
                } catch (err) {
                    assert(err.message.includes('connection not open on send()'));
                    resolve();
                }
            });
        });
    });

    it('does not auto reconnect after max. configured attempts has elapsed', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1, delay: 1000,}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                // Close and then re-open server after
                // reconnection window has elapsed.
                await pify(server.close)();
                await utils.waitSeconds(2);
                await pify(server.listen)(port);

                try {
                    await web3.eth.getBlockNumber();
                } catch (err){
                    assert(err.message.includes('connection not open on send()'));
                    resolve();
                }

            });
        });
    });

    it('allows disconnection when reconnect is enabled', function () {
        this.timeout(6000);

        return new Promise(async function (resolve, reject) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                web3.currentProvider.disconnect();

                try {
                    await web3.eth.getBlockNumber();
                    assert.fail();
                } catch (err) {
                    await pify(server.close)();
                    assert(err.message.includes('connection not open on send'));
                    assert(typeof err.code === 'undefined');
                    assert(typeof err.reason === 'undefined');
                    resolve();
                }
            });
        });
    });

    // This test fails - the logic running in reconnect timeout doesn't know about the disconnect?
    it.skip('allows disconnection on lost connection, when reconnect is enabled', function () {
        this.timeout(6000);
        let stage = 0;

        return new Promise(async function (resolve, reject) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            //Shutdown server
            web3.currentProvider.on('connect', async function () {
                // Stay isolated, just in case;
                if (stage === 0){
                    await pify(server.close)();
                    web3.currentProvider.disconnect();
                    stage = 1;
                }
            });

            web3.currentProvider.on('error', function (error) {
                assert(error.message.includes('Maximum number of reconnect attempts reached!'));
                reject(new Error('Could not disconnect...'));
            });
        });
    });

    it('uses the custom configured delay on re-connect', function () {
        let timeout;
        this.timeout(4000);

        return new Promise(async function (resolve, reject) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, delay: 3000, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await pify(server.close)();
                timeout = setTimeout(function () {
                    reject(new Error('Test Failed: Configured delay is not applied!'));
                }, 3100);
            });

            web3.currentProvider.once('reconnect', function () {
                clearTimeout(timeout);
                resolve();
            });
        });
    });


    it('clears pending requests on maxAttempts failed reconnection', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await pify(server.close)();
            });

            web3.currentProvider.once('reconnect', async function () {
                try {
                    await web3.eth.getBlockNumber();
                    assert.fail();
                } catch (err) {
                    assert(err.message.includes('Maximum number of reconnect attempts'));
                    resolve();
                }
            });
        });
    });

    it('queues requests made while connection is lost / executes on reconnect', function () {
        this.timeout(10000);
        let stage = 0;

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, delay: 2000, maxAttempts: 5}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                if (stage === 0){
                    await pify(server.close)();
                    stage = 1;
                }
            });

            setTimeout(async function(){
                assert(stage === 1);

                const deferred = web3.eth.getBlockNumber();

                server = ganache.server({port: port});
                await pify(server.listen)(port);

                const blockNumber = await deferred;
                assert(blockNumber === 0);

                web3.currentProvider.removeAllListeners();
                resolve();
            },2500);
        });
    });

    it('errors when failing to reconnect after data is lost mid-chunk', async function () {
        this.timeout(7000);
        server = ganache.server({port: port});
        await pify(server.listen)(port);

        web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {
                        timeout: 1000,
                        reconnect: {
                            auto: true,
                            delay: 2000,
                            maxAttempts: 1,
                            onTimeout: true
                        }
                    }
                )
            );

        await new Promise(async resolve => {
            web3.currentProvider.once('error', function(err){
                assert(err.message.includes('Maximum number of reconnect attempts reached'));
                resolve();
            });

            await pify(server.close)();
            web3.currentProvider._parseResponse('abc|--|dedf');
        });
    });
});
