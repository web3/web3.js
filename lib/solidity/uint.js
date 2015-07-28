var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeUInt is a prootype that represents uint type
 * It matches:
 * uint
 * uint[]
 * uint[4]
 * uint[][]
 * uint[3][]
 * uint[][6][], ...
 * uint32
 * uint64[]
 * uint8[4]
 * uint256[][]
 * uint[3][]
 * uint64[][6][], ...
 */
var SolidityTypeUInt = function () {
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputInt;
};

SolidityTypeUInt.prototype = new SolidityType({});
SolidityTypeUInt.prototype.constructor = SolidityTypeUInt;

SolidityTypeUInt.prototype.isType = function (name) {
    return !!name.match(/uint([0-9]*)?(\[([0-9]*)\])?/);
};

SolidityTypeUInt.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeUInt.prototype.isDynamicArray = function (name) {
    var matches = name.match(/uint([0-9]*)?(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[2] && !matches[3];
};

SolidityTypeUInt.prototype.isStaticArray = function (name) {
    var matches = name.match(/uint([0-9]*)?(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[2] && !!matches[3];
};

SolidityTypeUInt.prototype.staticArrayLength = function (name) {
    return name.match(/uint([0-9]*)?(\[([0-9]*)\])?/)[3] || 1;
};

SolidityTypeUInt.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeUInt;
