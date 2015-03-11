var chai   = require('chai');
var assert = chai.assert;
var tu     = require('../test.utils.js');
var rm     = require('../../lib/web3/requestmanager')();

describe('RequestManager', function () {
    describe('methods', function () {
        tu.propertyExists(rm, 'send');
        tu.propertyExists(rm, 'setProvider');
        tu.propertyExists(rm, 'startPolling');
        tu.propertyExists(rm, 'stopPolling');
        tu.propertyExists(rm, 'reset');
    });
});
