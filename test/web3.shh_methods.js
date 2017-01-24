var u = require('./helpers/test.utils.js');
var Shh = require('../packages/web3-shh');
var shh = new Shh();

describe('shh', function() {
    describe('methods', function() {
        u.methodExists(shh, 'post');
        u.methodExists(shh, 'newIdentity');
        u.methodExists(shh, 'hasIdentity');
        u.methodExists(shh, 'newGroup');
        u.methodExists(shh, 'addToGroup');
        u.methodExists(shh, 'subscribe');
    });
});

