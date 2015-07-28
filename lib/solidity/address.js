var f = require('./formatters');
var SolidityType = require('./type');

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

SolidityTypeAddress.prototype.formatOutput = function (param, unused, name) {
    if (this.isStaticArray(name)) {
        var staticPart = param.staticPart();
        var result = [];
        for (var i = 0; i < staticPart.length; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(staticPart.substr(0, i + 64))));
        } 
        return result;
    } else if (this.isDynamicArray(name)) {
        var dynamicPart = param.dynamicPart();
        var result = [];
        // first position of dynamic part is the length of the array
        var length = new BigNumber(param.dynamicPart().slice(0, 64), 16);
        for (var i = 0; i < length * 64; i += 64) {
            result.push(this._outputFormatter(new SolidityParam(dynamicPart.substr(i + 64, 64))));
        }
        return result;
    }
    
    return this._outputFormatter(param);
};

module.exports = SolidityTypeAddress;
