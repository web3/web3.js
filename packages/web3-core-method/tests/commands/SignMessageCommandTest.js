import MessageSigner from '../../src/signers/MessageSigner';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {AbstractWeb3Module} from 'web3-core';
import {SocketProviderAdapter} from 'web3-providers';

// Mocks
jest.mock('../../src/signers/MessageSigner');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('AbstractWeb3Module');
jest.mock('SocketProviderAdapter');

/**
 * SignMessageCommand test
 */
describe('SignMessageCommandTest', () => {
    let signMessageCommand,
        methodModel,
        methodModelMock,
        moduleInstance,
        moduleInstanceMock,
        providerAdapter,
        providerAdapterMock,
        messageSigner,
        messageSignerMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = AbstractMethodModel.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        messageSigner = new MessageSigner();
        messageSignerMock =  MessageSigner.mock.instances[0];

        signMessageCommand = new SignMessageCommand(messageSignerMock);
    });

    it('calls execute and returns signed message', (done) => {
        methodModelMock.parameters = ['string', '0x0'];

        methodModelMock.callback = (error, response) => {
            expect(error).toBe(false);
            expect(response).toBe('0x0');

            done();
        };

        messageSignerMock.sign
            .mockReturnValueOnce('0x00');

        methodModelMock.afterExecution
            .mockReturnValueOnce('0x0');

        const returnValue = signMessageCommand.execute(moduleInstanceMock, methodModelMock, {});

        expect(returnValue).toBe('0x0');

        expect(methodModelMock.afterExecution)
            .toHaveBeenCalledWith('0x00');
        expect(methodModelMock.beforeExecution)
            .toHaveBeenCalledWith(moduleInstanceMock);

        expect(messageSignerMock.sign)
            .toHaveBeenCalledWith(methodModelMock.parameters[0], methodModelMock.parameters[1], {})
    });

    it('calls execute and throws error', () => {
        methodModelMock.parameters = ['string', '0x0'];

        messageSignerMock.sign
            .mockImplementation(() => {
                throw new Error();
            });

        try {
            signMessageCommand.execute(moduleInstanceMock, methodModelMock, {});
        } catch (error2) {
            expect(methodModelMock.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(messageSignerMock.sign)
                .toHaveBeenCalledWith(methodModelMock.parameters[0], methodModelMock.parameters[1], {});

            expect(error2).toBeInstanceOf(Error);
        }
    });
});
