import {SocketProviderAdapter} from 'web3-providers';
import Accounts from '../__mocks__/Accounts';
import MessageSigner from '../../src/signers/MessageSigner';

// Mocks
jest.mock('SocketProviderAdapter');

/**
 * MessageSigner test
 */
describe('MessageSignerTest', () => {
    let messageSigner,
        providerAdapter,
        providerAdapterMock,
        accountsMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        accountsMock = new Accounts();
        accountsMock.sign = jest.fn();

        messageSigner = new MessageSigner();
    });

    it('calls sign and throws error', () => {
        try {
            messageSigner.sign('string', 0, accountsMock);
        } catch (error) {
            expect(error.message)
                .toBe('Wallet or privateKey in wallet is not set!');
        }
    });

    it('calls sign and returns signed message', () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};
        accountsMock.sign
            .mockReturnValueOnce({signature: '0x00'});

        expect(messageSigner.sign('string', 0, accountsMock))
            .toBe('0x00');

        expect(accountsMock.sign)
            .toHaveBeenCalledWith('string', '0x0');
    });
});
