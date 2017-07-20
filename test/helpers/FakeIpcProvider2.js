var FakeHttpProvider = require('./FakeIpcProvider');

var FakeIpcProvider2 = function () {
    this.counter = 0;
    this.resultList = [];
};

FakeIpcProvider2.prototype = new FakeHttpProvider();
FakeIpcProvider2.prototype.constructor = FakeIpcProvider2;

FakeIpcProvider2.prototype.injectResultList = function (list) {
    this.resultList = list;
};

FakeIpcProvider2.prototype.getResponse = function () {
    var result = this.resultList[this.counter];
    this.counter++;

    // add fallback result value
    if(!result)
        result = {
            result: undefined
        };

    if (result.type === 'batch') {
        this.injectBatchResults(result.result);
    } else {
        this.injectResult(result.result);
    }

    this.counter = 0;

    return this.response;
};

module.exports = FakeIpcProvider2;

