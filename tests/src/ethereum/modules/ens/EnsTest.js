import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {Network} from 'web3-net';
import {AbiCoder} from 'web3-eth-abi';
import Registry from '../../src/contracts/Registry';
import namehash from 'eth-ens-namehash';
import Ens from '../../src/Ens';
import EnsModuleFactory from '../../src/factories/EnsModuleFactory';

// Mocks
jest.mock('web3-net');
jest.mock('web3-utils');
jest.mock('web3-eth-abi');
jest.mock('web3-core-helpers');
jest.mock('eth-ens-namehash');
jest.mock('../../src/factories/EnsModuleFactory');
jest.mock('../../src/contracts/Registry');

/**
 * Ens test
 */
describe('EnsTest', () => {
    let ens, registryMock, ensModuleFactoryMock, abiCoderMock, networkMock;

    beforeEach(() => {
        new Registry();
        registryMock = Registry.mock.instances[0];

        new EnsModuleFactory();
        ensModuleFactoryMock = EnsModuleFactory.mock.instances[0];
        ensModuleFactoryMock.createRegistry.mockReturnValue(registryMock);

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new Network();
        networkMock = Network.mock.instances[0];

        namehash.hash = jest.fn(() => {
            return '0x0';
        });

        ens = new Ens(
            {send: jest.fn(), clearSubscriptions: jest.fn()},
            {},
            ensModuleFactoryMock,
            {},
            {},
            abiCoderMock,
            Utils,
            formatters,
            networkMock,
            {}
        );
    });

    it('constructor check', () => {
        expect(ens.registry).toEqual(registryMock);

        expect(ensModuleFactoryMock.createRegistry).toHaveBeenCalledWith(
            ens.currentProvider,
            ens.contractModuleFactory,
            ens.accounts,
            ens.abiCoder,
            ens.utils,
            ens.formatters,
            ens.registryOptions,
            ens.net
        );

        expect(ens.ensModuleFactory).toEqual(ensModuleFactoryMock);

        expect(ens.contractModuleFactory).toEqual({});

        expect(ens.abiCoder).toEqual(abiCoderMock);

        expect(ens.utils).toEqual(Utils);

        expect(ens.registryOptions).toEqual({});

        expect(ens.net).toEqual(networkMock);
    });

    it('sets the transactionSigner property', () => {
        ens._registry = {transactionSigner: true};

        ens.transactionSigner = {};

        expect(ens.transactionSigner).toEqual({});

        expect(ens.registry.transactionSigner).toEqual({});
    });

    it('sets the transactionSigner property and throws the expected error', () => {
        try {
            ens.transactionSigner = {type: 'TransactionSigner'};
        } catch (error) {
            expect(error).toEqual(new Error('Invalid TransactionSigner given!'));
        }
    });

    it('sets the defaultGasPrice property', () => {
        ens._registry = {defaultGasPrice: 0};

        ens.defaultGasPrice = 10;

        expect(ens.registry.defaultGasPrice).toEqual(10);

        expect(ens.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        ens._registry = {defaultGas: 0};

        ens.defaultGas = 10;

        expect(ens.registry.defaultGas).toEqual(10);

        expect(ens.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        ens._registry = {transactionBlockTimeout: 0};

        ens.transactionBlockTimeout = 10;

        expect(ens.registry.transactionBlockTimeout).toEqual(10);

        expect(ens.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        ens._registry = {transactionConfirmationBlocks: 0};

        ens.transactionConfirmationBlocks = 10;

        expect(ens.registry.transactionConfirmationBlocks).toEqual(10);

        expect(ens.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        ens._registry = {transactionPollingTimeout: 0};

        ens.transactionPollingTimeout = 10;

        expect(ens.registry.transactionPollingTimeout).toEqual(10);

        expect(ens.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        Utils.toChecksumAddress.mockReturnValueOnce('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        ens._registry = {defaultAccount: '0x0'};

        ens.defaultAccount = '0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B';

        expect(ens.defaultAccount).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(ens.registry.defaultAccount).toEqual('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x6d6dC708643A2782bE27191E2ABCae7E1B0cA38B');
    });

    it('sets the defaultBlock property', () => {
        ens._registry = {defaultBlock: '0x0'};

        ens.defaultBlock = '0x1';

        expect(ens.registry.defaultBlock).toEqual('0x1');

        expect(ens.defaultBlock).toEqual('0x1');
    });

    it('calls resolver and returns with a resolved promise', async () => {
        registryMock.resolver.mockReturnValueOnce(Promise.resolve(true));

        await expect(ens.resolver('name')).resolves.toEqual(true);
    });

    it('calls supportsInterface and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve(true);
        });

        const resolver = {
            methods: {
                supportsInterface: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.supportsInterface('name', 'interfaceId', () => {})).resolves.toEqual(true);

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.supportsInterface).toHaveBeenCalled();
    });

    it('calls getAddress and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('address');
        });

        const resolver = {
            methods: {
                addr: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getAddress('name', () => {})).resolves.toEqual('address');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.addr).toHaveBeenCalled();
    });

    it('calls setAddress and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setAddr: jest.fn((address) => {
                    expect(address).toEqual('0x0');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setAddress('name', '0x0', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setAddress and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setAddr: jest.fn((address) => {
                    expect(address).toEqual('0x0');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setAddress('name', '0x0', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls getPubkey and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('pubkey');
        });

        const resolver = {
            methods: {
                pubkey: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getPubkey('name', () => {})).resolves.toEqual('pubkey');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.pubkey).toHaveBeenCalled();
    });

    it('calls setPubkey and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setPubkey: jest.fn((node, x, y) => {
                    expect(node).toEqual('0x0');

                    expect(x).toEqual('x');

                    expect(y).toEqual('y');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setPubkey('name', 'x', 'y', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setPubkey and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setPubkey: jest.fn((node, x, y) => {
                    expect(node).toEqual('0x0');

                    expect(x).toEqual('x');

                    expect(y).toEqual('y');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setPubkey('name', 'x', 'y', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls getText and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('text');
        });

        const resolver = {
            methods: {
                text: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getText('name', 'key', () => {})).resolves.toEqual('text');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.text).toHaveBeenCalled();
    });

    it('calls setText and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setText: jest.fn((node, x, y) => {
                    expect(node).toEqual('0x0');

                    expect(x).toEqual('key');

                    expect(y).toEqual('value');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setText('name', 'key', 'value', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setText and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setText: jest.fn((node, x, y) => {
                    expect(node).toEqual('0x0');

                    expect(x).toEqual('key');

                    expect(y).toEqual('value');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setText('name', 'key', 'value', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls getContent and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('content');
        });

        const resolver = {
            methods: {
                content: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getContent('name', () => {})).resolves.toEqual('content');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.content).toHaveBeenCalled();
    });

    it('calls setContent and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setContent: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContent('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setContent and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setContent: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContent('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls getMultihash and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('content');
        });

        const resolver = {
            methods: {
                multihash: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getMultihash('name', () => {})).resolves.toEqual('content');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.multihash).toHaveBeenCalled();
    });

    it('calls setMultihash and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setMultihash: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setMultihash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setMultihash and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setMultihash: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setMultihash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls getContenthash and returns a resolved promise', async () => {
        const call = jest.fn((callback) => {
            expect(callback).toBeInstanceOf(Function);

            return Promise.resolve('content');
        });

        const resolver = {
            methods: {
                contenthash: jest.fn(() => {
                    return {call: call};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        await expect(ens.getContenthash('name', () => {})).resolves.toEqual('content');

        expect(registryMock.resolver).toHaveBeenCalledWith('name');

        expect(resolver.methods.contenthash).toHaveBeenCalled();
    });

    it('calls setContenthash and returns a resolved PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setContenthash: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContenthash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({});

            expect(callback).toHaveBeenCalledWith(receipt);
        });

        await expect(promiEvent).resolves.toEqual({});

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setContenthash and returns a rejected PromiEvent', async () => {
        const promiEventEvents = ['transactionHash', 'confirmation', 'receipt', 'error'];
        let promiEventOnCounter = 0;

        const callback = jest.fn();

        const send = jest.fn((sendOptions) => {
            expect(sendOptions).toEqual({});

            const promiEvent = {
                on: jest.fn((event, callback) => {
                    expect(event).toEqual(promiEventEvents[promiEventOnCounter]);

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
                setContenthash: jest.fn((node, hash) => {
                    expect(node).toEqual('0x0');

                    expect(hash).toEqual('hash');

                    return {send: send};
                })
            }
        };

        registryMock.resolver.mockReturnValueOnce(Promise.resolve(resolver));

        const promiEvent = ens.setContenthash('name', 'hash', {}, callback);

        promiEvent.on('transactionHash', (transactionHash) => {
            expect(transactionHash).toEqual('hash');
        });

        promiEvent.on('confirmation', (confirmationNumber, receipt) => {
            expect(confirmationNumber).toEqual(0);

            expect(receipt).toEqual({});
        });

        promiEvent.on('error', (error) => {
            expect(error).toEqual(false);

            expect(callback).toHaveBeenCalledWith(error);
        });

        await expect(promiEvent).rejects.toEqual(false);

        expect(callback).toHaveBeenCalled();

        expect(namehash.hash).toHaveBeenCalledWith('name');
    });

    it('calls setProvider and returns true', () => {
        const providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};

        registryMock.setProvider.mockReturnValueOnce(true);

        expect(ens.setProvider(providerMock, 'net')).toEqual(true);

        expect(registryMock.setProvider).toHaveBeenCalledWith(providerMock, 'net');
    });
});
