
var MethodsProxy = require('web3-eth-contract').MethodsProxy;

function ContractMethodsProxy() {
    MethodsProxy.call(this, );
}

ContractMethodsProxy.prototype.proxyHandler = function(target, name) {
  // overwrite method because of namehash
};

ContractMethodsProxy.prototype = Object.create(MethodsProxy);
ContractMethodsProxy.prototype.constructor = ContractMethodsProxy;
