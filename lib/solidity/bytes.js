var f = require('./formatters');
var SolidityType = require('./type');

/**
 * SolidityTypeBytes is a prototype that represents bytes type
 * Given the correct size at initialization, it matches:
 *   bytes32
 *   bytes8[4]
 *   bytes256[][]
 *   bytes2[3][]
 * etc.
 */

var SolidityTypeBytes = function(size) {
    this.size = size;
    this._inputFormatter = f.formatInputBytes;
    this._outputFormatter = function(param) { return f.formatOutputBytes(param, this.size); };
};

SolidityTypeBytes.prototype = new SolidityType({});
SolidityTypeBytes.prototype.constructor = SolidityTypeBytes;

SolidityTypeBytes.prototype.isType = function (name) {
    return !!name.match(new RegExp("^bytes" + this.size.toString() + "(\\\[([0-9]*)\\\])*$"));
};

SolidityTypeBytes.prototype.staticPartLength = function (name) {
    return 32;
};



module.exports = SolidityTypeBytes;
