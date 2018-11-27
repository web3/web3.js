import * as sinonLib from 'sinon';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import {Accounts} from 'web3-eth-accounts';
import MessageSigner from '../../src/signers/MessageSigner';

const sinon = sinonLib.createSandbox();

/**
 * MessageSigner test
 */
describe('MessageSignerTest', () => {
    let messageSigner, provider, providerAdapter, accounts, accountsMock;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);

        accounts = new Accounts(providerAdapter, {});
        accountsMock = sinon.mock(accounts);

        messageSigner = new MessageSigner();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('calls sign and throws error', () => {
        try {
            messageSigner.sign('string', 0, accounts);
        } catch (error) {
            expect(error.message).toBe('Wallet or privateKey in wallet is not set!');
        }
    });

    it('calls sign and returns signed message', () => {
        accounts.wallet[0] = {privateKey: '0x0'};

        accountsMock
            .expects('sign')
            .withArgs('string', '0x0')
            .returns({signature: '0x00'})
            .once();

        expect(messageSigner.sign('string', 0, accounts)).toBe('0x00');

        accountsMock.verify();
    });
});
