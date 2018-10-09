/*
    this file is for true beta.
*/
"use strict";
var core = require('webtrue-core');
var Method = require('webtrue-etrue-core-method');
var utils = require('webtrue-utils');
var helpers = require('webtrue-core-helpers');

var formatter = helpers.formatters;

var ETrue = function ETrue(){
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    var defaultAccount = null;
    var defaultBlock = 'latest';

    Object.defineProperty(this, 'defaultAccount', {
        get: function () {
            return defaultAccount;
        },
        set: function (val) {
            if(val) {
                defaultAccount = utils.toChecksumAddress(formatter.inputAddressFormatter(val));
            }

            
            // update defaultBlock
            methods.forEach(function(method) {
                method.defaultAccount = defaultAccount;
            });

            return val;
        },
        enumerable: true
    });
    Object.defineProperty(this, 'defaultBlock', {
        get: function () {
            return defaultBlock;
        },
        set: function (val) {
            defaultBlock = val;
            

            // update defaultBlock
            methods.forEach(function(method) {
                method.defaultBlock = defaultBlock;
            });

            return val;
        },
        enumerable: true
    });

    this.clearSubscriptions = _this._requestManager.clearSubscriptions;

    var self = this;

    var methods = [
        new Method({
            name: 'getNodeInfo',
            call: 'web3_clientVersion'
        }),
        new Method({
            name: 'getProtocolVersion',
            call: 'eth_protocolVersion',
            params: 0
        }),
        new Method({
            name: 'getBalance',
            call: 'etrue_getBalance',
            params: 2,
            inputFormatter: [formatter.inputAddressFormatter, formatter.inputDefaultBlockNumberFormatter],
            outputFormatter: formatter.outputBigNumberFormatter
        })
    ]

    // 把以上方法追加绑定到this示例上
    methods.forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager, _this.accounts); // second param means is eth.accounts (necessary for wallet signing)
        method.defaultBlock = _this.defaultBlock;
        method.defaultAccount = _this.defaultAccount;
    });
}

core.addProviders(ETrue);


module.exports = ETrue;