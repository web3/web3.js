var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeInt is a prootype that represents int type
 * It matches:
 * int
 * int[]
 * int[4]
 * int[][]
 * int[3][]
 * int[][6][], ...
 * int32
 * int64[]
 * int8[4]
 * int256[][]
 * int[3][]
 * int64[][6][], ...
 */
var SolidityTypeInt = function () {
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputInt;
};

SolidityTypeInt.prototype = new SolidityType({});
SolidityTypeInt.prototype.constructor = SolidityTypeInt;

SolidityTypeInt.prototype.isType = function (name) {
    return !!name.match(/int([0-9]*)?(\[([0-9]*)\])?/);
};

SolidityTypeInt.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeInt.prototype.isDynamicArray = function (name) {
    var matches = name.match(/int([0-9]*)?(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[2] && !matches[3];
};

SolidityTypeInt.prototype.isStaticArray = function (name) {
    var matches = name.match(/int([0-9]*)?(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[2] && !!matches[3];
};

SolidityTypeInt.prototype.staticArrayLength = function (name) {
    return name.match(/int([0-9]*)?(\[([0-9]*)\])?/)[3] || 1;
};

SolidityTypeInt.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeInt;
