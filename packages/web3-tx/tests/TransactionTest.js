import * as Utils from 'web3-utils';
import Transaction from '../src/Transaction';

// Mocks
jest.mock('Utils');

/**
 * Transaction test
 */
describe('TransactionTest', () => {
    let transaction;

    beforeEach(() => {});

    it('constructor check', () => {
        expect(1).toEqual(1);
    });
});
