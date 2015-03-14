var chai   = require('chai');
var assert = chai.assert;
var utils = require('../../lib/utils/utils.js');

/* globals describe, it */

describe('utils', function () {
    describe('extractDisplayName', function () {
        it('should extract display name from method with no params', function () {
            
            // given
            var test = 'helloworld()'; 

            // when
            var displayName = utils.extractDisplayName(test);

            // then
            assert.equal(displayName, 'helloworld');
        });
        
        it('should extract display name from method with one param' , function () {
            
            // given
            var test = 'helloworld1(int)'; 

            // when
            var displayName = utils.extractDisplayName(test);

            // then
            assert.equal(displayName, 'helloworld1');
        });
        
        it('should extract display name from method with two params' , function () {
            
            // given
            var test = 'helloworld2(int,string)'; 

            // when
            var displayName = utils.extractDisplayName(test);

            // then
            assert.equal(displayName, 'helloworld2');
        });
    });
});
