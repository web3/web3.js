var chai = require('chai');
var assert = chai.assert;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var FakeXHR2 = function () {
    this.responseText = "{}";
    this.readyState = 4;
    this.onreadystatechange = null;
    this.async = true;
    this.headers = {
        'Content-Type': 'text/plain'
    };
};

FakeXHR2.prototype.open = function (method, host, async) {
    assert.equal(method, 'POST');
    assert.notEqual(host, null);
    assert.equal(async === true, true);
    this.async = async;
};

FakeXHR2.prototype.setRequestHeader = function(name, value) {
    this.headers[name] = value;
};

FakeXHR2.prototype.send = function (payload) {
    assert.equal(typeof payload, 'string');
    if (this.async) {
        assert.equal(typeof this.onreadystatechange, 'function');
        this.onreadystatechange();
        return;
    }
    return this.responseText;
};

module.exports = {XMLHttpRequest: FakeXHR2};
