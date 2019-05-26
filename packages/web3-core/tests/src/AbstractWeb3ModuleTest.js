import AbstractWeb3Module from '../../src/AbstractWeb3Module';
import MethodFactory from '../__mocks__/MethodFactory';

/**
 * AbstractWeb3Module test
 */
describe('AbstractWeb3ModuleTest', () => {
    let abstractWeb3Module, methodFactoryMock;

    beforeEach(() => {
        methodFactoryMock = new MethodFactory();
        methodFactoryMock.hasMethod = jest.fn(() => {
            return false;
        });

        abstractWeb3Module = new AbstractWeb3Module(
            'http://localhost:8545',
            {
                defaultAccount: '0x03c9a938ff7f54090d0d99e2c6f80380510ea078',
                defaultBlock: 'latest',
                defaultGasPrice: 100,
                defaultGas: 100
            },
            methodFactoryMock,
            {}
        );
    });

    it('constructor check', () => {
        expect(abstractWeb3Module.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');

        expect(abstractWeb3Module.defaultBlock).toEqual('latest');

        expect(abstractWeb3Module.transactionBlockTimeout).toEqual(50);

        expect(abstractWeb3Module.transactionConfirmationBlocks).toEqual(24);

        expect(abstractWeb3Module.transactionPollingTimeout).toEqual(750);

        expect(abstractWeb3Module.defaultGasPrice).toEqual(100);

        expect(abstractWeb3Module.defaultGas).toEqual(100);

        expect(abstractWeb3Module.BatchRequest).toBeInstanceOf(Function);

        expect(abstractWeb3Module.currentProvider.host).toEqual('http://localhost:8545');
    });

    it('gets the BatchRequest property and it is of type BatchRequest', () => {
        const batchRequest = new abstractWeb3Module.BatchRequest();

        expect(batchRequest.constructor.name).toEqual('BatchRequest');

        expect(batchRequest.add).toBeInstanceOf(Function);
    });

    it('sets the defaultAccount property validates the address and throws error', () => {
        try {
            abstractWeb3Module.defaultAccount = '0';
        } catch (error) {
            expect(error.message).toEqual('Given address "0" is not a valid Ethereum address.');
        }
    });

    it('sets the defaultAccount property and validates the address', () => {
        abstractWeb3Module.defaultAccount = '0x03c9a938ff7f54090d0d99e2c6f80380510ea078';
        expect(abstractWeb3Module.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');
    });

    it('sets the defaultBlock property', () => {
        abstractWeb3Module.defaultBlock = 'latest';
        expect(abstractWeb3Module.defaultBlock).toEqual('latest');
    });

    it('sets the transactionBlockTimeout property', () => {
        abstractWeb3Module.transactionBlockTimeout = 0;
        expect(abstractWeb3Module.transactionBlockTimeout).toEqual(0);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        abstractWeb3Module.transactionConfirmationBlocks = 0;
        expect(abstractWeb3Module.transactionConfirmationBlocks).toEqual(0);
    });

    it('sets the transactionPollingTimeout property', () => {
        abstractWeb3Module.transactionPollingTimeout = 0;
        expect(abstractWeb3Module.transactionPollingTimeout).toEqual(0);
    });

    it('sets the defaultGasPrice property', () => {
        abstractWeb3Module.defaultGasPrice = 0;
        expect(abstractWeb3Module.defaultGasPrice).toEqual(0);
    });

    it('sets the defaultGas property', () => {
        abstractWeb3Module.defaultGas = 0;
        expect(abstractWeb3Module.defaultGas).toEqual(0);
    });

    it('gets the currentProvider property who is read-only', () => {
        try {
            abstractWeb3Module.currentProvider = false;
        } catch (error) {
            expect(error.message).toEqual('The property currentProvider is read-only!');
        }
    });

    it('calls setProvider returns true and sets the provider as currentProvider', () => {
        expect(abstractWeb3Module.setProvider('http://newhost')).toEqual(true);

        expect(abstractWeb3Module.currentProvider.host).toEqual('http://newhost');
    });

    it('calls setProvider and throws an error because of the resolver', () => {
        expect(() => {
            abstractWeb3Module.setProvider({nope: true});
        }).toThrow('Invalid provider');
    });

    it('calls setProvider and returns false because of the equal host', () => {
        expect(abstractWeb3Module.setProvider('http://localhost:8545')).toEqual(false);
    });

    it('calls setProvider and returns false because it is the same provider', () => {
        expect(abstractWeb3Module.setProvider('http://localhost:8545')).toEqual(false);
    });

    it('calls isSameProvider without a currentProvider set and returns false', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'HOST1'
        };

        abstractWeb3Module.setProvider(false);
        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(false);
    });

    it('calls isSameProvider and returns false', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'HOST1'
        };

        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(false);
    });

    it('calls isSameProvider and returns true', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'http://localhost:8545'
        };

        expect(abstractWeb3Module.isSameProvider(provider)).toEqual(true);
    });

    it('initiates a HttpProvider with the providers property of the module', () => {
        expect(new AbstractWeb3Module.providers.HttpProvider('http://localhost:7545', {}).host).toEqual(
            'http://localhost:7545'
        );
    });

    it('checks if all providers exists on the static providers property', () => {
        expect(AbstractWeb3Module.providers.HttpProvider).toBeInstanceOf(Function);
        expect(AbstractWeb3Module.providers.WebsocketProvider).toBeInstanceOf(Function);
        expect(AbstractWeb3Module.providers.IpcProvider).toBeInstanceOf(Function);
    });
});
