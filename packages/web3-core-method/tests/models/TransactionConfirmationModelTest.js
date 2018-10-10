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

    describe('POLLINGTIMEOUT', function() {
        it('should return 15 * TIMEOUTBLOCK', function() {
            assert.equal(model.POLLINGTIMEOUT, 15 * model.TIMEOUTBLOCK);
        });
    });

    describe('TIMOUTBLOCk', function () {
        it('should return 50', function () {
            assert.equal(model.TIMEOUTBLOCK, 50);
        });
    });

    describe('CONFIRMATIONBLOCKS', function () {
        it('should return 24', function () {
            assert.equal(model.TIMEOUTBLOCK, 50);
        });
    });

    describe('confirmationsCount', function () {
        it('should return 0 as the initial value', function () {
            assert.equal(model.confirmationsCount, 0);
        });

        it('should return one more after adding an confirmation', function () {
            assert.equal(model.confirmationsCount, 0);
            model.addConfirmation({});
            assert.equal(model.confirmationsCount, 1);
        });
    });

    describe('addConfirmation', function () {
        it('should just add the confirmations without changing something', function () {
            var confirmations = [
                {test: 'asdf'},
                {test: 'asdf'}
            ];

            model.addConfirmation(confirmations[0]);
            model.addConfirmation(confirmations[1]);

            assert.deepEqual(model.confirmations, confirmations);
        });
    });

    describe('isConfirmed', function () {
        it('should return true ', function () {
            model.confirmations = [
                {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'},
                {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'},
                {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'},
                {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'}, {test: 'asdf'},
                {test: 'asdf'}
            ];


            assert.isTrue(model.isConfirmed());
        });

        it('should return false ', function () {
            model.confirmations = [{test: 'asdf'}];
            assert.isFalse(model.isConfirmed());
        });
    });

    describe('isTimeoutTimeExceeded', function () {
        describe('watcher is not polling', function() {
            it('should return true ', function () {
                model.timeoutCounter = 51;
                assert.isTrue(model.isTimeoutTimeExceeded(false));
            });

            it('should return false ', function () {
                model.timeoutCounter = 40;
                assert.isFalse(model.isTimeoutTimeExceeded(false));
            });
        });

        describe('watcher is polling', function() {
            it('should return true ', function () {
                model.timeoutCounter = 1 + (15 * model.TIMEOUTBLOCK);
                assert.isTrue(model.isTimeoutTimeExceeded(true));
            });

            it('should return false ', function () {
                model.timeoutCounter = 40;
                assert.isFalse(model.isTimeoutTimeExceeded(true));
            });
        });
    });
});
