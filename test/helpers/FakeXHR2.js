var chai = require('chai');
var assert = chai.assert;


var FakeXHR2 = function () {
    this.responseText = undefined;
    this.readyState = 4;
    this.status = 200;
    this.onreadystatechange = null;
    this.async = true;
    this.agents = {};
    this.headers = {
        'Content-Type': 'text/plain'
    };
};

FakeXHR2.prototype.nodejsSet = function (agents) {
    this.agents = agents;
};

FakeXHR2.prototype.open = function (method, host, async) {
    assert.equal(method, 'POST');
    assert.notEqual(host, null);
    this.async = async;
};

FakeXHR2.prototype.setRequestHeader = function(name, value) {
    this.headers[name] = value;
};

FakeXHR2.prototype.send = function (payload) {

    this.responseText = payload;

    assert.equal(typeof payload, 'string');
    if (this.async) {
        assert.equal(typeof this.onreadystatechange, 'function');
        this.onreadystatechange();
    }
};

module.exports = {XMLHttpRequest: FakeXHR2};
