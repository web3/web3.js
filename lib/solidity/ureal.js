var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeUReal is a prootype that represents ureal type
 * It matches:
 * ureal
 * ureal[]
 * ureal[4]
 * ureal[][]
 * ureal[3][]
 * ureal[][6][], ...
 * ureal32
 * ureal64[]
 * ureal8[4]
 * ureal256[][]
 * ureal[3][]
 * ureal64[][6][], ...
 */
var SolidityTypeUReal = function () {
    this._inputFormatter = f.formatInputReal;
    this._outputFormatter = f.formatOutputUReal;
};

SolidityTypeUReal.prototype = new SolidityType({});
SolidityTypeUReal.prototype.constructor = SolidityTypeUReal;

SolidityTypeUReal.prototype.isType = function (name) {
    return !!name.match(/ureal([0-9]*)?(\[([0-9]*)\])?/);
};

SolidityTypeUReal.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeUReal.prototype.isDynamicArray = function (name) {
    var matches = name.match(/ureal([0-9]*)?(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[2] && !matches[3];
};

SolidityTypeUReal.prototype.isStaticArray = function (name) {
    var matches = name.match(/ureal([0-9]*)?(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[2] && !!matches[3];
};

SolidityTypeUReal.prototype.staticArrayLength = function (name) {
    return name.match(/ureal([0-9]*)?(\[([0-9]*)\])?/)[3] || 1;
};

SolidityTypeUReal.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeUReal;
