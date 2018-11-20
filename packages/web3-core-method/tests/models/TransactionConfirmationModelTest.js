const assert = require('chai').assert;
const TransactionConfirmationModel = require('../../src/models/TransactionConfirmationModel');

/**
 * TransactionConfirmationModel test
 */
describe('TransactionConfirmationModel', () => {
    let model;

    beforeEach(() => {
        model = new TransactionConfirmationModel();
    });

    it('POLLINGTIMEOUT should return 15 * TIMEOUTBLOCK', () => {
        assert.equal(model.POLLINGTIMEOUT, 15 * model.TIMEOUTBLOCK);
    });

    it('TIMOUTBLOCK should return 50', () => {
        assert.equal(model.TIMEOUTBLOCK, 50);
    });

    it('CONFIRMATIONBLOCKS should return 24', () => {
        assert.equal(model.TIMEOUTBLOCK, 50);
    });

    it('confirmationsCount should return 0 as the initial value', () => {
        assert.equal(model.confirmationsCount, 0);
    });

    it('confirmationsCount should return one more after adding an confirmation', () => {
        assert.equal(model.confirmationsCount, 0);
        model.addConfirmation({});
        assert.equal(model.confirmationsCount, 1);
    });

    it('addConfirmation should just add the confirmations without changing something', () => {
        const confirmations = [{test: 'asdf'}, {test: 'asdf'}];

        model.addConfirmation(confirmations[0]);
        model.addConfirmation(confirmations[1]);

        assert.deepEqual(model.confirmations, confirmations);
    });

    it('isConfirmed should return true ', () => {
        model.confirmations = [
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'},
            {test: 'asdf'}
        ];

        assert.isTrue(model.isConfirmed());
    });

    it('isConfirmed should return false ', () => {
        model.confirmations = [{test: 'asdf'}];
        assert.isFalse(model.isConfirmed());
    });

    it('isTimeoutTimeExceeded should return true and watcher should not polling', () => {
        model.timeoutCounter = 51;
        assert.isTrue(model.isTimeoutTimeExceeded(false));
    });

    it('should return false ', () => {
        model.timeoutCounter = 40;
        assert.isFalse(model.isTimeoutTimeExceeded(false));
    });

    it('isTimeoutTimeExceeded should return true with polling watcher', () => {
        model.timeoutCounter = 1 + 15 * model.TIMEOUTBLOCK;
        assert.isTrue(model.isTimeoutTimeExceeded(true));
    });

    it('should return false ', () => {
        model.timeoutCounter = 40;
        assert.isFalse(model.isTimeoutTimeExceeded(true));
    });
});
