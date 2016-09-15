var chai = require('chai');
var assert = require('assert');
var utils = require('../../lib/utils/utils');




var FakeHttpProvider = function () {
    var _this = this;
    this.countId = 0;
    this.getResponseStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId++,
            result: null
        };
    };
    this.getErrorStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId++,
            error: {
                code: 1234,
                message: 'Stub error'
            }
        };
    };

    this.response = this.getResponseStub();
    this.error = null;
    this.validation = null;
    this.notificationCallbacks = [];
};

FakeHttpProvider.prototype.send = function (payload) {
    assert.equal(utils.isArray(payload) || utils.isObject(payload), true);

    if (this.error) {
        throw this.error;
    }
    if (this.validation) {
        // imitate plain json object
        this.validation(JSON.parse(JSON.stringify(payload)));
    }

    return this.getResponse(payload);
};

FakeHttpProvider.prototype.sendAsync = function (payload, callback) {
    var _this = this;

    assert.equal(utils.isArray(payload) || utils.isObject(payload), true);
    assert.equal(utils.isFunction(callback), true);
    if (this.validation) {
        // imitate plain json object
        this.validation(JSON.parse(JSON.stringify(payload)), callback);
    }

    var response = _this.getResponse(payload);
    var error = _this.error;

    setTimeout(function(){
        callback(error, response);
    }, 2);
};

FakeHttpProvider.prototype.on = function (type, callback) {
    if(type === 'notification') {
        this.notificationCallbacks.push(callback);
    }
};

FakeHttpProvider.prototype.injectNotification = function (notification) {
    var _this = this;
    setTimeout(function(){
        _this.notificationCallbacks.forEach(function(cb){
            cb(null, notification);
        });
    }, 10);
};

FakeHttpProvider.prototype.injectResponse = function (response) {
    this.response = response;
};

FakeHttpProvider.prototype.injectResult = function (result) {
    this.response = this.getResponseStub();
    this.response.result = result;
};

FakeHttpProvider.prototype.injectBatchResults = function (results, error) {
    var _this = this;
    this.response = results.map(function (r) {
        if(error) {
            var response = _this.getErrorStub();
            response.error.message = r;
        } else {
            var response = _this.getResponseStub();
            response.result = r;
        }
        return response;
    });
};

FakeHttpProvider.prototype.getResponse = function (payload) {
    var _this = this;
    if(this.response) {
        if(utils.isArray(this.response)) {
            this.response = this.response.map(function(response, index) {
                response.id = payload[index] ? payload[index].id : _this.countId++;
                return response;
            });
        } else
            this.response.id = payload.id;
    }

    return this.response;
};

FakeHttpProvider.prototype.injectError = function (error) {
    this.error = error;
};

FakeHttpProvider.prototype.injectValidation = function (callback) {
    this.validation = callback;
};

module.exports = FakeHttpProvider;

