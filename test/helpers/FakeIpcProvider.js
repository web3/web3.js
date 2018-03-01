var chai = require('chai');
var assert = require('assert');
var _ = require('lodash');




var FakeIpcProvider = function IpcProvider() {
    var _this = this;
    this.countId = 1;
    this.notificationCount = 1;
    this.getResponseStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId,
            result: null
        };
    };
    this.getErrorStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId,
            error: {
                code: 1234,
                message: 'Stub error'
            }
        };
    };

    this.response = [];
    this.error = [];
    this.validation = [];
    this.notificationCallbacks = [];
};


FakeIpcProvider.prototype.send = function (payload, callback) {
    var _this = this;

    // set id
    if(payload.id)
        this.countId = payload.id;
    // else
    //     this.countId++;

    assert.equal(_.isArray(payload) || _.isObject(payload), true);
    assert.equal(_.isFunction(callback), true);

    var validation = this.validation.shift();

    if (validation) {
        // imitate plain json object
        validation(JSON.parse(JSON.stringify(payload)), callback);
    }

    var response = this.getResponseOrError('response', payload);
    var error = this.getResponseOrError('error', payload);

    setTimeout(function(){
        callback(error, response);
    }, 1);
};

FakeIpcProvider.prototype.on = function (type, callback) {
    if(type === 'data') {
        this.notificationCallbacks.push(callback);
    }
};

FakeIpcProvider.prototype.getResponseOrError = function (type, payload) {
    var _this = this;
    var response;

    if(type === 'error') {
        response = this.error.shift();
    } else {
        response = this.response.shift() || this.getResponseStub();
    }


    if(response) {
        if(_.isArray(response)) {
            response = response.map(function(resp, index) {
                resp.id = payload[index] ? payload[index].id : _this.countId++;
                return resp;
            });
        } else
            response.id = payload.id;
    }

    return response;
};

FakeIpcProvider.prototype.injectNotification = function (notification) {
    var _this = this;
    setTimeout(function(){
        _this.notificationCallbacks.forEach(function(cb){
            if(notification && cb)
                cb(notification);
        });
    }, 100 + this.notificationCount);

    this.notificationCount += 10;
};

// FakeHttpProvider.prototype.injectResponse = function (response) {
//     this.response = response;
// };



FakeIpcProvider.prototype.injectBatchResults = function (results, error) {
    var _this = this;
    this.response.push(results.map(function (r) {
        if(error) {
            var response = _this.getErrorStub();
            response.error.message = r;
        } else {
            var response = _this.getResponseStub();
            response.result = r;
        }
        return response;
    }));
};

FakeIpcProvider.prototype.injectResult = function (result) {
    var response = this.getResponseStub();
    response.result = result;

    this.response.push(response);
};

FakeIpcProvider.prototype.injectError = function (error) {
    var errorStub = this.getErrorStub();
    errorStub.error = error; // message, code

    this.error.push(errorStub);
};

FakeIpcProvider.prototype.injectValidation = function (callback) {
    this.validation.push(callback);
};

module.exports = FakeIpcProvider;

