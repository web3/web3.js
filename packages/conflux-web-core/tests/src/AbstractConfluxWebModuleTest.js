import AbstractConfluxWebModule from '../../src/AbstractConfluxWebModule';
import MethodFactory from '../__mocks__/MethodFactory';

/**
 * AbstractConfluxWebModule test
 */
describe('AbstractConfluxWebModuleTest', () => {
    let abstractConfluxWebModule, methodFactoryMock;

    beforeEach(() => {
        methodFactoryMock = new MethodFactory();
        methodFactoryMock.hasMethod = jest.fn(() => {
            return false;
        });

        abstractConfluxWebModule = new AbstractConfluxWebModule(
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
        expect(abstractConfluxWebModule.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');

        expect(abstractConfluxWebModule.defaultBlock).toEqual('latest');

        expect(abstractConfluxWebModule.transactionBlockTimeout).toEqual(50);

        expect(abstractConfluxWebModule.transactionConfirmationBlocks).toEqual(24);

        expect(abstractConfluxWebModule.transactionPollingTimeout).toEqual(750);

        expect(abstractConfluxWebModule.defaultGasPrice).toEqual(100);

        expect(abstractConfluxWebModule.defaultGas).toEqual(100);

        expect(abstractConfluxWebModule.BatchRequest).toBeInstanceOf(Function);

        expect(abstractConfluxWebModule.currentProvider.host).toEqual('http://localhost:8545');
    });

    it('gets the BatchRequest property and it is of type BatchRequest', () => {
        const batchRequest = new abstractConfluxWebModule.BatchRequest();

        expect(batchRequest.constructor.name).toEqual('BatchRequest');

        expect(batchRequest.add).toBeInstanceOf(Function);
    });

    it('sets the defaultAccount property validates the address and throws error', () => {
        try {
            abstractConfluxWebModule.defaultAccount = '0';
        } catch (error) {
            expect(error.message).toEqual('Given address "0" is not a valid Conflux address.');
        }
    });

    it('sets the defaultAccount property and validates the address', () => {
        abstractConfluxWebModule.defaultAccount = '0x03c9a938ff7f54090d0d99e2c6f80380510ea078';
        expect(abstractConfluxWebModule.defaultAccount).toEqual('0x03C9A938fF7f54090d0d99e2c6f80380510Ea078');
    });

    it('sets the defaultBlock property', () => {
        abstractConfluxWebModule.defaultBlock = 'latest';
        expect(abstractConfluxWebModule.defaultBlock).toEqual('latest');
    });

    it('sets the transactionBlockTimeout property', () => {
        abstractConfluxWebModule.transactionBlockTimeout = 0;
        expect(abstractConfluxWebModule.transactionBlockTimeout).toEqual(0);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        abstractConfluxWebModule.transactionConfirmationBlocks = 0;
        expect(abstractConfluxWebModule.transactionConfirmationBlocks).toEqual(0);
    });

    it('sets the transactionPollingTimeout property', () => {
        abstractConfluxWebModule.transactionPollingTimeout = 0;
        expect(abstractConfluxWebModule.transactionPollingTimeout).toEqual(0);
    });

    it('sets the defaultGasPrice property', () => {
        abstractConfluxWebModule.defaultGasPrice = 0;
        expect(abstractConfluxWebModule.defaultGasPrice).toEqual(0);
    });

    it('sets the defaultGas property', () => {
        abstractConfluxWebModule.defaultGas = 0;
        expect(abstractConfluxWebModule.defaultGas).toEqual(0);
    });

    it('gets the currentProvider property who is read-only', () => {
        try {
            abstractConfluxWebModule.currentProvider = false;
        } catch (error) {
            expect(error.message).toEqual('The property currentProvider is read-only!');
        }
    });

    it('calls setProvider returns true and sets the provider as currentProvider', () => {
        expect(abstractConfluxWebModule.setProvider('http://newhost')).toEqual(true);

        expect(abstractConfluxWebModule.currentProvider.host).toEqual('http://newhost');
    });

    it('calls setProvider and throws an error because of the resolver', () => {
        expect(() => {
            abstractConfluxWebModule.setProvider({nope: true});
        }).toThrow('Invalid provider');
    });

    it('calls setProvider and returns false because of the equal host', () => {
        expect(abstractConfluxWebModule.setProvider('http://localhost:8545')).toEqual(false);
    });

    it('calls setProvider and returns false because it is the same provider', () => {
        expect(abstractConfluxWebModule.setProvider('http://localhost:8545')).toEqual(false);
    });

    it('calls isSameProvider and returns false', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'HOST1'
        };

        expect(abstractConfluxWebModule.isSameProvider(provider)).toEqual(false);
    });

    it('calls isSameProvider and returns true', () => {
        const provider = {
            constructor: {
                name: 'HttpProvider'
            },
            host: 'http://localhost:8545'
        };

        expect(abstractConfluxWebModule.isSameProvider(provider)).toEqual(true);
    });

    it('initiates a HttpProvider with the providers property of the module', () => {
        expect(new AbstractConfluxWebModule.providers.HttpProvider('http://localhost:7545', {}).host).toEqual(
            'http://localhost:7545'
        );
    });

    it('checks if all providers exists on the static providers property', () => {
        expect(AbstractConfluxWebModule.providers.HttpProvider).toBeInstanceOf(Function);
        expect(AbstractConfluxWebModule.providers.WebsocketProvider).toBeInstanceOf(Function);
        expect(AbstractConfluxWebModule.providers.IpcProvider).toBeInstanceOf(Function);
    });
});
