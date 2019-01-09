import Accounts from '../../__mocks__/Accounts';
import MessageSigner from '../../../src/signers/MessageSigner';

/**
 * MessageSigner test
 */
describe('MessageSignerTest', () => {
    let messageSigner, accountsMock;

    beforeEach(() => {
        accountsMock = new Accounts();
        accountsMock.sign = jest.fn();

        messageSigner = new MessageSigner(accountsMock);
    });

    it('calls sign and throws error', () => {
        try {
            messageSigner.sign('string', 0, accountsMock);
        } catch (error) {
            expect(error.message).toEqual('Wallet or privateKey in wallet is not set!');
        }
    });

    it('calls sign and returns signed message', () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};
        accountsMock.sign.mockReturnValueOnce({signature: '0x00'});

        expect(messageSigner.sign('string', 0, accountsMock)).toEqual('0x00');

        expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
    });
});
