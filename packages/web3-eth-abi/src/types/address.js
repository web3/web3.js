var f = require('../formatters');
var formatters = require('web3-core-helpers').formatters;
var SolidityType = require('../type');

/**
 * SolidityTypeAddress is a protoype that represents address type
 * It matches:
 * address
 * address[]
 * address[4]
 * address[][]
 * address[3][]
 * address[][6][], ...
 */
var SolidityTypeAddress = function () {
    this._inputFormatter = function(){
        var args = Array.prototype.slice.call(arguments);
        args[0] = (!args[0] || args[0] === '0x0') ? '' : formatters.inputAddressFormatter(args[0]);
        return f.formatInputInt.apply(this, args);
    };
    this._outputFormatter = f.formatOutputAddress;
};

SolidityTypeAddress.prototype = new SolidityType({});
SolidityTypeAddress.prototype.constructor = SolidityTypeAddress;

SolidityTypeAddress.prototype.isType = function (name) {
    return !!name.match(/address(\[([0-9]*)\])?/);
};

module.exports = SolidityTypeAddress;
