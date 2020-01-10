const assert = require('assert');
const ganache = require('ganache-cli');
const pify = require('pify');
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();

describe('WebsocketProvider reconnecting', function () {
    let web3;
    let server;
    const port = 8545;

    it('manually reconnecting', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            let stage = 0;
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:' + port));

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await pify(server.close)();
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
                'ws://localhost:' + port, {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await pify(server.close)();
                    resolve();
                }
            });
        });
    });

    it('automatically connects as soon as the WS socket of the node is running', function () {
        return new Promise(async function (resolve) {
            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    'ws://localhost:' + port,
                    {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.on('connect', async function () {
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
                    'ws://localhost:' + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                await pify(server.close)();
            });

            web3.currentProvider.on('error', function (error) {
                assert(error.message.includes('Maximum number of reconnect attempts reached!'));
                resolve();
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
                    'ws://localhost:' + port,
                    {reconnect: {auto: true, delay: 3000, maxAttempts: 1}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                await pify(server.close)();
                timeout = setTimeout(function () {
                    reject(new Error('Test Failed: Configured delay is not applied!'));
                }, 3100);
            });

            web3.currentProvider.on('reconnect', function () {
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
                    'ws://localhost:' + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                await pify(server.close)();
            });

            web3.currentProvider.on('reconnect', async function () {
                try {
                    await web3.eth.getBlockNumber();
                    assert.fail();
                } catch (err) {
                    assert(err.message.includes('Maximum number of reconnect attempts'))
                    resolve();
                }
            });
        });
    });

    it('queues requests made while connection is lost / executes on reconnect', function () {
        this.timeout(6000);
        let stage = 0;

        return new Promise(async function (resolve) {
            server = ganache.server({port: port});
            await pify(server.listen)(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    'ws://localhost:' + port,
                    {reconnect: {auto: true, delay: 1000, maxAttempts: 3}}
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

                await pify(server.close)();
                resolve();
            },1500);
        });
    });
});
