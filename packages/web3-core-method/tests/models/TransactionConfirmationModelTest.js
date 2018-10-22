var assert = require('chai').assert;
var TransactionConfirmationModel = require('../../src/models/TransactionConfirmationModel');

/**
 * TransactionConfirmationModel test
 */
describe('TransactionConfirmationModel', function() {
    var model;

    beforeEach(function() {
        model = new TransactionConfirmationModel();
    });

    it('POLLINGTIMEOUT should return 15 * TIMEOUTBLOCK', function() {
        assert.equal(model.POLLINGTIMEOUT, 15 * model.TIMEOUTBLOCK);
    });

    it('TIMOUTBLOCK should return 50', function() {
        assert.equal(model.TIMEOUTBLOCK, 50);
    });

    it('CONFIRMATIONBLOCKS should return 24', function() {
        assert.equal(model.TIMEOUTBLOCK, 50);
    });

    it('confirmationsCount should return 0 as the initial value', function() {
        assert.equal(model.confirmationsCount, 0);
    });

    it('confirmationsCount should return one more after adding an confirmation', function() {
        assert.equal(model.confirmationsCount, 0);
        model.addConfirmation({});
        assert.equal(model.confirmationsCount, 1);
    });

    it('addConfirmation should just add the confirmations without changing something', function() {
        var confirmations = [{test: 'asdf'}, {test: 'asdf'}];

        model.addConfirmation(confirmations[0]);
        model.addConfirmation(confirmations[1]);

        assert.deepEqual(model.confirmations, confirmations);
    });

    it('isConfirmed should return true ', function() {
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

    it('isConfirmed should return false ', function() {
        model.confirmations = [{test: 'asdf'}];
        assert.isFalse(model.isConfirmed());
    });

    it('isTimeoutTimeExceeded should return true and watcher should not polling', function() {
        model.timeoutCounter = 51;
        assert.isTrue(model.isTimeoutTimeExceeded(false));
    });

    it('should return false ', function() {
        model.timeoutCounter = 40;
        assert.isFalse(model.isTimeoutTimeExceeded(false));
    });

    it('isTimeoutTimeExceeded should return true with polling watcher', function() {
        model.timeoutCounter = 1 + 15 * model.TIMEOUTBLOCK;
        assert.isTrue(model.isTimeoutTimeExceeded(true));
    });

    it('should return false ', function() {
        model.timeoutCounter = 40;
        assert.isFalse(model.isTimeoutTimeExceeded(true));
    });
});
