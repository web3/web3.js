var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeBool is a prootype that represents bool type
 * It matches:
 * bool
 * bool[]
 * bool[4]
 * bool[][]
 * bool[3][]
 * bool[][6][], ...
 */
var SolidityTypeBool = function () {
    this._inputFormatter = f.formatInputBool;
    this._outputFormatter = f.formatOutputBool;
};

SolidityTypeBool.prototype = new SolidityType({});
SolidityTypeBool.prototype.constructor = SolidityTypeBool;

SolidityTypeBool.prototype.isType = function (name) {
    return !!name.match(/bool(\[([0-9]*)\])?/);
};

SolidityTypeBool.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeBool.prototype.isDynamicArray = function (name) {
    var matches = name.match(/bool(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[1] && !matches[2];
};

SolidityTypeBool.prototype.isStaticArray = function (name) {
    var matches = name.match(/bool(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[1] && !!matches[2];
};

SolidityTypeBool.prototype.staticArrayLength = function (name) {
    return name.match(/bool(\[([0-9]*)\])?/)[2] || 1;
};

SolidityTypeBool.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeBool;
