var chai = require('chai');
var assert = chai.assert;

var FakeIpcRequest = function () {
    var _this = this;
    this._handle = {fd: {}};
    this.listenerList = [];

    return this;
};

FakeIpcRequest.prototype.connect = function (path) {
    assert.notEqual(path, undefined);

    return this;
};


FakeIpcRequest.prototype.on = function (name, callback) {
    if(name === 'data'){
        this.listenerList.push(callback);
    }
};


FakeIpcRequest.prototype.writeSync = function (payload) {
    assert.equal(typeof payload, 'string');
    return payload;
};

FakeIpcRequest.prototype.write = function (payload) {
    assert.equal(typeof payload, 'string');

    this.listenerList.forEach(function(cb){
        setTimeout(function(){
            cb(payload);
        }, 100);
    });

};

module.exports = FakeIpcRequest;

