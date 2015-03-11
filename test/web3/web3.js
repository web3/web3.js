var chai   = require('chai');
var expect = chai.expect;
var tu     = require('../test.utils.js');
var web3   = require('../../index.js');

/* globals describe, it */

describe('web3', function () {
    describe('methods', function () {
        tu.methodExists(web3, 'setProvider');
        tu.methodExists(web3, 'reset');
    });

	describe('properties', function () {
        tu.propertyExists(web3, 'db');
        tu.propertyExists(web3, 'shh');
    });

	// describe('methods', function () {
 	//    it('placeholder', function(){    	
 	//    });
 	// });
});