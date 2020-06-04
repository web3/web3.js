var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');

var setValue = 123;

describe('web3.eth', function () {
    describe('maxListenersWarningThreshold', function () {
        var eth;

        beforeEach(function (){
            eth = new Eth();
        })
        it('should default to 100', function () {
            assert.equal(eth.maxListenersWarningThreshold, 100);
        });
        it('should set threshold to proper value', function () {
            // Mock EventEmitter interface
            eth.currentProvider = {
                setMaxListeners: () => {}
            }
            eth.maxListenersWarningThreshold = setValue;
            assert.equal(eth.maxListenersWarningThreshold, setValue);
        });
        it('should *NOT* set threshold when there is no currentProvider', function () {
            eth.maxListenersWarningThreshold = setValue;
            assert.equal(eth.maxListenersWarningThreshold, 100);
        });
        it('should *NOT* set threshold when currentProvider does not extend EventEmitter', function () {
            eth.currentProvider = {}
            eth.maxListenersWarningThreshold = setValue;
            assert.equal(eth.maxListenersWarningThreshold, 100);
        });
    });
});

