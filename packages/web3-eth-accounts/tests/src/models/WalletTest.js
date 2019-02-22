import Wallet from '../../../src/models/Wallet';

// Mocks
jest.mock('');

/**
 * Wallet test
 */
describe('WalletTest', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('constructor check', () => {
        expect(wallet.length).toEqual(0);

        expect(wallet.defaultKeyName).toEqual('web3js_wallet');
    });

    it('calls findSafeIndex and returns the expected pointer', () =< {

    })
});
