const assert = require('assert');
const ganache = require('ganache');
const utils = require('./helpers/test.utils');
const Web3 = utils.getWeb3();

const { spawn } = require('child_process');

const intervalTime = 1000; // ms

const ganacheOptions = { Chain: {hardfork: 'muirGlacier'}, server: { ws: true } };
const waitForOpenConnection = async (
	server,
	currentAttempt = 1,
    maxNumberOfAttempts = 5,
	status = 4, //connected
) =>
	new Promise((resolve, reject) => {
		const interval = setInterval(() => {
            if(server === undefined){
				clearInterval(interval);
                reject();
                return;
            }

			if (currentAttempt > maxNumberOfAttempts - 1) {
				clearInterval(interval);
				reject(new Error('Maximum number of attempts exceeded'));
			}
            else if (
				server.status === status
			) {
				clearInterval(interval);
				resolve(true);
                return;
			}
            else if(
                status <8  && //we are waiting for ready, opening, open
                server.status >= 8 // 8:closed, 16: closing
            );
            {
				clearInterval(interval);
                resolve(false);
            };

			// eslint-disable-next-line no-plusplus, no-param-reassign
			currentAttempt++;
		}, intervalTime);
	});

describe('WebsocketProvider (ganache)', function () {
    let web3;
    let server;
    const host = 'ws://localhost:';
    const port = 8545;

    afterEach(async function () {
        // Might already be closed..
        try {
            await waitForOpenConnection(server);
            await server.close();
        } catch (err) {
        }
    })

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

        server = ganache.server(ganacheOptions)
        await server.listen(port,async err => {
            if (err) throw err
        }
    );

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert(err.reason.includes('Server closed'));
                assert(err.code === 1000);
                resolve();
            });

            await server.close();
        });
    });

    it('"error" handler fires if Web3 disconnects with error code', async function(){
        this.timeout(5000);

        server = ganache.server(ganacheOptions);
        await server.listen(port);

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
        });
    });

    it('"error" handler *DOES NOT* fire if disconnection is clean', async function(){
        this.timeout(5000);

        server = ganache.server(ganacheOptions);
        await server.listen(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve, reject){
            web3.currentProvider.once('error', function(err){
                reject('Should not fire error handler')
            });

            web3.currentProvider.disconnect(1000);
            await utils.waitSeconds(2);
            resolve();
        });
    });

    it('"end" handler fires with close event object if client disconnect', async function(){
        this.timeout(5000);

        server = ganache.server(ganacheOptions);
        await server.listen(port);


        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert(err.type, 'close');
                assert(err.wasClean, true);
                resolve();
            })

            await server.close();
        });
    });

    it('"end" handler fires with close event object if Web3 disconnects', async function(){
        this.timeout(5000);

        server = ganache.server(ganacheOptions);
        await server.listen(port);

        // Open and verify connection
        web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));
        await web3.eth.getBlockNumber();

        await new Promise(async function(resolve){
            web3.currentProvider.on('close', function (err) {
                assert(err.type, 'close');
                assert(err.wasClean, true);
                resolve();
            })

            web3.currentProvider.disconnect(1000);
        })
    })
    
    it('"end" handler fires with close event object if Web3 disconnects', async function(){
        this.timeout(5000);
        server = ganache.server({ server: { ws: false, http: true } });
        await server.listen(port);

        const web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

        web3.currentProvider.on('error',(err)=>{
            assert(err.description.includes('Server responded with a non-101 status'));
        })
    })

    // Here, the first error (try/caught) is fired by the request queue checker in
    // the onClose handler. The second error is fired by the readyState check in .send
    it('errors when requests continue after socket closed', async function () {
        web3 = new Web3(host + 8777);

        try { await web3.eth.getBlockNumber() } catch (err) {
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
        server = ganache.server(ganacheOptions);
        await server.listen(port);

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
        server = ganache.server(ganacheOptions);
        await server.listen(port);

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
            }, 100);
        });
    });

    it('supports subscriptions', async function () {
        web3 = new Web3(host + port); // TODO why is this was working without this line?
        assert(web3.eth.currentProvider.supportsSubscriptions());
    });

    it('times out when connection is lost mid-chunk', async function () {
        this.timeout(5000);
        server = ganache.server(ganacheOptions);
        await server.listen(port);

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
            server = ganache.server(ganacheOptions);
            await server.listen(port);

            web3 = new Web3(new Web3.providers.WebsocketProvider(host + port));

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await server.close();
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
            server = ganache.server(ganacheOptions);
            await server.listen(port);

            web3 = new Web3(new Web3.providers.WebsocketProvider(
                host + port, {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                if (stage === 0) {
                    web3.currentProvider.reconnect();
                    stage = 1;
                } else {
                    await server.close();
                    this.removeAllListeners();
                    resolve();
                }
            });
        });
    });

    it('automatically connects as soon as the WS socket of the node is running', async function () {
        return new Promise(async function (resolve) {
            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                resolve();
            });

            server = ganache.server(ganacheOptions);
            await server.listen(port);
        });
    });

    it('reached the max. configured attempts and throws the expected error', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {

            // try to connect to closed server
            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('error', function (error) {
                assert(error.message.includes('Maximum number of reconnect attempts reached!'));
                resolve();
            });
        });
    });

    it('errors when call is made after max. configured attempts has elapsed', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server(ganacheOptions);
            await server.listen(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1, delay: 1000,}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                await server.close()
                await utils.waitSeconds(2)

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
        this.timeout(10000);

        return new Promise(async function (resolve) {
            server = ganache.server(ganacheOptions );
            await server.listen(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1, delay: 1000,}}
                )
            );

            web3.currentProvider.once('close', async function () {
                // Close and then re-open server after
                // reconnection window has elapsed.
                server = ganache.server(ganacheOptions);
                await server.listen(port);

                try {
                    await web3.eth.getBlockNumber();
                } catch (err){
                    assert(err.message.includes('connection not open on send()'));
                    resolve();
                }

            })
            await waitForOpenConnection(server);
            await server.close();
        });
    });

    it('allows disconnection when reconnect is enabled', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {
            server = ganache.server(ganacheOptions);
            await server.listen(port);

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
                    await server.close();
                    assert(err.message.includes('connection not open on send'));
                    assert(typeof err.code === 'undefined');
                    assert(typeof err.reason === 'undefined');
                    resolve();
                }
            });
        });
    });

    it('allows disconnection on lost connection, when reconnect is enabled', function () {
        this.timeout(6000);
        let stage = 0;

        return new Promise(async function (resolve) {
            server = ganache.server(ganacheOptions)
           await server.listen(port)

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            )

            //Shutdown server
            web3.currentProvider.on('connect', async function () {
                // Stay isolated, just in case
                if (stage === 0){
                    await server.close()
                    stage = 1
                    web3.currentProvider.disconnect(1012, 'close')
                }
            })
            web3.currentProvider.on('close', function (err) {
                assert(err.code, 1012)
                resolve();
            });
        });
    });

    it('uses the custom configured delay on re-connect', function () {
        let timeout
        this.timeout(4000)

        return new Promise(async function (resolve, reject) {
            const child = spawn('ganache');

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, delay: 3000, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('connect', async function () {
                timeout = setTimeout(function () {
                    reject(new Error('Test Failed: Configured delay is not applied!'))
                }, 3100);
            });

            web3.currentProvider.once('reconnect', async function () {
                child.kill();
                clearTimeout(timeout);
                resolve();
            });
        });
    });


    it('clears pending requests on maxAttempts failed reconnection', function () {
        this.timeout(6000);

        return new Promise(async function (resolve) {

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, maxAttempts: 1}}
                )
            );

            web3.currentProvider.once('reconnect', async function () {
                try {
                    await web3.eth.getBlockNumber()
                    assert.fail();
                } catch (err) {
                    assert(err.message.includes('Maximum number of reconnect attempts'));
                    resolve();
                }
            })
        })
    });

    it('queues requests made while connection is lost / executes on reconnect', function () {
        this.timeout(10000);
        let stage = 0;

        return new Promise(async function (resolve, reject) {
            server = ganache.server(ganacheOptions);
            await server.listen(port);

            web3 = new Web3(
                new Web3.providers.WebsocketProvider(
                    host + port,
                    {reconnect: {auto: true, delay: 2000, maxAttempts: 5}}
                )
            );

            web3.currentProvider.on('connect', async function () {
                if (stage === 0){
                    await server.close();
                    stage = 1;
                }
            });

            setTimeout(async function(){
                assert(stage === 1);
                let blockNumber;
                // manually reconnect so we don't error out
                web3.currentProvider.reconnect();
                const deferred = web3.eth.getBlockNumber();
                server = ganache.server(ganacheOptions);
                await server.listen(port);
                try {
                    blockNumber = await deferred;
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
                web3.currentProvider.removeAllListeners();

            }, 1000);
        });
    });

    it('errors when failing to reconnect after data is lost mid-chunk', async function () {
        this.timeout(7000)
        server = ganache.server(ganacheOptions)
        await server.listen(port)

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

            await server.close();
            web3.currentProvider._parseResponse('abc|--|dedf');
        });
    });
})
