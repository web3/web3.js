var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeBytes is a prootype that represents bytes type
 * It matches:
 * bytes
 * bytes[]
 * bytes[4]
 * bytes[][]
 * bytes[3][]
 * bytes[][6][], ...
 * bytes32
 * bytes64[]
 * bytes8[4]
 * bytes256[][]
 * bytes[3][]
 * bytes64[][6][], ...
 */
var SolidityTypeBytes = function () {
    this._inputFormatter = f.formatInputBytes;
    this._outputFormatter = f.formatOutputBytes;
};

SolidityTypeBytes.prototype = new SolidityType({});
SolidityTypeBytes.prototype.constructor = SolidityTypeBytes;

SolidityTypeBytes.prototype.isType = function (name) {
    return !!name.match(/bytes([0-9]*)(\[([0-9]*)\])?/);
};

SolidityTypeBytes.prototype.staticPartLength = function (name) {
    var matches = name.match(/bytes([0-9]*)(\[([0-9]*)\])?/);
    var size = parseInt(matches[1]);
    return size * this.staticArrayLength(name);
};

SolidityTypeBytes.prototype.isDynamicArray = function (name) {
    var matches = name.match(/bytes([0-9]*)(\[([0-9]*)\])?/);
    // is array && doesn't have length specified
    return !!matches[2] && !matches[3];
};

SolidityTypeBytes.prototype.isStaticArray = function (name) {
    var matches = name.match(/bytes([0-9]*)(\[([0-9]*)\])?/);
    // is array && have length specified
    return !!matches[2] && !!matches[3];
};

SolidityTypeBytes.prototype.staticArrayLength = function (name) {
    return name.match(/bytes([0-9]*)(\[([0-9]*)\])?/)[3] || 1;
};

SolidityTypeBytes.prototype.nestedName = function (name) {
    // removes first [] in name
    return name.replace(/\[([0-9])*\]/, '');
};

module.exports = SolidityTypeBytes;
