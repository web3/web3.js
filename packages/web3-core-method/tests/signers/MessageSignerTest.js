const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;

const ProvidersPackage = require('web3-providers');
const AccountsPackage = require('web3-eth-accounts');
const MessageSigner = require('../../src/signers/MessageSigner');

/**
 * MessageSigner test
 */
describe('MessageSignerTest', () => {
    let messageSigner;
    let provider;
    let providerMock;
    let providerAdapter;
    let providerAdapterMock;
    let accounts;
    let accountsMock;

    beforeEach(() => {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        accounts = AccountsPackage.createAccounts(provider);
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
            expect(error.message).equal('Wallet or privateKey in wallet is not set!');
        }
    });

    it('calls sign and returns signed message', () => {
        accounts.wallet[0] = {privateKey: '0x0'};

        accountsMock
            .expects('sign')
            .withArgs('string', '0x0')
            .returns({signature: '0x00'})
            .once();

        expect(messageSigner.sign('string', 0, accounts)).equal('0x00');

        accountsMock.verify();
    });
});
