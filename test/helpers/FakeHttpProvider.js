var chai = require('chai');
var assert = require('assert');
var _ = require('lodash');




var FakeHttpProvider = function HttpProvider() {
    var _this = this;
    this.countId = 1;
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
};


FakeHttpProvider.prototype.send = function (payload, callback) {
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

FakeHttpProvider.prototype.getResponseOrError = function (type, payload) {
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


// FakeHttpProvider.prototype.injectResponse = function (response) {
//     this.response = response;
// };



FakeHttpProvider.prototype.injectBatchResults = function (results, error) {
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

FakeHttpProvider.prototype.injectResult = function (result) {
    var response = this.getResponseStub();
    response.result = result;

    this.response.push(response);
};

FakeHttpProvider.prototype.injectError = function (error) {
    var errorStub = this.getErrorStub();
    errorStub.error = error; // message, code

    this.error.push(errorStub);
};

FakeHttpProvider.prototype.injectValidation = function (callback) {
    this.validation.push(callback);
};

module.exports = FakeHttpProvider;

