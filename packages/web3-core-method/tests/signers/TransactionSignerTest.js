var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var ProvidersPackage = require('web3-core-providers');
var AccountsPackage = require('web3-eth-accounts');
var TransactionSigner = require('../../src/signers/TransactionSigner');

/**
 * TransactionSigner test
 */
describe('TransactionSignerTest', function () {
    var transactionSigner,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        accounts,
        accountsMock;

    beforeEach(function () {
        provider = new ProvidersPackage.WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new ProvidersPackage.SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        accounts = AccountsPackage.createAccounts(provider);
        accountsMock = sinon.mock(accounts);

        transactionSigner = new TransactionSigner();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls sign and throws error', function () {
        transactionSigner.sign({from: 0}, accounts).catch(function (error) {
            expect(error.message).equal('Wallet or privateKey in wallet is not set!');
        });
    });

    it('calls sign and returns signed transaction', async function () {
        accounts.wallet[0] = {privateKey: '0x0'};
        var transaction = {
            from: 0,
        };

        accountsMock
            .expects('signTransaction')
            .withArgs(transaction, '0x0')
            .returns(new Promise(
                function (resolve) {
                    resolve('0x0');
                }
            ))
            .once();

        var returnValue = await transactionSigner.sign(transaction, accounts);

        expect(returnValue).equal('0x0');
        expect(transaction.from).equal(undefined);

        accountsMock.verify();
    });
});
