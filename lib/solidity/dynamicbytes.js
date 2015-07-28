var f = require('./formatters');
var SolidityType = require('./type');

var SolidityTypeDynamicBytes = function () {
    this._inputFormatter = f.formatInputDynamicBytes;
    this._outputFormatter = f.formatOutputDynamicBytes;
};

SolidityTypeDynamicBytes.prototype = new SolidityType({});
SolidityTypeDynamicBytes.prototype.constructor = SolidityTypeDynamicBytes;

SolidityTypeDynamicBytes.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeDynamicBytes.prototype.isType = function (name) {
    return !!name.match(/^bytes(\[([0-9]*)\])*$/);
};

SolidityTypeDynamicBytes.prototype.isDynamicArray = function (name) {
    // use * not ?. we do not want to match all []
    var matches = name.match(/^bytes(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[1] && !matches[2];
};

SolidityTypeDynamicBytes.prototype.isStaticArray = function (name) {
    // use * not ?. we do not want to match all []
    var matches = name.match(/bytes(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[1] && !!matches[2];
};

SolidityTypeDynamicBytes.prototype.staticArrayLength = function (name) {
    // use * not ?. we do not want to match all []
    return name.match(/bytes(\[([0-9]*)\])?/)[2] || 1;
};

SolidityTypeDynamicBytes.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

SolidityTypeDynamicBytes.prototype.isDynamicType = function (name) {
    return true;
};

module.exports = SolidityTypeDynamicBytes;

