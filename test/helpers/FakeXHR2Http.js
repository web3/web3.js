var chai = require('chai');
var assert = chai.assert;


var FakeXHR2 = function () {
    this.responseText = undefined;
    this.status = global.status || 200;
    this.readyState = 4;
    this.onreadystatechange = null;
    this.async = true;
    this.agents = {};
    this.headers = {
        'Content-Type': 'text/plain'
    };
    this.customGetResponseHeader = undefined;
};

FakeXHR2.prototype.getResponseHeader = function (header) {
    if(global.getResponseHeader) {
        return global.getResponseHeader(header);
    }
    return '';
};

FakeXHR2.prototype.nodejsSet = function (agents) {
    this.agents = agents;
};

FakeXHR2.prototype.open = function (method, host, async) {
    assert.notEqual(host, null);
    this.async = async;
};

FakeXHR2.prototype.setRequestHeader = function(name, value) {
    this.headers[name] = value;
};

FakeXHR2.prototype.send = function (payload) {
    if(global.timeout) {
        this.ontimeout();
    }

    if(payload) {
        this.responseText = payload;
    }

    this.onreadystatechange();
};

module.exports = {XMLHttpRequest: FakeXHR2};
