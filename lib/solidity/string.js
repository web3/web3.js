var f = require('./formatters');
var SolidityType = require('./type');

var SolidityTypeString = function () {
    this._inputFormatter = f.formatInputString;
    this._outputFormatter = f.formatOutputString;
};

SolidityTypeString.prototype = new SolidityType({});
SolidityTypeString.prototype.constructor = SolidityTypeString;

SolidityTypeString.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeString.prototype.isType = function (name) {
    return !!name.match(/string(\[([0-9]*)\])?/);
};

SolidityTypeString.prototype.isDynamicArray = function (name) {
    var matches = name.match(/string(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[1] && !matches[2];
};

SolidityTypeString.prototype.isStaticArray = function (name) {
    var matches = name.match(/string(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[1] && !!matches[2];
};

SolidityTypeString.prototype.staticArrayLength = function (name) {
    return name.match(/string(\[([0-9]*)\])?/)[2] || 1;
};

SolidityTypeString.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

SolidityTypeString.prototype.isDynamicType = function (name) {
    return true;
};

module.exports = SolidityTypeString;

