var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeAddress is a prootype that represents address type
 * It matches:
 * address
 * address[]
 * address[4]
 * address[][]
 * address[3][]
 * address[][6][], ...
 */
var SolidityTypeAddress = function () {
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputAddress;
};

SolidityTypeAddress.prototype = new SolidityType({});
SolidityTypeAddress.prototype.constructor = SolidityTypeAddress;

SolidityTypeAddress.prototype.isType = function (name) {
    return !!name.match(/address(\[([0-9]*)\])?/);
};

SolidityTypeAddress.prototype.staticPartLength = function (name) {
    return 32 * this.staticArrayLength(name);
};

SolidityTypeAddress.prototype.isDynamicArray = function (name) {
    var matches = name.match(/address(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[1] && !matches[2];
};

SolidityTypeAddress.prototype.isStaticArray = function (name) {
    var matches = name.match(/address(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[1] && !!matches[2];
};

SolidityTypeAddress.prototype.staticArrayLength = function (name) {
    return name.match(/address(\[([0-9]*)\])?/)[2] || 1;
};

SolidityTypeAddress.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeAddress;

