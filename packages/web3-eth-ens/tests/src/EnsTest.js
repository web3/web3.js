import {PromiEvent} from 'web3-core-promievent';
import {HttpProvider, ProvidersModuleFactory} from 'web3-providers';
import {MethodModuleFactory} from 'web3-core-method';
import Registry from '../../src/contracts/Registry';
import Ens from '../../src/Ens';

// Mocks
jest.mock('../../src/contracts/Registry');
jest.mock('ProvidersModuleFactory');
jest.mock('HttpProvider');
jest.mock('MethodModuleFactory');

/**
 * Ens test
 */
describe('EnsTest', () => {
    let ens,
        providerMock,
        providersModuleFactoryMock,
        methodModuleFactoryMock,
        registryMock;

    beforeEach(() => {
        new HttpProvider();
        providerMock = HttpProvider.mock.instances[0];

        new ProvidersModuleFactory();
        providersModuleFactoryMock = ProvidersModuleFactory.mock.instances[0];

        new MethodModuleFactory();
        methodModuleFactoryMock = MethodModuleFactory.mock.instances[0];

        new Registry();
        registryMock = Registry.mock.instances[0];
        registryMock.PromiEvent = PromiEvent;

        providersModuleFactoryMock.createProviderDetector
            .mockReturnValueOnce({detect: jest.fn()});

        providersModuleFactoryMock.createProviderResolver
            .mockReturnValueOnce({resolve: jest.fn()});

        ens = new Ens(providerMock, providersModuleFactoryMock, methodModuleFactoryMock, {}, registryMock);
    });

    it('constructor check', () => {
        expect(ens.registry)
            .toEqual(registryMock);
    });

    it('calls resolver and returns with a resolved promise', async () => {
        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(true));

        await expect(ens.resolver('name')).resolves
            .toEqual(true);
    });

    it('calls getAddress and returns a resolved promise', async () => {
        const call = jest.fn(callback => {
            expect(callback)
                .toBeInstanceOf(Function);

            return Promise.resolve('address');
        });

        const resolver = {
            methods: {
                addr: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getAddress('name', () => {})).resolves
            .toEqual('address');

        expect(registryMock.resolver)
            .toHaveBeenCalledWith('name');

        expect(resolver.methods.addr)
            .toHaveBeenCalled();
    });

    it('calls setAddress and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 2:
                            setTimeout(() => {
                                callback({});
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setAddr: jest.fn(address => {
                    expect(address)
                        .toEqual('0x0');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setAddress('name', '0x0', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('receipt', receipt => {
            expect(receipt)
                .toEqual({});

            expect(callback)
                .toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves
            .toEqual({});

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls setAddress and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 3:
                            setTimeout(() => {
                                callback(false);
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setAddr: jest.fn(address => {
                    expect(address)
                        .toEqual('0x0');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setAddress('name', '0x0', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('error', error => {
            expect(error)
                .toEqual(false);

            expect(callback)
                .toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects
            .toEqual(false);

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls getPubkey and returns a resolved promise', async () => {
        const call = jest.fn(callback => {
            expect(callback)
                .toBeInstanceOf(Function);

            return Promise.resolve('pubkey');
        });

        const resolver = {
            methods: {
                pubkey: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getPubkey('name', () => {})).resolves
            .toEqual('pubkey');

        expect(registryMock.resolver)
            .toHaveBeenCalledWith('name');

        expect(resolver.methods.pubkey)
            .toHaveBeenCalled();
    });

    it('calls setPubkey and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 2:
                            setTimeout(() => {
                                callback({});
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setPubkey: jest.fn((x, y) => {
                    expect(x)
                        .toEqual('x');

                    expect(y)
                        .toEqual('y');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setPubkey('name', 'x', 'y', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('receipt', receipt => {
            expect(receipt)
                .toEqual({});

            expect(callback)
                .toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves
            .toEqual({});

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls setPubkey and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 3:
                            setTimeout(() => {
                                callback(false);
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setPubkey: jest.fn((x, y) => {
                    expect(x)
                        .toEqual('x');

                    expect(y)
                        .toEqual('y');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setPubkey('name', 'x', 'y', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('error', error => {
            expect(error)
                .toEqual(false);

            expect(callback)
                .toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects
            .toEqual(false);

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls getContent and returns a resolved promise', async () => {
        const call = jest.fn(callback => {
            expect(callback)
                .toBeInstanceOf(Function);

            return Promise.resolve('content');
        });

        const resolver = {
            methods: {
                content: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getContent('name', () => {})).resolves
            .toEqual('content');

        expect(registryMock.resolver)
            .toHaveBeenCalledWith('name');

        expect(resolver.methods.content)
            .toHaveBeenCalled();
    });

    it('calls setContent and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 2:
                            setTimeout(() => {
                                callback({});
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setContent: jest.fn(hash => {
                    expect(hash)
                        .toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContent('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('receipt', receipt => {
            expect(receipt)
                .toEqual({});

            expect(callback)
                .toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves
            .toEqual({});

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls setContent and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 3:
                            setTimeout(() => {
                                callback(false);
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setContent: jest.fn(hash => {
                    expect(hash)
                        .toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContent('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('error', error => {
            expect(error)
                .toEqual(false);

            expect(callback)
                .toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects
            .toEqual(false);

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls getMultihash and returns a resolved promise', async () => {
        const call = jest.fn(callback => {
            expect(callback)
                .toBeInstanceOf(Function);

            return Promise.resolve('content');
        });

        const resolver = {
            methods: {
                multihash: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getMultihash('name', () => {})).resolves
            .toEqual('content');

        expect(registryMock.resolver)
            .toHaveBeenCalledWith('name');

        expect(resolver.methods.multihash)
            .toHaveBeenCalled();
    });

    it('calls setMultihash and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 2:
                            setTimeout(() => {
                                callback({});
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setMultihash: jest.fn(hash => {
                    expect(hash)
                        .toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setMultihash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('receipt', receipt => {
            expect(receipt)
                .toEqual({});

            expect(callback)
                .toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves
            .toEqual({});

        expect(callback)
            .toHaveBeenCalled();
    });

    it('calls setMultihash and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn(sendOptions => {
            expect(sendOptions)
                .toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event)
                        .toEqual(promiEventEvents[promiEventOnCounter]);

                    switch (promiEventOnCounter) {
                        case 0:
                            setTimeout(() => {
                                callback('hash');
                            }, 1);
                            break;
                        case 1:
                            setTimeout(() => {
                                callback(0, {});
                            }, 1);
                            break;
                        case 3:
                            setTimeout(() => {
                                callback(false);
                            }, 1);
                            break;
                    }

                    promiEventOnCounter++;

                    return promiEvent;
                })
            };

            return promiEvent;
        });

        const resolver = {
            methods: {
                setMultihash: jest.fn(hash => {
                    expect(hash)
                        .toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver
            .mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setMultihash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', transactionHash => {
            expect(transactionHash)
                .toEqual('hash');
        });

        promiEvent.on('confirmation',  (confirmationNumber, receipt) => {
            expect(confirmationNumber)
                .toEqual(0);

            expect(receipt)
                .toEqual({});
        });

        promiEvent.on('error', error => {
            expect(error)
                .toEqual(false);

            expect(callback)
                .toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects
            .toEqual(false);

        expect(callback)
            .toHaveBeenCalled();
    });
});
