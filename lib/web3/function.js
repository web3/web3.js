
var web3 = require('../web3');
var coder = require('../solidity/coder');
var utils = require('../utils/utils');

var SolidityFunction = function (json) {
    this._inputTypes = json.inputs.map(function (i) {
        return i.type;
    });
    this._outputTypes = json.outputs.map(function (i) {
        return i.type;
    });
    this._constant = json.constant;
    this._name = json.name;
};

SolidityFunction.prototype.signature = function () {
    return web3.sha3(web3.fromAscii(this._name)).slice(2, 10);
};

SolidityFunction.prototype.call = function (options) {
    return web3.eth.call(options);
};

SolidityFunction.prototype.sendTransaction = function (options) {
    web3.eth.sendTransaction(options);
};

SolidityFunction.prototype.displayName = function () {
    return utils.extractDisplayName(this._name);
};

SolidityFunction.prototype.typeName = function () {
    return utils.extractTypeName(this._name);
};

SolidityFunction.prototype.execute = function (contract) {
    var args = Array.prototype.slice.call(arguments, 1);
    var options = contract._options || {};
    options.to = contract.address;
    options.data = '0x' + this.signature() + coder.encodeParams(this._inputTypes, args);
    var transaction = contract._isTransaction === true || (contract._isTransaction !== false && !this._constant);

    //reset
    contract._options = {};
    contract._isTransaction = null;

    // send transaction
    if (transaction) {
        return this.sendTransaction(options);
    }

    // call
    var output = this.call(options); 
    return coder.decodeParams(this._outputTypes, output);
};

SolidityFunction.prototype.attachToContract = function (contract) {
    var execute = this.execute.bind(this, contract);
    var displayName = this.displayName();
    if (!contract[displayName]) {
        contract[displayName] = execute;
    }
    contract[displayName][this.typeName()] = this.execute.bind(this, contract);
};

module.exports = SolidityFunction;

